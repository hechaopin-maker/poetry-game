
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

// 获取指定年级的题目
function getQuestionsByGrade(grade, count = 10) {
    // 过滤掉2个月内已掌握的题目和非诗词题目（poetryType: false）
    const available = QUESTIONS_DATA.filter(q => q.grade === grade && !q.deleted && !isQuestionMastered(q.id) && q.poetryType !== false);
    // 打乱顺序并返回指定数量
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 获取随机题目（用于每日挑战）
function getRandomQuestions(count = 10) {
    // 过滤掉2个月内已掌握的题目和非诗词题目（poetryType: false）
    const available = [...QUESTIONS_DATA].filter(q => !q.deleted && !isQuestionMastered(q.id) && q.poetryType !== false);
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
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

// 下一题（点击按钮跳转）
function nextQuestion() {
    document.getElementById('nextQuestionBtn').style.display = 'none';
    gameState.currentQuestion++;
    showQuestion();
}

// 显示题目
function showQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
        return;
    }
    
    // 隐藏"下一题"按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    
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
        // 填空题或鉴赏题：检查是否有选项
        if (q.options && q.options.length > 0) {
            // 有选项时显示选项（选择题模式）
            q.options.forEach((opt, idx) => {
                const option = createOptionElement(opt, idx);
                container.appendChild(option);
            });
        } else {
            // 无选项时显示输入框（填空题模式）
            // 检查题目中有多少个空
            const blankCount = (q.question.match(/__________/g) || []).length;
            
            const inputBox = document.createElement('div');
            inputBox.className = 'fill-input-container';
            
            if (blankCount > 1) {
                // 多个空：创建多个输入框
                let inputsHTML = '';
                for (let i = 0; i < blankCount; i++) {
                    const placeholder = `请输入第${i + 1}个答案`;
                    inputsHTML += `<input type="text" class="fill-input" id="fillAnswerInput${i}" 
                                   placeholder="${placeholder}" 
                                   autocomplete="off"
                                   style="margin-bottom:10px">`;
                }
                inputBox.innerHTML = inputsHTML + `<button class="btn" onclick="submitFillAnswer()">提交答案</button>` + 
                    `<div style="text-align:center;margin-top:15px;">
                        <a href="javascript:void(0)" onclick="skipAndShowAnswer()" style="color:#666;font-size:14px;text-decoration:underline;">不会做？点此查看答案（记为错题）</a>
                    </div>`;
                // 保存空白数量到gameState
                gameState.currentBlankCount = blankCount;
            } else {
                // 单个空：创建单个输入框
                inputBox.innerHTML = `
                    <input type="text" class="fill-input" id="fillAnswerInput0" 
                           placeholder="请输入答案..." 
                           autocomplete="off">
                    <button class="btn" onclick="submitFillAnswer()">提交答案</button>
                    <div style="text-align:center;margin-top:15px;">
                        <a href="javascript:void(0)" onclick="skipAndShowAnswer()" style="color:#666;font-size:14px;text-decoration:underline;">不会做？点此查看答案（记为错题）</a>
                    </div>
                `;
                gameState.currentBlankCount = 1;
            }
            
            container.appendChild(inputBox);
            // 使用addEventListener绑定keydown事件（修复onkeypress在部分浏览器不触发的问题）
            for (let i = 0; i < blankCount; i++) {
                const input = document.getElementById('fillAnswerInput' + i);
                if (input) {
                    input.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submitFillAnswer();
                        }
                    });
                }
            }
            // 自动聚焦第一个输入框
            setTimeout(() => {
                const input = document.getElementById('fillAnswerInput0');
                if (input) input.focus();
            }, 100);
        }
    } else {
        // 选择题
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const option = createOptionElement(opt, idx, letters[idx]);
            container.appendChild(option);
        });
        // 添加"跳过看答案"链接
        const skipLink = document.createElement('div');
        skipLink.style.textAlign = 'center';
        skipLink.style.marginTop = '15px';
        skipLink.innerHTML = '<a href="javascript:void(0)" onclick="skipChoiceAndShowAnswer()" style="color:#666;font-size:14px;text-decoration:underline;">不会做？点此查看答案（记为错题）</a>';
        container.appendChild(skipLink);
    }
    
    // 隐藏解析
    document.getElementById('explanation').classList.remove('show');
    
    // 开始计时
    startTimer();
}

// 提交填空答案
function submitFillAnswer() {
    const q = gameState.questions[gameState.currentQuestion];
    const blankCount = gameState.currentBlankCount || 1;
    
    // 获取所有输入框的值
    const userAnswers = [];
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) {
            userAnswers.push(input.value.trim());
        }
    }
    
    // 检查是否有空输入
    if (userAnswers.some(ans => !ans)) {
        showToast('请填写所有空');
        return;
    }
    
    // 分割正确答案
    const answerParts = q.answer.split('；');
    
    // 检查答案是否正确
    let allCorrect = true;
    let correctParts = 0;
    
    for (let i = 0; i < blankCount; i++) {
        const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
        const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
        
        if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns)) {
            correctParts++;
        }
    }
    
    allCorrect = (correctParts === blankCount);
    
    // 禁用所有输入框
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) input.disabled = true;
    }
    
    // 显示答题结果
    if (allCorrect) {
        for (let i = 0; i < blankCount; i++) {
            const input = document.getElementById('fillAnswerInput' + i);
            if (input) {
                input.style.borderColor = 'var(--success)';
                input.style.background = '#E8F5E9';
            }
        }
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
        let points = 10;
        if (gameState.combo > 1) {
            points += Math.min(gameState.combo - 1, 10) * 2;
        }
        gameState.score += points;
        gameState.correctCount++;
        recordQuestionCorrect(q);
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        if (gameState.combo >= 5) showComboEffect();
    } else {
        for (let i = 0; i < blankCount; i++) {
            const input = document.getElementById('fillAnswerInput' + i);
            if (input) {
                const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
                const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
                if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns)) {
                    input.style.borderColor = 'var(--success)';
                    input.style.background = '#E8F5E9';
                } else {
                    input.style.borderColor = 'var(--error)';
                    input.style.background = '#FFEBEE';
                    input.value = '正确答案：' + answerParts[i];
                    input.style.color = 'var(--error)';
                }
            }
        }
        gameState.combo = 0;
        gameState.wrongCount++;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        recordWrongQuestion(q);
    }
    
    // 显示解析（增强版：包含诗词全文、作者、朝代、释义）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    updateShowPoemButton(q);
    
    if (allCorrect) {
        // 答对了：1.5秒后自动进入下一题
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        // 答错了：显示"下一题"按钮，让学生点击后进入下一题
        const nextBtn = document.getElementById('nextQuestionBtn');
        nextBtn.style.display = 'inline-block';
        // 确保onclick正确绑定
        nextBtn.onclick = nextQuestion;
    }
}

// 跳过并显示答案（记为错题）
function skipAndShowAnswer() {
    const q = gameState.questions[gameState.currentQuestion];
    const blankCount = gameState.currentBlankCount || 1;
    
    // 获取正确答案并填入输入框
    const answerParts = q.answer.split('；');
    
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) {
            input.value = answerParts[i] || '';
            input.style.borderColor = 'var(--error)';
            input.style.background = '#FFEBEE';
            input.style.color = 'var(--error)';
            input.disabled = true;
        }
    }
    
    // 重置连击
    gameState.combo = 0;
    document.getElementById('combo').textContent = '0连击';
    
    // 记录为错题
    gameState.wrongCount++;
    recordWrongQuestion(q);
    
    // 显示解析（增强版）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    updateShowPoemButton(q);
    
    // 显示"下一题"按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.style.display = 'inline-block';
    // 确保onclick正确绑定
    nextBtn.onclick = nextQuestion;
    
    // 如果当前用户在诗词闯关或每日挑战，更新用户数据
    if (gameState.currentUser) {
        gameState.currentUser.totalCount++;
        gameState.currentUser.wrongCount = (gameState.currentUser.wrongCount || 0) + 1;
        saveUser();
        updateUserDisplay();
    }
}

// 跳过选择题并显示答案（记为错题）
function skipChoiceAndShowAnswer() {
    const q = gameState.questions[gameState.currentQuestion];

    // 禁用所有选项
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });

    // 显示正确答案（绿色高亮）
    document.querySelectorAll('.option').forEach(opt => {
        const idx = parseInt(opt.dataset.index);
        if (q.options[idx].correct) {
            opt.classList.add('correct');
        }
    });

    // 重置连击
    gameState.combo = 0;
    document.getElementById('combo').textContent = '0连击';

    // 记录为错题
    gameState.wrongCount++;
    recordWrongQuestion(q);

    // 显示解析（增强版）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    updateShowPoemButton(q);

    // 显示"下一题"按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    nextBtn.style.display = 'inline-block';
    nextBtn.onclick = nextQuestion;

    // 如果当前用户在诗词闯关或每日挑战，更新用户数据
    if (gameState.currentUser) {
        gameState.currentUser.totalCount++;
        gameState.currentUser.wrongCount = (gameState.currentUser.wrongCount || 0) + 1;
        saveUser();
        updateUserDisplay();
    }
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
        recordQuestionCorrect(q);
        
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
    
    // 显示解析（增强版）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    updateShowPoemButton(q);
    
    if (isCorrect) {
        // 答对了：1.5秒后自动进入下一题
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        // 答错了：显示"下一题"按钮，让学生点击后进入下一题
        const nextBtn = document.getElementById('nextQuestionBtn');
        nextBtn.style.display = 'inline-block';
        // 确保onclick正确绑定
        nextBtn.onclick = nextQuestion;
    }
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
    
    // 答错了，重置该题目的连续正确次数
    if (user.questionMastery[q.id]) {
        user.questionMastery[q.id].consecutiveCorrect = 0;
        saveUser();
    }
}

// 记录答对题目（用于追踪是否连续答对两次）
function recordQuestionCorrect(q) {
    const user = gameState.currentUser;
    if (!user.questionMastery[q.id]) {
        user.questionMastery[q.id] = { consecutiveCorrect: 0, masteredAt: null };
    }
    
    user.questionMastery[q.id].consecutiveCorrect++;
    
    // 连续答对2次，标记为已掌握
    if (user.questionMastery[q.id].consecutiveCorrect >= 2) {
        user.questionMastery[q.id].masteredAt = Date.now();
        // 从错题本中移除（如果之前有错）
        user.wrongQuestions = user.wrongQuestions.filter(w => w.id !== q.id);
        showToast('贺 已掌握此知识点，2个月后再复习！');
    }
    
    saveUser();
}

// 检查题目是否在2个月内的已掌握列表中
function isQuestionMastered(questionId) {
    const user = gameState.currentUser;
    const mastery = user.questionMastery[questionId];
    
    if (!mastery || !mastery.masteredAt) return false;
    
    // 检查是否已过2个月（60天）
    const TWO_MONTHS = 60 * 24 * 60 * 60 * 1000;
    if (Date.now() - mastery.masteredAt > TWO_MONTHS) {
        // 已过2个月，清除掌握状态，可重新出现
        delete user.questionMastery[questionId];
        saveUser();
        return false;
    }
    
    return true;
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
    
    // 记录到排行榜
    const completedLevels = gameState.currentGame === 'challenge' ? 1 : 0;
    recordGameResult(gameState.currentGame, gameState.score, gameState.correctCount, total, completedLevels);

    saveUser();
    updateUserDisplay();

    // 显示结果
    showResult();
}

// 显示结果页面
function showResult() {
    const passed = gameState.score >= 80;
    
    document.getElementById('resultIcon').textContent = passed ? '贺' : '劲';
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
    } else if (gameState.currentGame === 'weakpoint') {
        goHome();
    } else if (gameState.currentGame === 'review') {
        startWrongReview();
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

