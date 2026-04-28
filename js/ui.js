// ==================== 计时器 ====================

function startTimer() {
    stopTimer();
    gameState.timer = setInterval(() => {
        gameState.timeElapsed++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(gameState.timeElapsed / 60);
    const secs = gameState.timeElapsed % 60;
    document.getElementById('timer').textContent = 
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ==================== 特效 ====================

// 显示连击特效
function showComboEffect() {
    const effects = ['焰', '星', '中', '闪', '耀'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    showToast(`${effect} ${gameState.combo}连击！`);
}

// 显示Toast提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    // 2秒后自动消失
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

