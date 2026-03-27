// 真题题库
const QUESTIONS_DATA = [
    {
        id: "q_mk_001",
        type: "choice",
        grade: "mk",
        source: "2024年北京人大附中密考真题",
        difficulty: 2,
        question: "以下哪句诗表达的是思乡之情？",
        options: [
            { text: "举头望明月，低头思故乡", correct: true },
            { text: "春眠不觉晓，处处闻啼鸟", correct: false },
            { text: "白日依山尽，黄河入海流", correct: false },
            { text: "两个黄鹂鸣翠柳，一行白鹭上青天", correct: false }
        ],
        answer: "举头望明月，低头思故乡",
        explanation: "此句出自李白《静夜思》，诗人借月亮表达对故乡的思念。",
        poemId: "poem_006",
        knowledgePoints: ["思乡", "月亮", "李白"]
    },
    {
        id: "q_mk_002",
        type: "fill",
        grade: "mk",
        source: "2024年河北衡水小升初真题",
        difficulty: 2,
        question: "杨万里《新柳》：柳条百尺拂银塘，_____。未必柳条能蘸水，_____。",
        options: [],
        answer: "且莫深青只浅黄；水中柳影引他长",
        explanation: "这是杨万里《新柳》的原文。",
        poemId: null,
        knowledgePoints: ["古诗默写", "杨万里", "新柳"]
    },
    {
        id: "q_fbc_001",
        type: "choice",
        grade: "fbc",
        source: "2024年某重点初中分班测真题",
        difficulty: 2,
        question: "\"独在异乡为异客，每逢佳节倍思亲\"中的\"佳节\"指的是哪个节日？",
        options: [
            { text: "重阳节", correct: true },
            { text: "中秋节", correct: false },
            { text: "端午节", correct: false },
            { text: "春节", correct: false }
        ],
        answer: "重阳节",
        explanation: "此句出自王维《九月九日忆山东兄弟》，九月九日是重阳节，古人有登高插茱萸的习俗。",
        poemId: "poem_007",
        knowledgePoints: ["节日", "重阳节", "王维"]
    },
    {
        id: "q_fbc_002",
        type: "choice",
        grade: "fbc",
        source: "2024年某重点初中分班测真题",
        difficulty: 3,
        question: "以下哪句诗描写的是春天的景色？",
        options: [
            { text: "几处早莺争暖树，谁家新燕啄春泥", correct: true },
            { text: "忽如一夜春风来，千树万树梨花开", correct: false },
            { text: "停车坐爱枫林晚，霜叶红于二月花", correct: false },
            { text: "千山鸟飞绝，万径人踪灭", correct: false }
        ],
        answer: "几处早莺争暖树，谁家新燕啄春泥",
        explanation: "此句出自白居易《钱塘湖春行》，\"早莺\"、\"新燕\"、\"春泥\"都是春天的意象。",
        poemId: "poem_003",
        knowledgePoints: ["春天", "写景", "白居易"]
    },
    {
        id: "q_chu1_001",
        type: "choice",
        grade: "chu1",
        source: "七年级上册单元测试",
        difficulty: 2,
        question: "\"海内存知己，天涯若比邻\"的作者是谁？",
        options: [
            { text: "王勃", correct: true },
            { text: "王维", correct: false },
            { text: "李白", correct: false },
            { text: "杜甫", correct: false }
        ],
        answer: "王勃",
        explanation: "此句出自王勃《送杜少府之任蜀州》，表达了旷达的友情观。",
        poemId: "poem_009",
        knowledgePoints: ["送别", "友情", "王勃"]
    },
    {
        id: "q_chu1_002",
        type: "choice",
        grade: "chu1",
        source: "七年级上册期末测试",
        difficulty: 2,
        question: "《天净沙·秋思》中\"小桥流水飞红\"的\"飞红\"是什么意思？",
        options: [
            { text: "花瓣飞舞，指落花", correct: true },
            { text: "红色的飞鸟", correct: false },
            { text: "飘动的红叶", correct: false },
            { text: "夕阳的余晖", correct: false }
        ],
        answer: "花瓣飞舞，指落花",
        explanation: "\"飞红\"在此处指花瓣飞舞，形容暮春时节落花飘零的景象。",
        poemId: null,
        knowledgePoints: ["词句理解", "意象", "马致远"]
    },
    {
        id: "q_chu2_001",
        type: "choice",
        grade: "chu2",
        source: "八年级上册单元测试",
        difficulty: 3,
        question: "\"大漠孤烟直，长河落日圆\"一联用了什么修辞手法？",
        options: [
            { text: "对偶", correct: true },
            { text: "比喻", correct: false },
            { text: "拟人", correct: false },
            { text: "夸张", correct: false }
        ],
        answer: "对偶",
        explanation: "\"大漠\"对\"长河\"，\"孤烟\"对\"落日\"，\"直\"对\"圆\"，形成了工整的对偶。",
        poemId: "poem_002",
        knowledgePoints: ["修辞手法", "对偶", "王维"]
    },
    {
        id: "q_zk_001",
        type: "choice",
        grade: "zk",
        source: "2023年广东深圳中考真题",
        difficulty: 4,
        question: "阅读《竹石》，\"咬定青山不放松，立根原在破岩中\"表达了诗人怎样的情感？",
        options: [
            { text: "坚韧不拔的精神品质", correct: true },
            { text: "对祖国山河的热爱", correct: false },
            { text: "对故乡的思念", correct: false },
            { text: "对亲人的牵挂", correct: false }
        ],
        answer: "坚韧不拔的精神品质",
        explanation: "郑燮通过描写竹子扎根岩石、咬定青山不放松，表达了自己坚韧不拔、刚正不阿的精神品质。",
        poemId: null,
        knowledgePoints: ["诗歌鉴赏", "托物言志", "郑燮"]
    },
    {
        id: "q_zk_002",
        type: "interpret",
        grade: "zk",
        source: "2023年某省市中考真题",
        difficulty: 4,
        question: "\"长风破浪会有时，直挂云帆济沧海\"表达了诗人怎样的情怀？",
        options: [
            { text: "对理想的追求和坚定信念", correct: true },
            { text: "对现实的不满和抱怨", correct: false },
            { text: "对友人的深深思念", correct: false },
            { text: "对自然景色的赞美", correct: false }
        ],
        answer: "对理想的追求和坚定信念",
        explanation: "李白在《行路难》中用\"长风破浪\"比喻远大志向，表达了他对实现理想的坚定信念和乐观态度。",
        poemId: "poem_012",
        knowledgePoints: ["诗歌鉴赏", "理想", "李白"]
    },
    {
        id: "q_zk_003",
        type: "choice",
        grade: "zk",
        source: "2024年北京中考真题",
        difficulty: 4,
        question: "以下哪句诗表达的是爱国之情？",
        options: [
            { text: "人生自古谁无死，留取丹心照汗青", correct: true },
            { text: "海内存知己，天涯若比邻", correct: false },
            { text: "桃花潭水深千尺，不及汪伦送我情", correct: false },
            { text: "不知庐山真面目，只缘身在此山中", correct: false }
        ],
        answer: "人生自古谁无死，留取丹心照汗青",
        explanation: "文天祥在《过零丁洋》中表达了以死报国的决心，是爱国主义的名句。",
        poemId: "poem_014",
        knowledgePoints: ["爱国", "文天祥", "诗歌鉴赏"]
    }
];

// 获取指定年级的题目
function getQuestionsByGrade(grade, count = 10) {
    const filtered = QUESTIONS_DATA.filter(q => q.grade === grade);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 获取随机题目（用于每日挑战）
function getRandomQuestions(count = 10) {
    const shuffled = [...QUESTIONS_DATA].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}
