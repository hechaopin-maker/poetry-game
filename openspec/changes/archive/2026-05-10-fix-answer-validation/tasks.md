# Tasks: 答案验证修复

## Task 1: 扩充 TRAD_TO_SIMP + 新增 normalizeAnswer
- 文件: `源码/js/constants.js`、`源码/js/utils.js`
- `constants.js`：TRAD_TO_SIMP 扩充到 500+ 字
- `utils.js`：新增 `normalizeAnswer(str)` → `toSimplified(str).replace(PUNCTUATION_RE, '')`

## Task 2: 修复 match.js（正则 + 去选 + 统一）
- 文件: `源码/js/match.js`
- `generateMatchQuestions` 正则改用 `normalizeAnswer`
- `selectJiugongChar` 去选用 element 引用匹配
- `submitDianziAnswer`/`checkMatchAnswer` 比较前用 `normalizeAnswer`

## Task 3: 修复 game-core.js（填空验证统一 + 精确匹配）
- 文件: `源码/js/game-core.js`
- `submitFillAnswer` 4 处内联正则 → `normalizeAnswer`
- `includes` 宽松校验 → 精确匹配

## Task 4: 修复 feihua.js（飞花令统一）
- 文件: `源码/js/feihua.js`
- `cleanText` 内联函数 → `normalizeAnswer`
- 5 处正则替换为 `normalizeAnswer`

## Task 5: 修复 feihua_loader.js（数据加载层统一）
- 文件: `源码/data/feihua_loader.js`
- 3 处数据清理正则 → `normalizeAnswer`

## Task 6: 验证 + 回归测试
- 运行现有测试套件
- JS 语法检查全部文件
- 浏览器手动验证：消消乐含「可」字诗句、重复字去选、填空繁简、飞花令繁简
