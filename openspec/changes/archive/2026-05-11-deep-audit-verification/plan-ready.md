# M2: 规格锁定 — 古诗词游戏深度无死角审计 plan-ready.md

## 审计汇总

4 并行 Agent 全量审计完成，覆盖 19 JS 模块 + 17 数据文件 + HTML/CSS/UI + 6 游戏模式。

| 来源 | 范围 | P0 | P1 | P2 | P3 |
|------|------|----|----|----|-----|
| Agent 1: 游戏逻辑/边界 | feihua.js, game-core.js, match.js, wrong-notes.js | 6 | 9 | 6 | 0 |
| Agent 2: HTML/CSS/UI/无障碍 | index.html, CSS, 响应式 | 0 | 4 | 6 | 0 |
| Agent 3: JS 代码质量 | 全 19 模块 | 1 | 4 | 8 | 0 |
| Agent 4: 数据质量 | data/* (17 files, 35.5MB) | 3 | 4 | 14 | 5 |
| **合计** | | **10** | **21** | **34** | **5** |

> 注: Agent 2 的 P0 (--shadow 自引用、/button> 错误、ck; } 残骸) 经代码验证已在 poetry-game 中不存在——系 idiom-game 的审计发现被误带入。poetry-game 的 CSS 变量 line 30 为 `--shadow: rgba(0, 0, 0, 0.08);` 已正确。

---

## P0 关键 Bug（10 个，阻止上线）

### P0-1: feihua.js 重复属性名导致运行时数据丢失
- **文件**: `data/feihua.js` L146/L1286, L1193/L1706, L2059/L2179
- **根因**: JS 对象字面量中重复属性名，后者覆盖前者
- **影响**: 
  - `jiu`(酒): L1286 覆盖 L146，丢失 "明月几时有，把酒问青天"
  - `yan2`(雁): L1706 覆盖 L1193，丢失 "月黑雁飞高，单于夜遁逃"（卢纶·塞下曲）
  - `er`(儿): L2179 覆盖 L2059，丢失第一批 "儿" 字诗句
- **修复**: 合并重复属性——将 lines 数组合并到第一个出现处，删除第二个定义

### P0-2: match.js XSS — onclick 属性注入
- **文件**: `js/match.js` L189, L215
- **代码**: `onclick="selectJiugongChar(this, '${char}')"`
- **根因**: `char` 来自诗词数据，若含单引号则注入 JS
- **修复**: 改用 data-char 属性 + addEventListener，或对 char 做 `replace(/'/g, "\\'")`

### P0-3: wrong-notes.js XSS — onclick 属性注入
- **文件**: `js/wrong-notes.js` L149
- **代码**: `onclick="startWeakPointTraining('${s.name}')"`
- **根因**: `s.name` 是知识点名称，来自题库数据，可含特殊字符
- **修复**: 改用 data 属性 + addEventListener

### P0-4: game-core.js 填空答案校验过松
- **文件**: `js/game-core.js` L247, L287
- **代码**: `correctAns.includes(userAns) || userAns.includes(correctAns)`
- **根因**: 单字 "花" 会匹配 "花落知多少"（substring 关系而非相等）
- **修复**: 改为精确匹配 `userAns === correctAns`，或至少要求 userAns 长度 ≥ correctAns 的 80%

### P0-5: game-core.js totalCount 重复累加
- **文件**: `js/game-core.js` L363, L408, L586
- **根因**: `skipAndShowAnswer()` 直接 `totalCount++`(L363/L408)，`endGame()` 又 `user.totalCount += total`(L586)，导致跳过和答错的题目被计数 2 次
- **修复**: 删除 L363/L408 的直接 `totalCount++`，统一在 endGame 中累加
  ```js
  // Before (L363):  gameState.currentUser.totalCount++;
  // After: 删除此行
  // Before (L408):  gameState.currentUser.totalCount++;
  // After: 删除此行
  ```

### P0-6: feihua.js XP 跨轮次累加导致双倍计算
- **文件**: `js/feihua.js` L593, L708, L773
- **根因**: `feihuaState.score` 在每道题正确后累加（L470），轮次结束时又 `xp += score`（L593/L708/L773）。下一轮 score 不清零，导致 XP 被重复累加
- **修复**: 在每轮结束时 `xp += score` 后立即 `feihuaState.score = 0`，或在 startFeihuaGame 中清零 score

### P0-7: user.js checkStorageQuota 在 null 值上崩溃
- **文件**: `js/user.js` L83-84
- **代码**: `const value = localStorage.getItem(key); used += (key.length + value.length) * 2;`
- **根因**: `localStorage.getItem(key)` 在 key 不存在时返回 `null`，`.length` 在 null 上报 TypeError
- **修复**: 加空值保护
  ```js
  const value = localStorage.getItem(key);
  if (value !== null) used += (key.length + value.length) * 2;
  ```

### P0-8: feihua.js Enter 键 {once:true} 失效
- **文件**: `js/feihua.js` L359
- **根因**: `input.addEventListener('keydown', function(e) {...}, {once: true})` — 用户第一次按 Enter 后监听器被移除，后续无法再通过 Enter 提交
- **修复**: 移除 `{once: true}` 选项，改为在函数内判断 `feihuaState.isPlaying` 状态

### P0-9: match.js 九宫格截断导致谜题无解
- **文件**: `js/match.js` L189-215 区域
- **根因**: 当诗词原文 >9 字时，九宫格截断只取前 9 字，但答案字可能在后半部分被丢弃
- **修复**: 确保答案中的每个字都出现在九宫格中，使用包含答案字的 9 字子集而非简单截断

### P0-10: feihua.js 成功→自动推进竞态条件
- **文件**: `js/feihua.js` L650, L658
- **根因**: 答对后 `showFeihuaCorrect()` 显示反馈（L650），1.5s 后 `startNextFeihuaRound()` 自动推进（L658）。若用户在此期间手动点击"提交"按钮，会触发重复的 `submitFeihuaAnswerByInput()` 调用——input 已更新但状态机未锁
- **修复**: 在 `showFeihuaCorrect()` 中设置 `feihuaState.isPlaying = false` 防止二次提交，`startNextFeihuaRound()` 中恢复

---

## P1 高优先级（21 个，应尽快修复）

### 代码逻辑

| ID | 文件 | 行号 | 问题 | 修复 |
|----|------|------|------|------|
| P1-1 | `js/user.js` | ~195, ~217 | localStorage JSON.parse 无 try/catch，损坏数据导致白屏 | 包裹 try/catch，失败返回默认值 |
| P1-2 | `js/match.js` | ~504 | `matchState.timer` 从未启动（`setInterval` 缺失），计时功能死代码 | 在 `startMatch()` 中添加 `setInterval` 启动计时 |
| P1-3 | `js/wrong-notes.js` | submitWeakPointAnswer | 弱项训练用严格匹配，game-core 用松散匹配，验证不一致 | 统一使用 normalizeAnswer + 精确匹配 |
| P1-4 | `js/game-core.js` | L619 | `PASS_SCORE` 常量存在但未使用，硬编码 `>= 80` | 改用 `PASS_SCORE` 常量 |
| P1-5 | `js/utils.js` | L38, L61 | `calculateScore()` 和 `escapeHtml()` 定义但从未被调用 | 删除死代码，或在 game-core.js 中接入 calculateScore |
| P1-6 | `js/feihua.js` | L296, L312 | `timeLeft=50` 但定时器在 `<=60` 时就标红——从第 1 秒起就红 | 改 `<=60` 为 `<=10` 或 `timeLeft <= 60` 改为百分比 |
| P1-7 | `js/feihua.js` | L160 | `pickNextFeihuaKeyword()` 只过滤新格式数据，旧格式被跳过 | 兼容两种数据格式 |
| P1-8 | `js/navigation.js` | L4 | `showPage()` 无 null 检查——传入不存在的 pageId 时崩溃 | 添加 `if (!el) return;` |
| P1-9 | `js/game-core.js` | L382, L471 | `parseInt(opt.dataset.index)` 无 radix 参数 | 改为 `parseInt(..., 10)` |
| P1-10 | `js/game-core.js` | 多处 | 3 处 ~100 行几乎相同的反馈 HTML 构建代码 | 提取公共函数 `buildFeedbackHTML(question, isCorrect, userAnswer)` |

### 数据质量

| ID | 文件 | 问题 | 修复方案 |
|----|------|------|---------|
| P1-11 | `data/tang_001.json` 等 | 唐诗 88.7% 缺 interpretation，宋诗 99.98% 缺 | 数据补充（长期），短期：前端 graceful fallback |
| P1-12 | `data/tang_002.json` | 全部 576 首诗使用 UUID ID，与 poem_xxx 序号 ID 混合 | 统一 ID 格式，或确保两种都能被正确引用 |
| P1-13 | `data/questions.js` | 189 题 poemId=null，无法关联诗歌原文进行答案验证 | 补充 poemId 引用 |
| P1-14 | `data/feihua_loader.js` | `loadFeihuaExpandedData()` 无超时保护，13MB 脚本加载可能挂死 | 添加 AbortController + 30s 超时 |

### UI/UX

| ID | 文件 | 行号 | 问题 | 修复 |
|----|------|------|------|------|
| P1-15 | `index.html` | L1469, L1499 | 页面 ID `wrongPage`/`achievementPage` 与 JS 可能期望的 `wrongNotesPage`/`achievementsPage` 不一致 | 统一 ID（先确认 JS 实际引用） |
| P1-16 | `index.html` | 全页 | 零 ARIA 属性：无 role/aria-label/aria-live | 为关键交互元素添加最小化 ARIA |
| P1-17 | `index.html` | CSS | 无 `:focus` / `:focus-visible` 样式 | 添加焦点轮廓样式 |
| P1-18 | `index.html` | CSS | `.game-container` 通过 `@supports` 选择器引用但 HTML 中不存在 | 修复选择器或删除 |
| P1-19 | `js/feihua_loader.js` | L218 | `validateFeihuaAnswer` 备选路径对每个条目 `JSON.parse(p)`——O(n) 解析开销 | 预先将 Set<String> 改为 Set<Object> 避免重复解析 |
| P1-20 | `js/match.js` | ~118 | 中国语变量名 `游戏模式`、`目标字数` 在生产代码中 | 改为英文 `gameMode`、`targetChars` |
| P1-21 | `js/match.js` | 九宫格 UI | 选中的字不显示（`selectedCharsDisplay` 被隐藏）——用户看到空白反馈 | 确保选中字符可见 |

---

## P2 中优先级（34 个，发布前修复）

### 代码质量

| ID | 文件 | 问题 |
|----|------|------|
| P2-1 | `js/match.js` | `Math.random() - 0.5` biased shuffle → 用 Fisher-Yates |
| P2-2 | `js/match.js` | Combo 上限不一致：消消乐 +10 vs 闯关 +20 |
| P2-3 | `js/match.js` | 答案清洗正则与 PUNCTUATION_RE 不同，额外删除了 "可件条和与及等" 字符 |
| P2-4 | `js/game-core.js` | 15+ `getElementById` 无空值检查 |
| P2-5 | `js/game-core.js` | `handleMatchCorrect` 无法通过 QUESTIONS_DATA 追踪掌握度（ID 格式 mismatch `poem_X_Y`） |
| P2-6 | `js/user.js` | `showLoginModal`、`updateUserDisplay` 中 getElementById 无保护 |
| P2-7 | `data/poems_loader.js` | 8 个 JSON 文件顺序 fetch（可并行），无超时 |
| P2-8 | `data/poems_loader.js` | `typeof cacheGet === 'function'` 检查不充分——函数存在但抛异常则无降级 |
| P2-9 | `data/feihua_loader.js` | 若 `FEIHUA_FULL_DATA` 未定义，静默返回 false 无警告 |
| P2-10 | `data/feihua_loader.js` | Set 序列化存 IndexedDB 但读取路径缺少从数组重建 Set 的逻辑 |

### CSS/UI

| ID | 文件 | 问题 |
|----|------|------|
| P2-11 | `index.html` | 49 处 inline style，硬编码颜色值 |
| P2-12 | `index.html` | `.btn-primary`、`.btn-small`、`.dict-list`、`.user-avatar` CSS 类未定义 |
| P2-13 | `index.html` | `.bottom-nav` 孤儿 CSS 从未被使用 |
| P2-14 | `index.html` | 无 `prefers-reduced-motion` 媒体查询 |
| P2-15 | `index.html` | border-radius 不一致（4px/8px/10px/12px 混用） |
| P2-16 | `index.html` | 多处硬编码字体大小，应改用 CSS 变量或相对单位 |

### 数据质量

| ID | 文件 | 问题 |
|----|------|------|
| P2-17 | `data/questions.js` | 1096/1299 (84.4%) 题目 difficulty=2 → 压缩至单一级别 |
| P2-18 | `data/questions.js` | 1041/1299 (80.1%) 填空题为 `options: []` |
| P2-19 | `data/questions.js` | 答案格式不一致：40 题 "A．" 前缀、51 题简单 A-D 字母、1208 题自由文本 |
| P2-20 | `data/questions.js` | 258 道选择题中仅 84 道有 `correct: true/false` 标记 |
| P2-21 | `data/questions.js` | 285 题 `poetryType: false`，0 题 `poetryType: true` → 字段无意义 |
| P2-22 | `data/tang_001.json` | 作者名用繁体（張籍→张籍，趙嘏→赵嘏），与宋诗/补充诗简体不一致 |
| P2-23 | `data/supplement.json` | 105/356 (29.5%) 缺 `source` 字段 |
| P2-24 | `data/all JSON` | 25451/26429 (96.3%) 诗 difficulty=1 → 难度字段几乎未设置 |
| P2-25 | `data/tang_001.json` | poem_004 在 tang_001 缺失但出现在 song_001 → ID 跨越文件 |
| P2-26 | `data/other_001.json` | 仅 1 首诗 (684 bytes)，含汉代作品但标为 "other" |
| P2-27 | `data/deleted_ids.txt` | 698 个已删除 ID 无注释/元数据 |
| P2-28 | `data/feihua_expanded.js` | 声称为 v10.0/26429 首诗，但 `feihua_full.js` 声称为 v8.0/26221 首 → 版本不一致 |

### 边界/性能

| ID | 文件 | 问题 |
|----|------|------|
| P2-29 | `js/wrong-notes.js` | 复习可能引用已删除的题目 ID |
| P2-30 | `js/dict.js` | 搜索结果渲染可能存在大量 DOM 操作时的性能问题 |
| P2-31 | `data/feihua.js` | 21 个汉字在多个关键字分组中重复出现 |
| P2-32 | `js/feihua.js` | `loadFeihuaExpandedData` 通过动态 `<script>` 注入 13MB 数据，阻塞 DOM 解析 |
| P2-33 | `js/user.js` | 数据迁移逻辑 (v1→v2) 未被测试覆盖 |
| P2-34 | `js/state.js` | 全局状态对象无类型定义或 JSDoc 注释 |

---

## P3 改进建议（5 个）

| ID | 文件 | 问题 |
|----|------|------|
| P3-1 | `data/feihua.js` | 部分关键字价值存疑（瓦、亩、丛、厚、薄） |
| P3-2 | `data/feihua_full.js` vs `feihua_expanded.js` | 版本号不一致 |
| P3-3 | `data/feihua_loader.js` | Set 序列化存 IndexedDB 缓存，读取路径重建逻辑缺失 |
| P3-4 | `data/poems_loader.js` | 无并行加载优化，8 文件顺序 fetch |
| P3-5 | `js/` 全模块 | 缺少 JSDoc 类型注释 |

---

## 修复策略

### Phase A: P0 数据修复（不改 JS 逻辑）
1. `data/feihua.js`: 合并 3 对重复属性
2. 验证合并后数据完整性

### Phase B: P0 安全修复
3. `js/match.js`: XSS onclick → data 属性 + addEventListener
4. `js/wrong-notes.js`: XSS onclick → data 属性 + addEventListener

### Phase C: P0 逻辑修复
5. `js/game-core.js`: 答案校验过松 → 精确匹配
6. `js/game-core.js`: totalCount 双倍计数 → 删除重复累加
7. `js/feihua.js`: XP 双倍 → 清零 score
8. `js/feihua.js`: Enter 键 {once:true} → 移除
9. `js/feihua.js`: 竞态条件 → 状态锁
10. `js/user.js`: checkStorageQuota → 空值保护
11. `js/match.js`: 九宫格截断 → 确保答案字在格内

### Phase D: P1 修复
12-32. 按文件分组：utils.js → game-core.js → feihua.js → match.js → wrong-notes.js → user.js → navigation.js → index.html → feihua_loader.js → poems_loader.js

### Phase E: P2 修复
33-66. 代码质量 + CSS 清理 + 数据标注

### Phase F: 验证
67. 全量 E2E 测试 (36 cases) 重跑
68. 追溯矩阵全 PASS

---

## 涉及文件清单

| 文件 | P0 | P1 | P2 | 操作 |
|------|----|----|-----|------|
| `data/feihua.js` | 3 | 0 | 0 | 合并重复属性 |
| `js/match.js` | 2 | 3 | 4 | XSS+截断+timer+中文变量名 |
| `js/wrong-notes.js` | 1 | 1 | 1 | XSS+验证一致性+删除引用 |
| `js/game-core.js` | 2 | 3 | 3 | 匹配+计数+硬编码+parseInt+去重 |
| `js/feihua.js` | 3 | 3 | 1 | XP+Enter+竞态+timer+keyword+加载 |
| `js/user.js` | 1 | 1 | 1 | quota+parse+DOM保护 |
| `js/utils.js` | 0 | 1 | 0 | 死代码清理 |
| `js/navigation.js` | 0 | 1 | 0 | 空值保护 |
| `index.html` | 0 | 5 | 6 | ARIA+focus+ID+CSS清理 |
| `data/feihua_loader.js` | 0 | 2 | 2 | 超时+JSON.parse优化+警告 |
| `data/poems_loader.js` | 0 | 0 | 2 | 并行加载+错误处理 |
| `data/questions.js` | 0 | 1 | 5 | 数据标注（poemId/difficulty) |
| `data/tang_001.json` 等 | 0 | 2 | 5 | 繁体→简体+interpretation |
| **合计** | **10** | **21** | **34** | |

---

## 验收标准
- 10 个 P0 全部修复并验证
- 21 个 P1 至少修复 15 个
- E2E 36 test cases 重跑 100% PASS
- 语法检查 0 ERROR
- 追溯矩阵全部 PASS
- 飞花令"查看答案"布局回归验证通过

---

✅ M2 审批通过 — 规格锁定，进入版本冻结
下一步: M3: 执行就绪（创建 worktree + 按 Phase A-F 顺序执行）
