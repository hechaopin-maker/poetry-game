// 古诗词大挑战 - 用户菜单

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

function hideUserMenu() {
    document.getElementById('userMenu').classList.remove('show');
}

// 注：debounce 函数在 utils.js 中定义，此处不再重复
