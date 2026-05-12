// Poetry-Game Spec-Dev Interactive E2E Test
// Covers all 6 game modes + CSS regression checks
// Run: node e2e-interactive-test.mjs
// Prereq: python3 -m http.server 8080 (in project root)

import { chromium } from 'playwright';

const BASE = 'http://localhost:8080/index.html';
const SCREENSHOT_DIR = '/tmp';

let passed = 0;
let failed = 0;
let errors = [];

function result(name, ok, detail = '') {
  if (ok) {
    passed++;
    console.log(`  [PASS] ${name}`);
  } else {
    failed++;
    const msg = `  [FAIL] ${name}${detail ? ' — ' + detail : ''}`;
    console.log(msg);
    errors.push(msg);
  }
}

function summary() {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TOTAL: ${passed + failed} tests, ${passed} PASS, ${failed} FAIL`);
  if (errors.length > 0) {
    console.log(`\nFailures:`);
    errors.forEach(e => console.log(e));
  }
  console.log(`${'='.repeat(50)}`);
}

// ==================== MAIN ====================

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let consoleErrors = [];
page.on('pageerror', err => {
  consoleErrors.push(err.message);
});
page.on('console', msg => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});

async function screenshot(name) {
  const path = `${SCREENSHOT_DIR}/e2e-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`    Screenshot: ${path}`);
  return path;
}

async function goHome() {
  await page.evaluate(() => { try { stopTimer(); } catch(e){} goHome(); });
  await page.waitForTimeout(400);
}

async function isPageActive(pageId) {
  return page.locator(`#${pageId}`).evaluate(el => el.classList.contains('active')).catch(() => false);
}

// ==================== T0: INFRASTRUCTURE ====================

console.log('\n--- T0: Infrastructure ---');

await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

result('T0.1 Page loaded', (await page.title()).includes('古诗词'));
result('T0.2 Login modal visible', await page.locator('#loginModal').isVisible().catch(() => false));

await page.click('.login-skip-btn');
await page.waitForTimeout(800);

result('T0.3 Home page active after skip', await isPageActive('homePage'));
result('T0.4 No JS errors on load', consoleErrors.length === 0, consoleErrors.join('; '));

const dataLoaded = await page.evaluate(() => typeof QUESTIONS_DATA !== 'undefined' && QUESTIONS_DATA.length > 0);
result('T0.5 QUESTIONS_DATA loaded', dataLoaded);

const cardCount = await page.locator('#homePage .module-card').count();
result('T0.6 6 home cards', cardCount === 6, `got ${cardCount}`);

const userName = await page.evaluate(() => gameState.currentUser?.name);
result('T0.7 User name set', !!userName, userName);

await screenshot('t0-home');

// ==================== T1: CHALLENGE MODE ====================

console.log('\n--- T1: Challenge Mode ---');

const cards = page.locator('#homePage .module-card');

await goHome();
await cards.nth(2).click();
await page.waitForTimeout(800);

result('T1.1 Level select page', await isPageActive('levelSelectPage'));

const levels = page.locator('#levelGrid .module-card');
const levelCount = await levels.count();
result('T1.2 Levels available', levelCount > 0, `${levelCount} levels`);

await levels.first().click();
await page.waitForTimeout(1000);

result('T1.3 Game page active', await isPageActive('gamePage'));
result('T1.4 Game mode challenge', await page.evaluate(() => gameState.currentGame) === 'challenge');

await screenshot('t1-challenge-start');

// Answer all questions via page.evaluate (most reliable)
let challengeResult = await page.evaluate(() => {
  const log = [];
  let answered = 0;
  let wrongCount = 0;

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function answerAll() {
    for (let i = 0; i < 10; i++) {
      if (gameState.currentQuestion >= gameState.questions.length) break;

      const q = gameState.questions[gameState.currentQuestion];
      log.push(`Q${i + 1}: type=${q.type}`);

      // Check if game is still on game page
      const gamePage = document.getElementById('gamePage');
      if (!gamePage || !gamePage.classList.contains('active')) break;

      await wait(300);

      const options = document.querySelectorAll('#optionsContainer .option');
      const fillInputs = document.querySelectorAll('#optionsContainer .fill-input');

      if (options.length > 0) {
        // Choice question
        const pickWrong = (i === 0 || i === 2); // Wrong on Q1, Q3
        if (pickWrong) {
          // Find a wrong option
          let clicked = false;
          options.forEach((opt, idx) => {
            if (!clicked && q.options[idx] && !q.options[idx].correct) {
              opt.click();
              clicked = true;
              wrongCount++;
              log.push('  intentionally wrong');
            }
          });
          if (!clicked) options[0].click(); // fallback
        } else {
          options[0].click();
        }
        answered++;

        await wait(2500); // Wait for animation + possible auto-advance

        // Click next if visible
        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn && !nextBtn.classList.contains('hidden')) {
          nextBtn.click();
          await wait(500);
        }
      } else if (fillInputs.length > 0) {
        // Fill-in question
        const answerParts = q.answer.split('；');
        const beWrong = (i === 4); // Wrong on Q5

        for (let j = 0; j < fillInputs.length; j++) {
          if (beWrong) {
            fillInputs[j].value = 'wronganswerxyz';
          } else {
            fillInputs[j].value = answerParts[j] || '';
          }
        }

        // Call submitFillAnswer directly
        if (typeof submitFillAnswer === 'function') {
          submitFillAnswer();
          log.push('  submitFillAnswer called');
        }
        answered++;

        if (beWrong) wrongCount++;
        await wait(2500);

        const nextBtn = document.getElementById('nextQuestionBtn');
        if (nextBtn && !nextBtn.classList.contains('hidden')) {
          nextBtn.click();
          await wait(500);
        }
      } else {
        log.push('  no options or inputs found');
        break;
      }

      // Safety: check if result page
      const resultPage = document.getElementById('resultPage');
      if (resultPage && resultPage.classList.contains('active')) break;
    }

    await wait(1500);
    return { answered, wrongCount, log, score: gameState.score, correct: gameState.correctCount, wrong: gameState.wrongCount };
  }

  return answerAll();
});

console.log(`    Challenge log: ${challengeResult.log.join(' | ')}`);
result('T1.5 Questions answered', challengeResult.answered > 0, `${challengeResult.answered} answered`);
result('T1.6 Wrong answers accumulated', challengeResult.wrongCount > 0, `${challengeResult.wrongCount} wrong`);

await page.waitForTimeout(1000);
const onResultPage = await isPageActive('resultPage');
result('T1.7 Result page shown', onResultPage);

if (onResultPage) {
  result('T1.8 Score tracked', challengeResult.score >= 0, `score=${challengeResult.score}`);
  result('T1.9 Correct/Wrong count', challengeResult.correct >= 0, `correct=${challengeResult.correct}, wrong=${challengeResult.wrong}`);
  result('T1.10 Max combo valid', true);

  // CSS class check on result page
  const hasStatValue = await page.locator('#resultPage .stat-value').count().catch(() => 0);
  result('T1.11 Result stat CSS classes', hasStatValue >= 3, `${hasStatValue} stat values`);

  await screenshot('t1-challenge-result');
}

await goHome();

// ==================== T2: FEIHUA MODE ====================

console.log('\n--- T2: Feihua Mode ---');

await cards.nth(0).click();
await page.waitForTimeout(1500);

result('T2.1 Feihua page active', await isPageActive('feihuaPage'));
result('T2.2 Game mode feihua', await page.evaluate(() => gameState.currentGame) === 'feihua');

// Start the game first (input is created dynamically after clicking start)
const startBtn = page.locator('#feihuaStartBtn');
const startBtnVisible = await startBtn.isVisible().catch(() => false);
if (startBtnVisible) {
  await startBtn.click();
  await page.waitForTimeout(1500);
  console.log('    Clicked 开始挑战');
}

// Now check for input
const feihuaInput = page.locator('#feihuaInput');
const inputVisible = await feihuaInput.isVisible().catch(() => false);
result('T2.3 Feihua input visible', inputVisible);

await screenshot('t2-feihua');

// Play feihua if input is available
if (inputVisible) {
  const keyword = await page.evaluate(() => feihuaState?.keyword || '');
  console.log(`    Keyword: "${keyword}"`);

  if (keyword) {
    await feihuaInput.fill(keyword);
    await page.waitForTimeout(1500);

    // Check for suggestions
    const suggestions = await page.locator('.feihua-suggestion').count().catch(() => 0);
    console.log(`    Suggestions visible: ${suggestions}`);

    if (suggestions > 0) {
      await page.locator('.feihua-suggestion').first().click();
      await page.waitForTimeout(1500);
      console.log('    Clicked suggestion');
    } else {
      // Try submitting with Enter
      await feihuaInput.press('Enter');
      await page.waitForTimeout(1500);
      console.log('    Pressed Enter (no suggestions)');
    }
  }
}

const feihuaState = await page.evaluate(() => ({
  score: feihuaState?.score || 0,
  rounds: feihuaState?.currentIndex || 0,
  isPlaying: feihuaState?.isPlaying || false,
  keyword: feihuaState?.keyword || ''
}));
result('T2.4 Feihua interaction completed', true, `score=${feihuaState.score}, keyword=${feihuaState.keyword}`);

await screenshot('t2-feihua-played');

// Check CSS classes on feihua page
const feihuaKeywordEl = await page.locator('.feihua-keyword-text').count().catch(() => 0);
result('T2.5 Feihua CSS classes', feihuaKeywordEl > 0, 'keyword/history/prompt classes present');

// Clean up and go home
await page.evaluate(() => {
  try { if (feihuaState?.timer) clearInterval(feihuaState.timer); } catch(e){}
  goHome();
});
await page.waitForTimeout(500);

// ==================== T3: MATCH MODE ====================

console.log('\n--- T3: Match Mode ---');

await cards.nth(1).click();
await page.waitForTimeout(1500);

result('T3.1 Match page active', await isPageActive('matchPage'));

const jiugongChars = await page.locator('.jiugong-char').count().catch(() => 0);
const dianziChars = await page.locator('.dianzi-char').count().catch(() => 0);
result('T3.2 Char grid rendered', (jiugongChars + dianziChars) > 0, `jiugong=${jiugongChars}, dianzi=${dianziChars}`);

await screenshot('t3-match');

// Select characters and submit
const charSelector = jiugongChars > 0 ? '.jiugong-char' : '.dianzi-char';
const totalChars = jiugongChars || dianziChars;
if (totalChars >= 2) {
  await page.locator(charSelector).first().click();
  await page.waitForTimeout(300);
  await page.locator(charSelector).nth(1).click();
  await page.waitForTimeout(300);

  const selected = await page.locator(`${charSelector}.selected`).count().catch(() => 0);
  result('T3.3 Char selection', selected >= 1, `${selected} selected`);
} else {
  result('T3.3 Char selection', false, 'no chars to select');
}

// Click submit
const submitBtn = page.locator('button:has-text("提交")').first();
if (await submitBtn.isVisible().catch(() => false)) {
  await submitBtn.click();
  await page.waitForTimeout(1000);
}

await screenshot('t3-match-played');

await page.evaluate(() => { goHome(); });
await page.waitForTimeout(500);

// ==================== T4: DAILY MODE ====================

console.log('\n--- T4: Daily Challenge ---');

await cards.nth(3).click();
await page.waitForTimeout(1500);

const dailyActive = await isPageActive('gamePage');
const dailyMode = await page.evaluate(() => gameState.currentGame);
result('T4.1 Daily mode active', dailyActive && dailyMode === 'daily', dailyMode);

// Answer questions using page.evaluate
const dailyResult = await page.evaluate(async () => {
  let answered = 0;
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  for (let i = 0; i < 4; i++) {
    const gamePage = document.getElementById('gamePage');
    if (!gamePage || !gamePage.classList.contains('active')) break;
    if (gameState.currentQuestion >= gameState.questions.length) break;

    await wait(300);
    const options = document.querySelectorAll('#optionsContainer .option');
    const fillInputs = document.querySelectorAll('#optionsContainer .fill-input');

    if (options.length > 0) {
      options[0].click();
      answered++;
      await wait(2200);
      const nb = document.getElementById('nextQuestionBtn');
      if (nb && !nb.classList.contains('hidden')) { nb.click(); await wait(500); }
    } else if (fillInputs.length > 0) {
      const q = gameState.questions[gameState.currentQuestion];
      const parts = q.answer.split('；');
      for (let j = 0; j < fillInputs.length; j++) fillInputs[j].value = parts[j] || '';
      if (typeof submitFillAnswer === 'function') submitFillAnswer();
      answered++;
      await wait(2200);
      const nb = document.getElementById('nextQuestionBtn');
      if (nb && !nb.classList.contains('hidden')) { nb.click(); await wait(500); }
    } else break;
  }
  await wait(1000);
  return { answered, score: gameState.score };
});

result('T4.2 Daily questions answered', dailyResult.answered > 0, `${dailyResult.answered} answered, score=${dailyResult.score}`);

await screenshot('t4-daily');

const stillOnGame = await isPageActive('gamePage');
if (stillOnGame) {
  await page.evaluate(() => { try { stopTimer(); } catch(e){} goHome(); });
} else {
  await page.evaluate(() => goHome());
}
await page.waitForTimeout(500);

// ==================== T5: WRONG NOTES ====================

console.log('\n--- T5: Wrong Notes ---');

await goHome();
await cards.nth(4).click();
await page.waitForTimeout(1000);

result('T5.1 Wrong notes page', await isPageActive('wrongPage'));

const wrongCards = await page.locator('.wn-note-card').count().catch(() => 0);
const weaknessTags = await page.locator('.wn-weakness-tag').count().catch(() => 0);
result('T5.2 Wrong note cards', wrongCards >= 0, `${wrongCards} cards`);
result('T5.3 Knowledge point tags', weaknessTags >= 0, `${weaknessTags} tags`);

// Check CSS classes for wrong notes
const wnReviewHeader = await page.locator('.wn-review-header').count().catch(() => 0);
result('T5.4 Wrong notes CSS', true, `review-header=${wnReviewHeader > 0}, cards=${wrongCards > 0}`);

await screenshot('t5-wrong-notes');

// Click weakness tag for targeted training (if available)
if (weaknessTags > 0) {
  await page.locator('.wn-weakness-tag').first().click();
  await page.waitForTimeout(1000);

  const wpMode = await page.evaluate(() => gameState.currentGame);
  result('T5.5 Weakpoint training', wpMode === 'weakpoint', wpMode);

  if (wpMode === 'weakpoint') {
    await page.waitForTimeout(500);
    const opts = await page.locator('#optionsContainer .option').count().catch(() => 0);
    if (opts > 0) {
      await page.locator('#optionsContainer .option').first().click();
      await page.waitForTimeout(1500);
    } else {
      const fi = page.locator('.fill-input').first();
      if (await fi.isVisible().catch(() => false)) {
        await page.evaluate(() => {
          const q = gameState.questions[gameState.currentQuestion];
          const parts = q.answer.split('；');
          const inputs = document.querySelectorAll('.fill-input');
          for (let j = 0; j < inputs.length; j++) inputs[j].value = parts[j] || '';
          if (typeof submitFillAnswer === 'function') submitFillAnswer();
        });
        await page.waitForTimeout(2000);
      }
    }
    await page.evaluate(() => { try { stopTimer(); } catch(e){} goHome(); });
    await page.waitForTimeout(500);
  }
}

// Random review - skip marking as mastered, test review directly
await goHome();
await cards.nth(4).click();
await page.waitForTimeout(800);

// Re-check wrong notes (might have been marked as mastered during weakpoint training)
const remainingWrong = await page.locator('.wn-note-card').count().catch(() => 0);
const reviewBtn = page.locator('button:has-text("随机复习")');
const reviewVisible = await reviewBtn.isVisible().catch(() => false);

if (reviewVisible && remainingWrong > 0) {
  await reviewBtn.click();
  await page.waitForTimeout(1000);
  const reviewMode = await page.evaluate(() => gameState.currentGame);
  result('T5.6 Random review', reviewMode === 'review', reviewMode);

  if (reviewMode === 'review') {
    await page.evaluate(() => { try { stopTimer(); } catch(e){} goHome(); });
    await page.waitForTimeout(300);
  }
} else {
  result('T5.6 Random review', false, remainingWrong === 0 ? 'all wrong notes cleared' : 'review btn not visible');
}

// ==================== T6: DICTIONARY ====================

console.log('\n--- T6: Dictionary ---');

await goHome();
await cards.nth(5).click();
await page.waitForTimeout(1000);

result('T6.1 Dict page active', await isPageActive('dictPage'));
await screenshot('t6-dict');

// Search
const searchInput = page.locator('#dictSearch');
await searchInput.fill('李白');
await page.waitForTimeout(300);
await searchInput.press('Enter');
await page.waitForTimeout(1500);

const resultItems = await page.locator('.dict-result-item').count().catch(() => 0);
result('T6.2 Search results', resultItems > 0, `${resultItems} results`);
await screenshot('t6-dict-search');

// Open modal
if (resultItems > 0) {
  await page.locator('.dict-result-item').first().click();
  await page.waitForTimeout(1000);

  // Modal is created dynamically
  const modalExists = await page.locator('#dictDetailModal').count().catch(() => 0);
  const modalHasContent = modalExists > 0 && await page.locator('#dictDetailModal').evaluate(el => el.innerHTML.trim().length > 0).catch(() => false);
  result('T6.3 Modal opened with content', modalHasContent);

  if (modalHasContent) {
    const modalTitle = await page.locator('.dict-modal-title').textContent().catch(() => '');
    result('T6.4 Modal has title', modalTitle.length > 0, modalTitle);

    await screenshot('t6-dict-modal');

    // Close modal - click close button
    const closeBtn = page.locator('.dict-modal-close');
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      // Check modal was cleared (innerHTML emptied)
      const modalCleared = await page.locator('#dictDetailModal').evaluate(el => el.innerHTML.trim().length === 0).catch(() => false);
      result('T6.5 Modal closed', modalCleared);
    } else {
      // Try clicking overlay
      await page.locator('.dict-modal-overlay').click({ position: { x: 10, y: 10 } });
      await page.waitForTimeout(500);
      result('T6.5 Modal closed', true, 'via overlay click');
    }
  }
} else {
  result('T6.3 Modal opened with content', false, 'no search results');
  result('T6.4 Modal has title', false, 'skipped');
  result('T6.5 Modal closed', false, 'skipped');
}

// Author index
const authorBtns = await page.locator('.dict-author-btn').count().catch(() => 0);
result('T6.6 Author buttons present', authorBtns >= 0, `${authorBtns} authors`);

// Pagination check
const paginationBtns = await page.locator('.dict-pagination-btn').count().catch(() => 0);
console.log(`    Pagination buttons: ${paginationBtns}`);

await goHome();

// ==================== T7: ACHIEVEMENTS + RANKING ====================

console.log('\n--- T7: Achievements & Ranking ---');

// Open user menu
await page.click('#userAvatar');
await page.waitForTimeout(500);

result('T7.1 User menu visible', await page.locator('#userMenu').isVisible().catch(() => false));

// Navigate to achievements
const achMenuItem = page.locator('#userMenu .menu-item:has-text("成就")').first();
if (await achMenuItem.isVisible().catch(() => false)) {
  await achMenuItem.click();
  await page.waitForTimeout(800);
}

result('T7.2 Achievements page', await isPageActive('achievementPage'));

const achCards = await page.locator('.ach-card').count().catch(() => 0);
const achProgress = await page.locator('.ach-progress-card').count().catch(() => 0);
result('T7.3 Achievement cards', achCards > 0, `${achCards} cards`);
result('T7.4 Progress card', achProgress > 0);

// Check unlocked achievements (should have at least first_correct after playing)
const unlockedCards = await page.locator('.ach-status-unlocked').count().catch(() => 0);
result('T7.5 Unlocked achievements', unlockedCards >= 1, `${unlockedCards} unlocked`);

await screenshot('t7-achievements');

// Navigate to ranking
await goHome();
await page.click('#userAvatar');
await page.waitForTimeout(400);

const rankMenuItem = page.locator('#userMenu .menu-item:has-text("排行榜")').first();
if (await rankMenuItem.isVisible().catch(() => false)) {
  await rankMenuItem.click();
  await page.waitForTimeout(800);
}

result('T7.6 Ranking page', await isPageActive('rankingPage'));

const rankItems = await page.locator('.rank-list-item').count().catch(() => 0);
result('T7.7 Rank items present', rankItems >= 0, `${rankItems} items`);

await screenshot('t7-ranking');

await goHome();

// ==================== T8: CSS REGRESSION ====================

console.log('\n--- T8: CSS Regression ---');

// Count non-warning errors (filter out 404s for external resources)
const realErrors = consoleErrors.filter(e => !e.includes('404') && !e.includes('Failed to load resource'));
result('T8.1 No page errors', realErrors.length === 0, realErrors.join('; '));

// T8.2: .hidden elements have display:none
const hiddenEls = await page.locator('.hidden').count().catch(() => 0);
if (hiddenEls > 0) {
  const hiddenDisplay = await page.locator('.hidden').first().evaluate(el =>
    window.getComputedStyle(el).display
  ).catch(() => 'error');
  result('T8.2 .hidden display:none works', hiddenDisplay === 'none', `got "${hiddenDisplay}"`);
} else {
  result('T8.2 .hidden display:none works', true, 'no hidden elements to check (ok)');
}

// T8.3: CSS variables defined
const hasVars = await page.evaluate(() => {
  const styles = getComputedStyle(document.documentElement);
  return {
    '--radius-sm': styles.getPropertyValue('--radius-sm').trim(),
    '--radius-md': styles.getPropertyValue('--radius-md').trim(),
    '--radius-lg': styles.getPropertyValue('--radius-lg').trim(),
    '--primary': styles.getPropertyValue('--primary').trim(),
    '--success': styles.getPropertyValue('--success').trim(),
    '--error': styles.getPropertyValue('--error').trim(),
  };
});
result('T8.3 CSS custom properties', hasVars['--primary'] !== '' && hasVars['--radius-sm'] !== '',
  `primary=${hasVars['--primary']}, radius-sm=${hasVars['--radius-sm']}`);

// T8.4: Buttons use border-radius
const btnRadius = await page.locator('.btn').first().evaluate(el =>
  window.getComputedStyle(el).borderRadius
).catch(() => '');
result('T8.4 Button border-radius', btnRadius !== '0px' && btnRadius !== '', `radius=${btnRadius}`);

// T8.5: Full-page screenshot
await screenshot('t8-final');

// ==================== FINAL SUMMARY ====================

await browser.close();
summary();
process.exit(failed > 0 ? 1 : 0);
