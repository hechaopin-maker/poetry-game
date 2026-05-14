# Spec: iOS PWA 化

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `manifest.json` | **新增** | PWA 应用清单 |
| `sw.js` | **新增** | Service Worker + 缓存策略 |
| `icons/icon-192.png` | **新增** | 192×192 PWA 图标 |
| `icons/icon-512.png` | **新增** | 512×512 PWA 图标 |
| `icons/apple-icon.png` | **新增** | 180×180 Apple 专用图标 |
| `generate-icons.js` | **新增** | Node.js 图标生成脚本（canvas） |
| `index.html` | **修改** | 仅改 `<head>` + 底部加 SW 注册 |

## 详细规格

### Spec-1: manifest.json
- `name`: "古诗词大挑战"
- `short_name`: "古诗词"
- `display`: "standalone"（全屏无浏览器 chrome）
- `background_color`: "#f4efe6"（与 body bg 一致）
- `theme_color`: "#2c2c2c"（深色用于状态栏）
- `orientation`: "portrait"（竖屏游戏）
- `start_url`: "/"
- `scope`: "/"
- `icons`: 192px + 512px（maskable 适配）

### Spec-2: Service Worker (sw.js)
- **install 事件**: 预缓存 App Shell
  - `index.html`, `manifest.json`, `icons/*`
  - 跳过数据目录（35MB 太大）
  - 字体 CDN 资源（Noto Serif SC, Ma Shan Zheng, Zhi Mang Xing）
- **activate 事件**: 清理旧缓存, skipWaiting + clientsClaim
- **fetch 事件**: 
  - 静态资源 (js/css/fonts): Cache-first
  - 数据文件 (data/*.js, data/*.json): Network-first, fallback to cache
  - HTML: Network-first, fallback to cache
  - CDN 字体: Cache-first (不变更)
- **错误处理**: 所有 fetch 失败时有 graceful fallback

### Spec-3: iOS 专属标签
在 `<head>` 中新增：
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="古诗词">
<link rel="apple-touch-icon" href="/icons/apple-icon.png">
```

### Spec-4: 图标生成
- 使用 Node.js canvas 库生成图标
- 设计：米色背景 + 深墨色"诗"字书法体
- 192px, 512px, 180px 三个尺寸
- 运行 `node generate-icons.js` 生成

### Spec-5: 离线检测横幅
- 新增顶部离线提示条（初始隐藏）
- `navigator.onLine` + `online/offline` 事件
- 离线时显示："当前离线 — 已缓存内容仍可使用"
- 恢复在线时隐藏
- 不侵入现有 CSS 变量体系

### Spec-6: SW 注册
- index.html 底部 </body> 前注册
- 仅在 `'serviceWorker' in navigator` 时注册
- 错误时静默失败，不影响游戏运行
- 注册成功后监听更新，检测到新版 SW 时提示刷新

## 验收标准 (M5 验证用)
1. Lighthouse PWA 评分 ≥ 90
2. Safari iOS 打开 → 分享 → "添加到主屏幕" 成功
3. 安装后从主屏幕打开 → 全屏显示（无地址栏/工具栏）
4. 离线（开飞行模式）→ 打开 App → 游戏可玩
5. 在线更新 → 新版本自动生效
6. 现有 36 E2E 测试全 PASS（功能零回归）
7. manifest.json CORS/Content-Type 正确
8. 图标所有尺寸加载正常
