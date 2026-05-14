const CACHE_VERSION = 'poetry-game-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-icon.png',
];

// JS modules to precache — these are the core game engine
const JS_MODULES = [
  '/js/state.js',
  '/js/utils.js',
  '/js/ui.js',
  '/js/navigation.js',
  '/js/menu.js',
  '/js/db.js',
  '/js/user.js',
  '/js/constants.js',
  '/js/game-core.js',
  '/js/achievements.js',
  '/js/ranking.js',
  '/js/wrong-notes.js',
  '/js/feihua.js',
  '/js/match.js',
  '/js/dict.js',
];

// Google Fonts CSS (stale-while-revalidate at runtime)
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&family=Ma+Shan+Zheng&family=Zhi+Mang+Xing&display=swap';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      const toCache = [...PRECACHE_URLS, ...JS_MODULES];
      return Promise.allSettled(
        toCache.map(url =>
          cache.add(url).catch(err => {
            console.warn('SW: precache failed for', url, err.message);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // Same-origin only (let CDN/third-party go through browser)
  if (url.origin !== self.location.origin) {
    // Google Fonts: cache-first
    if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
      event.respondWith(cacheFirst(request));
    }
    return;
  }

  // Data files: network-first, fallback to cache
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Navigation requests: network-first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, offlineHTML()));
    return;
  }

  // Static assets: cache-first
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    return new Response('Resource unavailable offline', { status: 503 });
  }
}

async function networkFirst(request, fallback) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch (e) {
    const cached = await caches.match(request);
    return cached || fallback || new Response('Offline', { status: 503 });
  }
}

function offlineHTML() {
  return new Response(
    `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1.0">` +
    `<title>古诗词大挑战 - 离线</title><style>` +
    `body{font-family:'Noto Serif SC',serif;background:#f4efe6;display:flex;` +
    `align-items:center;justify-content:center;min-height:100vh;margin:0;}` +
    `.box{text-align:center;padding:40px;}` +
    `h1{color:#2c2c2c;font-size:1.5em;margin-bottom:12px;}` +
    `p{color:#8a8a8a;margin-bottom:24px;}` +
    `.hint{background:#faf8f3;border:1px solid #d5d0c8;padding:16px 24px;` +
    `border-radius:8px;font-size:0.9em;color:#a0a0a0;}` +
    `</style></head><body><div class="box">` +
    `<h1>📖 当前离线</h1>` +
    `<p>此页面需要网络连接才能首次加载</p>` +
    `<div class="hint">请连接网络后刷新页面<br>已缓存的游戏内容仍可在离线时使用</div>` +
    `</div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
