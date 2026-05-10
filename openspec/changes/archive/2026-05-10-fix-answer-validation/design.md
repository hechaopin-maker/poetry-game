# Design: 答案验证修复

## 架构

poetry-game 是纯前端单页应用，无构建工具。答案验证分散在三个模块中，各有自己的清理逻辑。修复策略是**收拢而非修补**：

```
修复前（6 种正则变体，各自为政）:
  match.js:        /[...可件条和与及等...]/g  + toSimplified
  game-core.js:    /[...""''（）...]/g         (无 toSimplified)
  feihua.js:       /[...\s...]/g             (无 toSimplified)
  feihua_loader:   /[...【】《》...]/g         (无 toSimplified)

修复后（单一入口）:
  所有模块 → normalizeAnswer(str) → toSimplified(str).replace(PUNCTUATION_RE, '')
```

## 技术决策

### 1. 统一清理函数 `normalizeAnswer`

在 `utils.js` 新增，集中处理繁简转换+标点清理：

```javascript
function normalizeAnswer(str) {
  if (!str || typeof str !== 'string') return '';
  return toSimplified(str).replace(PUNCTUATION_RE, '');
}
```

PUNCTUATION_RE 已有：`/[，。！？、；：""''（）\s]/g`

### 2. 正则修复 (match.js)

从 `generateMatchQuestions` 正则中移除 7 个误删汉字：

修复前：`/[，。！？""''【】（）可件条和与及等、：；,\.!?]/g`
修复后：使用 `PUNCTUATION_RE` 常量（`cleanPunctuation` 或 `normalizeAnswer`）

### 3. 去选逻辑修复 (match.js)

用 element 引用匹配替换字符值过滤：

```javascript
// 修复前
matchState.selectedChars = matchState.selectedChars.filter(c => c.char !== char);

// 修复后
const idx = matchState.selectedChars.findIndex(c => c.element === element);
if (idx !== -1) matchState.selectedChars.splice(idx, 1);
```

### 4. 填空精准匹配 (game-core.js)

`includes` → 精确匹配，同时用 `normalizeAnswer`：

```javascript
// 修复前
const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns))

// 修复后
const userAns = normalizeAnswer(userAnswers[i]);
const correctAns = normalizeAnswer(answerParts[i] || '');
if (userAns === correctAns)
```

### 5. 飞花令统一 (feihua.js)

`cleanText` 内联函数 → `normalizeAnswer`：

```javascript
// 修复前
const cleanText = (text) => text.replace(/[，。！？、；：""''（）\s]/g, '').toLowerCase();

// 修复后
// 直接使用 normalizeAnswer + toLowerCase
```

5 处 `userAnswer.replace(/[\s，。！？、；：""''（）]/g, '')` → `normalizeAnswer(userAnswer)`

### 6. 数据加载层 (feihua_loader.js)

3 处数据清理正则替换为 `normalizeAnswer`。

### 7. 扩充 TRAD_TO_SIMP

从 ~100 字扩充到覆盖《通用规范汉字表》中常见繁简对照（约 500 字），确保全唐诗宋词中的繁体字能被正确转换。

## 不变更

- POEMS_DATA / QUESTIONS_DATA 数据结构
- 用户数据存储格式
- UI 交互逻辑
- 评分/连击机制

## 风险

- 收窄 `includes` 可能让部分"近似正确"的答案变错 → 期望行为
- 扩充 `TRAD_TO_SIMP` 需确保映射准确 → 从《通用规范汉字表》提取
- 飞花令数据加载层改动影响全局 → 加载器在 `index.html` 中最先加载，需验证不破坏初始化
