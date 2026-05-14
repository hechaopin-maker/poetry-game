import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const SIZES = [
  { name: 'icon-192.png', size: 192, padding: 16 },
  { name: 'icon-512.png', size: 512, padding: 40 },
  { name: 'apple-icon.png', size: 180, padding: 12 },
];

const html = (size, padding) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  width: ${size}px; height: ${size}px;
  background: #f4efe6;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Noto Serif SC', 'Songti SC', 'STSong', serif;
}
.icon {
  width: ${size - padding * 2}px; height: ${size - padding * 2}px;
  border-radius: 22%;
  background: linear-gradient(135deg, #faf8f3 0%, #ede8df 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}
.char {
  font-size: ${(size - padding * 2) * 0.52}px;
  color: #2c2c2c;
  font-weight: 700;
  line-height: 1;
}
.accent {
  position: absolute;
  bottom: ${(size - padding * 2) * 0.18}px;
  right: ${(size - padding * 2) * 0.18}px;
  width: ${(size - padding * 2) * 0.1}px;
  height: ${(size - padding * 2) * 0.1}px;
  background: #c23a30;
  border-radius: 50%;
}
</style></head><body>
<div class="icon">
  <span class="char">诗</span>
  <div class="accent"></div>
</div>
</body></html>`;

async function main() {
  mkdirSync('icons', { recursive: true });
  const browser = await chromium.launch();

  for (const { name, size, padding } of SIZES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html(size, padding));
    await page.waitForTimeout(300); // font render
    const buf = await page.screenshot({ type: 'png', omitBackground: false });
    writeFileSync(`icons/${name}`, buf);
    console.log(`  ✅ icons/${name} (${size}×${size}, ${(buf.length / 1024).toFixed(1)}KB)`);
    await page.close();
  }

  await browser.close();
  console.log('🎉 All icons generated');
}

main().catch(e => { console.error(e); process.exit(1); });
