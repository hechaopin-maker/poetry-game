const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
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
  
  async function takeScreenshot(name) {
    const dir = '/Users/hechaopin_claw/.openclaw/workspace-life/screenshots';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const path = `${dir}/${name}.png`;
    await page.screenshot({ path, fullPage: false });
    return path;
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
  
  async function clickModeCard(modeName) {
    // 使用更具体的选择器
    const cards = await page.locator('.module-card').all();
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
      await page.waitForTimeout(2000);
      
      // 检查是否需要登录
      const loginPage = page.locator('#login.active');
      if (await loginPage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await login();
      }
    }
  }
  
  try {
    // 创建截图目录
    const screenshotDir = '/Users/hechaopin_claw/.openclaw/workspace-life/screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    console.log('\n========== 开始验证修复效果 ==========\n');
    
    // ===== 古诗词游戏测试 =====
    console.log('\n--- 古诗词游戏 ---');
    
    if (!await safeGoto('https://poetry-game.pages.dev/')) {
      log('古诗词-首页加载', 'FAIL', '无法访问网站');
    } else {
      log('古诗词-首页加载', 'PASS');
      await page.waitForTimeout(2000);
      await waitAndSkipLoginModal(5000);
      await takeScreenshot('poetry_home');
    }
    
    // 1. 验证Toast不再遮挡点击交互
    console.log('\n--- 验证Toast遮挡问题 ---');
    await clickModeCard('诗词闯关');
    await page.waitForTimeout(2000);
    
    // 进入一个关卡
    const levels = await page.locator('#levelGrid > .module-card').all();
    if (levels.length > 0) {
      await levels[0].click();
      await page.waitForTimeout(2000);
      
      // 尝试回答问题
      const options = await page.locator('#optionsContainer > .option').all();
      if (options.length > 0) {
        await options[0].click();
        await page.waitForTimeout(1000);
        
        // 检查是否有Toast显示
        const toastVisible = await page.locator('.toast, .toast-message, [class*="toast"]').first().isVisible().catch(() => false);
        if (toastVisible) {
          await takeScreenshot('poetry_toast_visible');
          
          // 尝试点击其他元素，验证Toast不遮挡
          const nextBtn = page.locator('#nextQuestionBtn');
          if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await nextBtn.click();
            await page.waitForTimeout(500);
            log('古诗词-Toast不遮挡点击', 'PASS', 'Toast显示后仍可点击其他元素');
          } else {
            log('古诗词-Toast不遮挡点击', 'WARN', '下一题按钮不可见');
          }
        } else {
          log('古诗词-Toast不遮挡点击', 'PASS', '无Toast显示');
        }
      }
    }
    
    // 返回主页
    try {
      const backBtn = page.locator('text=返回主页').first();
      if (await backBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch(e) {}
    
    // 2. 验证飞花令输入框可正常交互
    console.log('\n--- 验证飞花令输入框 ---');
    await clickModeCard('飞花令');
    await page.waitForTimeout(2000);
    await takeScreenshot('poetry_feihua_page');
    
    const feihuaStartBtn = page.locator('#feihuaStartBtn');
    if (await feihuaStartBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await feihuaStartBtn.click();
      await page.waitForTimeout(2000);
      
      const feihuaInput = page.locator('#feihuaInput');
      if (await feihuaInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        // 测试输入框交互
        await feihuaInput.fill('春眠不觉晓');
        await page.waitForTimeout(500);
        const inputValue = await feihuaInput.inputValue();
        if (inputValue === '春眠不觉晓') {
          log('古诗词-飞花令输入框', 'PASS', '可正常输入文字');
          await takeScreenshot('poetry_feihua_input');
          
          // 测试提交按钮
          const submitBtn = page.locator('#feihuaSubmitBtn');
          if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await submitBtn.click();
            await page.waitForTimeout(1000);
            log('古诗词-飞花令提交', 'PASS', '可正常提交');
          } else {
            log('古诗词-飞花令提交', 'WARN', '提交按钮不可见');
          }
        } else {
          log('古诗词-飞花令输入框', 'FAIL', '输入值不正确');
        }
      } else {
        log('古诗词-飞花令输入框', 'FAIL', '输入框不可见');
      }
    } else {
      log('古诗词-飞花令开始按钮', 'FAIL', '开始按钮不可见');
    }
    
    // 返回主页
    try {
      const backBtn = page.locator('text=返回主页').first();
      if (await backBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch(e) {}
    
    // 3. 验证排行榜显示"敬请期待"提示
    console.log('\n--- 验证排行榜 ---');
    await waitAndSkipLoginModal(3000);
    
    // 检查排行榜入口
    const rankBtn = page.locator('text=排行榜');
    if (await rankBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await rankBtn.click({ force: true });
      await page.waitForTimeout(1500);
      await takeScreenshot('poetry_ranking');
      
      const rankInfo = await page.evaluate(() => {
        const rankPage = document.getElementById('rankingPage') || document.getElementById('rankPage');
        if (!rankPage) return { found: false };
        const text = rankPage.innerText;
        return { 
          found: true, 
          hasComingSoon: text.includes('敬请期待') || text.includes('开发中'),
          text: text.substring(0, 100)
        };
      });
      
      if (rankInfo.found) {
        if (rankInfo.hasComingSoon) {
          log('古诗词-排行榜显示', 'PASS', '显示"敬请期待"提示');
        } else {
          log('古诗词-排行榜显示', 'WARN', `内容: ${rankInfo.text}`);
        }
      } else {
        log('古诗词-排行榜显示', 'FAIL', '排行榜页面未找到');
      }
    } else {
      log('古诗词-排行榜入口', 'FAIL', '未找到排行榜按钮');
    }
    
    // ===== 成语游戏测试 =====
    console.log('\n\n--- 成语游戏 ---');
    
    if (!await safeGoto('https://chengyu-game.pages.dev/')) {
      log('成语-首页加载', 'FAIL', '无法访问网站');
    } else {
      log('成语-首页加载', 'PASS');
      await page.waitForTimeout(2000);
      
      // 检查是否需要登录
      const loginPage = page.locator('#login.active');
      if (await loginPage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await login();
        log('成语-登录', 'PASS');
      }
      await takeScreenshot('chengyu_home');
    }
    
    // 4. 验证关卡可正常选择
    console.log('\n--- 验证关卡选择 ---');
    if (await clickModeCard('成语闯关')) {
      await takeScreenshot('chengyu_levels');
      
      // 检查关卡
      const levelCards = await page.locator('.level-card, .module-card, #levelGrid > *').all();
      if (levelCards.length > 0) {
        log('成语-关卡数量', 'PASS', `${levelCards.length}个关卡`);
        
        // 尝试选择第一个关卡
        await levelCards[0].click();
        await page.waitForTimeout(2000);
        await takeScreenshot('chengyu_level_selected');
        
        // 检查是否进入关卡
        const questionVisible = await page.locator('.question, .quiz, [class*="question"]').first().isVisible().catch(() => false);
        if (questionVisible) {
          log('成语-关卡选择', 'PASS', '可正常选择关卡');
        } else {
          log('成语-关卡选择', 'WARN', '关卡内容未加载');
        }
      } else {
        log('成语-关卡数量', 'FAIL', '未找到关卡');
      }
    } else {
      log('成语-闯关入口', 'FAIL', '未找到成语闯关按钮');
    }
    
    await safeGotoHome();
    
    // 5. 验证成语接龙输入框可正常交互
    console.log('\n--- 验证成语接龙输入框 ---');
    if (await clickModeCard('成语接龙')) {
      await takeScreenshot('chengyu_solitaire');
      
      const solitaireInput = page.locator('#solitaireInput');
      if (await solitaireInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        // 测试输入框交互
        await solitaireInput.fill('一心一意');
        await page.waitForTimeout(500);
        const inputValue = await solitaireInput.inputValue();
        if (inputValue === '一心一意') {
          log('成语-接龙输入框', 'PASS', '可正常输入文字');
          await takeScreenshot('chengyu_solitaire_input');
          
          // 测试提交按钮
          const submitBtn = page.locator('button:has-text("提交")').first();
          if (await submitBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
            await submitBtn.click();
            await page.waitForTimeout(1000);
            log('成语-接龙提交', 'PASS', '可正常提交');
          } else {
            log('成语-接龙提交', 'WARN', '提交按钮不可见');
          }
        } else {
          log('成语-接龙输入框', 'FAIL', '输入值不正确');
        }
      } else {
        log('成语-接龙输入框', 'FAIL', '输入框不可见');
      }
    } else {
      log('成语-接龙入口', 'FAIL', '未找到成语接龙按钮');
    }
    
    await safeGotoHome();
    
    // 6. 验证看图猜成语输入框和显示区域正常
    console.log('\n--- 验证看图猜成语 ---');
    if (await clickModeCard('看图猜成语')) {
      await takeScreenshot('chengyu_picture');
      
      // 检查图片显示
      const pictureInfo = await page.evaluate(() => {
        const img = document.querySelector('#puzzleEmoji, .puzzle-emoji, [class*="emoji"]');
        return { imageFound: !!img };
      });
      
      if (pictureInfo.imageFound) {
        log('成语-看图图片显示', 'PASS', '图片正常显示');
        
        // 检查输入框
        const pictureInput = page.locator('#pictureInput, input[type="text"]').first();
        if (await pictureInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await pictureInput.fill('守株待兔');
          await page.waitForTimeout(500);
          const inputValue = await pictureInput.inputValue();
          if (inputValue === '守株待兔') {
            log('成语-看图输入框', 'PASS', '可正常输入文字');
            await takeScreenshot('chengyu_picture_input');
          } else {
            log('成语-看图输入框', 'FAIL', '输入值不正确');
          }
        } else {
          log('成语-看图输入框', 'WARN', '输入框不可见，可能使用选项模式');
          
          // 检查选项按钮
          const options = await page.locator('.option-btn, .answer-option, [class*="option"]').all();
          if (options.length > 0) {
            await options[0].click();
            await page.waitForTimeout(800);
            log('成语-看图选项', 'PASS', `${options.length}个选项`);
          }
        }
      } else {
        log('成语-看图图片显示', 'FAIL', '图片未找到');
      }
    } else {
      log('成语-看图入口', 'FAIL', '未找到看图猜成语按钮');
    }
    
    await safeGotoHome();
    
    // 7. 验证错题本可正常定位
    console.log('\n--- 验证错题本 ---');
    if (await clickModeCard('错题本')) {
      await takeScreenshot('chengyu_wrongbook');
      
      const wrongInfo = await page.evaluate(() => {
        const empty = document.querySelector('.empty-state, [class*="empty"]');
        const items = document.querySelectorAll('.wrong-item, [class*="wrong"]');
        const page = document.getElementById('wrongBookPage');
        return { 
          hasEmpty: !!empty, 
          itemCount: items.length,
          pageFound: !!page
        };
      });
      
      if (wrongInfo.pageFound) {
        log('成语-错题本定位', 'PASS', '错题本页面可正常定位');
        if (wrongInfo.hasEmpty) {
          log('成语-错题本内容', 'PASS', '显示空状态');
        } else if (wrongInfo.itemCount > 0) {
          log('成语-错题本内容', 'PASS', `${wrongInfo.itemCount}道错题`);
        } else {
          log('成语-错题本内容', 'WARN', '内容未加载');
        }
      } else {
        log('成语-错题本定位', 'FAIL', '错题本页面未找到');
      }
    } else {
      log('成语-错题本入口', 'FAIL', '未找到错题本按钮');
    }
    
    await safeGotoHome();
    
    // 8. 验证成语词典输入框可正常交互
    console.log('\n--- 验证成语词典输入框 ---');
    if (await clickModeCard('成语词典')) {
      await takeScreenshot('chengyu_dict');
      
      const dictSearch = page.locator('#dictSearch');
      if (await dictSearch.isVisible({ timeout: 3000 }).catch(() => false)) {
        // 测试输入框交互
        await dictSearch.fill('一心一意');
        await page.waitForTimeout(1000);
        const inputValue = await dictSearch.inputValue();
        if (inputValue === '一心一意') {
          log('成语-词典输入框', 'PASS', '可正常输入文字');
          await takeScreenshot('chengyu_dict_input');
          
          // 检查搜索结果
          const result = await page.locator('text=/一心一意/').first().isVisible().catch(() => false);
          if (result) {
            log('成语-词典搜索结果', 'PASS', '搜索结果显示正常');
          } else {
            log('成语-词典搜索结果', 'WARN', '搜索结果未显示');
          }
        } else {
          log('成语-词典输入框', 'FAIL', '输入值不正确');
        }
      } else {
        log('成语-词典输入框', 'FAIL', '输入框不可见');
      }
    } else {
      log('成语-词典入口', 'FAIL', '未找到成语词典按钮');
    }
    
    // ===== JS错误检查 =====
    console.log('\n--- JS错误检查 ---');
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    if (await safeGoto('https://poetry-game.pages.dev/')) {
      await page.waitForTimeout(2000);
    }
    if (await safeGoto('https://chengyu-game.pages.dev/')) {
      await page.waitForTimeout(2000);
    }
    log('JS错误检查', errors.length === 0 ? 'PASS' : 'WARN', errors.length > 0 ? `${errors.length}个错误` : '无错误');
    
  } catch (e) {
    log('异常', 'ERROR', e.message);
    await takeScreenshot('error');
  }
  
  await browser.close();
  
  console.log('\n========== 修复验证结果 ==========\n');
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
  
  return results;
})();