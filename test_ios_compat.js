const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // iOS模拟配置 (iPhone 14)
  const iosContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });
  
  // 桌面配置
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const results = [];
  const log = (test, status, detail) => {
    const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : status === 'WARN' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${status}] ${test}${detail ? ': ' + detail : ''}`);
    results.push({ test, status, detail });
  };
  
  // ===== iOS测试 =====
  console.log('\n========== iOS兼容性测试 ==========\n');
  
  // 古诗词游戏 - iOS
  console.log('--- 古诗词游戏 (iOS) ---');
  const iosPage1 = await iosContext.newPage();
  try {
    await iosPage1.goto('https://poetry-game.pages.dev/', { waitUntil: 'networkidle', timeout: 60000 });
    await iosPage1.waitForTimeout(2000);
    log('古诗词-iOS-首页加载', 'PASS');
    
    // 截图
    await iosPage1.screenshot({ path: '/tmp/poetry_ios.png' });
    
    // 检查触摸交互
    const touchSupport = await iosPage1.evaluate(() => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });
    log('古诗词-iOS-触摸支持', touchSupport ? 'PASS' : 'WARN');
    
    // 检查响应式布局
    const viewport = await iosPage1.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    log('古诗词-iOS-视口尺寸', viewport.width <= 500 ? 'PASS' : 'WARN', `${viewport.width}x${viewport.height}`);
    
    // 测试诗词闯关入口
    const chengguanBtn = iosPage1.locator('text=诗词闯关').first();
    if (await chengguanBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await chengguanBtn.click();
      await iosPage1.waitForTimeout(2000);
      log('古诗词-iOS-闯关入口', 'PASS');
    } else {
      log('古诗词-iOS-闯关入口', 'FAIL');
    }
    
  } catch(e) {
    log('古诗词-iOS-测试', 'FAIL', e.message.substring(0, 50));
  }
  
  // 成语游戏 - iOS
  console.log('\n--- 成语游戏 (iOS) ---');
  const iosPage2 = await iosContext.newPage();
  try {
    await iosPage2.goto('https://chengyu-game.pages.dev/', { waitUntil: 'networkidle', timeout: 60000 });
    await iosPage2.waitForTimeout(2000);
    log('成语-iOS-首页加载', 'PASS');
    
    // 截图
    await iosPage2.screenshot({ path: '/tmp/chengyu_ios.png' });
    
    // 检查触摸交互
    const touchSupport = await iosPage2.evaluate(() => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    });
    log('成语-iOS-触摸支持', touchSupport ? 'PASS' : 'WARN');
    
    // 检查响应式布局
    const viewport = await iosPage2.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    log('成语-iOS-视口尺寸', viewport.width <= 500 ? 'PASS' : 'WARN', `${viewport.width}x${viewport.height}`);
    
    // 登录
    const loginInput = iosPage2.locator('#username-input');
    if (await loginInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await loginInput.fill('iOS测试');
      await iosPage2.locator('button:has-text("开始学习")').click();
      await iosPage2.waitForTimeout(1500);
      log('成语-iOS-登录', 'PASS');
    }
    
    // 测试模式卡片
    const modeCards = await iosPage2.locator('.mode-card').all();
    log('成语-iOS-模式卡片', modeCards.length > 0 ? 'PASS' : 'FAIL', `${modeCards.length}个模式`);
    
  } catch(e) {
    log('成语-iOS-测试', 'FAIL', e.message.substring(0, 50));
  }
  
  // ===== 桌面测试 =====
  console.log('\n========== 桌面兼容性测试 ==========\n');
  
  // 古诗词游戏 - 桌面
  console.log('--- 古诗词游戏 (桌面) ---');
  const desktopPage1 = await desktopContext.newPage();
  try {
    await desktopPage1.goto('https://poetry-game.pages.dev/', { waitUntil: 'networkidle', timeout: 60000 });
    await desktopPage1.waitForTimeout(2000);
    log('古诗词-桌面-首页加载', 'PASS');
    
    // 截图
    await desktopPage1.screenshot({ path: '/tmp/poetry_desktop.png' });
    
    // 检查视口
    const viewport = await desktopPage1.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    log('古诗词-桌面-视口尺寸', viewport.width >= 1000 ? 'PASS' : 'WARN', `${viewport.width}x${viewport.height}`);
    
  } catch(e) {
    log('古诗词-桌面-测试', 'FAIL', e.message.substring(0, 50));
  }
  
  // 成语游戏 - 桌面
  console.log('\n--- 成语游戏 (桌面) ---');
  const desktopPage2 = await desktopContext.newPage();
  try {
    await desktopPage2.goto('https://chengyu-game.pages.dev/', { waitUntil: 'networkidle', timeout: 60000 });
    await desktopPage2.waitForTimeout(2000);
    log('成语-桌面-首页加载', 'PASS');
    
    // 截图
    await desktopPage2.screenshot({ path: '/tmp/chengyu_desktop.png' });
    
    // 检查视口
    const viewport = await desktopPage2.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    log('成语-桌面-视口尺寸', viewport.width >= 1000 ? 'PASS' : 'WARN', `${viewport.width}x${viewport.height}`);
    
  } catch(e) {
    log('成语-桌面-测试', 'FAIL', e.message.substring(0, 50));
  }
  
  await iosContext.close();
  await desktopContext.close();
  await browser.close();
  
  console.log('\n========== 兼容性测试结果 ==========\n');
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
