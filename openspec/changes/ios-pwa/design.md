# Design: iOS PWA 化

## 架构概览

```
poetry-game/
├── index.html          ← 新增: <link rel="manifest">, iOS meta tags, SW 注册脚本
├── manifest.json       ← 新增: PWA manifest
├── sw.js              ← 新增: Service Worker (缓存策略)
├── icons/
│   ├── icon-192.png   ← 新增: 192×192 图标
│   ├── icon-512.png   ← 新增: 512×512 图标
│   └── apple-icon.png ← 新增: 180×180 Apple 专用图标
├── offline.html       ← 新增: 离线友好提示页 (可选，SW 内联处理)
├── js/                ← 不变
├── data/              ← 不变
└── index.html         ← 变更: 仅新增 <head> 内容和 SW 注册
```

## 技术方案

### 1. manifest.json
```json
{
  "name": "古诗词大挑战",
  "short_name": "古诗词",
  "description": "古诗词答题游戏 — 选择题、填空题、飞花令、九宫格、诗词配对、成语接龙",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f4efe6",
  "theme_color": "#2c2c2c",
  "orientation": "portrait",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### 2. Service Worker 缓存策略

**双层缓存架构**：
- **Precache (install 事件)**：App Shell — index.html, js/*, 图标, manifest
- **Runtime Cache (fetch 事件)**：数据文件按需缓存，SWR 策略

**缓存名单**：
```
# App Shell (install 时缓存)
/index.html
/js/*.js           (所有游戏逻辑模块)
/manifest.json
/icons/*.png
https://fonts.googleapis.com/css2?family=Noto+Serif+SC...

# Runtime (首次访问时缓存，后续 SWR)
/data/*.js         (飞花令数据-浏览器端)
/data/*.json       (诗词数据-按需)
```

**关键决策：数据文件不预缓存**
- data/ 目录 35MB+，预缓存会阻塞 SW 安装
- 采用 runtime SWR：第一次在线访问后自动缓存，下次离线可用
- 离线时游戏核心（选择题、填空）仍可运行（题目在 js/questions.js 内）

### 3. iOS 专属优化

```html
<!-- iOS 全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="古诗词大挑战">

<!-- 启动画面 (iOS Safari) -->
<link rel="apple-touch-startup-image" href="/icons/apple-launch.png">

<!-- 图标 -->
<link rel="apple-touch-icon" href="/icons/apple-icon.png">

<!-- 禁用缩放 (PWA 模式) -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 4. SW 注册与生命周期

```js
// index.html 内联脚本
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.log('SW failed:', err));
  });
}
```

**更新策略**：
- SW 文件变化 → 触发 install → activate → 接管页面
- `skipWaiting()` + `clientsClaim()` 确保新 SW 立即生效
- 检测到新版本时提示用户刷新（非强制）

### 5. 离线体验

**断网检测**：
- SW `fetch` 事件拦截，缓存命中 → 返回缓存
- 缓存未命中 → 返回 `/offline.html`（内联在 SW 中的离线 fallback）
- UI 层：`navigator.onLine` + `online/offline` 事件 → 顶部横幅提示

## 不变更内容
- 所有游戏逻辑（js/ 下 14 个模块）— 不动
- 数据文件（data/ 下）— 不动
- HTML 游戏页面结构 — 不动
- Cloudflare Pages 部署 — 不动

## 新增依赖
- 无。纯 Web 平台 API，零 npm 依赖。

## 浏览器兼容性
| 功能 | Safari iOS 16.4+ | Safari iOS 15.x | Chrome Android |
|------|-----------------|-----------------|----------------|
| PWA 安装 | 完全支持 | 部分（无推送） | 完全支持 |
| Service Worker | 支持 | 支持 | 支持 |
| manifest.json | 支持 | 部分 | 完全支持 |
| 离线缓存 | 支持 | 支持 | 支持 |
