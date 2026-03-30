/**
 * 飞花令数据动态加载器
 * 从已加载的POEMS_DATA构建字符->诗句映射
 * 解决feihua_full.js数据覆盖不足的问题
 */

let FEIHUA_LOADED = false;
let FEIHUA_DATA = {};  // {字符: Set(诗句)}

const MIN_LINE_LENGTH = 5;  // 最少字符数
const MAX_LINE_LENGTH = 20; // 最大字符数

// 加载诗词数据并构建飞花令索引
async function loadFeihuaData() {
    if (FEIHUA_LOADED) return FEIHUA_DATA;
    
    console.log('开始构建飞花令数据索引...');
    const startTime = Date.now();
    
    // 确保诗词数据已加载
    if (!window.POEMS_DATA || window.POEMS_DATA.length === 0) {
        console.log('诗词数据未加载，先加载诗词...');
        await window.loadPoemsData();
    }
    
    // 构建字符到诗句的映射
    FEIHUA_DATA = {};
    
    for (const poem of window.POEMS_DATA) {
        // 处理poem.content (可能是字符串数组或对象数组)
        let lines = [];
        if (Array.isArray(poem.content)) {
            lines = poem.content;
        } else if (typeof poem.content === 'string') {
            lines = poem.content.split('\n');
        }
        
        for (const line of lines) {
            // 跳过太短或太长的诗句
            if (!line || line.length < MIN_LINE_LENGTH || line.length > MAX_LINE_LENGTH) {
                continue;
            }
            
            // 清理诗句（移除标点）
            const cleanLine = line.replace(/[，。！？、；：""''【】《》]/g, '').trim();
            if (cleanLine.length < MIN_LINE_LENGTH) continue;
            
            // 为每个字符建立索引
            const uniqueChars = [...new Set(cleanLine.split(''))];
            for (const char of uniqueChars) {
                // 跳过纯数字、字母、标点
                if (/[a-zA-Z0-9]/.test(char)) continue;
                
                if (!FEIHUA_DATA[char]) {
                    FEIHUA_DATA[char] = new Set();
                }
                
                // 存储诗句信息
                const poemInfo = {
                    text: cleanLine,
                    author: poem.author || '未知',
                    title: poem.title || '无题'
                };
                
                FEIHUA_DATA[char].add(JSON.stringify(poemInfo));
            }
        }
    }
    
    FEIHUA_LOADED = true;
    
    // 统计
    const charCount = Object.keys(FEIHUA_DATA).length;
    const totalLines = Object.values(FEIHUA_DATA).reduce((sum, set) => sum + set.size, 0);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    
    console.log(`飞花令数据索引构建完成: ${charCount} 个字符, ${totalLines} 条诗句 (${elapsed}秒)`);
    
    return FEIHUA_DATA;
}

// 获取包含指定字符的诗句列表
function getFeihuaPoems(char) {
    if (!FEIHUA_LOADED) {
        console.warn('飞花令数据未加载');
        return [];
    }
    
    const poems = FEIHUA_DATA[char];
    if (!poems) return [];
    
    return [...poems].map(p => {
        const obj = JSON.parse(p);
        return {
            poem: obj.t,      // 诗句原文
            author: obj.a,     // 作者
            title: obj.ti,     // 题目
            from: obj.from     // 来源文件
        };
    });
}

// 获取包含指定字符的随机N句诗
function getRandomFeihuaLines(char, count = 10) {
    const poems = getFeihuaPoems(char);
    if (poems.length === 0) return [];
    
    const shuffled = poems.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

// 验证诗句是否包含指定字符
function validateFeihuaAnswer(answer, char) {
    // 检查是否包含关键字
    if (!answer.includes(char)) {
        return { valid: false, error: `答案中必须包含"${char}"字！` };
    }
    
    if (!FEIHUA_LOADED) {
        return { valid: false, error: '数据加载中，请稍候...' };
    }
    
    // 清理答案
    const cleanAnswer = answer.replace(/[，。！？、；：""''【】《》]/g, '').trim();
    
    // 检查答案是否在数据库中
    const poems = FEIHUA_DATA[char];
    if (!poems) {
        return { valid: false, error: `抱歉，数据库中暂无含"${char}"字的诗句` };
    }
    
    // 精确匹配或包含匹配
    let found = null;
    for (const p of poems) {
        const poem = JSON.parse(p);
        if (poem.text === cleanAnswer) {
            found = poem;
            break;
        }
        // 部分匹配（答案包含诗句或诗句包含答案）
        if (poem.text.includes(cleanAnswer) || cleanAnswer.includes(poem.text)) {
            found = poem;
            break;
        }
    }
    
    if (found) {
        return { valid: true, poem: found };
    }
    
    // 答案不在数据库中，提示用户
    return { 
        valid: false, 
        error: `这句诗不在当前数据库中，请尝试其他诗句`,
        suggestion: getRandomFeihuaLines(char, 1)[0] || null
    };
}

// 获取飞花令统计信息
function getFeihuaStats() {
    if (!FEIHUA_LOADED) return null;
    
    const charCount = Object.keys(FEIHUA_DATA).length;
    const totalLines = Object.values(FEIHUA_DATA).reduce((sum, set) => sum + set.size, 0);
    
    // 找出诗句最多的字符
    const charCounts = Object.entries(FEIHUA_DATA)
        .map(([char, set]) => ({ char, count: set.size }))
        .sort((a, b) => b.count - a.count);
    
    return {
        totalChars: charCount,
        totalLines: totalLines,
        topChars: charCounts.slice(0, 10)
    };
}

// 导出到全局作用域
window.loadFeihuaData = loadFeihuaData;
window.getFeihuaPoems = getFeihuaPoems;
window.getRandomFeihuaLines = getRandomFeihuaLines;
window.validateFeihuaAnswer = validateFeihuaAnswer;
window.getFeihuaStats = getFeihuaStats;
window.FEIHUA_DATA = FEIHUA_DATA;
