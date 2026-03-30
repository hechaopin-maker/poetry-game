/**
 * 飞花令数据库构建脚本
 * 从POEMS_DATA提取诗句构建更完整的飞花令索引
 */

const fs = require('fs');
const path = require('path');

// 配置
const MIN_LINE_LEN = 5;  // 最小诗句长度
const MAX_LINE_LEN = 20; // 最大诗句长度
const MAX_PER_CHAR = 10; // 每个字符最多保存多少句

// 加载POEMS_DATA
const dataDir = __dirname;
const files = ['tang_001.json', 'tang_002.json', 'song_001.json', 'song_002.json', 'song_003.json', 'song_004.json', 'other_001.json', 'supplement.json'];

console.log('Loading POEMS_DATA...');
let allPoems = [];
for (const file of files) {
    try {
        const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
        // 为每个诗词添加来源文件标记
        const poemsWithSource = data.map(p => ({ ...p, _source: file }));
        allPoems = allPoems.concat(poemsWithSource);
        console.log('Loaded ' + file + ': ' + data.length + ' poems');
    } catch (e) {
        console.log('Error loading ' + file + ': ' + e.message);
    }
}
console.log('Total poems: ' + allPoems.length);

// 构建飞花令索引
console.log('Building feihua index...');
const feihuaIndex = {};  // {字符: Set(诗句)}

for (const poem of allPoems) {
    // 获取诗句内容
    let lines = [];
    if (Array.isArray(poem.content)) {
        lines = poem.content;
    } else if (typeof poem.content === 'string') {
        lines = poem.content.split('\n');
    }
    
    for (const line of lines) {
        // 清理诗句（移除标点）
        const cleanLine = line.replace(/[，。！？、；：""''【】《》（）\s\d]/g, '').trim();
        
        // 长度过滤
        if (cleanLine.length < MIN_LINE_LEN || cleanLine.length > MAX_LINE_LEN) {
            continue;
        }
        
        // 跳过纯数字、字母
        if (/^[a-zA-Z0-9\s]+$/.test(cleanLine)) {
            continue;
        }
        
        // 为每个字符建立索引
        const uniqueChars = [...new Set(cleanLine.split(''))];
        for (const char of uniqueChars) {
            // 跳过特殊字符
            if (/[a-zA-Z0-9]/.test(char)) continue;
            
            if (!feihuaIndex[char]) {
                feihuaIndex[char] = [];
            }
            
            // 存储格式与feihua_full.js一致
            const entry = {
                t: cleanLine,  // 诗句
                a: poem.author || '佚名',  // 作者
                ti: poem.title || '无题',  // 题目
                from: poem._source  // 来源文件（用于优先保留学校必背诗词）
            };
            
            // 检查是否已存在相同诗句
            const exists = feihuaIndex[char].some(e => e.t === cleanLine);
            if (!exists) {
                feihuaIndex[char].push(entry);
            }
        }
    }
}

// 统计并限制每个字符的诗句数量
console.log('Trimming to max ' + MAX_PER_CHAR + ' per character...');
for (const char in feihuaIndex) {
    // 优先保留supplement.json的诗句（学校必背诗词），其余随机
    const supplementPoems = feihuaIndex[char].filter(e => e.from === 'supplement.json');
    const otherPoems = feihuaIndex[char].filter(e => e.from !== 'supplement.json');
    
    // 随机打乱其他诗句
    otherPoems.sort(() => Math.random() - 0.5);
    
    // 优先保留supplement中的全部诗句，再补充其他诗句直到MAX_PER_CHAR
    feihuaIndex[char] = [...supplementPoems, ...otherPoems].slice(0, MAX_PER_CHAR);
}

// 统计
const charCount = Object.keys(feihuaIndex).length;
const totalLines = Object.values(feihuaIndex).reduce((sum, arr) => sum + arr.length, 0);
console.log('Feihua index built: ' + charCount + ' characters, ' + totalLines + ' lines');

// 构建输出数据
const output = {
    version: '9.0',
    totalPoems: allPoems.length,
    totalLines: totalLines,
    keywords: {}
};

for (const [char, entries] of Object.entries(feihuaIndex)) {
    output.keywords[char] = {
        c: entries.length,
        l: entries
    };
}

// 保存到文件
const outputPath = path.join(dataDir, 'feihua_expanded.js');
const content = 'const FEIHUA_FULL_DATA = ' + JSON.stringify(output, null, 0) + ';';

fs.writeFileSync(outputPath, content, 'utf8');

const stats = fs.statSync(outputPath);
console.log('Saved to: ' + outputPath);
console.log('File size: ' + (stats.size / 1024).toFixed(1) + ' KB');

// 找出诗句最多的字符
const topChars = Object.entries(feihuaIndex)
    .map(([char, entries]) => ({ char, count: entries.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

console.log('\nTop 10 characters by poem count:');
for (const { char, count } of topChars) {
    console.log('  ' + char + ': ' + count + ' poems');
}
