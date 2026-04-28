// ==================== 排行榜 ====================

// 记录游戏结果到排行榜历史
function recordGameResult(mode, score, correctCount, totalCount, completedLevels) {
    const user = gameState.currentUser;
    if (!user) return;

    // 确保 rankingHistory 存在
    if (!user.rankingHistory) {
        user.rankingHistory = [];
    }

    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    user.rankingHistory.push({
        date: Date.now(),
        mode: mode,
        score: score,
        correctCount: correctCount,
        totalCount: totalCount,
        accuracy: accuracy,
        completedLevels: completedLevels || 0
    });

    // 只保留最近 200 条记录
    if (user.rankingHistory.length > 200) {
        user.rankingHistory = user.rankingHistory.slice(-200);
    }

    saveUser();
}

// 获取排行榜数据（按维度排序）
function getRankingData(dimension) {
    const user = gameState.currentUser;
    if (!user || !user.rankingHistory || user.rankingHistory.length === 0) {
        return [];
    }

    const history = [...user.rankingHistory];

    switch (dimension) {
        case 'score':
            return history.sort((a, b) => b.score - a.score).slice(0, 50);
        case 'accuracy':
            // 至少答了 3 题才参与正确率排名
            return history
                .filter(h => h.totalCount >= 3)
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 50);
        case 'levels':
            return history
                .filter(h => h.completedLevels > 0)
                .sort((a, b) => b.completedLevels - a.completedLevels)
                .slice(0, 50);
        default:
            return history.slice(0, 50);
    }
}

// 获取累计统计
function getRankingStats() {
    const user = gameState.currentUser;
    if (!user || !user.rankingHistory || user.rankingHistory.length === 0) {
        return { totalGames: 0, totalScore: 0, avgAccuracy: 0, totalLevels: 0 };
    }

    const history = user.rankingHistory;
    const totalGames = history.length;
    const totalScore = history.reduce((sum, h) => sum + h.score, 0);
    const avgAccuracy = Math.round(history.reduce((sum, h) => sum + h.accuracy, 0) / totalGames);
    const totalLevels = history.reduce((sum, h) => sum + (h.completedLevels || 0), 0);

    return { totalGames, totalScore, avgAccuracy, totalLevels };
}

// 显示排行榜
function showRanking() {
    hideUserMenu();
    showPage('rankingPage');

    const list = document.getElementById('rankingList');
    const stats = getRankingStats();

    if (stats.totalGames === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">榜</div>
                <p>暂无游戏记录</p>
                <p style="font-size:0.9em;margin-top:10px;color:#888;">完成一次游戏后即可查看排行榜</p>
            </div>
        `;
        return;
    }

    // 默认显示总积分榜
    renderRankingList(list, 'score');
}

// 渲染排行榜列表
function renderRankingList(container, dimension) {
    const data = getRankingData(dimension);
    const stats = getRankingStats();

    const dimensionLabels = {
        score: { label: '总积分榜', unit: '分', key: 'score' },
        accuracy: { label: '正确率榜', unit: '%', key: 'accuracy' },
        levels: { label: '关卡数榜', unit: '关', key: 'completedLevels' }
    };

    const current = dimensionLabels[dimension] || dimensionLabels.score;

    const modeLabels = {
        challenge: '诗词闯关',
        daily: '每日挑战',
        feihua: '飞花令',
        match: '诗词消消乐'
    };

    let html = `
        <div style="margin-bottom:20px;padding:15px;background:var(--paper);border-radius:10px;border:1px solid var(--ink-light);">
            <div style="display:flex;justify-content:space-around;text-align:center;flex-wrap:wrap;gap:10px;">
                <div><div style="font-size:1.5em;font-weight:bold;color:var(--gold-dark);">${stats.totalGames}</div><div style="font-size:0.85em;color:#888;">总场次</div></div>
                <div><div style="font-size:1.5em;font-weight:bold;color:var(--gold-dark);">${stats.totalScore}</div><div style="font-size:0.85em;color:#888;">累计积分</div></div>
                <div><div style="font-size:1.5em;font-weight:bold;color:var(--gold-dark);">${stats.avgAccuracy}%</div><div style="font-size:0.85em;color:#888;">平均正确率</div></div>
                <div><div style="font-size:1.5em;font-weight:bold;color:var(--gold-dark);">${stats.totalLevels}</div><div style="font-size:0.85em;color:#888;">累计关卡</div></div>
            </div>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:20px;">
            <button class="btn ${dimension === 'score' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'score')" style="flex:1;">总积分</button>
            <button class="btn ${dimension === 'accuracy' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'accuracy')" style="flex:1;">正确率</button>
            <button class="btn ${dimension === 'levels' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'levels')" style="flex:1;">关卡数</button>
        </div>
        <div style="font-weight:bold;margin-bottom:12px;color:var(--gold-dark);font-size:1.1em;">${current.label} Top ${Math.min(data.length, 50)}</div>
    `;

    if (data.length === 0) {
        html += `<div class="empty-state"><p>该维度暂无记录</p></div>`;
    } else {
        html += data.map((item, index) => {
            const rank = index + 1;
            const rankStyle = rank <= 3
                ? `background:var(--gold-light);color:var(--gold-dark);font-weight:bold;`
                : `background:#f5f5f5;color:#666;`;
            const dateStr = new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            return `
                <div style="display:flex;align-items:center;padding:12px;margin-bottom:8px;background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
                    <div style="width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-right:12px;${rankStyle}">${rank}</div>
                    <div style="flex:1;">
                        <div style="font-weight:bold;color:#333;">${modeLabels[item.mode] || item.mode}</div>
                        <div style="font-size:0.8em;color:#888;">${dateStr} · ${item.correctCount}/${item.totalCount} 题</div>
                    </div>
                    <div style="font-size:1.3em;font-weight:bold;color:var(--gold-dark);">${item[current.key]}${current.unit}</div>
                </div>
            `;
        }).join('');
    }

    container.innerHTML = html;
}
