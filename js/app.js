// 古诗词大挑战 - 游戏主逻辑

// ==================== 全局状态 ====================
let gameState = {
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
    dataLoaded: false
};

// ==================== 简繁转换 ====================
// 常用繁体字到简体字的映射
const TRAD_TO_SIMP = {
    '為':'为','與':'与','過':'过','來':'来','裡':'里','說':'说','時':'时','們':'们',
    '見':'见','間':'间','題':'题','務':'务','義':'义','產':'产','區':'区','動':'动',
    '壓':'压','種':'种','學':'学','億':'亿','備':'备','簽':'签','廣':'广','廁':'厕',
    '擬':'拟','據':'据','機':'机','斷':'断','時':'时','晉':'晋','書':'书','晝':'昼',
    '暁':'晓','會':'会','月':'月','有':'有','楊':'杨','極':'极','榮':'荣','樣':'样',
    '櫻':'樱','橋':'桥','樂':'乐','樓':'楼','樸':'朴','樹':'树','橋':'桥','樂':'乐',
    '歸':'归','殘':'残','殺':'杀','殺':'杀','每':'每','氣':'气','澤':'泽','潔':'洁',
    '漢':'汉','熱':'热','趙':'赵','載':'载','達':'达','閉':'闭','關':'关','陳':'陈',
    '陽':'阳','隱':'隐','難':'难','雲':'云','電':'电','務':'务','區':'区','協':'协',
    '華':'华','葉':'叶','萬':'万','蘭':'兰','蝦':'虾','蟲':'虫','號':'号','衛':'卫',
    '貴':'贵','飯':'饭','馬':'马','駝':'驼','體':'体','髮':'发','魯':'鲁','麥':'麦',
    '黃':'黄','黑':'黑','點':'点','龍':'龙','龜':'龟','硯':'砚','確':'确',
    '萬':'万','帶':'带','賽':'赛','識':'识','謙':'谦','詩':'诗','誰':'谁',
    '請':'请','論':'论','調':'调','諒':'谅','倉':'仓','師':'师','錢':'钱',
    '錫':'锡','錦':'锦','長':'长','門':'门','閉':'闭','開':'开','間':'间',
    '關':'关','陳':'陈','陽':'阳','隊':'队','階':'阶','雲':'云','陰':'阴',
    '婦':'妇','習':'习','餘':'余','結':'结','給':'给','象':'象','貢':'贡',
    '質':'质','賬':'账','賴':'赖','賺':'赚','買':'买','費':'费','資':'资',
    '賀':'贺','賦':'赋','賭':'赌','賢':'贤','質':'质','贈':'赠','贏':'赢',
    '贊':'赞','趙':'赵','路':'路','車':'车','軍':'军','軟':'软','載':'载',
    '輕':'轻','輪':'轮','輸':'输','辦':'办','農':'农','迊':'边','還':'还',
    '這':'这','進':'进','遠':'远','連':'连','運動':'运动','運':'运','遊':'游',
    '過':'过','還':'还','選擇':'选择','選擇':'选','遺':'遗','那':'那',
    '鄉':'乡','鄭':'郑','郟':'郏','醫':'医','針':'针','針':'针','鏟':'铲',
    '鏡':'镜','長':'长','間':'间','關':'关','陳':'陈','陽':'阳','隊':'队',
    '階':'阶','雲':'云','隂':'阴','雜':'杂','雖':'虽','離':'离','電':'电',
    '霊':'灵','靜':'静','韓':'韩','頁':'页','項':'项','順':'顺','預':'预',
    '頭':'头','題':'题','顯':'显','風':'风','飛':'飞','養':'养','餘':'余',
    '館':'馆','餘':'余','題':'题','顯':'显','類':'类','題':'题','驗':'验',
    '體':'体','高':'高','魚':'鱼','魝':'鱼','鳥':'鸟','鳧':'凫','鳳':'凤',
    '鳴':'鸣','鴻':'鸿','鴿':'鸽','鴉':'鸦','鴝':'鸲','鴞':'鸮','鴟':'鸱',
    '鴣':'鹧','鴻':'鸿','鴾':'鸼','鵑':'鹁','鵒':'鹆','鵓':'鹁','鵖':'鹍',
    '鵙':'鹘','鵚':'鹚','鵛':'鹛','鵜':'鹔','鵝':'鹅','鵞':'鹐','鵟':'鹞',
    '麗':'丽','麥':'麦','麵':'面','黃':'黄','黍':'黍','黑':'黑','點':'点',
    '龍':'龙','龜':'龟','偹':'备','傾':'倾','側':'侧','偽':'伪','傷':'伤',
    '傾':'倾','僑':'侨','僕':'仆','僱':'雇','儀':'仪','億':'亿','儕':'侪',
    '優':'优','儉':'俭','儐':'殡','儲':'储','儔':'俦','儘':'尽','償':'偿',
    '優':'优','導':'导','塵':'尘','屆':'届','層':'层','屢':'屡','屬':'属',
    '岡':'冈','島':'岛','峽':'峡','峽':'崃','崇':'崇','崍':'郦','嵐':'岚',
    '歲':'岁','嵗':'嵫','嵐':'岚','嶺':'岭','嶽':'岳','巋':'巂','巏':'霰',
    '幣':'币','帥':'帅','師':'师','帯':'带','幀':'帧','幔':'幔','幕':'幕',
    '幣':'币','幹':'干','幾':'几','庖':'庖','庫':'库','廁':'厕','廂':'厢',
    '廖':'廖','廣':'广','彝':'彝','彔':'录','彈':'弹','彙':'汇','彯':'飘',
    '後':'后','徠':'徕','從':'从','徯':'徯','復':'复','徵':'征','徹':'彻',
    '恆':'恒','恢':'恢','恍':'恍','恣':'恣','恥':'耻','悵':'怅','悶':'闷',
    '務':'务','慂':'恿','慢':'慢','慣':'惯','慟':'恸','慶':'庆','慭':'憖',
    '憂':'忧','憊':'惫','憶':'忆','懐':'怀','愨':'悫','慚':'惭','慣':'惯',
    '憲':'宪','懇':'恳','應':'应','懷':'怀','懸':'悬','懺':'忏','類':'类',
    '戶':'户','房':'房','戾':'戾','扁':'扁','扆':'扆','拚':'抃','抱':'抱',
    '拄':'拄','拡':'扩','垻':'坝','埀':'坻','執':'执','埶':'蓺','執':'执',
    '堅':'坚','堊':'垩','堯':'尧','堰':'堰','報':'报','場':'场','華':'华',
    '萬':'万','萊':'莱','蓮':'莲','蒔':'莳','蒼':'苍','運行':'运行','運':'运',
    '過':'过','達':'达','遠':'远','適':'适','選':'选','遺':'遗','郡':'郡',
    '鄭':'郑','醬':'酱','酔':'醉','醫':'医','針':'针','鏟':'铲','長':'长',
    '門':'门','閉':'闭','開':'开','間':'间','關':'关','陳':'陈','陽':'阳',
    '隊':'队','階':'阶','雲':'云','電':'电','靈':'灵','靜':'静','韓':'韩',
    '顧':'顾','顯':'显','風':'风','飛':'飞','養':'养','餘':'余','館':'馆',
    '首':'首','香':'香','馬':'马','駝':'驼','體':'体','髮':'发','高':'高',
    '魚':'鱼','鳥':'鸟','鳴':'鸣','麥':'麦','黃':'黄','黑':'黑','點':'点',
    '龍':'龙','龜':'龟','齊':'齐','齡':'龄','龍':'龙','龜':'龟','堯':'尧',
    '雲':'云','電':'电','婁':'娄','嬰':'婴','孫':'孙','學':'学','學':'学',
    '宮':'宫','憲':'宪','寵':'宠','對':'对','屆':'届','層':'层','屬':'属',
    '岡':'冈','島':'岛','峽':'峡','復':'复','應':'应','廳':'厅','廣':'广',
    '異':'异','詠':'咏','詩':'诗','該':'该','詳':'详','誇':'夸','義':'义',
    '肅':'肃','腎':'肾','腫':'肿','脹':'胀','腸':'肠','膠':'胶','臨':'临',
    '臺':'台','與':'与','興':'兴','舉':'举','舊':'旧','舘':'馆','舒':'舒',
    '萬':'万','華':'华','葉':'叶','落':'落','萊':'莱','蓮':'莲','蒼':'苍',
    '處':'处','虛':'虚','蟲':'虫','術':'术','衛':'卫','複':'复','要的':'要的',
    '裟':'裟','褐':'褐','要看':'要看','複':'复','中小':'中小','學習':'学习',
    '學':'学','學':'学','孿':'孪','孫':'孙','學':'学','宮':'宫','憲':'宪',
    '寵':'宠','對':'对','屆':'届','層':'层','屬':'属','岡':'冈','島':'岛',
    '峽':'峡','復':'复','應':'应','廳':'厅','廣':'广','異':'异','詠':'咏',
    '詩':'诗','該':'该','詳':'详','誇':'夸','義':'义','歲':'岁','豐':'丰',
    '貓':'猫','賺':'赚','質':'质','贏':'赢','贊':'赞','趙':'赵','路':'路',
    '車':'车','軍':'军','軟':'软','載':'载','輕':'轻','輪':'轮','輸':'输',
    '辦':'办','農':'农','迊':'边','還':'还','這':'这','進':'进','遠':'远',
    '連':'连','運動':'运动','運':'运','遊':'游','過':'过','還':'还',
    '選擇':'选择','選擇':'选','遺':'遗','那':'那','鄉':'乡','鄭':'郑',
    '郟':'郏','醫':'医','針':'针','鏟':'铲','長':'长','間':'间','關':'关',
    '陳':'陈','陽':'阳','隊':'队','階':'阶','雲':'云','陰':'阴',
    '雜':'杂','雖':'虽','離':'离','電':'电','霊':'灵','靜':'静','韓':'韩',
    '頁':'页','項':'项','順':'顺','預':'预','頭':'头','題':'题','顯':'显',
    '風':'风','飛':'飞','養':'养','餘':'余','館':'馆','題':'题','顯':'显',
    '類':'类','驗':'验','體':'体','魚':'鱼','鳥':'鸟','鳴':'鸣','麥':'麦',
    '黃':'黄','黑':'黑','點':'点','龍':'龙','龜':'龟','齊':'齐','齡':'龄'
};

// 简繁转换函数
function toSimplified(str) {
    if (!str || typeof str !== 'string') return str;
    let result = '';
    for (const char of str) {
        result += TRAD_TO_SIMP[char] || char;
    }
    return result;
}

// ==================== 年级关卡配置 ====================
const GRADE_LEVELS = {
    mk: {
        icon: '📚',
        name: '小升初密考',
        description: '小升初密考真题精选',
        questions: 10
    },
    fbc: {
        icon: '📖',
        name: '分班测',
        description: '初一新生分班测真题',
        questions: 10
    },
    chu1: {
        icon: '📕',
        name: '初一',
        description: '七年级古诗词',
        questions: 10
    },
    chu2: {
        icon: '📗',
        name: '初二',
        description: '八年级古诗词',
        questions: 10
    },
    zk: {
        icon: '📘',
        name: '中考',
        description: '中考古诗词真题',
        questions: 10
    }
};

// ==================== 用户系统 ====================

// 初始化
async function initUser() {
    // 先加载诗词数据
    await loadPoemsData();
    gameState.dataLoaded = true;
    
    // 再加载用户
    loadUser();
    if (!gameState.currentUser) {
        showLoginModal();
    } else {
        updateUserDisplay();
    }
}

// 加载用户数据
function loadUser() {
    const saved = localStorage.getItem('poetry_user');
    if (saved) {
        gameState.currentUser = JSON.parse(saved);
        // 确保旧用户数据有 questionMastery 属性
        if (!gameState.currentUser.questionMastery) {
            gameState.currentUser.questionMastery = {};
        }
    }
}

// 保存用户数据
function saveUser() {
    localStorage.setItem('poetry_user', JSON.stringify(gameState.currentUser));
}

// 显示登录弹窗
// 待登录模式（登录后继续启动的游戏模式）
let pendingLoginMode = null;

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

// 显示指定页面
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// 返回主页
function goHome() {
    stopTimer();
    showPage('homePage');
}

// ==================== 游戏流程 ====================

// 开始游戏
function startGame(mode) {
    if (!gameState.currentUser) {
        showLoginModal(mode);
        return;
    }
    
    gameState.currentGame = mode;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.timeElapsed = 0;
    
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

// 显示关卡选择
function showLevelSelect() {
    const grid = document.getElementById('levelGrid');
    grid.innerHTML = '';
    
    Object.entries(GRADE_LEVELS).forEach(([key, level]) => {
        const card = document.createElement('div');
        card.className = 'module-card';
        card.onclick = () => startChallenge(key);
        card.innerHTML = `
            <div class="module-icon">${level.icon}</div>
            <div class="module-title">${level.name}</div>
            <div class="module-desc">${level.description}</div>
        `;
        grid.appendChild(card);
    });
    
    showPage('levelSelectPage');
}

// 获取指定年级的题目
function getQuestionsByGrade(grade, count = 10) {
    // 过滤掉2个月内已掌握的题目
    const available = QUESTIONS_DATA.filter(q => q.grade === grade && !isQuestionMastered(q.id));
    // 打乱顺序并返回指定数量
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 获取随机题目（用于每日挑战）
function getRandomQuestions(count = 10) {
    // 过滤掉2个月内已掌握的题目
    const available = [...QUESTIONS_DATA].filter(q => !isQuestionMastered(q.id));
    const shuffled = available.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 开始闯关
function startChallenge(grade) {
    const level = GRADE_LEVELS[grade];
    gameState.questions = getQuestionsByGrade(grade, level.questions);
    
    if (gameState.questions.length === 0) {
        showToast('该年级暂没有题目，敬请期待！');
        return;
    }
    
    document.getElementById('gameTitle').textContent = level.name;
    showPage('gamePage');
    showQuestion();
}

// 开始每日挑战
function startDailyChallenge() {
    const today = new Date().toDateString();
    
    // 检查今日是否已挑战
    if (gameState.currentUser.lastDailyDate === today && gameState.currentUser.dailyBest !== null) {
        if (!confirm('今日已挑战过，最高分：' + gameState.currentUser.dailyBest + '分。是否重新挑战？')) {
            goHome();
            return;
        }
    }
    
    gameState.questions = getRandomQuestions(10);
    document.getElementById('gameTitle').textContent = '每日挑战';
    showPage('gamePage');
    showQuestion();
}

// 下一题（点击按钮跳转）
function nextQuestion() {
    document.getElementById('nextQuestionBtn').style.display = 'none';
    gameState.currentQuestion++;
    showQuestion();
}

// 显示题目
function showQuestion() {
    if (gameState.currentQuestion >= gameState.questions.length) {
        endGame();
        return;
    }
    
    // 隐藏"下一题"按钮
    const nextBtn = document.getElementById('nextQuestionBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    
    const q = gameState.questions[gameState.currentQuestion];
    
    // 更新进度
    document.getElementById('questionType').textContent = getQuestionTypeName(q.type);
    document.getElementById('questionText').textContent = q.question;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('combo').textContent = gameState.combo + '连击';
    
    // 生成选项
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';
    
    if (q.type === 'fill' || q.type === 'interpret') {
        // 填空题或鉴赏题：检查是否有选项
        if (q.options && q.options.length > 0) {
            // 有选项时显示选项（选择题模式）
            q.options.forEach((opt, idx) => {
                const option = createOptionElement(opt, idx);
                container.appendChild(option);
            });
        } else {
            // 无选项时显示输入框（填空题模式）
            // 检查题目中有多少个空
            const blankCount = (q.question.match(/__________/g) || []).length;
            
            const inputBox = document.createElement('div');
            inputBox.className = 'fill-input-container';
            
            if (blankCount > 1) {
                // 多个空：创建多个输入框
                let inputsHTML = '';
                for (let i = 0; i < blankCount; i++) {
                    const placeholder = `请输入第${i + 1}个答案`;
                    inputsHTML += `<input type="text" class="fill-input" id="fillAnswerInput${i}" 
                                   placeholder="${placeholder}" 
                                   autocomplete="off"
                                   style="margin-bottom:10px"
                                   onkeypress="if(event.key==='Enter')submitFillAnswer()">`;
                }
                inputBox.innerHTML = inputsHTML + `<button class="btn" onclick="submitFillAnswer()">提交答案</button>` + 
                    `<div style="text-align:center;margin-top:15px;">
                        <a href="javascript:void(0)" onclick="skipAndShowAnswer()" style="color:#666;font-size:14px;text-decoration:underline;">不会做？点此查看答案（记为错题）</a>
                    </div>`;
                // 保存空白数量到gameState
                gameState.currentBlankCount = blankCount;
            } else {
                // 单个空：创建单个输入框
                inputBox.innerHTML = `
                    <input type="text" class="fill-input" id="fillAnswerInput0" 
                           placeholder="请输入答案..." 
                           autocomplete="off"
                           onkeypress="if(event.key==='Enter')submitFillAnswer()">
                    <button class="btn" onclick="submitFillAnswer()">提交答案</button>
                    <div style="text-align:center;margin-top:15px;">
                        <a href="javascript:void(0)" onclick="skipAndShowAnswer()" style="color:#666;font-size:14px;text-decoration:underline;">不会做？点此查看答案（记为错题）</a>
                    </div>
                `;
                gameState.currentBlankCount = 1;
            }
            
            container.appendChild(inputBox);
            // 自动聚焦第一个输入框
            setTimeout(() => {
                const input = document.getElementById('fillAnswerInput0');
                if (input) input.focus();
            }, 100);
        }
    } else {
        // 选择题
        const letters = ['A', 'B', 'C', 'D'];
        q.options.forEach((opt, idx) => {
            const option = createOptionElement(opt, idx, letters[idx]);
            container.appendChild(option);
        });
    }
    
    // 隐藏解析
    document.getElementById('explanation').classList.remove('show');
    
    // 开始计时
    startTimer();
}

// 提交填空答案
function submitFillAnswer() {
    const q = gameState.questions[gameState.currentQuestion];
    const blankCount = gameState.currentBlankCount || 1;
    
    // 获取所有输入框的值
    const userAnswers = [];
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) {
            userAnswers.push(input.value.trim());
        }
    }
    
    // 检查是否有空输入
    if (userAnswers.some(ans => !ans)) {
        showToast('请填写所有空');
        return;
    }
    
    // 分割正确答案
    const answerParts = q.answer.split('；');
    
    // 检查答案是否正确
    let allCorrect = true;
    let correctParts = 0;
    
    for (let i = 0; i < blankCount; i++) {
        const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
        const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
        
        if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns)) {
            correctParts++;
        }
    }
    
    allCorrect = (correctParts === blankCount);
    
    // 禁用所有输入框
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) input.disabled = true;
    }
    
    // 显示答题结果
    if (allCorrect) {
        for (let i = 0; i < blankCount; i++) {
            const input = document.getElementById('fillAnswerInput' + i);
            if (input) {
                input.style.borderColor = 'var(--success)';
                input.style.background = '#E8F5E9';
            }
        }
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
        let points = 10;
        if (gameState.combo > 1) {
            points += Math.min(gameState.combo - 1, 10) * 2;
        }
        gameState.score += points;
        gameState.correctCount++;
        recordQuestionCorrect(q);
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        if (gameState.combo >= 5) showComboEffect();
    } else {
        for (let i = 0; i < blankCount; i++) {
            const input = document.getElementById('fillAnswerInput' + i);
            if (input) {
                const userAns = userAnswers[i].replace(/[，。！？、；：""''（）]/g, '').trim();
                const correctAns = (answerParts[i] || '').replace(/[，。！？、；：""''（）]/g, '').trim();
                if (userAns === correctAns || correctAns.includes(userAns) || userAns.includes(correctAns)) {
                    input.style.borderColor = 'var(--success)';
                    input.style.background = '#E8F5E9';
                } else {
                    input.style.borderColor = 'var(--error)';
                    input.style.background = '#FFEBEE';
                    input.value = '正确答案：' + answerParts[i];
                    input.style.color = 'var(--error)';
                }
            }
        }
        gameState.combo = 0;
        gameState.wrongCount++;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        recordWrongQuestion(q);
    }
    
    // 显示解析（增强版：包含诗词全文、作者、朝代、释义）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    
    if (allCorrect) {
        // 答对了：1.5秒后自动进入下一题
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        // 答错了：显示"下一题"按钮，让学生点击后进入下一题
        document.getElementById('nextQuestionBtn').style.display = 'inline-block';
    }
}

// 跳过并显示答案（记为错题）
function skipAndShowAnswer() {
    const q = gameState.questions[gameState.currentQuestion];
    const blankCount = gameState.currentBlankCount || 1;
    
    // 获取正确答案并填入输入框
    const answerParts = q.answer.split('；');
    
    for (let i = 0; i < blankCount; i++) {
        const input = document.getElementById('fillAnswerInput' + i);
        if (input) {
            input.value = answerParts[i] || '';
            input.style.borderColor = 'var(--error)';
            input.style.background = '#FFEBEE';
            input.style.color = 'var(--error)';
            input.disabled = true;
        }
    }
    
    // 重置连击
    gameState.combo = 0;
    document.getElementById('combo').textContent = '0连击';
    
    // 记录为错题
    gameState.wrongCount++;
    recordWrongQuestion(q);
    
    // 显示解析（增强版）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    
    // 显示"下一题"按钮
    document.getElementById('nextQuestionBtn').style.display = 'inline-block';
    
    // 如果当前用户在诗词闯关或每日挑战，更新用户数据
    if (gameState.currentUser) {
        gameState.currentUser.totalCount++;
        gameState.currentUser.wrongCount = (gameState.currentUser.wrongCount || 0) + 1;
        saveUser();
        updateUserDisplay();
    }
}

// 创建选项元素
function createOptionElement(opt, idx, letter = null) {
    const div = document.createElement('div');
    div.className = 'option';
    div.dataset.index = idx;
    
    let content = '';
    if (letter) {
        content = `<span class="option-letter">${letter}</span>`;
    }
    content += `<span>${opt.text}</span>`;
    div.innerHTML = content;
    
    div.onclick = () => selectOption(div, opt.correct);
    
    return div;
}

// 选择选项
function selectOption(element, isCorrect) {
    // 禁用所有选项
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.add('disabled');
        opt.onclick = null;
    });
    
    const q = gameState.questions[gameState.currentQuestion];
    
    if (isCorrect) {
        element.classList.add('correct');
        gameState.combo++;
        gameState.maxCombo = Math.max(gameState.maxCombo, gameState.combo);
        
        // 计算得分
        let points = 10;
        if (gameState.combo > 1) {
            points += Math.min(gameState.combo - 1, 10) * 2; // 最多+20
        }
        gameState.score += points;
        gameState.correctCount++;
        recordQuestionCorrect(q);
        
        document.getElementById('score').textContent = gameState.score;
        document.getElementById('combo').textContent = gameState.combo + '连击';
        
        // 显示连击特效
        if (gameState.combo >= 5) {
            showComboEffect();
        }
    } else {
        element.classList.add('wrong');
        gameState.combo = 0;
        gameState.wrongCount++;
        
        // 显示正确答案
        document.querySelectorAll('.option').forEach(opt => {
            const idx = parseInt(opt.dataset.index);
            if (q.options[idx].correct) {
                opt.classList.add('correct');
            }
        });
        
        // 记录错题
        recordWrongQuestion(q);
        
        document.getElementById('combo').textContent = gameState.combo + '连击';
    }
    
    // 显示解析（增强版）
    document.getElementById('explanationText').innerHTML = getEnhancedExplanation(q);
    document.getElementById('explanation').classList.add('show');
    
    if (isCorrect) {
        // 答对了：1.5秒后自动进入下一题
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        // 答错了：显示"下一题"按钮，让学生点击后进入下一题
        document.getElementById('nextQuestionBtn').style.display = 'inline-block';
    }
}

// 获取题目类型名称
function getQuestionTypeName(type) {
    const names = {
        'choice': '选择题',
        'fill': '填空题',
        'order': '排序题',
        'match': '连连看',
        'interpret': '鉴赏题'
    };
    return names[type] || '选择题';
}

// 记录错题
function recordWrongQuestion(q) {
    const user = gameState.currentUser;
    const exists = user.wrongQuestions.some(w => w.id === q.id);
    
    if (!exists) {
        user.wrongQuestions.push({
            id: q.id,
            question: q.question,
            answer: q.answer,
            yourAnswer: '',
            explanation: q.explanation,
            knowledgePoints: q.knowledgePoints,
            date: new Date().toISOString()
        });
        saveUser();
    }
    
    // 答错了，重置该题目的连续正确次数
    if (user.questionMastery[q.id]) {
        user.questionMastery[q.id].consecutiveCorrect = 0;
        saveUser();
    }
}

// 记录答对题目（用于追踪是否连续答对两次）
function recordQuestionCorrect(q) {
    const user = gameState.currentUser;
    if (!user.questionMastery[q.id]) {
        user.questionMastery[q.id] = { consecutiveCorrect: 0, masteredAt: null };
    }
    
    user.questionMastery[q.id].consecutiveCorrect++;
    
    // 连续答对2次，标记为已掌握
    if (user.questionMastery[q.id].consecutiveCorrect >= 2) {
        user.questionMastery[q.id].masteredAt = Date.now();
        // 从错题本中移除（如果之前有错）
        user.wrongQuestions = user.wrongQuestions.filter(w => w.id !== q.id);
        showToast('🎉 已掌握此知识点，2个月后再复习！');
    }
    
    saveUser();
}

// 检查题目是否在2个月内的已掌握列表中
function isQuestionMastered(questionId) {
    const user = gameState.currentUser;
    const mastery = user.questionMastery[questionId];
    
    if (!mastery || !mastery.masteredAt) return false;
    
    // 检查是否已过2个月（60天）
    const TWO_MONTHS = 60 * 24 * 60 * 60 * 1000;
    if (Date.now() - mastery.masteredAt > TWO_MONTHS) {
        // 已过2个月，清除掌握状态，可重新出现
        delete user.questionMastery[questionId];
        saveUser();
        return false;
    }
    
    return true;
}

// 结束游戏
function endGame() {
    stopTimer();
    
    const user = gameState.currentUser;
    const total = gameState.correctCount + gameState.wrongCount;
    
    // 更新用户数据
    user.totalCount += total;
    user.correctCount += gameState.correctCount;
    user.xp += gameState.score;
    
    // 检查升级
    const newLevel = calculateLevel(user.xp);
    if (newLevel > user.level) {
        user.level = newLevel;
        showToast(`恭喜升级！现在是 Lv.${newLevel}！`);
    }
    
    // 更新每日挑战记录
    if (gameState.currentGame === 'daily') {
        const today = new Date().toDateString();
        user.lastDailyDate = today;
        if (user.dailyBest === null || gameState.score > user.dailyBest) {
            user.dailyBest = gameState.score;
        }
    }
    
    saveUser();
    updateUserDisplay();
    
    // 显示结果
    showResult();
}

// 显示结果页面
function showResult() {
    const passed = gameState.score >= 80;
    
    document.getElementById('resultIcon').textContent = passed ? '🎉' : '💪';
    document.getElementById('resultTitle').textContent = passed ? '挑战成功！' : '再接再厉！';
    document.getElementById('resultScore').textContent = gameState.score + '分';
    document.getElementById('statCorrect').textContent = gameState.correctCount;
    document.getElementById('statWrong').textContent = gameState.wrongCount;
    document.getElementById('statMaxCombo').textContent = gameState.maxCombo;
    
    // 检查新成就
    checkAchievements();
    
    showPage('resultPage');
}

// 重新开始游戏
function restartGame() {
    if (gameState.currentGame === 'challenge') {
        showLevelSelect();
    } else {
        startGame(gameState.currentGame);
    }
}

// 退出游戏
function exitGame() {
    stopTimer();
    goHome();
}

// 计算等级
function calculateLevel(xp) {
    if (xp < 100) return 1;
    if (xp < 300) return 2;
    if (xp < 600) return 3;
    if (xp < 1000) return 4;
    if (xp < 1500) return 5;
    if (xp < 2100) return 6;
    if (xp < 2800) return 7;
    if (xp < 3600) return 8;
    if (xp < 4500) return 9;
    return 10;
}

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
    const effects = ['🔥', '⭐', '🎯', '💫', '🌟'];
    const effect = effects[Math.floor(Math.random() * effects.length)];
    showToast(`${effect} ${gameState.combo}连击！`);
}

// 显示Toast提示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

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
    combo: 0              // 连击数
};

// 获取飞花令关键字池（按诗句数量降序排列，多的在前=简单）
function getFeihuaKeywordPool() {
    const keywords = Object.keys(FEIHUA_FULL_DATA.keywords);
    return keywords.sort((a, b) => {
        const countA = FEIHUA_FULL_DATA.keywords[a].l.length;
        const countB = FEIHUA_FULL_DATA.keywords[b].l.length;
        return countB - countA;
    });
}

// 选择下一个关键字（避开已完成的关键字）
function pickNextFeihuaKeyword() {
    const sortedKeywords = getFeihuaKeywordPool();
    
    // 过滤掉已完成的关键字（当前轮往前30轮内出现过的）
    const avoidKeywords = feihuaState.completedKeywords.slice(-30);
    const availableKeywords = sortedKeywords.filter(k => !avoidKeywords.includes(k));
    
    // 如果可用关键字池为空（极少情况），从全部关键字中选
    const pool = availableKeywords.length > 0 ? availableKeywords : sortedKeywords;
    
    // 优先从诗句多的关键字中选择（前50个）
    const topPool = pool.slice(0, Math.min(50, pool.length));
    return topPool[Math.floor(Math.random() * topPool.length)];
}

async function startFeihua() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    // 检查飞花令数据
    if (typeof FEIHUA_FULL_DATA === 'undefined' || !FEIHUA_FULL_DATA.keywords) {
        showToast('飞花令数据未加载');
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
    const keywordData = FEIHUA_FULL_DATA.keywords[feihuaState.keyword];
    feihuaState.poems = keywordData.l.map(l => ({
        poem: l.t,
        author: l.a || '佚名',
        title: l.ti || '无题'
    }));
    
    // 打乱顺序
    feihuaState.poems.sort(() => Math.random() - 0.5);
    
    // 显示页面
    showPage('feihuaPage');
    document.getElementById('feihuaKeyword').textContent = feihuaState.keyword;
    document.getElementById('feihuaTimer').textContent = '500';
    document.getElementById('feihuaScore').textContent = '0';
    document.getElementById('feihuaCount').textContent = '0/10';
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
    feihuaState.timeLeft = 500;
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
    document.getElementById('feihuaPrompt').innerHTML = `
        <div style="text-align:center;margin-bottom:15px;color:#666;font-size:0.95em;">
            请说出含"<strong style="color:var(--primary);font-size:1.2em;">${feihuaState.keyword}</strong>"字的完整诗句
        </div>
        <input type="text" id="feihuaInput" 
               style="width:100%;padding:15px 20px;font-size:1.2em;border:2px solid var(--primary);border-radius:10px;background:var(--bg-secondary);color:var(--text);"
               placeholder="输入诗句，如：春眠不觉晓" 
               onkeypress="if(event.key==='Enter')submitFeihuaAnswerByInput()"
               autocomplete="off">
        <button class="btn" style="margin-top:15px;padding:12px 30px;font-size:1.1em;width:100%;" onclick="submitFeihuaAnswerByInput()">
            提交答案
        </button>
        <div style="text-align:center;margin-top:12px;">
            <a href="javascript:void(0)" onclick="skipFeihuaAndShowAnswer()" style="color:#888;font-size:14px;text-decoration:underline;">想不起来？查看答案学习一下</a>
        </div>
    `;
    
    // 自动聚焦输入框
    setTimeout(() => {
        const input = document.getElementById('feihuaInput');
        if (input) input.focus();
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
    
    // 2. 检查是否已答过（精确匹配）
    const alreadyAnswered = feihuaState.answered.some(a => cleanText(a) === cleanAnswer);
    if (alreadyAnswered) {
        showToast('这句诗已经说过了！');
        input.value = '';
        return;
    }
    
    // 3. 在诗词库中查找匹配
    const matchedPoem = feihuaState.poems.find(p => {
        const cleanPoem = cleanText(p.poem);
        // 精确匹配：清理后完全相同
        return cleanPoem === cleanAnswer;
    });
    
    // 同时检查是否在其他关键字的诗句中（跨库验证）
    let crossMatchedPoem = null;
    if (!matchedPoem) {
        // 遍历所有关键字查找
        for (const char in FEIHUA_FULL_DATA.keywords) {
            const entries = FEIHUA_FULL_DATA.keywords[char].l;
            for (const entry of entries) {
                if (cleanText(entry.t) === cleanAnswer) {
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
        
        document.getElementById('feihuaCount').textContent = feihuaState.currentIndex + '/10';
        document.getElementById('feihuaScore').textContent = feihuaState.score;
        
        // 显示正确提示（带来源信息）
        showToast(`✓ 正确！+${baseScore + comboBonus}分${comboBonus > 0 ? ' (连击+' + comboBonus + ')' : ''}`);
        
        // 显示诗句来源
        showPoemSource(poemData);
        
        // 检查是否完成10句
        if (feihuaState.currentIndex >= 10) {
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
    const bgColor = isError ? 'rgba(231,76,60,0.15)' : 'rgba(46,204,113,0.15)';
    const borderColor = isError ? '#e74c3c' : '#2ecc71';
    const label = isError ? '📖 这句诗是这样的（学习一下）' : '✓ 诗句出处';
    
    const sourceDiv = document.createElement('div');
    sourceDiv.style.cssText = `margin:15px 0;padding:15px;background:${bgColor};border-radius:10px;border-left:4px solid ${borderColor};`;
    sourceDiv.innerHTML = `
        <div style="color:${borderColor};font-weight:bold;margin-bottom:10px;">${label}</div>
        <div style="font-size:1.2em;color:var(--text);margin-bottom:8px;line-height:1.6;">"${poemData.poem}"</div>
        <div style="color:#666;font-size:0.9em;">—— ${poemData.author}《${poemData.title}》</div>
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
        <div style="color:#3498db;font-weight:bold;margin-bottom:10px;">📖 学习一下这句诗</div>
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

function submitFeihuaAnswerByInput() {
    if (!feihuaState.isPlaying) return;
    
    const input = document.getElementById('feihuaInput');
    if (!input) return;
    
    const userAnswer = input.value.trim();
    if (!userAnswer) {
        showToast('请输入诗句');
        return;
    }
    
    // 检查输入是否包含关键字
    if (!userAnswer.includes(feihuaState.keyword)) {
        showToast(`答案中必须包含"${feihuaState.keyword}"字！`);
        input.value = '';
        return;
    }
    
    // 检查是否是已答过的诗句
    if (feihuaState.answered.includes(userAnswer)) {
        showToast('这句诗已经答过了！');
        input.value = '';
        return;
    }
    
    // 检查是否在诗词库中（模糊匹配：用户输入只要包含正确诗句的一部分且含有关键字即算正确）
    const keyword = feihuaState.keyword;
    
    // 辅助函数：清理诗句中的标点符号
    const cleanText = (text) => text.replace(/[，。！？、；：""''（）]/g, '');
    
    // 辅助函数：在整个诗词库中搜索匹配项
    const searchAllPoems = (input) => {
        const cleanInput = cleanText(input);
        // 如果输入太短，不进行搜索
        if (cleanInput.length < 4) return null;
        
        // 遍历所有关键字的所有诗句
        for (const char in FEIHUA_FULL_DATA.keywords) {
            const entries = FEIHUA_FULL_DATA.keywords[char].l;
            for (const entry of entries) {
                const cleanEntry = cleanText(entry.t);
                // 完全匹配
                if (cleanEntry === cleanInput) return entry;
                // 输入包含诗句或诗句包含输入
                if (cleanEntry.includes(cleanInput) || cleanInput.includes(cleanEntry)) return entry;
            }
        }
        return null;
    };
    
    // 首先检查是否含有关键字
    const containsKeyword = cleanText(userAnswer).includes(keyword);
    
    // 然后检查是否在诗词库中
    let isCorrect = false;
    let matchedEntry = null;
    
    if (containsKeyword) {
        // 先检查当前关键字下的诗句
        matchedEntry = feihuaState.poems.find(p => {
            const poemText = p.poem;
            const cleanAnswer = cleanText(userAnswer);
            const cleanPoem = cleanText(poemText);
            return userAnswer === poemText || cleanPoem.includes(cleanAnswer) || cleanAnswer.includes(cleanPoem);
        });
        
        // 如果当前关键字下没找到，搜索整个数据库
        if (!matchedEntry) {
            matchedEntry = searchAllPoems(userAnswer);
        }
        
        isCorrect = !!matchedEntry;
    }
    
    // 记录已答过的诗句（使用原句）
    const matchedPoem = matchedEntry ? { poem: matchedEntry.t, author: matchedEntry.a, title: matchedEntry.ti } : null;
    
    if (isCorrect && matchedPoem) {
        feihuaState.answered.push(matchedPoem.poem);
    } else if (isCorrect) {
        feihuaState.answered.push(userAnswer);
    } else {
        feihuaState.answered.push(userAnswer); // 也记录错误答案用于显示
    }
    
    // 显示历史
    const history = document.getElementById('feihuaHistory');
    const span = document.createElement('span');
    span.className = isCorrect ? 'feihua-poem correct' : 'feihua-poem wrong';
    span.textContent = userAnswer + (isCorrect ? '' : ' ✗');
    history.appendChild(span);
    
    // 更新计数
    if (isCorrect) {
        feihuaState.currentIndex++;
        feihuaState.correctCount++;
        document.getElementById('feihuaCount').textContent = feihuaState.currentIndex + '/10';
        
        // 加分
        feihuaState.score += 10;
        document.getElementById('feihuaScore').textContent = feihuaState.score;
        
        // 检查是否完成10句
        if (feihuaState.currentIndex >= 10) {
            clearInterval(feihuaState.timer);
            endFeihua();
            return;
        }
        
        showToast('正确！+10分');
        
        // 切换到新关键字（从答对的诗句中提取）
        const poemForKeyword = matchedPoem ? matchedPoem.poem : userAnswer;
        switchToNewKeyword(poemForKeyword);
        
        // 重置计时器并显示下一题
        feihuaState.timeLeft = 30;
        document.getElementById('feihuaTimer').textContent = '30';
        showFeihuaOptions();
    } else {
        // 答错了，显示参考答案供学习
        const samplePoem = feihuaState.poems[Math.floor(Math.random() * feihuaState.poems.length)];
        const hint = document.createElement('div');
        hint.style.cssText = 'margin:15px 0;padding:15px;background:rgba(46,204,113,0.2);border-radius:10px;text-align:center;';
        hint.innerHTML = `<div style="color:#2ecc71;font-weight:bold;margin-bottom:10px;">📖 参考答案学习</div>
            <div style="font-size:1.3em;color:var(--text);margin-bottom:8px;">"${samplePoem.poem}"</div>
            <div style="color:#888;font-size:0.9em;">—— ${samplePoem.author}《${samplePoem.title}》</div>`;
        const promptEl = document.getElementById('feihuaPrompt');
        promptEl.appendChild(hint);
        input.value = '';
        
        // 3秒后自动清除提示继续答题
        setTimeout(() => {
            if (hint.parentNode) hint.remove();
        }, 5000);
    }
}

// 显示完成10句后的成功画面
function showFeihuaSuccess() {
    // 计算奖励分数
    const completionBonus = 100; // 完成10句奖励
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
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">📚 这些诗句你也应该掌握：</div>
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
            <div style="font-size:2.5em;margin-bottom:10px;">🎉</div>
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
    showToast(`🎉 挑战成功！+${completionBonus}完成奖励！`);
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
    feihuaState.timeLeft = 500;
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
    document.getElementById('feihuaTimer').textContent = '500';
    document.getElementById('feihuaTimer').style.color = '';
    document.getElementById('feihuaScore').textContent = feihuaState.score; // 保留总分
    document.getElementById('feihuaCount').textContent = '0/10';
    document.getElementById('feihuaHistory').innerHTML = '';
    
    // 显示输入框
    showFeihuaInput();
}

// 时间到（未完成10句）
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
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">📚 这些诗句没答出来，学习一下吧：</div>
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
                    <div style="font-size:1.5em;color:#27ae60;font-weight:bold;">${feihuaState.correctCount}/10</div>
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
                <div style="color:#e67e22;font-weight:bold;margin-bottom:12px;">📚 这些诗句也值得掌握：</div>
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
            <div style="font-size:2em;margin-bottom:5px;">🎉</div>
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

// ==================== 诗词消消乐 ====================

// 消消乐游戏状态
let matchState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    combo: 0,
    level: 1,
    timer: null,
    selectedChars: [],
    currentQuestion: null
};

function startMatch() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    // 重置状态
    matchState = {
        questions: [],
        currentIndex: 0,
        score: 0,
        combo: 0,
        level: 1,
        timer: null,
        selectedChars: [],
        currentQuestion: null
    };
    
    // 生成题目（混合点字成诗和九宫格）
    matchState.questions = generateMatchQuestions(10);
    
    showPage('matchPage');
    showMatchQuestion();
}

function generateMatchQuestions(count) {
    // 使用全诗词库POEMS_DATA生成题目（无限题目）
    const questions = [];
    
    // 干扰字库
    const 干扰字 = '春夏秋冬日月山水风云花鸟虫鱼天地人东南西北中上下左右前后高低大小多少有无来去生死黑白赤橙黄绿青蓝紫金银铜铁玉石木竹松柏梅兰菊荷莲桂梧桐杨柳桃杏梨枣核桃樱桃草莓葡萄西瓜黄瓜萝卜白菜茄子番茄土豆牛肉羊肉猪肉鸡肉鸭肉鹅肉鱼肉虾蟹贝壳虫蚂蚁蜜蜂蝴蝶蜻蜓蜘蛛乌鸦喜鹊鹦鹉鸽子燕子大雁麻雀老鹰熊猫老虎狮子大象猴子兔子狐狸狼熊猫头鹰乌龟蛇青蛙蟾蜍螃蟹虾米'.split('');
    
    // 从全诗词库随机选取诗句
    const shuffledPoems = [...POEMS_DATA].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < Math.min(count, shuffledPoems.length); i++) {
        const poem = shuffledPoems[i];
        
        // 随机选取一句诗
        let answerLine = '';
        if (poem.content && Array.isArray(poem.content)) {
            const lines = poem.content.filter(l => l && l.length >= 5 && l.length <= 12);
            if (lines.length > 0) {
                answerLine = toSimplified(lines[Math.floor(Math.random() * lines.length)]);
            }
        }
        
        if (!answerLine) continue;
        
        // 清理答案字符并转换为简体
        const answer = toSimplified(answerLine.replace(/[，。！？""''【】（）可件条和与及等、：；,\.!?]/g, ''));
        if (answer.length < 4 || answer.length > 15) continue;
        
        // 转换为消消乐格式
        const gameQ = {
            id: `poem_${poem.id}_${i}`,
            answer: answer,
            poem: toSimplified(poem.title || '无题'),
            author: toSimplified(poem.author || '佚名'),
            explanation: `${toSimplified(poem.dynasty || '')}·${toSimplified(poem.author || '佚名')}《${toSimplified(poem.title || '无题')}》`,
            gameType: 'dianzichengshi'
        };
        
        // 生成字符数组（用于九宫格/点字成诗）
        let chars = answer.split('');
        
        // 随机选择游戏模式：点字成诗 或 九宫格 或 十二宫格
        const 游戏模式 = ['dianzichengshi', 'jiugongge', 'shiergongge'][Math.floor(Math.random() * 3)];
        
        // 根据模式调整字符数量
        const 目标字数 = 游戏模式 === 'shiergongge' ? 12 : 9;
        
        // 添加干扰字直到达到目标字数
        while (chars.length < 目标字数) {
            const 随机字 = 干扰字[Math.floor(Math.random() * 干扰字.length)];
            if (!chars.includes(随机字)) chars.push(随机字);
        }
        
        // 如果超过目标字数，随机截断
        if (chars.length > 目标字数) {
            chars = chars.sort(() => Math.random() - 0.5).slice(0, 目标字数);
        }
        
        // 打乱字符
        chars.sort(() => Math.random() - 0.5);
        gameQ.chars = chars;
        gameQ.gameType = 游戏模式;
        
        questions.push(gameQ);
    }
    
    return questions;
}

function showMatchQuestion() {
    if (matchState.currentIndex >= matchState.questions.length) {
        endMatch();
        return;
    }
    
    const q = matchState.questions[matchState.currentIndex];
    matchState.currentQuestion = q;
    matchState.selectedChars = [];
    
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchCombo').textContent = matchState.combo + '连击';
    document.getElementById('matchLevel').textContent = matchState.level;
    document.getElementById('matchResult').style.display = 'none';
    
    if (q.gameType === 'jiugongge') {
        showJiugongGe(q);
    } else if (q.gameType === 'shiergongge') {
        showShiergongGe(q);
    } else {
        showDianZiChengShi(q);
    }
}

function showJiugongGe(q) {
    document.getElementById('matchType').textContent = '九宫格';
    document.getElementById('matchQuestion').textContent = '从下方9个字中选出正确的一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)'; // 重置为3列九宫格
    dianzi.style.display = 'none';
    
    // 打乱汉字
    const chars = [...q.chars].sort(() => Math.random() - 0.5);
    
    grid.innerHTML = chars.map((char, idx) => `
        <div class="jiugong-char" data-char="${char}" onclick="selectJiugongChar(this, '${char}')">${char}</div>
    `).join('');
}

function showShiergongGe(q) {
    document.getElementById('matchType').textContent = '十二宫格';
    document.getElementById('matchQuestion').textContent = '从下方12个字中选出正确的一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4列十二宫格
    dianzi.style.display = 'none';
    
    // 打乱汉字
    const chars = [...q.chars].sort(() => Math.random() - 0.5);
    
    grid.innerHTML = chars.map((char, idx) => `
        <div class="jiugong-char" data-char="${char}" onclick="selectJiugongChar(this, '${char}')">${char}</div>
    `).join('');
}

function selectJiugongChar(element, char) {
    if (element.classList.contains('disabled')) return;
    
    element.classList.toggle('selected');
    
    if (element.classList.contains('selected')) {
        matchState.selectedChars.push({ char, element });
    } else {
        matchState.selectedChars = matchState.selectedChars.filter(c => c.char !== char);
    }
    
    // 检查是否选满（根据答案长度）
    const answerLen = matchState.currentQuestion.answer.length;
    if (matchState.selectedChars.length === answerLen) {
        checkMatchAnswer();
    }
}

function showDianZiChengShi(q) {
    document.getElementById('matchType').textContent = '点字成诗';
    document.getElementById('matchQuestion').textContent = '将下列汉字组成一句诗';
    
    const grid = document.getElementById('jiugonggeGrid');
    const dianzi = document.getElementById('dianziGrid');
    
    grid.style.display = 'none';
    dianzi.style.display = 'flex';
    
    // 打乱汉字
    const chars = [...q.chars].sort(() => Math.random() - 0.5);
    
    dianzi.innerHTML = chars.map((char, idx) => `
        <div class="dianzi-char" data-char="${char}" onclick="selectDianziChar(this, '${char}')">${char}</div>
    `).join('') + `
        <div class="selected-poem" id="selectedPoem"></div>
        <button class="btn" style="margin-top:15px;" onclick="submitDianziAnswer()">确认</button>
        <button class="btn btn-secondary" style="margin-top:10px;" onclick="clearDianziSelection()">清空</button>
    `;
}

function selectDianziChar(element, char) {
    if (element.classList.contains('disabled')) return;
    
    element.classList.add('selected');
    element.classList.add('disabled');
    
    matchState.selectedChars.push({ char, element });
    updateSelectedPoemDisplay();
}

function updateSelectedPoemDisplay() {
    let display = document.getElementById('selectedPoem');
    if (!display) return;
    
    display.innerHTML = matchState.selectedChars.map(c => 
        `<span class="selected-char">${c.char}</span>`
    ).join('');
}

function clearDianziSelection() {
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected', 'disabled');
    });
    matchState.selectedChars = [];
    updateSelectedPoemDisplay();
}

function submitDianziAnswer() {
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    
    if (answer === correct) {
        handleMatchCorrect();
    } else {
        handleMatchWrong();
    }
}

function checkMatchAnswer() {
    const answer = matchState.selectedChars.map(c => c.char).join('');
    const correct = matchState.currentQuestion.answer;
    
    if (answer === correct) {
        handleMatchCorrect();
    } else {
        handleMatchWrong();
    }
}

function handleMatchCorrect() {
    matchState.combo++;
    let points = 10 + Math.min(matchState.combo - 1, 5) * 2;
    matchState.score += points;
    
    // 追踪题目掌握（如果题目有id）
    if (matchState.currentQuestion && matchState.currentQuestion.id) {
        const q = QUESTIONS_DATA.find(q => q.id === matchState.currentQuestion.id);
        if (q) recordQuestionCorrect(q);
    }
    
    // 显示正确
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
        c.element.classList.add('correct');
    });
    
    document.getElementById('matchScore').textContent = matchState.score;
    document.getElementById('matchCombo').textContent = matchState.combo + '连击';
    
    const result = document.getElementById('matchResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--success);font-size:1.2em;">✓ 正确！+${points}分</div>
        <div style="margin-top:5px;color:#666;">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
    `;
    
    setTimeout(() => {
        matchState.currentIndex++;
        showMatchQuestion();
    }, 1500);
}

function handleMatchWrong() {
    matchState.combo = 0;
    
    // 显示错误
    matchState.selectedChars.forEach(c => {
        c.element.classList.remove('selected');
        c.element.classList.add('wrong');
    });
    
    // 显示正确答案
    const correctChars = matchState.currentQuestion.answer.split('');
    document.querySelectorAll('.jiugong-char, .dianzi-char').forEach(el => {
        if (correctChars.includes(el.dataset.char)) {
            el.classList.add('correct');
        }
    });
    
    document.getElementById('matchCombo').textContent = '0连击';
    
    const result = document.getElementById('matchResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--error);font-size:1.2em;">✗ 错误！正确答案是：${matchState.currentQuestion.answer}</div>
        <div style="margin-top:5px;color:#666;">${matchState.currentQuestion.poem || ''} - ${matchState.currentQuestion.author || ''}</div>
    `;
    
    // 记录错题
    if (matchState.currentQuestion) {
        recordWrongQuestion(matchState.currentQuestion);
    }
    
    setTimeout(() => {
        matchState.currentIndex++;
        showMatchQuestion();
    }, 2000);
}

function endMatch() {
    clearInterval(matchState.timer);
    
    // 更新用户数据
    gameState.currentUser.xp += matchState.score;
    saveUser();
    updateUserDisplay();
    
    const result = document.getElementById('matchResult');
    result.style.display = 'block';
    result.innerHTML = `
        <div style="color:var(--success);font-size:1.5em;">🎉 通关！</div>
        <div style="margin-top:10px;">得分：<strong>${matchState.score}</strong> 分</div>
        <div style="margin-top:10px;">
            <button class="btn" onclick="startMatch()">再玩一次</button>
            <button class="btn btn-secondary" onclick="goHome()">返回主页</button>
        </div>
    `;
    
    showToast(`诗词消消乐完成！+${matchState.score} XP`);
}

// ==================== 诗词词典 ====================

function showDict() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    showPage('dictPage');
    
    // 绑定搜索事件
    const searchInput = document.getElementById('dictSearch');
    searchInput.oninput = debounce(searchPoems, 300);
}

// 增强解析内容：包含诗词全文、作者、朝代、释义
function getEnhancedExplanation(q) {
    // 尝试从题目中提取诗词名和作者
    // 题目格式如："海日生残夜，__________。（王湾《次北固山下》）"
    const matchResult = q.question.match(/（([^《》]+)《([^《》]+)》）/);
    
    let enhancedHTML = `<strong>正确答案：</strong>${q.answer}`;
    
    if (matchResult) {
        const author = matchResult[1].trim();
        const title = matchResult[2].trim();
        
        // 在诗词库中查找对应诗词
        const poem = POEMS_DATA.find(p => 
            p.title === title && p.author.includes(author)
        );
        
        if (poem) {
            // 找到诗词，增强解析（转换为简体）
            const fullText = toSimplified(poem.fullText || (Array.isArray(poem.content) ? poem.content.join('，') : ''));
            const interpretation = toSimplified(poem.interpretation || '');
            const dynasty = toSimplified(poem.dynasty || '');
            const author = toSimplified(poem.author || '');
            const title = toSimplified(poem.title || '');
            
            enhancedHTML = `
                <div style="margin-bottom:15px;">
                    <strong>【诗词原文】</strong><br>
                    <div style="color:#333;font-size:1.1em;line-height:1.8;padding:10px;background:#f8f8f8;border-radius:8px;">
                        ${fullText}
                    </div>
                </div>
                <div style="margin-bottom:10px;">
                    <strong>【诗词信息】</strong><br>
                    <span style="color:#666;">${dynasty}·${author}《${title}》</span>
                </div>
                ${interpretation ? `
                <div style="margin-bottom:10px;">
                    <strong>【诗词释义】</strong><br>
                    <span style="color:#555;">${interpretation}</span>
                </div>
                ` : ''}
            `;
        } else {
            // 没找到，使用原有解析
            enhancedHTML = `
                <strong>正确答案：</strong>${q.answer}<br><br>
                <strong>解析：</strong>${q.explanation || '无'}
            `;
        }
    } else {
        // 无法提取诗词信息，使用原有解析
        enhancedHTML = `
            <strong>正确答案：</strong>${q.answer}<br><br>
            <strong>解析：</strong>${q.explanation || '无'}
        `;
    }
    
    return enhancedHTML;
}

function searchPoems() {
    const query = document.getElementById('dictSearch').value.trim().toLowerCase();
    const results = document.getElementById('dictResults');
    
    if (!query) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <p>输入关键词搜索诗词</p>
            </div>
        `;
        return;
    }
    
    const matches = POEMS_DATA.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.content.some(c => c.toLowerCase().includes(query))
    );
    
    if (matches.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>没有找到相关诗词</p>
            </div>
        `;
        return;
    }
    
    results.innerHTML = matches.map(p => `
        <div class="question-box" style="margin-bottom:15px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <strong style="font-size:1.2em;">${p.title}</strong>
                <span style="color:#666;">${p.dynasty}·${p.author}</span>
            </div>
            <div style="color:#666;margin-bottom:10px;">${p.fullText}</div>
            <div style="font-size:0.9em;color:#888;"><strong>释义：</strong>${p.interpretation}</div>
        </div>
    `).join('');
}

// ==================== 错题本 ====================

function showWrongNotes() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }
    
    showPage('wrongPage');
    
    const list = document.getElementById('wrongList');
    const wrongs = gameState.currentUser.wrongQuestions;
    
    if (wrongs.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎉</div>
                <p>暂无错题记录，太棒了！</p>
            </div>
        `;
        return;
    }
    
    list.innerHTML = wrongs.map(w => `
        <div class="question-box" style="margin-bottom:15px;">
            <div class="question-text" style="font-size:1em;margin-bottom:10px;">${w.question}</div>
            <div style="color:#E53935;margin-bottom:5px;"><strong>正确答案：</strong>${w.answer}</div>
            <div style="font-size:0.9em;color:#888;"><strong>解析：</strong>${w.explanation}</div>
        </div>
    `).join('');
}

// ==================== 排行榜 ====================

function showRanking() {
    hideUserMenu();
    showPage('rankingPage');
    
    // TODO: 从服务器获取排行榜
    // 目前显示模拟数据
    const list = document.getElementById('rankingList');
    list.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">🏆</div>
            <p>排行榜功能开发中...</p>
        </div>
    `;
}

// ==================== 成就系统 ====================

function showAchievements() {
    hideUserMenu();
    showPage('achievementPage');
    
    const list = document.getElementById('achievementList');
    const userAchs = gameState.currentUser?.achievements || [];
    
    const allAchievements = [
        { id: 'first_correct', name: '初露锋芒', desc: '答对第一题', icon: '🌱' },
        { id: 'combo_5', name: '五连绝世', desc: '达成5连击', icon: '🔥' },
        { id: 'combo_10', name: '十全十美', desc: '达成10连击', icon: '⭐' },
        { id: 'perfect', name: '满分通关', desc: '一次通关获得100分', icon: '💯' },
        { id: 'poem_10', name: '诗词达人', desc: '掌握10首诗词', icon: '📚' }
    ];
    
    list.innerHTML = allAchievements.map(a => {
        const unlocked = userAchs.includes(a.id);
        return `
            <div class="module-card" style="opacity:${unlocked ? 1 : 0.5};">
                <div class="module-icon">${a.icon}</div>
                <div class="module-title">${a.name}</div>
                <div class="module-desc">${a.desc}</div>
                <div style="margin-top:5px;color:${unlocked ? '#4CAF50' : '#999'};">
                    ${unlocked ? '✅ 已解锁' : '🔒 未解锁'}
                </div>
            </div>
        `;
    }).join('');
}

function checkAchievements() {
    const user = gameState.currentUser;
    if (!user) return;
    
    const newAchs = [];
    
    // 初露锋芒
    if (!user.achievements.includes('first_correct') && gameState.correctCount >= 1) {
        newAchs.push('first_correct');
    }
    
    // 五连绝世
    if (!user.achievements.includes('combo_5') && gameState.maxCombo >= 5) {
        newAchs.push('combo_5');
    }
    
    // 十全十美
    if (!user.achievements.includes('combo_10') && gameState.maxCombo >= 10) {
        newAchs.push('combo_10');
    }
    
    // 满分通关
    if (!user.achievements.includes('perfect') && gameState.score >= 100) {
        newAchs.push('perfect');
    }
    
    if (newAchs.length > 0) {
        user.achievements.push(...newAchs);
        saveUser();
        
        // 显示成就弹窗
        const achNames = {
            'first_correct': '初露锋芒',
            'combo_5': '五连绝世',
            'combo_10': '十全十美',
            'perfect': '满分通关'
        };
        
        showAchievementBadge(achNames[newAchs[0]]);
    }
}

function showAchievementBadge(name) {
    const badge = document.getElementById('achievementBadge');
    document.getElementById('achievementName').textContent = name;
    badge.classList.add('show');
    
    setTimeout(() => {
        badge.classList.remove('show');
    }, 3000);
}

// ==================== 用户菜单 ====================

function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('show');
}

function hideUserMenu() {
    document.getElementById('userMenu').classList.remove('show');
}

// 点击其他地方关闭菜单
document.addEventListener('click', (e) => {
    if (!e.target.closest('#userAvatar') && !e.target.closest('#userMenu')) {
        hideUserMenu();
    }
});

document.getElementById('userAvatar').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserMenu();
});

// ==================== 工具函数 ====================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
    
    // 模块卡片点击事件（移动端更可靠）
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // 直接调用对应函数，不依赖onclick属性
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
