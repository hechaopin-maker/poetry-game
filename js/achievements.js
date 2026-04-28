// ==================== 成就系统 ====================

const ALL_ACHIEVEMENTS = [
    { id: 'first_correct', name: '初露锋芒', desc: '答对第一题', icon: '芽', category: '基础' },
    { id: 'combo_5', name: '五连绝世', desc: '达成5连击', icon: '焰', category: '进阶' },
    { id: 'combo_10', name: '十全十美', desc: '达成10连击', icon: '星', category: '进阶' },
    { id: 'perfect', name: '满分通关', desc: '一次通关获得100分', icon: '百', category: '进阶' },
    { id: 'first_challenge', name: '初出茅庐', desc: '完成首次闯关', icon: '剑', category: '基础' },
    { id: 'daily_7', name: '日积月累', desc: '累计完成7天每日挑战', icon: '历', category: '坚持' },
    { id: 'feihua_20', name: '飞花高手', desc: '飞花令累计答对20句', icon: '花', category: '专项' },
    { id: 'match_10', name: '消消达人', desc: '诗词消消乐通过10关', icon: '消', category: '专项' },
    { id: 'poem_10', name: '诗词达人', desc: '掌握10首诗词', icon: '书', category: '积累' },
    { id: 'poem_100', name: '学富五车', desc: '掌握100首诗词', icon: '车', category: '积累' }
];

function showAchievements() {
    hideUserMenu();
    showPage('achievementPage');

    const list = document.getElementById('achievementList');
    const user = gameState.currentUser;
    const userAchs = user?.achievements || [];

    // 先检查并更新成就状态
    checkAchievements();

    // 按类别分组
    const byCategory = {};
    ALL_ACHIEVEMENTS.forEach(a => {
        if (!byCategory[a.category]) byCategory[a.category] = [];
        byCategory[a.category].push(a);
    });

    let html = '';
    const categoryOrder = ['基础', '进阶', '专项', '坚持', '积累'];

    categoryOrder.forEach(cat => {
        const items = byCategory[cat];
        if (!items || items.length === 0) return;

        const unlockedCount = items.filter(a => userAchs.includes(a.id)).length;
        html += `<div style="margin-bottom:20px;">`;
        html += `<div style="font-weight:bold;color:var(--gold-dark);margin-bottom:10px;padding-bottom:8px;border-bottom:2px solid var(--gold-light);display:flex;justify-content:space-between;align-items:center;">`;
        html += `<span>${cat}</span>`;
        html += `<span style="font-size:0.85em;color:#888;">${unlockedCount}/${items.length}</span>`;
        html += `</div>`;
        html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px;">`;

        html += items.map(a => {
            const unlocked = userAchs.includes(a.id);
            const opacity = unlocked ? 1 : 0.5;
            const bg = unlocked ? 'background:#fff;' : 'background:#f8f8f8;';
            const border = unlocked ? 'border-color:var(--gold-light);' : 'border-color:#eee;';
            const status = unlocked ? '<span style="color:#4CAF50;font-size:0.8em;">已解锁</span>' : '<span style="color:#999;font-size:0.8em;">未解锁</span>';

            return `
                <div class="module-card" style="${bg}${border}border-width:2px;border-style:solid;padding:15px;text-align:center;opacity:${opacity};">
                    <div class="module-icon" style="width:50px;height:50px;font-size:1.5em;">${a.icon}</div>
                    <div class="module-title" style="font-size:0.95em;margin:8px 0 4px;">${a.name}</div>
                    <div class="module-desc" style="font-size:0.8em;color:#888;">${a.desc}</div>
                    <div style="margin-top:8px;">${status}</div>
                </div>
            `;
        }).join('');

        html += `</div></div>`;
    });

    // 总进度
    const totalUnlocked = userAchs.filter(id => ALL_ACHIEVEMENTS.some(a => a.id === id)).length;
    const totalAll = ALL_ACHIEVEMENTS.length;
    const percent = Math.round((totalUnlocked / totalAll) * 100);

    html = `
        <div style="margin-bottom:20px;padding:15px;background:var(--paper);border-radius:10px;border:1px solid var(--ink-light);text-align:center;">
            <div style="font-size:1.3em;font-weight:bold;color:var(--gold-dark);margin-bottom:8px;">成就进度</div>
            <div style="font-size:2em;font-weight:bold;color:var(--gold-dark);">${totalUnlocked}/${totalAll}</div>
            <div style="margin-top:10px;height:8px;background:#eee;border-radius:4px;overflow:hidden;">
                <div style="width:${percent}%;height:100%;background:var(--gold-dark);transition:width 0.5s;"></div>
            </div>
            <div style="font-size:0.85em;color:#888;margin-top:5px;">已完成 ${percent}%</div>
        </div>
    ` + html;

    list.innerHTML = html;
}

function checkAchievements() {
    const user = gameState.currentUser;
    if (!user) return;

    if (!user.achievements) user.achievements = [];

    const newAchs = [];
    const has = (id) => user.achievements.includes(id);
    const add = (id) => { if (!has(id)) newAchs.push(id); };

    // 基础成就
    if (gameState.correctCount >= 1) add('first_correct');
    if (gameState.maxCombo >= 5) add('combo_5');
    if (gameState.maxCombo >= 10) add('combo_10');
    if (gameState.score >= 100) add('perfect');

    // 首次闯关：从排行榜历史判断是否有 challenge 模式记录
    if (user.rankingHistory && user.rankingHistory.some(h => h.mode === 'challenge')) {
        add('first_challenge');
    }

    // 连续7天每日挑战：统计不同日期的 daily 记录
    if (user.rankingHistory) {
        const dailyDates = new Set(
            user.rankingHistory
                .filter(h => h.mode === 'daily')
                .map(h => new Date(h.date).toDateString())
        );
        if (dailyDates.size >= 7) add('daily_7');
    }

    // 飞花令答对20句：从排行榜历史累计
    if (user.rankingHistory) {
        const feihuaCorrect = user.rankingHistory
            .filter(h => h.mode === 'feihua')
            .reduce((sum, h) => sum + h.correctCount, 0);
        if (feihuaCorrect >= 20) add('feihua_20');
    }

    // 消消乐通过10关：从排行榜历史统计场次
    if (user.rankingHistory) {
        const matchGames = user.rankingHistory.filter(h => h.mode === 'match').length;
        if (matchGames >= 10) add('match_10');
    }

    // 掌握诗词数：基于 questionMastery 中已掌握的题目
    const masteredCount = user.questionMastery
        ? Object.values(user.questionMastery).filter(m => m && m.masteredAt).length
        : 0;
    if (masteredCount >= 10) add('poem_10');
    if (masteredCount >= 100) add('poem_100');

    if (newAchs.length > 0) {
        user.achievements.push(...newAchs);
        saveUser();

        // 显示成就弹窗（只显示第一个新解锁的）
        const ach = ALL_ACHIEVEMENTS.find(a => a.id === newAchs[0]);
        if (ach) showAchievementBadge(ach.name);
    }
}

function showAchievementBadge(name) {
    const badge = document.getElementById('achievementBadge');
    if (!badge) return;
    document.getElementById('achievementName').textContent = name;
    badge.classList.add('show');

    setTimeout(() => {
        badge.classList.remove('show');
    }, 3000);
}
