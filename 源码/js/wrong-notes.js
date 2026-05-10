// ==================== 错题本 ====================

// 计算知识点错误统计
function getWrongKnowledgeStats() {
    const user = gameState.currentUser;
    if (!user || !user.wrongQuestions || user.wrongQuestions.length === 0) {
        return [];
    }

    const stats = {};
    user.wrongQuestions.forEach(w => {
        if (!w.knowledgePoints || !Array.isArray(w.knowledgePoints)) return;
        w.knowledgePoints.forEach(kp => {
            if (!stats[kp]) stats[kp] = { count: 0, questions: [] };
            stats[kp].count++;
            stats[kp].questions.push(w.id);
        });
    });

    return Object.entries(stats)
        .map(([name, data]) => ({ name, count: data.count, questionIds: data.questions }))
        .sort((a, b) => b.count - a.count);
}

// 按知识点生成专项训练题目
function startWeakPointTraining(knowledgePoint) {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }

    // 从题库中筛选包含该知识点的题目
    const pool = QUESTIONS_DATA.filter(q =>
        q.knowledgePoints && q.knowledgePoints.includes(knowledgePoint)
    );

    if (pool.length === 0) {
        showToast('该知识点暂无训练题目');
        return;
    }

    // 随机选 10 题（或全部如果不足10题）
    const selected = shuffle([...pool]).slice(0, Math.min(10, pool.length));

    gameState.currentGame = 'weakpoint';
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.timeElapsed = 0;
    gameState.questions = selected;

    showPage('gamePage');
    showQuestion();
    startTimer();
}

// 标记错题为已掌握
function markWrongAsMastered(questionId) {
    const user = gameState.currentUser;
    if (!user || !user.wrongQuestions) return;

    user.wrongQuestions = user.wrongQuestions.filter(w => w.id !== questionId);
    saveUser();
    showToast('已标记为掌握，该题不再出现在错题本');

    // 刷新错题本显示
    showWrongNotes();
}

// 错题本专项训练提交答案（复用 game-core 逻辑但模式为 weakpoint）
function submitWeakPointAnswer(answer) {
    const q = gameState.questions[gameState.currentQuestion];
    const correct = q.answer;
    const isCorrect = cleanPunctuation(answer) === cleanPunctuation(correct);

    if (isCorrect) {
        gameState.correctCount++;
        gameState.combo++;
        gameState.score += calculateScore(10, gameState.combo);
        if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;

        // 连续答对2次标记为掌握
        recordQuestionCorrect(q);

        showToast('正确！+' + calculateScore(10, gameState.combo) + '分');
    } else {
        gameState.wrongCount++;
        gameState.combo = 0;
        recordWrongQuestion(q);
        showToast('错误，正确答案：' + correct);
    }

    gameState.currentQuestion++;

    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
    } else {
        showQuestion();
    }
}

function showWrongNotes() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }

    showPage('wrongPage');

    const list = document.getElementById('wrongList');

    // 清理无效的错题数据
    const originalCount = gameState.currentUser.wrongQuestions.length;
    gameState.currentUser.wrongQuestions = gameState.currentUser.wrongQuestions.filter(w =>
        w && w.question && w.question !== 'undefined' && w.question.trim() !== ''
    );
    const cleanedCount = originalCount - gameState.currentUser.wrongQuestions.length;
    if (cleanedCount > 0) {
        saveUser();
        showToast(`已清理 ${cleanedCount} 条无效错题记录`);
    }

    const wrongs = gameState.currentUser.wrongQuestions;
    const stats = getWrongKnowledgeStats();

    if (wrongs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">贺</div>
                <p>暂无错题记录，太棒了！</p>
            </div>
        `;
        return;
    }

    // 知识点统计区
    let html = '';
    if (stats.length > 0) {
        html += `
            <div style="margin-bottom:20px;padding:15px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <div style="font-weight:bold;color:var(--gold-dark);margin-bottom:12px;">薄弱知识点</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
        `;
        stats.slice(0, 8).forEach(s => {
            html += `
                <button class="btn btn-secondary" onclick="startWeakPointTraining('${s.name}')"
                    style="font-size:0.85em;padding:6px 12px;"
                    title="${s.count} 道错题 · 点击开始专项训练">
                    ${s.name} <span style="color:#e74c3c;font-weight:bold;">${s.count}</span>
                </button>
            `;
        });
        html += `
                </div>
                <div style="font-size:0.8em;color:#888;margin-top:10px;">
                    点击知识点标签开始专项训练
                </div>
            </div>
        `;
    }

    // 错题列表
    html += `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;">
            <div style="font-weight:bold;color:#333;">共 ${wrongs.length} 道错题</div>
            <button class="btn btn-secondary" onclick="startWrongReview()" style="font-size:0.85em;">
                随机复习
            </button>
        </div>
    `;

    html += wrongs.map(w => {
        const q = {
            id: w.id,
            question: w.question,
            answer: w.answer,
            explanation: w.explanation,
            knowledgePoints: w.knowledgePoints
        };
        const enhancedExplanation = getEnhancedExplanation(q);
        const kps = (w.knowledgePoints || []).map(kp =>
            `<span style="display:inline-block;background:var(--gold-light);color:var(--gold-dark);padding:2px 8px;border-radius:12px;font-size:0.75em;margin-right:4px;">${kp}</span>`
        ).join('');

        return `
        <div class="question-box" style="margin-bottom:20px;padding:15px;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <div class="question-text" style="font-size:1em;margin-bottom:15px;color:#333;">${w.question || '（题目已丢失）'}</div>
            ${enhancedExplanation}
            <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #eee;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="color:#888;font-size:0.85em;">
                        错误日期：${new Date(w.date).toLocaleDateString('zh-CN')} &nbsp; ${kps}
                    </div>
                    <button class="btn btn-secondary" onclick="markWrongAsMastered('${w.id}')" style="font-size:0.8em;padding:4px 10px;">
                        已掌握
                    </button>
                </div>
            </div>
        </div>
    `}).join('');

    list.innerHTML = html;
}

// 随机复习错题
function startWrongReview() {
    const user = gameState.currentUser;
    if (!user || !user.wrongQuestions || user.wrongQuestions.length === 0) {
        showToast('暂无疑题可复习');
        return;
    }

    // 从错题中随机选 10 题
    const pool = shuffle([...user.wrongQuestions]).slice(0, Math.min(10, user.wrongQuestions.length));

    // 需要找到对应的完整题目（从 QUESTIONS_DATA）
    const reviewQuestions = pool.map(w => {
        const fullQ = QUESTIONS_DATA.find(q => q.id === w.id);
        return fullQ || w;
    }).filter(Boolean);

    if (reviewQuestions.length === 0) {
        showToast('题目数据不完整，无法复习');
        return;
    }

    gameState.currentGame = 'review';
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.timeElapsed = 0;
    gameState.questions = reviewQuestions;

    showPage('gamePage');
    showQuestion();
    startTimer();
}
