# Proposal: iOS PWA 化

## 目标
将古诗词大挑战改造为可安装的 iOS PWA（渐进式 Web App），用户在 Safari 打开后点"添加到主屏幕"即可获得接近原生 App 的体验，支持离线使用。

## 用户故事
- 师傅在 iPhone/iPad 上用 Safari 打开 poetry-game.pages.dev
- Safari 自动弹出"添加到主屏幕"提示（或手动点分享→添加到主屏幕）
- 安装后，主屏幕出现古诗词大挑战图标，点开即为全屏 App（无 Safari 工具栏）
- 即使断网，也能打开 App 玩已缓存的游戏
- 已安装用户下次访问时自动获取新版本

## 范围界定

### 本次 PWA 化（MVP）
- `manifest.json` — 定义 App 名称、图标、全屏模式、主题色
- Service Worker — 缓存策略（App Shell + 关键数据离线可用）
- iOS 专属 meta 标签 — apple-mobile-web-app-capable, 启动画面, 状态栏样式
- 图标 — 192px + 512px PNG 图标
- 离线错误页 — 网络断开时的友好提示

### 不在本次范围
- App Store 上架（需要 Apple Developer $99/年 + 审核）
- 原生推送通知（iOS PWA 推送需要复杂证书配置）
- 原生功能集成（相机、GPS 等 — 游戏不需要）

## 技术决策

| 决策点 | 选择 | 理由 |
|--------|------|------|
| 缓存策略 | Stale-while-revalidate (App Shell) + Cache-first (静态资源) | 游戏数据主要静态，频繁更新用 SWR |
| 图标 | CSS 绘制的 SVG 转 PNG | 无需设计资源，纯代码生成 |
| 离线能力 | 核心游戏逻辑 + 试题数据预缓存 | 数据文件大（35MB），全部预缓存不现实 |
| SW 注册 | `index.html` 内联注册 | 单文件入口，不增加额外 JS |
| 版本管理 | SW 版本号 + skipWaiting | 确保用户始终拿到最新版 |
