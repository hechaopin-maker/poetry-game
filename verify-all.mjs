import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function screenshot(name) {
  await page.screenshot({ path: `/tmp/verify-${name}.png` });
  console.log(`Screenshot: ${name}`);
}

// 1. Load home
await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await screenshot('home');

// 2. Skip login
await page.click('.login-skip-btn');
await page.waitForTimeout(500);
await screenshot('home-loggedin');

// 3. Click 诗词闯关
const cards = await page.locator('#homePage .module-card').all();
console.log('Home cards:', cards.length);
await cards[2].click();
await page.waitForTimeout(1000);
await screenshot('levelselect');

// 4. Click first level
const levels = await page.locator('#levelGrid > *').all();
if (levels.length > 0) {
  await levels[0].click();
  await page.waitForTimeout(1500);
  await screenshot('gameplay');
  
  const options = await page.locator('.option').all();
  if (options.length > 0) {
    await options[0].click();
    await page.waitForTimeout(800);
    await screenshot('gameplay-answered');
  }
}

// 5. Go home and test 飞花令
await page.evaluate(() => goHome());
await page.waitForTimeout(500);
await cards[0].click();
await page.waitForTimeout(1500);
await screenshot('feihua');

// 6. Go home and test 消消乐
await page.evaluate(() => goHome());
await page.waitForTimeout(500);
await cards[1].click();
await page.waitForTimeout(1500);
await screenshot('match');

// 7. Go home and test 每日挑战
await page.evaluate(() => goHome());
await page.waitForTimeout(500);
await cards[3].click();
await page.waitForTimeout(1500);
await screenshot('daily');

// 8. Go home and test 错题本
await page.evaluate(() => goHome());
await page.waitForTimeout(500);
await cards[4].click();
await page.waitForTimeout(1000);
await screenshot('wrongnotes');

// 9. Go home and test 诗词词典
await page.evaluate(() => goHome());
await page.waitForTimeout(500);
await cards[5].click();
await page.waitForTimeout(1000);
await screenshot('dict');

await browser.close();
console.log('All screenshots done');
