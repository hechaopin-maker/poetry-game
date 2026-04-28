// ==================== 诗词词典 ====================

const DICT_PAGE_SIZE = 10;
let dictCurrentPage = 1;
let dictCurrentResults = [];
let dictCurrentMode = 'search'; // search | author-index

function showDict() {
    if (!gameState.currentUser) {
        showLoginModal();
        return;
    }

    showPage('dictPage');
    dictCurrentMode = 'search';
    dictCurrentPage = 1;

    // 绑定搜索事件
    const searchInput = document.getElementById('dictSearch');
    searchInput.oninput = debounce(() => {
        dictCurrentPage = 1;
        searchPoems();
    }, 300);

    // 渲染模式切换
    renderDictHeader();
    renderDictResults();
}

function renderDictHeader() {
    const container = document.getElementById('dictPage');
    const existing = container.querySelector('.dict-header-nav');
    if (existing) existing.remove();

    const header = document.createElement('div');
    header.className = 'dict-header-nav';
    header.style.cssText = 'display:flex;gap:10px;margin-bottom:15px;';
    header.innerHTML = `
        <button class="btn ${dictCurrentMode === 'search' ? 'btn-primary' : 'btn-secondary'}" onclick="switchDictMode('search')" style="flex:1;">搜索</button>
        <button class="btn ${dictCurrentMode === 'author-index' ? 'btn-primary' : 'btn-secondary'}" onclick="switchDictMode('author-index')" style="flex:1;">诗人索引</button>
    `;
    container.insertBefore(header, container.children[2]);
}

function switchDictMode(mode) {
    dictCurrentMode = mode;
    dictCurrentPage = 1;
    renderDictHeader();
    if (mode === 'search') {
        searchPoems();
    } else {
        renderAuthorIndex();
    }
}

function renderAuthorIndex() {
    const results = document.getElementById('dictResults');

    // 按朝代分组统计诗人
    const byDynasty = {};
    POEMS_DATA.forEach(p => {
        const dynasty = p.dynasty || '未知';
        const author = p.author || '佚名';
        if (!byDynasty[dynasty]) byDynasty[dynasty] = new Map();
        if (!byDynasty[dynasty].has(author)) {
            byDynasty[dynasty].set(author, { name: author, count: 0 });
        }
        byDynasty[dynasty].get(author).count++;
    });

    const dynastyOrder = ['唐', '宋', '元', '明', '清', '先秦', '汉', '魏晋', '南北朝', '隋', '五代', '未知'];
    const sortedDynasties = Object.keys(byDynasty).sort((a, b) => {
        const ia = dynastyOrder.indexOf(a);
        const ib = dynastyOrder.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    let html = '';
    sortedDynasties.forEach(dynasty => {
        const authors = Array.from(byDynasty[dynasty].values()).sort((a, b) => b.count - a.count);
        html += `
            <div style="margin-bottom:20px;">
                <div style="font-weight:bold;color:var(--gold-dark);margin-bottom:10px;padding-bottom:6px;border-bottom:2px solid var(--gold-light);"
                    onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none';"
                    style="cursor:pointer;"
                >
                    ${dynasty} (${authors.length} 位诗人)
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;">
                    ${authors.map(a => `
                        <button class="btn btn-secondary" onclick="searchPoemsByAuthor('${a.name}')" style="font-size:0.85em;padding:5px 10px;">
                            ${a.name} <span style="color:#888;">${a.count}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    });

    results.innerHTML = html;
}

function searchPoemsByAuthor(author) {
    const searchInput = document.getElementById('dictSearch');
    searchInput.value = author;
    switchDictMode('search');
    searchPoems();
}

function searchPoems() {
    const query = document.getElementById('dictSearch').value.trim().toLowerCase();
    const results = document.getElementById('dictResults');

    if (!query) {
        renderDictResults();
        return;
    }

    const querySimplified = toSimplified(query);

    dictCurrentResults = POEMS_DATA.filter(p => {
        const titleSimplified = toSimplified(p.title || '').toLowerCase();
        const authorSimplified = toSimplified(p.author || '').toLowerCase();
        const contentSimplified = (p.content || []).map(c => toSimplified(c).toLowerCase());

        return titleSimplified.includes(querySimplified) ||
               authorSimplified.includes(querySimplified) ||
               contentSimplified.some(c => c.includes(querySimplified));
    });

    renderDictResults();
}

function renderDictResults() {
    const results = document.getElementById('dictResults');
    const total = dictCurrentResults.length;

    if (dictCurrentMode === 'author-index') {
        renderAuthorIndex();
        return;
    }

    const query = document.getElementById('dictSearch').value.trim();
    if (!query && total === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">文</div>
                <p>输入关键词搜索诗词</p>
            </div>
        `;
        return;
    }

    if (total === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔍</div>
                <p>没有找到相关诗词</p>
            </div>
        `;
        return;
    }

    const totalPages = Math.ceil(total / DICT_PAGE_SIZE);
    const start = (dictCurrentPage - 1) * DICT_PAGE_SIZE;
    const pageItems = dictCurrentResults.slice(start, start + DICT_PAGE_SIZE);

    let html = `
        <div style="margin-bottom:12px;color:#888;font-size:0.9em;">
            找到 ${total} 首诗词 · 第 ${dictCurrentPage}/${totalPages} 页
        </div>
    `;

    html += pageItems.map(p => {
        const title = toSimplified(p.title || '');
        const author = toSimplified(p.author || '');
        const dynasty = toSimplified(p.dynasty || '');
        const fullText = toSimplified(p.fullText || (Array.isArray(p.content) ? p.content.join('，') : ''));
        const isClassic = p.isClassic ? '<span style="color:var(--gold-dark);margin-left:4px;">★</span>' : '';
        const preview = fullText.length > 40 ? fullText.substring(0, 40) + '...' : fullText;

        return `
            <div class="question-box" style="margin-bottom:15px;cursor:pointer;" onclick="showDictPoemDetail('${p.id}')">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <strong style="font-size:1.15em;">${title}${isClassic}</strong>
                    <span style="color:#666;font-size:0.9em;">${dynasty}·${author}</span>
                </div>
                <div style="color:#555;font-size:0.95em;line-height:1.6;">${preview}</div>
            </div>
        `;
    }).join('');

    // 分页控件
    if (totalPages > 1) {
        html += `<div style="display:flex;justify-content:center;align-items:center;gap:10px;margin-top:20px;">`;
        html += `<button class="btn btn-secondary" ${dictCurrentPage <= 1 ? 'disabled' : ''} onclick="dictGoPage(${dictCurrentPage - 1})" style="padding:6px 14px;">上一页</button>`;
        html += `<span style="color:#666;font-size:0.9em;">${dictCurrentPage} / ${totalPages}</span>`;
        html += `<button class="btn btn-secondary" ${dictCurrentPage >= totalPages ? 'disabled' : ''} onclick="dictGoPage(${dictCurrentPage + 1})" style="padding:6px 14px;">下一页</button>`;
        html += `</div>`;
    }

    results.innerHTML = html;
}

function dictGoPage(page) {
    const totalPages = Math.ceil(dictCurrentResults.length / DICT_PAGE_SIZE);
    if (page < 1 || page > totalPages) return;
    dictCurrentPage = page;
    renderDictResults();
}

function showDictPoemDetail(poemId) {
    const poem = POEMS_DATA.find(p => p.id === poemId);
    if (!poem) return;

    const fullText = toSimplified(poem.fullText || (Array.isArray(poem.content) ? poem.content.join('，') : ''));
    const interpretation = toSimplified(poem.interpretation || '');
    const dynasty = toSimplified(poem.dynasty || '');
    const author = toSimplified(poem.author || '');
    const title = toSimplified(poem.title || '');
    const source = toSimplified(poem.source || '');
    const isClassic = poem.isClassic ? '<span style="color:var(--gold-dark);">★ 经典名句</span>' : '';

    // 查找同作者的其他诗词
    const sameAuthor = POEMS_DATA.filter(p =>
        p.id !== poem.id && toSimplified(p.author || '') === author
    ).slice(0, 5);

    const sameAuthorHTML = sameAuthor.length > 0 ? `
        <div style="margin-top:20px;padding-top:20px;border-top:1px dashed #ddd;">
            <div style="font-weight:bold;color:var(--gold-dark);margin-bottom:10px;">同作者其他诗词</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${sameAuthor.map(p => `
                    <div style="cursor:pointer;color:#555;padding:8px;background:#f8f8f8;border-radius:6px;" onclick="showDictPoemDetail('${p.id}')"
                        onmouseover="this.style.background='#eee'" onmouseout="this.style.background='#f8f8f8'">
                        ${toSimplified(p.title || '')}
                    </div>
                `).join('')}
            </div>
        </div>
    ` : '';

    const modalHTML = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;"
            onclick="if(event.target===this)closeDictDetailModal()">
            <div style="background:var(--paper);border-radius:4px;padding:30px;max-width:560px;width:90%;max-height:85vh;overflow-y:auto;font-family:'Noto Serif SC',serif;border:1px solid var(--ink-light);"
                onclick="event.stopPropagation()">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h3 style="margin:0;color:var(--gold-dark);">诗词详情</h3>
                    <button onclick="closeDictDetailModal()" style="background:none;border:none;font-size:1.5em;cursor:pointer;">✕</button>
                </div>
                <div style="text-align:center;margin-bottom:15px;">
                    <div style="font-size:1.3em;font-weight:bold;color:#333;">${dynasty}·${author}《${title}》</div>
                    ${isClassic ? `<div style="margin-top:4px;">${isClassic}</div>` : ''}
                </div>
                <div style="background:#fff;padding:20px;border-radius:10px;text-align:center;line-height:2.2;font-size:1.15em;color:#222;margin-bottom:15px;">
                    ${fullText.split(/[，。！？；]/).filter(l => l.trim()).join('<br>')}
                </div>
                ${interpretation ? `
                <div style="margin-bottom:15px;padding:15px;background:#fff;border-radius:8px;">
                    <strong style="color:var(--gold-dark);">【释义】</strong>
                    <p style="color:#555;margin:10px 0 0 0;line-height:1.8;">${interpretation}</p>
                </div>
                ` : ''}
                ${source ? `<div style="margin-bottom:15px;color:#888;font-size:0.9em;"><strong>出处：</strong>${source}</div>` : ''}
                ${sameAuthorHTML}
                <div style="text-align:center;margin-top:20px;">
                    <button class="btn btn-primary" onclick="closeDictDetailModal()">关闭</button>
                </div>
            </div>
        </div>
    `;

    let modal = document.getElementById('dictDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'dictDetailModal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = modalHTML;
}

function closeDictDetailModal() {
    const modal = document.getElementById('dictDetailModal');
    if (modal) modal.innerHTML = '';
}

// 增强解析内容：包含诗词全文、作者、朝代、释义
// 查找诗词的增强匹配函数（处理繁简差异和标题差异）
function findPoemEnhanced(title, author) {
    const baseTitle = title.split(/[·・]/)[0]; // 去掉副标题

    // 策略1：精确匹配（标题+作者，标题先转简）
    let poem = POEMS_DATA.find(p => {
        const pt = toSimplified(p.title || '');
        return pt === title && (p.author || '').includes(author);
    });

    // 策略2：去掉副标题后匹配（处理"渔家傲·秋思" vs "渔家傲"等）
    if (!poem && baseTitle !== title) {
        poem = POEMS_DATA.find(p => {
            const pt = toSimplified(p.title || '');
            return pt === baseTitle && (p.author || '').includes(author);
        });
    }

    // 策略3：仅作者匹配 + 标题包含搜索（宽松匹配）
    if (!poem) {
        poem = POEMS_DATA.find(p => {
            const pt = toSimplified(p.title || '');
            const pa = toSimplified(p.author || '');
            return pt.includes(baseTitle) && pa.includes(author);
        });
    }

    // 策略4：仅作者匹配（忽略标题，用于同一作者多首诗的情况）
    if (!poem) {
        const authorMatches = POEMS_DATA.filter(p =>
            toSimplified(p.author || '').includes(author)
        );
        if (authorMatches.length > 0) {
            // 优先选标题包含题目关键词的
            poem = authorMatches.find(p =>
                toSimplified(p.title || '').includes(baseTitle)
            ) || authorMatches[0];
        }
    }

    return poem;
}

function getEnhancedExplanation(q) {
    // 尝试从题目中提取诗词名和作者
    // 题目格式如："海日生残夜，__________。（王湾《次北固山下》）"
    const matchResult = q.question.match(/（([^《》]+)《([^《》]+)》）/);

    let enhancedHTML = `<strong>正确答案：</strong>${escapeHtml(q.answer)}`;

    if (matchResult) {
        const author = matchResult[1].trim();
        const title = matchResult[2].trim();

        // 在诗词库中查找对应诗词（增强匹配）
        const poem = findPoemEnhanced(title, author);

        if (poem) {
            // 找到诗词，增强解析（转换为简体）
            const fullText = toSimplified(poem.fullText || (Array.isArray(poem.content) ? poem.content.join('，') : ''));
            const interpretation = toSimplified(poem.interpretation || '');
            const dynasty = toSimplified(poem.dynasty || '');
            const pAuthor = toSimplified(poem.author || '');
            const pTitle = toSimplified(poem.title || '');

            enhancedHTML = `
                <div style="margin-bottom:15px;">
                    <strong>【诗词原文】</strong><br>
                    <div style="color:#333;font-size:1.1em;line-height:1.8;padding:10px;background:#f8f8f8;border-radius:8px;">
                        ${escapeHtml(fullText)}
                    </div>
                </div>
                <div style="margin-bottom:10px;">
                    <strong>【诗词信息】</strong><br>
                    <span style="color:#666;">${dynasty}·${pAuthor}《${pTitle}》</span>
                </div>
                ${interpretation ? `
                <div style="margin-bottom:10px;">
                    <strong>【诗词释义】</strong><br>
                    <span style="color:#555;">${escapeHtml(interpretation)}</span>
                </div>
                ` : ''}
            `;
        } else {
            // 没找到，使用原有解析
            enhancedHTML = `
                <strong>正确答案：</strong>${escapeHtml(q.answer)}<br><br>
                <strong>解析：</strong>${escapeHtml(q.explanation || '无')}
            `;
        }
    } else {
        // 无法提取诗词信息，使用原有解析
        enhancedHTML = `
            <strong>正确答案：</strong>${escapeHtml(q.answer)}<br><br>
            <strong>解析：</strong>${escapeHtml(q.explanation || '无')}
        `;
    }

    return enhancedHTML;
}

// 更新"看原诗"按钮的显示状态
function updateShowPoemButton(q) {
    const btn = document.getElementById('showPoemBtn');
    if (!btn || !q) return;
    const hasTitle = q.question && q.question.includes('《') && q.question.includes('》');
    btn.style.display = hasTitle ? 'inline-block' : 'none';
}

// 显示原诗功能：从题目中提取诗题并展示完整诗词
function showPoemByQuestion() {
    const q = gameState.currentQuestion;
    if (!q) return;
    const titleMatch = q.question.match(/《([^》]+)》/);
    if (!titleMatch) { alert('无法从题目中提取诗题'); return; }
    const title = titleMatch[1];
    const poemResults = window.POEMS_DATA || [];
    const poem = poemResults.find(p => {
        const pt = (p.title || '').replace(/[（(].*?[）)]/g, '').trim();
        return pt === title || p.title?.includes(title);
    });
    if (!poem) {
        const fuzzyResults = (window.POEMS_DATA || []).filter(p => (p.title || '').includes(title));
        if (fuzzyResults.length > 0) showPoemModal(fuzzyResults[0]);
        else alert(`未找到诗题《${title}》的诗词数据`);
        return;
    }
    showPoemModal(poem);
}

function showPoemModal(poem) {
    const fullText = toSimplified(Array.isArray(poem.content) ? poem.content.join('，') : (poem.fullText || ''));
    const interpretation = toSimplified(poem.interpretation || '');
    const dynasty = toSimplified(poem.dynasty || '');
    const author = toSimplified(poem.author || '');
    const pTitle = toSimplified(poem.title || '');
    const lines = fullText.split(/[，。！？；]/).filter(l => l.trim());
    const formattedText = lines.join('<br>');

    const poemHTML = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:1000;display:flex;align-items:center;justify-content:center;"
            onclick="if(event.target===this)closePoemModal()">
            <div style="background:var(--paper);border-radius:4px;padding:30px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;font-family:'Noto Serif SC',serif;border:1px solid var(--ink-light);"
                onclick="event.stopPropagation()">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
                    <h3 style="margin:0;color:var(--gold-dark);">文 诗词原文</h3>
                    <button onclick="closePoemModal()" style="background:none;border:none;font-size:1.5em;cursor:pointer;">✕</button>
                </div>
                <div style="text-align:center;margin-bottom:15px;">
                    <span style="font-size:1.4em;font-weight:bold;color:#333;">${dynasty}·${author}《${pTitle}》</span>
                </div>
                <div style="background:#fff;padding:20px;border-radius:10px;text-align:center;line-height:2.2;font-size:1.15em;color:#222;margin-bottom:15px;">
                    ${formattedText}
                </div>
                ${interpretation ? `<div style="margin-top:15px;padding:15px;background:#fff;border-radius:8px;"><strong style="color:var(--gold-dark);">【诗词释义】</strong><p style="color:#555;margin:10px 0 0 0;line-height:1.8;">${interpretation}</p></div>` : ''}
                <div style="text-align:center;margin-top:20px;">
                    <button class="btn btn-primary" onclick="closePoemModal()">返回解析</button>
                </div>
            </div>
        </div>`;
    let modal = document.getElementById('poemModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'poemModal'; document.body.appendChild(modal); }
    modal.innerHTML = poemHTML;
}

function closePoemModal() {
    const modal = document.getElementById('poemModal');
    if (modal) modal.innerHTML = '';
}
