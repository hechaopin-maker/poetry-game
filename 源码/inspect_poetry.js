const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log('正在访问古诗词游戏...');
    await page.goto('https://poetry-game.pages.dev/', { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3000);
    
    // 跳过登录弹窗
    try {
      const skipBtn = page.locator('text=跳过').first();
      if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
        console.log('已跳过登录弹窗');
      }
    } catch(e) {}
    
    // 获取页面结构
    const pageInfo = await page.evaluate(() => {
      // 获取所有模块卡片
      const cards = document.querySelectorAll('.module-card');
      const cardTexts = Array.from(cards).map(card => ({
        text: card.textContent.trim().substring(0, 50),
        visible: card.offsetParent !== null,
        classes: card.className
      }));
      
      // 获取所有按钮
      const buttons = document.querySelectorAll('button');
      const buttonTexts = Array.from(buttons).map(btn => ({
        text: btn.textContent.trim().substring(0, 30),
        visible: btn.offsetParent !== null,
        id: btn.id
      }));
      
      // 获取所有输入框
      const inputs = document.querySelectorAll('input');
      const inputInfo = Array.from(inputs).map(inp => ({
        id: inp.id,
        type: inp.type,
        visible: inp.offsetParent !== null,
        placeholder: inp.placeholder
      }));
      
      return {
        title: document.title,
        url: window.location.href,
        cards: cardTexts.filter(c => c.text.length > 0),
        buttons: buttonTexts.filter(b => b.text.length > 0).slice(0, 20),
        inputs: inputInfo.slice(0, 10)
      };
    });
    
    console.log('\n=== 页面信息 ===');
    console.log('标题:', pageInfo.title);
    console.log('URL:', pageInfo.url);
    
    console.log('\n=== 模块卡片 ===');
    pageInfo.cards.forEach((card, i) => {
      console.log(`${i+1}. [${card.visible ? '可见' : '隐藏'}] ${card.text}`);
    });
    
    console.log('\n=== 按钮 ===');
    pageInfo.buttons.forEach((btn, i) => {
      console.log(`${i+1}. [${btn.visible ? '可见' : '隐藏'}] ${btn.text} (${btn.id})`);
    });
    
    console.log('\n=== 输入框 ===');
    pageInfo.inputs.forEach((inp, i) => {
      console.log(`${i+1}. [${inp.visible ? '可见' : '隐藏'}] ${inp.id} (${inp.type}) - ${inp.placeholder}`);
    });
    
    // 截图
    await page.screenshot({ path: '/Users/hechaopin_claw/.openclaw/workspace-life/screenshots/poetry_inspect.png' });
    console.log('\n截图已保存');
    
  } catch (e) {
    console.error('错误:', e.message);
  }
  
  await browser.close();
})();