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
                <p class="empty-hint">完成一次游戏后即可查看排行榜</p>
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
        <div class="stat-card">
            <div class="stat-grid">
                <div><div class="stat-value">${stats.totalGames}</div><div class="stat-label">总场次</div></div>
                <div><div class="stat-value">${stats.totalScore}</div><div class="stat-label">累计积分</div></div>
                <div><div class="stat-value">${stats.avgAccuracy}%</div><div class="stat-label">平均正确率</div></div>
                <div><div class="stat-value">${stats.totalLevels}</div><div class="stat-label">累计关卡</div></div>
            </div>
        </div>
        <div class="tab-row">
            <button class="btn tab-btn ${dimension === 'score' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'score')">总积分</button>
            <button class="btn tab-btn ${dimension === 'accuracy' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'accuracy')">正确率</button>
            <button class="btn tab-btn ${dimension === 'levels' ? 'btn-primary' : 'btn-secondary'}" onclick="renderRankingList(document.getElementById('rankingList'), 'levels')">关卡数</button>
        </div>
        <div class="section-title">${current.label} Top ${Math.min(data.length, 50)}</div>
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
                <div class="rank-list-item">
                    <div class="rank-badge" style="${rankStyle}">${rank}</div>
                    <div class="rank-info">
                        <div class="rank-mode">${modeLabels[item.mode] || item.mode}</div>
                        <div class="rank-meta">${dateStr} · ${item.correctCount}/${item.totalCount} 题</div>
                    </div>
                    <div class="stat-value-score">${item[current.key]}${current.unit}</div>
                </div>
            `;
        }).join('');
    }

    container.innerHTML = html;
}
