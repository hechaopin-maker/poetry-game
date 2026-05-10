# Proposal: 修复答案验证误判

## 问题

用户在诗词消消乐、点字成诗、填空、飞花令等多个游戏模式中，正确回答被判定为错误。经全量代码审计（27 JS 文件）定位到以下根因：

### 具体 Bug（7个）

**B1 (BLOCKING)**: `match.js:94` 正则误删常用汉字
```javascript
// 正则中包含 可件条和与及等 7 个常用汉字，被误当作标点删除
/[，。！？""''【】（）可件条和与及等、：；,\.!?]/g
```
4089 行诗词受影响。「可怜长皱」→「怜长皱」。

**B2 (BLOCKING)**: `match.js:227` 重复字去选 bug
```javascript
matchState.selectedChars = matchState.selectedChars.filter(c => c.char !== char);
```
`filter` 移除所有匹配字符。答案含重复字（如「处处」）时，去选一个全丢。

**B3**: `game-core.js:244-287` 填空验证缺繁简转换 — 4 处比较均无 `toSimplified()`。

**B4**: `game-core.js:247` `includes` 校验过于宽松 — `correctAns.includes(userAns)` 输部分即判对。

**B5**: `feihua.js:383` `cleanText` 无 `toSimplified()` — 飞花令缺繁简转换。

**B6**: `feihua.js:395-440` 4 处答案比对用内联正则，不用统一函数。

**B7**: `feihua_loader.js:22,74,207` 数据加载层也无繁简转换。

### 架构根因（4个）

**A1**: `PUNCTUATION_RE` 常量已定义但**无人使用**，三个模块各自写自己的正则。
**A2**: `cleanPunctuation()` 工具函数存在但**无人调用**。
**A3**: `TRAD_TO_SIMP` 映射表仅 ~100 字，不足以覆盖全唐诗宋词。
**A4**: 三个模块共 6 种不同的正则变体，各自实现答案清理逻辑。

## 解决方案

**策略：收拢到一个统一入口，而非逐个打补丁。**

```
所有答案验证 → normalizeAnswer(str) → toSimplified() + PUNCTUATION_RE
```

1. `utils.js`：新增 `normalizeAnswer()`，扩充 `TRAD_TO_SIMP` 映射表
2. `match.js`：修复正则 + 去选 + 改用 `normalizeAnswer`
3. `game-core.js`：4 处内联正则 → `normalizeAnswer` + 精确匹配
4. `feihua.js`：`cleanText` → `normalizeAnswer`，5 处统一
5. `feihua_loader.js`：数据加载时统一繁简转换

## 影响范围

| 文件 | 改动点 | 类型 |
|------|--------|------|
| `源码/js/utils.js` | 新增 `normalizeAnswer` + 扩充 `TRAD_TO_SIMP` | 新增 |
| `源码/js/match.js` | `generateMatchQuestions` 正则 + `selectJiugongChar` 去选 + `submitDianziAnswer`/`checkMatchAnswer` 统一 | 修复 |
| `源码/js/game-core.js` | `submitFillAnswer` 4 处正则替换 + `includes` → 精确匹配 | 修复 |
| `源码/js/feihua.js` | `cleanText` → `normalizeAnswer` + 5 处正则替换 | 修复 |
| `源码/js/feihua_loader.js` | 3 处数据加载正则替换 | 修复 |

## Non-Goals

- 不改 POEMS_DATA / QUESTIONS_DATA 数据结构
- 不新增游戏模式
- 不重构匹配引擎架构
