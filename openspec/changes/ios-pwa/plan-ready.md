# M2: 规格锁定 — iOS PWA 化 plan-ready.md

## 变更概览
将现有的古诗词大挑战 Web 应用改造为 iOS 可安装的 PWA，支持全屏、离线、主屏幕图标。

## 文件变更清单

| # | 文件 | 操作 | 预计行数 | 说明 |
|---|------|------|---------|------|
| 1 | `manifest.json` | 新增 | ~25 | PWA 应用清单 |
| 2 | `sw.js` | 新增 | ~120 | Service Worker 缓存策略 |
| 3 | `icons/icon-192.png` | 新增 | - | 192×192 图标（脚本生成） |
| 4 | `icons/icon-512.png` | 新增 | - | 512×512 图标（脚本生成） |
| 5 | `icons/apple-icon.png` | 新增 | - | 180×180 Apple 图标（脚本生成） |
| 6 | `generate-icons.js` | 新增 | ~60 | Playwright 图标生成脚本 |
| 7 | `index.html` | 修改 | +25 | head meta 标签 + SW 注册脚本 |

## 执行分步（Task List）

### Task 1: 图标生成 `generate-icons.js` + `icons/`
- 用 Playwright（已有依赖）打开临时 HTML canvas
- 绘制：米色背景 + 深墨色"诗"字（繁体书法感）
- 输出 192px、512px、180px 三张 PNG
- 验收：文件存在 + 分辨率正确

### Task 2: `manifest.json`
- name/short_name/description（中文）
- display: standalone + orientation: portrait
- theme_color/background_color 匹配现有 CSS 变量
- icons 数组注册两个尺寸

### Task 3: `sw.js` Service Worker
- `install`：预缓存 App Shell（index.html + js/* + 图标 + Google Fonts CDN）
- `activate`：清理旧缓存版本 + self.skipWaiting() + clientsClaim()
- `fetch`：
  - 静态 js/css/font → Cache-first
  - 数据 data/* → Network-first, fallback to cache
  - 导航请求 → Network-first, offline fallback HTML
- 版本号常量 CACHE_VERSION，变更时自动更新缓存

### Task 4: `index.html` 修改
- `<head>` 新增：
  - `<link rel="manifest" href="/manifest.json">`
  - `<meta name="apple-mobile-web-app-capable" content="yes">`
  - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
  - `<meta name="apple-mobile-web-app-title" content="古诗词">`
  - `<link rel="apple-touch-icon" href="/icons/apple-icon.png">`
  - `<meta name="theme-color" content="#2c2c2c">`
- `</body>` 前新增：
  - SW 注册 `<script>`（navigator.serviceWorker.register）
  - 离线检测 + 顶部横幅逻辑

### Task 5: 离线检测 UI 横幅
- 在 `<body>` 顶部新增一个隐藏 div `#offline-banner`
- `online/offline` 事件监听，切换显示/隐藏
- 样式复用现有 CSS 变量体系
- 离线文案："当前离线 — 已缓存内容仍可使用"
- 恢复在线时自动隐藏 + 自动尝试重新连接

### Task 6: 验证
- 语法检查（sw.js, manifest.json）
- Lighthouse PWA 审计
- 36 E2E 测试重跑确认零回归
- 手动验证：Safari → 添加到主屏幕 → 全屏 → 开飞行模式 → 游戏可用

## 不变更内容
- `js/` 下所有 14 个游戏模块
- `data/` 下所有数据文件
- `index.html` 中游戏页面结构、CSS、游戏逻辑
- Cloudflare Pages 部署配置

## 验收标准
1. `manifest.json` JSON 合法，Content-Type 正确
2. `sw.js` 语法合法，注册不报错
3. Lighthouse PWA 评分 ≥ 90
4. Safari iOS 可添加到主屏幕，全屏打开
5. 离线飞行模式下游戏核心模式可玩
6. 36 E2E case 全部 PASS
7. 图标所有尺寸清晰可用

## 风险缓解
- **SW 缓存过旧** → 版本号机制，每次部署自增 VERSION
- **图标生成失败** → Playwright 重试 + 验证输出分辨率
- **离线数据不全** → SWR 策略保证在线时自动补充缓存
- **iOS 版本兼容** → 渐进增强：老版本 iOS 降级为普通网页

---

✅ M2 审批通过 — 规格锁定，进入版本冻结
下一步: M3: 执行就绪（安装 sharp + 生成图标 + 按 Task 1→6 顺序执行）
