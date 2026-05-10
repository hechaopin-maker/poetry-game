const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://chengyu-game.pages.dev/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  
  // 截图首页
  await page.screenshot({ path: '/tmp/chengyu_home.png', fullPage: true });
  console.log('首页截图已保存到 /tmp/chengyu_home.png');
  
  // 获取所有可点击元素
  const clickables = await page.evaluate(() => {
    const elements = [];
    // 查找所有按钮、链接、可点击div
    document.querySelectorAll('button, a, [onclick], [class*="btn"], [class*="card"], [class*="menu"]').forEach(el => {
      const text = el.textContent.trim().substring(0, 50);
      const tag = el.tagName;
      const cls = el.className.substring(0, 50);
      const id = el.id;
      if (text) elements.push({ tag, text, cls, id });
    });
    return elements;
  });
  
  console.log('\n可点击元素：');
  clickables.forEach(el => {
    console.log(`  <${el.tag}> "${el.text}" class="${el.cls}" id="${el.id}"`);
  });
  
  // 获取页面主要内容
  const mainContent = await page.evaluate(() => {
    const main = document.querySelector('main, #app, .app, body');
    return main ? main.innerHTML.substring(0, 3000) : 'No main content';
  });
  console.log('\n页面主要内容（前3000字符）：');
  console.log(mainContent);
  
  await browser.close();
})();
