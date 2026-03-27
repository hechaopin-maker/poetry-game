// 飞花令数据库
const FEIHUA_DATA = {
    // 初级关键字
    chun: {
        character: "春",
        level: "easy",
        poems: [
            { poem: "春眠不觉晓，处处闻啼鸟", author: "孟浩然", title: "春晓" },
            { poem: "好雨知时节，当春乃发生", author: "杜甫", title: "春夜喜雨" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "等闲识得东风面，万紫千红总是春", author: "朱熹", title: "春日" },
            { poem: "爆竹声中一岁除，春风送暖入屠苏", author: "王安石", title: "元日" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "春蚕到死丝方尽，蜡炬成灰泪始干", author: "李商隐", title: "无题" },
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" }
        ]
    },
    hua: {
        character: "花",
        level: "easy",
        poems: [
            { poem: "夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "人面不知何处去，桃花依旧笑春风", author: "崔护", title: "题都城南庄" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "落花人独立，微雨燕双飞", author: "翁宏", title: "春残" },
            { poem: "无可奈何花落去，似曾相识燕归来", author: "晏殊", title: "浣溪沙" },
            { poem: "人间四月芳菲尽，山寺桃花始盛开", author: "白居易", title: "大林寺桃花" },
            { poem: "不是花中偏爱菊，此花开尽更无花", author: "元稹", title: "菊花" }
        ]
    },
    yue: {
        character: "月",
        level: "easy",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "明月松间照，清泉石上流", author: "王维", title: "山居秋暝" },
            { poem: "小时不识月，呼作白玉盘", author: "李白", title: "古朗月行" },
            { poem: "明月几时有，把酒问青天", author: "苏轼", title: "水调歌头" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" },
            { poem: "海上生明月，天涯共此时", author: "张九龄", title: "望月怀远" },
            { poem: "床前明月光，疑是地上霜", author: "李白", title: "静夜思" },
            { poem: "人有悲欢离合，月有阴晴圆缺", author: "苏轼", title: "水调歌头" }
        ]
    },
    feng: {
        character: "风",
        level: "easy",
        poems: [
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "长风破浪会有时，直挂云帆济沧海", author: "李白", title: "行路难" },
            { poem: "忽如一夜春风来，千树万树梨花开", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "东风不与周郎便，铜雀春深锁二乔", author: "杜牧", title: "赤壁" },
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" },
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" }
        ]
    },
    // 中级关键字
    shan: {
        character: "山",
        level: "medium",
        poems: [
            { poem: "空山不见人，但闻人语响", author: "王维", title: "鹿柴" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "不识庐山真面目，只缘身在此山中", author: "苏轼", title: "题西林壁" },
            { poem: "空山新雨后，天气晚来秋", author: "王维", title: "山居秋暝" },
            { poem: "但使龙城飞将在，不教胡马度阴山", author: "王昌龄", title: "出塞" },
            { poem: "远上寒山石径斜，白云生处有人家", author: "杜牧", title: "山行" },
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "两岸猿声啼不住，轻舟已过万重山", author: "李白", title: "早发白帝城" }
        ]
    },
    shui: {
        character: "水",
        level: "medium",
        poems: [
            { poem: "仍怜故乡水，万里送行舟", author: "李白", title: "渡荆门送别" },
            { poem: "抽刀断水水更流，举杯消愁愁更愁", author: "李白", title: "宣州谢朓楼饯别校书叔云" },
            { poem: "天门中断楚江开，碧水东流至此回", author: "李白", title: "望天门山" },
            { poem: "胜日寻芳泗水滨，无边光景一时新", author: "朱熹", title: "春日" },
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" },
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" }
        ]
    },
    yun: {
        character: "云",
        level: "medium",
        poems: [
            { poem: "远上寒山石径斜，白云生处有人家", author: "杜牧", title: "山行" },
            { poem: "只在此山中，云深不知处", author: "贾岛", title: "寻隐者不遇" },
            { poem: "黄河远上白云间，一片孤城万仞山", author: "王之涣", title: "凉州词" },
            { poem: "晴空一鹤排云上，便引诗情到碧霄", author: "刘禹锡", title: "秋词" },
            { poem: "云横秦岭家何在，雪拥蓝关马不前", author: "韩愈", title: "左迁至蓝关示侄孙湘" },
            { poem: "长风破浪会有时，直挂云帆济沧海", author: "李白", title: "行路难" },
            { poem: "朝辞白帝彩云间，千里江陵一日还", author: "李白", title: "早发白帝城" },
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" }
        ]
    },
    jiu: {
        character: "酒",
        level: "medium",
        poems: [
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "葡萄美酒夜光杯，欲饮琵琶马上催", author: "王翰", title: "凉州词" },
            { poem: "借问酒家何处有，牧童遥指杏花村", author: "杜牧", title: "清明" },
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" },
            { poem: "明月几时有，把酒问青天", author: "苏轼", title: "水调歌头" },
            { poem: "花间一壶酒，独酌无相亲", author: "李白", title: "月下独酌" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" }
        ]
    }
};

// 获取所有关键字
function getAllCharacters() {
    return Object.keys(FEIHUA_DATA).map(key => ({
        key,
        character: FEIHUA_DATA[key].character,
        level: FEIHUA_DATA[key].level
    }));
}

// 获取指定关键字的诗句
function getPoemsByCharacter(key) {
    if (FEIHUA_DATA[key]) {
        return FEIHUA_DATA[key].poems;
    }
    return [];
}
