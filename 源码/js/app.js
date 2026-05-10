// 古诗词大挑战 - 入口文件
// 飞花令扩展数据改为按需加载，见 js/feihua.js 中的 loadFeihuaExpandedData()

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
    initUser();

    // 登录框回车提交
    const loginInput = document.getElementById('loginUsername');
    if (loginInput) {
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitLogin();
            }
        });
    }

    // 用户头像点击
    const userAvatar = document.getElementById('userAvatar');
    if (userAvatar) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu();
        });
    }

    // 点击其他地方关闭菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#userAvatar') && !e.target.closest('#userMenu')) {
            hideUserMenu();
        }
    });

    // 模块卡片点击事件（移动端更可靠）
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const text = card.textContent;
            if (text.includes('诗词闯关')) {
                startGame('challenge');
            } else if (text.includes('每日挑战')) {
                startGame('daily');
            } else if (text.includes('飞花令')) {
                startGame('feihua');
            } else if (text.includes('诗词消消乐')) {
                startGame('match');
            } else if (text.includes('诗词词典')) {
                showDict();
            } else if (text.includes('错题本')) {
                showWrongNotes();
            }
        });
    });
});
