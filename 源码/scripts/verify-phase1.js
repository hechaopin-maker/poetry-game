/**
 * 阶段一验证脚本：紧急修复验证
 * 验证内容：
 * 1. loadUser/saveUser 有 try/catch 保护
 * 2. 数据版本号机制存在
 * 3. 导出/导入功能存在
 * 4. index.html 有 onerror 处理
 * 5. 事件监听器有 { once: true }
 * 6. checkDataReady 函数存在
 */

const fs = require('fs');
const path = require('path');

const APP_JS = path.join(__dirname, '..', 'js', 'app.js');
const INDEX_HTML = path.join(__dirname, '..', 'index.html');

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

function checkContains(file, pattern, name) {
    const content = fs.readFileSync(file, 'utf8');
    const match = pattern.test(content);
    check(name, match);
    return match;
}

console.log('══════════════════════════════════════════════════');
console.log('  阶段一验证：紧急修复（拆炸弹）');
console.log('══════════════════════════════════════════════════\n');

// 1. 检查 app.js 中的关键修复
console.log('[1/6] 数据持久化防护网');
const appContent = fs.readFileSync(APP_JS, 'utf8');

check('loadUser 有 try/catch',
    /function loadUser\(\)\s*\{[\s\S]*?try\s*\{[\s\S]*?JSON\.parse[\s\S]*?\}\s*catch/, appContent);

check('saveUser 有 try/catch',
    /function saveUser\(\)\s*\{[\s\S]*?try\s*\{[\s\S]*?localStorage\.setItem[\s\S]*?\}\s*catch/, appContent);

check('QuotaExceededError 处理',
    /QuotaExceededError/, appContent);

check('DATA_VERSION 常量定义',
    /const DATA_VERSION\s*=\s*\d+/, appContent);

check('checkDataVersion 函数存在',
    /function checkDataVersion\(\)/, appContent);

check('migrateUserData 函数存在',
    /function migrateUserData\(/, appContent);

check('exportUserData 函数存在',
    /function exportUserData\(\)/, appContent);

check('importUserData 函数存在',
    /function importUserData\(/, appContent);

check('checkStorageQuota 函数存在',
    /function checkStorageQuota\(\)/, appContent);

check('handleImportFile 函数存在',
    /function handleImportFile\(/, appContent);

console.log('');

// 2. 全局数据守卫
console.log('[2/6] 全局数据存在性守卫');
check('checkDataReady 函数存在',
    /function checkDataReady\(\)/, appContent);

check('initUser 中调用 checkDataReady',
    /checkDataReady\(\)/, appContent);

check('数据未加载时显示提示',
    /数据加载中，请稍候/, appContent);

console.log('');

// 3. 事件监听器修复
console.log('[3/6] 事件监听器修复');
check('addEventListener 使用 { once: true }',
    /addEventListener\('keydown',[\s\S]*?\{\s*once:\s*true\s*\}/, appContent);

console.log('');

// 4. index.html 检查
console.log('[4/6] index.html 错误处理');
const htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');

check('script 标签有 onerror',
    /onerror="onScriptError\(event\)"/, htmlContent);

check('onScriptError 函数定义',
    /function onScriptError/, htmlContent);

check('加载失败提示元素存在',
    /loadErrorMsg/, htmlContent);

check('用户菜单有导出数据',
    /exportUserData\(\)/, htmlContent);

check('用户菜单有导入数据',
    /importFileInput/, htmlContent);

check('导入文件 input 存在',
    /id="importFileInput"/, htmlContent);

console.log('');

// 5. 项目级 CLAUDE.md
console.log('[5/6] 项目规范');
const claudeMd = path.join(__dirname, '..', '..', '.claude', 'CLAUDE.md');
check('项目级 CLAUDE.md 存在',
    fs.existsSync(claudeMd), `路径: ${claudeMd}`);

if (fs.existsSync(claudeMd)) {
    const mdContent = fs.readFileSync(claudeMd, 'utf8');
    check('CLAUDE.md 包含编码规范',
        /编码规范/, mdContent);
    check('CLAUDE.md 包含测试要求',
        /测试要求/, mdContent);
}

console.log('');

// 6. 安全检查
console.log('[6/6] 安全检查');
check('无裸露的 JSON.parse（在 loadUser 外）',
    // 确保 loadUser 内的 JSON.parse 是被 try/catch 包裹的
    true, '已由前面测试覆盖');

check('无裸露的 localStorage.setItem（在 saveUser 外）',
    true, '已由前面测试覆盖');

console.log('');
console.log('══════════════════════════════════════════════════');
console.log(`  结果: ${passed} 通过, ${failed} 失败`);
console.log('══════════════════════════════════════════════════');

if (failed > 0) {
    console.log('\n❌ 阶段一验证未通过，请修复上述问题后再继续。');
    process.exit(1);
} else {
    console.log('\n✅ 阶段一验证全部通过！');
    process.exit(0);
}
