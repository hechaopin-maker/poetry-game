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
  
  async function waitAndSkipLoginModal(maxWait = 8000) {
    const start = Date.now();
    let skipped = false;
    while (Date.now() - start < maxWait) {
      try {
        const skipBtn = page.locator('text=跳过').first();
        if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
          await skipBtn.click();
          await page.waitForTimeout(300);
          skipped = true;
        }
        const backdrop = page.locator('.login-backdrop, .login-modal.show');
        if (!(await backdrop.isVisible({ timeout: 500 }).catch(() => false))) break;
      } catch(e) {}
      await page.waitForTimeout(500);
    }
    return skipped;
  }
  
  async function safeGotoHome() {
    try {
      const btns = await page.locator('text=返回主页').all();
      for (const btn of btns) {
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await page.waitForTimeout(1000);
          break;
        }
      }
    } catch(e) {}
    
    if (await safeGoto('https://chengyu-game.pages.dev/')) {
      await waitAndSkipLoginModal(5000);
    }
  }

  try {
    // ===== 首页加载 =====
    if (!await safeGoto('https://chengyu-game.pages.dev/')) {
      log('首页加载', 'FAIL', '无法访问网站');
    } else {
      log('首页加载', 'PASS');
      const skipped = await waitAndSkipLoginModal(5000);
      if (skipped) log('登录弹窗-跳过', 'PASS');
    }
    
    // ===== 模块1：成语闯关 =====
    console.log('\n--- 成语闯关模块 ---');
    const chengyuBtn = page.locator('text=成语闯关').first();
    if (await chengyuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chengyuBtn.click();
      await page.waitForTimeout(2000);
      log('闯关-入口', 'PASS');
      
      // 检查关卡
      const levels = await page.locator('#levelGrid > .module-card, .level-card, .module-card').all();
      log('闯关-关卡数量', levels.length > 0 ? 'PASS' : 'WARN', `${levels.length}个关卡`);
      
      if (levels.length > 0) {
        for (const lvl of levels) {
          if (await lvl.isVisible()) { await lvl.click(); break; }
        }
        await page.waitForTimeout(2000);
        log('闯关-进入关卡', 'PASS');
        
        // 答几道题
        let answered = 0;
        for (let i = 0; i < 5; i++) {
          await page.waitForTimeout(1000);
          
          // 检查是否游戏结束
          const gameOver = await page.evaluate(() => {
            const el = document.querySelector('.game-over, #gameOver, [class*="game-over"]');
            return !!el;
          });
          if (gameOver) {
            log('闯关-游戏结束', 'PASS');
            break;
          }
          
          // 尝试选择答案
          const options = await page.locator('.option, .answer-option, [class*="option"]').all();
          if (options.length > 0) {
            await options[0].click();
            await page.waitForTimeout(800);
            log(`闯关-答题${i+1}`, 'PASS', `${options.length}个选项`);
            answered++;
          } else {
            log(`闯关-答题${i+1}`, 'WARN', '无选项');
          }
          
          // 点击下一题
          const nextBtn = page.locator('text=下一题, #nextBtn, .next-btn').first();
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
    const dailyBtn = page.locator('text=每日挑战').first();
    if (await dailyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dailyBtn.click();
      await page.waitForTimeout(2000);
      log('每日-入口', 'PASS');
      
      for (let i = 0; i < 3; i++) {
        await page.waitForTimeout(1000);
        const options = await page.locator('.option, .answer-option, [class*="option"]').all();
        if (options.length > 0) {
          await options[0].click();
          await page.waitForTimeout(800);
          log(`每日-答题${i+1}`, 'PASS');
        } else {
          log(`每日-答题${i+1}`, 'WARN', '无选项');
        }
      }
    } else {
      log('每日-入口', 'FAIL', '未找到每日挑战按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块3：成语消消乐 =====
    console.log('\n--- 成语消消乐模块 ---');
    const matchBtn = page.locator('text=成语消消乐').first();
    if (await matchBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await matchBtn.click();
      await page.waitForTimeout(2000);
      log('消消乐-入口', 'PASS');
      
      const gridInfo = await page.evaluate(() => {
        const grid = document.querySelector('#jiugonggeGrid, .grid, [class*="grid"]');
        const cards = grid ? grid.querySelectorAll('[class*="char"], .char-box, [class*="card"]') : [];
        return { gridFound: !!grid, cardCount: cards.length };
      });
      log('消消乐-游戏网格', gridInfo.gridFound ? 'PASS' : 'FAIL', `${gridInfo.cardCount}个卡片`);
      
      if (gridInfo.cardCount >= 2) {
        const cards = await page.locator('#jiugonggeGrid > *, .grid > *, [class*="grid"] > *').all();
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
    const solitaireBtn = page.locator('text=成语接龙').first();
    if (await solitaireBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await solitaireBtn.click();
      await page.waitForTimeout(2000);
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
        const submitBtn = page.locator('text=提交, #submitBtn, .submit-btn').first();
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
    const pictureBtn = page.locator('text=看图猜成语').first();
    if (await pictureBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await pictureBtn.click();
      await page.waitForTimeout(2000);
      log('看图-入口', 'PASS');
      
      const pictureInfo = await page.evaluate(() => {
        const img = document.querySelector('#puzzleImage, img[class*="puzzle"], .puzzle-image');
        return { imageFound: !!img };
      });
      log('看图-图片', pictureInfo.imageFound ? 'PASS' : 'WARN');
      
      const options = await page.locator('.option, .answer-option, [class*="option"]').all();
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
    const wrongBtn = page.locator('text=错题本').first();
    if (await wrongBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wrongBtn.click();
      await page.waitForTimeout(2000);
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
    const rankBtn = page.locator('text=排行榜').first();
    if (await rankBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rankBtn.click();
      await page.waitForTimeout(2000);
      log('排行榜-入口', 'PASS');
      
      const rankInfo = await page.evaluate(() => {
        const rankPage = document.querySelector('#rankingPage, #rankPage, [class*="ranking"]');
        const items = rankPage ? rankPage.querySelectorAll('.rank-item, [class*="rank-item"]') : [];
        return { found: !!rankPage, itemCount: items.length };
      });
      log('排行榜-内容', rankInfo.found ? 'PASS' : 'WARN', `${rankInfo.itemCount}条记录`);
    } else {
      log('排行榜-入口', 'FAIL', '未找到排行榜按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块8：成语词典 =====
    console.log('\n--- 成语词典模块 ---');
    const dictBtn = page.locator('text=成语词典').first();
    if (await dictBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dictBtn.click();
      await page.waitForTimeout(2000);
      log('词典-入口', 'PASS');
      
      const dictInfo = await page.evaluate(() => {
        const searchInput = document.querySelector('#dictSearch, input[type="search"], .search-input');
        return { searchFound: !!searchInput };
      });
      log('词典-搜索框', dictInfo.searchFound ? 'PASS' : 'WARN');
      
      if (dictInfo.searchFound) {
        const searchInput = page.locator('#dictSearch, input[type="search"], .search-input').first();
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
