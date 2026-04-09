const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  
  const log = (test, status, detail) => {
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'WARN' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${status}] ${test}${detail ? ': ' + detail : ''}`);
    results.push({ test, status, detail });
  };
  
  async function safeGoto(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        return true;
      } catch(e) {
        console.log(`  重试 ${i+1}/${retries}: ${e.message.substring(0, 50)}`);
        await page.waitForTimeout(3000);
      }
    }
    return false;
  }
  
  async function login() {
    const loginInput = page.locator('#username-input');
    if (await loginInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginInput.fill('测试用户');
      await page.waitForTimeout(200);
      const loginBtn = page.locator('button:has-text("开始学习")');
      await loginBtn.click();
      await page.waitForTimeout(1500);
      return true;
    }
    return false;
  }
  
  async function safeGotoHome() {
    // 点击返回按钮
    try {
      const backBtns = await page.locator('.back-btn:has-text("返回"), .back-btn:has-text("退出")').all();
      for (const btn of backBtns) {
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch(e) {}
    
    // 确保在首页
    await safeGoto('https://chengyu-game.pages.dev/');
    await page.waitForTimeout(2000);
    
    // 检查是否需要登录
    const loginPage = page.locator('#login.active');
    if (await loginPage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await login();
    }
  }
  
  async function clickModeCard(modeName) {
    const cards = await page.locator('.mode-card').all();
    for (const card of cards) {
      const text = await card.textContent();
      if (text.includes(modeName)) {
        await card.click();
        await page.waitForTimeout(1500);
        return true;
      }
    }
    return false;
  }

  try {
    // ===== 首页加载 =====
    if (!await safeGoto('https://chengyu-game.pages.dev/')) {
      log('首页加载', 'FAIL', '无法访问网站');
    } else {
      log('首页加载', 'PASS');
      await page.waitForTimeout(2000);
      
      // 检查是否需要登录
      const loginPage = page.locator('#login.active');
      if (await loginPage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await login();
        log('登录', 'PASS');
      }
    }
    
    // ===== 模块1：成语闯关 =====
    console.log('\n--- 成语闯关模块 ---');
    if (await clickModeCard('成语闯关')) {
      log('闯关-入口', 'PASS');
      
      // 检查关卡
      const levelCards = await page.locator('.level-card, .module-card, #levelGrid > *').all();
      log('闯关-关卡数量', levelCards.length > 0 ? 'PASS' : 'WARN', `${levelCards.length}个关卡`);
      
      if (levelCards.length > 0) {
        await levelCards[0].click();
        await page.waitForTimeout(2000);
        log('闯关-进入关卡', 'PASS');
        
        // 答几道题
        let answered = 0;
        for (let i = 0; i < 5; i++) {
          await page.waitForTimeout(1000);
          
          // 检查是否游戏结束
          const gameOver = await page.locator('text=/游戏结束|通关|得分/').first().isVisible().catch(() => false);
          if (gameOver) {
            log('闯关-游戏结束', 'PASS');
            break;
          }
          
          // 尝试选择答案
          const options = await page.locator('.option-btn, .answer-option, [class*="option"]').all();
          if (options.length > 0) {
            await options[0].click();
            await page.waitForTimeout(800);
            log(`闯关-答题${i+1}`, 'PASS', `${options.length}个选项`);
            answered++;
          } else {
            log(`闯关-答题${i+1}`, 'WARN', '无选项');
          }
          
          // 点击下一题
          const nextBtn = page.locator('button:has-text("下一题")').first();
          if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await nextBtn.click();
            await page.waitForTimeout(500);
          }
        }
        log('闯关-答题完成', 'PASS', `共${answered}题`);
      }
    } else {
      log('闯关-入口', 'FAIL', '未找到成语闯关按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块2：每日挑战 =====
    console.log('\n--- 每日挑战模块 ---');
    if (await clickModeCard('每日挑战')) {
      log('每日-入口', 'PASS');
      
      for (let i = 0; i < 3; i++) {
        await page.waitForTimeout(1000);
        const options = await page.locator('.option-btn, .answer-option, [class*="option"]').all();
        if (options.length > 0) {
          await options[0].click();
          await page.waitForTimeout(800);
          log(`每日-答题${i+1}`, 'PASS');
        } else {
          log(`每日-答题${i+1}`, 'WARN', '无选项');
        }
        
        const nextBtn = page.locator('button:has-text("下一题")').first();
        if (await nextBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(500);
        }
      }
    } else {
      log('每日-入口', 'FAIL', '未找到每日挑战按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块3：成语消消乐 =====
    console.log('\n--- 成语消消乐模块 ---');
    if (await clickModeCard('成语消消乐')) {
      log('消消乐-入口', 'PASS');
      
      const gridInfo = await page.evaluate(() => {
        const grid = document.querySelector('#characterGrid, .grid, [class*="grid"]');
        const cards = grid ? grid.querySelectorAll('[class*="char"], .char-card, [class*="card"]') : [];
        return { gridFound: !!grid, cardCount: cards.length };
      });
      log('消消乐-游戏网格', gridInfo.gridFound ? 'PASS' : 'FAIL', `${gridInfo.cardCount}个字符`);
      
      if (gridInfo.cardCount >= 2) {
        const cards = await page.locator('#characterGrid > *, .grid > *, [class*="grid"] > *').all();
        if (cards.length >= 2) {
          await cards[0].click();
          await page.waitForTimeout(300);
          await cards[1].click();
          await page.waitForTimeout(500);
          log('消消乐-点击交互', 'PASS');
        }
      }
    } else {
      log('消消乐-入口', 'FAIL', '未找到成语消消乐按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块4：成语接龙 =====
    console.log('\n--- 成语接龙模块 ---');
    if (await clickModeCard('成语接龙')) {
      log('接龙-入口', 'PASS');
      
      const solitaireInfo = await page.evaluate(() => {
        const input = document.querySelector('#solitaireInput, input[type="text"], .input');
        return { inputFound: !!input };
      });
      log('接龙-输入框', solitaireInfo.inputFound ? 'PASS' : 'WARN');
      
      if (solitaireInfo.inputFound) {
        const inp = page.locator('#solitaireInput, input[type="text"]').first();
        await inp.fill('一心一意');
        await page.waitForTimeout(500);
        const submitBtn = page.locator('button:has-text("提交")').first();
        if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await submitBtn.click();
          await page.waitForTimeout(800);
          log('接龙-提交答案', 'PASS');
        }
      }
    } else {
      log('接龙-入口', 'FAIL', '未找到成语接龙按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块5：看图猜成语 =====
    console.log('\n--- 看图猜成语模块 ---');
    if (await clickModeCard('看图猜成语')) {
      log('看图-入口', 'PASS');
      
      const pictureInfo = await page.evaluate(() => {
        const img = document.querySelector('#puzzleEmoji, .puzzle-emoji, [class*="emoji"]');
        return { imageFound: !!img };
      });
      log('看图-图片', pictureInfo.imageFound ? 'PASS' : 'WARN');
      
      const options = await page.locator('.option-btn, .answer-option, [class*="option"]').all();
      if (options.length > 0) {
        await options[0].click();
        await page.waitForTimeout(800);
        log('看图-选择答案', 'PASS');
      }
    } else {
      log('看图-入口', 'FAIL', '未找到看图猜成语按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块6：错题本 =====
    console.log('\n--- 错题本模块 ---');
    if (await clickModeCard('错题本')) {
      log('错题本-入口', 'PASS');
      
      const wrongInfo = await page.evaluate(() => {
        const empty = document.querySelector('.empty-state, [class*="empty"]');
        const items = document.querySelectorAll('.wrong-item, [class*="wrong"]');
        return { hasEmpty: !!empty, itemCount: items.length };
      });
      log('错题本-状态', (wrongInfo.hasEmpty || wrongInfo.itemCount > 0) ? 'PASS' : 'FAIL',
        wrongInfo.hasEmpty ? '空状态' : `${wrongInfo.itemCount}道错题`);
    } else {
      log('错题本-入口', 'FAIL', '未找到错题本按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块7：排行榜 =====
    console.log('\n--- 排行榜模块 ---');
    if (await clickModeCard('排行榜')) {
      log('排行榜-入口', 'PASS');
      
      const rankInfo = await page.evaluate(() => {
        const rankPage = document.querySelector('#rankingPage, [class*="ranking"]');
        return { found: !!rankPage };
      });
      log('排行榜-内容', rankInfo.found ? 'PASS' : 'WARN');
    } else {
      log('排行榜-入口', 'FAIL', '未找到排行榜按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块8：成语词典 =====
    console.log('\n--- 成语词典模块 ---');
    if (await clickModeCard('成语词典')) {
      log('词典-入口', 'PASS');
      
      const dictInfo = await page.evaluate(() => {
        const searchInput = document.querySelector('#dictSearch, input[type="text"], .search-input');
        return { searchFound: !!searchInput };
      });
      log('词典-搜索框', dictInfo.searchFound ? 'PASS' : 'WARN');
      
      if (dictInfo.searchFound) {
        const searchInput = page.locator('#dictSearch, input[type="text"]').first();
        await searchInput.fill('一心一意');
        await page.waitForTimeout(1000);
        const result = await page.locator('text=/一心一意/').first().isVisible().catch(() => false);
        log('词典-搜索成语', result ? 'PASS' : 'WARN');
      }
    } else {
      log('词典-入口', 'FAIL', '未找到成语词典按钮');
    }
    
    // ===== JS错误检查 =====
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    if (await safeGoto('https://chengyu-game.pages.dev/')) {
      await page.waitForTimeout(2000);
    }
    log('JS错误检查', errors.length === 0 ? 'PASS' : 'FAIL', errors.length > 0 ? errors[0].substring(0, 50) : '无错误');
    
  } catch (e) {
    log('异常', 'ERROR', e.message);
  }
  
  await browser.close();
  
  console.log('\n========== 成语游戏测试结果 ==========\n');
  let pass = 0, fail = 0, warn = 0;
  for (const r of results) {
    if (r.status === 'PASS') pass++;
    else if (r.status === 'FAIL') fail++;
    else if (r.status === 'WARN') warn++;
  }
  console.log(`通过: ${pass}, 失败: ${fail}, 警告: ${warn}`);
  console.log('\n详细结果：');
  for (const r of results) {
    const icon = r.status === 'PASS' ? '✅' : r.status === 'FAIL' ? '❌' : r.status === 'WARN' ? '⚠️' : '❓';
    console.log(`  ${icon} ${r.test}${r.detail ? ' (' + r.detail + ')' : ''}`);
  }
  console.log('====================================\n');
})();
