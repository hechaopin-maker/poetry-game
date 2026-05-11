
// 显示指定页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(pageId);
    if (pageEl) pageEl.classList.add('active');
}

// 返回主页
function goHome() {
    stopTimer();
    showPage('homePage');
}

// ==================== 游戏流程 ====================
