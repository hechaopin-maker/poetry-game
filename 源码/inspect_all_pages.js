const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  async function inspectPage(url, name) {
    console.log(`\n=== 检查 ${name} ===`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
    await page.waitForTimeout(3000);
    
    // 跳过登录弹窗
    try {
      const skipBtn = page.locator('text=跳过').first();
      if (await skipBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await skipBtn.click();
        await page.waitForTimeout(1000);
      }
    } catch(e) {}
    
    // 获取所有页面元素
    const pageInfo = await page.evaluate(() => {
      // 获取所有页面
      const pages = document.querySelectorAll('[id$="Page"], [class*="page"]');
      const pageInfoList = Array.from(pages).map(page => ({
        id: page.id,
        className: page.className,
        active: page.classList.contains('active'),
        visible: page.offsetParent !== null
      }));
      
      // 获取所有输入框
      const inputs = document.querySelectorAll('input');
      const inputInfo = Array.from(inputs).map(inp => {
        const style = window.getComputedStyle(inp);
        return {
          id: inp.id,
          type: inp.type,
          pointerEvents: style.pointerEvents,
          visible: inp.offsetParent !== null,
          display: style.display,
          visibility: style.visibility
        };
      });
      
      // 获取所有按钮
      const buttons = document.querySelectorAll('button');
      const buttonInfo = Array.from(buttons).map(btn => {
        const style = window.getComputedStyle(btn);
        return {
          id: btn.id,
          text: btn.textContent.trim().substring(0, 30),
          pointerEvents: style.pointerEvents,
          visible: btn.offsetParent !== null,
          display: style.display,
          visibility: style.visibility
        };
      });
      
      // 获取所有模块卡片
      const cards = document.querySelectorAll('.module-card, [class*="card"]');
      const cardInfo = Array.from(cards).map(card => ({
        id: card.id,
        text: card.textContent.trim().substring(0, 50),
        visible: card.offsetParent !== null,
        onclick: card.getAttribute('onclick')
      }));
      
      return {
        pages: pageInfoList.filter(p => p.id),
        inputs: inputInfo.filter(i => i.id),
        buttons: buttonInfo.filter(b => b.text.length > 0).slice(0, 20),
        cards: cardInfo.filter(c => c.text.length > 0).slice(0, 20)
      };
    });
    
    console.log('\n页面列表:');
    pageInfo.pages.forEach((page, i) => {
      console.log(`  ${i+1}. [${page.active ? '活跃' : '非活跃'}] [${page.visible ? '可见' : '隐藏'}] ${page.id}`);
    });
    
    console.log('\n输入框:');
    pageInfo.inputs.forEach((inp, i) => {
      console.log(`  ${i+1}. [${inp.visible ? '可见' : '隐藏'}] ${inp.id} (${inp.type}) - pointer-events: ${inp.pointerEvents}`);
    });
    
    console.log('\n按钮 (前20个):');
    pageInfo.buttons.forEach((btn, i) => {
      console.log(`  ${i+1}. [${btn.visible ? '可见' : '隐藏'}] ${btn.id || '无ID'} - "${btn.text}" - pointer-events: ${btn.pointerEvents}`);
    });
    
    console.log('\n模块卡片 (前20个):');
    pageInfo.cards.forEach((card, i) => {
      console.log(`  ${i+1}. [${card.visible ? '可见' : '隐藏'}] ${card.id || '无ID'} - "${card.text}" - onclick: ${card.onclick || '无'}`);
    });
  }
  
  try {
    await inspectPage('https://poetry-game.pages.dev/', '古诗词游戏');
    await inspectPage('https://chengyu-game.pages.dev/', '成语游戏');
  } catch (e) {
    console.error('错误:', e.message);
  }
  
  await browser.close();
})();