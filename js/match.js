// ==================== 诗词消消乐 ====================

// 消消乐游戏状态
let matchState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    combo: 0,
    correctCount: 0,
    wrongCount: 0,
    level: 1,
    timer: null,
    selectedChars: [],
    currentQuestion: null
};

function startMatch() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    // 重置状态
    matchState = {
        questions: [],
        currentIndex: 0,
        score: 0,
        combo: 0,
        correctCount: 0,
        wrongCount: 0,
        level: 1,
        timer: null,
        selectedChars: [],
        currentQuestion: null
    };
    
    // 生成题目（混合点字成诗和九宫格）
    matchState.questions = generateMatchQuestions(10);
    
    showPage('matchPage');
    setupMatchGridEvents();
    showMatchQuestion();
}


function setupMatchGridEvents() {
    const jiugongGrid = document.getElementById('jiugonggeGrid');
    const dianziGrid = document.getElementById('dianziGrid');
    if (jiugongGrid && !jiugongGrid._eventsSetup) {
        jiugongGrid.addEventListener('click', function(e) {
            const el = e.target.closest('.jiugong-char');
            if (!el || el.classList.contains('disabled')) return;
            const char = el.dataset.char;
            if (char) selectJiugongChar(el, char);
        });
        jiugongGrid._eventsSetup = true;
    }
    if (dianziGrid && !dianziGrid._eventsSetup) {
        dianziGrid.addEventListener('click', function(e) {
            const el = e.target.closest('.dianzi-char');
            if (!el || el.classList.contains('disabled')) return;
            const char = el.dataset.char;
            if (char) selectDianziChar(el, char);
        });
        dianziGrid._eventsSetup = true;
    }
}


// Fisher-Yates shuffle (uniform distribution, unbiased)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateMatchQuestions(count) {
    // 仅从闯关题库关联的诗词中出题（适合中小学生）
    const questions = [];
    
    // 干扰字库（已转换为简体）
    const 干扰字 = '春夏秋冬日月山水风云花鸟虫鱼天地人东南西北中上下左右前后高低大小多少有无来去生死黑白赤橙黄绿青蓝紫金银铜铁玉石木竹松柏梅兰菊荷莲桂梧桐杨柳桃杏梨枣核桃樱桃草莓葡萄西瓜黄瓜萝卜白菜茄子番茄土豆牛肉羊肉猪肉鸡肉鸭肉鹅肉鱼肉虾蟹贝壳虫蚂蚁蜜蜂蝴蝶蜻蜓蜘蛛乌鸦喜鹊鹦鹉鸽子燕子大雁麻雀老鹰熊猫老虎狮子大象猴子兔子狐狸狼头鹰乌龟蛇青蛙蟾蜍虾米'.split('');
    
    // 从闯关题库关联的诗词中选取（只选题库用到的诗词，适合中小学）
    const validPoemIds = new Set();
    if (typeof QUESTIONS_DATA !== 'undefined') {
        QUESTIONS_DATA.forEach(q => {
            if (!q.deleted && q.poemId) validPoemIds.add(q.poemId);
        });
    }
    
    // 过滤：只保留题库关联的诗词，且有内容
    let pool = POEMS_DATA.filter(p =>
        validPoemIds.has(p.id) &&
        p.content && Array.isArray(p.content) &&
        p.content.some(l => l && l.length >= 5 && l.length <= 12)
    );
    
    // 如果题库关联诗词太少（少于count），补充难度<=3的诗词
    if (pool.length < count) {
        const extra = POEMS_DATA.filter(p =>
            !validPoemIds.has(p.id) &&
            (!p.difficulty || p.difficulty <= 3) &&
            p.content && Array.isArray(p.content) &&
            p.content.some(l => l && l.length >= 5 && l.length <= 12)
        );
        pool = [...pool, ...extra];
    }
    
    const shuffledPoems = pool;
    
    for (let i = 0; i < Math.min(count, shuffledPoems.length); i++) {
        const poem = shuffledPoems[i];
        
        // 随机选取一句诗
        let answerLine = '';
        if (poem.content && Array.isArray(poem.content)) {
            const lines = poem.content.filter(l => l && l.length >= 5 && l.length <= 12);
            if (lines.length > 0) {
                answerLine = toSimplified(lines[Math.floor(Math.random() * lines.length)]);
            }
        }
        
        if (!answerLine) continue;
        
        // 清理答案字符并转换为简体
        const answer = toSimplified(answerLine.replace(/[，。！？、；：""''【】《》（）,.!?\s]/g, ''));
        if (answer.length < 4 || answer.length > 15) continue;
        
        // 转换为消消乐格式
        const gameQ = {
            id: `poem_${poem.id}_${i}`,
            answer: answer,
            poem: toSimplified(poem.title || '无题'),
            author: toSimplified(poem.author || '佚名'),
            dynasty: toSimplified(poem.dynasty || ''),
            fullText: toSimplified(poem.fullText || poem.content?.join('，') || ''),
            interpretation: toSimplified(poem.interpretation || ''),
            content: poem.content ? poem.content.map(l => toSimplified(l)) : [],
            keySentence: toSimplified(poem.keySentence || ''),
            knowledgePoints: poem.knowledgePoints || [],
            difficulty: poem.difficulty || 0,
            grades: poem.grades || [],
            explanation: `${toSimplified(poem.dynasty || '')}·${toSimplified(poem.author || '佚名')}《${toSimplified(poem.title || '无题')}》`,
            gameType: 'dianzichengshi'
        };
        
        // 生成字符数组（用于九宫格/点字成诗）
        let chars = answer.split('');
        
        // Random game mode: dianzichengshi, jiugongge, or shiergongge
        const gameMode = ['dianzichengshi', 'jiugongge', 'shiergongge'][Math.floor(Math.random() * 3)];
        
        // 根据模式调整字符数量
        const targetCount = gameMode === 'shiergongge' ? 12 : 9;
        
        // 去除答案中重复的字符，保留唯一字符
        let uniqueAnswerChars = [...new Set(chars)];
        chars = [...uniqueAnswerChars];

        // 如果答案唯一字符超过targetCount，截断为前N个（罕见：古诗句通常≤7字）
        if (chars.length > targetCount) {
        	chars = chars.slice(0, targetCount);
        }

        // 添加干扰字直到达到targetCount
        while (chars.length < targetCount) {
        	const 随机字 = 干扰字[Math.floor(Math.random() * 干扰字.length)];
        	if (!chars.includes(随机字)) chars.push(随机字);
        }
        chars;
        gameQ.chars = chars;
        gameQ.gameType = gameMode;
        
        questions.push(gameQ);
    }
    
    return questions;
}

function showMatchQuestion() {
    if (matchState.currentIndex >= matchState.questions.length) {
        endMatch();
        return;
    }
    
    const q = matchState.questions[matchState.currentIndex];
    matchState.currentQuestion = q;
    matchState.selectedChars = [];
    
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchCombo').textContent = matchState.combo + '连击';
    document.getElementById('matchLevel').textContent = matchState.level;
    document.getElementById('matchResult').classList.add('hidden');
    
    if (q.gameType === 'jiugongge') {
        showJiugongGe(q);
    } else if (q.gameType === 'shiergongge') {
        showShiergongGe(q);
    } else {
        showDianZiChengShi(q);
    }
}

function showJiugongGe(q) {
    document.getElementById('matchType').textContent = '九宫格';
    document.getElementById('matchQuestion').textContent = '从下方9个字中选出正确的一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    const selectedDisplay = document.getElementById('selectedCharsDisplay');
    
    grid.classList.remove('hidden');
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 重置为3列九宫格
    dianzi.classList.add('hidden');
    selectedDisplay.classList.add('hidden'); // 九宫格不需要显示选中区
    matchState.selectedChars = [];
    matchState.currentQuestion = q; // 设置当前题目，包含answer字段
    
    // 打乱汉字
    const chars = [...q.chars];
    
    grid.innerHTML = chars.map((char, idx) => `
        <div class="jiugong-char" data-char="${char}" >${char}</div>
    `).join('');
}

function showShiergongGe(q) {
    document.getElementById('matchType').textContent = '十二宫格';
    document.getElementById('matchQuestion').textContent = '从下方12个字中选出正确的一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    const selectedDisplay = document.getElementById('selectedCharsDisplay');
    
    grid.classList.remove('hidden');
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4列十二宫格
    dianzi.classList.add('hidden');
    selectedDisplay.classList.remove('hidden'); // 显示选中区
    
    // 重置选中状态
    matchState.selectedChars = [];
    matchState.currentQuestion = q; // 设置当前题目，包含answer字段
    document.getElementById('selectedCharsText').textContent = '';
    
    // 打乱汉字
    const chars = [...q.chars];
    
    grid.innerHTML = chars.map((char, idx) => `
        <div class="jiugong-char" data-char="${char}" >${char}</div>
    `).join('');
}

function selectJiugongChar(element, char) {
    if (element.classList.contains('disabled')) return;
    
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        matchState.selectedChars.push({ char, element });
    } else {
        matchState.selectedChars = matchState.selectedChars.filter(c => c.char !== char);
    }
    
    // 更新显示
    updateSelectedCharsDisplay();
    
    // 九宫格模式：选满答案长度时自动检查
    if (matchState.currentQuestion && matchState.currentQuestion.answer) {
        const answerLen = matchState.currentQuestion.answer.length;
        if (matchState.selectedChars.length === answerLen) {
            // 九宫格自动提交
            setTimeout(() => confirmSelection(), 100);
        }
    }
}

function updateSelectedCharsDisplay() {
    const display = document.getElementById('selectedCharsText');
    display.textContent = matchState.selectedChars.map(c => c.char).join('');
}

// 将confirmSelection绑定到window确保全局可访问
window.confirmSelection = function() {
    try {
        const answerLen = matchState.currentQuestion.answer.length;
        if (matchState.selectedChars.length === answerLen) {
            checkMatchAnswer();
        }
    } catch(e) {
        console.error('confirmSelection error:', e);
    }
};
function confirmSelection() {
    window.confirmSelection();
}

function clearSelection() {
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
    });
    matchState.selectedChars = [];
    updateSelectedCharsDisplay();
}

function showDianZiChengShi(q) {
    document.getElementById('matchType').textContent = '点字成诗';
    document.getElementById('matchQuestion').textContent = '将下列汉字组成一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    const selectedDisplay = document.getElementById('selectedCharsDisplay');
    
    grid.classList.add('hidden');
    dianzi.classList.remove('hidden');
    selectedDisplay.classList.add('hidden'); // 隐藏选中区
    matchState.selectedChars = [];
    
    // 打乱汉字
    const chars = [...q.chars];
    
    dianzi.innerHTML = chars.map((char, idx) => `
        <div class="dianzi-char" data-char="${char}" >${char}</div>
    `).join('') + `
        <div class="selected-poem" id="selectedPoem"></div>
        <button class="btn dianzi-submit-btn" onclick="submitDianziAnswer()">确认</button>
        <button class="btn btn-secondary dianzi-clear-btn" onclick="clearDianziSelection()">清空</button>
    `;
}

function selectDianziChar(element, char) {
    if (element.classList.contains('disabled')) return;
    
    element.classList.add('selected');
    element.classList.add('disabled');
    
    matchState.selectedChars.push({ char, element });
    updateSelectedPoemDisplay();
}

function updateSelectedPoemDisplay() {
    let display = document.getElementById('selectedPoem');
    if (!display) return;
    
    display.innerHTML = matchState.selectedChars.map(c => 
        `<span class="selected-char">${c.char}</span>`
    ).join('');
}

function clearDianziSelection() {
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected', 'disabled');
    });
    matchState.selectedChars = [];
    updateSelectedPoemDisplay();
}

function submitDianziAnswer() {
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    
    if (answer === correct) {
        handleMatchCorrect();
    } else {
        handleMatchWrong();
    }
}

function checkMatchAnswer() {
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    
    if (answer === correct) {
        handleMatchCorrect();
    } else {
        handleMatchWrong();
    }
}

function handleMatchCorrect() {
    matchState.correctCount++;
    matchState.combo++;
    let points = 10 + Math.min(matchState.combo - 1, 5) * 2;
    matchState.score += points;
    
    // 追踪题目掌握（如果题目有id）
    if (matchState.currentQuestion && matchState.currentQuestion.id) {
        const q = QUESTIONS_DATA.find(q => q.id === matchState.currentQuestion.id);
        if (q) recordQuestionCorrect(q);
    }
    
    // 显示正确
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
        c.element.classList.add('correct');
    });
    
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchCombo').textContent = matchState.combo + '连击';
    
    const result = document.getElementById('matchResult');
    result.classList.remove('hidden');
    result.innerHTML = `
        <div class="match-feedback-correct">正 正确！+${points}分</div>
        <div class="match-feedback-sub">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
    `;
    
    setTimeout(() => {
        matchState.currentIndex++;
        showMatchQuestion();
    }, 1500);
}

function handleMatchWrong() {
    matchState.wrongCount++;
    matchState.combo = 0;
    
    // 显示错误
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
        c.element.classList.add('wrong');
    });
    
    // 显示正确答案
    const correctChars = matchState.currentQuestion.answer.split('');
    document.querySelectorAll('.jiugong-char, .dianzi-char').forEach(el => {
        if (correctChars.includes(el.dataset.char)) {
            el.classList.add('correct');
        }
    });
    
    document.getElementById('matchCombo').textContent = '0连击';
    
    const result = document.getElementById('matchResult');
    result.classList.remove('hidden');
    result.innerHTML = `
        <div class="match-feedback-wrong">✗ 错误！正确答案是：${matchState.currentQuestion.answer}</div>
        <div class="match-feedback-sub">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
    `;
    
    // 记录错题
    if (matchState.currentQuestion) {
        recordWrongQuestion(matchState.currentQuestion);
    }
    
    setTimeout(() => {
        matchState.currentIndex++;
        showMatchQuestion();
    }, 2000);
}

function showMatchAnswer() {
    const q = matchState.currentQuestion;
    if (!q) return;
    
    // 清除选中状态
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
    });
    
    // 构建答案HTML
    let answerHtml = '<div class="match-answer-container">';

    // 诗词标题
    answerHtml += '<div class="match-answer-header">';
    answerHtml += '<div class="match-answer-title">' + q.poem + '</div>';
    answerHtml += '<div class="match-answer-author">' + q.dynasty + ' · ' + q.author + '</div>';
    answerHtml += '</div>';

    // 诗词全文
    if (q.fullText) {
        answerHtml += '<div class="match-answer-section match-answer-section-light">';
        answerHtml += '<div class="match-answer-text">' + q.fullText.replace(/,/g, '，').replace(/\./g, '。') + '</div>';
        answerHtml += '</div>';
    }

    // 译文/解析
    if (q.interpretation) {
        answerHtml += '<div class="match-answer-section match-answer-section-green">';
        answerHtml += '<div class="match-answer-section-title match-answer-section-title-green">文 译文</div>';
        answerHtml += '<div class="match-answer-interp-text">' + q.interpretation + '</div>';
        answerHtml += '</div>';
    }

    // 关键词句
    if (q.keySentence) {
        answerHtml += '<div class="match-answer-section match-answer-section-orange">';
        answerHtml += '<div class="match-answer-section-title match-answer-section-title-orange">星 关键词句</div>';
        answerHtml += '<div class="match-answer-key-text">' + q.keySentence + '</div>';
        answerHtml += '</div>';
    }

    // 知识要点
    if (q.knowledgePoints && q.knowledgePoints.length > 0) {
        answerHtml += '<div class="match-answer-knowledge-wrap">';
        answerHtml += '<div class="match-answer-section-title match-answer-section-title-gray">书 知识要点</div>';
        answerHtml += '<div class="match-answer-tags">';
        q.knowledgePoints.forEach(kp => {
            answerHtml += '<span class="match-answer-tag">' + kp + '</span>';
        });
        answerHtml += '</div></div>';
    }

    // 正确答案
    answerHtml += '<div class="match-answer-section match-answer-section-success">';
    answerHtml += '<div class="match-answer-correct-label">正 正确答案是</div>';
    answerHtml += '<div class="match-answer-correct-text">' + q.answer + '</div>';
    answerHtml += '</div>';

    // 返回按钮
    answerHtml += '<div class="match-answer-footer">';
    answerHtml += '<button class="btn" onclick="continueMatchAnswer()">继续答题</button>';
    answerHtml += '</div>';

    answerHtml += '</div>';
    
    // 显示答案
    const result = document.getElementById('matchResult');
    result.classList.remove('hidden');
    result.innerHTML = answerHtml;
    
    // 隐藏九宫格/点字区域
    document.getElementById('jiugonggeGrid').classList.add('hidden');
    document.getElementById('dianziGrid').classList.add('hidden');
    document.getElementById('selectedCharsDisplay').classList.add('hidden');
}

function continueMatchAnswer() {
    // 隐藏答案，返回游戏
    document.getElementById('matchResult').classList.add('hidden');
    document.getElementById('jiugonggeGrid').classList.remove('hidden');
    document.getElementById('dianziGrid').classList.remove('hidden');
    if (matchState.currentQuestion && matchState.currentQuestion.gameType === 'shiergongge') {
        document.getElementById('selectedCharsDisplay').classList.remove('hidden');
    }
}

function endMatch() {
    clearInterval(matchState.timer);
    
    // 更新用户数据
    gameState.currentUser.xp += matchState.score;

    // 记录到排行榜
    const total = matchState.correctCount + matchState.wrongCount;
    recordGameResult('match', matchState.score, matchState.correctCount, total, 0);

    saveUser();
    updateUserDisplay();
    
    const result = document.getElementById('matchResult');
    result.classList.remove('hidden');
    result.innerHTML = `
        <div class="match-complete-title">贺 通关！</div>
        <div class="match-complete-info">得分：<strong>${matchState.score}</strong> 分</div>
        <div class="match-complete-actions">
            <button class="btn" onclick="startMatch()">再玩一次</button>
            <button class="btn btn-secondary" onclick="goHome()">返回主页</button>
        </div>
    `;
    
    showToast(`诗词消消乐完成！+${matchState.score} XP`);
}

