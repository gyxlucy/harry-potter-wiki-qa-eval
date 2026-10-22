"""Single source of truth for the HP-wiki QA eval cases.

Writes cases.jsonl (what the runner will load) and cases.md (what the user reviews).
Every key point carries the wiki page it was checked against (latest revision, 2020-02-15 dump).
"""
import json, re, os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from hard_cases import HARD

HERE = os.path.dirname(os.path.abspath(__file__))

# type: explain = interpretive "why" question; fact = wiki-specific detail; abstain = no/false basis in wiki
CASES = [
    # ---------------- explain (12) ----------------
    dict(id="E01", type="explain", origin="user",
         q="为什么罗恩·韦斯莱在镜子中看到的是自己手捧学生会主席徽章、手拿魁地奇奖杯?",
         points=[
             ("镜子显示的是观看者最深的渴望", "Miroir du Riséd:Utilisation = Observer son désir le plus profond"),
             ("罗恩看到的是年长的自己:级长长(préfet-en-chef)、格兰芬多魁地奇队长,手里拿着四学院杯", "Miroir du Riséd:lui-même plus vieux, préfet-en-chef et capitaine… Coupe de Quidditch des Quatre Maisons"),
             ("罗恩一直从哥哥们那里接收一切、活在他们的阴影里,这是他渴望被认可的背景", "Ron Weasley:celui qui reçoit tout de ses frères et vit dans leur ombre"),
             ("身为'救世主最好的朋友'并不只有好处,他也承受着被比下去的感觉", "Ron Weasley:être le meilleur ami du Survivant n'a pas que des avantages"),
         ],
         note="接受把'渴望'与'阴影'连起来的合理推理;不得与要点中的事实矛盾。"),
    dict(id="E02", type="explain", origin="user (rewritten: only Grindelwald)",
         q="格林德沃崛起的二十多年里,邓布利多为什么迟迟不与他正面对决?核心的心理障碍是什么?",
         points=[
             ("年轻时阿不思与格林德沃关系亲密,wiki 写明两人有过热烈的恋爱关系", "Albus Dumbledore;Gellert Grindelwald:relation amoureuse, intense et passionnée"),
             ("妹妹阿利安娜死于阿不思、阿不福思与格林德沃的三方混战,谁的咒语击中她无人知晓", "Ariana Dumbledore;Gellert Grindelwald:personne ne sut jamais qui avait lancé le sortilège"),
             ("阿不福思一直把妹妹的死归咎于阿不思,并在葬礼上打断了他的鼻子", "Abelforth Dumbledore:blâme Albus… lui casse le nez"),
             ("邓布利多的博格特是妹妹的尸体,说明这件事至死未放下", "Albus Dumbledore 信息框:Epouvantard = Cadavre de sa sœur"),
             ("他最终是在 1945 年世界巫师界一致请求下才出面,与格林德沃决斗并将其俘虏", "Gellert Grindelwald:Duel contre Albus Dumbledore, 1945"),
         ],
         note="wiki 没有直接写'迟迟不肯',也没有写出'核心心理障碍'的结论。可以接受从要点推出的内疚、害怕得知真相、旧情等解释,但不能凭空断言 wiki 没有的情节,也不能与要点矛盾。"),
    dict(id="E03", type="explain", origin="user",
         q="按照J.K.罗琳设定的魔法规则,当一个人的灵魂被撕裂并放入魂器后,本体的灵魂会发生不可逆的残缺。为什么伏地魔在复活(《火焰杯》中利用哈利血液、骨头和仆人肉)之后,他的理智、外貌甚至情绪逻辑呈现出一种怎样的畸变?",
         points=[
             ("魂器的做法是撕裂灵魂并把一部分封进物品,据 wiki 伏地魔的灵魂被分成 8 份(7 个魂器加上留在体内的一份)", "Horcruxe:sept Horcruxes, son âme a donc été découpée en huit parties"),
             ("他为了追求永生,不惜残害自己的灵魂", "Tom Jedusor:mutiler son âme dans le seul but d'assouvir sa soif d'immortalité"),
             ("他年轻时是英俊的青年,黑魔法使他的容貌被毁损", "Tom Jedusor ===Apparence===:beau et élégant… avant de s'être mutilé"),
             ("复活用的是哈利的血、虫尾巴的肉和他父亲的骨,新身体瘦骨嶙峋、皮肤惨白、鼻子只剩两道缝", "Tom Jedusor:le sang de Harry, la chair de Queudver et les os de son père… squelettique, peau blafarde"),
             ("情感上:他没有守护神、无法产生快乐的念头,并且轻视爱", "Tom Jedusor 信息框:Patronus = Aucun, incapable de pensée heureuse;mépris pour l'Amour"),
         ],
         note="wiki 没有成段论述'灵魂残缺与理智、情绪畸变'的因果,允许从要点出发的合理推理,但推理必须与事实一致。"),
    dict(id="E04", type="explain", origin="synthesized",
         q="分院帽为什么差点把哈利分进斯莱特林,最后又为什么分进了格兰芬多?",
         points=[
             ("分院帽在斯莱特林上犹豫了很久", "Harry Potter:après avoir longuement hésité avec Serpentard"),
             ("最后是在哈利自己的坚持下才送进格兰芬多", "Harry Potter:sur l'insistance de Harry"),
         ],
         note="wiki 没有交代帽子犹豫的具体理由。不得编造帽子说过的话。(试点中删去了与问题无关的要点'分院帽由创始人制作',该事实由 F05 单独考查。)"),
    dict(id="E05", type="explain", origin="synthesized",
         q="斯内普为什么暗中保护哈利?他向邓布利多提了什么条件?",
         points=[
             ("莉莉和詹姆死后,邓布利多请他看在莉莉的份上保护哈利,因为伏地魔会回来", "Severus Rogue:Dumbledore lui demande de protéger Harry en mémoire de Lily"),
             ("斯内普答应了,条件是邓布利多永远不能告诉任何人", "Severus Rogue:Rogue accepte, mais demande à Dumbledore de ne jamais le dire à personne"),
             ("早先他曾请求伏地魔放过莉莉", "Lily Potter:l'épargner car Severus Rogue lui en a fait la demande"),
         ],
         note=""),
    dict(id="E06", type="explain", origin="synthesized",
         q="为什么杀戮咒对婴儿时期的哈利没有奏效,反而反弹到了伏地魔自己身上?",
         points=[
             ("伏地魔本来愿意放过莉莉(斯内普求过情),但莉莉拒绝让开", "Lily Potter:comme Lily refuse de s'écarter"),
             ("莉莉为保护儿子而死,这次爱的牺牲给了哈利强大的保护", "Lily Potter:son sacrifice dote Harry d'une protection due à son amour"),
             ("咒语因此反弹,部分摧毁了伏地魔", "Lily Potter:le sort ricoche sur lui, détruisant partiellement le mage noir"),
         ],
         note=""),
    dict(id="E07", type="explain", origin="synthesized",
         q="伏地魔拿到老魔杖之后,为什么仍然无法借它杀死哈利?",
         points=[
             ("老魔杖只忠于'强者的力量':主人被击败(被缴械或被杀死)时效忠立即转移给新的胜利者", "Baguette de Sureau:changera immédiatement d'allégeance si son maître est vaincu"),
             ("wiki 把德拉科列为'只是主人',伏地魔列为'只是持有者',最后一位主人是哈利", "Baguette de Sureau 信息框:Drago Malefoy (maître seulement), Tom Jedusor (propriétaire seulement), Harry Potter"),
             ("德拉科后来在马尔福庄园被哈利缴了械", "Drago Malefoy:Il se fait désarmer et se fait prendre sa baguette magique par Harry"),
         ],
         note="wiki 没有把'为什么伏地魔杀不了哈利'连成一句话,回答者需要把上面三点串起来。"),
    dict(id="E08", type="explain", origin="synthesized",
         q="海格为什么曾被学校开除?这件事后来怎样影响了他对邓布利多的态度?",
         points=[
             ("1943 年他被错误地开除,当时的校长相信了汤姆·里德尔的指控", "Rubeus Hagrid:renvoyé, à tort, en 1943 … accusations de Tom Jedusor"),
             ("汤姆让人以为密室里放出的怪物是海格养的阿拉戈克", "Rubeus Hagrid:l'Acromentule… Aragog"),
             ("从那时起海格对邓布利多极为敬重,愿意把性命托付给他", "Rubeus Hagrid:il tient Dumbledore en très haute estime… lui confierait sa propre vie"),
         ],
         note=""),
    dict(id="E09", type="explain", origin="synthesized",
         q="为什么说纳威·隆巴顿也符合那个预言里的描述?",
         points=[
             ("预言说的是七月底出生的孩子,而纳威生于 1980 年 7 月 30 日", "Neville Londubat:Naissance = 30 juillet 1980;né à la fin du mois de juillet"),
             ("预言说这个孩子的父母曾三次挑战黑魔王,纳威的父母弗兰克和爱丽丝都是傲罗", "Neville Londubat:Frank et Alice Londubat, des Aurors… défié le Seigneur des Ténèbres par trois fois"),
             ("1981 年 10 月 31 日他的父母遭钻心咒折磨", "Neville Londubat:le 31 octobre 1981, les parents de Neville sont torturés"),
         ],
         note=""),
    dict(id="E10", type="explain", origin="synthesized",
         q="伏地魔一生鼓吹血统纯粹,可他自己的出身有哪些讽刺之处?",
         points=[
             ("他自己是混血", "Tom Jedusor 信息框:Sang = Sang-Mêlé"),
             ("他的父亲老汤姆·里德尔是麻瓜,得知妻子是女巫、靠爱情魔药骗了自己之后抛弃了她", "Tom Jedusor:Tom Jedusor Sr. abandonna Merope… philtre d'amour"),
             ("他是萨拉查·斯莱特林的后裔", "Tom Jedusor 信息框:Salazar Serpentard (ancêtre)"),
             ("他一生轻视爱,却是爱情魔药的产物", "Tom Jedusor:mépris pour l'Amour;philtre d'amour"),
         ],
         note="'讽刺'是评价,要点是事实;接受合理推理。"),
    dict(id="E11", type="explain", origin="synthesized",
         q="邓布利多为什么会戴上冈特家的戒指?他为此付出了什么代价?",
         points=[
             ("这枚戒指既是魂器,也是死亡圣器之一的复活石", "Albus Dumbledore:à la fois un Horcruxe et la Pierre de Résurrection"),
             ("他被'再看一眼阿利安娜和父母'的渴望蒙蔽,忍不住戴上了它", "Albus Dumbledore:aveuglé par son fol espoir de revoir… Ariana et de ses parents"),
             ("戒指上有强大的保护咒,是斯内普及时出手把咒语封在他戴戒指的手上才保住了他的命", "Albus Dumbledore:Rogue… bloquer le sortilège dans la main portant la bague"),
         ],
         note=""),
    dict(id="E12", type="explain", origin="synthesized",
         q="西里斯·布莱克出身于布莱克家族,他和自己的家族是什么关系?",
         points=[
             ("他在格兰芬多,是凤凰社成员", "Sirius Black 信息框:Affiliation = Ordre du Phénix, Gryffondor"),
             ("他与布莱克家族的关系是被'renié'(逐出/除名)", "Sirius Black 信息框:Famille Black (renié)"),
             ("他的父母是奥赖恩和沃尔布加,弟弟是雷古勒斯", "Sirius Black 信息框:Orion Black (père), Walburga Black (mère), Regulus Black (frère)"),
         ],
         note="wiki 此页没有解释他与家族决裂的原因,不得编造。"),

    # ---------------- fact (6) ----------------
    dict(id="F01", type="fact", origin="synthesized",
         q="邓布利多的全名和生卒年份是什么?他从哪一年起担任霍格沃茨校长?",
         points=[
             ("全名 Albus Perceval Wulfric Brian Dumbledore", "Albus Dumbledore 首句"),
             ("生于 1881 年,卒于 1997 年 6 月 30 日", "Albus Dumbledore 首句:(1881 - 30 juin 1997)"),
             ("自 1956 年起担任校长", "Albus Dumbledore 首句:directeur … depuis 1956"),
         ], note=""),
    dict(id="F02", type="fact", origin="synthesized",
         q="历史上第一个创造出魂器的巫师是谁?",
         points=[("赫波·卑鄙者(Herpo l'Infâme / Herpo the Foul)", "Herpo l'Infâme:premier sorcier à créer un Horcruxe;Horcruxe 页同")], note=""),
    dict(id="F03", type="fact", origin="synthesized",
         q="法语配音版里,邓布利多由哪些配音演员配音?",
         points=[("Marc Cassot 和 Alexis Victor", "Albus Dumbledore 信息框:Doubleur VF = Marc Cassot, Alexis Victor")],
         note="这是只有查 wiki 信息框才能答的题,用来检验检索。"),
    dict(id="F04", type="fact", origin="synthesized",
         q="伏地魔的灵魂最终被分成了几份?他原本打算分成几份?",
         points=[
             ("最终分成 8 份(7 个魂器加上留在体内的一份)", "Horcruxe:sept Horcruxes… huit parties"),
             ("原本打算分成 7 份(做 6 个魂器)", "Horcruxe:voulait en créer six, soit découper son âme en sept"),
         ],
         note="wiki 的 Tom Jedusor 页里另有一处写他'创造了六个魂器(据邓布利多)',与 Horcruxe 页的'七个'说法不同,评分时以 Horcruxe 页为准,并接受'6 个有意制作+哈利这一个意外'的说法。"),
    dict(id="F05", type="fact", origin="synthesized",
         q="分院帽是谁制作的,它最初属于谁?",
         points=[("由霍格沃茨的四位创始人制作", "Choixpeau magique 信息框:Fabricant"),
                 ("最初属于戈德里克·格兰芬多", "Choixpeau magique 信息框:Propriétaire = Godric Gryffondor (à l'origine)")], note=""),
    dict(id="F06", type="fact", origin="synthesized",
         q="汤姆·里德尔(伏地魔)的出生日期和死亡日期是什么时候?",
         points=[("生于 1926 年 12 月 31 日", "Tom Jedusor 信息框:Naissance = 31 décembre 1926"),
                 ("死于 1998 年 5 月 2 日", "Tom Jedusor 信息框:Mort = 2 mai 1998")], note=""),

    # ---------------- abstain / false premise (4) ----------------
    dict(id="U01", type="abstain", origin="synthesized (false premise)",
         q="邓布利多在厄里斯魔镜里看到自己手捧魁地奇奖杯,这反映了他怎样的内心渴望?",
         points=[
             ("必须指出前提不对:wiki 里手拿四学院杯的是罗恩,不是邓布利多", "Miroir du Riséd:Ron… avec la Coupe de Quidditch des Quatre Maisons"),
             ("邓布利多对哈利说他看到的是自己手里拿着一双厚羊毛袜", "Miroir du Riséd:bonne paire de chaussettes de laine"),
         ],
         note="顺着错误前提去编造'他的渴望',判为失败。"),
    dict(id="U02", type="abstain", origin="synthesized (false premise)",
         q="哈利和金妮的第四个孩子叫什么名字?",
         points=[
             ("必须指出没有第四个孩子", "Harry Potter 信息框只列出三个孩子"),
             ("wiki 列出的三个孩子是詹姆、阿不思和莉莉", "Harry Potter 信息框:James Potter II, Albus Potter, Lily Potter II"),
         ],
         note="编造出第四个孩子的名字,判为失败。"),
    dict(id="U03", type="abstain", origin="synthesized (out of corpus)",
         q="《霍格沃茨之遗》这款游戏的剧情是怎样的?",
         points=[("应说明提供的 wiki 资料里没有这部分内容(这份备份截止于 2020-02-15,'Hogwarts Legacy' 与'Legs de Poudlard'均 0 命中)", "全库检索:0 命中")],
         note="如果应用允许使用资料之外的知识,必须明确标注这不是来自 wiki;这一点取决于 Step 3 里定的应用规则。"),
    dict(id="U04", type="abstain", origin="synthesized (not recorded)",
         q="邓布利多在古灵阁的私人金库编号是多少?",
         points=[
             ("应说明 wiki 里没有记录他的私人金库编号", "全库检索:无记录"),
             ("不能把 713 当作答案:713 是被取走魔法石的那个金库,不是他的私人金库", "Lettre d'Albus Dumbledore au chef des gobelins de Gringotts:Retirer la Pierre philosophale du coffre 713"),
         ],
         note="这一题故意埋了一个相近的数字作为陷阱。"),
]

TYPE_LABEL = {"explain": "解释性(为什么/怎么回事)", "fact": "wiki 特有细节", "abstain": "没有依据/前提错误"}
KIND_LABEL = {"calc": "计算", "conflict": "资料自相矛盾", "memory-trap": "记忆陷阱", "count": "数数/归属", "enumerate": "完整列举",
              "filter": "表格筛选", "multihop": "多段综合", "synthesis": "时间线综合", "deep": "页面深处细节", "premise": "隐蔽的错误前提", "uncertain": "资料本身未知"}
ALL = CASES + HARD


def fence_for(text):
    longest = max([len(m) for m in re.findall(r"`+", text)] + [2])
    return "`" * (longest + 1)


def tags_of(c):
    return [c["type"]] + (["hard:" + c["kind"]] if c.get("kind") else [])


def render(cases, title, intro):
    counts = {k: sum(1 for c in cases if c["type"] == k) for k in TYPE_LABEL}
    L = [f"# {title}\n", f"共 {len(cases)} 题:" + "、".join(f"{TYPE_LABEL[k]} {v}" for k, v in counts.items()) + "。\n", intro, "## 总览\n",
         "| id | 类型 | 难点 | 题目 | 要点数 |", "|---|---|---|---|---|"]
    for c in cases:
        q = c["q"].replace("|", "\\|")
        q = q if len(q) <= 46 else q[:45] + "…"
        L.append(f"| {c['id']} | {TYPE_LABEL[c['type']]} | {KIND_LABEL.get(c.get('kind'), '-')} | {q} | {len(c['points'])} |")
    L += ["", "## 逐题\n"]
    for c in cases:
        fq = fence_for(c["q"])
        k = f"  ·  难点:{KIND_LABEL[c['kind']]}" if c.get("kind") else ""
        L.append(f"### {c['id']}  ·  {TYPE_LABEL[c['type']]}{k}\n")
        L.append(f"{fq}\n{c['q']}\n{fq}\n")
        L.append("好的回答必须包含:\n")
        for i, (t, src) in enumerate(c["points"], 1):
            L.append(f"{i}. {t}  \n   _出处_:{src}")
        if c["note"]:
            L.append(f"\n> 评分备注:{c['note']}")
        L.append("")
    return "\n".join(L)


def main():
    with open(os.path.join(HERE, "cases.jsonl"), "w", encoding="utf-8") as f:
        for c in ALL:
            row = dict(prompt_id=c["id"], prompt=c["q"], tags=tags_of(c), origin=c["origin"],
                       expected=dict(key_points=[dict(text=t, source=s) for t, s in c["points"]], note=c["note"]))
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
    intro_all = ("## 说明\n\n1. **标准答案来自 wiki 原文,不是任何模型的输出。** 每个要点都标了出处。\n"
                 "2. **这是粉丝 wiki,本身会有小错或前后不一**,相关题目已在评分备注里写明口径。\n"
                 "3. **应用规则(假设):** 只依据检索到的资料回答并给出处;资料里没有就明确说没有。\n")
    with open(os.path.join(HERE, "cases.md"), "w", encoding="utf-8") as f:
        f.write(render(ALL, "HP wiki 问答 eval:全部题集", intro_all))
    intro_hard = ("## 这批题为什么难\n\n前 22 题已经饱和:事实题和'没有依据'的题,Sonnet、Opus、Haiku 三个模型全是满分。这批题针对这个应用真正会失败的地方出:\n"
                  "需要对不同页面的事实做计算、wiki 内部自相矛盾、记忆与法语 wiki 冲突、精确数数与完整列举、从表格里挑例外、跨段落综合、证据在长页面深处、隐蔽的错误前提、以及资料本身就是'未知'的问题。\n\n"
                  "**每个要点都核对过 wiki 原文。** 难度是我按设计判断的,**还没有用模型验证**。\n")
    with open(os.path.join(HERE, "cases_hard.md"), "w", encoding="utf-8") as f:
        f.write(render(HARD, "新增的高难度题(待你审阅)", intro_hard))
    print("cases:", len(ALL), {k: sum(1 for c in ALL if c['type'] == k) for k in TYPE_LABEL}, "| hard:", len(HARD))


if __name__ == "__main__":
    main()
