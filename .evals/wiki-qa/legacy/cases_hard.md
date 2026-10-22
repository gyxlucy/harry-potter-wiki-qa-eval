# 新增的高难度题(待你审阅)

共 15 题:解释性(为什么/怎么回事) 4、wiki 特有细节 9、没有依据/前提错误 2。

## 这批题为什么难

前 22 题已经饱和:事实题和'没有依据'的题,Sonnet、Opus、Haiku 三个模型全是满分。这批题针对这个应用真正会失败的地方出:
需要对不同页面的事实做计算、wiki 内部自相矛盾、记忆与法语 wiki 冲突、精确数数与完整列举、从表格里挑例外、跨段落综合、证据在长页面深处、隐蔽的错误前提、以及资料本身就是'未知'的问题。

**每个要点都核对过 wiki 原文。** 难度是我按设计判断的,**还没有用模型验证**。

## 总览

| id | 类型 | 难点 | 题目 | 要点数 |
|---|---|---|---|---|
| H01 | wiki 特有细节 | 计算 | 阿利安娜去世时,阿不思·邓布利多和格林德沃各是多大年纪? | 3 |
| H02 | wiki 特有细节 | 计算 | 哈利和纳威谁年长?相差几天? | 3 |
| H03 | wiki 特有细节 | 资料自相矛盾 | 汤姆·里德尔(伏地魔)的眼睛是什么颜色? | 3 |
| H04 | wiki 特有细节 | 资料自相矛盾 | 伏地魔一共制造了几个魂器?资料里的说法一致吗? | 3 |
| H06 | wiki 特有细节 | 数数/归属 | 邓布利多的信息框里列了几个别名?分别是谁起的? | 4 |
| H07 | wiki 特有细节 | 完整列举 | 列出伏地魔的每一个魂器,并说明各自是被谁、用什么毁掉的。 | 7 |
| H08 | wiki 特有细节 | 表格筛选 | 伏地魔的七个魂器里,哪一个不是在霍格沃茨范围内被毁掉的? | 3 |
| H09 | 解释性(为什么/怎么回事) | 多段综合 | 邓布利多为什么要安排让斯内普来结束自己的生命? | 4 |
| H10 | 解释性(为什么/怎么回事) | 时间线综合 | 按时间顺序概述邓布利多和格林德沃从相识到 1945 年的关系发展。 | 5 |
| H11 | wiki 特有细节 | 页面深处细节 | 资料里关于电影版伏地魔的外貌和结局,记载了哪些细节? | 3 |
| H12 | 没有依据/前提错误 | 隐蔽的错误前提 | 邓布利多在 1945 年击败格林德沃之后,当年就接任了霍格沃茨校长。他当上校长之前做了几年… | 2 |
| H13 | 没有依据/前提错误 | 隐蔽的错误前提 | 阿不福思为什么会在三把扫帚当酒保? | 1 |
| H14 | wiki 特有细节 | 数数/归属 | 邓布利多一共给哈利上了几节私人课?涉及哪些人的记忆? | 3 |
| H15 | 解释性(为什么/怎么回事) | 页面深处细节 | 哈利和伏地魔有血缘关系吗? | 3 |
| H16 | 解释性(为什么/怎么回事) | 资料本身未知 | 是邓布利多杀死了阿利安娜吗? | 3 |

## 逐题

### H01  ·  wiki 特有细节  ·  难点:计算

```
阿利安娜去世时,阿不思·邓布利多和格林德沃各是多大年纪?
```

好的回答必须包含:

1. 阿利安娜死于 1899 年 8 月  
   _出处_:Ariana Dumbledore 信息框:Mort=Août 1899
2. 阿不思生于 1881 年 7 月或 8 月,所以她去世时他是 17 岁或 18 岁,取决于具体的出生月份(资料没有给出更精确的日期)  
   _出处_:Albus Dumbledore 信息框:Naissance=Juillet ou Août 1881
3. 格林德沃生于 1883 年,资料写明他与阿不思相识时 16 岁,所以此时大约 16 岁  
   _出处_:Gellert Grindelwald 信息框:Naissance=1883;Albus Dumbledore:qui a seize ans

> 评分备注:资料没有给出精确日期,好的回答应给出区间或说明取决于生日,而不是断言单一的确切年龄。

### H02  ·  wiki 特有细节  ·  难点:计算

```
哈利和纳威谁年长?相差几天?
```

好的回答必须包含:

1. 哈利生于 1980 年 7 月 31 日  
   _出处_:Harry Potter 信息框:Naissance=31 juillet 1980
2. 纳威生于 1980 年 7 月 30 日  
   _出处_:Neville Londubat 信息框:Naissance=30 juillet 1980
3. 纳威年长,只差一天  
   _出处_:Harry Potter;Neville Londubat:Naissance=30 juillet 1980

### H03  ·  wiki 特有细节  ·  难点:资料自相矛盾

```
汤姆·里德尔(伏地魔)的眼睛是什么颜色?
```

好的回答必须包含:

1. 信息框写的是'棕色,后来变成红色'  
   _出处_:Tom Jedusor 信息框:Yeux=Marron puis rouges
2. 但同一页的正文论证他年轻时的眼睛是黑色(深色),与信息框的'棕色'不一致  
   _出处_:Tom Jedusor:Donc ses yeux sont noirs
3. 他后来把眼睛变成了两道猩红的细缝  
   _出处_:Tom Jedusor:deux fentes écarlates

> 评分备注:好的回答要指出资料内部的说法不一致,而不是只给出一个颜色。

### H04  ·  wiki 特有细节  ·  难点:资料自相矛盾

```
伏地魔一共制造了几个魂器?资料里的说法一致吗?
```

好的回答必须包含:

1. Horcruxe 页写:他创造了七个魂器,灵魂因此被分成八份(七个魂器加留在体内的一份)  
   _出处_:Horcruxe:Voldemort a créé sept Horcruxes;huit parties
2. 该页同时写明他原本打算只做六个,把灵魂分成七份  
   _出处_:Horcruxe:voulait en créer six
3. Tom Jedusor 页则写他按邓布利多的说法创造了六个魂器,两页的数字不一致  
   _出处_:Tom Jedusor:ayant créé six Horcruxes d'après Dumbledore

> 评分备注:可以接受'6 个有意制作,加上哈利这一个意外'的调和说法,但必须指出两个页面给出的数字不同。

### H06  ·  wiki 特有细节  ·  难点:数数/归属

```
邓布利多的信息框里列了几个别名?分别是谁起的?
```

好的回答必须包含:

1. 共 7 个别名  
   _出处_:Albus Dumbledore 信息框:Monsieur le Grand Directeur
2. Peeves 起了两个:Monsieur le Grand Directeur 和 Monsieur le Chef des professeurs  
   _出处_:Albus Dumbledore 信息框:Monsieur le Chef des professeurs
3. 科尔夫人(Mrs Cole)起了两个:Mr Dumberton 和 Mr Dunderbore  
   _出处_:Albus Dumbledore 信息框:Mr Dumberton
4. 其余三个:Dambleudore(奥林普·马克西姆)、Dumby(阿米库斯·卡罗)、Mr Fort-en-Thème(阿不福思)  
   _出处_:Albus Dumbledore 信息框:Dambleudore

### H07  ·  wiki 特有细节  ·  难点:完整列举

```
列出伏地魔的每一个魂器,并说明各自是被谁、用什么毁掉的。
```

好的回答必须包含:

1. 日记本:哈利用蛇怪的毒牙毁掉,在密室,1993 年 5 月 29 日  
   _出处_:Horcruxe:Journal intime de Tom Jedusor;29 mai 1993
2. 冈特家的戒指:邓布利多用格兰芬多宝剑毁掉,在霍格沃茨校长办公室,1996 年夏  
   _出处_:Horcruxe:Bague de Gaunt;Été 1996
3. 斯莱特林的挂坠盒:罗恩用格兰芬多宝剑毁掉,在迪恩森林,1997 年 12 月 28 日  
   _出处_:Horcruxe:Médaillon de Salazar Serpentard;28 décembre 1997
4. 赫奇帕奇的金杯:赫敏用蛇怪的毒牙毁掉,在密室,1998 年 5 月 2 日  
   _出处_:Horcruxe:Coupe de Helga Poufsouffle
5. 拉文克劳的冠冕:克拉布用厉火(Feudeymon)毁掉,在有求必应屋  
   _出处_:Horcruxe:Diadème de Rowena Serdaigle;Feudeymon
6. 哈利体内的碎片:被伏地魔自己的杀戮咒毁掉,在禁林,1998 年 5 月 2 日  
   _出处_:Horcruxe:Forêt interdite
7. 纳吉尼:纳威用格兰芬多宝剑毁掉,在霍格沃茨  
   _出处_:Horcruxe:Nagini

> 评分备注:要点是七项,每项都要有'谁'和'用什么'。漏掉一项或张冠李戴只算部分覆盖。

### H08  ·  wiki 特有细节  ·  难点:表格筛选

```
伏地魔的七个魂器里,哪一个不是在霍格沃茨范围内被毁掉的?
```

好的回答必须包含:

1. 是斯莱特林的挂坠盒  
   _出处_:Horcruxe:Médaillon de Salazar Serpentard
2. 它由罗恩用格兰芬多宝剑在迪恩森林毁掉,时间是 1997 年 12 月 28 日  
   _出处_:Horcruxe:Forêt de Dean
3. 其余的毁灭地点都在霍格沃茨内:密室(日记本和金杯)、校长办公室(戒指)、有求必应屋(冠冕)、禁林(哈利体内的碎片),纳吉尼也在霍格沃茨  
   _出处_:Horcruxe:Chambre des Secrets;Salle sur Demande;Forêt interdite

> 评分备注:把密室、有求必应屋、禁林归入霍格沃茨范围是常识推理,资料没有明说;只要结论是挂坠盒并给出理由即可。

### H09  ·  解释性(为什么/怎么回事)  ·  难点:多段综合

```
邓布利多为什么要安排让斯内普来结束自己的生命?
```

好的回答必须包含:

1. 他戴上冈特戒指触发了诅咒,斯内普只能把诅咒暂时封在他戴戒指的手上,告诉他一年之内会死  
   _出处_:Albus Dumbledore:bloquer le sortilège dans la main portant la bague
2. 伏地魔命令德拉科去杀邓布利多;由斯内普来做,同时保护德拉科不至于彻底堕入黑魔法  
   _出处_:Albus Dumbledore:protège également Drago de sombrer
3. 他希望自己离场时免受残害和痛苦,越快越好  
   _出处_:Albus Dumbledore:sans mutilation et sans souffrance
4. 他还希望借此成为老魔杖最后的主人并保持不被击败:斯内普是帮他的忙,不能算凶手  
   _出处_:Albus Dumbledore:le dernier propriétaire de la Baguette de Sureau

> 评分备注:这四点分散在邓布利多页同一章节的不同段落里,需要综合;允许把它们串成连贯的解释。

### H10  ·  解释性(为什么/怎么回事)  ·  难点:时间线综合

```
按时间顺序概述邓布利多和格林德沃从相识到 1945 年的关系发展。
```

好的回答必须包含:

1. 两人年轻时相识,格林德沃当时 16 岁;阿不思把他当作'平等的人',两人发展出热烈的恋爱关系  
   _出处_:Albus Dumbledore:qui a seize ans
2. 两人一起谋划新的巫师秩序,并对死亡圣器着迷,用圣器的符号作为签名  
   _出处_:Gellert Grindelwald:symbole des Reliques comme signature
3. 阿利安娜在三方混战中死去;格林德沃当天就匆忙离开了这个国家  
   _出处_:Gellert Grindelwald:part précipitemment du pays le jour même
4. 格林德沃后来从格雷戈洛维奇手里夺走了老魔杖  
   _出处_:Gellert Grindelwald:retrouver la trace de la Baguette de Sureau chez Gregorovitch
5. 1945 年在整个巫师界的一致请求下,邓布利多出面与他决斗并将其俘虏  
   _出处_:Gellert Grindelwald:Duel contre Albus Dumbledore

> 评分备注:回答应大致按时间顺序;顺序明显错乱的要点只算部分覆盖。

### H11  ·  wiki 特有细节  ·  难点:页面深处细节

```
资料里关于电影版伏地魔的外貌和结局,记载了哪些细节?
```

好的回答必须包含:

1. 电影里的伏地魔没有红眼睛,也没有竖瞳  
   _出处_:Tom Jedusor:n'a pas les yeux rouges
2. 拍摄时拉尔夫·费因斯脸上贴着点,以便后期把鼻子抹掉  
   _出处_:Tom Jedusor:l'effacement de son nez
3. 结尾他不是简单地向后倒下,而是身体慢慢分解,残骸被风吹走  
   _出处_:Tom Jedusor:son corps se décompose lentement

> 评分备注:这三条在 Tom Jedusor 页靠近末尾的'趣闻'部分,离信息框和开头很远。

### H12  ·  没有依据/前提错误  ·  难点:隐蔽的错误前提

```
邓布利多在 1945 年击败格林德沃之后,当年就接任了霍格沃茨校长。他当上校长之前做了几年变形课教授?
```

好的回答必须包含:

1. 必须指出前提不对:资料写的是 1945 年他击败格林德沃,而担任校长是从 1956 年起,中间隔了十一年  
   _出处_:Albus Dumbledore:depuis 1956;en 1945
2. 资料没有记载他当变形课教授的具体年数,只说他继任校长之前是变形课教授  
   _出处_:Albus Dumbledore:il était professeur de métamorphose

> 评分备注:顺着'当年就接任'的前提去算年数,判为失败。

### H13  ·  没有依据/前提错误  ·  难点:隐蔽的错误前提

```
阿不福思为什么会在三把扫帚当酒保?
```

好的回答必须包含:

1. 必须指出他是'猪头酒吧'(La Tête de Sanglier)的酒保,不是三把扫帚的  
   _出处_:Abelforth Dumbledore:barman de La Tête de Sanglier

> 评分备注:顺着'三把扫帚'的前提编造理由,判为失败。

### H14  ·  wiki 特有细节  ·  难点:数数/归属

```
邓布利多一共给哈利上了几节私人课?涉及哪些人的记忆?
```

好的回答必须包含:

1. 一共五节课,第五节是最后一节  
   _出处_:Leçons de Dumbledore:Cinquième et dernière leçon
2. 涉及的他人记忆:鲍勃·奥格登、卡拉克塔斯·伯克、莫芬·冈特、小精灵霍琪、霍拉斯·斯拉格霍恩  
   _出处_:Leçons de Dumbledore:Souvenir de Bob Ogden;Souvenir de Caractacus Beurk;Souvenir de Morfin Gaunt;Souvenir de l'elfe Hokey;Souvenir d'Horace Slughorn
3. 另外还有邓布利多自己的两段记忆(第二节和第四节)  
   _出处_:Leçons de Dumbledore:Premier souvenir d'Albus Dumbledore;Deuxième souvenir d'Albus Dumbledore

### H15  ·  解释性(为什么/怎么回事)  ·  难点:页面深处细节

```
哈利和伏地魔有血缘关系吗?
```

好的回答必须包含:

1. 资料称两人是非常远的远亲,通过佩弗利尔兄弟联系在一起  
   _出处_:Tom Jedusor:reliés par les frères Peverell
2. 依据是 J.K. 罗琳的说法:哈利和伏地魔是远房表亲  
   _出处_:Tom Jedusor:cousins éloignés
3. 信息框把卡德摩斯·佩弗利尔列为伏地魔的祖先  
   _出处_:Tom Jedusor 信息框:Cadmus Peverell (ancêtre)

> 评分备注:好的回答要说明这是'非常远'的关系,不是近亲。

### H16  ·  解释性(为什么/怎么回事)  ·  难点:资料本身未知

```
是邓布利多杀死了阿利安娜吗?
```

好的回答必须包含:

1. 资料写明:三方混战中阿利安娜被一道咒语击中身亡,没有人知道是谁的咒语  
   _出处_:Ariana Dumbledore;Gellert Grindelwald:personne ne sut jamais
2. 阿不福思一直把这件事归咎于阿不思  
   _出处_:Ariana Dumbledore:Abelforth a toujours attribué ce meurtre à Albus
3. 因此不能断言是他杀的,也不能断言不是他  
   _出处_:Ariana Dumbledore:personne ne sut jamais

> 评分备注:断言'是'或'不是'都算错。
