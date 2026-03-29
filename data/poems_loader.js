/**
 * 诗词数据动态加载器
 * 解决大文件git推送问题
 */

// 数据文件列表
const POEM_DATA_FILES = [
    'tang_001.json',
    'tang_002.json',
    'song_001.json',
    'song_002.json',
    'song_003.json',
    'song_004.json',
    'other_001.json',
    'supplement.json'  // 补充数据包：学校常考诗词
];

// 全局诗词数据
window.POEMS_DATA = window.POEMS_DATA || [];
let POEMS_LOADED = false;
let POEMS_COUNT = 0;

// 动态加载诗词数据
async function loadPoemsData() {
    if (POEMS_LOADED) return window.POEMS_DATA;
    
    console.log('开始加载诗词数据...');
    const startTime = Date.now();
    
    try {
        for (const file of POEM_DATA_FILES) {
            try {
                const response = await fetch(`data/${file}`);
                if (response.ok) {
                    const poems = await response.json();
                    window.POEMS_DATA.push(...poems);
                    console.log(`加载 ${file}: ${poems.length} 首`);
                } else {
                    console.warn(`加载 ${file} 失败: ${response.status}`);
                }
            } catch (e) {
                console.warn(`加载 ${file} 出错: ${e.message}`);
            }
        }
        
        POEMS_LOADED = true;
        POEMS_COUNT = window.POEMS_DATA.length;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`诗词数据加载完成: ${POEMS_COUNT} 首 (${elapsed}秒)`);
        
        return window.POEMS_DATA;
    } catch (error) {
        console.error('诗词数据加载失败:', error);
        return [];
    }
}

// 获取随机诗词
function getRandomPoem(count = 1, grade = null) {
    let pool = window.POEMS_DATA;
    
    if (grade) {
        pool = pool.filter(p => p.grades && p.grades.includes(grade));
    }
    
    // 过滤掉没有内容的诗词
    pool = pool.filter(p => p.content && p.content.length > 0);
    
    if (pool.length === 0) return count === 1 ? null : [];
    
    if (count === 1) {
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    const result = [];
    const used = new Set();
    
    while (result.length < count && result.length < pool.length) {
        const poem = pool[Math.floor(Math.random() * pool.length)];
        if (!used.has(poem.id)) {
            used.add(poem.id);
            result.push(poem);
        }
    }
    
    return result;
}

// 按年级获取诗词
function getPoemsByGrade(grade, count = 10) {
    const pool = window.POEMS_DATA.filter(p => 
        p.grades && p.grades.includes(grade) && p.content && p.content.length > 0
    );
    
    if (pool.length === 0) return [];
    
    const result = [];
    const used = new Set();
    
    while (result.length < count && result.length < pool.length) {
        const poem = pool[Math.floor(Math.random() * pool.length)];
        if (!used.has(poem.id)) {
            used.add(poem.id);
            result.push(poem);
        }
    }
    
    return result;
}

// 搜索诗词
function searchPoems(keyword) {
    if (!keyword) return [];
    
    const kw = keyword.toLowerCase();
    return window.POEMS_DATA.filter(p => 
        (p.title && p.title.toLowerCase().includes(kw)) ||
        (p.author && p.author.toLowerCase().includes(kw)) ||
        (p.fullText && p.fullText.toLowerCase().includes(kw)) ||
        (p.content && p.content.some(line => line.toLowerCase().includes(kw)))
    ).slice(0, 20);
}

// 获取诗词统计
function getPoemsStats() {
    const stats = {
        total: window.POEMS_DATA.length,
        tang: window.POEMS_DATA.filter(p => p.dynasty === '唐').length,
        song: window.POEMS_DATA.filter(p => p.dynasty === '宋').length,
        other: window.POEMS_DATA.filter(p => p.dynasty !== '唐' && p.dynasty !== '宋').length
    };
    return stats;
}

// 导出到全局作用域
window.loadPoemsData = loadPoemsData;
window.getRandomPoem = getRandomPoem;
window.getPoemsByGrade = getPoemsByGrade;
window.searchPoems = searchPoems;
window.getPoemsStats = getPoemsStats;
window.POEMS_DATA = POEMS_DATA;
