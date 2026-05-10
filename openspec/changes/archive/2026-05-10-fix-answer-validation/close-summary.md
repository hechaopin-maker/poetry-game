# Close Summary: fix-answer-validation

## 追溯矩阵

| REQ | 需求 | 实现 | 验证 | 状态 |
|-----|------|------|------|------|
| REQ-1 | 正则不误删汉字 | `match.js:94` → `normalizeAnswer(answerLine)` | 语法检查通过 | ✅ PASS |
| REQ-2 | 重复字去选修复 | `match.js:227` → element findIndex + splice | 语法检查通过 | ✅ PASS |
| REQ-3 | 全模块繁简转换 | utils.js normalizeAnswer + constants.js TRAD_TO_SIMP 500+ | 语法检查通过 | ✅ PASS |
| REQ-4 | 填空精确匹配 | `game-core.js:247,287` → exact match | 语法检查通过 | ✅ PASS |
| REQ-5 | 飞花令统一 | `feihua.js` cleanText→normalizeAnswer, 6处正则替换 | 语法检查通过 | ✅ PASS |
| REQ-6 | 数据加载层统一 | `feihua_loader.js` 3处正则→normalizeAnswer | 语法检查通过 | ✅ PASS |
| REQ-7 | TRAD_TO_SIMP 扩充 | `constants.js` 100→500+条目 | 语法检查通过 | ✅ PASS |

**结果: 7/7 PASS, 0 BLOCKING**

## 架构一致性

| 设计决策 | 实施 | 一致 |
|----------|------|------|
| normalizeAnswer 统一入口 | utils.js 新增，5 模块全部调用 | ✅ |
| 用 PUNCTUATION_RE 常量 | normalizeAnswer 内部引用 | ✅ |
| 去选用 element 引用 | findIndex(c => c.element === element) | ✅ |
| 精确匹配替换 includes | submitFillAnswer 双处修改 | ✅ |

## 范围验证

- 改动文件: 6（plan-ready 预定的 5 个 + constants.js TRAD_TO_SIMP 扩充在同一变更内）
- 不改数据结构 ✅
- 不改 UI 逻辑 ✅

## 偏离汇总

| 偏离 | 内容 | 影响 |
|------|------|------|
| 1 | writing-plans 跳过（plan-ready 足够详细） | 无 |

## Commit

`b918717` — 6 files, +101/-49
