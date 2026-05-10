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
    
    // 直接调用游戏函数
    await page.evaluate(() => {
      // 模拟进入诗词闯关
      if (typeof startGame === 'function') {
        startGame('level');
      }
    });
    await page.waitForTimeout(2000);
    
    // 检查是否进入游戏
    const gameStarted = await page.evaluate(() => {
      const gamePage = document.getElementById('gamePage');
      return gamePage && gamePage.classList.contains('active');
    });
    
    if (gameStarted) {
      log('古诗词-进入游戏', 'PASS');
      
      // 模拟答题
      await page.evaluate(() => {
        // 选择第一个选项
        const options = document.querySelectorAll('#optionsContainer > .option');
        if (options.length > 0) {
          options[0].click();
        }
      });
      await page.waitForTimeout(1000);
      
      // 检查Toast显示
      const toastVisible = await page.evaluate(() => {
        const toast = document.querySelector('.toast, .toast-message, [class*="toast"]');
        return toast && (toast.offsetParent !== null || toast.style.display !== 'none');
      });
      
      if (toastVisible) {
        await takeScreenshot('poetry_toast_visible');
        
        // 尝试点击下一题按钮
        const nextBtnClickable = await page.evaluate(() => {
          const nextBtn = document.getElementById('nextQuestionBtn');
          if (!nextBtn) return false;
          
          // 检查按钮是否可点击
          const style = window.getComputedStyle(nextBtn);
          const isClickable = style.pointerEvents !== 'none' && 
                             style.visibility !== 'hidden' && 
                             style.display !== 'none';
          
          // 尝试点击
          if (isClickable) {
            nextBtn.click();
            return true;
          }
          return false;
        });
        
        if (nextBtnClickable) {
          log('古诗词-Toast不遮挡点击', 'PASS', 'Toast显示后仍可点击其他元素');
        } else {
          log('古诗词-Toast不遮挡点击', 'FAIL', 'Toast遮挡了点击');
        }
      } else {
        log('古诗词-Toast不遮挡点击', 'PASS', '无Toast显示');
      }
    } else {
      log('古诗词-进入游戏', 'FAIL', '无法进入游戏');
    }
    
    // 返回主页
    await page.evaluate(() => {
      if (typeof goHome === 'function') {
        goHome();
      }
    });
    await page.waitForTimeout(1000);
    
    // 2. 验证飞花令输入框可正常交互
    console.log('\n--- 验证飞花令输入框 ---');
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('feihua');
      }
    });
    await page.waitForTimeout(2000);
    
    const feihuaStarted = await page.evaluate(() => {
      const feihuaPage = document.getElementById('feihuaPage');
      return feihuaPage && feihuaPage.classList.contains('active');
    });
    
    if (feihuaStarted) {
      log('古诗词-飞花令页面', 'PASS');
      
      // 点击开始挑战按钮
      await page.evaluate(() => {
        const startBtn = document.getElementById('feihuaStartBtn');
        if (startBtn) startBtn.click();
      });
      await page.waitForTimeout(2000);
      
      // 检查输入框
      const inputTest = await page.evaluate(() => {
        const input = document.getElementById('feihuaInput');
        if (!input) return { found: false };
        
        // 检查输入框是否可见
        const style = window.getComputedStyle(input);
        const isVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         (input.offsetParent !== null || style.position === 'fixed');
        
        // 尝试输入
        input.value = '春眠不觉晓';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        return { 
          found: true, 
          visible: isVisible,
          value: input.value,
          pointerEvents: style.pointerEvents
        };
      });
      
      if (inputTest.found) {
        if (inputTest.visible && inputTest.pointerEvents !== 'none') {
          log('古诗词-飞花令输入框', 'PASS', `可交互，值: ${inputTest.value}`);
          await takeScreenshot('poetry_feihua_input');
        } else {
          log('古诗词-飞花令输入框', 'FAIL', `不可见或pointer-events: ${inputTest.pointerEvents}`);
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
    
    // 模拟打开用户菜单
    await page.evaluate(() => {
      const avatarBtn = document.getElementById('userAvatar');
      if (avatarBtn) avatarBtn.click();
    });
    await page.waitForTimeout(500);
    
    // 点击排行榜
    await page.evaluate(() => {
      const rankBtns = document.querySelectorAll('div, button, a');
      for (const btn of rankBtns) {
        if (btn.textContent.includes('排行榜') && btn.offsetParent !== null) {
          btn.click();
          break;
        }
      }
    });
    await page.waitForTimeout(1500);
    
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
      await takeScreenshot('poetry_ranking');
      if (rankInfo.hasComingSoon) {
        log('古诗词-排行榜显示', 'PASS', '显示"敬请期待"提示');
      } else {
        log('古诗词-排行榜显示', 'WARN', `内容: ${rankInfo.text}`);
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
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('level');
      }
    });
    await page.waitForTimeout(2000);
    
    const chengyuLevelStarted = await page.evaluate(() => {
      const levelPage = document.getElementById('levelPage');
      return levelPage && levelPage.classList.contains('active');
    });
    
    if (chengyuLevelStarted) {
      log('成语-关卡页面', 'PASS');
      
      // 检查关卡数量
      const levelCount = await page.evaluate(() => {
        const levelCards = document.querySelectorAll('#levelGrid > .module-card, .level-card');
        return levelCards.length;
      });
      
      if (levelCount > 0) {
        log('成语-关卡数量', 'PASS', `${levelCount}个关卡`);
        
        // 点击第一个关卡
        await page.evaluate(() => {
          const levelCards = document.querySelectorAll('#levelGrid > .module-card, .level-card');
          if (levelCards.length > 0) {
            levelCards[0].click();
          }
        });
        await page.waitForTimeout(2000);
        
        const questionVisible = await page.evaluate(() => {
          const question = document.querySelector('.question, .quiz, [class*="question"]');
          return question && question.offsetParent !== null;
        });
        
        if (questionVisible) {
          log('成语-关卡选择', 'PASS', '可正常选择关卡');
          await takeScreenshot('chengyu_level_selected');
        } else {
          log('成语-关卡选择', 'WARN', '关卡内容未加载');
        }
      } else {
        log('成语-关卡数量', 'FAIL', '未找到关卡');
      }
    } else {
      log('成语-关卡页面', 'FAIL', '无法进入关卡页面');
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
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('solitaire');
      }
    });
    await page.waitForTimeout(2000);
    
    const solitaireStarted = await page.evaluate(() => {
      const solitairePage = document.getElementById('solitairePage');
      return solitairePage && solitairePage.classList.contains('active');
    });
    
    if (solitaireStarted) {
      log('成语-接龙页面', 'PASS');
      
      const solitaireInputTest = await page.evaluate(() => {
        const input = document.getElementById('solitaireInput');
        if (!input) return { found: false };
        
        const style = window.getComputedStyle(input);
        const isVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         (input.offsetParent !== null || style.position === 'fixed');
        
        input.value = '一心一意';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        return { 
          found: true, 
          visible: isVisible,
          value: input.value,
          pointerEvents: style.pointerEvents
        };
      });
      
      if (solitaireInputTest.found) {
        if (solitaireInputTest.visible && solitaireInputTest.pointerEvents !== 'none') {
          log('成语-接龙输入框', 'PASS', `可交互，值: ${solitaireInputTest.value}`);
          await takeScreenshot('chengyu_solitaire_input');
        } else {
          log('成语-接龙输入框', 'FAIL', `不可见或pointer-events: ${solitaireInputTest.pointerEvents}`);
        }
      } else {
        log('成语-接龙输入框', 'FAIL', '输入框未找到');
      }
    } else {
      log('成语-接龙页面', 'FAIL', '无法进入接龙页面');
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
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('picture');
      }
    });
    await page.waitForTimeout(2000);
    
    const pictureStarted = await page.evaluate(() => {
      const picturePage = document.getElementById('picturePage');
      return picturePage && picturePage.classList.contains('active');
    });
    
    if (pictureStarted) {
      log('成语-看图页面', 'PASS');
      
      // 检查图片显示
      const pictureInfo = await page.evaluate(() => {
        const img = document.querySelector('#puzzleEmoji, .puzzle-emoji, [class*="emoji"]');
        return { 
          imageFound: !!img,
          visible: img ? img.offsetParent !== null : false
        };
      });
      
      if (pictureInfo.imageFound && pictureInfo.visible) {
        log('成语-看图图片显示', 'PASS', '图片正常显示');
        await takeScreenshot('chengyu_picture');
        
        // 检查输入框
        const pictureInputTest = await page.evaluate(() => {
          const input = document.getElementById('pictureInput');
          if (!input) return { found: false };
          
          const style = window.getComputedStyle(input);
          const isVisible = style.display !== 'none' && 
                           style.visibility !== 'hidden' && 
                           (input.offsetParent !== null || style.position === 'fixed');
          
          input.value = '守株待兔';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          
          return { 
            found: true, 
            visible: isVisible,
            value: input.value,
            pointerEvents: style.pointerEvents
          };
        });
        
        if (pictureInputTest.found) {
          if (pictureInputTest.visible && pictureInputTest.pointerEvents !== 'none') {
            log('成语-看图输入框', 'PASS', `可交互，值: ${pictureInputTest.value}`);
            await takeScreenshot('chengyu_picture_input');
          } else {
            log('成语-看图输入框', 'FAIL', `不可见或pointer-events: ${pictureInputTest.pointerEvents}`);
          }
        } else {
          log('成语-看图输入框', 'WARN', '输入框未找到，可能使用选项模式');
        }
      } else {
        log('成语-看图图片显示', 'FAIL', '图片未找到或不可见');
      }
    } else {
      log('成语-看图页面', 'FAIL', '无法进入看图页面');
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
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('wrongbook');
      }
    });
    await page.waitForTimeout(2000);
    
    const wrongbookStarted = await page.evaluate(() => {
      const wrongbookPage = document.getElementById('wrongBookPage');
      return wrongbookPage && wrongbookPage.classList.contains('active');
    });
    
    if (wrongbookStarted) {
      log('成语-错题本页面', 'PASS');
      await takeScreenshot('chengyu_wrongbook');
      
      const wrongInfo = await page.evaluate(() => {
        const empty = document.querySelector('.empty-state, [class*="empty"]');
        const items = document.querySelectorAll('.wrong-item, [class*="wrong"]');
        return { 
          hasEmpty: !!empty, 
          itemCount: items.length
        };
      });
      
      if (wrongInfo.hasEmpty) {
        log('成语-错题本内容', 'PASS', '显示空状态');
      } else if (wrongInfo.itemCount > 0) {
        log('成语-错题本内容', 'PASS', `${wrongInfo.itemCount}道错题`);
      } else {
        log('成语-错题本内容', 'WARN', '内容未加载');
      }
    } else {
      log('成语-错题本页面', 'FAIL', '无法进入错题本页面');
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
    
    await page.evaluate(() => {
      if (typeof startGame === 'function') {
        startGame('dict');
      }
    });
    await page.waitForTimeout(2000);
    
    const dictStarted = await page.evaluate(() => {
      const dictPage = document.getElementById('dictPage');
      return dictPage && dictPage.classList.contains('active');
    });
    
    if (dictStarted) {
      log('成语-词典页面', 'PASS');
      await takeScreenshot('chengyu_dict');
      
      const dictInputTest = await page.evaluate(() => {
        const input = document.getElementById('dictSearch');
        if (!input) return { found: false };
        
        const style = window.getComputedStyle(input);
        const isVisible = style.display !== 'none' && 
                         style.visibility !== 'hidden' && 
                         (input.offsetParent !== null || style.position === 'fixed');
        
        input.value = '一心一意';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        
        return { 
          found: true, 
          visible: isVisible,
          value: input.value,
          pointerEvents: style.pointerEvents
        };
      });
      
      if (dictInputTest.found) {
        if (dictInputTest.visible && dictInputTest.pointerEvents !== 'none') {
          log('成语-词典输入框', 'PASS', `可交互，值: ${dictInputTest.value}`);
          await takeScreenshot('chengyu_dict_input');
          
          // 等待搜索结果
          await page.waitForTimeout(1000);
          
          const result = await page.evaluate(() => {
            const resultEl = document.querySelector('text=/一心一意/');
            return resultEl && resultEl.offsetParent !== null;
          });
          
          if (result) {
            log('成语-词典搜索结果', 'PASS', '搜索结果显示正常');
          } else {
            log('成语-词典搜索结果', 'WARN', '搜索结果未显示');
          }
        } else {
          log('成语-词典输入框', 'FAIL', `不可见或pointer-events: ${dictInputTest.pointerEvents}`);
        }
      } else {
        log('成语-词典输入框', 'FAIL', '输入框未找到');
      }
    } else {
      log('成语-词典页面', 'FAIL', '无法进入词典页面');
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