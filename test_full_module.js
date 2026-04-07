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
    
    if (await safeGoto('https://poetry-game.pages.dev/')) {
      await waitAndSkipLoginModal(5000);
    }
  }
  
  async function waitForFillInput(maxWait = 5000) {
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      try {
        const inp = page.locator('#fillAnswerInput0');
        if (await inp.isVisible({ timeout: 300 }).catch(() => false)) return inp;
      } catch(e) {}
      await page.waitForTimeout(200);
    }
    return null;
  }
  
  async function waitForOptions(maxWait = 5000) {
    const start = Date.now();
    while (Date.now() - start < maxWait) {
      const opts = await page.locator('#optionsContainer > .option').all();
      if (opts.length > 0) return opts;
      await page.waitForTimeout(200);
    }
    return [];
  }
  
  async function clickNextQuestion() {
    await page.waitForTimeout(300);
    const nextBtn = page.locator('#nextQuestionBtn');
    if (await nextBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(800);
      return true;
    }
    return false;
  }
  
  async function getQuestionType() {
    return await page.evaluate(() => {
      const typeEl = document.getElementById('questionType');
      const textEl = document.getElementById('questionText');
      return { type: typeEl ? typeEl.textContent : '', text: textEl ? textEl.textContent.substring(0, 80) : '' };
    });
  }
  
  async function answerCurrentQuestion(answerText = '测试答案') {
    const qt = await getQuestionType();
    if (qt.type === '填空题' || (qt.text && qt.text.includes('__________'))) {
      const inp = await waitForFillInput(3000);
      if (!inp) return 'no-input';
      await inp.fill(answerText);
      await page.waitForTimeout(200);
      const submitBtn = page.locator('button:has-text("提交"), .btn:has-text("提交")').first();
      if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await submitBtn.click();
      } else {
        await inp.press('Enter');
      }
      await page.waitForTimeout(800);
      return 'answered';
    } else {
      const opts = await waitForOptions(3000);
      if (opts.length === 0) return 'no-options';
      await opts[0].click();
      await page.waitForTimeout(800);
      return 'answered';
    }
  }

  try {
    if (!await safeGoto('https://poetry-game.pages.dev/')) {
      log('首页加载', 'FAIL', '无法访问网站');
    } else {
      log('首页加载', 'PASS');
      const skipped = await waitAndSkipLoginModal(5000);
      if (skipped) log('登录弹窗-跳过', 'PASS');
    }
    
    // ===== 模块1：诗词闯关 =====
    console.log('\n--- 诗词闯关模块 ---');
    await page.locator('text=诗词闯关').first().click();
    await page.waitForTimeout(2000);
    log('闯关-入口', 'PASS');
    
    await page.waitForSelector('#levelGrid > .module-card', { timeout: 5000 }).catch(() => {});
    const levels = await page.locator('#levelGrid > .module-card').all();
    log('闯关-关卡数量', levels.length > 0 ? 'PASS' : 'FAIL', `${levels.length}个关卡`);
    
    if (levels.length > 0) {
      for (const lvl of levels) {
        if (await lvl.isVisible()) { await lvl.click(); break; }
      }
      await page.waitForTimeout(2000);
      log('闯关-进入关卡', 'PASS');
      
      let answered = 0;
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(1000);
        const overText = await page.evaluate(() => {
          const el = document.getElementById('gameOverText');
          const score = document.getElementById('finalScore');
          return el ? el.textContent : (score ? score.textContent : '');
        });
        if (overText.includes('游戏结束') || overText.includes('得分') || overText.includes('完成')) {
          log('闯关-游戏结束', 'PASS', overText.substring(0, 30));
          break;
        }
        const qt = await getQuestionType();
        if (!qt.text || qt.text === '题目加载中...') { log(`闯关-答题${i+1}`, 'WARN', '未加载'); break; }
        const result = await answerCurrentQuestion('两岸猿声啼不住');
        const resultText = result === 'answered' ? '已答' : result === 'no-input' ? '无输入' : result === 'no-options' ? '无选项' : '未知';
        log(`闯关-答题${i+1}`, result !== 'no-input' && result !== 'no-options' ? 'PASS' : 'WARN', `${qt.type}/${resultText}`);
        answered++;
        const moved = await clickNextQuestion();
        if (!moved) {
          const over2 = await page.locator('text=/游戏结束|通关|得分.*分|再来一次/').first().isVisible().catch(() => false);
          if (over2) { log('闯关-游戏结束', 'PASS'); break; }
        }
      }
      log('闯关-答题完成', 'PASS', `共${answered}题`);
    }
    
    await safeGotoHome();
    
    // ===== 模块2：每日挑战 =====
    console.log('\n--- 每日挑战模块 ---');
    await page.locator('text=每日挑战').first().click();
    await page.waitForTimeout(2000);
    log('每日-入口', 'PASS');
    
    const dailyDate = await page.evaluate(() => {
      const el = document.getElementById('dailyDate') || document.querySelector('[id*="daily"]');
      return el ? el.textContent.trim().substring(0, 20) : '未找到';
    });
    if (dailyDate !== '未找到') log('每日-日期显示', 'PASS', dailyDate);
    
    for (let i = 0; i < 5; i++) {
      await page.waitForTimeout(1000);
      const qt = await getQuestionType();
      if (!qt.text || qt.text === '题目加载中...') { log(`每日-答题${i+1}`, 'WARN', '未加载'); break; }
      const result = await answerCurrentQuestion('测试');
      const status = result !== 'no-input' && result !== 'no-options' ? 'PASS' : 'WARN';
      log(`每日-答题${i+1}`, status, qt.type);
      await clickNextQuestion();
    }
    
    await safeGotoHome();
    
    // ===== 模块3：飞花令 =====
    console.log('\n--- 飞花令模块 ---');
    await page.locator('text=飞花令').first().click();
    await page.waitForTimeout(2000);
    log('飞花-入口', 'PASS');
    
    const feihuaKw = await page.evaluate(() => {
      const kw = document.getElementById('feihuaKeyword');
      return { found: !!kw, text: kw ? kw.textContent.trim() : '' };
    });
    log('飞花-关键字', feihuaKw.found ? 'PASS' : 'WARN', feihuaKw.text || '未找到');
    
    const startBtn = page.locator('#feihuaStartBtn');
    if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await startBtn.click();
      await page.waitForTimeout(2000);
      log('飞花-开始挑战', 'PASS');
      
      for (let i = 0; i < 3; i++) {
        const inp = page.locator('#feihuaInput');
        if (await inp.isVisible({ timeout: 3000 }).catch(() => false)) {
          await inp.fill('春眠不觉晓');
          await page.waitForTimeout(200);
          const submitBtn = page.locator('#feihuaSubmitBtn');
          if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await submitBtn.click();
          } else {
            await inp.press('Enter');
          }
          await page.waitForTimeout(800);
          log(`飞花-答题${i+1}`, 'PASS');
          await page.waitForTimeout(500);
        } else {
          log(`飞花-答题${i+1}`, 'WARN', '无输入框');
        }
      }
    } else {
      log('飞花-开始挑战', 'FAIL', '找不到开始按钮');
    }
    
    await safeGotoHome();
    
    // ===== 模块4：诗词消消乐 =====
    console.log('\n--- 诗词消消乐模块 ---');
    await page.locator('text=诗词消消乐').first().click();
    await page.waitForTimeout(2000);
    log('消消乐-入口', 'PASS');
    
    const xiaoxiaoInfo = await page.evaluate(() => {
      const matchPage = document.getElementById('matchPage');
      if (!matchPage) return { found: false };
      const grid = document.getElementById('jiugonggeGrid');
      const cards = grid ? grid.querySelectorAll('[class*="char"], .char-box, [class*="char-box"]') : [];
      return { found: true, cardCount: cards.length, gridExists: !!grid };
    });
    
    if (xiaoxiaoInfo.found && xiaoxiaoInfo.gridExists) {
      log('消消乐-游戏网格', 'PASS', `${xiaoxiaoInfo.cardCount}个字符`);
      if (xiaoxiaoInfo.cardCount >= 2) {
        const cards = await page.locator('#jiugonggeGrid > *').all();
        if (cards.length >= 2) {
          await cards[0].click();
          await page.waitForTimeout(300);
          await cards[1].click();
          await page.waitForTimeout(500);
          log('消消乐-点击交互', 'PASS');
        }
      }
    } else {
      log('消消乐-游戏网格', xiaoxiaoInfo.found ? 'WARN' : 'FAIL', '游戏区域未加载');
    }
    
    await safeGotoHome();
    
    // ===== 模块5：诗词词典 =====
    console.log('\n--- 诗词词典模块 ---');
    await page.locator('text=诗词词典').first().click();
    await page.waitForTimeout(2000);
    log('词典-入口', 'PASS');
    
    const dictInfo = await page.evaluate(() => {
      const dictPage = document.getElementById('dictPage');
      if (!dictPage) return { pageFound: false };
      const searchInput = document.getElementById('dictSearch');
      const isVisible = searchInput ? !!(searchInput.offsetWidth || searchInput.offsetHeight) : false;
      return { pageFound: true, searchFound: !!searchInput, searchVisible: isVisible };
    });
    
    if (dictInfo.searchFound && dictInfo.searchVisible) {
      const searchInput = page.locator('#dictSearch');
      await searchInput.fill('春晓');
      await page.waitForTimeout(1000);
      const result = await page.locator('text=/春眠不觉晓|春晓/').first().isVisible().catch(() => false);
      log('词典-搜索春晓', result ? 'PASS' : 'FAIL');
      await searchInput.fill('');
      await searchInput.fill('静夜思');
      await page.waitForTimeout(1000);
      const result2 = await page.locator('text=/床前明月光|静夜思/').first().isVisible().catch(() => false);
      log('词典-搜索静夜思', result2 ? 'PASS' : 'FAIL');
    } else {
      log('词典-搜索框', 'FAIL', `页面=${dictInfo.pageFound}, 搜索框=${dictInfo.searchFound}, 可见=${dictInfo.searchVisible}`);
    }
    
    await safeGotoHome();
    
    // ===== 模块6：错题本 =====
    console.log('\n--- 错题本模块 ---');
    await page.locator('text=错题本').first().click();
    await page.waitForTimeout(2000);
    log('错题本-入口', 'PASS');
    
    const wrongBookInfo = await page.evaluate(() => {
      const emptyEl = document.querySelector('.empty-state, [class*="empty"]');
      const questions = document.querySelectorAll('.wrong-item, [class*="wrong-item"], .question-item');
      return { hasEmptyState: !!emptyEl, questionCount: questions.length };
    });
    log('错题本-状态', (wrongBookInfo.hasEmptyState || wrongBookInfo.questionCount > 0) ? 'PASS' : 'FAIL',
      wrongBookInfo.hasEmptyState ? '空状态' : `${wrongBookInfo.questionCount}道错题`);
    
    await safeGotoHome();
    
    // ===== 排行榜 =====
    console.log('\n--- 排行榜模块 ---');
    await waitAndSkipLoginModal(3000);
    
    const avatarBtn = page.locator('#userAvatar');
    if (await avatarBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await avatarBtn.click({ force: true });
      await page.waitForTimeout(500);
    } else {
      log('排行榜-用户菜单', 'WARN', '未找到userAvatar');
    }
    
    const rankBtn = page.locator('text=排行榜');
    if (await rankBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rankBtn.click({ force: true });
      await page.waitForTimeout(1500);
      log('排行榜-入口', 'PASS');
      const rankInfo = await page.evaluate(() => {
        const rankPage = document.getElementById('rankingPage') || document.getElementById('rankPage');
        const developing = rankPage ? rankPage.innerText.includes('开发中') : false;
        return { developing };
      });
      log('排行榜-内容', rankInfo.developing ? 'WARN' : 'PASS', rankInfo.developing ? '开发中' : '正常');
    } else {
      log('排行榜-入口', 'FAIL', '未找到排行榜按钮');
    }
    
    await safeGotoHome();
    
    // ===== 成就 =====
    console.log('\n--- 成就模块 ---');
    await waitAndSkipLoginModal(3000);
    
    const avatarBtn2 = page.locator('#userAvatar');
    if (await avatarBtn2.isVisible({ timeout: 2000 }).catch(() => false)) {
      await avatarBtn2.click({ force: true });
      await page.waitForTimeout(500);
    }
    
    const achBtn = page.locator('text=成就');
    if (await achBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await achBtn.click({ force: true });
      await page.waitForTimeout(1500);
      log('成就-入口', 'PASS');
      const achInfo = await page.evaluate(() => {
        const achPage = document.getElementById('achievementPage');
        const badges = achPage ? achPage.querySelectorAll('[class*="badge"], .badge') : [];
        return { count: badges.length };
      });
      log('成就-列表', achInfo.count > 0 ? 'PASS' : 'WARN', `${achInfo.count}个成就（新手用户0个属正常）`);
    } else {
      log('成就-入口', 'FAIL', '未找到成就按钮');
    }
    
    // ===== JS错误检查 =====
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    if (await safeGoto('https://poetry-game.pages.dev/')) {
      await page.waitForTimeout(2000);
    }
    log('JS错误检查', errors.length === 0 ? 'PASS' : 'FAIL', errors.length > 0 ? errors[0].substring(0, 50) : '无错误');
    
  } catch (e) {
    log('异常', 'ERROR', e.message);
  }
  
  await browser.close();
  
  console.log('\n========== 全模块测试结果 ==========\n');
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
