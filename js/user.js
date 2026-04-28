// ==================== 用户系统 ====================

// 检查关键数据是否加载完成
function checkDataReady() {
    const required = [
        { name: 'POEMS_DATA', obj: typeof POEMS_DATA !== 'undefined' ? POEMS_DATA : null },
        { name: 'QUESTIONS_DATA', obj: typeof QUESTIONS_DATA !== 'undefined' ? QUESTIONS_DATA : null },
        { name: 'FEIHUA_FULL_DATA', obj: typeof FEIHUA_FULL_DATA !== 'undefined' ? FEIHUA_FULL_DATA : null }
    ];
    const missing = required.filter(r => !r.obj);
    if (missing.length > 0) {
        console.warn('数据加载未完成:', missing.map(m => m.name).join(', '));
        return false;
    }
    return true;
}

// 初始化
async function initUser() {
    const loadingMsg = document.getElementById('loadingMsg');
    const loadingText = document.getElementById('loadingText');
    const loadingBar = document.getElementById('loadingBar');

    function setLoading(visible, text, progress) {
        if (loadingMsg) loadingMsg.style.display = visible ? 'block' : 'none';
        if (loadingText && text) loadingText.textContent = text;
        if (loadingBar && progress !== undefined) loadingBar.style.width = progress + '%';
    }

    setLoading(true, '正在加载诗词数据...', 10);

    // 先加载诗词数据
    await loadPoemsData();
    gameState.dataLoaded = true;
    setLoading(true, '正在构建飞花令索引...', 60);

    // 加载飞花令数据
    if (window.loadFeihuaData) {
        await window.loadFeihuaData();
    }
    setLoading(true, '正在初始化...', 90);

    // 检查关键数据是否存在
    if (!checkDataReady()) {
        setLoading(true, '数据加载中，请稍候...', 50);
        setTimeout(() => {
            if (checkDataReady()) {
                setLoading(false);
                loadUser();
                if (!gameState.currentUser) {
                    showLoginModal();
                } else {
                    updateUserDisplay();
                }
            } else {
                setLoading(false);
                showToast('数据加载失败，请刷新页面重试');
            }
        }, 2000);
        return;
    }

    setLoading(false);

    // 再加载用户
    loadUser();
    if (!gameState.currentUser) {
        showLoginModal();
    } else {
        updateUserDisplay();
    }
}

// 数据版本号和 key 已在 constants.js 中定义：DATA_VERSION, DATA_VERSION_KEY

// 检查 LocalStorage 容量（返回预估剩余字符数）
function checkStorageQuota() {
    try {
        const maxSize = 5 * 1024 * 1024; // 5MB 估算
        let used = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            used += (key.length + value.length) * 2; // UTF-16 编码
        }
        return maxSize - used;
    } catch (e) {
        return -1;
    }
}

// 导出用户数据（下载 JSON 文件）
function exportUserData() {
    if (!gameState.currentUser) {
        showToast('暂无用户数据可导出');
        return;
    }
    try {
        const data = {
            version: DATA_VERSION,
            exportedAt: new Date().toISOString(),
            user: gameState.currentUser
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poetry-game-backup-${gameState.currentUser.name}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('数据已导出，请妥善保存备份文件');
    } catch (e) {
        console.error('导出数据失败:', e);
        showToast('导出失败，请重试');
    }
}

// 导入用户数据（从 JSON 文件恢复）
function importUserData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (!data.user || typeof data.user !== 'object') {
                    throw new Error('无效的备份文件格式');
                }
                // 版本检查和迁移
                const fileVersion = data.version || 0;
                if (fileVersion < DATA_VERSION) {
                    migrateUserData(data.user, fileVersion);
                }
                gameState.currentUser = data.user;
                saveUser();
                updateUserDisplay();
                showToast('数据恢复成功！');
                resolve(true);
            } catch (err) {
                console.error('导入数据失败:', err);
                showToast('导入失败：' + err.message);
                resolve(false);
            }
        };
        reader.onerror = function() {
            showToast('读取文件失败');
            resolve(false);
        };
        reader.readAsText(file);
    });
}

// 用户数据迁移（旧版本 → 新版本）
function migrateUserData(user, fromVersion) {
    if (fromVersion < 1) {
        // v0 → v1：补全 questionMastery
        if (!user.questionMastery) {
            user.questionMastery = {};
        }
    }
}

// 处理文件导入（由 HTML file input onchange 调用）
async function handleImportFile(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showToast('请选择 .json 格式的备份文件');
        input.value = '';
        return;
    }
    if (gameState.currentUser && gameState.currentUser.name !== '诗词游客') {
        if (!confirm('导入数据将覆盖当前用户数据，是否继续？')) {
            input.value = '';
            return;
        }
    }
    const success = await importUserData(file);
    input.value = '';
    if (success) {
        hideUserMenu();
    }
}

// 检查并执行数据版本迁移
function checkDataVersion() {
    try {
        const savedVersion = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0', 10);
        if (savedVersion < DATA_VERSION) {
            // 需要迁移
            const saved = localStorage.getItem('poetry_user');
            if (saved) {
                try {
                    const user = JSON.parse(saved);
                    migrateUserData(user, savedVersion);
                    localStorage.setItem('poetry_user', JSON.stringify(user));
                } catch (e) {
                    console.warn('数据迁移失败，将重置用户数据');
                    localStorage.removeItem('poetry_user');
                }
            }
            localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
        }
    } catch (e) {
        console.error('版本检查失败:', e);
    }
}

// 加载用户数据
function loadUser() {
    try {
        checkDataVersion();
        const saved = localStorage.getItem('poetry_user');
        if (saved) {
            try {
                gameState.currentUser = JSON.parse(saved);
                // 确保旧用户数据有 questionMastery 属性
                if (!gameState.currentUser.questionMastery) {
                    gameState.currentUser.questionMastery = {};
                }
            } catch (parseErr) {
                console.error('用户数据损坏，自动重置:', parseErr);
                showToast('检测到数据损坏，已重置用户数据。建议从备份恢复。');
                localStorage.removeItem('poetry_user');
                gameState.currentUser = null;
            }
        }
    } catch (e) {
        console.error('加载用户数据失败:', e);
        showToast('无法访问本地存储，请检查浏览器设置');
        gameState.currentUser = null;
    }
}

// 保存用户数据
function saveUser() {
    try {
        const quota = checkStorageQuota();
        if (quota > 0 && quota < 1024) {
            // 剩余空间不足 1KB，提示导出
            showToast('存储空间不足！请立即导出数据备份，以防数据丢失。');
            // 仍然尝试保存
        }
        localStorage.setItem('poetry_user', JSON.stringify(gameState.currentUser));
    } catch (e) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
            showToast('存储空间已满！请导出数据后清理浏览器缓存。');
            // 自动触发导出提示
            setTimeout(() => {
                if (confirm('存储空间已满，是否立即导出数据备份？')) {
                    exportUserData();
                }
            }, 500);
        } else {
            console.error('保存用户数据失败:', e);
            showToast('保存数据失败，请检查浏览器设置');
        }
    }
}

// 显示登录弹窗
// 待登录模式 pendingLoginMode 已在 state.js 中定义

// 显示登录模态框
function showLoginModal(pendingMode) {
    pendingLoginMode = pendingMode;
    const modal = document.getElementById('loginModal');
    const input = document.getElementById('loginUsername');
    input.value = '诗词达人';
    modal.classList.add('show');
    input.focus();
}

// 提交登录
function submitLogin() {
    const input = document.getElementById('loginUsername');
    const username = input.value.trim();
    
    if (!username) {
        showToast('请输入昵称');
        return;
    }
    
    gameState.currentUser = {
        name: username,
        xp: 0,
        level: 1,
        correctCount: 0,
        totalCount: 0,
        masteredPoems: [],
        wrongQuestions: [],
        achievements: [],
        dailyBest: null,
        lastDailyDate: null,
        questionMastery: {}
    };
    saveUser();
    updateUserDisplay();
    showToast(`欢迎，${username}！开始诗词之旅吧！`);
    
    // 关闭登录框
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    
    // 登录后继续启动游戏
    if (pendingLoginMode) {
        continueStartGame(pendingLoginMode);
        pendingLoginMode = null;
    }
}

// 跳过登录（游客模式）
function skipLogin() {
    const username = '诗词游客';
    gameState.currentUser = {
        name: username,
        xp: 0,
        level: 1,
        correctCount: 0,
        totalCount: 0,
        masteredPoems: [],
        wrongQuestions: [],
        achievements: [],
        dailyBest: null,
        lastDailyDate: null,
        questionMastery: {}
    };
    saveUser();
    updateUserDisplay();
    showToast('游客模式已开始，尽情探索诗词世界吧！');
    
    // 关闭登录框
    const modal = document.getElementById('loginModal');
    modal.classList.remove('show');
    
    // 登录后继续启动游戏
    if (pendingLoginMode) {
        continueStartGame(pendingLoginMode);
        pendingLoginMode = null;
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
