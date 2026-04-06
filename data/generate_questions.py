#!/usr/bin/env python3
"""
古诗词游戏题目生成器
基于 supplement.json 真实诗词数据生成选择题 + 理解题
"""
import json
import random

with open('/Volumes/claw/wujing/古诗词游戏/源码/data/supplement.json', 'r', encoding='utf-8') as f:
    poems = json.load(f)

random.seed(42)

# ============ 选择题生成 ============
choice_templates = [
    # 1. 作者识别
    ("以下哪首诗的作者是{author}？", "author"),
    ("\"{author}\"的《{title}》描写的是什么景色？", "title"),
    # 2. 朝代识别
    ("《{title}》是哪位诗人写的？", "author"),
    # 3. 主题识别
    ("《{title}》这首诗的主题是什么？", "theme"),
    # 4. 名句识别
    ("下列诗句中，哪句出自《{title}》？", "title"),
    # 5. 意象识别
    ("《{title}》中通过哪个意象表达思乡之情？", "imagery"),
]

def make_distractor(poems, correct_val, qtype, exclude_ids):
    """生成干扰项"""
    candidates = []
    for p in poems:
        if p['id'] in exclude_ids:
            continue
        if qtype == 'author':
            if p['author'] != correct_val:
                candidates.append(p['author'])
        elif qtype == 'dynasty':
            if p.get('dynasty') != correct_val:
                candidates.append(p.get('dynasty', '未知'))
        elif qtype == 'title':
            if p['title'] != correct_val:
                candidates.append('《' + p['title'] + '》')
    candidates = list(set(candidates))
    random.shuffle(candidates)
    return candidates[:3]

def build_choice_question(poem, qtype, grade):
    """构建一道选择题"""
    title = poem['title']
    author = poem['author']
    dynasty = poem.get('dynasty', '未知')
    content = poem.get('content', [])
    full_text = poem.get('fullText', '')

    if qtype == 'author':
        question = f"《{title}》的作者是谁？"
        correct = author
        distractor_authors = make_distractor(poems, author, 'author', {poem['id']})
        distractor_authors = distractor_authors[:3]
        while len(distractor_authors) < 3:
            distractor_authors.append('王维')
        options = [{"text": correct, "correct": True}]
        for a in distractor_authors:
            options.append({"text": a, "correct": False})
        random.shuffle(options)
        answer = next(o["text"] for o in options if o["correct"])
        explanation = f"《{title}》出自{author}之手。"

    elif qtype == 'title':
        question = f"“{''.join(content[0]) if content else '诗句'}”这句诗出自哪首诗？"
        correct = f"《{title}》"
        distractor_titles = make_distractor(poems, title, 'title', {poem['id']})
        distractor_titles = distractor_titles[:3]
        while len(distractor_titles) < 3:
            distractor_titles.append('《春夜喜雨》')
        options = [{"text": correct, "correct": True}]
        for t in distractor_titles:
            options.append({"text": t, "correct": False})
        random.shuffle(options)
        answer = next(o["text"] for o in options if o["correct"])
        explanation = f"这句诗出自{author}的《{title}》。"

    elif qtype == 'theme':
        themes = {
            "春夜喜雨": "喜悦春雨",
            "清明": "清明哀思",
            "静夜思": "思乡之情",
            "望岳": "壮志豪情",
            "登鹳雀楼": "壮志雄心",
            "题西林壁": "哲理思考",
        }
        theme = themes.get(title, "借景抒情")
        question = f"《{title}》这首诗主要表达的是什么情感？"
        correct = theme
        all_themes = list(set(themes.values()))
        distractors = [t for t in all_themes if t != theme][:3]
        while len(distractors) < 3:
            distractors.extend(["边塞征战", "离别相思", "山水田园"])
        distractors = list(set(distractors))[:3]
        options = [{"text": correct, "correct": True}]
        for t in distractors:
            options.append({"text": t, "correct": False})
        random.shuffle(options)
        answer = next(o["text"] for o in options if o["correct"])
        explanation = f"《{title}》表达了{correct}的情感。"

    else:
        return None

    return {
        "id": f"q_{grade}_new_{random.randint(10000,99999)}",
        "type": "choice",
        "grade": grade,
        "source": "悟净补充题库",
        "difficulty": 2,
        "question": question,
        "options": options,
        "answer": answer,
        "explanation": explanation,
        "poemId": poem['id'],
        "knowledgePoints": [author, title]
    }

# ============ 理解题生成 ============
def build_understanding_question(poem, grade):
    """构建一道理解题"""
    title = poem['title']
    author = poem['author']
    content = poem.get('content', [])
    if not content:
        return None
    first_line = ''.join(content[0]) if content else ''

    # 理解题模板
    templates = [
        {
            "question": f"《{title}》中描写春天景象的诗句是：__________，__________。",
            "answer": f"{content[0] if len(content)>0 else '？'}；{content[1] if len(content)>1 else '？'}",
            "explanation": f"《{title}》前两句描写了春天的景色。",
            "knowledgePoints": ["理解型默写", author, title, "春天"]
        },
        {
            "question": f"《{title}》中表达诗人感慨时光流逝的诗句是：__________。",
            "answer": content[1] if len(content) > 1 else content[0],
            "explanation": f"《{title}》中的这句诗表达了诗人对时光的感慨。",
            "knowledgePoints": ["理解型默写", author, title, "时光"]
        },
        {
            "question": f"《{title}》这首诗的颔联（上半首第二联）是：__________，__________。",
            "answer": f"{content[1] if len(content)>1 else '？'}；{content[2] if len(content)>2 else '？'}",
            "explanation": f"《{title}》的颔联是第2和第3句。",
            "knowledgePoints": ["诗歌结构", author, title, "颔联"]
        },
        {
            "question": f"《{title}》的颈联是：__________，__________。",
            "answer": f"{content[2] if len(content)>2 else '？'}；{content[3] if len(content)>3 else '？'}",
            "explanation": f"《{title}》的颈联是第3和第4句。",
            "knowledgePoints": ["诗歌结构", author, title, "颈联"]
        },
        {
            "question": f"《{title}》中最能体现诗人思乡之情的句子是：__________，__________。",
            "answer": f"{content[0] if len(content)>0 else '？'}；{content[1] if len(content)>1 else '？'}",
            "explanation": f"《{title}》通过这两句诗表达了诗人的思乡之情。",
            "knowledgePoints": ["思乡", author, title, "情感"]
        },
    ]

    tmpl = random.choice(templates)
    # 过滤太短的诗句
    if len(tmpl["answer"].replace('；', '').replace(' ', '')) < 6:
        return None

    return {
        "id": f"q_{grade}_und_{random.randint(10000,99999)}",
        "type": "understanding",
        "grade": grade,
        "source": "悟净补充题库",
        "difficulty": 3,
        "question": tmpl["question"],
        "options": [],
        "answer": tmpl["answer"],
        "explanation": tmpl["explanation"],
        "poemId": poem['id'],
        "knowledgePoints": tmpl["knowledgePoints"]
    }

# ============ 生成题目 ============
new_questions = []
used_poems = set()

# 年级分布权重
grade_weights = ['mk', 'mk', 'mk', 'fbc', 'fbc', 'fbc', 'chu1', 'chu1', 'chu2', 'zk']

# 生成选择题（目标100道）
print("生成选择题...")
count_choice = 0
attempts = 0
while count_choice < 100 and attempts < 300:
    attempts += 1
    poem = random.choice(poems)
    for qtype in ['author', 'title', 'theme']:
        if count_choice >= 100:
            break
        q = build_choice_question(poem, qtype, random.choice(grade_weights))
        if q and q['poemId'] not in used_poems:
            new_questions.append(q)
            used_poems.add(q['poemId'])
            count_choice += 1

# 生成理解题（目标50道）
print("生成理解题...")
count_und = 0
attempts = 0
while count_und < 50 and attempts < 200:
    attempts += 1
    poem = random.choice(poems)
    q = build_understanding_question(poem, random.choice(grade_weights))
    if q and q['poemId'] not in used_poems:
        new_questions.append(q)
        used_poems.add(q['poemId'])
        count_und += 1

print(f"生成完成：选择题{count_choice}道，理解题{count_und}道，共{len(new_questions)}道")

# 输出到文件
with open('/tmp/new_poetry_questions.json', 'w', encoding='utf-8') as f:
    json.dump(new_questions, f, ensure_ascii=False, indent=4)

print(f"已保存到 /tmp/new_poetry_questions.json")
print(f"前3道题预览：")
for q in new_questions[:3]:
    print(f"  [{q['type']}] {q['question'][:40]}... -> {q['answer'][:20]}")
