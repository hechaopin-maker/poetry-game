// 古诗词大挑战 - 全局状态管理

// 古诗词大挑战 - 全局状态管理
// 注意：feihuaState 在 js/feihua.js 中定义，matchState 在 js/match.js 中定义

const gameState = {
    currentUser: null,
    currentGame: null,
    currentQuestion: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    wrongCount: 0,
    questions: [],
    timer: null,
    timeElapsed: 0,
    dataLoaded: false,
    currentBlankCount: 0
};

let pendingLoginMode = null;
