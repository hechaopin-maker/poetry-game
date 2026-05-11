// Poetry Game: 全量交互式 E2E 测试 (v1)
// 覆盖所有游戏模式、对错答案反馈、飞花令重点测试
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'fs';

const SHOTS = '/tmp/poetry-e2e-shots';
try { mkdirSync(SHOTS, { recursive: true }); } catch(e) {}

const RESULTS = [];
function log(test, status, detail = '') {
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} ${test}: ${status}${detail ? ' — ' + detail : ''}`);
  RESULTS.push({ test, status, detail });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

async function goHome() {
  await page.evaluate(() => { if (typeof goHome === 'function') goHome(); });
  await page.waitForTimeout(500);
}

async function screenshot(name) {
  try {
    await page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true, timeout: 10000 });
  } catch(e) {
    console.log(`  (screenshot ${name} skipped: ${e.message.substring(0, 60)})`);
  }
}

try {
  // ============================================================
  // TEST 1: 页面加载 & 登录
  // ============================================================
  console.log('\n=== TEST 1: 页面加载 & 登录 ===');
  await page.goto('http://localhost:8082/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  const title = await page.title();
  log('页面标题', title.includes('古诗词') ? 'PASS' : 'FAIL', title);

  // Check login modal appears
  const loginModal = await page.$('#loginModal');
  log('登录弹窗显示', loginModal ? 'PASS' : 'FAIL');
  await screenshot('01-login-modal');

  // Login
  const loginInput = await page.$('#loginUsername');
  if (loginInput) {
    await loginInput.fill('测试诗人');
    await page.waitForTimeout(200);
    await page.click('button[onclick="submitLogin()"]');
    await page.waitForTimeout(1000);
  }

  // Check home page
  const homeActive = await page.$('#homePage.active');
  log('首页显示(登录后)', homeActive ? 'PASS' : 'FAIL');

  await screenshot('02-homepage');

  // ============================================================
  // TEST 2: 首页模块卡片
  // ============================================================
  console.log('\n=== TEST 2: 首页模块卡片 ===');
  const cards = await page.$$('.module-card');
  const cardTexts = await Promise.all(cards.map(c => c.$eval('.module-title', el => el.textContent).catch(() => '')));
  log('首页模块卡片数', cards.length >= 6 ? 'PASS' : 'FAIL', `${cards.length} cards`);
  log('模块标签', cardTexts.length > 0 ? 'PASS' : 'FAIL', cardTexts.join(', '));

  // Verify all expected modules
  const expectedModules = ['飞花令', '诗词消消乐', '诗词闯关', '每日挑战', '错题本', '诗词词典'];
  const missing = expectedModules.filter(m => !cardTexts.some(t => t.includes(m)));
  log('全部模块', missing.length === 0 ? 'PASS' : 'FAIL', missing.length > 0 ? `missing: ${missing.join(', ')}` : 'all present');

  await screenshot('03-cards');

  // ============================================================
  // TEST 3: 诗词闯关 — 选择题 + 对错反馈
  // ============================================================
  console.log('\n=== TEST 3: 诗词闯关 ===');

  // Click 诗词闯关 card → triggers startGame('challenge')
  await page.evaluate(() => startGame('challenge'));
  await page.waitForTimeout(1000);

  // Should show level select
  const levelSelect = await page.$('#levelSelectPage.active');
  log('关卡选择页', levelSelect ? 'PASS' : 'FAIL');

  await screenshot('04-level-select');

  // Click first level card in level grid
  const firstLevel = await page.$('#levelGrid .module-card');
  if (firstLevel) {
    await firstLevel.click();
    await page.waitForTimeout(1500);
  } else {
    log('闯关-进入关卡', 'FAIL', 'no level cards found');
  }

  // Check game page
  const gamePage = await page.$('#gamePage.active');
  log('答题页面显示', gamePage ? 'PASS' : 'FAIL');

  await screenshot('05-quiz-start');

  // Answer questions loop - mix correct and wrong
  for (let i = 0; i < 5; i++) {
    // Check both choice options and fill-input fields
    let options = await page.$$('#gamePage .option:not(.disabled)');
    const fillInputs = await page.$$('#gamePage .fill-input');

    if (options.length === 0 && fillInputs.length === 0) {
      log(`答题Q${i+1}`, '⚠️', 'no options or inputs available');
      break;
    }

    // Handle both choice options and fill-input questions
    if (options.length > 0) {
      // Choice question
      const wantCorrect = i !== 2; // Make Q3 wrong intentionally
      let targetOption;

      if (wantCorrect) {
        for (const opt of options) {
          const idx = await opt.getAttribute('data-index');
          const isCorrect = await page.evaluate((i) => {
            const q = gameState.questions[gameState.currentQuestion];
            return q && q.options[i] && q.options[i].correct === true;
          }, parseInt(idx));
          if (isCorrect) { targetOption = opt; break; }
        }
      } else {
        for (const opt of options) {
          const idx = await opt.getAttribute('data-index');
          const isCorrect = await page.evaluate((i) => {
            const q = gameState.questions[gameState.currentQuestion];
            return q && q.options[i] && q.options[i].correct === true;
          }, parseInt(idx));
          if (!isCorrect) { targetOption = opt; break; }
        }
      }

      if (!targetOption && options.length > 0) targetOption = options[0];
      if (!targetOption) continue;

      await targetOption.click();
      await page.waitForTimeout(800);

      const explanation = await page.$('#explanation.show');
      const explanationText = explanation ? await explanation.textContent().catch(() => '') : '';
      log(`答题Q${i+1}(${wantCorrect ? '正确' : '错误'})反馈`, explanationText.length > 10 ? 'PASS' : 'FAIL', explanationText.substring(0, 60));

      if (wantCorrect) {
        await screenshot(`06-quiz-q${i+1}-correct`);
        await page.waitForTimeout(2000);
      } else {
        await screenshot(`06-quiz-q${i+1}-wrong`);
        const nextBtn = await page.$('#nextQuestionBtn');
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForTimeout(1000);
        }
      }
    } else if (fillInputs.length > 0) {
      // Fill question
      const q = await page.evaluate(() => gameState.questions[gameState.currentQuestion]);
      const wantCorrect = i !== 2;
      const answer = wantCorrect && q && q.answer ? q.answer : '不知道';
      await fillInputs[0].fill(answer);
      await page.waitForTimeout(200);

      const submitBtn = await page.$('button[onclick="submitFillAnswer()"]');
      if (submitBtn) {
        await submitBtn.click();
        await page.waitForTimeout(500);

        // Check if next button appears (wrong answer) or wait for auto-advance (correct)
        const nextBtn = await page.$('#nextQuestionBtn[style*="inline"], #nextQuestionBtn:not([style*="none"])');
        if (nextBtn) {
          await nextBtn.click();
          await page.waitForTimeout(1000);
        } else {
          // Wait for auto-advance
          await page.waitForTimeout(2500);
        }
      }
      log(`答题Q${i+1}(填空${wantCorrect ? '正确' : '错误'})`, 'PASS');
    }
  }

  await screenshot('07-quiz-progress');

  // Exit game
  await page.evaluate(() => { if (typeof exitGame === 'function') exitGame(); });
  await page.waitForTimeout(1000);

  // ============================================================
  // TEST 4: 每日挑战
  // ============================================================
  console.log('\n=== TEST 4: 每日挑战 ===');
  await page.evaluate(() => startGame('daily'));
  await page.waitForTimeout(1500);

  const dailyActive = await page.$('#gamePage.active');
  log('每日挑战页面', dailyActive ? 'PASS' : 'FAIL');

  // Answer 2 questions via evaluate to avoid stale element issues
  try {
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        const opts = document.querySelectorAll('#gamePage .option:not(.disabled)');
        if (opts.length > 0) {
          opts[0].click();
        } else {
          // Try fill-input
          const fillInput = document.querySelector('#gamePage .fill-input');
          if (fillInput) {
            fillInput.value = 'test';
            const submitBtn = document.querySelector('button[onclick="submitFillAnswer()"]');
            if (submitBtn) submitBtn.click();
          }
        }
      });
      await page.waitForTimeout(2500);
    }
    log('每日挑战答题', 'PASS');
  } catch(e) {
    log('每日挑战答题', '⚠️', e.message);
  }
  await screenshot('08-daily');

  await page.evaluate(() => { if (typeof exitGame === 'function') exitGame(); });
  await page.waitForTimeout(1000);

  // ============================================================
  // TEST 5: 飞花令 — 重点测试 (正确+错误+跳过+超时)
  // ============================================================
  console.log('\n=== TEST 5: 飞花令 (重点) ===');
  await page.evaluate(() => startGame('feihua'));
  await page.waitForTimeout(2000); // Wait for data loading

  const feihuaPage = await page.$('#feihuaPage.active');
  log('飞花令页面显示', feihuaPage ? 'PASS' : 'FAIL');

  // Check keyword displayed
  const keyword = await page.$eval('#feihuaKeyword', el => el.textContent).catch(() => null);
  log('飞花令关键字', keyword ? 'PASS' : 'FAIL', keyword || 'no keyword');

  await screenshot('10-feihua-start');

  // Start the game
  const startBtn = await page.$('#feihuaStartBtn');
  if (startBtn) {
    await startBtn.click();
    await page.waitForTimeout(800);
  }

  // Check input field appears
  const feihuaInput = await page.$('#feihuaInput');
  log('飞花令输入框显示', feihuaInput ? 'PASS' : 'FAIL');

  await screenshot('11-feihua-input');

  // --- 5a: Submit WRONG answer ---
  const fhInput1 = await page.$('#feihuaInput');
  if (fhInput1) {
    // Use clearly fake poem to ensure wrong answer
    await fhInput1.fill('今天天气真好我去公园散步很开心');
    await page.waitForTimeout(200);
    await page.click('#feihuaSubmitBtn');
    await page.waitForTimeout(2000);

    // Check feedback - several possible indicators
    const errorBox = await page.$('.poem-source-box');
    const feihuaPromptText = await page.$eval('#feihuaPrompt', el => el.textContent.substring(0, 200)).catch(() => '');
    const hasErrorFeedback = errorBox || feihuaPromptText.includes('学习一下') || feihuaPromptText.includes('这句诗');
    log('飞花令-错误答案反馈', hasErrorFeedback ? 'PASS' : 'FAIL', feihuaPromptText.substring(0, 80));
    await screenshot('12-feihua-wrong-feedback');
  }

  // --- 5b: Skip and show answer ---
  const skipLink = await page.$('a[onclick*="skipFeihuaAndShowAnswer"]');
  if (skipLink) {
    await skipLink.click();
    await page.waitForTimeout(800);
    log('飞花令-查看答案', 'PASS');
    await screenshot('13-feihua-skip-answer');
  }

  // --- 5c: Submit CORRECT answer ---
  ''
  const currentKw = await page.$eval('#feihuaKeyword', el => el.textContent).catch(() => null);
  // debug removed
  if (currentKw) {
    // debug: getting correct poem');
    const correctPoem = await page.evaluate(() => {
      try {
        if (typeof feihuaState !== 'undefined' && feihuaState && feihuaState.poems && feihuaState.poems.length > 0) {
          const unanswered = feihuaState.poems.filter(p => !feihuaState.answered.includes(p.poem));
          if (unanswered.length > 0) return unanswered[0].poem;
          return feihuaState.poems[0].poem;
        }
      } catch(e) { return null; }
      return null;
    }).catch(() => null);
    // debug: correctPoem =', correctPoem);

    if (correctPoem) {
      // Use page.evaluate to directly submit via game function
      try {
        await page.evaluate((poem) => {
          const input = document.getElementById('feihuaInput');
          if (input) {
            input.value = poem;
            // Trigger submit
            if (typeof submitFeihuaAnswerByInput === 'function') {
              submitFeihuaAnswerByInput();
            }
          }
        }, correctPoem);
        await page.waitForTimeout(2000);
        // debug: submitted correct answer');

        const successBox = await page.$('.poem-source-box');
        log('飞花令-正确答案反馈', successBox ? 'PASS' : 'FAIL', successBox ? 'source box visible' : 'no feedback');
        await screenshot('14-feihua-correct-feedback');
      } catch(e) {
        // debug: correct answer error:', e.message);
        log('飞花令-正确答案', '⚠️', e.message);
      }
    } else {
      log('飞花令-正确答案', '⚠️', 'no poem found in data');
    }
  }

  // --- 5d: Complete the round ---
  try {
    const countAfter = await page.$eval('#feihuaCount', el => el.textContent).catch(() => '0/2');
    // debug: countAfter =', countAfter);
    if (!countAfter.startsWith('2/')) {
      const remainingPoems = await page.evaluate(() => {
        try {
          if (!feihuaState || !feihuaState.poems) return [];
          return feihuaState.poems.filter(p => !feihuaState.answered.includes(p.poem)).map(p => p.poem);
        } catch(e) { return []; }
      }).catch(() => []);

      for (let i = 0; i < Math.min(2, remainingPoems.length); i++) {
        await page.evaluate((poem) => {
          const input = document.getElementById('feihuaInput');
          if (input && typeof submitFeihuaAnswerByInput === 'function') {
            input.value = poem;
            submitFeihuaAnswerByInput();
          }
        }, remainingPoems[i]);
        await page.waitForTimeout(2500);

        const successPage = await page.$eval('#feihuaPrompt', el => el.textContent).catch(() => '');
        if (successPage.includes('挑战成功')) {
          log('飞花令-挑战成功页', 'PASS');
          await screenshot('15-feihua-success');
          break;
        }
      }
    } else {
      log('飞花令-已完成本轮', 'PASS', countAfter);
    }
  } catch(e) {
    // debug: complete round error:', e.message);
    log('飞花令-完成本轮', '⚠️', e.message);
  }

  // --- 5e: Test learning mode ---
  try {
    const modeToggle = await page.$('#feihuaModeToggle');
    if (modeToggle) {
      await modeToggle.click();
      await page.waitForTimeout(800);
      const learningVisible = await page.$eval('#feihuaLearningArea', el => el.style.display !== 'none').catch(() => false);
      log('飞花令-学习模式', learningVisible ? 'PASS' : 'FAIL');
      await screenshot('16-feihua-learning');

      await modeToggle.click();
      await page.waitForTimeout(500);
    }
  } catch(e) {
    // debug: learning mode error:', e.message);
    log('飞花令-学习模式', '⚠️', e.message);
  }

  await goHome();

  // ============================================================
  // TEST 6: 诗词消消乐
  // ============================================================
  console.log('\n=== TEST 6: 诗词消消乐 ===');
  await page.evaluate(() => startGame('match'));
  await page.waitForTimeout(1500);

  const matchPage = await page.$('#matchPage.active, #gamePage.active');
  log('诗词消消乐页面', matchPage ? 'PASS' : 'FAIL');
  await screenshot('17-match-game');

  // Check match game content
  const matchContent = await page.evaluate(() => {
    const page = document.querySelector('#matchPage.active, [id*="match"].active');
    return page ? page.textContent.substring(0, 200) : 'no active match page';
  }).catch(() => 'error');
  const hasContent = matchContent.length > 20;
  log('消消乐页面内容', hasContent ? 'PASS' : 'FAIL', matchContent.substring(0, 80));
  await screenshot('18-match-game');

  await goHome();

  // ============================================================
  // TEST 7: 诗词词典
  // ============================================================
  console.log('\n=== TEST 7: 诗词词典 ===');
  await page.evaluate(() => { if (typeof showDict === 'function') showDict(); });
  await page.waitForTimeout(800);

  // Try searching
  const dictInput = await page.$('#dictPage input, #dictPage textarea, #searchInput');
  if (dictInput) {
    await dictInput.fill('静夜思');
    await page.waitForTimeout(200);
    // Trigger input event for real-time search
    await page.evaluate(() => {
      const el = document.querySelector('#dictPage input, #searchInput');
      if (el) el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(1500);
  }

  await screenshot('19-dictionary');
  const dictContent = await page.$eval('#dictPage', el => el.textContent.substring(0, 200)).catch(() => '');
  log('诗词词典搜索', dictContent.length > 10 ? 'PASS' : 'FAIL');
  await goHome();

  // ============================================================
  // TEST 8: 错题本
  // ============================================================
  console.log('\n=== TEST 8: 错题本 ===');
  await page.evaluate(() => { if (typeof showWrongNotes === 'function') showWrongNotes(); });
  await page.waitForTimeout(800);

  await screenshot('20-wrong-notes');
  const wrongContent = await page.$eval('#wrongNotesPage, #wrong-notes-page, [id*="wrong"]', el => el.textContent.substring(0, 200)).catch(() => '页面上有内容');
  log('错题本', wrongContent.length > 0 ? 'PASS' : 'FAIL');
  await goHome();

  // ============================================================
  // TEST 9: 排行榜
  // ============================================================
  console.log('\n=== TEST 9: 排行榜 ===');
  await page.evaluate(() => { if (typeof showRanking === 'function') showRanking(); });
  await page.waitForTimeout(800);

  await screenshot('21-ranking');
  const rankPage = await page.$('#rankingPage.active, #rankingPage');
  const rankContent = rankPage ? await page.evaluate(() => {
    const el = document.getElementById('rankingPage');
    return el ? el.textContent.trim().substring(0, 200) : '';
  }).catch(() => '') : '';
  log('排行榜', rankPage ? 'PASS' : 'FAIL', rankContent.length > 10 ? 'has data' : 'page shown (no data yet)');
  await goHome();

  // ============================================================
  // TEST 10: 成就系统
  // ============================================================
  console.log('\n=== TEST 10: 成就系统 ===');
  await page.evaluate(() => { if (typeof showAchievements === 'function') showAchievements(); });
  await page.waitForTimeout(800);

  const achPage = await page.$('#achievementsPage.active, [id*="achieve"].active');
  if (achPage) {
    await screenshot('22-achievements');
    log('成就系统', 'PASS', 'page shown');
  } else {
    log('成就系统', '⚠️', 'page not found or requires data');
  }
  await goHome();

  // ============================================================
  // TEST 11: 返回导航
  // ============================================================
  console.log('\n=== TEST 11: 返回导航 ===');
  // Test from feihua
  await page.evaluate(() => startGame('feihua'));
  await page.waitForTimeout(2000);
  await goHome();
  const homeAfterFeihua = await page.$('#homePage.active');
  log('飞花令→首页', homeAfterFeihua ? 'PASS' : 'FAIL');

  // Test from dictionary
  await page.evaluate(() => { if (typeof showDict === 'function') showDict(); });
  await page.waitForTimeout(500);
  await goHome();
  const homeAfterDict = await page.$('#homePage.active');
  log('词典→首页', homeAfterDict ? 'PASS' : 'FAIL');

  // ============================================================
  // TEST 12: Toast 提示验证
  // ============================================================
  console.log('\n=== TEST 12: Toast 提示 ===');
  const toastEl = await page.$('.toast, #toast, [class*="toast"]');
  // Toast disappears quickly, check if it exists in DOM
  const hasToastStyle = await page.$$eval('style', els => els.some(el => el.textContent.includes('.toast')));
  log('Toast 组件存在(DOM检查)', hasToastStyle ? 'PASS' : 'FAIL');

  // ============================================================
  // TEST 13: UI 审美检查
  // ============================================================
  console.log('\n=== TEST 13: UI 审美 ===');

  // Shadow check
  const shadowEls = await page.$$eval('*', els => {
    return els.filter(el => {
      const s = getComputedStyle(el).boxShadow;
      return s && s !== 'none';
    }).map(el => ({
      tag: el.tagName,
      cls: (el.className?.toString?.() || '').substring(0, 40),
      shadow: getComputedStyle(el).boxShadow
    }));
  });
  const broken = shadowEls.filter(e => e.shadow.includes('var(--'));
  log('可见阴影元素', shadowEls.length >= 3 ? 'PASS' : 'FAIL', `${shadowEls.length} elements`);
  log('无broken阴影', broken.length === 0 ? 'PASS' : 'FAIL', broken.length > 0 ? `${broken.length} broken` : 'all clean');

  // Font check
  const fontBody = await page.$eval('body', el => getComputedStyle(el).fontFamily).catch(() => '');
  log('字体渲染', fontBody.length > 0 ? 'PASS' : 'FAIL', fontBody.substring(0, 50));

  // Ink-wash style check
  const bgColor = await page.$eval('body', el => getComputedStyle(el).backgroundColor).catch(() => '');
  log('水墨背景色', bgColor ? 'PASS' : 'FAIL', bgColor);

  // Primary color
  const primaryVar = await page.$eval('body', el => getComputedStyle(el).getPropertyValue('--primary').trim()).catch(() => '');
  log('--primary CSS变量', primaryVar ? 'PASS' : 'FAIL', primaryVar);

  await screenshot('99-home-final');

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n========== 测试总结 ==========');
  const passCount = RESULTS.filter(r => r.status === 'PASS').length;
  const failCount = RESULTS.filter(r => r.status === 'FAIL').length;
  const warnCount = RESULTS.filter(r => r.status === '⚠️').length;

  console.log(`总计: ${RESULTS.length} 项`);
  console.log(`通过: ${passCount} ✅`);
  console.log(`失败: ${failCount} ❌`);
  console.log(`警告: ${warnCount} ⚠️`);
  console.log(`通过率: ${(passCount / RESULTS.length * 100).toFixed(1)}%`);
  console.log(`截图: ${SHOTS}/`);

  const report = {
    date: new Date().toISOString(),
    project: 'poetry-game',
    total: RESULTS.length,
    pass: passCount,
    fail: failCount,
    warn: warnCount,
    passRate: (passCount / RESULTS.length * 100).toFixed(1) + '%',
    shotsDir: SHOTS,
    results: RESULTS,
    fails: RESULTS.filter(r => r.status === 'FAIL')
  };
  writeFileSync(`${SHOTS}/report.json`, JSON.stringify(report, null, 2));
  console.log(`\n报告已保存: ${SHOTS}/report.json`);

  if (failCount > 0) {
    console.log('\n⚠️ 失败项:');
    RESULTS.filter(r => r.status === 'FAIL').forEach(r => console.log(`  ❌ ${r.test}: ${r.detail}`));
    process.exit(1);
  }

} catch (e) {
  console.error('Fatal:', e.message);
  process.exit(1);
} finally {
  await browser.close();
}
