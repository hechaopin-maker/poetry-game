const fs = require('fs');
const path = require('path');

// 增加关键字数量到2000
const MAX_KEYWORDS = 2000;
const MAX_LINES_PER_KEYWORD = 2;

const dataDir = __dirname;

function readJSON(filename) {
    const content = fs.readFileSync(path.join(dataDir, filename), 'utf8');
    return JSON.parse(content);
}

console.log('加载诗词数据...');
const supplement = readJSON('supplement.json');
const tang001 = readJSON('tang_001.json');
const tang002 = readJSON('tang_002.json');
const song001 = readJSON('song_001.json');
const song002 = readJSON('song_002.json');
const song003 = readJSON('song_003.json');
const song004 = readJSON('song_004.json');

const allPoems = [
    ...(supplement.poems || supplement),
    ...(tang001.poems || tang001),
    ...(tang002.poems || tang002),
    ...(song001.poems || song001),
    ...(song002.poems || song002),
    ...(song003.poems || song003),
    ...(song004.poems || song004)
];

console.log(`共加载 ${allPoems.length} 首诗词`);

const keywordsMap = {};

console.log('处理诗词，提取关键字...');
for (const poem of allPoems) {
    const title = poem.title || poem.ti || '无题';
    const author = poem.author || poem.a || '佚名';
    const content = poem.content || poem.p || [];
    
    for (const line of content) {
        const chars = line.match(/[\u4e00-\u9fa5]/g) || [];
        const uniqueChars = [...new Set(chars)];
        
        for (const char of uniqueChars) {
            if (!keywordsMap[char]) {
                keywordsMap[char] = { c: 0, l: [] };
            }
            
            if (keywordsMap[char].c >= MAX_LINES_PER_KEYWORD) {
                continue;
            }
            
            const exists = keywordsMap[char].l.some(item => item.t === line);
            if (!exists) {
                keywordsMap[char].l.push({
                    t: line,
                    a: author,
                    ti: title
                });
                keywordsMap[char].c++;
            }
        }
    }
}

// 按诗句数量排序，保留前MAX_KEYWORDS个
const sortedChars = Object.keys(keywordsMap).sort((a, b) => {
    return keywordsMap[b].c - keywordsMap[a].c;
});

const topKeywords = {};
let totalLines = 0;
for (let i = 0; i < Math.min(MAX_KEYWORDS, sortedChars.length); i++) {
    const char = sortedChars[i];
    topKeywords[char] = keywordsMap[char];
    totalLines += keywordsMap[char].c;
}

console.log(`保留前 ${Object.keys(topKeywords).length} 个关键字，共 ${totalLines} 条诗句`);

const result = {
    version: '8.0',
    totalPoems: allPoems.length,
    totalLines: totalLines,
    keywords: topKeywords
};

const outputPath = path.join(dataDir, 'feihua_full.js');
const output = `const FEIHUA_FULL_DATA = ${JSON.stringify(result, null, 0)};`;

fs.writeFileSync(outputPath, output, 'utf8');

const stats = fs.statSync(outputPath);
console.log(`生成完成: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);

// 验证短歌行和声声慢
console.log('\n验证问题诗词:');
for (const title of ['短歌行', '声声慢']) {
    let found = false;
    for (const char in topKeywords) {
        const entries = topKeywords[char].l;
        if (entries.some(e => e.ti === title)) {
            console.log(`  ${title}: 已收录在"${char}"关键字下`);
            found = true;
            break;
        }
    }
    if (!found) {
        console.log(`  ${title}: 仍未收录`);
    }
}
