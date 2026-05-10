// ==================== IndexedDB 缓存层 ====================

const DB_NAME = 'poetry-game';
const DB_VERSION = 1;
const STORE_NAME = 'cache';

let dbInstance = null;

function openDB() {
    return new Promise((resolve, reject) => {
        if (dbInstance) { resolve(dbInstance); return; }

        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => { dbInstance = request.result; resolve(dbInstance); };
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
    });
}

async function dbGet(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

async function dbSet(key, value) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

async function dbDelete(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}

// 带版本号的缓存读写
function cacheKey(baseKey) {
    return `${baseKey}_v${DATA_VERSION}`;
}

async function cacheGet(baseKey) {
    try {
        return await dbGet(cacheKey(baseKey));
    } catch (e) {
        console.warn('Cache read failed:', e.message);
        return undefined;
    }
}

async function cacheSet(baseKey, value) {
    try {
        await dbSet(cacheKey(baseKey), value);
    } catch (e) {
        console.warn('Cache write failed:', e.message);
    }
}

async function cacheClear() {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.clear();
            req.onsuccess = () => resolve();
            req.onerror = () => reject(req.error);
        });
    } catch (e) {
        console.warn('Cache clear failed:', e.message);
    }
}

// 导出
window.dbGet = dbGet;
window.dbSet = dbSet;
window.dbDelete = dbDelete;
window.cacheGet = cacheGet;
window.cacheSet = cacheSet;
window.cacheClear = cacheClear;
