/**
 * 飞花令数据动态加载器
 * 支持 IndexedDB 缓存、按需加载扩展数据、诗句哈希索引
 */

let FEIHUA_LOADED = false;
let FEIHUA_DATA = {};        // {字符: Set(诗句JSON字符串)}
let FEIHUA_TEXT_INDEX = {};  // {cleanedText: {text, author, title}} 哈希索引

const MIN_LINE_LENGTH = 5;
const MAX_LINE_LENGTH = 20;

// 构建诗句哈希索引（O(1) 查找）
function buildFeihuaTextIndex() {
    FEIHUA_TEXT_INDEX = {};
    let count = 0;
    for (const char in FEIHUA_DATA) {
        const poems = FEIHUA_DATA[char];
        if (!poems) continue;
        for (const p of poems) {
            const poem = JSON.parse(p);
            const clean = poem.text.replace(/[，。！？、；：""''（）\s]/g, '');
            if (clean && !FEIHUA_TEXT_INDEX[clean]) {
                FEIHUA_TEXT_INDEX[clean] = poem;
                count++;
            }
        }
    }
    console.log(`飞花令哈希索引构建完成: ${count} 条唯一诗句`);
    return FEIHUA_TEXT_INDEX;
}

// 加载诗词数据并构建飞花令索引
async function loadFeihuaData() {
    if (FEIHUA_LOADED) return FEIHUA_DATA;

    console.log('开始构建飞花令数据索引...');
    const startTime = Date.now();

    // 尝试从 IndexedDB 缓存读取
    const cached = typeof cacheGet === 'function' ? await cacheGet('feihua_index') : undefined;
    if (cached && cached.FEIHUA_DATA && Object.keys(cached.FEIHUA_DATA).length > 0) {
        FEIHUA_DATA = {};
        for (const char in cached.FEIHUA_DATA) {
            FEIHUA_DATA[char] = new Set(cached.FEIHUA_DATA[char]);
        }
        FEIHUA_LOADED = true;
        buildFeihuaTextIndex();
        const charCount = Object.keys(FEIHUA_DATA).length;
        const totalLines = Object.values(FEIHUA_DATA).reduce((sum, set) => sum + set.size, 0);
        console.log(`飞花令索引从缓存加载: ${charCount} 个字符, ${totalLines} 条诗句`);
        window.FEIHUA_DATA = FEIHUA_DATA;
        return FEIHUA_DATA;
    }

    // 确保诗词数据已加载
    if (!window.POEMS_DATA || window.POEMS_DATA.length === 0) {
        console.log('诗词数据未加载，先加载诗词...');
        await window.loadPoemsData();
    }

    FEIHUA_DATA = {};

    for (const poem of window.POEMS_DATA) {
        let lines = [];
        if (Array.isArray(poem.content)) {
            lines = poem.content;
        } else if (typeof poem.content === 'string') {
            lines = poem.content.split('\n');
        }

        for (const line of lines) {
            if (!line || line.length < MIN_LINE_LENGTH || line.length > MAX_LINE_LENGTH) continue;
            const cleanLine = line.replace(/[，。！？、；：""''【】《》]/g, '').trim();
            if (cleanLine.length < MIN_LINE_LENGTH) continue;

            const uniqueChars = [...new Set(cleanLine.split(''))];
            for (const char of uniqueChars) {
                if (/[a-zA-Z0-9]/.test(char)) continue;
                if (!FEIHUA_DATA[char]) FEIHUA_DATA[char] = new Set();
                FEIHUA_DATA[char].add(JSON.stringify({
                    text: cleanLine,
                    author: poem.author || '未知',
                    title: poem.title || '无题'
                }));
            }
        }
    }

    FEIHUA_LOADED = true;
    buildFeihuaTextIndex();

    const charCount = Object.keys(FEIHUA_DATA).length;
    const totalLines = Object.values(FEIHUA_DATA).reduce((sum, set) => sum + set.size, 0);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`飞花令数据索引构建完成: ${charCount} 个字符, ${totalLines} 条诗句 (${elapsed}秒)`);

    window.FEIHUA_DATA = FEIHUA_DATA;

    // 写入 IndexedDB 缓存（Set 需要转为数组）
    if (typeof cacheSet === 'function') {
        try {
            const serializable = {};
            for (const char in FEIHUA_DATA) {
                serializable[char] = [...FEIHUA_DATA[char]];
            }
            await cacheSet('feihua_index', { FEIHUA_DATA: serializable });
            console.log('飞花令索引已缓存到 IndexedDB');
        } catch (e) {
            console.warn('飞花令索引缓存失败:', e.message);
        }
    }

    return FEIHUA_DATA;
}

// 按需加载飞花令扩展数据（feihua_expanded.js）
let FEIHUA_EXPANDED_LOADED = false;
let FEIHUA_EXPANDED_LOADING = false;
let FEIHUA_EXPANDED_PROMISE = null;

async function loadFeihuaExpandedData() {
    if (FEIHUA_EXPANDED_LOADED) return true;
    if (typeof FEIHUA_FULL_DATA === 'undefined') return false;
    if (FEIHUA_EXPANDED_LOADING && FEIHUA_EXPANDED_PROMISE) return FEIHUA_EXPANDED_PROMISE;

    // 先检查 IndexedDB 缓存
    const cached = typeof cacheGet === 'function' ? await cacheGet('feihua_expanded') : undefined;
    if (cached && cached.keywords && Object.keys(cached.keywords).length > 0) {
        FEIHUA_FULL_DATA.keywords = cached.keywords;
        FEIHUA_FULL_DATA.totalPoems = cached.totalPoems || FEIHUA_FULL_DATA.totalPoems;
        FEIHUA_EXPANDED_LOADED = true;
        console.log('飞花令扩展数据从缓存加载:', Object.keys(cached.keywords).length, '个关键字');
        return true;
    }

    console.log('开始加载飞花令扩展数据...');
    FEIHUA_EXPANDED_LOADING = true;
    FEIHUA_EXPANDED_PROMISE = (async () => {
        try {
            const result = await new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'data/feihua_expanded.js?v=202604042230';
                script.onload = async () => {
                    if (typeof FEIHUA_EXPANDED_DATA !== 'undefined' && FEIHUA_EXPANDED_DATA.keywords) {
                        FEIHUA_FULL_DATA.keywords = FEIHUA_EXPANDED_DATA.keywords;
                        FEIHUA_FULL_DATA.totalPoems = FEIHUA_EXPANDED_DATA.totalPoems || FEIHUA_FULL_DATA.totalPoems;
                        FEIHUA_EXPANDED_LOADED = true;
                        console.log('飞花令扩展数据加载完成:', Object.keys(FEIHUA_EXPANDED_DATA.keywords).length, '个关键字');

                        // 缓存到 IndexedDB
                        if (typeof cacheSet === 'function') {
                            try {
                                await cacheSet('feihua_expanded', FEIHUA_EXPANDED_DATA);
                                console.log('飞花令扩展数据已缓存到 IndexedDB');
                            } catch (e) {
                                console.warn('飞花令扩展数据缓存失败:', e.message);
                            }
                        }
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                };
                script.onerror = () => reject(new Error('飞花令扩展数据加载失败'));
                document.head.appendChild(script);
            });
            return result;
        } catch (e) {
            console.warn('飞花令扩展数据加载失败:', e.message);
            return false;
        } finally {
            FEIHUA_EXPANDED_LOADING = false;
        }
    })();
    return FEIHUA_EXPANDED_PROMISE;
}

function getFeihuaPoems(char) {
    if (!FEIHUA_LOADED) {
        console.warn('飞花令数据未加载');
        return [];
    }
    const poems = FEIHUA_DATA[char];
    if (!poems) return [];
    return [...poems].map(p => {
        const obj = JSON.parse(p);
        return { text: obj.text, author: obj.author, title: obj.title };
    });
}

function getRandomFeihuaLines(char, count = 10) {
    const poems = getFeihuaPoems(char);
    if (poems.length === 0) return [];
    const shuffled = shuffle([...poems]);
    return shuffled.slice(0, count);
}

function validateFeihuaAnswer(answer, char) {
    if (!answer.includes(char)) {
        return { valid: false, error: `答案中必须包含"${char}"字！` };
    }
    if (!FEIHUA_LOADED) {
        return { valid: false, error: '数据加载中，请稍候...' };
    }

    const cleanAnswer = answer.replace(/[，。！？、；：""''【】《》\s]/g, '').trim();

    // O(1) 哈希索引查找
    if (FEIHUA_TEXT_INDEX[cleanAnswer]) {
        return { valid: true, poem: FEIHUA_TEXT_INDEX[cleanAnswer] };
    }

    // 备选：遍历当前关键字的数据（兼容模式）
    const poems = FEIHUA_DATA[char];
    if (poems) {
        for (const p of poems) {
            const poem = JSON.parse(p);
            if (poem.text === cleanAnswer || poem.text.includes(cleanAnswer) || cleanAnswer.includes(poem.text)) {
                return { valid: true, poem: poem };
            }
        }
    }

    return {
        valid: false,
        error: `这句诗不在当前数据库中，请尝试其他诗句`,
        suggestion: getRandomFeihuaLines(char, 1)[0] || null
    };
}

function getFeihuaStats() {
    if (!FEIHUA_LOADED) return null;
    const charCount = Object.keys(FEIHUA_DATA).length;
    const totalLines = Object.values(FEIHUA_DATA).reduce((sum, set) => sum + set.size, 0);
    const charCounts = Object.entries(FEIHUA_DATA)
        .map(([char, set]) => ({ char, count: set.size }))
        .sort((a, b) => b.count - a.count);
    return { totalChars: charCount, totalLines, topChars: charCounts.slice(0, 10) };
}

window.loadFeihuaData = loadFeihuaData;
window.loadFeihuaExpandedData = loadFeihuaExpandedData;
window.getFeihuaPoems = getFeihuaPoems;
window.getRandomFeihuaLines = getRandomFeihuaLines;
window.validateFeihuaAnswer = validateFeihuaAnswer;
window.getFeihuaStats = getFeihuaStats;
window.FEIHUA_DATA = FEIHUA_DATA;
