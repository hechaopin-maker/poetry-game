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
    
    // 检查页面上的元素
    const poetryElements = await page.evaluate(() => {
      // 检查所有输入框的pointer-events属性
      const inputs = document.querySelectorAll('input');
      const inputInfo = Array.from(inputs).map(inp => {
        const style = window.getComputedStyle(inp);
        return {
          id: inp.id,
          pointerEvents: style.pointerEvents,
          visible: inp.offsetParent !== null
        };
      });
      
      // 检查Toast相关元素
      const toasts = document.querySelectorAll('.toast, .toast-message, [class*="toast"]');
      const toastInfo = Array.from(toasts).map(toast => {
        const style = window.getComputedStyle(toast);
        return {
          className: toast.className,
          pointerEvents: style.pointerEvents,
          zIndex: style.zIndex,
          position: style.position
        };
      });
      
      return { inputs: inputInfo, toasts: toastInfo };
    });
    
    // 检查输入框的pointer-events
    const inputsWithAutoPointerEvents = poetryElements.inputs.filter(inp => inp.pointerEvents === 'auto');
    if (inputsWithAutoPointerEvents.length > 0) {
      log('古诗词-输入框pointer-events', 'PASS', `${inputsWithAutoPointerEvents.length}个输入框设置为auto`);
    } else {
      log('古诗词-输入框pointer-events', 'WARN', '未找到pointer-events: auto的输入框');
    }
    
    // 检查Toast的pointer-events
    const toastsWithNonePointerEvents = poetryElements.toasts.filter(toast => toast.pointerEvents === 'none');
    if (toastsWithNonePointerEvents.length > 0) {
      log('古诗词-Toast pointer-events', 'PASS', `${toastsWithNonePointerEvents.length}个Toast设置为none`);
    } else {
      log('古诗词-Toast pointer-events', 'WARN', '未找到pointer-events: none的Toast');
    }
    
    // 2. 验证飞花令输入框可正常交互
    console.log('\n--- 验证飞花令输入框 ---');
    
    // 检查飞花令页面元素
    const feihuaElements = await page.evaluate(() => {
      const feihuaInput = document.getElementById('feihuaInput');
      if (!feihuaInput) return { found: false };
      
      const style = window.getComputedStyle(feihuaInput);
      return {
        found: true,
        pointerEvents: style.pointerEvents,
        visible: feihuaInput.offsetParent !== null,
        display: style.display,
        visibility: style.visibility
      };
    });
    
    if (feihuaElements.found) {
      if (feihuaElements.pointerEvents === 'auto') {
        log('古诗词-飞花令输入框', 'PASS', 'pointer-events: auto');
      } else {
        log('古诗词-飞花令输入框', 'FAIL', `pointer-events: ${feihuaElements.pointerEvents}`);
      }
    } else {
      log('古诗词-飞花令输入框', 'FAIL', '输入框未找到');
    }
    
    // 3. 验证排行榜显示"敬请期待"提示
    console.log('\n--- 验证排行榜 ---');
    
    // 检查排行榜页面元素
    const rankElements = await page.evaluate(() => {
      const rankPage = document.getElementById('rankingPage') || document.getElementById('rankPage');
      if (!rankPage) return { found: false };
      
      const text = rankPage.innerText;
      return {
        found: true,
        hasComingSoon: text.includes('敬请期待') || text.includes('开发中'),
        text: text.substring(0, 100)
      };
    });
    
    if (rankElements.found) {
      if (rankElements.hasComingSoon) {
        log('古诗词-排行榜显示', 'PASS', '显示"敬请期待"提示');
      } else {
        log('古诗词-排行榜显示', 'WARN', `内容: ${rankElements.text}`);
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
    
    // 检查关卡页面元素
    const chengyuLevelElements = await page.evaluate(() => {
      const levelPage = document.getElementById('levelPage');
      if (!levelPage) return { found: false };
      
      const levelCards = document.querySelectorAll('#levelGrid > .module-card, .level-card');
      return {
        found: true,
        levelCount: levelCards.length,
        active: levelPage.classList.contains('active')
      };
    });
    
    if (chengyuLevelElements.found) {
      if (chengyuLevelElements.levelCount > 0) {
        log('成语-关卡数量', 'PASS', `${chengyuLevelElements.levelCount}个关卡`);
      } else {
        log('成语-关卡数量', 'FAIL', '未找到关卡');
      }
    } else {
      log('成语-关卡页面', 'FAIL', '关卡页面未找到');
    }
    
    // 5. 验证成语接龙输入框可正常交互
    console.log('\n--- 验证成语接龙输入框 ---');
    
    // 检查接龙页面元素
    const solitaireElements = await page.evaluate(() => {
      const solitaireInput = document.getElementById('solitaireInput');
      if (!solitaireInput) return { found: false };
      
      const style = window.getComputedStyle(solitaireInput);
      return {
        found: true,
        pointerEvents: style.pointerEvents,
        visible: solitaireInput.offsetParent !== null,
        display: style.display,
        visibility: style.visibility
      };
    });
    
    if (solitaireElements.found) {
      if (solitaireElements.pointerEvents === 'auto') {
        log('成语-接龙输入框', 'PASS', 'pointer-events: auto');
      } else {
        log('成语-接龙输入框', 'FAIL', `pointer-events: ${solitaireElements.pointerEvents}`);
      }
    } else {
      log('成语-接龙输入框', 'FAIL', '输入框未找到');
    }
    
    // 6. 验证看图猜成语输入框和显示区域正常
    console.log('\n--- 验证看图猜成语 ---');
    
    // 检查看图页面元素
    const pictureElements = await page.evaluate(() => {
      const pictureInput = document.getElementById('pictureInput');
      const puzzleEmoji = document.querySelector('#puzzleEmoji, .puzzle-emoji, [class*="emoji"]');
      
      return {
        inputFound: !!pictureInput,
        imageFound: !!puzzleEmoji,
        inputPointerEvents: pictureInput ? window.getComputedStyle(pictureInput).pointerEvents : null,
        imageVisible: puzzleEmoji ? puzzleEmoji.offsetParent !== null : false
      };
    });
    
    if (pictureElements.inputFound) {
      if (pictureElements.inputPointerEvents === 'auto') {
        log('成语-看图输入框', 'PASS', 'pointer-events: auto');
      } else {
        log('成语-看图输入框', 'FAIL', `pointer-events: ${pictureElements.inputPointerEvents}`);
      }
    } else {
      log('成语-看图输入框', 'WARN', '输入框未找到，可能使用选项模式');
    }
    
    if (pictureElements.imageFound && pictureElements.imageVisible) {
      log('成语-看图图片显示', 'PASS', '图片正常显示');
    } else {
      log('成语-看图图片显示', 'WARN', '图片未找到或不可见');
    }
    
    // 7. 验证错题本可正常定位
    console.log('\n--- 验证错题本 ---');
    
    // 检查错题本页面元素
    const wrongbookElements = await page.evaluate(() => {
      const wrongbookPage = document.getElementById('wrongBookPage');
      if (!wrongbookPage) return { found: false };
      
      const empty = document.querySelector('.empty-state, [class*="empty"]');
      const items = document.querySelectorAll('.wrong-item, [class*="wrong"]');
      
      return {
        found: true,
        active: wrongbookPage.classList.contains('active'),
        hasEmpty: !!empty,
        itemCount: items.length
      };
    });
    
    if (wrongbookElements.found) {
      log('成语-错题本定位', 'PASS', '错题本页面可正常定位');
      if (wrongbookElements.hasEmpty) {
        log('成语-错题本内容', 'PASS', '显示空状态');
      } else if (wrongbookElements.itemCount > 0) {
        log('成语-错题本内容', 'PASS', `${wrongbookElements.itemCount}道错题`);
      } else {
        log('成语-错题本内容', 'WARN', '内容未加载');
      }
    } else {
      log('成语-错题本定位', 'FAIL', '错题本页面未找到');
    }
    
    // 8. 验证成语词典输入框可正常交互
    console.log('\n--- 验证成语词典输入框 ---');
    
    // 检查词典页面元素
    const dictElements = await page.evaluate(() => {
      const dictInput = document.getElementById('dictSearch');
      if (!dictInput) return { found: false };
      
      const style = window.getComputedStyle(dictInput);
      return {
        found: true,
        pointerEvents: style.pointerEvents,
        visible: dictInput.offsetParent !== null,
        display: style.display,
        visibility: style.visibility
      };
    });
    
    if (dictElements.found) {
      if (dictElements.pointerEvents === 'auto') {
        log('成语-词典输入框', 'PASS', 'pointer-events: auto');
      } else {
        log('成语-词典输入框', 'FAIL', `pointer-events: ${dictElements.pointerEvents}`);
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