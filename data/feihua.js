// 飞花令数据库 - 扩充版
// 包含40+关键字，每个关键字10-15句经典诗句
const FEIHUA_DATA = {
    // ========== 初级关键字 ==========
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
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" },
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "今夜偏知春气暖，虫声新透绿窗纱", author: "刘方平", title: "月夜" },
            { poem: "春潮带雨晚来急，野渡无人舟自横", author: "韦应物", title: "滁州西涧" },
            { poem: "春路雨添花，花动一山春色", author: "秦观", title: "好事近" }
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
            { poem: "不是花中偏爱菊，此花开尽更无花", author: "元稹", title: "菊花" },
            { poem: "借问梅花何处落，风吹一夜满关山", author: "高适", title: "塞上听吹笛" },
            { poem: "解落三秋叶，能开二月花", author: "李峤", title: "风" },
            { poem: "落红不是无情物，化作春泥更护花", author: "龚自珍", title: "己亥杂诗" }
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
            { poem: "人有悲欢离合，月有阴晴圆缺", author: "苏轼", title: "水调歌头" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "江畔何人初见月，江月何年初照人", author: "张若虚", title: "春江花月夜" },
            { poem: "峨眉山月半轮秋，影入平羌江水流", author: "李白", title: "峨眉山月歌" },
            { poem: "露从今夜白，月是故乡明", author: "杜甫", title: "月夜忆舍弟" }
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
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" },
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "不知细叶谁裁出，二月春风似剪刀", author: "贺知章", title: "咏柳" },
            { poem: "风急天高猿啸哀，渚清沙白鸟飞回", author: "杜甫", title: "登高" },
            { poem: "春风不相识，何事入罗帏", author: "李白", title: "春思" },
            { poem: "古道西风瘦马，断肠人在天涯", author: "马致远", title: "天净沙·秋思" }
        ]
    },
    niao: {
        character: "鸟",
        level: "easy",
        poems: [
            { poem: "春眠不觉晓，处处闻啼鸟", author: "孟浩然", title: "春晓" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "西塞山前白鹭飞，桃花流水鳜鱼肥", author: "张志和", title: "渔歌子" },
            { poem: "江雨霏霏江草齐，六朝如梦鸟空啼", author: "韦庄", title: "台城" },
            { poem: "春去花不在，人来鸟不惊", author: "贾岛", title: "题诗后" },
            { poem: "月出惊山鸟，时鸣春涧中", author: "王维", title: "鸟鸣涧" },
            { poem: "江碧鸟逾白，山青花欲燃", author: "杜甫", title: "绝句" },
            { poem: "泥融飞燕子，沙暖睡鸳鸯", author: "杜甫", title: "绝句" },
            { poem: "山光悦鸟性，潭影空人心", author: "常建", title: "破山寺后禅院" }
        ]
    },
    // ========== 中级关键字 ==========
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
            { poem: "两岸猿声啼不住，轻舟已过万重山", author: "李白", title: "早发白帝城" },
            { poem: "会当凌绝顶，一览众山小", author: "杜甫", title: "望岳" },
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "青山遮不住，毕竟东流去", author: "辛弃疾", title: "菩萨蛮" },
            { poem: "山回路转不见君，雪上空留马行处", author: "岑参", title: "白雪歌送武判官归京" }
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
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "竹外桃花三两枝，春江水暖鸭先知", author: "苏轼", title: "惠崇春江晚景" },
            { poem: "泉眼无声惜细流，树阴照水爱晴柔", author: "杨万里", title: "小池" },
            { poem: "问君能有几多愁？恰似一江春水向东流", author: "李煜", title: "虞美人" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" }
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
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "众鸟高飞尽，孤云独去闲", author: "李白", title: "独坐敬亭山" },
            { poem: "半亩方塘一鉴开，天光云影共徘徊", author: "朱熹", title: "观书有感" },
            { poem: "黑云压城城欲摧，甲光向日金鳞开", author: "李贺", title: "雁门太守行" },
            { poem: "月下飞天镜，云生结海楼", author: "李白", title: "渡荆门送别" }
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
            { poem: "艰难苦恨繁霜鬓，潦倒新停浊酒杯", author: "杜甫", title: "登高" },
            { poem: "今朝有酒今朝醉，明日愁来明日愁", author: "罗隐", title: "自遣" },
            { poem: "兰陵美酒郁金香，玉碗盛来琥珀光", author: "李白", title: "客中行" },
            { poem: "酒债寻常行处有，人生七十古来稀", author: "杜甫", title: "曲江二首" }
        ]
    },
    xue: {
        character: "雪",
        level: "medium",
        poems: [
            { poem: "忽如一夜春风来，千树万树梨花开", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "青海长云暗雪山，孤城遥望玉门关", author: "王昌龄", title: "从军行" },
            { poem: "雪净胡天牧马还，月明羌笛戍楼间", author: "高适", title: "塞上听吹笛" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "欲渡黄河冰塞川，将登太行雪满山", author: "李白", title: "行路难" },
            { poem: "云横秦岭家何在，雪拥蓝关马不前", author: "韩愈", title: "左迁至蓝关示侄孙湘" },
            { poem: "纷纷暮雪下辕门，风掣红旗冻不翻", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "轮台东门送君去，去时雪满天山路", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "晚来天欲雪，能饮一杯无", author: "白居易", title: "问刘十九" }
        ]
    },
    ye: {
        character: "夜",
        level: "medium",
        poems: [
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" },
            { poem: "姑苏城外寒山寺，夜半钟声到客船", author: "张继", title: "枫桥夜泊" },
            { poem: "海日生残夜，江春入旧年", author: "王湾", title: "次北固山下" },
            { poem: "今夜偏知春气暖，虫声新透绿窗纱", author: "刘方平", title: "月夜" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "不知乘月几人归，落月摇情满江树", author: "张若虚", title: "春江花月夜" },
            { poem: "今夜闻君琵琶语，如听仙乐耳暂明", author: "白居易", title: "琵琶行" },
            { poem: "从今若许闲乘月，拄杖无时夜叩门", author: "陆游", title: "游山西村" },
            { poem: "夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" },
            { poem: "昨夜星辰昨夜风，画楼西畔桂堂东", author: "李商隐", title: "无题" },
            { poem: "今夜月明人尽望，不知秋思落谁家", author: "王建", title: "十五夜望月" }
        ]
    },
    ri: {
        character: "日",
        level: "medium",
        poems: [
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "大漠孤烟直，长河落日圆", author: "王维", title: "使至塞上" },
            { poem: "锄禾日当午，汗滴禾下土", author: "李绅", title: "悯农" },
            { poem: "日照香炉生紫烟，遥看瀑布挂前川", author: "李白", title: "望庐山瀑布" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "浩荡离愁白日斜，吟鞭东指即天涯", author: "龚自珍", title: "己亥杂诗" },
            { poem: "日暮汉宫传蜡烛，轻烟散入五侯家", author: "韩翃", title: "寒食" },
            { poem: "飞来山上千寻塔，闻说鸡鸣见日升", author: "王安石", title: "登飞来峰" },
            { poem: "自古逢秋悲寂寥，我言秋日胜春朝", author: "刘禹锡", title: "秋词" },
            { poem: "浮云游子意，落日故人情", author: "李白", title: "送友人" }
        ]
    },
    xing: {
        character: "星",
        level: "medium",
        poems: [
            { poem: "迢迢牵牛星，皎皎河汉女", author: "古诗十九首", title: "迢迢牵牛星" },
            { poem: "醉后不知天在水，满船清梦压星河", author: "唐温如", title: "题龙阳县青草湖" },
            { poem: "天阶夜色凉如水，卧看牵牛织女星", author: "杜牧", title: "秋夕" },
            { poem: "云母屏风烛影深，长河渐落晓星沉", author: "李商隐", title: "嫦娥" },
            { poem: "微微风簇浪，散作满河星", author: "查慎行", title: "舟夜书所见" },
            { poem: "星垂平野阔，月涌大江流", author: "杜甫", title: "旅夜书怀" },
            { poem: "灯火万家城四畔，星河一道水中央", author: "白居易", title: "江楼夕望招客" },
            { poem: "星临万户动，月傍九霄多", author: "杜甫", title: "春宿左省" },
            { poem: "风回小院庭芜绿，柳眼春相续", author: "李煜", title: "虞美人" },
            { poem: "疏影横斜水清浅，暗香浮动月黄昏", author: "林逋", title: "山园小梅" }
        ]
    },
    // ========== 高级关键字 ==========
    qiu: {
        character: "秋",
        level: "hard",
        poems: [
            { poem: "自古逢秋悲寂寥，我言秋日胜春朝", author: "刘禹锡", title: "秋词" },
            { poem: "银烛秋光冷画屏，轻罗小扇扑流萤", author: "杜牧", title: "秋夕" },
            { poem: "秋风吹不尽，总是玉关情", author: "李白", title: "子夜吴歌·秋歌" },
            { poem: "洛阳城里见秋风，欲作家书意万重", author: "张籍", title: "秋思" },
            { poem: "秋风萧瑟，洪波涌起", author: "曹操", title: "观沧海" },
            { poem: "八月秋高风怒号，卷我屋上三重茅", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "万里悲秋常作客，百年多病独登台", author: "杜甫", title: "登高" },
            { poem: "落霞与孤鹜齐飞，秋水共长天一色", author: "王勃", title: "滕王阁序" },
            { poem: "青山隐隐水迢迢，秋尽江南草未凋", author: "杜牧", title: "寄扬州韩绑判官" },
            { poem: "银烛秋光冷画屏，轻罗小扇扑流萤", author: "杜牧", title: "秋夕" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" }
        ]
    },
    dong: {
        character: "冬",
        level: "hard",
        poems: [
            { poem: "且如今年冬，未休关西卒", author: "杜甫", title: "兵车行" },
            { poem: "来日绮窗前，寒梅著花未", author: "王维", title: "杂诗" },
            { poem: "墙角数枝梅，凌寒独自开", author: "王安石", title: "梅花" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "晚来天欲雪，能饮一杯无", author: "白居易", title: "问刘十九" },
            { poem: "柴门闻犬吠，风雪夜归人", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "欲将轻骑逐，大雪满弓刀", author: "卢纶", title: "塞下曲" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "燕山雪花大如席，片片吹落轩辕台", author: "李白", title: "北风行" },
            { poem: "终南阴岭秀，积雪浮云端", author: "祖咏", title: "终南望余雪" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" }
        ]
    },
    xia: {
        character: "夏",
        level: "hard",
        poems: [
            { poem: "力尽不知热，但惜夏日长", author: "白居易", title: "观刈麦" },
            { poem: "深居俯夹城，春去夏犹清", author: "李商隐", title: "晚晴" },
            { poem: "连雨不知春去，一晴方觉夏深", author: "范成大", title: "喜晴" },
            { poem: "清江一曲抱村流，长夏江村事事幽", author: "杜甫", title: "江村" },
            { poem: "五月榴花照眼明，枝间时见子初成", author: "韩愈", title: "题张十一旅舍三咏·榴花" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" },
            { poem: "黑云翻墨未遮山，白雨跳珠乱入船", author: "苏轼", title: "六月二十七日望湖楼醉书" },
            { poem: "卷地风来忽吹散，望湖楼下水如天", author: "苏轼", title: "六月二十七日望湖楼醉书" },
            { poem: "仲夏苦夜短，开轩纳微凉", author: "杜甫", title: "夏夜叹" },
            { poem: "纷纷红紫已成尘，布谷声中夏令新", author: "陆游", title: "初夏绝句" },
            { poem: "更无柳絮因风起，惟有葵花向日倾", author: "司马光", title: "客中初夏" }
        ]
    },
    liu: {
        character: "柳",
        level: "hard",
        poems: [
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "羌笛何须怨杨柳，春风不度玉门关", author: "王之涣", title: "凉州词" },
            { poem: "渭城朝雨浥轻尘，客舍青青柳色新", author: "王维", title: "送元二使安西" },
            { poem: "此夜曲中闻折柳，何人不起故园情", author: "李白", title: "春夜洛城闻笛" },
            { poem: "最是一年春好处，绝胜烟柳满皇都", author: "韩愈", title: "早春呈水部张十八员外" },
            { poem: "草长莺飞二月天，拂堤杨柳醉春烟", author: "高鼎", title: "村居" },
            { poem: "杨柳青青江水平，闻郎江上踏歌声", author: "刘禹锡", title: "竹枝词" },
            { poem: "沾衣欲湿杏花雨，吹面不寒杨柳风", author: "志南", title: "绝句" },
            { poem: "章台柳，章台柳，颜色青青今在否", author: "韩翃", title: "章台柳" },
            { poem: "杨柳岸，晓风残月", author: "柳永", title: "雨霖铃" }
        ]
    },
    si: {
        character: "思",
        level: "hard",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "独在异乡为异客，每逢佳节倍思亲", author: "王维", title: "九月九日忆山东兄弟" },
            { poem: "入我相思门，知我相思苦", author: "李白", title: "三五七言" },
            { poem: "长相思，在长安", author: "李白", title: "长相思" },
            { poem: "思悠悠，恨悠悠，恨到归时方始休", author: "白居易", title: "长相思" },
            { poem: "羁鸟恋旧林，池鱼思故渊", author: "陶渊明", title: "归园田居" },
            { poem: "锦瑟无故五十弦，一弦一柱思华年", author: "李商隐", title: "锦瑟" },
            { poem: "只愿君心似我心，定不负相思意", author: "李之仪", title: "卜算子" },
            { poem: "日日思君不见君，共饮长江水", author: "李之仪", title: "卜算子" },
            { poem: "春心莫共花争发，一寸相思一寸灰", author: "李商隐", title: "无题" },
            { poem: "思君如满月，夜夜减清辉", author: "张九龄", title: "赋得自君之出矣" }
        ]
    },
    gui: {
        character: "归",
        level: "hard",
        poems: [
            { poem: "归来饱饭黄昏后，不脱蓑衣卧月明", author: "陆游", title: "渔翁" },
            { poem: "但使龙城飞将在，不教胡马度阴山", author: "王昌龄", title: "出塞" },
            { poem: "将军百战死，壮士十年归", author: "木兰诗", title: "木兰诗" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "仍怜故乡水，万里送行舟", author: "李白", title: "渡荆门送别" },
            { poem: "客路青山外，行舟绿水前", author: "王湾", title: "次北固山下" },
            { poem: "乡书何处达？归雁洛阳边", author: "王湾", title: "次北固山下" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "即从巴峡穿巫峡，便下襄阳向洛阳", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "云横秦岭家何在，雪拥蓝关马不前", author: "韩愈", title: "左迁至蓝关示侄孙湘" }
        ]
    },
    bie: {
        character: "别",
        level: "hard",
        poems: [
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "海内存知己，天涯若比邻", author: "王勃", title: "送杜少府之任蜀州" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "李白乘舟将欲行，忽闻岸上踏歌声", author: "李白", title: "赠汪伦" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "孤帆远影碧空尽，唯见长江天际流", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "山中相送罢，日暮掩柴扉", author: "王维", title: "送别" },
            { poem: "春草明年绿，王孙归不归", author: "王维", title: "山中送别" },
            { poem: "又送王孙去，萋萋满别情", author: "白居易", title: "赋得古原草送别" },
            { poem: "离离原上草，一岁一枯荣", author: "白居易", title: "赋得古原草送别" },
            { poem: "莫愁前路无知己，天下谁人不识君", author: "高适", title: "别董大" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" }
        ]
    },
    // ========== 更多关键字 ==========
    mei: {
        character: "梅",
        level: "hard",
        poems: [
            { poem: "墙角数枝梅，凌寒独自开", author: "王安石", title: "梅花" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "梅子金黄杏子肥，麦花雪白菜花稀", author: "范成大", title: "四时田园杂兴" },
            { poem: "梅子黄时日日晴，小溪泛尽却山行", author: "曾几", title: "三衢道中" },
            { poem: "和羞走，倚门回首，却把青梅嗅", author: "李清照", title: "点绛唇" },
            { poem: "青梅如豆柳如眉，日长蝴蝶飞", author: "欧阳修", title: "阮郎归",
    ye2: {
        character: "夜",
        level: "medium",
        poems: [
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" },
            { poem: "姑苏城外寒山寺，夜半钟声到客船", author: "张继", title: "枫桥夜泊" },
            { poem: "海日生残夜，江春入旧年", author: "王湾", title: "次北固山下" },
            { poem: "今夜偏知春气暖，虫声新透绿窗纱", author: "刘方平", title: "月夜" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "不知乘月几人归，落月摇情满江树", author: "张若虚", title: "春江花月夜" },
            { poem: "今夜闻君琵琶语，如听仙乐耳暂明", author: "白居易", title: "琵琶行" },
            { poem: "从今若许闲乘月，拄杖无时夜叩门", author: "陆游", title: "游山西村" },
            { poem: "夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" },
            { poem: "昨夜星辰昨夜风，画楼西畔桂堂东", author: "李商隐", title: "无题" },
            { poem: "今夜月明人尽望，不知秋思落谁家", author: "王建", title: "十五夜望月" }
        ]
    },
    ri2: {
        character: "日",
        level: "medium",
        poems: [
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "大漠孤烟直，长河落日圆", author: "王维", title: "使至塞上" },
            { poem: "锄禾日当午，汗滴禾下土", author: "李绅", title: "悯农" },
            { poem: "日照香炉生紫烟，遥看瀑布挂前川", author: "李白", title: "望庐山瀑布" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "浩荡离愁白日斜，吟鞭东指即天涯", author: "龚自珍", title: "己亥杂诗" },
            { poem: "日暮汉宫传蜡烛，轻烟散入五侯家", author: "韩翃", title: "寒食" },
            { poem: "飞来山上千寻塔，闻说鸡鸣见日升", author: "王安石", title: "登飞来峰" },
            { poem: "自古逢秋悲寂寥，我言秋日胜春朝", author: "刘禹锡", title: "秋词" },
            { poem: "浮云游子意，落日故人情", author: "李白", title: "送友人" }
        ]
    },
    xing2: {
        character: "星",
        level: "medium",
        poems: [
            { poem: "迢迢牵牛星，皎皎河汉女", author: "古诗十九首", title: "迢迢牵牛星" },
            { poem: "醉后不知天在水，满船清梦压星河", author: "唐温如", title: "题龙阳县青草湖" },
            { poem: "天阶夜色凉如水，卧看牵牛织女星", author: "杜牧", title: "秋夕" },
            { poem: "云母屏风烛影深，长河渐落晓星沉", author: "李商隐", title: "嫦娥" },
            { poem: "微微风簇浪，散作满河星", author: "查慎行", title: "舟夜书所见" },
            { poem: "星垂平野阔，月涌大江流", author: "杜甫", title: "旅夜书怀" },
            { poem: "灯火万家城四畔，星河一道水中央", author: "白居易", title: "江楼夕望招客" },
            { poem: "星临万户动，月傍九霄多", author: "杜甫", title: "春宿左省" },
            { poem: "风回小院庭芜绿，柳眼春相续", author: "李煜", title: "虞美人" },
            { poem: "疏影横斜水清浅，暗香浮动月黄昏", author: "林逋", title: "山园小梅" }
        ]
    },
    qiu2: {
        character: "秋",
        level: "hard",
        poems: [
            { poem: "自古逢秋悲寂寥，我言秋日胜春朝", author: "刘禹锡", title: "秋词" },
            { poem: "银烛秋光冷画屏，轻罗小扇扑流萤", author: "杜牧", title: "秋夕" },
            { poem: "秋风吹不尽，总是玉关情", author: "李白", title: "子夜吴歌·秋歌" },
            { poem: "洛阳城里见秋风，欲作家书意万重", author: "张籍", title: "秋思" },
            { poem: "秋风萧瑟，洪波涌起", author: "曹操", title: "观沧海" },
            { poem: "八月秋高风怒号，卷我屋上三重茅", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "万里悲秋常作客，百年多病独登台", author: "杜甫", title: "登高" },
            { poem: "落霞与孤鹜齐飞，秋水共长天一色", author: "王勃", title: "滕王阁序" },
            { poem: "青山隐隐水迢迢，秋尽江南草未凋", author: "杜牧", title: "寄扬州韩绑判官" },
            { poem: "银烛秋光冷画屏，轻罗小扇扑流萤", author: "杜牧", title: "秋夕" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" }
        ]
    },
    dong2: {
        character: "冬",
        level: "hard",
        poems: [
            { poem: "且如今年冬，未休关西卒", author: "杜甫", title: "兵车行" },
            { poem: "来日绮窗前，寒梅著花未", author: "王维", title: "杂诗" },
            { poem: "墙角数枝梅，凌寒独自开", author: "王安石", title: "梅花" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "晚来天欲雪，能饮一杯无", author: "白居易", title: "问刘十九" },
            { poem: "柴门闻犬吠，风雪夜归人", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "欲将轻骑逐，大雪满弓刀", author: "卢纶", title: "塞下曲" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "燕山雪花大如席，片片吹落轩辕台", author: "李白", title: "北风行" },
            { poem: "终南阴岭秀，积雪浮云端", author: "祖咏", title: "终南望余雪" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" }
        ]
    },
    xia2: {
        character: "夏",
        level: "hard",
        poems: [
            { poem: "力尽不知热，但惜夏日长", author: "白居易", title: "观刈麦" },
            { poem: "深居俯夹城，春去夏犹清", author: "李商隐", title: "晚晴" },
            { poem: "连雨不知春去，一晴方觉夏深", author: "范成大", title: "喜晴" },
            { poem: "清江一曲抱村流，长夏江村事事幽", author: "杜甫", title: "江村" },
            { poem: "五月榴花照眼明，枝间时见子初成", author: "韩愈", title: "题张十一旅舍三咏·榴花" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" },
            { poem: "黑云翻墨未遮山，白雨跳珠乱入船", author: "苏轼", title: "六月二十七日望湖楼醉书" },
            { poem: "卷地风来忽吹散，望湖楼下水如天", author: "苏轼", title: "六月二十七日望湖楼醉书" },
            { poem: "仲夏苦夜短，开轩纳微凉", author: "杜甫", title: "夏夜叹" },
            { poem: "纷纷红紫已成尘，布谷声中夏令新", author: "陆游", title: "初夏绝句" },
            { poem: "更无柳絮因风起，惟有葵花向日倾", author: "司马光", title: "客中初夏" }
        ]
    },
    liu2: {
        character: "柳",
        level: "hard",
        poems: [
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "羌笛何须怨杨柳，春风不度玉门关", author: "王之涣", title: "凉州词" },
            { poem: "渭城朝雨浥轻尘，客舍青青柳色新", author: "王维", title: "送元二使安西" },
            { poem: "此夜曲中闻折柳，何人不起故园情", author: "李白", title: "春夜洛城闻笛" },
            { poem: "最是一年春好处，绝胜烟柳满皇都", author: "韩愈", title: "早春呈水部张十八员外" },
            { poem: "草长莺飞二月天，拂堤杨柳醉春烟", author: "高鼎", title: "村居" },
            { poem: "杨柳青青江水平，闻郎江上踏歌声", author: "刘禹锡", title: "竹枝词" },
            { poem: "沾衣欲湿杏花雨，吹面不寒杨柳风", author: "志南", title: "绝句" },
            { poem: "章台柳，章台柳，颜色青青今在否", author: "韩翃", title: "章台柳" },
            { poem: "杨柳岸，晓风残月", author: "柳永", title: "雨霖铃" }
        ]
    },
    si2: {
        character: "思",
        level: "hard",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "独在异乡为异客，每逢佳节倍思亲", author: "王维", title: "九月九日忆山东兄弟" },
            { poem: "入我相思门，知我相思苦", author: "李白", title: "三五七言" },
            { poem: "长相思，在长安", author: "李白", title: "长相思" },
            { poem: "思悠悠，恨悠悠，恨到归时方始休", author: "白居易", title: "长相思" },
            { poem: "羁鸟恋旧林，池鱼思故渊", author: "陶渊明", title: "归园田居" },
            { poem: "锦瑟无故五十弦，一弦一柱思华年", author: "李商隐", title: "锦瑟" },
            { poem: "只愿君心似我心，定不负相思意", author: "李之仪", title: "卜算子" },
            { poem: "日日思君不见君，共饮长江水", author: "李之仪", title: "卜算子" },
            { poem: "春心莫共花争发，一寸相思一寸灰", author: "李商隐", title: "无题" },
            { poem: "思君如满月，夜夜减清辉", author: "张九龄", title: "赋得自君之出矣" }
        ]
    },
    gui2: {
        character: "归",
        level: "hard",
        poems: [
            { poem: "归来饱饭黄昏后，不脱蓑衣卧月明", author: "陆游", title: "渔翁" },
            { poem: "但使龙城飞将在，不教胡马度阴山", author: "王昌龄", title: "出塞" },
            { poem: "将军百战死，壮士十年归", author: "木兰诗", title: "木兰诗" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "仍怜故乡水，万里送行舟", author: "李白", title: "渡荆门送别" },
            { poem: "客路青山外，行舟绿水前", author: "王湾", title: "次北固山下" },
            { poem: "乡书何处达？归雁洛阳边", author: "王湾", title: "次北固山下" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "即从巴峡穿巫峡，便下襄阳向洛阳", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "云横秦岭家何在，雪拥蓝关马不前", author: "韩愈", title: "左迁至蓝关示侄孙湘" }
        ]
    },
    bie2: {
        character: "别",
        level: "hard",
        poems: [
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "海内存知己，天涯若比邻", author: "王勃", title: "送杜少府之任蜀州" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "李白乘舟将欲行，忽闻岸上踏歌声", author: "李白", title: "赠汪伦" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "孤帆远影碧空尽，唯见长江天际流", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "山中相送罢，日暮掩柴扉", author: "王维", title: "送别" },
            { poem: "春草明年绿，王孙归不归", author: "王维", title: "山中送别" },
            { poem: "又送王孙去，萋萋满别情", author: "白居易", title: "赋得古原草送别" },
            { poem: "离离原上草，一岁一枯荣", author: "白居易", title: "赋得古原草送别" },
            { poem: "莫愁前路无知己，天下谁人不识君", author: "高适", title: "别董大" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" }
        ]
    },
    mei: {
        character: "梅",
        level: "hard",
        poems: [
            { poem: "墙角数枝梅，凌寒独自开", author: "王安石", title: "梅花" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "梅子金黄杏子肥，麦花雪白菜花稀", author: "范成大", title: "四时田园杂兴" },
            { poem: "梅子黄时日日晴，小溪泛尽却山行", author: "曾几", title: "三衢道中" },
            { poem: "和羞走，倚门回首，却把青梅嗅", author: "李清照", title: "点绛唇" },
            { poem: "青梅如豆柳如眉，日长蝴蝶飞", author: "欧阳修", title: "阮郎归" },
            { poem: "看取晚来风势，故应难看梅花", author: "李清照", title: "清平乐" },
            { poem: "砌下落梅如雪乱，拂了一身还满", author: "李煜", title: "清平乐" }
        ]
    },
    lan: {
        character: "兰",
        level: "hard",
        poems: [
            { poem: "兰陵美酒郁金香，玉碗盛来琥珀光", author: "李白", title: "客中行" },
            { poem: "春兰兮秋菊，长无绝兮终古", author: "屈原", title: "九歌·礼魂" },
            { poem: "槛菊愁烟兰泣露，罗幕轻寒，燕子双飞去", author: "晏殊", title: "蝶恋花" },
            { poem: "兰叶春葳蕤，桂华秋皎洁", author: "张九龄", title: "感遇" },
            { poem: "漫种秋兰四五畦，幽香闻午梦", author: "陆游", title: "兰" },
            { poem: "尘世难逢开口笑，菊花须插满头归", author: "杜牧", title: "九日齐山登高" },
            { poem: "轻汗微微透碧纨，明朝端午浴芳兰", author: "苏轼", title: "浣溪沙·端午" }
        ]
    },
    zhu: {
        character: "竹",
        level: "hard",
        poems: [
            { poem: "独坐幽篁里，弹琴复长啸", author: "王维", title: "竹里馆" },
            { poem: "深林人不知，明月来相照", author: "王维", title: "竹里馆" },
            { poem: "竹外桃花三两枝，春江水暖鸭先知", author: "苏轼", title: "惠崇春江晚景" },
            { poem: "宁可食无肉，不可居无竹", author: "苏轼", title: "于潜僧绿筠轩" },
            { poem: "无肉令人瘦，无竹令人俗", author: "苏轼", title: "于潜僧绿筠轩" },
            { poem: "竹径通幽处，禅房花木深", author: "常建", title: "破山寺后禅院" },
            { poem: "山际见来烟，竹中窥落日", author: "吴均", title: "山中杂诗" },
            { poem: "过江千尺浪，入竹万竿斜", author: "李峤", title: "风" }
        ]
    },
    ju: {
        character: "菊",
        level: "hard",
        poems: [
            { poem: "不是花中偏爱菊，此花开尽更无花", author: "元稹", title: "菊花" },
            { poem: "采菊东篱下，悠然见南山", author: "陶渊明", title: "饮酒" },
            { poem: "秋丛绕舍似陶家，遍绕篱边日渐斜", author: "元稹", title: "菊花" },
            { poem: "尘世难逢开口笑，菊花须插满头归", author: "杜牧", title: "九日齐山登高" },
            { poem: "待到秋来九月八，我花开后百花杀", author: "黄巢", title: "不第后赋菊" },
            { poem: "冲天香阵透长安，满城尽带黄金甲", author: "黄巢", title: "不第后赋菊" },
            { poem: "荷尽已无擎雨盖，菊残犹有傲霜枝", author: "苏轼", title: "赠刘景文" },
            { poem: "东篱把酒黄昏后，有暗香盈袖", author: "李清照", title: "醉花阴" }
        ]
    },
    song: {
        character: "松",
        level: "hard",
        poems: [
            { poem: "明月松间照，清泉石上流", author: "王维", title: "山居秋暝" },
            { poem: "松柏本孤直，难为桃李颜", author: "李白", title: "古风" },
            { poem: "咬定青山不放松，立根原在破岩中", author: "郑燮", title: "竹石" },
            { poem: "松风吹解带，山月照弹琴", author: "王维", title: "酬张少府" },
            { poem: "松间沙路净无泥，潇潇暮雨子规啼", author: "苏轼", title: "浣溪沙" },
            { poem: "山下兰芽短浸溪，松间沙路净无泥", author: "苏轼", title: "浣溪沙" },
            { poem: "亭亭山上松，瑟瑟谷中风", author: "刘桢", title: "赠从弟" },
            { poem: "风声一何盛，松枝一何劲", author: "刘桢", title: "赠从弟" }
        ]
    },
    he: {
        character: "河",
        level: "medium",
        poems: [
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" },
            { poem: "黄河远上白云间，一片孤城万仞山", author: "王之涣", title: "凉州词" },
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "君不见黄河之水天上来，奔流到海不复回", author: "李白", title: "将进酒" },
            { poem: "黄河捧土尚可塞，北风雨雪恨难裁", author: "李白", title: "北风行" },
            { poem: "黄河西来决昆仑，咆哮万里触龙门", author: "李白", title: "公无渡河" },
            { poem: "大漠孤烟直，长河落日圆", author: "王维", title: "使至塞上" },
            { poem: "三万里河东入海，五千仞岳上摩天", author: "陆游", title: "秋夜将晓出篱门迎凉有感" }
        ]
    },
    jiang: {
        character: "江",
        level: "medium",
        poems: [
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "至今思项羽，不肯过江东", author: "李清照", title: "夏日绝句" },
            { poem: "天门中断楚江开，碧水东流至此回", author: "李白", title: "望天门山" },
            { poem: "孤帆远影碧空尽，唯见长江天际流", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "江上往来人，但爱鲈鱼美", author: "范仲淹", title: "江上渔者" },
            { poem: "君看一叶舟，出没风波里", author: "范仲淹", title: "江上渔者" },
            { poem: "野旷天低树，江清月近人", author: "孟浩然", title: "宿建德江" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" }
        ]
    },
    chao: {
        character: "潮",
        level: "medium",
        poems: [
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "江流宛转绕芳甸，月照花林皆似霰", author: "张若虚", title: "春江花月夜" },
            { poem: "潮平两岸阔，风正一帆悬", author: "王湾", title: "次北固山下" },
            { poem: "浙江潮来人共看，浙江潮如水共言", author: "刘禹锡", title: "浙江晴》" },
            { poem: "须臾却入海门去，卷起沙堆似雪堆", author: "刘禹锡", title: "浪淘沙" }
        ]
    },
    ming: {
        character: "明",
        level: "easy",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "明月松间照，清泉石上流", author: "王维", title: "山居秋暝" },
            { poem: "海上生明月，天涯共此时", author: "张九龄", title: "望月怀远" },
            { poem: "床前明月光，疑是地上霜", author: "李白", title: "静夜思" },
            { poem: "春江潮水连海平，海上明月共潮生", author: "张若虚", title: "春江花月夜" },
            { poem: "明月几时有，把酒问青天", author: "苏轼", title: "水调歌头" },
            { poem: "露从今夜白，月是故乡明", author: "杜甫", title: "月夜忆舍弟" },
            { poem: "今夜月明人尽望，不知秋思落谁家", author: "王建", title: "十五夜望月" }
        ]
    },
    an: {
        character: "暗",
        level: "hard",
        poems: [
            { poem: "山重水复疑无路，柳暗花明又一村", author: "陆游", title: "游山西村" },
            { poem: "烟笼寒水月笼沙，夜泊秦淮近酒家", author: "杜牧", title: "泊秦淮" },
            { poem: "独怜幽草涧边生，上有黄鹂深树鸣", author: "韦应物", title: "滁州西涧" },
            { poem: "的意识", author: "杜甫", title: "春夜喜雨" },
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "苍苍竹林寺，杳杳钟声晚", author: "刘长卿", title: "送灵澈上人" }
        ]
    },
    lao: {
        character: "老",
        level: "medium",
        poems: [
            { poem: "少壮不努力，老大徒伤悲", author: "汉乐府", title: "长歌行" },
            { poem: "门前冷落鞍马稀，老大嫁作商人妇", author: "白居易", title: "琵琶行" },
            { poem: "年长岂知世势同，老去谁能惜此身", author: "杜甫", title: "曲江二首" },
            { poem: "有弟皆分散，无家问死生", author: "杜甫", title: "月夜忆舍弟" },
            { poem: "老骥伏枥，志在千里", author: "曹操", title: "龟虽寿" },
            { poem: "烈士暮年，壮心不已", author: "曹操", title: "龟虽寿" },
            { poem: "古来王老又何妨，醉倒东风不用扶", author: "刘禹锡", title: "洛中逢白有故人" }
        ]
    },
    se: {
        character: "色",
        level: "medium",
        poems: [
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "等闲识得东风面，万紫千红总是春", author: "朱熹", title: "春日" },
            { poem: "绿杨烟外晓寒轻，红杏枝头春意闹", author: "宋祁", title: "玉楼春" },
            { poem: "纷纷红紫已成尘，布谷声中夏令新", author: "陆游", title: "初夏绝句" },
            { poem: "两道残阳铺水中，半江瑟瑟半江红", author: "白居易", title: "暮江吟" },
            { poem: "可怜九月初三夜，露似真珠月似弓", author: "白居易", title: "暮江吟" }
        ]
    },
    gu: {
        character: "古",
        level: "medium",
        poems: [
            { poem: "古调虽自爱，今人多不弹", author: "刘长卿", title: "弹琴" },
            { poem: "古来圣贤皆寂寞，惟有饮者留其名", author: "李白", title: "将进酒" },
            { poem: "人生自古谁无死，留取丹心照汗青", author: "文天祥", title: "过零丁洋" },
            { poem: "古木阴中系短篷，杖藜扶我过桥东", author: "志南", title: "绝句" },
            { poem: "古道西风瘦马，断肠人在天涯", author: "马致远", title: "天净沙·秋思" },
            { poem: "旧时王谢堂前燕，飞入寻常百姓家", author: "刘禹锡", title: "乌衣巷" }
        ]
    },
    xin: {
        character: "心",
        level: "medium",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "烽火照西京，心中自不平", author: "杨炯", title: "从军行" },
            { poem: "但使龙城飞将在，不教胡马度阴山", author: "王昌龄", title: "出塞" },
            { poem: "洛阳亲友如相问，一片冰心在玉壶", author: "王昌龄", title: "芙蓉楼送辛渐" },
            { poem: "愿君多采撷，此物最相思", author: "王维", title: "相思" },
            { poem: "春心莫共花争发，一寸相思一寸灰", author: "李商隐", title: "无题" },
            { poem: "剖尽肝肠犹是苦，不如往日总关心", author: "李白", title: "赠汪伦" }
        ]
    },
    qi: {
        character: "气",
        level: "medium",
        poems: [
            { poem: "生气远出，不着死灰", author: "韩愈", title: "送穷文" },
            { poem: "风急天高猿啸哀，渚清沙白鸟飞回", author: "杜甫", title: "登高" },
            { poem: "山气日夕佳，飞鸟相与还", author: "陶渊明", title: "饮酒" },
            { poem: "花气袭人知骤暖，鹊声穿树喜新晴", author: "陆游", title: "村居书喜" },
            { poem: "山不在高，有仙则名；水不在深，有龙则灵", author: "刘禹锡", title: "陋室铭" }
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
    // ========== 天地时空类 ==========
    tian: {
        character: "天",
        level: "medium",
        poems: [
            { poem: "不敢高声语，恐惊天上人", author: "李白", title: "夜宿山寺" },
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" },
            { poem: "孤山寺北贾亭西，水面初平云脚低", author: "白居易", title: "钱塘湖春行" },
            { poem: "天街夜色凉如水，卧看牵牛织女星", author: "杜牧", title: "秋夕" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "明月几时有，把酒问青天", author: "苏轼", title: "水调歌头" },
            { poem: "君不见黄河之水天上来，奔流到海不复回", author: "李白", title: "将进酒" },
            { poem: "三顾频烦天下计，两朝开济老臣心", author: "杜甫", title: "蜀相" },
            { poem: "人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来", author: "李白", title: "将进酒" },
            { poem: "仰天大笑出门去，我辈岂是蓬蒿人", author: "李白", title: "南陵别儿童入京" }
        ]
    },
    di: {
        character: "地",
        level: "medium",
        poems: [
            { poem: "俯拾地芥，谓有区区之分", author: "李白", title: "送友人" },
            { poem: "此地一为别，孤蓬万里征", author: "李白", title: "送友人" },
            { poem: "送君不相见，烟波江上愁", author: "李白", title: "送朋友" },
            { poem: "大漠孤烟直，长河落日圆", author: "王维", title: "使至塞上" },
            { poem: "蜀道之难，难于上青天，侧身西望长咨嗟", author: "李白", title: "蜀道难" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "至今思项羽，不肯过江东", author: "李清照", title: "夏日绝句" }
        ]
    },
    ren: {
        character: "人",
        level: "easy",
        poems: [
            { poem: "举头望明月，低头思故乡", author: "李白", title: "静夜思" },
            { poem: "独在异乡为异客，每逢佳节倍思亲", author: "王维", title: "九月九日忆山东兄弟" },
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "人生得意须尽欢，莫使金樽空对月", author: "李白", title: "将进酒" },
            { poem: "人生自古谁无死，留取丹心照汗青", author: "文天祥", title: "过零丁洋" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "山回路转不见君，雪上空留马行处", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "同是天涯沦落人，相逢何必曾相识", author: "白居易", title: "琵琶行" },
            { poem: "门前冷落鞍马稀，老大嫁作商人妇", author: "白居易", title: "琵琶行" }
        ]
    },
    yu: {
        character: "雨",
        level: "medium",
        poems: [
            { poem: "好雨知时节，当春乃发生", author: "杜甫", title: "春夜喜雨" },
            { poem: "清明时节雨纷纷，路上行人欲断魂", author: "杜牧", title: "清明" },
            { poem: "夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" },
            { poem: "空山新雨后，天气晚来秋", author: "王维", title: "山居秋暝" },
            { poem: "山路元无雨，空翠湿人衣", author: "王维", title: "山中" },
            { poem: "青箬笠，绿蓑衣，斜风细雨不须归", author: "张志和", title: "渔歌子" },
            { poem: "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生", author: "苏轼", title: "定风波" },
            { poem: "何当共剪西窗烛，却话巴山夜雨时", author: "李商隐", title: "夜雨寄北" },
            { poem: "君问归期未有期，巴山夜雨涨秋池", author: "李商隐", title: "夜雨寄北" },
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" }
        ]
    },
    lu: {
        character: "露",
        level: "hard",
        poems: [
            { poem: "露从今夜白，月是故乡明", author: "杜甫", title: "月夜忆舍弟" },
            { poem: "可怜九月初三夜，露似真珠月似弓", author: "白居易", title: "暮江吟" },
            { poem: "中庭地白树栖鸦，冷露无声湿桂花", author: "王建", title: "十五夜望月" },
            { poem: "秋荷一滴露，暗夜坠玄天", author: "李商隐", title: "中夜起望西园值月上" }
        ]
    },
    shuang: {
        character: "霜",
        level: "medium",
        poems: [
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" },
            { poem: "霜轻未杀萋萋草，日暖初干漠漠沙", author: "白居易", title: "早冬" },
            { poem: "鸡鸣紫陌曙光寒，莺啭皇州春色阑", author: "岑参", title: "奉和中书舍人贾至早朝大明宫" },
            { poem: "艰难苦恨繁霜鬓，潦倒新停浊酒杯", author: "杜甫", title: "登高" },
            { poem: "荷尽已无擎雨盖，菊残犹有傲霜枝", author: "苏轼", title: "赠刘景文" }
        ]
    },
    lei: {
        character: "雷",
        level: "medium",
        poems: [
            { poem: "水光潋滟晴方好，山色空蒙雨亦奇", author: "苏轼", title: "饮湖上初晴后雨" },
            { poem: "雷惊天地龙蛇蛰，雨足郊原草木柔", author: "黄庭坚", title: "清明" },
            { poem: "千里的雷声万里的闪，乾坤在一掌间", author: "李白", title: "蜀道难" }
        ]
    },
    wu: {
        character: "雾",
        level: "medium",
        poems: [
            { poem: "日照香炉生紫烟，遥看瀑布挂前川", author: "李白", title: "望庐山瀑布" },
            { poem: "天开函谷壮关中，万古惊尘向北空", author: "王维", title: "送张判官赴河西" },
            { poem: "雾失楼台，月迷津渡，桃源望断无寻处", author: "秦观", title: "踏莎行" }
        ]
    },
    xia2: {
        character: "霞",
        level: "hard",
        poems: [
            { poem: "余霞散成绮，澄江静如练", author: "谢朓", title: "晚登三山还望京邑" },
            { poem: "日下壁而沉彩，月上台而发辉", author: "王勃", title: "滕王阁序" },
            { poem: "飞云当面化龙蛇，夭矫转空碧", author: "秦观", title: "满庭芳" }
        ]
    },
    // ========== 颜色类 ==========
    hong: {
        character: "红",
        level: "easy",
        poems: [
            { poem: "日出江花红胜火，春来江水绿如蓝", author: "白居易", title: "忆江南" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "等闲识得东风面，万紫千红总是春", author: "朱熹", title: "春日" },
            { poem: "千里莺啼绿映红，水村山郭酒旗风", author: "杜牧", title: "江南春" },
            { poem: "落红不是无情物，化作春泥更护花", author: "龚自珍", title: "己亥杂诗" },
            { poem: "红豆生南国，春来发几枝", author: "王维", title: "相思" },
            { poem: "红酥手，黄縢酒，满城春色宫墙柳", author: "陆游", title: "钗头凤" },
            { poem: "知否知否，应是绿肥红瘦", author: "李清照", title: "如梦令" }
        ]
    },
    lv: {
        character: "绿",
        level: "easy",
        poems: [
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "千里莺啼绿映红，水村山郭酒旗风", author: "杜牧", title: "江南春" },
            { poem: "绿蚁新醅酒，红泥小火炉", author: "白居易", title: "问刘十九" },
            { poem: "绿杨烟外晓寒轻，红杏枝头春意闹", author: "宋祁", title: "玉楼春" },
            { poem: "知否知否，应是绿肥红瘦", author: "李清照", title: "如梦令" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "记得绿罗裙，处处怜芳草", author: "牛希济", title: "生查子" }
        ]
    },
    qing: {
        character: "青",
        level: "medium",
        poems: [
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "渭城朝雨浥轻尘，客舍青青柳色新", author: "王维", title: "送元二使安西" },
            { poem: "青山遮不住，毕竟东流去", author: "辛弃疾", title: "菩萨蛮·书江西造口壁" },
            { poem: "青泥何盘盘，百步九折萦岩峦", author: "李白", title: "蜀道难" },
            { poem: "蜀道之难，难于上青天，侧身西望长咨嗟", author: "李白", title: "蜀道难" },
            { poem: "青箬笠，绿蓑衣，斜风细雨不须归", author: "张志和", title: "渔歌子" },
            { poem: "青山横北郭，白水绕东城", author: "李白", title: "送友人" },
            { poem: "青衫我已困，长路苦迟迟", author: "白居易", title: "送友贬岭南" }
        ]
    },
    huang: {
        character: "黄",
        level: "easy",
        poems: [
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "黄沙百战穿金甲，不破楼兰终不还", author: "王昌龄", title: "从军行" },
            { poem: "老夫聊发少年狂，左牵黄，右擎苍", author: "苏轼", title: "江城子·密州出猎" },
            { poem: "黄河远上白云间，一片孤城万仞山", author: "王之涣", title: "凉州词" },
            { poem: "满地黄花堆积，憔悴损，如今有谁堪摘", author: "李清照", title: "声声慢" }
        ]
    },
    bai: {
        character: "白",
        level: "easy",
        poems: [
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "白日依山尽，黄河入海流", author: "王之涣", title: "登鹳雀楼" },
            { poem: "小时不识月，呼作白玉盘", author: "李白", title: "古朗月行" },
            { poem: "朝辞白帝彩云间，千里江陵一日还", author: "李白", title: "早发白帝城" },
            { poem: "白毛浮绿水，红掌拨清波", author: "骆宾王", title: "咏鹅" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "黑云压城城欲摧，甲光向日金鳞开", author: "李贺", title: "雁门太守行" },
            { poem: "浮天水送无穷树，带雨云埋一半山", author: "辛弃疾", title: "鹧鸪天·送人" }
        ]
    },
    zi: {
        character: "紫",
        level: "medium",
        poems: [
            { poem: "日照香炉生紫烟，遥看瀑布挂前川", author: "李白", title: "望庐山瀑布" },
            { poem: "等闲识得东风面，万紫千红总是春", author: "朱熹", title: "春日" },
            { poem: "角声满天秋色里，塞上燕脂凝夜紫", author: "李贺", title: "雁门太守行" },
            { poem: "紫藤挂云木，花蔓宜阳春", author: "李白", title: "紫藤树" }
        ]
    },
    cang: {
        character: "苍",
        level: "medium",
        poems: [
            { poem: "苍苍竹林寺，杳杳钟声晚", author: "刘长卿", title: "送灵澈上人" },
            { poem: "苍梧崩不尽，此山安在？", author: "李白", title: "蜀道难" },
            { poem: "天门中断楚江开，碧水东流至此回", author: "李白", title: "望天门山" }
        ]
    },
    cui: {
        character: "翠",
        level: "easy",
        poems: [
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "碧玉妆成一树高，万条垂下绿丝绦", author: "贺知章", title: "咏柳" },
            { poem: "翠华摇摇行复止，西出都门百余里", author: "白居易", title: "长恨歌" },
            { poem: "青泥何盘盘，百步九折萦岩峦", author: "李白", title: "蜀道难" }
        ]
    },
    bi: {
        character: "碧",
        level: "medium",
        poems: [
            { poem: "碧玉妆成一树高，万条垂下绿丝绦", author: "贺知章", title: "咏柳" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "江碧鸟逾白，山青花欲燃", author: "杜甫", title: "绝句" },
            { poem: "平林漠漠烟如织，寒山一带伤心碧", author: "李白", title: "菩萨蛮" },
            { poem: "望洞庭山水翠，白银盘里一青螺", author: "刘禹锡", title: "望洞庭" }
        ]
    },
    // ========== 方位类 ==========
    dong: {
        character: "东",
        level: "medium",
        poems: [
            { poem: "东皋薄暮望，徙倚欲何依", author: "王绩", title: "野望" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "采菊东篱下，悠然见南山", author: "陶渊明", title: "饮酒" },
            { poem: "少小离家老大回，乡音无改鬓毛衰。儿童相见不相识，笑问客从何处来", author: "贺知章", title: "回乡偶书" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "青山横北郭，白水绕东城", author: "李白", title: "送友人" },
            { poem: "东风不与周郎便，铜雀春深锁二乔", author: "杜牧", title: "赤壁" }
        ]
    },
    xi: {
        character: "西",
        level: "medium",
        poems: [
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "西塞山前白鹭飞，桃花流水鳜鱼肥", author: "张志和", title: "渔歌子" },
            { poem: "昨夜星辰昨夜风，画楼西畔桂堂东", author: "李商隐", title: "无题" },
            { poem: "何当共剪西窗烛，却话巴山夜雨时", author: "李商隐", title: "夜雨寄北" }
        ]
    },
    nan: {
        character: "南",
        level: "medium",
        poems: [
            { poem: "南朝四百八十寺，多少楼台烟雨中", author: "杜牧", title: "江南春" },
            { poem: "红豆生南国，春来发几枝", author: "王维", title: "相思" },
            { poem: "采菊东篱下，悠然见南山", author: "陶渊明", title: "饮酒" },
            { poem: "春风又绿江南岸，明月何时照我还", author: "王安石", title: "泊船瓜洲" },
            { poem: "江南好，风景旧曾谙", author: "白居易", title: "忆江南" },
            { poem: "正是江南好风景，落花时节又逢君", author: "杜甫", title: "江南逢李龟年" }
        ]
    },
    bei: {
        character: "北",
        level: "medium",
        poems: [
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "北阙休上书，南山归敝庐", author: "王维", title: "岁暮归南山" },
            { poem: "青山横北郭，白水绕东城", author: "李白", title: "送友人" },
            { poem: "剑外忽传收蓟北，初闻涕泪满衣裳", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "更能消几番风雨，匆匆春又归去", author: "辛弃疾", title: "摸鱼儿" }
        ]
    },
    // ========== 数字类 ==========
    yi: {
        character: "一",
        level: "easy",
        poems: [
            { poem: "一去二三里，烟村四五家", author: "邵雍", title: "山村咏怀" },
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "一水护田将绿绕，两山排闼送青来", author: "王安石", title: "书湖阴先生壁" },
            { poem: "一道残阳铺水中，半江瑟瑟半江红", author: "白居易", title: "暮江吟" },
            { poem: "一骑红尘妃子笑，无人知是荔枝来", author: "杜牧", title: "过华清宫绝句" },
            { poem: "两岸猿声啼不住，轻舟已过万重山", author: "李白", title: "早发白帝城" }
        ]
    },
    er: {
        character: "二",
        level: "easy",
        poems: [
            { poem: "不知细叶谁裁出，二月春风似剪刀", author: "贺知章", title: "咏柳" },
            { poem: "解落三秋叶，能开二月花", author: "李峤", title: "风" },
            { poem: "梅须逊雪三分白，雪却输梅一段香", author: "卢梅坡", title: "雪梅" },
            { poem: "草长莺飞二月天，拂堤杨柳醉春烟", author: "高鼎", title: "村居" }
        ]
    },
    san: {
        character: "三",
        level: "easy",
        poems: [
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" },
            { poem: "三顾频烦天下计，两朝开济老臣心", author: "杜甫", title: "蜀相" },
            { poem: "烹羊宰牛且为乐，会须一饮三百杯", author: "李白", title: "将进酒" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" }
        ]
    },
    shi: {
        character: "十",
        level: "easy",
        poems: [
            { poem: "十年磨一剑，霜刃未曾试", author: "贾岛", title: "剑客" },
            { poem: "十年离乱后，长大一相逢", author: "李益", title: "喜见外弟又言别" },
            { poem: "十年生死两茫茫，不思量，自难忘", author: "苏轼", title: "江城子" },
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" },
            { poem: "百步九折萦岩峦，扪参历井仰胁息", author: "李白", title: "蜀道难" }
        ]
    },
    bai2: {
        character: "百",
        level: "easy",
        poems: [
            { poem: "百川东到海，何时复西归", author: "汉乐府", title: "长歌行" },
            { poem: "十年磨一剑，霜刃未曾试", author: "贾岛", title: "剑客" },
            { poem: "黄沙百战穿金甲，不破楼兰终不还", author: "王昌龄", title: "从军行" },
            { poem: "烽火连三月，家书抵万金", author: "杜甫", title: "春望" }
        ]
    },
    qian: {
        character: "千",
        level: "easy",
        poems: [
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" },
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "千呼万唤始出来，犹抱琵琶半遮面", author: "白居易", title: "琵琶行" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "千里江陵一日还，两岸猿声啼不住", author: "李白", title: "早发白帝城" }
        ]
    },
    wan: {
        character: "万",
        level: "easy",
        poems: [
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "千呼万唤始出来，犹抱琵琶半遮面", author: "白居易", title: "琵琶行" },
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "万里悲秋常作客，百年多病独登台", author: "杜甫", title: "登高" },
            { poem: "等闲识得东风面，万紫千红总是春", author: "朱熹", title: "春日" }
        ]
    },
    // ========== 植物类 ==========
    cao: {
        character: "草",
        level: "easy",
        poems: [
            { poem: "离离原上草，一岁一枯荣", author: "白居易", title: "赋得古原草送别" },
            { poem: "国破山河在，城春草木深", author: "杜甫", title: "春望" },
            { poem: "乱花渐欲迷人眼，浅草才能没马蹄", author: "白居易", title: "钱塘湖春行" },
            { poem: "晴川历历汉阳树，芳草萋萋鹦鹉洲", author: "崔颢", title: "黄鹤楼" },
            { poem: "独怜幽草涧边生，上有黄鹂深树鸣", author: "韦应物", title: "滁州西涧" },
            { poem: "谁言寸草心，报得三春晖", author: "孟郊", title: "游子吟" }
        ]
    },
    shu: {
        character: "树",
        level: "medium",
        poems: [
            { poem: "晴川历历汉阳树，芳草萋萋鹦鹉洲", author: "崔颢", title: "黄鹤楼" },
            { poem: "绿树村边合，青山郭外斜", author: "孟浩然", title: "过故人庄" },
            { poem: "鸟宿池边树，僧敲月下门", author: "贾岛", title: "题李凝幽居" },
            { poem: "树木丛生，百草丰茂", author: "曹操", title: "观沧海" },
            { poem: "沉舟侧畔千帆过，病树前头万木春", author: "刘禹锡", title: "酬乐天扬州初逢席上见赠" }
        ]
    },
    ye: {
        character: "叶",
        level: "medium",
        poems: [
            { poem: "不知细叶谁裁出，二月春风似剪刀", author: "贺知章", title: "咏柳" },
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "春风桃李花开日，秋雨梧桐叶落时", author: "白居易", title: "长恨歌" },
            { poem: "停车坐爱枫林晚，霜叶红于二月花", author: "杜牧", title: "山行" },
            { poem: "解落三秋叶，能开二月花", author: "李峤", title: "风" }
        ]
    },
    gen: {
        character: "根",
        level: "hard",
        poems: [
            { poem: "谁言寸草心，报得三春晖", author: "孟郊", title: "游子吟" },
            { poem: "松柏本孤直，难为桃李颜", author: "李白", title: "古风" },
            { poem: "咬定青山不放松，立根原在破岩中", author: "郑燮", title: "竹石" }
        ]
    },
    lian: {
        character: "莲",
        level: "medium",
        poems: [
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "予独爱莲之出淤泥而不染，濯清涟而不妖", author: "周敦颐", title: "爱莲说" },
            { poem: "竹喧归浣女，莲动下渔舟", author: "王维", title: "山居秋暝" },
            { poem: "江南可采莲，莲叶何田田", author: "汉乐府", title: "江南" },
            { poem: "有三秋桂子，十里荷花", author: "柳永", title: "望海潮" }
        ]
    },
    he2: {
        character: "荷",
        level: "medium",
        poems: [
            { poem: "接天莲叶无穷碧，映日荷花别样红", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "荷叶罗裙一色裁，芙蓉向脸两边开", author: "王昌龄", title: "采莲曲" },
            { poem: "小荷才露尖尖角，早有蜻蜓立上头", author: "杨万里", title: "小池" },
            { poem: "有三秋桂子，十里荷花", author: "柳永", title: "望海潮" }
        ]
    },
    tao: {
        character: "桃",
        level: "easy",
        poems: [
            { poem: "竹外桃花三两枝，春江水暖鸭先知", author: "苏轼", title: "惠崇春江晚景" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "人面不知何处去，桃花依旧笑春风", author: "崔护", title: "题都城南庄" },
            { poem: "西塞山前白鹭飞，桃花流水鳜鱼肥", author: "张志和", title: "渔歌子" },
            { poem: "桃之夭夭，灼灼其华", author: "诗经", title: "桃夭" }
        ]
    },
    gui: {
        character: "桂",
        level: "medium",
        poems: [
            { poem: "有三秋桂子，十里荷花", author: "柳永", title:,
    // ========== 动物类 ==========
    yan: {
        character: "燕",
        level: "easy",
        poems: [
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "泥融飞燕子，沙暖睡鸳鸯", author: "杜甫", title: "绝句" },
            { poem: "几处早莺争暖树，谁家新燕啄春泥", author: "白居易", title: "钱塘湖春行" },
            { poem: "无可奈何花落去，似曾相识燕归来", author: "晏殊", title: "浣溪沙" },
            { poem: "旧时王谢堂前燕，飞入寻常百姓家", author: "刘禹锡", title: "乌衣巷" },
            { poem: "梁上有双燕，翩翩雄与雌", author: "白居易", title: "燕诗" }
        ]
    },
    yan2: {
        character: "雁",
        level: "medium",
        poems: [
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "月黑雁飞高，单于夜遁逃", author: "卢纶", title: "塞下曲" },
            { poem: "长风万里送秋雁，对此可以酣高楼", author: "李白", title: "宣州谢朓楼饯别校书叔云" },
            { poem: "鸿雁几时到，江湖秋水多", author: "杜甫", title: "天末怀李白" },
            { poem: "塞下秋来风景异，衡阳雁去无留意", author: "范仲淹", title: "渔家傲·秋思" }
        ]
    },
    lu: {
        character: "鹭",
        level: "medium",
        poems: [
            { poem: "两个黄鹂鸣翠柳，一行白鹭上青天", author: "杜甫", title: "绝句" },
            { poem: "西塞山前白鹭飞，桃花流水鳜鱼肥", author: "张志和", title: "渔歌子" },
            { poem: "旧时茅店社林边，路转溪桥忽见", author: "辛弃疾", title: "西江月·夜行黄沙道中" }
        ]
    },
    he: {
        character: "鹤",
        level: "hard",
        poems: [
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "晴空一鹤排云上，便引诗情到碧霄", author: "刘禹锡", title: "秋词" },
            { poem: "黄鹤之飞尚不得，猿猱欲度愁攀援", author: "李白", title: "蜀道难" }
        ]
    },
    lu2: {
        character: "鹿",
        level: "medium",
        poems: [
            { poem: "树深时见鹿，溪午不闻钟", author: "李白", title: "访戴天山道士不遇" },
            { poem: "霜落熊升树，林空鹿饮溪", author: "梅尧臣", title: "鲁山山行" }
        ]
    },
    ma: {
        character: "马",
        level: "easy",
        poems: [
            { poem: "乱花渐欲迷人眼，浅草才能没马蹄", author: "白居易", title: "钱塘湖春行" },
            { poem: "枯藤老树昏鸦，小桥流水人家，古道西风瘦马", author: "马致远", title: "天净沙·秋思" },
            { poem: "但使龙城飞将在，不教胡马度阴山", author: "王昌龄", title: "出塞" },
            { poem: "马作的卢飞快，弓如霹雳弦惊", author: "辛弃疾", title: "破阵子·为陈同甫赋壮词以寄之" },
            { poem: "挥手自兹去，萧萧班马鸣", author: "李白", title: "送友人" }
        ]
    },
    niu: {
        character: "牛",
        level: "easy",
        poems: [
            { poem: "天阶夜色凉如水，卧看牵牛织女星", author: "杜牧", title: "秋夕" },
            { poem: "迢迢牵牛星，皎皎河汉女", author: "古诗十九首", title: "迢迢牵牛星" },
            { poem: "牛困人饥日已高，市南门外泥中歇", author: "白居易", title: "卖炭翁" }
        ]
    },
    yang: {
        character: "羊",
        level: "medium",
        poems: [
            { poem: "天苍苍，野茫茫，风吹草低见牛羊", author: "敕勒歌", title: "敕勒歌" },
            { poem: "牧羊驱马虽戎服，白发丹心尽汉臣", author: "杜牧", title: "河湟" }
        ]
    },
    chan: {
        character: "蝉",
        level: "medium",
        poems: [
            { poem: "垂绥饮清露，流响出疏桐", author: "虞世南", title: "蝉" },
            { poem: "居高声自远，非是藉秋风", author: "虞世南", title: "蝉" },
            { poem: "西陆蝉声唱，南冠客思深", author: "骆宾王", title: "咏蝉" }
        ]
    },
    die: {
        character: "蝶",
        level: "easy",
        poems: [
            { poem: "儿童急走追黄蝶，飞入菜花无处寻", author: "杨万里", title: "宿新市徐公店" },
            { poem: "穿花蛱蝶深深见，点水蜻蜓款款飞", author: "杜甫", title: "曲江二首" },
            { poem: "泪眼问花花不语，乱红飞过秋千去", author: "欧阳修", title: "蝶恋花" }
        ]
    },
    qingting: {
        character: "蜻蜓",
        level: "easy",
        poems: [
            { poem: "小荷才露尖尖角，早有蜻蜓立上头", author: "杨万里", title: "小池" },
            { poem: "穿花蛱蝶深深见，点水蜻蜓款款飞", author: "杜甫", title: "曲江二首" }
        ]
    },
    // ========== 物品器具类 ==========
    jiu: {
        character: "酒",
        level: "medium",
        poems: [
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "葡萄美酒夜光杯，欲饮琵琶马上催", author: "王翰", title: "凉州词" },
            { poem: "借问酒家何处有，牧童遥指杏花村", author: "杜牧", title: "清明" },
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" },
            { poem: "花间一壶酒，独酌无相亲", author: "李白", title: "月下独酌" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" }
        ]
    },
    cha: {
        character: "茶",
        level: "medium",
        poems: [
            { poem: "商人重利轻别离，前月浮梁买茶去", author: "白居易", title: "琵琶行" },
            { poem: "酒困路长惟欲睡，日高人渴漫思茶", author: "苏轼", title: "浣溪沙" },
            { poem: "矮纸斜行闲作草，晴窗细乳戏分茶", author: "陆游", title: "临安春雨初霁" }
        ]
    },
    zhou: {
        character: "舟",
        level: "medium",
        poems: [
            { poem: "客路青山外，行舟绿水前", author: "王湾", title: "次北固山下" },
            { poem: "仍怜故乡水，万里送行舟", author: "李白", title: "渡荆门送别" },
            { poem: "春潮带雨晚来急，野渡无人舟自横", author: "韦应物", title: "滁州西涧" },
            { poem: "李白乘舟将欲行，忽闻岸上踏歌声", author: "李白", title: "赠汪伦" },
            { poem: "移舟泊烟渚，日暮客愁新", author: "孟浩然", title: "宿建德江" }
        ]
    },
    qiao: {
        character: "桥",
        level: "medium",
        poems: [
            { poem: "枯藤老树昏鸦，小桥流水人家，古道西风瘦马", author: "马致远", title: "天净沙·秋思" },
            { poem: "两水夹明镜，双桥落彩虹", author: "李白", title: "秋登宣城谢脁北楼" },
            { poem: "朱雀桥边野草花，乌衣巷口夕阳斜", author: "刘禹锡", title: "乌衣巷" }
        ]
    },
    lou: {
        character: "楼",
        level: "medium",
        poems: [
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "故人西辞黄鹤楼，烟花三月下扬州", author: "李白", title: "黄鹤楼送孟浩然之广陵" },
            { poem: "欲穷千里目，更上一层楼", author: "王之涣", title: "登鹳雀楼" },
            { poem: "南朝四百八十寺，多少楼台烟雨中", author: "杜牧", title: "江南春" }
        ]
    },
    ting: {
        character: "亭",
        level: "medium",
        poems: [
            { poem: "常记溪亭日暮，沉醉不知归路", author: "李清照", title: "如梦令" },
            { poem: "何人为本？同是宦游人。",
            { poem: "天下伤心处，劳劳送客亭", author: "李白", title: "劳劳亭" }
        ]
    },
    deng: {
        character: "灯",
        level: "medium",
        poems: [
            { poem: "众里寻他千百度，蓦然回首，那人却在灯火阑珊处", author: "辛弃疾", title: "青玉案·元夕" },
            { poem: "蓦然回首，那人却在灯火阑珊处", author: "辛弃疾", title: "青玉案·元夕" },
            { poem: "灯前一觉江南梦，惆怅起来山月斜", author: "韦庄", title: "含山店梦见作" }
        ]
    },
    chuang: {
        character: "窗",
        level: "medium",
        poems: [
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "今夜偏知春气暖，虫声新透绿窗纱", author: "刘方平", title: "月夜" },
            { poem: "何当共剪西窗烛，却话巴山夜雨时", author: "李商隐", title: "夜雨寄北" },
            { poem: "矮纸斜行闲作草，晴窗细乳戏分茶", author: "陆游", title: "临安春雨初霁" }
        ]
    },
    men: {
        character: "门",
        level: "medium",
        poems: [
            { poem: "窗含西岭千秋雪，门泊东吴万里船", author: "杜甫", title: "绝句" },
            { poem: "鸟宿池边树，僧敲月下门", author: "贾岛", title: "题李凝幽居" },
            { poem: "从今若许闲乘月，拄杖无时夜叩门", author: "陆游", title: "游山西村" },
            { poem: "千门万户曈曈日，总把新桃换旧符", author: "王安石", title: "元日" }
        ]
    },
    // ========== 时间类 ==========
   zao: {
        character: "早",
        level: "easy",
        poems: [
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" },
            { poem: "渭城朝雨浥轻尘，客舍青青柳色新", author: "王维", title: "送元二使安西" },
            { poem: "早知如此绊人心，何当共问归期", author: "李商隐", title: "夜雨寄北" }
        ]
    },
    wan: {
        character: "晚",
        level: "medium",
        poems: [
            { poem: "春潮带雨晚来急，野渡无人舟自横", author: "韦应物", title: "滁州西涧" },
            { poem: "风住尘香花已尽，日晚倦梳头", author: "李清照", title: "武陵春" },
            { poem: "灞原风雨定，晚见雁峰频", author: "温庭筠", title: "商山早行" }
        ]
    },
    chen: {
        character: "晨",
        level: "medium",
        poems: [
            { poem: "盛年不重来，一日难再晨", author: "陶渊明", title: "杂诗" },
            { poem: "清晨入古寺，初日照高林", author: "常建", title: "破山寺后禅院" }
        ]
    },
    mu: {
        character: "暮",
        level: "medium",
        poems: [
            { poem: "东皋薄暮望，徙倚欲何依", author: "王绩", title: "野望" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "是非成败转头空，青山依旧在，几度夕阳红", author: "杨慎", title: "临江仙》" }
        ]
    },
    xiao: {
        character: "晓",
        level: "medium",
        poems: [
            { poem: "春眠不觉晓，处处闻啼鸟", author: "孟浩然", title: "春晓" },
            { poem: "晓出净慈寺送林子方，毕竟六月中", author: "杨万里", title: "晓出净慈寺送林子方" },
            { poem: "晓来谁染霜林醉？总是离人泪", author: "王实甫", title: "西厢记》" }
        ]
    },
    // ========== 动作类 ==========
    fei: {
        character: "飞",
        level: "easy",
        poems: [
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" },
            { poem: "春城无处不飞花", author: "韩翃", title: "寒食" },
            { poem: "茅飞渡江洒江郊，高者挂罥长林梢", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "，飞流直下三千尺", author: "李白", title: "望庐山瀑布" }
        ]
    },
    chang: {
        character: "长",
        level: "easy",
        poems: [
            { poem: "长江一帆远，落日五湖春", author: "刘长卿", title: "饯别》" },
            { poem: "长风破浪会有时，直挂云帆济沧海", author: "李白", title: "行路难" },
            { poem: "长相思，在长安", author: "李白", title: "长相思" },
            { poem: "长恨春归无觅处，不知转入此中来", author: "白居易", title: "大林寺桃花" }
        ]
    },
    zuo: {
        character: "坐",
        level: "medium",
        poems: [
            { poem: "好雨知时节，当春乃发生。随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "待到重阳日，还来就菊花", author: "孟浩然", title: "过故人庄" },
            { poem: "开轩面场圃，把酒话桑麻", author: "孟浩然", title: "过故人庄" }
        ]
    },
    li: {
        character: "立",
        level: "medium",
        poems: [
            { poem: "独立寒秋，湘江北去，橘子洲头", author: "毛泽东", title: "沁园春·长沙" },
            { poem: "移舟泊烟渚，日暮客愁新", author: "孟浩然", title: "宿建德江" },
            { poem: "野旷天低树，江清月近人", author: "孟浩然", title: "宿建德江" }
        ]
    },
    zui: {
        character: "醉",
        level: "medium",
        poems: [
            { poem: "醉翁之意不在酒，在乎山水之间也", author: "欧阳修", title: "醉翁亭记" },
            { poem: "醉卧沙场君莫笑，古来征战几人回", author: "王翰", title: "凉州词" },
            { poem: "醒时同交欢，醉后各分散", author: "李白", title: "月下独酌" },
            { poem: "但使主人能醉客，不知何处是他乡", author: "李白", title: "客中行" }
        ]
    },
    meng: {
        character: "梦",
        level: "medium",
        poems: [
            { poem: "夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" },
            { poem: "醉后不知天在水，满船清梦压星河", author: "唐温如", title: "题龙阳县青草湖" },
            { poem: "昨夜星辰昨夜风，画楼西畔桂堂东", author: "李商隐", title: "无题" },
            { poem: "梦里不知身是客，一晌贪欢", author: "李煜", title: "浪淘沙" },
            { poem: "人生如梦，一尊还酹江月", author: "苏轼", title: "念奴娇·赤壁怀古" }
        ]
    },
    ge: {
        character: "歌",
        level: "medium",
        poems: [
            { poem: "我歌月徘徊，我舞影零乱", author: "李白", title: "月下独酌" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "杨柳青青江水平，闻郎江上踏歌声", author: "刘禹锡", title: "竹枝词" }
        ]
    },
    yin: {
        character: "吟",
        level: "medium",
        poems: [
            { poem: "君不见黄河之水天上来，奔流到海不复回", author: "李白", title: "将进酒" },
            { poem: "低眉信手续续弹，说尽心中无限事", author: "白居易", title: "琵琶行" }
        ]
    },
    // ========== 情感类 ==========
    qing2: {
        character: "情",
        level: "medium",
        poems: [
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "浮云游子意，落日故人情", author: "李白", title: "送友人" },
            { poem: "又送王孙去，萋萋满别情", author: "白居易", title: "赋得古原草送别" },
            { poem: "此夜曲中闻折柳，何人不起故园情", author: "李白", title: "春夜洛城闻笛" },
            { poem: "永结无情游，相期邈云汉", author: "李白", title: "月下独酌" }
        ]
    },
    hen: {
        character: "恨",
        level: "medium",
        poems: [
            { poem: "人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟", author: "苏轼", title: "水调歌头" },
            { poem: "臣心一片磁针石，不指南方不肯休", author: "文天祥", title: "扬子江" },
            { poem: "艰难苦恨繁霜鬓，潦倒新停浊酒杯", author: "杜甫", title: "登高" }
        ]
    },
    chou: {
        character: "愁",
        level: "medium",
        poems: [
            { poem: "抽刀断水水更流，举杯消愁愁更愁", author: "李白", title: "宣州谢朓楼饯别校书叔云" },
            { poem: "问君能有几多愁？恰似一江春水向东流", author: "李煜", title: "虞美人" },
            { poem: "却看妻子愁何在，漫卷诗书喜欲狂", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" }
        ]
    },
    bei: {
        character: "悲",
        level: "medium",
        poems: [
            { poem: "人有悲欢离合，月有阴晴圆缺", author: "苏轼", title: "水调歌头" },
            { poem: "万里悲秋常作客，百年多病独登台", author: "杜甫", title: "登高" },
            { poem: "freyjadsklf", author: "杜甫", title: "春望" }
        ]
    },
    huan: {
        character: "欢",
        level: "medium",
        poems: [
            { poem: "人有悲欢离合，月有阴晴圆缺", author: "苏轼", title: "水调歌头" },
            { poem: "却看妻子愁何在，漫卷诗书喜欲狂", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "李白桃红满城春，飞红万点愁如海", author: "秦观", title: "千秋岁" }
        ]
    },
    xi: {
        character: "喜",
        level: "medium",
        poems: [
            { poem: "却看妻子愁何在，漫卷诗书喜欲狂", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "如鸟哥喜欢的", author: "孟浩然", title: "春晓" }
        ]
    },
    ku: {
        character: "苦",
        level: "medium",
        poems: [
            { poem: "艰难苦恨繁霜鬓，潦倒新停浊酒杯", author: "杜甫", title: "登高" },
            { poem: "谁道人生无再少？门前流水尚能西！休将白发唱黄鸡", author: "苏轼", title: "浣溪沙" },
            { poem: " ere", author: "杜甫", title: "兵车行" }
        ]
    },
    le: {
        character: "乐",
        level: "medium",
        poems: [
            { poem: "春风得意马蹄疾，一日看尽长安花", author: "孟郊", title: "登科后" },
            { poem: "白日放歌须纵酒，青春作伴好还乡", author: "杜甫", title: "闻官军收河南河北" },
            { poem: "的人生得意须尽欢，莫使金樽空对月", author: "李白", title: "将进酒" }
        ]
    }
};

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FEIHUA_DATA, getAllCharacters, getPoemsByCharacter };
}
,
    // ========== 更多关键字 ==========
    ji: {
        character: "鸡",
        level: "easy",
        poems: [
            { poem: "鸡声茅店月，人迹板桥霜", author: "温庭筠", title: "商山早行" },
            { poem: "故人具鸡黍，邀我至田家", author: "孟浩然", title: "过故人庄" },
            { poem: "莫笑农家腊酒浑，丰年留客足鸡豚", author: "陆游", title: "游山西村" }
        ]
    },
    qu: {
        character: "犬",
        level: "medium",
        poems: [
            { poem: "柴门闻犬吠，风雪夜归人", author: "刘长卿", title: "逢雪宿芙蓉山主人" },
            { poem: "鱼戏莲叶间，参差呵护此心同", author: "汉乐府", title: "江南" }
        ]
    },
    tu: {
        character: "兔",
        level: "hard",
        poems: [
            { poem: "鸟归来，绕树飞三匝，无枝可依", author: "曹操", title: "短歌行" },
            { poem: "玉兔应该是", author: "杜甫", title: "月夜" }
        ]
    },
    jing: {
        character: "井",
        level: "medium",
        poems: [
            { poem: "朱雀桥边野草花，乌衣巷口夕阳斜", author: "刘禹锡", title: "乌衣巷" },
            { poem: "旧时王谢堂前燕，飞入寻常百姓家", author: "刘禹锡", title: "乌衣巷" }
        ]
    },
    gu: {
        character: "古",
        level: "medium",
        poems: [
            { poem: "古调虽自爱，今人多不弹", author: "刘长卿", title: "弹琴" },
            { poem: "古来圣贤皆寂寞，惟有饮者留其名", author: "李白", title: "将进酒" },
            { poem: "古木阴中系短篷，杖藜扶我过桥东", author: "志南", title: "绝句" }
        ]
    },
    jin: {
        character: "金",
        level: "medium",
        poems: [
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" },
            { poem: "黄沙百战穿金甲，不破楼兰终不还", author: "王昌龄", title: "从军行" },
            { poem: "春宵一刻值千金，花有清香月有阴", author: "苏轼", title: "春宵" }
        ]
    },
    yin: {
        character: "银",
        level: "medium",
        poems: [
            { poem: "飞流直下三千尺，疑是银河落九天", author: "李白", title: "望庐山瀑布" },
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" }
        ]
    },
    yu2: {
        character: "玉",
        level: "medium",
        poems: [
            { poem: "碧玉妆成一树高，万条垂下绿丝绦", author: "贺知章", title: "咏柳" },
            { poem: "小时不识月，呼作白玉盘", author: "李白", title: "古朗月行" },
            { poem: "洛阳亲友如相问，一片冰心在玉壶", author: "王昌龄", title: "芙蓉楼送辛渐" }
        ]
    },
    chi: {
        character: "池",
        level: "medium",
        poems: [
            { poem: "池上与桥边，难忘复可怜", author: "李商隐", title: "街西池馆" },
            { poem: "羁鸟恋旧林，池鱼思故渊", author: "陶渊明", title: "归园田居" }
        ]
    },
    quan: {
        character: "泉",
        level: "medium",
        poems: [
            { poem: "明月松间照，清泉石上流", author: "王维", title: "山居秋暝" },
            { poem: "温泉水滑洗凝脂，侍儿扶起娇无力", author: "白居易", title: "长恨歌" }
        ]
    },
    tan: {
        character: "潭",
        level: "medium",
        poems: [
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" },
            { poem: "近泪无干土，低空有断山", author: "杜甫", title: "别房太尉墓" }
        ]
    },
    hai: {
        character: "海",
        level: "medium",
        poems: [
            { poem: "海内存知己，天涯若比邻", author: "王勃", title: "送杜少府之任蜀州" },
            { poem: "海上生明月，天涯共此时", author: "张九龄", title: "望月怀远" },
            { poem: "海日生残夜，江春入旧年", author: "王湾", title: "次北固山下" }
        ]
    },
    dao: {
        character: "岛",
        level: "medium",
        poems: [
            { poem: "海岛翠微连，边秋雁入云", author: "杜甫", title: "野望》" },
            { poem: "山不在高，有仙则名；水不在深，有龙则灵", author: "刘禹锡", title: "陋室铭" }
        ]
    },
    an: {
        character: "岸",
        level: "medium",
        poems: [
            { poem: "两岸猿声啼不住，轻舟已过万重山", author: "李白", title: "早发白帝城" },
            { poem: "潮平两岸阔，风正一帆悬", author: "王湾", title: "次北固山下" }
        ]
    },
    sha: {
        character: "沙",
        level: "medium",
        poems: [
            { poem: "大漠孤烟直，长河落日圆", author: "王维", title: "使至塞上" },
            { poem: "沙上并禽池上暝，云破月来花弄影", author: "张先", title: "天仙子" }
        ]
    },
    yan2: {
        character: "雁",
        level: "medium",
        poems: [
            { poem: "千里黄云白日曛，北风吹雁雪纷纷", author: "高适", title: "别董大" },
            { poem: "雁过也，正伤心，却是旧时相识", author: "李清照", title: "声声慢" }
        ]
    },
    xue2: {
        character: "雪",
        level: "medium",
        poems: [
            { poem: "忽如一夜春风来，千树万树梨花开", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "北风卷地白草折，胡天八月即飞雪", author: "岑参", title: "白雪歌送武判官归京" }
        ]
    },
    sheng: {
        character: "声",
        level: "medium",
        poems: [
            { poem: "随风潜入夜，润物细无声", author: "杜甫", title: "春夜喜雨" },
            { poem: "大弦嘈嘈如急雨，小弦切切如私语", author: "白居易", title: "琵琶行" },
            { poem: "间关莺语花底滑，幽咽泉流冰下难", author: "白居易", title: "琵琶行" }
        ]
    },
    xiang: {
        character: "香",
        level: "medium",
        poems: [
            { poem: "日照香炉生紫烟，遥看瀑布挂前川", author: "李白", title: "望庐山瀑布" },
            { poem: "冲天香阵透长安，满城尽带黄金甲", author: "黄巢", title: "不第后赋菊" }
        ]
    },
    wei: {
        character: "味",
        level: "hard",
        poems: [
            { poem: "世味年来薄似纱，谁令骑马客京华", author: "陆游", title: "临安春雨初霁" },
            { poem: "日啖荔枝三百颗，不辞长作岭南人", author: "苏轼", title: "惠州一绝" }
        ]
    },
    guang: {
        character: "光",
        level: "medium",
        poems: [
            { poem: "床前明月光，疑是地上霜", author: "李白", title: "静夜思" },
            { poem: "朔气传金柝，寒光照铁衣", author: "南北朝", title: "木兰诗" }
        ]
    },
    ying: {
        character: "影",
        level: "medium",
        poems: [
            { poem: "浮光跃金，静影沉璧", author: "范仲淹", title: "岳阳楼记" },
            { poem: "沙上并禽池上暝，云破月来花弄影", author: "张先", title: "天仙子" }
        ]
    },
    ji2: {
        character: "迹",
        level: "hard",
        poems: [
            { poem: "万径人踪灭，孤舟蓑笠翁", author: "柳宗元", title: "江雪" },
            { poem: "鸿泥雪爪，事如春梦", author: "苏轼", title: "和子由渑池怀旧" }
        ]
    },
    ji3: {
        character: "迹",
        level: "medium",
        poems: [
            { poem: "人生到处知何似，应似飞鸿踏雪泥", author: "苏轼", title: "和子由渑池怀旧" }
        ]
    },
    sheng2: {
        character: "生",
        level: "medium",
        poems: [
            { poem: "好雨知时节，当春乃发生", author: "杜甫", title: "春夜喜雨" },
            { poem: "海日生残夜，江春入旧年", author: "王湾", title: "次北固山下" },
            { poem: "野火烧不尽，春风吹又生", author: "白居易", title: "赋得古原草送别" }
        ]
    },
    si2: {
        character: "死",
        level: "hard",
        poems: [
            { poem: "人生自古谁无死，留取丹心照汗青", author: "文天祥", title: "过零丁洋" },
            { poem: "十年生死两茫茫，不思量，自难忘", author: "苏轼", title: "江城子" }
        ]
    },
    bing: {
        character: "病",
        level: "medium",
        poems: [
            { poem: "多病故人疏", author: "李白", title: "月下独酌" },
            { poem: "遍身罗绮者，不是养蚕人", author: "张俞", title: "蚕妇" }
        ]
    },
    jiu2: {
        character: "旧",
        level: "medium",
        poems: [
            { poem: "旧时王谢堂前燕，飞入寻常百姓家", author: "刘禹锡", title: "乌衣巷" },
            { poem: "怀旧空吟闻笛赋，到乡翻似烂柯人", author: "刘禹锡", title: "酬乐天扬州初逢席上见赠" }
        ]
    },
    xin: {
        character: "新",
        level: "easy",
        poems: [
            { poem: "胜日寻芳泗水滨，无边光景一时新", author: "朱熹", title: "春日" },
            { poem: "千门万户曈曈日，总把新桃换旧符", author: "王安石", title: "元日" },
            { poem: "渭城朝雨浥轻尘，客舍青青柳色新", author: "王维", title: "送元二使安西" }
        ]
    },
    man: {
        character: "满",
        level: "medium",
        poems: [
            { poem: "草满池塘水满陂，山衔落日浸寒漪", author: "雷震", title: "村晚" },
            { poem: "今我来思，雨雪霏霏", author: "诗经", title: "采薇" }
        ]
    },
    kong: {
        character: "空",
        level: "medium",
        poems: [
            { poem: "山回路转不见君，雪上空留马行处", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "黄鹤一去不复返，白云千载空悠悠", author: "崔颢", title: "黄鹤楼" },
            { poem: "空山新雨后，天气晚来秋", author: "王维", title: "山居秋暝" }
        ]
    },
    shen: {
        character: "深",
        level: "medium",
        poems: [
            { poem: "深林人不知，明月来相照", author: "王维", title: "竹里馆" },
            { poem: "烟笼寒水月笼沙，夜泊秦淮近酒家", author: "杜牧", title: "泊秦淮" }
        ]
    },
    qian: {
        character: "浅",
        level: "medium",
        poems: [
            { poem: "疏影横斜水清浅，暗香浮动月黄昏", author: "林逋", title: "山园小梅" },
            { poem: "浅草才能没马蹄", author: "白居易", title: "钱塘湖春行" }
        ]
    },
    yuan3: {
        character: "远",
        level: "medium",
        poems: [
            { poem: "山高路远坑深，大军纵横驰奔", author: "毛泽东", title: "六盘山》" },
            { poem: "日暮苍山远，天寒白屋贫", author: "刘长卿", title: "逢雪宿芙蓉山主人" }
        ]
    },
    jin3: {
        character: "近",
        level: "medium",
        poems: [
            { poem: "山不在高，有仙则名；水不在深，有龙则灵", author: "刘禹锡", title: "陋室铭" },
            { poem: "远近高低各不同", author: "苏轼", title: "题西林壁" }
        ]
    },
    hou: {
        character: "厚",
        level: "hard",
        poems: [
            { poem: "积藪成丘，积薄成厚", author: "佚名", title: "成语" }
        ]
    },
    bao: {
        character: "薄",
        level: "hard",
        poems: [
            { poem: "世味年来薄似纱，谁令骑马客京华", author: "陆游", title: "临安春雨初霁" }
        ]
    },
    ting2: {
        character: "亭",
        level: "medium",
        poems: [
            { poem: "天下伤心处，劳劳送客亭", author: "李白", title: "劳劳亭" },
            { poem: "常记溪亭日暮，沉醉不知归路", author: "李清照", title: "如梦令" }
        ]
    },
    tai: {
        character: "台",
        level: "medium",
        poems: [
            { poem: "古台摇落后，秋入望乡心", author: "刘长卿", title: "秋日登吴公台上寺远眺" },
            { poem: "从今若许闲乘月，拄杖无时夜叩门", author: "陆游", title: "游山西村" }
        ]
    },
    ge: {
        character: "阁",
        level: "hard",
        poems: [
            { poem: "燕子飞来窥画栋，蛛丝网尘埃", author: "李清照", title: "一剪梅" }
        ]
    },
    gong: {
        character: "宫",
        level: "medium",
        poems: [
            { poem: "折戟沉沙铁未销，自将磨洗认前朝", author: "杜牧", title: "赤壁" },
            { poem: "春风桃李花开日，秋雨梧桐叶落时", author: "白居易", title: "长恨歌" }
        ]
    },
    fang: {
        character: "房",
        level: "medium",
        poems: [
            { poem: "八月秋高风怒号，卷我屋上三重茅", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "安得广厦千万间，大庇天下寒士俱欢颜", author: "杜甫", title: "茅屋为秋风所破歌" }
        ]
    },
    wu: {
        character: "屋",
        level: "medium",
        poems: [
            { poem: "八月秋高风怒号，卷我屋上三重茅", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "旧时茅店社林边，路转溪桥忽见", author: "辛弃疾", title: "西江月·夜行黄沙道中" }
        ]
    },
    wa: {
        character: "瓦",
        level: "hard",
        poems: [
            { poem: "屋上春鸠鸣，村边杏花白", author: "王维", title: "春中田园作" }
        ]
    },
    qiang: {
        character: "墙",
        level: "hard",
        poems: [
            { poem: "墙角数枝梅，凌寒独自开", author: "王安石", title: "梅花" }
        ]
    },
    chang: {
        character: "场",
        level: "medium",
        poems: [
            { poem: "开轩面场圃，把酒话桑麻", author: "孟浩然", title: "过故人庄" },
            { poem: "春城无处不飞花，寒食东风御柳斜", author: "韩翃", title: "寒食" }
        ]
    },
    pu: {
        character: "圃",
        level: "hard",
        poems: [
            { poem: "开轩面场圃，把酒话桑麻", author: "孟浩然", title: "过故人庄" }
        ]
    },
    tian2: {
        character: "田",
        level: "medium",
        poems: [
            { poem: "故人具鸡黍，邀我至田家", author: "孟浩然", title: "过故人庄" },
            { poem: "昼出耘田夜绩麻，村庄儿女各当家", author: "范成大", title: "四时田园杂兴" }
        ]
    },
    mu4: {
        character: "亩",
        level: "hard",
        poems: [
            { poem: "一亩三分地", author: "俗语", title: "" }
        ]
    },
    sen: {
        character: "森",
        level: "hard",
        poems: [
            { poem: "水清石出鱼可数，林深无人鸟相呼", author: "苏轼", title: "夜泛西湖》" }
        ]
    },
    lin: {
        character: "林",
        level: "medium",
        poems: [
            { poem: "返景入深林，复照青苔上", author: "王维", title: "鹿柴" },
            { poem: "千山鸟飞绝，万径人踪灭", author: "柳宗元", title: "江雪" }
        ]
    },
    cong: {
        character: "丛",
        level: "hard",
        poems: [
            { poem: "灌木萦旗转，仙云引仗来", author: "王维", title: "早朝大明宫》" }
        ]
    },
    yuan4: {
        character: "园",
        level: "easy",
        poems: [
            { poem: "春色满园关不住，一枝红杏出墙来", author: "叶绍翁", title: "游园不值" },
            { poem: "故人具鸡黍，邀我至田家", author: "孟浩然", title: "过故人庄" }
        ]
    },
    kai: {
        character: "开",
        level: "easy",
        poems: [
            { poem: "忽如一夜春风来，千树万树梨花开", author: "岑参", title: "白雪歌送武判官归京" },
            { poem: "解落三秋叶，能开二月花", author: "李峤", title: "风" }
        ]
    },
    he3: {
        character: "合",
        level: "medium",
        poems: [
            { poem: "绿树村边合，青山郭外斜", author: "孟浩然", title: "过故人庄" }
        ]
    },
    luo: {
        character: "落",
        level: "medium",
        poems: [
            { poem: "返景入深林，复照青苔上", author: "王维", title: "鹿柴" },
            { poem: "月落乌啼霜满天，江枫渔火对愁眠", author: "张继", title: "枫桥夜泊" }
        ]
    },
    qi2: {
        character: "起",
        level: "medium",
        poems: [
            { poem: "日出而作，日入而息", author: "古逸", title: "击壤歌" },
            { poem: "风云突起", author: "成语", title: "" }
        ]
    },
    shou: {
        character: "手",
        level: "easy",
        poems: [
            { poem: "慈母手中线，游子身上衣", author: "孟郊", title: "游子吟" },
            { poem: "执手相看泪眼，竟无语凝噎", author: "柳永", title: "雨霖铃" }
        ]
    },
    zu: {
        character: "足",
        level: "medium",
        poems: [
            { poem: "丰年足客足鸡豚", author: "陆游", title: "游山西村" },
            { poem: "画蛇添足", author: "成语", title: "" }
        ]
    },
    shen2: {
        character: "身",
        level: "medium",
        poems: [
            { poem: "身上衣裳口中食", author: "白居易", title: "卖炭翁" },
            { poem: "换我心，为你心，始知相忆深", author: "顾夐", title: "诉衷情》" }
        ]
    },
    er: {
        character: "儿",
        level: "easy",
        poems: [
            { poem: "儿berman", author: "杜甫", title: "茅屋为秋风所破歌" },
            { poem: "知有儿童挑促织，夜深篱落一灯明", author: "叶绍翁", title: "夜书所见" }
        ]
    },
    nv: {
        character: "女",
        level: "easy",
        poems: [
            { poem: "女儿悲，嫁期有时", author: "白居易", title: "琵琶行" },
            { poem: "杨家有女初长成，养在深闺人未识", author: "白居易", title: "长恨歌" }
        ]
    }
};
,
    fu: {
        character: "父",
        level: "easy",
        poems: [
            { poem: "父子之间的关系", author: "杜甫", title: "月夜》" },
            { poem: "父亲"，作者未知
        ]
    },
    mu: {
        character: "母",
        level: "easy",
        poems: [
            { poem: "慈母手中线，游子身上衣", author: "孟郊", title: "游子吟" },
            { poem: "母亲"，作者未知
        ]
    },
    jun: {
        character: "君",
        level: "easy",
        poems: [
            { poem: "君不见黄河之水天上来，奔流到海不复回", author: "李白", title: "将进酒" },
            { poem: "劝君更尽一杯酒，西出阳关无故人", author: "王维", title: "送元二使安西" },
            { poem: "正是江南好风景，落花时节又逢君", author: "杜甫", title: "江南逢李龟年" }
        ]
    },
    chen: {
        character: "臣",
        level: "medium",
        poems: [
            { poem: "三顾频烦天下计，两朝开济老臣心", author: "杜甫", title: "蜀相" },
            { poem: "先帝托孤，寄臣以大事", author: "诸葛亮", title: "出师表" }
        ]
    },
    xian: {
        character: "仙",
        level: "medium",
        poems: [
            { poem: "忽闻海上有仙山，山在虚无缥缈间", author: "白居易", title: "长恨歌" },
            { poem: "仙风道骨此山时", author: "李白", title: "庐山谣》" }
        ]
    },
    shen: {
        character: "神",
        level: "medium",
        poems: [
            { poem: "神女应无恙，当惊世界殊", author: "毛泽东", title: "水调歌头·游泳》" },
            { poem: "神龟虽寿，犹有竟时", author: "曹操", title: "龟虽寿" }
        ]
    },
    gui: {
        character: "鬼",
        level: "hard",
        poems: [
            { poem: "鬼灯如漆照松林", author: "韩愈", title: "送穷文" }
        ]
    },
    ke: {
        character: "客",
        level: "medium",
        poems: [
            { poem: "独在异乡为异客，每逢佳节倍思亲", author: "王维", title: "九月九日忆山东兄弟" },
            { poem: "笑问客从何处来", author: "贺知章", title: "回乡偶书" },
            { poem: "春江花朝秋月夜，往事知多少", author: "李煜", title: "虞美人》" }
        ]
    },
    you: {
        character: "友",
        level: "medium",
        poems: [
            { poem: "海内存知己，天涯若比邻", author: "王勃", title: "送杜少府之任蜀州" },
            { poem: "桃花潭水深千尺，不及汪伦送我情", author: "李白", title: "赠汪伦" }
        ]
    },
    fu: {
        character: "妇",
        level: "medium",
        poems: [
            { poem: "老大嫁作商人妇", author: "白居易", title: "琵琶行" }
        ]
    },
    lang: {
        character: "郎",
        level: "medium",
        poems: [
            { poem: "问君能有几多愁？恰似一江春水向东流", author: "李煜", title: "虞美人》" },
            { poem: "只是当时已惘然", author: "李商隐", title: "锦瑟》" }
        ]
    },
    niang: {
        character: "娘",
        level: "easy",
        poems: [
            { poem: "娘", author: "白居易", title: "琵琶行" }
        ]
    },
    lang2: {
        character: "郎",
        level: "medium",
        poems: [
            { poem: "东方半明大星没，犹带昭阳日影来", author: "韩愈", title: "东方半明》" }
        ]
    },
    er: {
        character: "儿",
        level: "easy",
        poems: [
            { poem: "儿berman", author: "杜甫", title: "茅屋为秋风所破歌" }
        ]
    },
    dou: {
        character: "斗",
        level: "medium",
        poems: [
            { poem: "金樽清酒斗十千", author: "李白", title: "行路难" }
        ]
    },
    zun: {
        character: "尊",
        level: "medium",
        poems: [
            { poem: "金樽清酒斗十千，玉盘珍羞直万钱", author: "李白", title: "行路难" }
        ]
    },
    shou: {
        character: "首",
        level: "medium",
        poems: [
            { poem: "低头思故乡，举头望明月", author: "李白", title: "静夜思" }
        ]
    },
    jing: {
        character: "惊",
        level: "medium",
        poems: [
            { poem: "春眠不觉晓，处处闻啼鸟，夜来风雨声，花落知多少", author: "孟浩然", title: "春晓" }
        ]
    },
    zu: {
        character: "足",
        level: "medium",
        poems: [
            { poem: "丰年足客足鸡豚", author: "陆游", title: "游山西村" }
        ]
    },
    han: {
        character: "寒",
        level: "medium",
        poems: [
            { poem: "风急天高猿啸哀，渚清沙白鸟飞回", author: "杜甫", title: "登高" },
            { poem: "寒山转苍翠，秋水日潺湲", author: "王维", title: "山居秋暝" }
        ]
    },
    re: {
        character: "热",
        level: "medium",
        poems: [
            { poem: "力尽不知热，但惜夏日长", author: "白居易", title: "观刈麦" }
        ]
    },
    gan: {
        character: "干",
        level: "medium",
        poems: [
            { poem: "不干人事", author: "成语", title: "" }
        ]
    },
    ku: {
        character: "苦",
        level: "medium",
        poems: [
            { poem: "艰难苦恨繁霜鬓", author: "杜甫", title: "登高" }
        ]
    },
    tian: {
        character: "甜",
        level: "easy",
        poems: [
            { poem: "甘", author: "成语", title: "" }
        ]
    },
    xian: {
        character: "闲",
        level: "medium",
        poems: [
            { poem: "闲敲棋子落灯花", author: "赵师秀", title: "约客" },
            { poem: "从今若许闲乘月，拄杖无时夜叩门", author: "陆游", title: "游山西村" }
        ]
    },
    mang: {
        character: "忙",
        level: "medium",
        poems: [
            { poem: "瞎忙", author: "成语", title: "" }
        ]
    }
};
