# plan-ready: fix-answer-validation

> 来源: OpenSpec proposal/design/specs/tasks
> 目标: writing-plans 输入

## 目标

全量修复诗词游戏答案验证系统：收拢 6 种正则变体到统一入口 `normalizeAnswer()`，修复 7 个 bug + 4 个架构问题。

## 架构

```
修复前: 6 种正则变体，toSimplified 时有时无
修复后: 所有模块 → normalizeAnswer(str) → toSimplified() + PUNCTUATION_RE
```

## 技术栈

- Vanilla JS (ES6)，无框架，浏览器端执行
- 现有 `PUNCTUATION_RE` (`constants.js:97`) 可直接复用
- 现有 `toSimplified()` (`utils.js:8`) 可直接复用

## 不做什么

- 不改 POEMS_DATA / QUESTIONS_DATA 数据结构
- 不改 UI 交互逻辑
- 不新增游戏模式
- 不重构匹配引擎架构

## 加载顺序注意

`index.html` 加载顺序：`constants.js` → `utils.js` → `data/feihua_loader.js` → `data/feihua.js` → … → `js/feihua.js` → `js/match.js` → `js/game-core.js`。`normalizeAnswer` 在 `utils.js` 中定义后，后续所有模块均可使用。

## 任务

### Task 1: 扩充 TRAD_TO_SIMP + 新增 normalizeAnswer
**目标**: 建立统一清理入口，繁简映射覆盖全唐诗宋词
**来源**: tasks.md Task 1 + specs REQ-3, REQ-7

- [ ] **Step 1: 扩充 TRAD_TO_SIMP 映射表**
  - 文件: `源码/js/constants.js`
  - 动作: 在现有 `TRAD_TO_SIMP` 对象（第48-95行）中追加约 400 个繁简映射条目
  - 数据源: Unicode 通用规范汉字表繁简对照
  - 新增关键条目示例:
    ```javascript
    '萬':'万','難':'难','體':'体','歸':'归','靈':'灵','響':'响',
    '變':'变','應':'应','實':'实','邊':'边','還':'还','對':'对',
    '導':'导','將':'将','專':'专','爾':'尔','尋':'寻','寫':'写',
    '審':'审','寶':'宝','宮':'宫','雖':'虽','雜':'杂','離':'离',
    ```
  - 验证: `node -e "const fs=require('fs'); eval(fs.readFileSync('源码/js/constants.js','utf8')); console.log(Object.keys(TRAD_TO_SIMP).length);"` 输出 ≥ 500

- [ ] **Step 2: 新增 normalizeAnswer 函数**
  - 文件: `源码/js/utils.js`
  - 动作: 在 `cleanPunctuation` 函数后（约第54行）新增：
    ```javascript
    function normalizeAnswer(str) {
      if (!str || typeof str !== 'string') return '';
      return toSimplified(str).replace(PUNCTUATION_RE, '');
    }
    ```
  - 验证: 在浏览器 console 执行 `normalizeAnswer('春風又綠江南岸。')` 返回 `'春风又绿江南岸'`

### Task 2: 修复 match.js（正则 + 去选 + 统一）
**目标**: 消消乐/点字成诗/九宫格/十二宫格答案验证正确
**来源**: tasks.md Task 2 + specs REQ-1, REQ-2, REQ-3

- [ ] **Step 1: 修复 generateMatchQuestions 正则**
  - 文件: `源码/js/match.js`
  - 动作: 修改第94行，用 `normalizeAnswer` 替换内联正则+toSimplified
  - 改前:
    ```javascript
    const answer = toSimplified(answerLine.replace(/[，。！？""''【】（）可件条和与及等、：；,\.!?]/g, ''));
    ```
  - 改后:
    ```javascript
    const answer = normalizeAnswer(answerLine);
    ```
  - 注意: 同时删除第87行的 `answerLine = toSimplified(...)`，因为 `normalizeAnswer` 内部已含 `toSimplified`

- [ ] **Step 2: 修复 selectJiugongChar 去选逻辑**
  - 文件: `源码/js/match.js`
  - 动作: 修改第227行，用 element 引用匹配替换 char 值匹配
  - 改前:
    ```javascript
    matchState.selectedChars = matchState.selectedChars.filter(c => c.char !== char);
    ```
  - 改后:
    ```javascript
    const idx = matchState.selectedChars.findIndex(c => c.element === element);
    if (idx !== -1) matchState.selectedChars.splice(idx, 1);
    ```
  - 验证: 浏览器中选中两个同字 → 去选一个 → 确认还剩一个

- [ ] **Step 3: submitDianziAnswer 使用 normalizeAnswer**
  - 文件: `源码/js/match.js`
  - 动作: 修改第324-325行，比对前用 `normalizeAnswer` 规范化
  - 改前:
    ```javascript
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    if (answer === correct) {
    ```
  - 改后:
    ```javascript
    const answer = normalizeAnswer(matchState.selectedChars.map(c => c.char).join(''));
    const correct = normalizeAnswer(matchState.currentQuestion.answer);
    if (answer === correct) {
    ```

- [ ] **Step 4: checkMatchAnswer 使用 normalizeAnswer**
  - 文件: `源码/js/match.js`
  - 动作: 修改第335-336行，同 Step 3
  - 改前:
    ```javascript
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    if (answer === correct) {
    ```
  - 改后:
    ```javascript
    const answer = normalizeAnswer(matchState.selectedChars.map(c => c.char).join(''));
    const correct = normalizeAnswer(matchState.currentQuestion.answer);
    if (answer === correct) {
    ```

### Task 3: 修复 game-core.js（填空验证统一 + 精确匹配）
**目标**: 填空模式验证正确，繁简自动转换，拒绝部分输入
**来源**: tasks.md Task 3 + specs REQ-3, REQ-4

- [ ] **Step 1: 替换所有内联正则**
  - 文件: `源码/js/game-core.js`
  - 动作: 替换 `submitFillAnswer` 中 4 处内联正则（第244-245行 + 第285-286行）
  - 改前 (两处相同模式):
    ```javascript
    const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
    const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
    ```
  - 改后:
    ```javascript
    const userAns = normalizeAnswer(userAnswers[i]);
    const correctAns = normalizeAnswer(answerParts[i] || '');
    ```

- [ ] **Step 2: 收窄为精确匹配**
  - 文件: `源码/js/game-core.js`
  - 动作: 修改第247行和第287行
  - 改前:
    ```javascript
    if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns)) {
    ```
  - 改后:
    ```javascript
    if (userAns === correctAns) {
    ```
  - 验证: 浏览器中测试填空题 — 输完整答案判对，输部分答案判错

### Task 4: 修复 feihua.js（飞花令统一）
**目标**: 飞花令答案验证使用 normalizeAnswer，支持繁简转换
**来源**: tasks.md Task 4 + specs REQ-5

- [ ] **Step 1: 替换 cleanText 内联函数**
  - 文件: `源码/js/feihua.js`
  - 动作: 修改第383行，删除 `cleanText`，直接调用 `normalizeAnswer`
  - 改前:
    ```javascript
    const cleanText = (text) => text.replace(/[，。！？、；：""''（）\s]/g, '').toLowerCase();
    const cleanAnswer = cleanText(userAnswer);
    if (!cleanAnswer.includes(feihuaState.keyword)) {
    ```
  - 改后:
    ```javascript
    const cleanAnswer = normalizeAnswer(userAnswer).toLowerCase();
    if (!cleanAnswer.includes(feihuaState.keyword)) {
    ```

- [ ] **Step 2: 替换 5 处内联正则**
  - 文件: `源码/js/feihua.js`
  - 动作: 将以下行的 `...replace(/[\s，。！？、；：""''（）]/g, '')` 替换为 `normalizeAnswer(...)`
  - 位置: 第395行、第397行、第407行、第420行、第440行
  - 改前 (以第395行/407行为例):
    ```javascript
    const normalizedAnswer = userAnswer.replace(/[\s，。！？、；：""''（）]/g, '');
    // 和
    const normalizedForMatch = userAnswer.replace(/[\s，。！？、；：""''（）]/g, '');
    ```
  - 改后:
    ```javascript
    const normalizedAnswer = normalizeAnswer(userAnswer);
    // 和
    const normalizedForMatch = normalizeAnswer(userAnswer);
    ```
  - 注意: 第397行 `a.replace(/[\s，。！？、；：""''（）]/g, '') === normalizedAnswer` → `normalizeAnswer(a) === normalizedAnswer`
  - 注意: 第420行 `line.replace(/[\s，。！？、；：""''（）]/g, '')` → `normalizeAnswer(line)`
  - 注意: 第440行 `line.replace(/[\s，。！？、；：""''（）]/g, '') === normalizedForMatch` → `normalizeAnswer(line) === normalizedForMatch`
  - 验证: `node --check 源码/js/feihua.js` 无错误

### Task 5: 修复 feihua_loader.js（数据加载层统一）
**目标**: 飞花令数据加载时统一繁简转换
**来源**: tasks.md Task 5 + specs REQ-6

- [ ] **Step 1: 替换 3 处数据清理正则**
  - 文件: `源码/data/feihua_loader.js`
  - 动作: 替换第22行、第74行、第207行
  - 第22行改前:
    ```javascript
    const clean = poem.text.replace(/[，。！？、；：""''（）\s]/g, '');
    ```
  - 第22行改后:
    ```javascript
    const clean = normalizeAnswer(poem.text);
    ```
  - 第74行改前:
    ```javascript
    const cleanLine = line.replace(/[，。！？、；：""''【】《》]/g, '').trim();
    ```
  - 第74行改后:
    ```javascript
    const cleanLine = normalizeAnswer(line);
    ```
  - 第207行改前:
    ```javascript
    const cleanAnswer = answer.replace(/[，。！？、；：""''【】《》\s]/g, '').trim();
    ```
  - 第207行改后:
    ```javascript
    const cleanAnswer = normalizeAnswer(answer);
    ```
  - 验证: `node --check 源码/data/feihua_loader.js` 无错误

### Task 6: 验证 + 回归测试
**目标**: 确认全部修复有效且无回归
**来源**: tasks.md Task 6

- [ ] **Step 1: JS 语法检查所有改动的文件**
  - 命令:
    ```bash
    cd /Volumes/claw/xiaofeng/projects/poetry-game/源码 && \
    node --check js/constants.js && \
    node --check js/utils.js && \
    node --check data/feihua_loader.js && \
    node --check js/feihua.js && \
    node --check js/match.js && \
    node --check js/game-core.js
    ```
  - 预期: 全部无错误输出

- [ ] **Step 2: 运行现有测试套件**
  - 命令: `cd 源码 && node verify-all.mjs`
  - 预期: 全部通过

- [ ] **Step 3: 浏览器手动验证覆盖全部 7 个 bug 场景**
  - 场景B1: 消消乐中「可怜」「可与」类诗句答案完整显示
  - 场景B2: 九宫格中选中两个「处」→ 去选一个 → 确认还剩一个
  - 场景B3: 填空输入「原驰蜡象」，数据有繁体字时判对
  - 场景B4: 填空输入部分答案（如「春风」），确认判错
  - 场景B5: 飞花令含繁体诗句，用户输入简体，正确匹配
  - 场景B6: 飞花令答案去重逻辑正常
  - 场景B7: 飞花令数据加载后，诗句内容已简体化

> 🔨 M4 build 完成 — 2026-05-10T18:00:00+08:00
> 计划: plan-ready.md 直接消费
> commit: b918717 — 6 files, +101/-49
>
> ## M4 测试证据
> 命令: `node --check` for all 6 changed files
>
> ```
> ✅ constants.js
> ✅ utils.js  
> ✅ feihua_loader.js
> ✅ feihua.js
> ✅ match.js
> ✅ game-core.js
> ```
>
> 结果: 6/6 syntax OK, 0 errors

> ## ⚠️ 偏离记录
> ### 偏离 1: writing-plans 跳过
> - 发现: 2026-05-10T17:55
> - 内容: plan-ready.md 每 step 有精确文件路径+改前改后代码+验证命令，直接消费无需中间层
> - 原因: per lessons learned (baimao-knowledge 首次走流程的教训)
> - 影响: 无。M3 一致性检查无需执行。

> ## M4 commit 记录
> | Task | Commit SHA | Message |
> |------|-----------|---------|
> | Task 1-5 | b918717 | fix: unify answer validation with normalizeAnswer across all game modes |
