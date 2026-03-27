// 古诗词大挑战 - 游戏主逻辑

// ==================== 全局状态 ====================
let gameState = {
    currentUser: null,
    currentGame: null,
    currentQuestion: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    questions: [],
    timer: null,
    timeElapsed: 0
};

// ==================== 用户系统 ====================

// 初始化用户
function initUser() {
    loadUser();
    if (!gameState.currentUser) {
        showLoginModal();
    } else {
        updateUserDisplay();
    }
}

// 加载用户数据
function loadUser() {
    const saved = localStorage.getItem('poetry_user');
    if (saved) {
        gameState.currentUser = JSON.parse(saved);
    }
}

// 保存用户数据
function saveUser() {
    localStorage.setItem('poetry_user', JSON.stringify(gameState.currentUser));
}

// 显示登录弹窗
function showLoginModal(pendingMode) {
    const username = prompt('请输入你的昵称：', '诗词达人');
    if (username && username.trim()) {
        gameState.currentUser = {
            name: username.trim(),
            xp: 0,
            level: 1,
            correctCount: 0,
            totalCount: 0,
            masteredPoems: [],
            wrongQuestions: [],
            achievements: [],
            dailyBest: null,
            lastDailyDate: null
        };
        saveUser();
        updateUserDisplay();
        showToast(`欢迎，${username}！开始诗词之旅吧！`);
        
        // 登录后继续启动游戏
        if (pendingMode) {
            continueStartGame(pendingMode);
        }
    }
}

// 登录后继续启动游戏
function continueStartGame(mode) {
    if (mode === 'challenge') {
        showLevelSelect();
    } else if (mode === 'daily') {
        startDailyChallenge();
    } else if (mode === 'feihua') {
        startFeihua();
    } else if (mode === 'match') {
        startMatch();
    }
}

// 更新用户显示
function updateUserDisplay() {
    if (!gameState.currentUser) return;
    
    document.getElementById('xpBadge').textContent = `XP: ${gameState.currentUser.xp}`;
    document.getElementById('levelBadge').textContent = `Lv.${gameState.currentUser.level}`;
}

// 切换用户
function switchUser() {
    hideUserMenu();
    localStorage.removeItem('poetry_user');
    gameState.currentUser = null;
    showLoginModal();
}

// 删除用户
function deleteUser() {
    hideUserMenu();
    if (confirm('确定要删除当前用户吗？所有数据将被清除！')) {
        localStorage.removeItem('poetry_user');
        gameState.currentUser = null;
        showLoginModal();
    }
}

// ==================== 页面导航 ====================

// 显示指定页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// 返回主页
function goHome() {
    stopTimer();
    showPage('homePage');
}

// ==================== 游戏流程 ====================

// 开始游戏
function startGame(mode) {
    if (!gameState.currentUser) {
        showLoginModal(mode);
        return;
    }
    
    gameState.currentGame = mode;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.timeElapsed = 0;
    
    if (mode === 'challenge') {
        showLevelSelect();
    } else if (mode === 'daily') {
        startDailyChallenge();
    } else if (mode === 'feihua') {
        startFeihua();
    } else if (mode === 'match') {
        startMatch();
    }
}

// 显示关卡选择
function showLevelSelect() {
    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    
    Object.entries(GRADE_LEVELS).forEach(([key, level]) => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.onclick = () => startChallenge(key);
        card.innerHTML = `
            <div class="module-icon">${level.icon}</div>
            <div class="module-title">${level.name}</div>
            <div class="module-desc">${level.description}</div>
        `;
        grid.appendChild(card);
    });
    
    showPage('levelSelectPage');
}

// 开始闯关
function startChallenge(grade) {
    const level = GRADE_LEVELS[grade];
    gameState.questions = getQuestionsByGrade(grade, level.questions);
    
    if (gameState.questions.length === 0) {
        showToast('该年级暂没有题目，敬请期待！');
        return;
    }
    
    document.getElementById('gameTitle').textContent = level.name;
    showPage('gamePage');
    showQuestion();
}

// 开始每日挑战
function startDailyChallenge() {
    const today = new Date().toDateString();
    
    // 检查今日是否已挑战
    if (gameState.currentUser.lastDailyDate === today && gameState.currentUser.dailyBest !== null) {
        if (!confirm('今日已挑战过，最高分：' + gameState.currentUser.dailyBest + '分。是否重新挑战？')) {
            goHome();
            return;
        }
    }
    
    gameState.questions = getRandomQuestions(10);
    document.getElementById('gameTitle').textContent = '每日挑战';
    showPage('gamePage');
    showQuestion();
}

// 显示题目
function showQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
        return;
    }
    
    const q = gameState.questions[gameState.currentQuestion];
    
    // 更新进度
    document.getElementById('questionType').textContent = getQuestionTypeName(q.type);
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('combo').textContent = gameState.combo + '连击';
    
    // 生成选项
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    if (q.type === 'fill' || q.type === 'interpret') {
        // 填空题或鉴赏题只显示选项
        q.options.forEach((opt, idx) => {
            const option = createOptionElement(opt, idx);
            container.appendChild(option);
        });
    } else {
        // 选择题
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const option = createOptionElement(opt, idx, letters[idx]);
            container.appendChild(option);
        });
    }
    
    // 隐藏解析
    document.getElementById('explanation').classList.remove('show');
    
    // 开始计时
    startTimer();
}

// 创建选项元素
function createOptionElement(opt, idx, letter = null) {
    const div = document.createElement('div');
    div.className = 'option';
    div.dataset.index = idx;
    
    let content = '';
    if (letter) {
        content = `<span class="option-letter">${letter}</span>`;
    }
    content += `<span>${opt.text}</span>`;
    div.innerHTML = content;
    
    div.onclick = () => selectOption(div, opt.correct);
    
    return div;
}

// 选择选项
function selectOption(element, isCorrect) {
    // 禁用所有选项
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });
    
    const q = gameState.questions[gameState.currentQuestion];
    
    if (isCorrect) {
        element.classList.add('correct');
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
        
        // 计算得分
        let points = 10;
        if (gameState.combo > 1) {
            points += Math.min(gameState.combo - 1, 10) * 2; // 最多+20
        }
        gameState.score += points;
        gameState.correctCount++;
        
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        
        // 显示连击特效
        if (gameState.combo >= 5) {
            showComboEffect();
        }
    } else {
        element.classList.add('wrong');
        gameState.combo = 0;
        gameState.wrongCount++;
        
        // 显示正确答案
        document.querySelectorAll('.option').forEach(opt => {
            const idx = parseInt(opt.dataset.index);
            if (q.options[idx].correct) {
                opt.classList.add('correct');
            }
        });
        
        // 记录错题
        recordWrongQuestion(q);
        
        document.getElementById('combo').textContent = gameState.combo + '连击';
    }
    
    // 显示解析
    document.getElementById('explanationText').innerHTML = `
        <strong>正确答案：</strong>${q.answer}<br><br>
        <strong>解析：</strong>${q.explanation}
    `;
    document.getElementById('explanation').classList.add('show');
    
    // 下一题
    setTimeout(() => {
        gameState.currentQuestion++;
        showQuestion();
    }, 2000);
}

// 获取题目类型名称
function getQuestionTypeName(type) {
    const names = {
        'choice': '选择题',
        'fill': '填空题',
        'order': '排序题',
        'match': '连连看',
        'interpret': '鉴赏题'
    };
    return names[type] || '选择题';
}

// 记录错题
function recordWrongQuestion(q) {
    const user = gameState.currentUser;
    const exists = user.wrongQuestions.some(w => w.id === q.id);
    
    if (!exists) {
        user.wrongQuestions.push({
            id: q.id,
            question: q.question,
            answer: q.answer,
            yourAnswer: '',
            explanation: q.explanation,
            knowledgePoints: q.knowledgePoints,
            date: new Date().toISOString()
        });
        saveUser();
    }
}

// 结束游戏
function endGame() {
    stopTimer();
    
    const user = gameState.currentUser;
    const total = gameState.correctCount + gameState.wrongCount;
    
    // 更新用户数据
    user.totalCount += total;
    user.correctCount += gameState.correctCount;
    user.xp += gameState.score;
    
    // 检查升级
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
        user.level = newLevel;
        showToast(`恭喜升级！现在是 Lv.${newLevel}！`);
    }
    
    // 更新每日挑战记录
    if (gameState.currentGame === 'daily') {
        const today = new Date().toDateString();
        user.lastDailyDate = today;
        if (user.dailyBest === null || gameState.score > user.dailyBest) {
            user.dailyBest = gameState.score;
        }
    }
    
    saveUser();
    updateUserDisplay();
    
    // 显示结果
    showResult();
}

// 显示结果页面
function showResult() {
    const passed = gameState.score >= 80;
    
    document.getElementById('resultIcon').textContent = passed ? '🎉' : '💪';
    document.getElementById('resultTitle').textContent = passed ? '挑战成功！' : '再接再厉！';
    document.getElementById('resultScore').textContent = gameState.score + '分';
    document.getElementById('statCorrect').textContent = gameState.correctCount;
    document.getElementById('statWrong').textContent = gameState.wrongCount;
    document.getElementById('statMaxCombo').textContent = gameState.maxCombo;
    
    // 检查新成就
    checkAchievements();
    
    showPage('resultPage');
}

// 重新开始游戏
function restartGame() {
    if (gameState.currentGame === 'challenge') {
        showLevelSelect();
    } else {
        startGame(gameState.currentGame);
    }
}

// 退出游戏
function exitGame() {
    stopTimer();
    goHome();
}

// 计算等级
function calculateLevel(xp) {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 600) return 3;
    if (xp < 1000) return 4;
    if (xp < 1500) return 5;
    if (xp < 2100) return 6;
    if (xp < 2800) return 7;
    if (xp < 3600) return 8;
    if (xp < 4500) return 9;
    return 10;
}

// ==================== 计时器 ====================

function startTimer() {
    stopTimer();
    gameState.timer = setInterval(() => {
        gameState.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(gameState.timeElapsed / 60);
    const secs = gameState.timeElapsed % 60;
    document.getElementById('timer').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==================== 特效 ====================

// 显示连击特效
function showComboEffect() {
    const effects = ['🔥', '⭐', '🎯', '💫', '🌟'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    showToast(`${effect} ${gameState.combo}连击！`);
}

// 显示Toast提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==================== 飞花令 ====================

// 飞花令游戏状态
let feihuaState = {
    keyword: null,
    poems: [],
    currentIndex: 0,
    timer: null,
    timeLeft: 30,
    score: 0,
    answered: [],
    isPlaying: false
};

function startFeihua() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    // 重置状态
    feihuaState = {
        keyword: null,
        poems: [],
        currentIndex: 0,
        timer: null,
        timeLeft: 30,
        score: 0,
        answered: [],
        isPlaying: false
    };
    
    // 选择关键字
    const chars = ['春', '花', '月', '风', '山', '水', '云', '酒'];
    feihuaState.keyword = chars[Math.floor(Math.random() * chars.length)];
    
    // 获取该关键字的诗句
    const key = Object.keys(FEIHUA_DATA).find(k => FEIHUA_DATA[k].character === feihuaState.keyword);
    if (key) {
        feihuaState.poems = FEIHUA_DATA[key].poems;
    }
    
    // 打乱顺序
    feihuaState.poems.sort(() => Math.random() - 0.5);
    
    // 显示页面
    showPage('feihuaPage');
    document.getElementById('feihuaKeyword').textContent = feihuaState.keyword;
    document.getElementById('feihuaTimer').textContent = '30';
    document.getElementById('feihuaScore').textContent = '0';
    document.getElementById('feihuaCount').textContent = '0/10';
    document.getElementById('feihuaHistory').innerHTML = '';
    document.getElementById('feihuaPrompt').textContent = '点击下方按钮，说出第一句诗';
    document.getElementById('feihuaStartBtn').style.display = 'inline-block';
    document.getElementById('feihuaStartBtn').textContent = '开始飞花令';
}

function startFeihuaGame() {
    feihuaState.isPlaying = true;
    feihuaState.timeLeft = 30;
    document.getElementById('feihuaStartBtn').style.display = 'none';
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="color:var(--primary);font-weight:600;">请说出含"<strong>${feihuaState.keyword}</strong>"字的完整诗句</div>
        <div style="margin-top:10px;font-size:0.9em;color:#888;">例如：${feihuaState.poems[0]?.poem || '春眠不觉晓...'}</div>
    `;
    
    // 开始计时
    feihuaState.timer = setInterval(() => {
        feihuaState.timeLeft--;
        document.getElementById('feihuaTimer').textContent = feihuaState.timeLeft;
        
        if (feihuaState.timeLeft <= 0) {
            endFeihuaRound();
        }
    }, 1000);
}

function submitFeihuaAnswer(poem) {
    if (!feihuaState.isPlaying) return;
    
    // 检查是否已答过
    if (feihuaState.answered.includes(poem)) {
        showToast('这句诗已经答过了！');
        return;
    }
    
    feihuaState.answered.push(poem);
    
    // 显示历史
    const history = document.getElementById('feihuaHistory');
    const span = document.createElement('span');
    span.className = 'feihua-poem correct';
    span.textContent = poem;
    history.appendChild(span);
    
    // 更新计数
    feihuaState.currentIndex++;
    document.getElementById('feihuaCount').textContent = feihuaState.currentIndex + '/10';
    
    // 加分
    feihuaState.score += 10;
    document.getElementById('feihuaScore').textContent = feihuaState.score;
    
    // 检查是否完成10句
    if (feihuaState.currentIndex >= 10) {
        clearInterval(feihuaState.timer);
        endFeihua();
    } else {
        // 继续下一轮
        feihuaState.timeLeft = 30;
        document.getElementById('feihuaTimer').textContent = '30';
        showToast('正确！继续下一句！');
    }
}

function endFeihuaRound() {
    clearInterval(feihuaState.timer);
    feihuaState.isPlaying = false;
    
    // 显示结果
    const history = document.getElementById('feihuaHistory');
    const span = document.createElement('span');
    span.className = 'feihua-poem wrong';
    span.textContent = '⏰';
    span.title = '时间到';
    history.appendChild(span);
    
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="color:var(--error);">时间到！</div>
        <div style="margin-top:10px;">本轮答对 <strong>${feihuaState.currentIndex}</strong> 句，得 <strong>${feihuaState.score}</strong> 分</div>
    `;
    
    // 保存成绩
    if (feihuaState.score > 0) {
        gameState.currentUser.xp += feihuaState.score;
        gameState.currentUser.totalCount += feihuaState.currentIndex;
        gameState.currentUser.correctCount += feihuaState.currentIndex;
        saveUser();
        updateUserDisplay();
    }
    
    document.getElementById('feihuaStartBtn').style.display = 'inline-block';
    document.getElementById('feihuaStartBtn').textContent = '再玩一次';
}

function endFeihua() {
    clearInterval(feihuaState.timer);
    feihuaState.isPlaying = false;
    
    // 保存成绩
    gameState.currentUser.xp += feihuaState.score;
    gameState.currentUser.totalCount += feihuaState.currentIndex;
    gameState.currentUser.correctCount += feihuaState.currentIndex;
    saveUser();
    updateUserDisplay();
    
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="color:var(--success);font-size:1.3em;">🎉 完成！</div>
        <div style="margin-top:10px;">答对 <strong>${feihuaState.currentIndex}</strong> 句，得 <strong>${feihuaState.score}</strong> 分</div>
    `;
    
    document.getElementById('feihuaStartBtn').style.display = 'inline-block';
    document.getElementById('feihuaStartBtn').textContent = '再玩一次';
    
    showToast(`飞花令完成！+${feihuaState.score} XP`);
}

// ==================== 诗词消消乐 ====================

// 消消乐游戏状态
let matchState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    combo: 0,
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
        level: 1,
        timer: null,
        selectedChars: [],
        currentQuestion: null
    };
    
    // 生成题目（混合点字成诗和九宫格）
    matchState.questions = generateMatchQuestions(10);
    
    showPage('matchPage');
    showMatchQuestion();
}

function generateMatchQuestions(count) {
    // 使用QUESTIONS_DATA生成题目
    const questions = [];
    
    // 随机选取题目
    const shuffled = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, shuffled.length));
    
    selected.forEach(q => {
        // 获取诗词信息
        const poem = q.poemId ? POEMS_DATA.find(p => p.id === q.poemId) : null;
        
        // 将题目转换为消消乐格式
        const gameQ = {
            id: q.id,
            question: q.question,
            answer: q.answer,
            options: q.options,
            poem: poem?.title || null,
            author: poem?.author || null,
            explanation: q.explanation,
            gameType: q.type === 'fill' ? 'dianzichengshi' : 'choice'
        };
        
        // 如果是填空题，生成字符数组用于九宫格/点字成诗
        if (q.type === 'fill' && q.answer) {
            // 分割答案为字符，并添加一些干扰字
            const chars = q.answer.replace(/[，、。！？""''【】（）]/g, '').split('');
            const干扰字 = '春夏秋冬日月山水风云花鸟虫鱼天地人'.split('');
            while (chars.length < 9) {
                const 随机字 = 干扰字[Math.floor(Math.random() * 干扰字.length)];
                if (!chars.includes(随机字)) chars.push(随机字);
            }
            // 打乱字符
            chars.sort(() => Math.random() - 0.5);
            gameQ.chars = chars;
        }
        
        questions.push(gameQ);
    });
    
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
    document.getElementById('matchResult').style.display = 'none';
    
    if (q.gameType === 'jiugongge') {
        showJiugongGe(q);
    } else {
        showDianZiChengShi(q);
    }
}

function showJiugongGe(q) {
    document.getElementById('matchType').textContent = '九宫格';
    document.getElementById('matchQuestion').textContent = '从下方9个字中选出正确的一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    
    grid.style.display = 'grid';
    dianzi.style.display = 'none';
    
    // 打乱汉字
    const chars = [...q.chars].sort(() => Math.random() - 0.5);
    
    grid.innerHTML = chars.map((char, idx) => `
        <div class="jiugong-char" data-char="${char}" onclick="selectJiugongChar(this, '${char}')">${char}</div>
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
    
    // 检查是否选满（根据答案长度）
    const answerLen = matchState.currentQuestion.answer.length;
    if (matchState.selectedChars.length === answerLen) {
        checkMatchAnswer();
    }
}

function showDianZiChengShi(q) {
    document.getElementById('matchType').textContent = '点字成诗';
    document.getElementById('matchQuestion').textContent = '将下列汉字组成一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    
    grid.style.display = 'none';
    dianzi.style.display = 'flex';
    
    // 打乱汉字
    const chars = [...q.chars].sort(() => Math.random() - 0.5);
    
    dianzi.innerHTML = chars.map((char, idx) => `
        <div class="dianzi-char" data-char="${char}" onclick="selectDianziChar(this, '${char}')">${char}</div>
    `).join('') + `
        <div class="selected-poem" id="selectedPoem"></div>
        <button class="btn" style="margin-top:15px;" onclick="submitDianziAnswer()">确认</button>
        <button class="btn btn-secondary" style="margin-top:10px;" onclick="clearDianziSelection()">清空</button>
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
    matchState.combo++;
    let points = 10 + Math.min(matchState.combo - 1, 5) * 2;
    matchState.score += points;
    
    // 显示正确
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
        c.element.classList.add('correct');
    });
    
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchCombo').textContent = matchState.combo + '连击';
    
    const result = document.getElementById('matchResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--success);font-size:1.2em;">✓ 正确！+${points}分</div>
        <div style="margin-top:5px;color:#666;">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
    `;
    
    setTimeout(() => {
        matchState.currentIndex++;
        showMatchQuestion();
    }, 1500);
}

function handleMatchWrong() {
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
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--error);font-size:1.2em;">✗ 错误！正确答案是：${matchState.currentQuestion.answer}</div>
        <div style="margin-top:5px;color:#666;">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
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

function endMatch() {
    clearInterval(matchState.timer);
    
    // 更新用户数据
    gameState.currentUser.xp += matchState.score;
    saveUser();
    updateUserDisplay();
    
    const result = document.getElementById('matchResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--success);font-size:1.5em;">🎉 通关！</div>
        <div style="margin-top:10px;">得分：<strong>${matchState.score}</strong> 分</div>
        <div style="margin-top:10px;">
            <button class="btn" onclick="startMatch()">再玩一次</button>
            <button class="btn btn-secondary" onclick="goHome()">返回主页</button>
        </div>
    `;
    
    showToast(`诗词消消乐完成！+${matchState.score} XP`);
}

// ==================== 诗词词典 ====================

function showDict() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    showPage('dictPage');
    
    // 绑定搜索事件
    const searchInput = document.getElementById('dictSearch');
    searchInput.oninput = debounce(searchPoems, 300);
}

function searchPoems() {
    const query = document.getElementById('dictSearch').value.trim().toLowerCase();
    const results = document.getElementById('dictResults');
    
    if (!query) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <p>输入关键词搜索诗词</p>
            </div>
        `;
        return;
    }
    
    const matches = POEMS_DATA.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.content.some(c => c.toLowerCase().includes(query))
    );
    
    if (matches.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>没有找到相关诗词</p>
            </div>
        `;
        return;
    }
    
    results.innerHTML = matches.map(p => `
        <div class="question-box" style="margin-bottom:15px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <strong style="font-size:1.2em;">${p.title}</strong>
                <span style="color:#666;">${p.dynasty}·${p.author}</span>
            </div>
            <div style="color:#666;margin-bottom:10px;">${p.fullText}</div>
            <div style="font-size:0.9em;color:#888;"><strong>释义：</strong>${p.interpretation}</div>
        </div>
    `).join('');
}

// ==================== 错题本 ====================

function showWrongNotes() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    showPage('wrongPage');
    
    const list = document.getElementById('wrongList');
    const wrongs = gameState.currentUser.wrongQuestions;
    
    if (wrongs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎉</div>
                <p>暂无错题记录，太棒了！</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = wrongs.map(w => `
        <div class="question-box" style="margin-bottom:15px;">
            <div class="question-text" style="font-size:1em;margin-bottom:10px;">${w.question}</div>
            <div style="color:#E53935;margin-bottom:5px;"><strong>正确答案：</strong>${w.answer}</div>
            <div style="font-size:0.9em;color:#888;"><strong>解析：</strong>${w.explanation}</div>
        </div>
    `).join('');
}

// ==================== 排行榜 ====================

function showRanking() {
    hideUserMenu();
    showPage('rankingPage');
    
    // TODO: 从服务器获取排行榜
    // 目前显示模拟数据
    const list = document.getElementById('rankingList');
    list.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🏆</div>
            <p>排行榜功能开发中...</p>
        </div>
    `;
}

// ==================== 成就系统 ====================

function showAchievements() {
    hideUserMenu();
    showPage('achievementPage');
    
    const list = document.getElementById('achievementList');
    const userAchs = gameState.currentUser?.achievements || [];
    
    const allAchievements = [
        { id: 'first_correct', name: '初露锋芒', desc: '答对第一题', icon: '🌱' },
        { id: 'combo_5', name: '五连绝世', desc: '达成5连击', icon: '🔥' },
        { id: 'combo_10', name: '十全十美', desc: '达成10连击', icon: '⭐' },
        { id: 'perfect', name: '满分通关', desc: '一次通关获得100分', icon: '💯' },
        { id: 'poem_10', name: '诗词达人', desc: '掌握10首诗词', icon: '📚' }
    ];
    
    list.innerHTML = allAchievements.map(a => {
        const unlocked = userAchs.includes(a.id);
        return `
            <div class="module-card" style="opacity:${unlocked ? 1 : 0.5};">
                <div class="module-icon">${a.icon}</div>
                <div class="module-title">${a.name}</div>
                <div class="module-desc">${a.desc}</div>
                <div style="margin-top:5px;color:${unlocked ? '#4CAF50' : '#999'};">
                    ${unlocked ? '✅ 已解锁' : '🔒 未解锁'}
                </div>
            </div>
        `;
    }).join('');
}

function checkAchievements() {
    const user = gameState.currentUser;
    if (!user) return;
    
    const newAchs = [];
    
    // 初露锋芒
    if (!user.achievements.includes('first_correct') && gameState.correctCount >= 1) {
        newAchs.push('first_correct');
    }
    
    // 五连绝世
    if (!user.achievements.includes('combo_5') && gameState.maxCombo >= 5) {
        newAchs.push('combo_5');
    }
    
    // 十全十美
    if (!user.achievements.includes('combo_10') && gameState.maxCombo >= 10) {
        newAchs.push('combo_10');
    }
    
    // 满分通关
    if (!user.achievements.includes('perfect') && gameState.score >= 100) {
        newAchs.push('perfect');
    }
    
    if (newAchs.length > 0) {
        user.achievements.push(...newAchs);
        saveUser();
        
        // 显示成就弹窗
        const achNames = {
            'first_correct': '初露锋芒',
            'combo_5': '五连绝世',
            'combo_10': '十全十美',
            'perfect': '满分通关'
        };
        
        showAchievementBadge(achNames[newAchs[0]]);
    }
}

function showAchievementBadge(name) {
    const badge = document.getElementById('achievementBadge');
    document.getElementById('achievementName').textContent = name;
    badge.classList.add('show');
    
    setTimeout(() => {
        badge.classList.remove('show');
    }, 3000);
}

// ==================== 用户菜单 ====================

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

function hideUserMenu() {
    document.getElementById('userMenu').classList.remove('show');
}

// 点击其他地方关闭菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('#userAvatar') && !e.target.closest('#userMenu')) {
        hideUserMenu();
    }
});

document.getElementById('userAvatar').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserMenu();
});

// ==================== 工具函数 ====================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initUser();
});
