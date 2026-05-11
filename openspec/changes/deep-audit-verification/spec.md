# M1: 需求澄清 — 古诗词游戏深度无死角审计验证

## 变更名称
`deep-audit-verification`

## 目标
对古诗词游戏（poetry-game）进行全量深度审计，发现并修复所有功能缺陷、UI问题、边界case和代码质量问题。

## 审计范围

### A. 全量 JS 代码审计（19 个模块）
| 文件 | 大小 | 审计重点 |
|------|------|---------|
| game-core.js | 23KB | 答案校验逻辑、normalizeAnswer、题型处理、连击/计分 |
| feihua.js | 34KB | 飞花令全流程、数据加载、超时/跳过/成功/失败 |
| match.js | 20KB | 消消乐消除逻辑、匹配验证、得分 |
| dict.js | 20KB | 搜索逻辑、结果渲染、拼音索引 |
| user.js | 12KB | 登录/切换/删除、localStorage、数据迁移 |
| ranking.js | 7KB | 排行榜计算、展示 |
| achievements.js | 7KB | 成就触发、展示 |
| wrong-notes.js | 8KB | 错题记录、复习、去重 |
| app.js | 2KB | 入口初始化、事件绑定 |
| constants.js | 5KB | GRADE_LEVELS、TRAD_TO_SIMP、常量 |
| db.js | 3KB | IndexedDB 操作 |
| state.js | 0.5KB | 全局状态 |
| ui.js | 1KB | UI 工具函数 |
| utils.js | 3KB | normalizeAnswer、工具函数 |
| menu.js | 0.3KB | 菜单 |
| navigation.js | 0.3KB | 页面导航 |

### B. 全游戏模式功能验证
1. **诗词闯关** — 所有5个年级(x5题)，覆盖全部5种题型(choice/fill/order/match/interpret)，正确/错误/跳过流程，结果页
2. **每日挑战** — 完整10题流程，结果页
3. **飞花令** — 挑战模式(正确/错误/跳过/超时/完成)，学习模式，模式切换，下一轮衔接
4. **诗词消消乐** — 消除交互，正确/错误匹配，完成判定
5. **诗词词典** — 搜索(精确/模糊/拼音)，结果准确性
6. **错题本** — 错题记录正确性，复习模式

### C. UI/UX 审计
- 阴影效果（CSS变量自引用检查）
- 水墨风格一致性
- 按钮样式统一性
- 弹窗/提示布局
- 响应式适配（手机/平板）
- 字体渲染
- 颜色方案

### D. 数据安全
- localStorage try/catch
- XSS 防护（innerHTML 使用点）
- 数据版本迁移

### E. 无障碍
- prefers-reduced-motion
- ARIA 属性
- 键盘导航

### F. 边界case
- 用户切换/删除
- 数据为空时的表现
- 网络异常（script 加载失败）
- 题库耗尽

## 验收标准
- E2E 测试 100% 覆盖所有游戏模式的所有交互路径
- 所有发现的bug有修复commit
- 追溯矩阵全部 PASS
- 飞花令"查看答案"布局问题已修复（done: 1f4ab65）

## M1 产出
- 本 spec.md
- 下一步 M2: 启动并行 Agent 全量审计，产出审计报告 → plan-ready.md
