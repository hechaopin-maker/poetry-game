/**
 * 浏览器冒烟测试：验证模块化拆分后核心功能正常
 * 运行：node tests/browser-smoke-test.js
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8888';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let passed = 0;
let failed = 0;
const errors = [];

async function test(name, fn) {
    try {
        await fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ❌ ${name} - ${e.message}`);
        errors.push({ name, error: e.message });
        failed++;
    }
}

async function screenshot(page, name) {
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${name}.png`), fullPage: true });
}

(async () => {
    console.log('══════════════════════════════════════════════════');
    console.log('  浏览器冒烟测试：模块化拆分验证');
    console.log('══════════════════════════════════════════════════\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    // 确保每次测试都是全新状态（无残留登录数据）
    await context.addInitScript(() => {
        try { localStorage.clear(); } catch (e) {}
    });
    const page = await context.newPage();

    // 捕获控制台错误
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push({ name: 'Console Error', error: msg.text() });
        }
    });
    page.on('pageerror', err => {
        errors.push({ name: 'Page Error', error: err.message });
    });

    // 1. 页面加载
    await test('页面正常加载', async () => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        const title = await page.title();
        if (title !== '古诗词大挑战') throw new Error(`标题错误: ${title}`);
    });
    await screenshot(page, '01-home');

    // 2. 检查全局函数是否存在
    await test('全局函数已注册', async () => {
        const funcs = ['startGame', 'showDict', 'showWrongNotes', 'showAchievements', 'showRanking', 'toggleFeihuaMode', 'startMatch'];
        for (const fn of funcs) {
            const exists = await page.evaluate(f => typeof window[f] === 'function', fn);
            if (!exists) throw new Error(`${fn} 未定义`);
        }
    });

    // 3. 游客模式进入
    await test('游客模式进入', async () => {
        // 等待登录框出现（initUser 中数据加载可能需要时间）
        await page.waitForSelector('#loginModal.show', { visible: true, timeout: 15000 });
        const skipBtn = await page.$('.login-skip-btn');
        if (!skipBtn) throw new Error('未找到跳过按钮');
        await skipBtn.click();
        await page.waitForTimeout(500);
        const modal = await page.$('#loginModal.show');
        if (modal) throw new Error('登录框未关闭');
    });
    await screenshot(page, '02-after-login');

    // 4. 首页模块卡片存在
    await test('首页模块卡片完整', async () => {
        const cards = await page.$$('.module-card');
        if (cards.length < 6) throw new Error(`模块卡片数量不足: ${cards.length}`);
        const texts = await Promise.all(cards.map(c => c.textContent()));
        const required = ['飞花令', '诗词消消乐', '诗词闯关', '每日挑战', '错题本', '诗词词典'];
        for (const r of required) {
            if (!texts.some(t => t.includes(r))) throw new Error(`缺少模块: ${r}`);
        }
    });

    // 5. 诗词闯关
    await test('诗词闯关可进入', async () => {
        const challengeCard = await page.$('text=诗词闯关');
        if (!challengeCard) throw new Error('未找到诗词闯关卡片');
        // 找到包含"诗词闯关"的卡片并点击
        const cards = await page.$$('.module-card');
        for (const card of cards) {
            const text = await card.textContent();
            if (text.includes('诗词闯关')) {
                await card.click();
                break;
            }
        }
        await page.waitForTimeout(800);
        const levelPage = await page.$('#levelSelectPage.active');
        if (!levelPage) throw new Error('未进入关卡选择页');
    });
    await screenshot(page, '03-level-select');

    // 返回首页
    await test('返回首页', async () => {
        await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
        await page.waitForTimeout(500);
        const homePage = await page.$('#homePage.active');
        if (!homePage) throw new Error('未返回首页');
    });

    // 6. 飞花令
    await test('飞花令可进入', async () => {
        const cards = await page.$$('.module-card');
        for (const card of cards) {
            const text = await card.textContent();
            if (text.includes('飞花令')) {
                await card.click();
                break;
            }
        }
        await page.waitForTimeout(3000);
        const feihuaPage = await page.$('#feihuaPage.active');
        if (!feihuaPage) throw new Error('未进入飞花令页面');
    });
    await screenshot(page, '04-feihua');

    // 返回首页
    await test('飞花令返回首页', async () => {
        await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
        await page.waitForTimeout(500);
        const homePage = await page.$('#homePage.active');
        if (!homePage) throw new Error('未返回首页');
    });

    // 7. 诗词消消乐
    await test('诗词消消乐可进入', async () => {
        const cards = await page.$$('.module-card');
        for (const card of cards) {
            const text = await card.textContent();
            if (text.includes('诗词消消乐')) {
                await card.click();
                break;
            }
        }
        await page.waitForTimeout(800);
        const matchPage = await page.$('#matchPage.active');
        if (!matchPage) throw new Error('未进入消消乐页面');
    });
    await screenshot(page, '05-match');

    // 返回首页
    await test('消消乐返回首页', async () => {
        await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
        await page.waitForTimeout(500);
        const homePage = await page.$('#homePage.active');
        if (!homePage) throw new Error('未返回首页');
    });

    // 8. 诗词词典
    await test('诗词词典可进入', async () => {
        const cards = await page.$$('.module-card');
        for (const card of cards) {
            const text = await card.textContent();
            if (text.includes('诗词词典')) {
                await card.click();
                break;
            }
        }
        await page.waitForTimeout(800);
        const dictPage = await page.$('#dictPage.active');
        if (!dictPage) throw new Error('未进入词典页面');
    });
    await screenshot(page, '06-dict');

    // 9. 搜索功能
    await test('词典搜索可用', async () => {
        const searchInput = await page.$('#dictSearch');
        if (!searchInput) throw new Error('未找到搜索框');
        await searchInput.fill('李白');
        await page.waitForTimeout(1000);
        const results = await page.$$('#dictResults .question-box');
        if (results.length === 0) {
            // 可能没有结果，检查是否有 empty-state
            const empty = await page.$('.empty-state');
            if (!empty) throw new Error('搜索结果为空且无提示');
        }
    });
    await screenshot(page, '07-dict-search');

    // 返回首页
    await test('词典返回首页', async () => {
        await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
        await page.waitForTimeout(500);
        const homePage = await page.$('#homePage.active');
        if (!homePage) throw new Error('未返回首页');
    });

    // 10. 错题本
    await test('错题本可进入', async () => {
        const cards = await page.$$('.module-card');
        for (const card of cards) {
            const text = await card.textContent();
            if (text.includes('错题本')) {
                await card.click();
                break;
            }
        }
        await page.waitForTimeout(800);
        const wrongPage = await page.$('#wrongPage.active');
        if (!wrongPage) throw new Error('未进入错题本页面');
    });
    await screenshot(page, '08-wrong-notes');

    // 返回首页
    await test('错题本返回首页', async () => {
        await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
        await page.waitForTimeout(500);
        const homePage = await page.$('#homePage.active');
        if (!homePage) throw new Error('未返回首页');
    });

    // 11. 用户菜单
    await test('用户菜单可打开', async () => {
        const avatar = await page.$('#userAvatar');
        if (!avatar) throw new Error('未找到用户头像');
        await avatar.click();
        await page.waitForTimeout(300);
        const menu = await page.$('#userMenu.show');
        if (!menu) throw new Error('用户菜单未显示');
    });
    await screenshot(page, '09-user-menu');

    // 12. 检查控制台错误
    await test('无严重 JS 错误', async () => {
        const criticalErrors = errors.filter(e =>
            !e.error.includes('favicon') &&
            !e.error.includes('net::ERR') &&
            !e.error.includes('404')
        );
        if (criticalErrors.length > 0) {
            throw new Error(`发现 ${criticalErrors.length} 个错误: ${criticalErrors.map(e => e.error).join('; ')}`);
        }
    });

    await browser.close();

    console.log('');
    console.log('══════════════════════════════════════════════════');
    console.log(`  结果: ${passed} 通过, ${failed} 失败`);
    console.log('══════════════════════════════════════════════════');

    if (errors.length > 0) {
        console.log('\n  控制台日志:');
        errors.forEach(e => console.log(`    - [${e.name}] ${e.error}`));
    }

    console.log(`\n  截图保存在: ${SCREENSHOT_DIR}`);

    if (failed > 0) {
        console.log('\n❌ 冒烟测试未通过。');
        process.exit(1);
    } else {
        console.log('\n✅ 冒烟测试全部通过！');
        process.exit(0);
    }
})();
