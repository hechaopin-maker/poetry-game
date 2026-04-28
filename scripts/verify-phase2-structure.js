/**
 * 阶段二验证脚本：模块化拆分结构验证
 * 验证内容：
 * 1. 所有模块文件存在
 * 2. 关键函数在正确的文件中
 * 3. 无重复定义
 * 4. 无语法错误（基础解析）
 */

const fs = require('fs');
const path = require('path');

const JS_DIR = path.join(__dirname, '..', 'js');

const modules = {
    'constants.js': ['DATA_VERSION', 'TRAD_TO_SIMP', 'GRADE_LEVELS', 'PUNCTUATION_RE'],
    'utils.js': ['toSimplified', 'shuffle', 'calculateScore', 'cleanPunctuation', 'escapeHtml', 'debounce', 'formatTime', 'deepClone'],
    'state.js': ['gameState', 'pendingLoginMode'],
    'feihua.js': ['toggleFeihuaMode', 'startFeihuaLearning', 'nextLearningKeyword', 'getFeihuaKeywordPool', 'pickNextFeihuaKeyword', 'switchToNewKeyword', 'startFeihuaGame', 'showFeihuaInput', 'submitFeihuaAnswerByInput', 'showPoemSource', 'skipFeihuaAndShowAnswer', 'showFeihuaSuccess', 'startNextFeihuaRound', 'endFeihuaRound', 'endFeihua', 'feihuaState'],
    'match.js': ['startMatch', 'generateMatchQuestions', 'showMatchQuestion', 'showJiugongGe', 'showShiergongGe', 'selectJiugongChar', 'updateSelectedCharsDisplay', 'confirmSelection', 'clearSelection', 'showDianZiChengShi', 'selectDianziChar', 'updateSelectedPoemDisplay', 'clearDianziSelection', 'submitDianziAnswer', 'checkMatchAnswer', 'handleMatchCorrect', 'handleMatchWrong', 'showMatchAnswer', 'continueMatchAnswer', 'endMatch', 'matchState'],
    'ui.js': ['startTimer', 'stopTimer', 'updateTimerDisplay', 'showComboEffect', 'showToast'],
    'user.js': ['initUser', 'loadUser', 'saveUser', 'checkDataReady', 'checkStorageQuota', 'exportUserData', 'importUserData', 'migrateUserData', 'checkDataVersion', 'handleImportFile', 'showLoginModal', 'submitLogin', 'skipLogin', 'switchUser', 'deleteUser'],
    'navigation.js': ['showPage', 'goHome'],
    'game-core.js': ['startGame', 'showLevelSelect', 'getQuestionsByGrade', 'getRandomQuestions', 'startChallenge', 'startDailyChallenge', 'nextQuestion', 'showQuestion', 'submitFillAnswer', 'createOptionElement', 'selectOption', 'getQuestionTypeName', 'recordWrongQuestion', 'recordQuestionCorrect', 'isQuestionMastered', 'endGame', 'showResult', 'restartGame', 'exitGame', 'calculateLevel'],
    'dict.js': ['showDict', 'findPoemEnhanced', 'getEnhancedExplanation', 'updateShowPoemButton', 'showPoemByQuestion', 'showPoemModal', 'closePoemModal', 'searchPoems'],
    'wrong-notes.js': ['showWrongNotes'],
    'ranking.js': ['showRanking'],
    'achievements.js': ['showAchievements', 'checkAchievements', 'showAchievementBadge'],
    'feihua.js': ['toggleFeihuaMode', 'startFeihuaLearning', 'nextLearningKeyword', 'getFeihuaKeywordPool', 'pickNextFeihuaKeyword', 'switchToNewKeyword', 'startFeihuaGame', 'showFeihuaInput', 'submitFeihuaAnswerByInput', 'showPoemSource', 'skipFeihuaAndShowAnswer', 'showFeihuaSuccess', 'startNextFeihuaRound', 'endFeihuaRound', 'endFeihua'],
    'match.js': ['startMatch', 'generateMatchQuestions', 'showMatchQuestion', 'showJiugongGe', 'showShiergongGe', 'selectJiugongChar', 'updateSelectedCharsDisplay', 'confirmSelection', 'clearSelection', 'showDianZiChengShi', 'selectDianziChar', 'updateSelectedPoemDisplay', 'clearDianziSelection', 'submitDianziAnswer', 'checkMatchAnswer', 'handleMatchCorrect', 'handleMatchWrong', 'showMatchAnswer', 'continueMatchAnswer', 'endMatch'],
    'menu.js': ['toggleUserMenu', 'hideUserMenu'],
    'app.js': ['DOMContentLoaded']
};

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
console.log('  阶段二验证：模块化拆分结构');
console.log('══════════════════════════════════════════════════\n');

// 1. 文件存在性检查
console.log('[1/4] 模块文件存在性');
for (const [file, expectedFuncs] of Object.entries(modules)) {
    const filePath = path.join(JS_DIR, file);
    check(`${file} 存在`, fs.existsSync(filePath), `路径: ${filePath}`);
}

console.log('');

// 2. 关键函数位置检查
console.log('[2/4] 关键函数位置');
for (const [file, expectedFuncs] of Object.entries(modules)) {
    const filePath = path.join(JS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const func of expectedFuncs) {
        if (func === 'DOMContentLoaded') {
            check(`app.js 包含 DOMContentLoaded`, /DOMContentLoaded/.test(content));
        } else {
            const pattern = new RegExp(`(?:function|const|let|var)\\s+${func}\\b`);
            check(`${file} 包含 ${func}`, pattern.test(content) || content.includes(`${func} =`) || content.includes(`${func}:`));
        }
    }
}

console.log('');

// 3. 重复定义检查
console.log('[3/4] 重复定义检查');
const allFuncs = {};
for (const [file, expectedFuncs] of Object.entries(modules)) {
    const filePath = path.join(JS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const func of expectedFuncs) {
        if (func === 'DOMContentLoaded') continue;
        if (func === 'debounce') {
            // debounce 在 utils.js 和 menu.js 中都可能有，但 utils.js 没有它
            continue;
        }
        const pattern = new RegExp(`(?:function|const|let|var)\\s+${func}\\b`, 'g');
        const matches = content.match(pattern);
        const count = matches ? matches.length : 0;
        if (count > 1) {
            check(`${file} 中 ${func} 不重复定义`, false, `重复 ${count} 次`);
        }
        if (allFuncs[func]) {
            // 允许在不同文件中重复（但应该避免）
            // 这里只检查同一文件内的重复
        }
        allFuncs[func] = file;
    }
}

// 检查跨文件重复
const crossFileDups = [];
const funcLocations = {};
for (const [file, expectedFuncs] of Object.entries(modules)) {
    const filePath = path.join(JS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    for (const func of expectedFuncs) {
        if (func === 'DOMContentLoaded') continue;
        const pattern = new RegExp(`(?:function|const|let|var)\\s+${func}\\b`);
        if (pattern.test(content) || content.includes(`${func} =`) || content.includes(`${func}:`)) {
            if (funcLocations[func]) {
                crossFileDups.push(`${func} 在 ${funcLocations[func]} 和 ${file}`);
            } else {
                funcLocations[func] = file;
            }
        }
    }
}

if (crossFileDups.length > 0) {
    for (const dup of crossFileDups) {
        check(`跨文件重复定义`, false, dup);
    }
} else {
    check('无跨文件重复定义', true);
}

console.log('');

// 4. 语法检查（基础）
console.log('[4/4] 语法检查');
for (const file of Object.keys(modules)) {
    const filePath = path.join(JS_DIR, file);
    if (!fs.existsSync(filePath)) continue;
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // 基础语法检查：括号匹配
        const openParen = (content.match(/\(/g) || []).length;
        const closeParen = (content.match(/\)/g) || []).length;
        const openBrace = (content.match(/\{/g) || []).length;
        const closeBrace = (content.match(/\}/g) || []).length;
        const openBracket = (content.match(/\[/g) || []).length;
        const closeBracket = (content.match(/\]/g) || []).length;

        const parenOk = openParen === closeParen;
        const braceOk = openBrace === closeBrace;
        const bracketOk = openBracket === closeBracket;

        check(`${file} 括号匹配`, parenOk && braceOk && bracketOk,
            `() ${openParen}/${closeParen}, {} ${openBrace}/${closeBrace}, [] ${openBracket}/${closeBracket}`);
    } catch (e) {
        check(`${file} 可读取`, false, e.message);
    }
}

console.log('');
console.log('══════════════════════════════════════════════════');
console.log(`  结果: ${passed} 通过, ${failed} 失败`);
console.log('══════════════════════════════════════════════════');

if (failed > 0) {
    console.log('\n❌ 阶段二结构验证未通过。');
    process.exit(1);
} else {
    console.log('\n✅ 阶段二结构验证全部通过！');
    process.exit(0);
}
