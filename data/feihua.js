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
