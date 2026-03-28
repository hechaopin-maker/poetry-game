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
    ,
    shan: {
        character: "山",
        level: "medium",
        poems: [
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "会当凌绝顶，一览众山小", author: "杜甫", title: "望岳" },
            { poem: "不识庐山真面目，只缘身在此山中", author: "苏轼", title: "题西林壁" },
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "青山遮不住，毕竟东流去", author: "辛弃疾", title: "菩萨蛮·书江西造口壁" },
            { poem: "山回路转不见君，雪上空留马行处", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "两岸猿声啼不住，轻舟已过万重山", author: "李白", title: "早发白帝城" },
            { poem: "孤山寺北贾亭西，水面初平云脚低", author: "白居易", title: "钱塘湖春行" },
            { poem: "京口瓜洲一水间，钟山只隔数重山", author: "王安石", title: "泊船瓜洲" },
            { poem: "欲渡黄河冰塞川，将登太行雪满山", author: "李白", title: "行路难" },
            { poem: "江流宛转绕芳甸，月照花林皆似霰", author: "张若虚", title: "春江花月夜" },
            { poem: "峨眉山月半轮秋，影入平羌江水流", author: "李白", title: "峨眉山月歌" },
            { poem: "三山半落青天外，二水中分白鹭洲", author: "李白", title: "登金陵凤凰台" },
            { poem: "西当太白有鸟道，可以横绝峨眉巅", author: "李白", title: "蜀道难" },
            { poem: "君不见黄河之水天上来，奔流到海不复回", author: "李白", title: "将进酒" },
            { poem: " Mountain doesn't ask the tiger's permission to stand tall", author: "杜甫", title: "望岳" },
            { poem: "山随平野尽，江入大荒流", author: "李白", title: "渡荆门送别" },
            { poem: "青山横北郭，白水绕东城", author: "李白", title: "送友人" },
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" }
        ]
    },
    shui: {
        character: "水",
        level: "medium",
        poems: [
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" },
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "竹外桃花三两枝，春江水暖鸭先知", author: "苏轼", title: "惠崇春江晚景" },
            { poem: "泉眼无声惜细流，树阴照水爱晴柔", author: "杨万里", title: "小池" },
            { poem: "抽刀断水水更流，举杯消愁愁更愁", author: "李白", title: "宣州谢朓楼饯别校书叔云" },
            { poem: "花自飘零水自流，一种相思，两处闲愁", author: "李清照", title: "一剪梅" },
            { poem: "问君能有几多愁？恰似一江春水向东流", author: "李煜", title: "虞美人" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "江水流春去欲尽，江潭落月复西斜", author: "张若虚", title: "春江花月夜" },
            { poem: "胜日寻芳泗水滨，无边光景一时新", author: "朱熹", title: "春日" },
            { poem: "天门中断楚江开，碧水东流至此回", author: "李白", title: "望天门山" },
            { poem: "水是眼波横，山是眉峰聚", author: "王观", title: "卜算子·送鲍浩然之浙东" },
            { poem: "仍怜故乡水，万里送行舟", author: "李白", title: "渡荆门送别" },
            { poem: "昔闻洞庭水，今上岳阳楼", author: "杜甫", title: "登岳阳楼" },
            { poem: "八月湖水平，涵虚混太清", author: "孟浩然", title: "望洞庭湖赠张丞相" },
            { poem: "云霞灭没水间闻，枫叶萧萧涉水多", author: "刘长卿", title: "武川送路转 fish" },
            { poem: "春水船如天上坐，老年花似雾中看", author: "杜甫", title: "小寒食舟中作" },
            { poem: "湘江，西江，都东注，此水蔓延何时已", author: "李白", title: "远别离" },
            { poem: "请君试问东流水，别意与之谁短长", author: "李白", title: "金陵酒肆留别" }
        ]
    },
    yun: {
        character: "云",
        level: "medium",
        poems: [
            { poem: "黄河远上白云间，一片孤城万仞山", author: "王之涣", title: "凉州词" },
            { poem: "只在此山中，云深不知处", author: "贾岛", title: "寻隐者不遇" },
            { poem: "众鸟高飞尽，孤云独去闲", author: "李白", title: "独坐敬亭山" },
            { poem: "月下飞天镜，云生结海楼", author: "李白", title: "渡荆门送别" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "朝辞白帝彩云间，千里江陵一日还", author: "李白", title: "早发白帝城" },
            { poem: "远上寒山石径斜，白云生处有人家", author: "杜牧", title: "山行" },
            { poem: "半亩方塘一鉴开，天光云影共徘徊", author: "朱熹", title: "观书有感" },
            { poem: "黑云压城城欲摧，甲光向日金鳞开", author: "李贺", title: "雁门太守行" },
            { poem: "云横秦岭家何在？雪拥蓝关马不前", author: "韩愈", title: "左迁至蓝关示侄孙湘" },
            { poem: "曾经沧海难为水，除却巫山不是云", author: "元稹", title: "离思" },
            { poem: "上穷碧落下黄泉，两处茫茫皆不见", author: "白居易", title: "长恨歌" },
            { poem: "云鬓花颜金步摇，芙蓉帐暖度春宵", author: "白居易", title: "长恨歌" },
            { poem: "迟迟钟鼓初长夜，耿耿星河欲曙天", author: "白居易", title: "长恨歌" },
            { poem: "鸳鸯瓦冷霜华重，翡翠衾寒谁与共", author: "白居易", title: "长恨歌" },
            { poem: "昭阳殿里恩爱绝，蓬莱宫中日月长", author: "白居易", title: "长恨歌" },
            { poem: "回头下望人寰处，不见长安见尘雾", author: "白居易", title: "长恨歌" },
            { poem: "忽闻海上有仙山，山在虚无缥渺间", author: "白居易", title: "长恨歌" },
            { poem: "楼阁玲珑五云起，其中绰约多仙子", author: "白居易", title: "长恨歌" },
            { poem: "风吹仙袂飘飘举，犹似霓裳羽衣舞", author: "白居易", title: "长恨歌" }
        ]
    },
    jiu: {
        character: "酒",
        level: "hard",
        poems: [
            { poem: "葡萄美酒夜光杯，欲饮琵琶马上催", author: "王翰", title: "凉州词" },
            { poem: "醉翁之意不在酒，在乎山水之间也", author: "欧阳修", title: "醉翁亭记" },
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "花间一壶酒，独酌无相亲", author: "李白", title: "月下独酌" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "今朝有酒今朝醉，明日愁来明日愁", author: "罗隐", title: "自遣" },
            { poem: "明月几时有？把酒问青天", author: "苏轼", title: "水调歌头" },
            { poem: "人生得意须尽欢，莫使金樽空对月", author: "李白", title: "将进酒" },
            { poem: "天生我材必有用，千金散尽还复来", author: "李白", title: "将进酒" },
            { poem: "烹羊宰牛且为乐，会须一饮三百杯", author: "李白", title: "将进酒" },
            { poem: "钟鼓馔玉不足贵，但愿长醉不愿醒", author: "李白", title: "将进酒" },
            { poem: "古来圣贤皆寂寞，惟有饮者留其名", author: "李白", title: "将进酒" },
            { poem: "陈王昔时宴平乐，斗酒十千恣欢谑", author: "李白", title: "将进酒" },
            { poem: "主人何为言少钱，径须沽取对君酌", author: "李白", title: "将进酒" },
            { poem: "五花马，千金裘，呼儿将出换美酒", author: "李白", title: "将进酒" },
            { poem: "与尔同销万古愁", author: "李白", title: "将进酒" },
            { poem: "兰陵美酒郁金香，玉碗盛来琥珀光", author: "李白", title: "客中行" },
            { poem: "李白斗酒诗百篇，长安市上酒家眠", author: "杜甫", title: "饮中八仙歌" },
            { poem: "烟笼寒水月笼沙，夜泊秦淮近酒家", author: "杜牧", title: "泊秦淮" },
            { poem: "今宵酒醒何处？杨柳岸，晓风残月", author: "柳永", title: "雨霖铃" }
        ]
    },
    xue: {
        character: "雪",
        level: "medium",
        poems: [
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "忽如一夜春风来，千树万树梨花开", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "纷纷暮雪下辕门，风掣红旗冻不翻", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "轮台东门送君去，去时雪满天山路", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "山回路转不见君，雪上空留马行处", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "孤舟蓑笠翁，独钓寒江雪", author: "柳宗元", title: "江雪" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "终南阴岭秀，积雪浮云端", author: "祖咏", title: "终南望馀雪" },
            { poem: "雪暗凋旗画，风多杂鼓声", author: "杨炯", title: "从军行" },
            { poem: "青海长云暗雪山，孤城遥望玉门关", author: "王昌龄", title: "从军行" },
            { poem: "雪净胡天牧马还，月明羌笛戍楼间", author: "高适", title: "塞上听吹笛" },
            { poem: "乱云低薄暮，急雪舞回风", author: "杜甫", title: "对雪" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "岁暮阴阳催短景，天涯霜雪霁寒宵", author: "杜甫", title: "阁夜" },
            { poem: "惨惨柴门风雪夜，此时有子不如无", author: "黄景仁", title: "别老母" },
            { poem: "雪似梅花，梅花似雪，似和不似都奇绝", author: "吕本中", title: "踏莎行" },
            { poem: "去年雪满长安树，今年雪满长安城", author: "白居易", title: "长安早春" },
            { poem: "春还草阁梅先动，月满虚庭雪未消", author: "王守仁", title: "元夕二首" },
            { poem: "晨起开门雪满山，雪晴云淡日光寒", author: "郑板桥", title: "山中雪后" }
        ]
    },
    niǎo: {
        character: "鸟",
        level: "medium",
        poems: [
            { poem: "春眠不觉晓，处处闻啼鸟", author: "孟浩然", title: "春晓" },
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "月出惊山鸟，时鸣春涧中", author: "王维", title: "鸟鸣涧" },
            { poem: "春去花还在，人来鸟惊", author: "王维", title: "画" },
            { poem: "鸟宿池边树，僧敲月下门", author: "贾岛", title: "题李凝幽居" },
            { poem: "荡胸生层云，决眦入归鸟", author: "杜甫", title: "望岳" },
            { poem: "山气日夕佳，飞鸟相与还", author: "陶渊明", title: "饮酒" },
            { poem: "几处早莺争暖树，谁家新燕啄春泥", author: "白居易", title: "钱塘湖春行" },
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "晴空一鹤排云上，便引诗情到碧霄", author: "刘禹锡", title: "秋词" },
            { poem: "明月别枝惊鹊，清风半夜鸣蝉", author: "辛弃疾", title: "西江月" },
            { poem: "枯藤老树昏鸦，小桥流水人家", author: "马致远", title: "天净沙·秋思" },
            { poem: "江雨霏霏江草齐，六朝如梦鸟空啼", author: "韦庄", title: "台城" },
            { poem: "江晚正愁余，山深闻鹧鸪", author: "辛弃疾", title: "菩萨蛮·书江西造口壁" },
            { poem: "春鸟报平安，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "鹏程万里由兹始，风翻羽翼正高翔", author: "李白", title: "临路歌" },
            { poem: "花开红树乱莺啼，草长平湖白鹭飞", author: "徐元杰", title: "湖上" },
            { poem: "千里莺啼绿映红，水村山郭酒旗风", author: "杜牧", title: "江南春" },
            { poem: "春残翁绿上啼鸟，独自寻花不觉归", author: "白居易", title: "春晚寻花" }
        ]
    },
    yuan: {
        character: "月",
        level: "easy",
        poems: [
            { poem: "海上生明月，天涯共此时", author: "张九龄", title: "望月怀远" },
            { poem: "露从今夜白，月是故乡明", author: "杜甫", title: "月夜忆舍弟" },
            { poem: "明月松间照，清泉石上流", author: "王维", title: "山居秋暝" },
            { poem: "深林人不知，明月来相照", author: "王维", title: "竹里馆" },
            { poem: "床前明月光，疑是地上霜", author: "李白", title: "静夜思" },
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "小时不识月，呼作白玉盘", author: "李白", title: "古朗月行" },
            { poem: "举杯邀明月，对影成三人", author: "李白", title: "月下独酌" },
            { poem: "月下飞天镜，云生结海楼", author: "李白", title: "渡荆门送别" },
            { poem: "长安一片月，万户捣衣声", author: "李白", title: "子夜吴歌·秋歌" },
            { poem: "明月出天山，苍茫云海间", author: "李白", title: "关山月" },
            { poem: "登舟望秋月，空忆谢将军", author: "李白", title: "夜泊牛渚怀古" },
            { poem: "今人不见古时月，今月曾经照古人", author: "李白", title: "把酒问月" },
            { poem: "青天有月来几时？我今停杯一问之", author: "李白", title: "把酒问月" },
            { poem: "人攀明月不可得，月行却与人相随", author: "李白", title: "把酒问月" },
            { poem: "古人今人若流水，共看明月皆如此", author: "李白", title: "把酒问月" },
            { poem: "唯愿当歌对酒时，月光长照金樽里", author: "李白", title: "把酒问月" },
            { poem: "人生代代无穷已，江月年年望相似", author: "张若虚", title: "春江花月夜" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "江天一色无纤尘，皎皎空中孤月轮", author: "张若虚", title: "春江花月夜" }
        ]
    }
};
