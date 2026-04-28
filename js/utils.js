// 古诗词大挑战 - 工具函数库

/**
 * 简繁转换
 * @param {string} str - 输入字符串
 * @returns {string} 简体字符串
 */
function toSimplified(str) {
    if (!str || typeof str !== 'string') return str;
    let result = '';
    for (const char of str) {
        result += TRAD_TO_SIMP[char] || char;
    }
    return result;
}

/**
 * Fisher-Yates 洗牌算法
 * @param {Array} array - 待洗牌数组
 * @returns {Array} 新数组（不修改原数组）
 */
function shuffle(array) {
    if (!Array.isArray(array)) return array;
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * 计算得分
 * @param {number} baseScore - 基础分
 * @param {number} combo - 连击数
 * @returns {number} 总得分
 */
function calculateScore(baseScore, combo) {
    let points = baseScore || BASE_SCORE;
    if (combo > 1) {
        points += Math.min(combo - 1, MAX_COMBO_CAP) * COMBO_MULTIPLIER;
    }
    return points;
}

/**
 * 清理标点符号
 * @param {string} str - 输入字符串
 * @returns {string} 无标点的字符串
 */
function cleanPunctuation(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(PUNCTUATION_RE, '');
}

/**
 * HTML 转义
 * @param {string} str - 输入字符串
 * @returns {string} 转义后的字符串
 */
function escapeHtml(str) {
    if (!str || typeof str !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * 防抖函数
 * @param {Function} func - 目标函数
 * @param {number} wait - 等待毫秒数
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * 格式化时间（秒 → MM:SS）
 * @param {number} seconds - 秒数
 * @returns {string} 格式化后的时间
 */
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

/**
 * 深拷贝
 * @param {any} obj - 待拷贝对象
 * @returns {any} 拷贝后的对象
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (Array.isArray(obj)) return obj.map(deepClone);
    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
}
