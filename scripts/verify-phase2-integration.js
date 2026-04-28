/**
 * 阶段二验证脚本：集成验证
 * 验证内容：
 * 1. index.html 加载顺序正确
 * 2. 各模块使用的全局变量在加载顺序中已定义
 * 3. 无 undefined 变量引用（基础检查）
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..');
const JS_DIR = path.join(BASE_DIR, 'js');

let passed = 0;
let failed = 0;

function check(name, condition, detail = '') {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}${detail ? ' - ' + detail : ''}`);
        failed++;
    }
}

console.log('══════════════════════════════════════════════════');
console.log('  阶段二验证：集成验证');
console.log('══════════════════════════════════════════════════\n');

// 1. 检查 index.html 加载顺序
console.log('[1/3] index.html 加载顺序');
const htmlContent = fs.readFileSync(path.join(BASE_DIR, 'index.html'), 'utf8');
const scriptMatches = htmlContent.match(/src="js\/([^"?]+)/g) || [];
const loadOrder = scriptMatches.map(s => s.match(/js\/([^"?]+)/)[1]);

console.log('  加载顺序:', loadOrder.join(' → '));

const expectedOrder = [
    'constants.js', 'db.js', 'utils.js', 'state.js',
    'ui.js', 'user.js', 'navigation.js',
    'game-core.js', 'dict.js', 'wrong-notes.js',
    'ranking.js', 'achievements.js',
    'feihua.js', 'match.js', 'menu.js', 'app.js'
];

let orderCorrect = true;
for (let i = 0; i < expectedOrder.length; i++) {
    const idx = loadOrder.indexOf(expectedOrder[i]);
    if (idx === -1) {
        check(`${expectedOrder[i]} 在加载顺序中`, false, '未找到');
        orderCorrect = false;
    } else if (i > 0) {
        const prevIdx = loadOrder.indexOf(expectedOrder[i - 1]);
        if (prevIdx > idx) {
            check(`${expectedOrder[i]} 加载顺序`, false, `应在 ${expectedOrder[i-1]} 之后`);
            orderCorrect = false;
        }
    }
}

if (orderCorrect) {
    check('所有模块加载顺序正确', true);
}

console.log('');

// 2. 检查各模块依赖的全局变量是否已在先加载的模块中定义
console.log('[2/3] 全局变量依赖检查');

// 定义各模块提供的全局符号
const moduleExports = {
    'constants.js': ['DATA_VERSION', 'DATA_VERSION_KEY', 'PASS_SCORE', 'FEIHUA_TIME_LIMIT', 'LEARNING_KEYWORD_POOL_SIZE', 'MASTERED_EXPIRY_DAYS', 'MAX_COMBO_BONUS', 'BASE_SCORE', 'COMBO_MULTIPLIER', 'MAX_COMBO_CAP', 'GRADE_LEVELS', 'TRAD_TO_SIMP', 'PUNCTUATION_RE', 'QUESTION_TYPE_NAMES'],
    'utils.js': ['toSimplified', 'shuffle', 'calculateScore', 'cleanPunctuation', 'escapeHtml', 'debounce', 'formatTime', 'deepClone'],
    'state.js': ['gameState', 'pendingLoginMode'],
    'ui.js': ['startTimer', 'stopTimer', 'updateTimerDisplay', 'showComboEffect', 'showToast'],
    'user.js': ['initUser', 'loadUser', 'saveUser', 'checkDataReady', 'checkStorageQuota', 'exportUserData', 'importUserData', 'migrateUserData', 'checkDataVersion', 'handleImportFile', 'showLoginModal', 'submitLogin', 'skipLogin', 'continueStartGame', 'updateUserDisplay', 'switchUser', 'deleteUser'],
    'navigation.js': ['showPage', 'goHome'],
    'game-core.js': ['startGame', 'showLevelSelect', 'getQuestionsByGrade', 'getRandomQuestions', 'startChallenge', 'startDailyChallenge', 'nextQuestion', 'showQuestion', 'submitFillAnswer', 'skipAndShowAnswer', 'skipChoiceAndShowAnswer', 'createOptionElement', 'selectOption', 'getQuestionTypeName', 'recordWrongQuestion', 'recordQuestionCorrect', 'isQuestionMastered', 'endGame', 'showResult', 'restartGame', 'exitGame', 'calculateLevel'],
    'dict.js': ['showDict', 'findPoemEnhanced', 'getEnhancedExplanation', 'updateShowPoemButton', 'showPoemByQuestion', 'showPoemModal', 'closePoemModal', 'searchPoems'],
    'wrong-notes.js': ['showWrongNotes'],
    'ranking.js': ['showRanking'],
    'achievements.js': ['showAchievements', 'checkAchievements', 'showAchievementBadge'],
    'feihua.js': ['toggleFeihuaMode', 'startFeihuaLearning', 'nextLearningKeyword', 'getFeihuaKeywordPool', 'pickNextFeihuaKeyword', 'switchToNewKeyword', 'startFeihuaGame', 'showFeihuaInput', 'submitFeihuaAnswerByInput', 'showPoemSource', 'skipFeihuaAndShowAnswer', 'showFeihuaSuccess', 'startNextFeihuaRound', 'endFeihuaRound', 'endFeihua', 'feihuaState'],
    'match.js': ['startMatch', 'generateMatchQuestions', 'showMatchQuestion', 'showJiugongGe', 'showShiergongGe', 'selectJiugongChar', 'updateSelectedCharsDisplay', 'confirmSelection', 'clearSelection', 'showDianZiChengShi', 'selectDianziChar', 'updateSelectedPoemDisplay', 'clearDianziSelection', 'submitDianziAnswer', 'checkMatchAnswer', 'handleMatchCorrect', 'handleMatchWrong', 'showMatchAnswer', 'continueMatchAnswer', 'endMatch', 'matchState'],
    'menu.js': ['toggleUserMenu', 'hideUserMenu']
};

// 收集所有可用的全局符号（按加载顺序）
const availableSymbols = new Set();
const moduleIssues = [];

for (const [moduleFile, exports] of Object.entries(moduleExports)) {
    const modulePath = path.join(JS_DIR, moduleFile);
    if (!fs.existsSync(modulePath)) continue;
    const content = fs.readFileSync(modulePath, 'utf8');

    // 检查该模块引用了哪些尚未可用的符号
    for (const [otherModule, otherExports] of Object.entries(moduleExports)) {
        if (otherModule === moduleFile) continue;
        const otherIdx = loadOrder.indexOf(otherModule);
        const thisIdx = loadOrder.indexOf(moduleFile);
        if (otherIdx > thisIdx || otherIdx === -1) {
            // otherModule 在 this 之后加载，检查 this 的全局代码（非函数内）是否引用了 other 的符号
            for (const symbol of otherExports) {
                // 只检查全局级别的引用（不在函数体内）
                // 简单规则：如果符号出现在行首（可能是在全局代码中调用）
                const lines = content.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    // 排除：注释、函数定义、变量声明
                    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
                    if (trimmed.startsWith('function ' + symbol)) continue;
                    if (trimmed.includes('function ' + symbol + '(')) continue;
                    if (trimmed.startsWith('const ' + symbol) || trimmed.startsWith('let ' + symbol) || trimmed.startsWith('var ' + symbol)) continue;
                    // 检查是否是调用（symbol 后面跟 (）
                    const callPattern = new RegExp(`\\b${symbol}\\s*\\(`);
                    if (callPattern.test(trimmed)) {
                        // 进一步检查：是否在当前模块的函数定义内部
                        // 简单判断：如果前面有 function 关键字，可能是在函数内
                        // 但函数定义可能跨多行，这里简化处理
                        // 只报告明确的顶级调用（行首是 symbol 或赋值后调用）
                        // 有缩进的调用在函数内部，运行时所有模块已加载，不是问题
                        const hasIndent = line.match(/^(\s+)/);
                        if (!hasIndent && (trimmed.startsWith(symbol + '(') || trimmed.startsWith(symbol + ' ('))) {
                            moduleIssues.push(`${moduleFile} 全局代码调用了 ${symbol}()（在 ${otherModule} 中定义，但加载顺序在后）`);
                        }
                    }
                }
            }
        }
    }

    // 将该模块的导出加入可用符号集
    for (const symbol of exports) {
        availableSymbols.add(symbol);
    }
}

if (moduleIssues.length > 0) {
    for (const issue of moduleIssues.slice(0, 10)) {
        check('模块依赖', false, issue);
    }
    if (moduleIssues.length > 10) {
        console.log(`  ... 还有 ${moduleIssues.length - 10} 个依赖问题`);
    }
} else {
    check('模块依赖关系正确', true);
}

console.log('');

// 3. 检查 HTML 中是否引用了已删除的函数（通过 onclick 等属性）
console.log('[3/3] HTML 事件处理检查');
const onclickMatches = htmlContent.match(/onclick="([^"]+)"/g) || [];
const onchangeMatches = htmlContent.match(/onchange="([^"]+)"/g) || [];
const allHandlers = [...onclickMatches, ...onchangeMatches];

const BROWSER_APIS = ['document.getElementById', 'location.reload', 'console.log', 'console.error', 'console.warn', 'alert', 'confirm', 'prompt', 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval', 'encodeURIComponent', 'decodeURIComponent', 'parseInt', 'parseFloat', 'JSON.parse', 'JSON.stringify', 'Math.random', 'Math.floor', 'Math.min', 'Math.max', 'Date.now', 'new Date', 'Object.keys', 'Object.values', 'Object.entries', 'Array.isArray'];

const missingHandlers = [];
for (const handler of allHandlers) {
    const funcName = handler.match(/(?:onclick|onchange)="([^"(]+)/)[1].trim();
    if (!availableSymbols.has(funcName) && !BROWSER_APIS.some(api => funcName.startsWith(api))) {
        missingHandlers.push(funcName);
    }
}

if (missingHandlers.length > 0) {
    for (const h of [...new Set(missingHandlers)]) {
        check(`HTML 事件 ${h}`, false, '未在任何模块中定义');
    }
} else {
    check('HTML 事件处理函数全部有定义', true);
}

console.log('');
console.log('══════════════════════════════════════════════════');
console.log(`  结果: ${passed} 通过, ${failed} 失败`);
console.log('══════════════════════════════════════════════════');

if (failed > 0) {
    console.log('\n⚠️  发现依赖问题，请在浏览器中测试时注意。');
    process.exit(1);
} else {
    console.log('\n✅ 阶段二集成验证全部通过！');
    process.exit(0);
}
