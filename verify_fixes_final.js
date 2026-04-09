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
      
      // 跳过登录弹窗
      try {
        const skipBtn = page.locator('text=跳过').first();
        if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await skipBtn.click();
          await page.waitForTimeout(1000);
        }
      } catch(e) {}
      
      await takeScreenshot('poetry_home');
    }
    
    // 1. 验证Toast不再遮挡点击交互
    console.log('\n--- 验证Toast遮挡问题 ---');
    
    // 检查输入框的pointer-events属性
    const poetryInputCheck = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input');
      const inputInfo = Array.from(inputs).map(inp => {
        const style = window.getComputedStyle(inp);
        return {
          id: inp.id,
          pointerEvents: style.pointerEvents
        };
      });
      
      // 检查Toast相关元素
      const toasts = document.querySelectorAll('.toast, .toast-message, [class*="toast"]');
      const toastInfo = Array.from(toasts).map(toast => {
        const style = window.getComputedStyle(toast);
        return {
          className: toast.className,
          pointerEvents: style.pointerEvents
        };
      });
      
      return { inputs: inputInfo, toasts: toastInfo };
    });
    
    // 检查输入框的pointer-events
    const inputsWithAutoPointerEvents = poetryInputCheck.inputs.filter(inp => inp.pointerEvents === 'auto');
    if (inputsWithAutoPointerEvents.length > 0) {
      log('古诗词-输入框pointer-events', 'PASS', `${inputsWithAutoPointerEvents.length}个输入框设置为auto`);
    } else {
      log('古诗词-输入框pointer-events', 'FAIL', '未找到pointer-events: auto的输入框');
    }
    
    // 检查Toast的pointer-events
    const toastsWithNonePointerEvents = poetryInputCheck.toasts.filter(toast => toast.pointerEvents === 'none');
    if (toastsWithNonePointerEvents.length > 0) {
      log('古诗词-Toast pointer-events', 'PASS', `${toastsWithNonePointerEvents.length}个Toast设置为none`);
    } else {
      log('古诗词-Toast pointer-events', 'WARN', '未找到pointer-events: none的Toast');
    }
    
    // 2. 验证飞花令输入框可正常交互
    console.log('\n--- 验证飞花令输入框 ---');
    
    // 导航到飞花令页面
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('feihua');
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查飞花令页面是否激活
    const feihuaPageActive = await page.evaluate(() => {
      const feihuaPage = document.getElementById('feihuaPage');
      return feihuaPage && feihuaPage.classList.contains('active');
    });
    
    if (feihuaPageActive) {
      log('古诗词-飞花令页面', 'PASS');
      
      // 点击开始挑战按钮
      await page.evaluate(() => {
        const startBtn = document.getElementById('feihuaStartBtn');
        if (startBtn) startBtn.click();
      });
      await page.waitForTimeout(2000);
      
      // 检查输入框
      const feihuaInputCheck = await page.evaluate(() => {
        const input = document.getElementById('feihuaInput');
        if (!input) return { found: false };
        
        const style = window.getComputedStyle(input);
        return {
          found: true,
          pointerEvents: style.pointerEvents,
          visible: input.offsetParent !== null,
          display: style.display,
          visibility: style.visibility
        };
      });
      
      if (feihuaInputCheck.found) {
        if (feihuaInputCheck.pointerEvents === 'auto') {
          log('古诗词-飞花令输入框', 'PASS', 'pointer-events: auto');
          await takeScreenshot('poetry_feihua_input');
        } else {
          log('古诗词-飞花令输入框', 'FAIL', `pointer-events: ${feihuaInputCheck.pointerEvents}`);
        }
      } else {
        log('古诗词-飞花令输入框', 'FAIL', '输入框未找到');
      }
    } else {
      log('古诗词-飞花令页面', 'FAIL', '无法进入飞花令页面');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 3. 验证排行榜显示"敬请期待"提示
    console.log('\n--- 验证排行榜 ---');
    
    // 检查排行榜页面
    const rankCheck = await page.evaluate(() => {
      const rankPage = document.getElementById('rankingPage');
      if (!rankPage) return { found: false };
      
      const text = rankPage.innerText;
      return {
        found: true,
        hasComingSoon: text.includes('敬请期待') || text.includes('开发中'),
        text: text.substring(0, 100)
      };
    });
    
    if (rankCheck.found) {
      if (rankCheck.hasComingSoon) {
        log('古诗词-排行榜显示', 'PASS', '显示"敬请期待"提示');
      } else {
        log('古诗词-排行榜显示', 'WARN', `内容: ${rankCheck.text}`);
      }
    } else {
      log('古诗词-排行榜显示', 'FAIL', '排行榜页面未找到');
    }
    
    // ===== 成语游戏测试 =====
    console.log('\n\n--- 成语游戏 ---');
    
    if (!await safeGoto('https://chengyu-game.pages.dev/')) {
      log('成语-首页加载', 'FAIL', '无法访问网站');
    } else {
      log('成语-首页加载', 'PASS');
      await page.waitForTimeout(2000);
      
      // 检查是否需要登录
      const loginNeeded = await page.evaluate(() => {
        const loginPage = document.getElementById('login');
        return loginPage && loginPage.classList.contains('active');
      });
      
      if (loginNeeded) {
        // 模拟登录
        await page.evaluate(() => {
          const loginInput = document.getElementById('username-input');
          if (loginInput) {
            loginInput.value = '测试用户';
            loginInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
          const buttons = document.querySelectorAll('button');
          for (const btn of buttons) {
            if (btn.textContent.includes('开始学习')) {
              btn.click();
              break;
            }
          }
        });
        await page.waitForTimeout(1500);
        log('成语-登录', 'PASS');
      }
      
      await takeScreenshot('chengyu_home');
    }
    
    // 4. 验证关卡可正常选择
    console.log('\n--- 验证关卡选择 ---');
    
    // 导航到关卡选择页面
    await page.evaluate(() => {
      if (typeof showLevelSelect === 'function') {
        showLevelSelect();
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查关卡页面
    const chengyuLevelCheck = await page.evaluate(() => {
      // 查找关卡相关的元素
      const levelElements = document.querySelectorAll('[class*="level"], [id*="level"]');
      const levelCards = document.querySelectorAll('[class*="card"]');
      
      return {
        levelElementCount: levelElements.length,
        levelCardCount: levelCards.length,
        hasLevelGrid: !!document.getElementById('levelGrid')
      };
    });
    
    if (chengyuLevelCheck.hasLevelGrid || chengyuLevelCheck.levelCardCount > 0) {
      log('成语-关卡选择', 'PASS', `${chengyuLevelCheck.levelCardCount}个关卡卡片`);
    } else {
      log('成语-关卡选择', 'FAIL', '未找到关卡元素');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 5. 验证成语接龙输入框可正常交互
    console.log('\n--- 验证成语接龙输入框 ---');
    
    // 导航到接龙页面
    await page.evaluate(() => {
      if (typeof showIdiomChain === 'function') {
        showIdiomChain();
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查接龙输入框
    const solitaireCheck = await page.evaluate(() => {
      const input = document.getElementById('chain-input');
      if (!input) return { found: false };
      
      const style = window.getComputedStyle(input);
      return {
        found: true,
        pointerEvents: style.pointerEvents,
        visible: input.offsetParent !== null,
        display: style.display,
        visibility: style.visibility
      };
    });
    
    if (solitaireCheck.found) {
      if (solitaireCheck.pointerEvents === 'auto') {
        log('成语-接龙输入框', 'PASS', 'pointer-events: auto');
        await takeScreenshot('chengyu_solitaire_input');
      } else {
        log('成语-接龙输入框', 'FAIL', `pointer-events: ${solitaireCheck.pointerEvents}`);
      }
    } else {
      log('成语-接龙输入框', 'FAIL', '输入框未找到');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 6. 验证看图猜成语输入框和显示区域正常
    console.log('\n--- 验证看图猜成语 ---');
    
    // 导航到看图页面
    await page.evaluate(() => {
      if (typeof showEmojiGuess === 'function') {
        showEmojiGuess();
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查看图页面元素
    const pictureCheck = await page.evaluate(() => {
      const input = document.getElementById('emoji-input');
      const emojiDisplay = document.querySelector('[class*="emoji"], [id*="emoji"]');
      
      return {
        inputFound: !!input,
        inputPointerEvents: input ? window.getComputedStyle(input).pointerEvents : null,
        imageFound: !!emojiDisplay,
        imageVisible: emojiDisplay ? emojiDisplay.offsetParent !== null : false
      };
    });
    
    if (pictureCheck.inputFound) {
      if (pictureCheck.inputPointerEvents === 'auto') {
        log('成语-看图输入框', 'PASS', 'pointer-events: auto');
        await takeScreenshot('chengyu_picture_input');
      } else {
        log('成语-看图输入框', 'FAIL', `pointer-events: ${pictureCheck.inputPointerEvents}`);
      }
    } else {
      log('成语-看图输入框', 'WARN', '输入框未找到');
    }
    
    if (pictureCheck.imageFound && pictureCheck.imageVisible) {
      log('成语-看图图片显示', 'PASS', '图片正常显示');
    } else {
      log('成语-看图图片显示', 'WARN', '图片未找到或不可见');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 7. 验证错题本可正常定位
    console.log('\n--- 验证错题本 ---');
    
    // 导航到错题本页面
    await page.evaluate(() => {
      if (typeof showErrorBook === 'function') {
        showErrorBook();
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查错题本页面
    const wrongbookCheck = await page.evaluate(() => {
      // 查找错题本相关的元素
      const wrongElements = document.querySelectorAll('[class*="wrong"], [id*="wrong"], [class*="error"], [id*="error"]');
      
      return {
        elementCount: wrongElements.length,
        hasWrongPage: !!document.getElementById('wrongPage'),
        hasErrorBook: !!document.getElementById('errorBook')
      };
    });
    
    if (wrongbookCheck.hasWrongPage || wrongbookCheck.hasErrorBook || wrongbookCheck.elementCount > 0) {
      log('成语-错题本定位', 'PASS', '错题本页面可正常定位');
      await takeScreenshot('chengyu_wrongbook');
    } else {
      log('成语-错题本定位', 'FAIL', '错题本页面未找到');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 8. 验证成语词典输入框可正常交互
    console.log('\n--- 验证成语词典输入框 ---');
    
    // 导航到词典页面
    await page.evaluate(() => {
      if (typeof showDict === 'function') {
        showDict();
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查词典输入框
    const dictCheck = await page.evaluate(() => {
      const input = document.getElementById('search-input');
      if (!input) return { found: false };
      
      const style = window.getComputedStyle(input);
      return {
        found: true,
        pointerEvents: style.pointerEvents,
        visible: input.offsetParent !== null,
        display: style.display,
        visibility: style.visibility
      };
    });
    
    if (dictCheck.found) {
      if (dictCheck.pointerEvents === 'auto') {
        log('成语-词典输入框', 'PASS', 'pointer-events: auto');
        await takeScreenshot('chengyu_dict_input');
      } else {
        log('成语-词典输入框', 'FAIL', `pointer-events: ${dictCheck.pointerEvents}`);
      }
    } else {
      log('成语-词典输入框', 'FAIL', '输入框未找到');
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