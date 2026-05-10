// ==================== 飞花令 ====================

// 飞花令游戏状态
let feihuaState = {
    keyword: null,
    poems: [],           // 当前关键字下的所有诗句 [{poem, author, title}, ...]
    currentIndex: 0,     // 已说出的诗句数
    correctCount: 0,      // 答对的次数
    timer: null,
    timeLeft: 500,       // 500秒倒计时
    score: 0,
    answered: [],         // 已说出的诗句列表（用于去重）
    isPlaying: false,
    completedKeywords: [], // 已完成的关键字列表（30轮内不重复）
    totalRounds: 0,       // 累计进行的轮数（用于计算30轮限制）
    roundKeyword: null,    // 当前轮的关键字（用于记录到已完成列表）
    combo: 0,             // 连击数
    isLearningMode: false  // 学习模式标志
};

// 切换飞花令学习/挑战模式
function toggleFeihuaMode() {
    feihuaState.isLearningMode = !feihuaState.isLearningMode;
    const modeBtn = document.getElementById('feihuaModeToggle');
    const challengeArea = document.getElementById('feihuaChallengeArea');
    const learningArea = document.getElementById('feihuaLearningArea');
    const progress = document.getElementById('feihuaProgress');
    
    if (feihuaState.isLearningMode) {
        // 切换到学习模式
        modeBtn.textContent = '🎮 切换到挑战模式';
        challengeArea.style.display = 'none';
        learningArea.style.display = 'block';
        progress.style.display = 'none';
        
        // 停止正在进行的挑战
        if (feihuaState.timer) {
            clearInterval(feihuaState.timer);
            feihuaState.timer = null;
        }
        feihuaState.isPlaying = false;
        
        // 开始学习模式
        startFeihuaLearning();
    } else {
        // 切换到挑战模式
        modeBtn.textContent = '书 切换到学习模式';
        challengeArea.style.display = 'block';
        learningArea.style.display = 'none';
        progress.style.display = 'flex';
        
        // 重置状态
        document.getElementById('feihuaHistory').innerHTML = '';
        document.getElementById('feihuaPrompt').textContent = '点击下方按钮，说出第一句诗';
    }
}

// 开始学习模式
function startFeihuaLearning() {
    // 选择一个关键字
    const pool = getFeihuaKeywordPool();
    if (pool.length === 0) {
        document.getElementById('feihuaLearningPoems').innerHTML = '<div style="color:#888;text-align:center;padding:20px;">诗句数据加载中...</div>';
        return;
    }
    
    const keyword = pool[Math.floor(Math.random() * Math.min(pool.length, 200))]; // 从前200个常用字中选
    feihuaState.keyword = keyword;
    
    // 获取该关键字的所有诗句
    let poems = [];
    if (window.FEIHUA_DATA && window.FEIHUA_DATA[keyword]) {
        poems = Array.from(window.FEIHUA_DATA[keyword]).map(item => ({
            poem: item.t,
            author: item.a || '佚名',
            title: item.ti || '未知'
        }));
    } else if (typeof FEIHUA_FULL_DATA !== 'undefined' && FEIHUA_FULL_DATA.keywords && FEIHUA_FULL_DATA.keywords[keyword]) {
        poems = FEIHUA_FULL_DATA.keywords[keyword].l.map(item => ({
            poem: item.t,
            author: item.a || '佚名',
            title: item.ti || '未知'
        }));
    }
    
    // 显示关键字
    document.getElementById('feihuaLearningKeyword').textContent = keyword;
    
    // 显示诗句列表（最多显示20句）
    const poemsContainer = document.getElementById('feihuaLearningPoems');
    if (poems.length === 0) {
        poemsContainer.innerHTML = '<div style="color:#888;text-align:center;padding:20px;">暂未收录该字的诗句</div>';
        return;
    }
    
    // 打乱顺序并限制数量
    poems.sort(() => Math.random() - 0.5);
    const displayPoems = poems.slice(0, 20);
    
    // 生成HTML
    let html = '<div style="background:var(--card);border-radius:12px;padding:15px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">';
    displayPoems.forEach((p, i) => {
        const keywordPos = p.poem.indexOf(keyword) + 1;
        html += `
            <div style="padding:12px 0;border-bottom:${i < displayPoems.length - 1 ? '1px solid #eee' : 'none'};display:flex;align-items:flex-start;gap:10px;">
                <div style="flex:1;">
                    <div style="font-size:1.1em;color:var(--text);margin-bottom:5px;line-height:1.5;">"${p.poem}"</div>
                    <div style="color:#666;font-size:0.85em;">—— ${p.author}《${p.title}》</div>
                    <div style="color:#999;font-size:0.75em;margin-top:3px;">「${keyword}」在第${keywordPos}个字</div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    if (poems.length > 20) {
        html += `<div style="text-align:center;color:#888;font-size:0.85em;padding:10px;">（共${poems.length}句，显示前20句）</div>`;
    }
    
    poemsContainer.innerHTML = html;
}

// 学习模式：下一个关键字
function nextLearningKeyword() {
    startFeihuaLearning();
}

// 获取飞花令关键字池（按诗句数量降序排列，多的在前=简单）
function getFeihuaKeywordPool() {
    // 优先使用新数据
    if (window.FEIHUA_DATA && Object.keys(window.FEIHUA_DATA).length > 0) {
        const keywords = Object.keys(window.FEIHUA_DATA);
        return keywords.sort((a, b) => {
            const countA = window.FEIHUA_DATA[a]?.size || 0;
            const countB = window.FEIHUA_DATA[b]?.size || 0;
            return countB - countA;
        });
    }
    
    // 备用旧数据
    if (typeof FEIHUA_FULL_DATA !== 'undefined' && FEIHUA_FULL_DATA.keywords) {
        const keywords = Object.keys(FEIHUA_FULL_DATA.keywords);
        return keywords.sort((a, b) => {
            const countA = FEIHUA_FULL_DATA.keywords[a].l.length;
            const countB = FEIHUA_FULL_DATA.keywords[b].l.length;
            return countB - countA;
        });
    }
    
    console.warn('飞花令数据未加载，使用空池');
    return [];
}

// 选择下一个关键字（避开已完成的关键字）
function pickNextFeihuaKeyword() {
    const sortedKeywords = getFeihuaKeywordPool();
    
    // 过滤掉已完成的关键字（当前轮往前30轮内出现过的）
    const avoidKeywords = feihuaState.completedKeywords.slice(-30);
    const availableKeywords = sortedKeywords.filter(k => !avoidKeywords.includes(k) && window.FEIHUA_DATA[k]?.size > 0);
    
    // 如果可用关键字池为空（极少情况），从全部关键字中选
    const pool = availableKeywords.length > 0 ? availableKeywords : sortedKeywords;
    
    // 优先从诗句多的关键字中选择（前50个）
    const topPool = pool.slice(0, Math.min(50, pool.length));
    return topPool[Math.floor(Math.random() * topPool.length)] || '春';
}

// 从诗句中提取新关键字并切换
function switchToNewKeyword(poem) {
    if (!poem) return;
    
    // 从诗句中提取所有汉字
    const chars = poem.replace(/[，。！？、；：""''（）\s\d\w]/g, '').split('');
    
    // 过滤掉已完成的关键字（30轮内）和没有诗词库的字符
    const avoidKeywords = feihuaState.completedKeywords.slice(-30);
    const hasNewData = window.FEIHUA_DATA && Object.keys(window.FEIHUA_DATA).length > 0;
    const hasOldData = typeof FEIHUA_FULL_DATA !== 'undefined' && FEIHUA_FULL_DATA.keywords;
    
    const availableChars = chars.filter(c => {
        if (avoidKeywords.includes(c)) return false;
        if (hasNewData && window.FEIHUA_DATA[c]?.size > 0) return true;
        if (hasOldData && FEIHUA_FULL_DATA.keywords[c]) return true;
        return false;
    });
    
    // 如果诗句中没有可用字符，随机选一个关键字
    if (availableChars.length === 0) {
        feihuaState.keyword = pickNextFeihuaKeyword();
    } else {
        // 随机选择一个字符作为新关键字
        feihuaState.keyword = availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    
    // 添加到已完成关键字记录
    feihuaState.completedKeywords.push(feihuaState.keyword);
    
    // 加载新关键字的诗句 - 优先新数据，备用旧数据
    let poems = [];
    if (hasNewData && window.getFeihuaPoems) {
        poems = window.getFeihuaPoems(feihuaState.keyword);
        feihuaState.poems = poems.map(p => ({
            poem: p.text,
            author: p.author,
            title: p.title
        }));
    } else if (hasOldData) {
        const keywordData = FEIHUA_FULL_DATA.keywords[feihuaState.keyword];
        if (keywordData) {
            feihuaState.poems = keywordData.l.map(l => ({
                poem: l.t,
                author: l.a,
                title: l.ti
            }));
        }
    }
    feihuaState.poems.sort(() => Math.random() - 0.5);
    
    // 更新UI
    document.getElementById('feihuaKeyword').textContent = feihuaState.keyword;
}

async function startFeihua() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }

    // 按需加载飞花令扩展数据（首次会加载 13MB 数据，已缓存则秒开）
    if (typeof loadFeihuaExpandedData === 'function') {
        showToast('正在准备飞花令数据...');
        await loadFeihuaExpandedData();
    }

    // 检查飞花令数据是否可用
    const hasData = typeof FEIHUA_FULL_DATA !== 'undefined' && FEIHUA_FULL_DATA.keywords;
    if (!hasData) {
        showToast('飞花令数据加载失败');
        return;
    }

    // 重置状态
    feihuaState = {
        keyword: null,
        poems: [],
        currentIndex: 0,
        correctCount: 0,
        timer: null,
        timeLeft: 500,
        score: 0,
        answered: [],
        isPlaying: false,
        completedKeywords: feihuaState.completedKeywords || [], // 保留历史记录
        totalRounds: feihuaState.totalRounds || 0,
        roundKeyword: null,
        combo: 0
    };
    
    // 选择第一个关键字
    feihuaState.keyword = pickNextFeihuaKeyword();
    feihuaState.roundKeyword = feihuaState.keyword;
    feihuaState.completedKeywords.push(feihuaState.keyword);
    feihuaState.totalRounds++;
    
    // 获取该关键字的所有诗句
    const poems = window.getFeihuaPoems ? window.getFeihuaPoems(feihuaState.keyword) : [];
    feihuaState.poems = poems.map(l => ({
        poem: l.text,       // l.text 来自 getFeihuaPoems 返回的 {text, author, title}
        author: l.author || '佚名',
        title: l.title || '无题'
    }));
    
    // 打乱顺序
    feihuaState.poems.sort(() => Math.random() - 0.5);
    
    // 显示页面
    showPage('feihuaPage');
    document.getElementById('feihuaKeyword').textContent = feihuaState.keyword;
    document.getElementById('feihuaTimer').textContent = '200';
    document.getElementById('feihuaScore').textContent = '0';
    document.getElementById('feihuaCount').textContent = '0/2';
    document.getElementById('feihuaHistory').innerHTML = '';
    
    // 清空提示区
    document.getElementById('feihuaPrompt').innerHTML = '';
    // 重置开始按钮
    const btn = document.getElementById('feihuaStartBtn');
    btn.style.display = 'inline-block';
    btn.textContent = '开始挑战';
}

function startFeihuaGame() {
    feihuaState.isPlaying = true;
    feihuaState.timeLeft = 50;
    feihuaState.currentIndex = 0;
    feihuaState.correctCount = 0;
    feihuaState.answered = [];
    feihuaState.combo = 0;
    document.getElementById('feihuaStartBtn').style.display = 'none';
    
    // 显示输入框
    showFeihuaInput();
    
    // 开始计时
    feihuaState.timer = setInterval(() => {
        feihuaState.timeLeft--;
        document.getElementById('feihuaTimer').textContent = feihuaState.timeLeft;
        
        // 时间少于60秒时变红提醒
        if (feihuaState.timeLeft <= 60) {
            document.getElementById('feihuaTimer').style.color = '#e74c3c';
        } else {
            document.getElementById('feihuaTimer').style.color = '';
        }
        
        if (feihuaState.timeLeft <= 0) {
            endFeihuaRound();
        }
    }, 1000);
}

// 显示飞花令输入框
function showFeihuaInput() {
    // 清除整个输入区域并重新构建，确保清理所有提示
    const promptEl = document.getElementById('feihuaPrompt');
    promptEl.innerHTML = '';  // 先清空
    
    promptEl.innerHTML = `
        <div style="text-align:center;margin-bottom:15px;color:#666;font-size:0.95em;">
            请说出含"<strong style="color:var(--primary);font-size:1.2em;">${feihuaState.keyword}</strong>"字的完整诗句
        </div>
        <input type="text" id="feihuaInput" 
               style="width:100%;padding:15px 20px;font-size:1.2em;border:2px solid var(--primary);border-radius:10px;background:var(--bg-secondary);color:var(--text);"
               placeholder="输入诗句，如：春眠不觉晓" 
               data-testid="feihua-input"
               autocomplete="off"
               inputmode="text">
        <button id="feihuaSubmitBtn" class="btn" style="margin-top:15px;padding:12px 30px;font-size:1.1em;width:100%;" onclick="submitFeihuaAnswerByInput()" data-testid="feihua-submit-btn">
            提交答案
        </button>
        <div style="text-align:center;margin-top:12px;">
            <a href="javascript:void(0)" onclick="skipFeihuaAndShowAnswer()" style="color:#888;font-size:14px;text-decoration:underline;">想不起来？查看答案学习一下</a>
        </div>
    `;
    
    // 确保onclick正确绑定
    const submitBtn = document.getElementById('feihuaSubmitBtn');
    if (submitBtn) submitBtn.onclick = submitFeihuaAnswerByInput;
    
    // 自动聚焦输入框
    setTimeout(() => {
        const input = document.getElementById('feihuaInput');
        if (input) {
            input.focus();
            // 绑定Enter键提交（修复onkeypress在部分浏览器不触发的问题）
            // 使用 { once: true } 防止重复绑定
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    submitFeihuaAnswerByInput();
                }
            }, { once: true });
        }
    }, 100);
}

// 提交飞花令答案（精确匹配模式）
function submitFeihuaAnswerByInput() {
    if (!feihuaState.isPlaying) return;
    
    const input = document.getElementById('feihuaInput');
    if (!input) return;
    
    const userAnswer = input.value.trim();
    if (!userAnswer) {
        showToast('请输入诗句');
        return;
    }
    
    // 清理函数：去除标点符号
    const cleanText = (text) => text.replace(/[，。！？、；：""''（）\s]/g, '').toLowerCase();
    
    const cleanAnswer = cleanText(userAnswer);
    
    // 1. 检查是否包含关键字
    if (!cleanAnswer.includes(feihuaState.keyword)) {
        showToast(`答案中必须包含"${feihuaState.keyword}"字！`);
        input.value = '';
        return;
    }
    
    // 2. 检查是否已答过（精确匹配，去除所有空格和标点后比较）
    const normalizedAnswer = userAnswer.replace(/[\s，。！？、；：""''（）]/g, '');
    const alreadyAnswered = feihuaState.answered.some(a => 
        a.replace(/[\s，。！？、；：""''（）]/g, '') === normalizedAnswer
    );
    if (alreadyAnswered) {
        showToast('这句诗已经说过了！');
        input.value = '';
        return;
    }
    
    // 3. 在诗词库中查找匹配（使用相同的规范化方式）
    // 优先返回较短的诗句（短诗句通常是更著名、更常用的）
    const normalizedForMatch = userAnswer.replace(/[\s，。！？、；：""''（）]/g, '');
    const sortedPoemData = [...feihuaState.poems].sort((a, b) => {
        const aText = a.text || a.poem || '';
        const bText = b.text || b.poem || '';
        return aText.length - bText.length;
    });
    const matchedPoemData = sortedPoemData.find(p => {
        const poemText = (p.text || p.poem || '').replace(/[，。！？、；：""''（）]/g, '');
        return poemText === normalizedForMatch;
    });
    const matchedPoem = matchedPoemData ? {
        poem: matchedPoemData.text || matchedPoemData.poem || '',
        author: matchedPoemData.author || '佚名',
        title: matchedPoemData.title || '无题'
    } : null;
    
    // 同时检查是否在其他关键字的诗句中（跨库验证）
    let crossMatchedPoem = null;
    if (!matchedPoem) {
        // 遍历所有关键字查找
        for (const char in FEIHUA_FULL_DATA.keywords) {
            const entries = FEIHUA_FULL_DATA.keywords[char].l;
            for (const entry of entries) {
                const cleanEntry = entry.t.replace(/[\s，。！？、；：""''（）]/g, '');
                if (cleanEntry === normalizedForMatch) {
                    crossMatchedPoem = {
                        poem: entry.t,
                        author: entry.a || '佚名',
                        title: entry.ti || '无题'
                    };
                    break;
                }
            }
            if (crossMatchedPoem) break;
        }
    }
    
    const isCorrect = !!matchedPoem || !!crossMatchedPoem;
    const poemData = matchedPoem || crossMatchedPoem;
    
    // 记录答案
    if (isCorrect && poemData) {
        feihuaState.answered.push(poemData.poem);
    } else {
        feihuaState.answered.push(userAnswer); // 错误答案也记录
    }
    
    // 显示到历史
    const history = document.getElementById('feihuaHistory');
    const span = document.createElement('span');
    span.className = isCorrect ? 'feihua-poem correct' : 'feihua-poem wrong';
    span.textContent = userAnswer + (isCorrect ? '' : ' ✗');
    history.appendChild(span);
    
    if (isCorrect) {
        // ========== 答对了 ==========
        feihuaState.currentIndex++;
        feihuaState.correctCount++;
        feihuaState.combo++;
        
        // 计算得分：基础分 + 连击加成
        const baseScore = 10;
        const comboBonus = Math.min(feihuaState.combo - 1, 5) * 2; // 最多+10分
        feihuaState.score += baseScore + comboBonus;
        
        document.getElementById('feihuaCount').textContent = feihuaState.currentIndex + '/2';
        document.getElementById('feihuaScore').textContent = feihuaState.score;
        
        // 显示正确提示（带来源信息）
        showToast(`正 正确！+${baseScore + comboBonus}分${comboBonus > 0 ? ' (连击+' + comboBonus + ')' : ''}`);
        
        // 显示诗句来源
        showPoemSource(poemData);
        
        // 检查是否完成2句
        if (feihuaState.currentIndex >= 2) {
            clearInterval(feihuaState.timer);
            feihuaState.isPlaying = false;
            showFeihuaSuccess();
            return;
        }
        
        input.value = '';
        
    } else {
        // ========== 答错了 ==========
        feihuaState.combo = 0; // 连击中断
        
        // 从当前关键字的诗句中随机选一句显示
        const samplePoem = feihuaState.poems[Math.floor(Math.random() * feihuaState.poems.length)];
        
        // 显示错误提示和学习信息
        showPoemSource(samplePoem, true);
        
        input.value = '';
    }
}

// 显示诗句来源信息
function showPoemSource(poemData, isError = false) {
    const promptEl = document.getElementById('feihuaPrompt');
    // 清理旧的来源提示，避免堆积
    const oldSource = promptEl.querySelector('.poem-source-box');
    if (oldSource) oldSource.remove();

    const bgColor = isError ? 'rgba(231,76,60,0.15)' : 'rgba(46,204,113,0.15)';
    const borderColor = isError ? '#e74c3c' : '#2ecc71';
    const label = isError ? '文 这句诗是这样的（学习一下）' : '正 诗句出处';
    
    const sourceDiv = document.createElement('div');
    sourceDiv.className = 'poem-source-box';
    sourceDiv.style.cssText = `margin:15px 0;padding:15px;background:${bgColor};border-radius:10px;border-left:4px solid ${borderColor};`;
    // 截断超长诗句，避免卡片过宽（超过20字截断）
    const poemText = poemData.poem || '';
    const displayText = poemText.length > 20 ? poemText.slice(0, 20) + '…' : poemText;
    const authorName = poemData.author || '佚名';
    const poemTitle = poemData.title || '无题';

    sourceDiv.innerHTML = `
        <div style="color:${borderColor};font-weight:bold;margin-bottom:10px;">${label}</div>
        <div style="font-size:1.2em;color:var(--text);margin-bottom:8px;line-height:1.6;">"${displayText}"</div>
        <div style="color:#666;font-size:0.9em;">—— ${authorName}《${poemTitle}》</div>
    `;
    
    promptEl.appendChild(sourceDiv);
    
    // 3秒后移除提示（给用户学习时间）
    setTimeout(() => {
        if (sourceDiv.parentNode) sourceDiv.remove();
    }, isError ? 5000 : 3000);
}

// 飞花令跳过显示答案（学习模式）
function skipFeihuaAndShowAnswer() {
    if (!feihuaState.isPlaying) return;
    
    // 从当前关键字的未答过的诗句中选一句显示
    const unansweredPoems = feihuaState.poems.filter(p => !feihuaState.answered.includes(p.poem));
    
    if (unansweredPoems.length === 0) {
        // 所有诗句都说过了
        showToast('太棒了！这个字的诗句都说完了！');
        return;
    }
    
    const samplePoem = unansweredPoems[Math.floor(Math.random() * unansweredPoems.length)];
    
    // 显示完整学习信息
    const promptEl = document.getElementById('feihuaPrompt');
    const hint = document.createElement('div');
    hint.style.cssText = 'margin:15px 0;padding:15px;background:rgba(52,152,219,0.15);border-radius:10px;border-left:4px solid #3498db;';
    hint.innerHTML = `
        <div style="color:#3498db;font-weight:bold;margin-bottom:10px;">文 学习一下这句诗</div>
        <div style="font-size:1.3em;color:var(--text);margin-bottom:10px;line-height:1.6;">"${samplePoem.poem}"</div>
        <div style="color:#666;font-size:0.95em;margin-bottom:5px;">—— ${samplePoem.author}《${samplePoem.title}》</div>
        <div style="color:#888;font-size:0.85em;">关键字：「<strong>${feihuaState.keyword}</strong>」在这句诗的第${samplePoem.poem.indexOf(feihuaState.keyword) + 1}个字位置</div>
    `;
    promptEl.appendChild(hint);
    
    // 重置输入框
    const input = document.getElementById('feihuaInput');
    if (input) {
        input.value = '';
        input.focus();
    }
    
    // 5秒后移除提示
    setTimeout(() => {
        if (hint.parentNode) hint.remove();
    }, 5000);
}

// 飞花令挑战成功
function showFeihuaSuccess() {
    const completionBonus = 100; // 完成2句奖励
    feihuaState.score += completionBonus;
    
    // 保存成绩
    gameState.currentUser.xp += feihuaState.score;
    gameState.currentUser.totalCount += feihuaState.currentIndex;
    gameState.currentUser.correctCount += feihuaState.correctCount;
    saveUser();
    updateUserDisplay();
    
    // 找出没说出的诗句（学习内容）
    const answeredPoems = feihuaState.answered;
    const unsaidPoems = feihuaState.poems.filter(p => !answeredPoems.includes(p.poem));
    
    // 生成学习内容HTML
    let learningContent = '';
    if (unsaidPoems.length > 0) {
        learningContent = `
            <div style="margin-top:20px;padding-top:20px;border-top:1px dashed #ddd;">
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">书 这些诗句你也应该掌握：</div>
                <div style="max-height:200px;overflow-y:auto;">
                    ${unsaidPoems.map(p => `
                        <div style="margin-bottom:10px;padding:8px;background:rgba(230,126,34,0.1);border-radius:6px;">
                            <div style="color:var(--text);">"${p.poem}"</div>
                            <div style="color:#888;font-size:0.85em;">—— ${p.author}《${p.title}》</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="text-align:center;padding:20px;">
            <div style="font-size:2.5em;margin-bottom:10px;">贺</div>
            <div style="color:#27ae60;font-size:1.5em;font-weight:bold;">挑战成功！</div>
            <div style="color:#888;margin-top:5px;">关键字「${feihuaState.keyword}」</div>
        </div>
        <div style="background:rgba(39,174,96,0.15);border-radius:10px;padding:15px;margin-top:15px;">
            <div style="display:flex;justify-content:space-around;text-align:center;">
                <div>
                    <div style="font-size:1.8em;color:#27ae60;font-weight:bold;">${feihuaState.correctCount}</div>
                    <div style="color:#888;font-size:0.85em;">说出诗句</div>
                </div>
                <div>
                    <div style="font-size:1.8em;color:#e67e22;font-weight:bold;">${unsaidPoems.length}</div>
                    <div style="color:#888;font-size:0.85em;">待学习</div>
                </div>
                <div>
                    <div style="font-size:1.8em;color:#3498db;font-weight:bold;">${feihuaState.score}</div>
                    <div style="color:#888;font-size:0.85em;">总得分</div>
                </div>
            </div>
        </div>
        <div style="text-align:center;color:#888;font-size:0.9em;margin-top:10px;">
            完成奖励：+${completionBonus}分
        </div>
        ${learningContent}
        <div style="text-align:center;margin-top:20px;">
            <button class="btn" style="padding:15px 40px;font-size:1.1em;background:var(--primary);" onclick="startNextFeihuaRound()">
                下一轮 →
            </button>
        </div>
    `;
    
    document.getElementById('feihuaStartBtn').style.display = 'none';
    showToast(`贺 挑战成功！+${completionBonus}完成奖励！`);
    
    // 1.5秒后自动进入下一轮
    setTimeout(() => startNextFeihuaRound(), 1500);
}

// 开始下一轮飞花令
function startNextFeihuaRound() {
    // 选择新关键字
    feihuaState.keyword = pickNextFeihuaKeyword();
    feihuaState.roundKeyword = feihuaState.keyword;
    feihuaState.completedKeywords.push(feihuaState.keyword);
    feihuaState.totalRounds++;
    
    // 重置本轮状态
    feihuaState.currentIndex = 0;
    feihuaState.correctCount = 0;
    feihuaState.answered = [];
    feihuaState.combo = 0;
    feihuaState.timeLeft = 50;
    feihuaState.isPlaying = true;
    
    // 获取新关键字的诗句
    const keywordData = FEIHUA_FULL_DATA.keywords[feihuaState.keyword];
    feihuaState.poems = keywordData.l.map(l => ({
        poem: l.t,
        author: l.a || '佚名',
        title: l.ti || '无题'
    }));
    feihuaState.poems.sort(() => Math.random() - 0.5);
    
    // 更新显示
    document.getElementById('feihuaKeyword').textContent = feihuaState.keyword;
    document.getElementById('feihuaTimer').textContent = '50';
    document.getElementById('feihuaTimer').style.color = '';
    document.getElementById('feihuaScore').textContent = feihuaState.score; // 保留总分
    document.getElementById('feihuaCount').textContent = '0/2';
    document.getElementById('feihuaHistory').innerHTML = '';
    
    // 显示输入框
    showFeihuaInput();
}

// 时间到（未完成2句）
function endFeihuaRound() {
    clearInterval(feihuaState.timer);
    feihuaState.isPlaying = false;
    
    // 找出没说出的诗句
    const answeredPoems = feihuaState.answered;
    const unsaidPoems = feihuaState.poems.filter(p => !answeredPoems.includes(p.poem));
    
    // 保存成绩
    gameState.currentUser.xp += feihuaState.score;
    gameState.currentUser.totalCount += feihuaState.currentIndex;
    gameState.currentUser.correctCount += feihuaState.correctCount;
    saveUser();
    updateUserDisplay();
    
    // 生成学习内容HTML
    let learningContent = '';
    if (unsaidPoems.length > 0) {
        learningContent = `
            <div style="margin-top:20px;padding-top:20px;border-top:1px dashed #ddd;">
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">书 这些诗句没答出来，学习一下吧：</div>
                <div style="max-height:180px;overflow-y:auto;">
                    ${unsaidPoems.map(p => `
                        <div style="margin-bottom:10px;padding:8px;background:rgba(230,126,34,0.1);border-radius:6px;">
                            <div style="color:var(--text);">"${p.poem}"</div>
                            <div style="color:#888;font-size:0.85em;">—— ${p.author}《${p.title}》</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="text-align:center;padding:15px;">
            <div style="font-size:2em;margin-bottom:5px;">⏰</div>
            <div style="color:var(--error);font-size:1.3em;font-weight:bold;">时间到！</div>
        </div>
        <div style="background:rgba(149,165,166,0.2);border-radius:10px;padding:15px;margin-top:10px;">
            <div style="display:flex;justify-content:space-around;text-align:center;">
                <div>
                    <div style="font-size:1.5em;color:#27ae60;font-weight:bold;">${feihuaState.correctCount}/2</div>
                    <div style="color:#888;font-size:0.85em;">完成进度</div>
                </div>
                <div>
                    <div style="font-size:1.5em;color:#e67e22;font-weight:bold;">${unsaidPoems.length}</div>
                    <div style="color:#888;font-size:0.85em;">待学习</div>
                </div>
                <div>
                    <div style="font-size:1.5em;color:#3498db;font-weight:bold;">${feihuaState.score}</div>
                    <div style="color:#888;font-size:0.85em;">获得分数</div>
                </div>
            </div>
        </div>
        ${learningContent}
        <div style="text-align:center;margin-top:20px;">
            <button class="btn" style="padding:12px 30px;margin-right:10px;" onclick="startFeihua()">
                重新开始
            </button>
            <button class="btn" style="padding:12px 30px;background:var(--primary);" onclick="startNextFeihuaRound()">
                下一轮 →
            </button>
        </div>
    `;
    
    document.getElementById('feihuaStartBtn').style.display = 'none';
}

// 结束飞花令（保留，用于"再玩一次"）
function endFeihua() {
    clearInterval(feihuaState.timer);
    feihuaState.isPlaying = false;

    // 保存成绩
    gameState.currentUser.xp += feihuaState.score;
    gameState.currentUser.totalCount += feihuaState.currentIndex;
    gameState.currentUser.correctCount += feihuaState.correctCount;

    // 记录到排行榜
    const total = feihuaState.currentIndex;
    recordGameResult('feihua', feihuaState.score, feihuaState.correctCount, total, 0);

    saveUser();
    updateUserDisplay();
    
    // 找出没说出的诗句
    const answeredPoems = feihuaState.answered;
    const unsaidPoems = feihuaState.poems.filter(p => !answeredPoems.includes(p.poem));
    
    // 生成学习内容HTML
    let learningContent = '';
    if (unsaidPoems.length > 0) {
        learningContent = `
            <div style="margin-top:20px;padding-top:20px;border-top:1px dashed #ddd;">
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">书 这些诗句也值得掌握：</div>
                <div style="max-height:200px;overflow-y:auto;">
                    ${unsaidPoems.map(p => `
                        <div style="margin-bottom:10px;padding:8px;background:rgba(230,126,34,0.1);border-radius:6px;">
                            <div style="color:var(--text);">"${p.poem}"</div>
                            <div style="color:#888;font-size:0.85em;">—— ${p.author}《${p.title}》</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="text-align:center;padding:15px;">
            <div style="font-size:2em;margin-bottom:5px;">贺</div>
            <div style="color:#27ae60;font-size:1.3em;font-weight:bold;">完成！</div>
        </div>
        <div style="background:rgba(39,174,96,0.15);border-radius:10px;padding:15px;margin-top:10px;">
            <div style="display:flex;justify-content:space-around;text-align:center;">
                <div>
                    <div style="font-size:1.5em;color:#27ae60;font-weight:bold;">${feihuaState.correctCount}</div>
                    <div style="color:#888;font-size:0.85em;">完成句数</div>
                </div>
                <div>
                    <div style="font-size:1.5em;color:#e67e22;font-weight:bold;">${unsaidPoems.length}</div>
                    <div style="color:#888;font-size:0.85em;">待学习</div>
                </div>
                <div>
                    <div style="font-size:1.5em;color:#3498db;font-weight:bold;">${feihuaState.score}</div>
                    <div style="color:#888;font-size:0.85em;">总得分</div>
                </div>
            </div>
        </div>
        ${learningContent}
        <div style="text-align:center;margin-top:20px;">
            <button class="btn" style="padding:15px 40px;background:var(--primary);" onclick="startNextFeihuaRound()">
                下一轮 →
            </button>
        </div>
    `;
    
    document.getElementById('feihuaStartBtn').style.display = 'inline-block';
    document.getElementById('feihuaStartBtn').textContent = '再玩一次';
    
    showToast(`飞花令完成！+${feihuaState.score} XP`);
}

