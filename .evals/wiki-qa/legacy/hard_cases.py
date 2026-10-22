"""Harder cases, added after the first 22 saturated (every model scored 1.00 on all fact and abstain cases).

Each case is hard for a specific reason that this app (query rewrite -> BM25 chunks -> grounded answer) can fail on:
  calc        needs arithmetic over facts from different pages, and the wiki's own dates are imprecise
  conflict    two places in the wiki disagree; a good answer notices instead of picking one
  count       exact count / attribution that is easy to get one off
  enumerate   every item of a list must be reported (partial credit for partial lists)
  filter      pick the exception out of a table; needs one inference the wiki does not state
  multihop    the answer is spread over several paragraphs or pages and must be synthesized
  synthesis   a chronological narrative assembled from two pages
  deep        the evidence sits deep in a long page (far from the infobox / intro)
  premise     the question hides a wrong premise that is easy to go along with
  uncertain   the wiki itself says the answer is unknown; asserting yes or no is wrong
H05 (a "memory trap" on the name Marvolo) was dropped: the wiki itself says Elvis Marvolo Gaunt. Every key point has been checked against the dump (see check_sources). type is the grading mode: explain / fact / abstain.
"""

HARD = [
    dict(id="H01", type="fact", kind="calc", origin="hard-set",
         q="阿利安娜去世时,阿不思·邓布利多和格林德沃各是多大年纪?",
         points=[
             ("阿利安娜死于 1899 年 8 月", "Ariana Dumbledore 信息框:Mort=Août 1899"),
             ("阿不思生于 1881 年 7 月或 8 月,所以她去世时他是 17 岁或 18 岁,取决于具体的出生月份(资料没有给出更精确的日期)", "Albus Dumbledore 信息框:Naissance=Juillet ou Août 1881"),
             ("格林德沃生于 1883 年,资料写明他与阿不思相识时 16 岁,所以此时大约 16 岁", "Gellert Grindelwald 信息框:Naissance=1883;Albus Dumbledore:qui a seize ans"),
         ],
         note="资料没有给出精确日期,好的回答应给出区间或说明取决于生日,而不是断言单一的确切年龄。"),
    dict(id="H02", type="fact", kind="calc", origin="hard-set",
         q="哈利和纳威谁年长?相差几天?",
         points=[
             ("哈利生于 1980 年 7 月 31 日", "Harry Potter 信息框:Naissance=31 juillet 1980"),
             ("纳威生于 1980 年 7 月 30 日", "Neville Londubat 信息框:Naissance=30 juillet 1980"),
             ("纳威年长,只差一天", "Harry Potter;Neville Londubat:Naissance=30 juillet 1980"),
         ], note=""),
    dict(id="H03", type="fact", kind="conflict", origin="hard-set",
         q="汤姆·里德尔(伏地魔)的眼睛是什么颜色?",
         points=[
             ("信息框写的是'棕色,后来变成红色'", "Tom Jedusor 信息框:Yeux=Marron puis rouges"),
             ("但同一页的正文论证他年轻时的眼睛是黑色(深色),与信息框的'棕色'不一致", "Tom Jedusor:Donc ses yeux sont noirs"),
             ("他后来把眼睛变成了两道猩红的细缝", "Tom Jedusor:deux fentes écarlates"),
         ],
         note="好的回答要指出资料内部的说法不一致,而不是只给出一个颜色。"),
    dict(id="H04", type="fact", kind="conflict", origin="hard-set",
         q="伏地魔一共制造了几个魂器?资料里的说法一致吗?",
         points=[
             ("Horcruxe 页写:他创造了七个魂器,灵魂因此被分成八份(七个魂器加留在体内的一份)", "Horcruxe:Voldemort a créé sept Horcruxes;huit parties"),
             ("该页同时写明他原本打算只做六个,把灵魂分成七份", "Horcruxe:voulait en créer six"),
             ("Tom Jedusor 页则写他按邓布利多的说法创造了六个魂器,两页的数字不一致", "Tom Jedusor:ayant créé six Horcruxes d'après Dumbledore"),
         ],
         note="可以接受'6 个有意制作,加上哈利这一个意外'的调和说法,但必须指出两个页面给出的数字不同。"),
    dict(id="H06", type="fact", kind="count", origin="hard-set",
         q="邓布利多的信息框里列了几个别名?分别是谁起的?",
         points=[
             ("共 7 个别名", "Albus Dumbledore 信息框:Monsieur le Grand Directeur"),
             ("Peeves 起了两个:Monsieur le Grand Directeur 和 Monsieur le Chef des professeurs", "Albus Dumbledore 信息框:Monsieur le Chef des professeurs"),
             ("科尔夫人(Mrs Cole)起了两个:Mr Dumberton 和 Mr Dunderbore", "Albus Dumbledore 信息框:Mr Dumberton"),
             ("其余三个:Dambleudore(奥林普·马克西姆)、Dumby(阿米库斯·卡罗)、Mr Fort-en-Thème(阿不福思)", "Albus Dumbledore 信息框:Dambleudore"),
         ], note=""),
    dict(id="H07", type="fact", kind="enumerate", origin="hard-set",
         q="列出伏地魔的每一个魂器,并说明各自是被谁、用什么毁掉的。",
         points=[
             ("日记本:哈利用蛇怪的毒牙毁掉,在密室,1993 年 5 月 29 日", "Horcruxe:Journal intime de Tom Jedusor;29 mai 1993"),
             ("冈特家的戒指:邓布利多用格兰芬多宝剑毁掉,在霍格沃茨校长办公室,1996 年夏", "Horcruxe:Bague de Gaunt;Été 1996"),
             ("斯莱特林的挂坠盒:罗恩用格兰芬多宝剑毁掉,在迪恩森林,1997 年 12 月 28 日", "Horcruxe:Médaillon de Salazar Serpentard;28 décembre 1997"),
             ("赫奇帕奇的金杯:赫敏用蛇怪的毒牙毁掉,在密室,1998 年 5 月 2 日", "Horcruxe:Coupe de Helga Poufsouffle"),
             ("拉文克劳的冠冕:克拉布用厉火(Feudeymon)毁掉,在有求必应屋", "Horcruxe:Diadème de Rowena Serdaigle;Feudeymon"),
             ("哈利体内的碎片:被伏地魔自己的杀戮咒毁掉,在禁林,1998 年 5 月 2 日", "Horcruxe:Forêt interdite"),
             ("纳吉尼:纳威用格兰芬多宝剑毁掉,在霍格沃茨", "Horcruxe:Nagini"),
         ], note="要点是七项,每项都要有'谁'和'用什么'。漏掉一项或张冠李戴只算部分覆盖。"),
    dict(id="H08", type="fact", kind="filter", origin="hard-set",
         q="伏地魔的七个魂器里,哪一个不是在霍格沃茨范围内被毁掉的?",
         points=[
             ("是斯莱特林的挂坠盒", "Horcruxe:Médaillon de Salazar Serpentard"),
             ("它由罗恩用格兰芬多宝剑在迪恩森林毁掉,时间是 1997 年 12 月 28 日", "Horcruxe:Forêt de Dean"),
             ("其余的毁灭地点都在霍格沃茨内:密室(日记本和金杯)、校长办公室(戒指)、有求必应屋(冠冕)、禁林(哈利体内的碎片),纳吉尼也在霍格沃茨", "Horcruxe:Chambre des Secrets;Salle sur Demande;Forêt interdite"),
         ],
         note="把密室、有求必应屋、禁林归入霍格沃茨范围是常识推理,资料没有明说;只要结论是挂坠盒并给出理由即可。"),
    dict(id="H09", type="explain", kind="multihop", origin="hard-set",
         q="邓布利多为什么要安排让斯内普来结束自己的生命?",
         points=[
             ("他戴上冈特戒指触发了诅咒,斯内普只能把诅咒暂时封在他戴戒指的手上,告诉他一年之内会死", "Albus Dumbledore:bloquer le sortilège dans la main portant la bague"),
             ("伏地魔命令德拉科去杀邓布利多;由斯内普来做,同时保护德拉科不至于彻底堕入黑魔法", "Albus Dumbledore:protège également Drago de sombrer"),
             ("他希望自己离场时免受残害和痛苦,越快越好", "Albus Dumbledore:sans mutilation et sans souffrance"),
             ("他还希望借此成为老魔杖最后的主人并保持不被击败:斯内普是帮他的忙,不能算凶手", "Albus Dumbledore:le dernier propriétaire de la Baguette de Sureau"),
         ], note="这四点分散在邓布利多页同一章节的不同段落里,需要综合;允许把它们串成连贯的解释。"),
    dict(id="H10", type="explain", kind="synthesis", origin="hard-set",
         q="按时间顺序概述邓布利多和格林德沃从相识到 1945 年的关系发展。",
         points=[
             ("两人年轻时相识,格林德沃当时 16 岁;阿不思把他当作'平等的人',两人发展出热烈的恋爱关系", "Albus Dumbledore:qui a seize ans"),
             ("两人一起谋划新的巫师秩序,并对死亡圣器着迷,用圣器的符号作为签名", "Gellert Grindelwald:symbole des Reliques comme signature"),
             ("阿利安娜在三方混战中死去;格林德沃当天就匆忙离开了这个国家", "Gellert Grindelwald:part précipitemment du pays le jour même"),
             ("格林德沃后来从格雷戈洛维奇手里夺走了老魔杖", "Gellert Grindelwald:retrouver la trace de la Baguette de Sureau chez Gregorovitch"),
             ("1945 年在整个巫师界的一致请求下,邓布利多出面与他决斗并将其俘虏", "Gellert Grindelwald:Duel contre Albus Dumbledore"),
         ], note="回答应大致按时间顺序;顺序明显错乱的要点只算部分覆盖。"),
    dict(id="H11", type="fact", kind="deep", origin="hard-set",
         q="资料里关于电影版伏地魔的外貌和结局,记载了哪些细节?",
         points=[
             ("电影里的伏地魔没有红眼睛,也没有竖瞳", "Tom Jedusor:n'a pas les yeux rouges"),
             ("拍摄时拉尔夫·费因斯脸上贴着点,以便后期把鼻子抹掉", "Tom Jedusor:l'effacement de son nez"),
             ("结尾他不是简单地向后倒下,而是身体慢慢分解,残骸被风吹走", "Tom Jedusor:son corps se décompose lentement"),
         ], note="这三条在 Tom Jedusor 页靠近末尾的'趣闻'部分,离信息框和开头很远。"),
    dict(id="H12", type="abstain", kind="premise", origin="hard-set",
         q="邓布利多在 1945 年击败格林德沃之后,当年就接任了霍格沃茨校长。他当上校长之前做了几年变形课教授?",
         points=[
             ("必须指出前提不对:资料写的是 1945 年他击败格林德沃,而担任校长是从 1956 年起,中间隔了十一年", "Albus Dumbledore:depuis 1956;en 1945"),
             ("资料没有记载他当变形课教授的具体年数,只说他继任校长之前是变形课教授", "Albus Dumbledore:il était professeur de métamorphose"),
         ], note="顺着'当年就接任'的前提去算年数,判为失败。"),
    dict(id="H13", type="abstain", kind="premise", origin="hard-set",
         q="阿不福思为什么会在三把扫帚当酒保?",
         points=[
             ("必须指出他是'猪头酒吧'(La Tête de Sanglier)的酒保,不是三把扫帚的", "Abelforth Dumbledore:barman de La Tête de Sanglier"),
         ], note="顺着'三把扫帚'的前提编造理由,判为失败。"),
    dict(id="H14", type="fact", kind="count", origin="hard-set",
         q="邓布利多一共给哈利上了几节私人课?涉及哪些人的记忆?",
         points=[
             ("一共五节课,第五节是最后一节", "Leçons de Dumbledore:Cinquième et dernière leçon"),
             ("涉及的他人记忆:鲍勃·奥格登、卡拉克塔斯·伯克、莫芬·冈特、小精灵霍琪、霍拉斯·斯拉格霍恩", "Leçons de Dumbledore:Souvenir de Bob Ogden;Souvenir de Caractacus Beurk;Souvenir de Morfin Gaunt;Souvenir de l'elfe Hokey;Souvenir d'Horace Slughorn"),
             ("另外还有邓布利多自己的两段记忆(第二节和第四节)", "Leçons de Dumbledore:Premier souvenir d'Albus Dumbledore;Deuxième souvenir d'Albus Dumbledore"),
         ], note=""),
    dict(id="H15", type="explain", kind="deep", origin="hard-set",
         q="哈利和伏地魔有血缘关系吗?",
         points=[
             ("资料称两人是非常远的远亲,通过佩弗利尔兄弟联系在一起", "Tom Jedusor:reliés par les frères Peverell"),
             ("依据是 J.K. 罗琳的说法:哈利和伏地魔是远房表亲", "Tom Jedusor:cousins éloignés"),
             ("信息框把卡德摩斯·佩弗利尔列为伏地魔的祖先", "Tom Jedusor 信息框:Cadmus Peverell (ancêtre)"),
         ], note="好的回答要说明这是'非常远'的关系,不是近亲。"),
    dict(id="H16", type="explain", kind="uncertain", origin="hard-set",
         q="是邓布利多杀死了阿利安娜吗?",
         points=[
             ("资料写明:三方混战中阿利安娜被一道咒语击中身亡,没有人知道是谁的咒语", "Ariana Dumbledore;Gellert Grindelwald:personne ne sut jamais"),
             ("阿不福思一直把这件事归咎于阿不思", "Ariana Dumbledore:Abelforth a toujours attribué ce meurtre à Albus"),
             ("因此不能断言是他杀的,也不能断言不是他", "Ariana Dumbledore:personne ne sut jamais"),
         ], note="断言'是'或'不是'都算错。"),
]
