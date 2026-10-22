# batch-bio: character biography, family trees, dates and timeline arithmetic

Wiki: French Harry Potter wiki snapshot (2020-02-15) via the public API. All source fragments verified as exact substrings of `/page` text (see check below). Five cases; ids BI01-BI05.

## BI01

**Prompt:** Why did Hagrid say “it’s bin me home since I was thirteen” in Half-Blood Prince (HBP, chapter 29)? Did he join Hogwarts later or was he only counting the time after his expulsion?

**Tags:** explain, hard:calc, hard:conflict

**Web source:** https://www.reddit.com/r/harrypotter/comments/1ggvanv/why_did_hagrid_say_its_bin_me_home_since_i_was/

**Exact page title:** Why did Hagrid say “it’s bin me home since I was thirteen” in HBP (C29)? Did he join Hogwarts later or was he only counting the time after his expulsion? : r/harrypotter (opened and read; OP + comments)

**Origin / adaptation:** verbatim title with 'HBP (C29)' spelled out as 'Half-Blood Prince (HBP, chapter 29)'

**Aspect:** Character biography / timeline arithmetic (Hagrid; age at arrival, father's death, expulsion)

**Why it is hard:** Needs the birth date plus three dated events spread over two pages (Rubeus Hagrid, Père de Rubeus Hagrid), a computed age at each, and a conflict/vagueness: the Hagrid page says 'douze ans' while 'second year' + 6 Dec birthday gives 12 or 13. The quoted HBP line is not in the wiki, so the agent must not invent an explanation.

**Key points (text, then source):**

1. Hagrid entered Hogwarts in 1940. Born 6 December 1928 (Rubeus Hagrid infobox: 'Naissance: 6 décembre 1928'), he was 11 on arrival, so he did not join at thirteen.
   - source: `Rubeus Hagrid: Hagrid fut élève à Poudlard, dans la maison Gryffondor, où il arriva en 1940.`
2. His wizard father died during Hagrid's second year at Hogwarts; the father's infobox dates the death to 1941-1942.
   - source: `Père de Rubeus Hagrid: Il est décédé quand son fils était en deuxième année.`
3. The Hagrid page itself says the father died when Hagrid was only twelve. Given the 6 December birthday, a death in the 1941-42 school year puts him at 12 (before 6 Dec 1941) or 13 (after), so the wiki does not pin down 'thirteen' but does link the loss of his home life to roughly that age.
   - source: `Rubeus Hagrid: mort quand Hagrid n'avait que douze ans`
4. He was expelled in 1943, which (computed from a December 1928 birthday) makes him 14, not 13, at expulsion; so 'since I was thirteen' does not match the expulsion age either.
   - source: `Rubeus Hagrid: il fut renvoyé, à tort, en 1943`
5. The wiki does not quote or explain the Half-Blood Prince line 'it's been my home since I was thirteen'; any explanation of that exact line is inference.
   - source: `absence; checked: searches 'treize ans Hagrid', 'chez moi depuis treize', 'foyer Hagrid treize ans', 'depuis mes treize ans', 'Poudlard ma maison Hagrid fermer l'école McGonagall'; pages Rubeus Hagrid, Père de Rubeus Hagrid`

**Judge note:** Accept an answer that (a) says he started in 1940 aged 11, (b) uses the father's death in second year (1941-42, 'douze ans' on the Hagrid page, so 12 or 13) as the wiki-supported link to the 'thirteen' remark, and (c) says expulsion in 1943 was at age 14 so it does not fit 'thirteen'. It should flag that the wiki never mentions the HBP line and that the Hagrid page ('douze ans') and the dates leave 12 vs 13 open. Reject: asserting the wiki confirms Hagrid said or explained that line; claiming he joined Hogwarts at 13; claiming he was expelled at 13; inventing a reason (e.g. Ogg's hut, ward of Hogwarts, apprenticeship) not in the retrieved text.

## BI02

**Prompt:** I'm trying to figure out how Draco Malfoy is related to Sirius and Regulus Black. I know that Bellatrix is Narcissa's sister and Sirius' cousin, so she's Draco's aunt. What does that make Sirius and Regulus, in relation to Draco Malfoy? Are they second-cousins or his cousins-once-removed, or....?

**Tags:** fact, hard:multihop, hard:compare

**Web source:** https://www.reddit.com/r/harrypotter/comments/g7zlih/question_about_black_family_tree/

**Exact page title:** Question about Black family tree : r/harrypotter (opened and read; OP + comments)

**Origin / adaptation:** verbatim

**Aspect:** Family trees (Black / Malfoy / Tonks)

**Why it is hard:** No single page states the Draco-Sirius relationship. Needs Drago Malefoy (mother, maternal grandfather) + Cygnus Black III (sister Walburga, nephews Sirius and Regulus) + Narcissa Malefoy (cousins), then genealogical degree arithmetic (first cousin once removed vs second cousin). Tests that the agent does not just guess 'second cousins'.

**Key points (text, then source):**

1. Draco's mother is Narcissa Malefoy (née Black).
   - source: `Drago Malefoy: fils unique de Lucius Malefoy et de Narcissa Malefoy`
2. Draco's maternal grandfather is Cygnus Black III (father of Narcissa, Bellatrix and Andromeda).
   - source: `Drago Malefoy: Cygnus Black III (grand-père maternel)`
3. Cygnus Black III's sister is Walburga (mother of Sirius and Regulus); his page lists Sirius and Regulus as his nephews, i.e. they are first cousins of Draco's mother.
   - source: `Cygnus Black III: Sirius Black (neveu)`
4. Narcissa's page confirms that Sirius and Regulus are her cousins (cousin/cousine). Therefore, by derivation, they are Draco's first cousins once removed (first cousins of his mother), not second cousins.
   - source: `Narcissa Malefoy: Sirius Black (cousin)`
5. The wiki never states the term 'once removed' / degree for Draco-Sirius; no Drago Malefoy infobox entry links him to Sirius or Regulus. The answer is derived from the family lists.
   - source: `absence; checked: searches 'cousin au premier degré', 'cousins germains', 'cousin issu de germain', 'Drago Malefoy cousin Sirius Black'; pages Drago Malefoy, Sirius Black, Regulus Black, Narcissa Malefoy, Cygnus Black III, Walburga Black, Famille Black`

**Judge note:** Gold answer: Sirius and Regulus are Draco's first cousins once removed (cousins of his mother Narcissa; nephews of his maternal grandfather Cygnus III). Accept equivalent phrasing such as 'mother's first cousins', 'a generation apart'. Reject 'second cousins', 'uncles', 'half-brothers', or claiming the wiki states the phrase 'cousin once removed' outright. Tonks's page labels Sirius 'cousin éloigné' while Andromeda's, Narcissa's, Bellatrix's pages say plain 'cousin'; do not penalize an answer that notes this looseness, but the degree must still come out as first-cousin-once-removed.

## BI03

**Prompt:** Arthur and Molly Weasley end up with twelve grandchildren, but only three of them are male Weasleys who will continue the family name. Is that right? How many grandchildren do they have, and which of the boys carry the Weasley surname?

**Tags:** fact, hard:count, hard:multihop

**Web source:** https://www.reddit.com/r/harrypotter/comments/1x2g5ja/do_pure_blood_families_struggle_with_having/

**Exact page title:** Do pure blood families struggle with having children? : r/harrypotter (opened; OP text visible in search result: 'Fast forward 19 years, and we see Arthur and Molly with twelve grandchildren, but only three of them are male Weasleys who will continue the family name.')

**Origin / adaptation:** the thread 'Do pure blood families struggle with having children?' states 'we see Arthur and Molly with twelve grandchildren, but only three of them are male Weasleys who will continue the family name'; turned that statement into a verification question and added the 'which boys' ask

**Aspect:** Count of relatives (Weasley grandchildren, surnames)

**Why it is hard:** Count of 12 must be tallied from infobox lines (done programmatically: 12 = 5 + 7), then filtered by sex and surname across five children's pages (Louis, Fred II, Hugo Granger-Weasley vs the Potter boys). Hyphenated surname and name variants (James Potter II vs James Sirius Potter in Famille Weasley) are traps.

**Key points (text, then source):**

1. Arthur's page lists 12 grandchildren (counted programmatically from the infobox: 5 petits-fils and 7 petites-filles): Victoire, Dominique, Louis, Molly II, Lucy, Fred II, Roxanne, Rose, Hugo, James II, Albus, Lily II.
   - source: `Arthur Weasley: - Lily Potter II (petite-fille)`
2. Molly's page lists the same 12 grandchildren (also 5 grandsons, 7 granddaughters by programmatic count).
   - source: `Molly Weasley: - Hugo Granger-Weasley (petit-fils)`
3. Boy 1 of 3 with a Weasley surname: Louis Weasley, son of Bill and Fleur.
   - source: `Louis Weasley: Louis Weasley est le fils de Bill Weasley et de Fleur Delacour.`
4. Boy 2 of 3: Fred Weasley II, son of George and Angelina Johnson.
   - source: `Fred Weasley II: Fred Weasley est le fils de George Weasley et Angelina Johnson.`
5. Boy 3 of 3: Hugo Granger-Weasley, son of Ron and Hermione (double-barrelled surname). The other two grandsons, James Potter II and Albus Potter, are Ginny's sons and carry the Potter name, so the claim 'three male Weasleys' is right.
   - source: `Hugo Granger-Weasley: Hugo Granger-Weasley est le plus jeune fils de Ron Weasley et Hermione Granger.`

**Judge note:** Gold: yes - 12 grandchildren (5 boys, 7 girls); the boys with a Weasley surname are Louis, Fred II and Hugo (Granger-Weasley). Breakdown by parent from the children's pages: Bill 3 (Victoire, Dominique, Louis), Percy 2 (Molly II, Lucy), George 2 (Fred II, Roxanne), Ron 2 (Rose, Hugo), Ginny 3 (James, Albus, Lily); Charlie none listed. Accept either 'three' with Hugo counted via his hyphenated name, or 'two plus Hugo (Granger-Weasley)'. Reject any total other than 12 (e.g. counting Teddy Lupin, Victoire's spouse etc.), counting James/Albus as Weasley-surname boys, or inventing Charlie children.

## BI04

**Prompt:** What is Uncle Bilius' surname?

**Tags:** fact, hard:conflict, hard:multihop

**Web source:** https://www.reddit.com/r/harrypotter/comments/1uhp4b8/what_is_uncle_bilius_surname/

**Exact page title:** What is Uncle Bilius' surname? : r/harrypotter (title and comments confirmed via search result; direct page fetch returned an empty shell)

**Origin / adaptation:** verbatim post title; thread body could not be fetched, existence/title confirmed via search result

**Aspect:** Conflict / incomplete information (Weasley / Prewett family)

**Why it is hard:** The wiki pages disagree in confidence: Arthur Weasley's infobox says flatly 'Bilius Weasley', while Bilius, Molly Weasley, Septimus Weasley and Famille Prewett say he may be Molly's brother (Prewett). The right answer is 'probably Weasley but unconfirmed', not a flat answer.

**Key points (text, then source):**

1. Bilius is only described as the uncle of the Weasley children; the wiki gives him no surname (his infobox name is just 'Bilius').
   - source: `Bilius: Bilius était l'oncle des enfants Weasley.`
2. The Bilius page says he was probably the son of Septimus Weasley and Cedrella Black and Arthur's brother, but that this is not proven; he could instead be Molly's brother and thus a Prewett.
   - source: `Bilius: il ne peut être exclu qu'il soit le frère de Molly Weasley et donc un Prewett`
3. Conflict: Arthur Weasley's infobox states flatly that Arthur has two brothers, 'dont Bilius Weasley'.
   - source: `Arthur Weasley: Deux frères, dont Bilius Weasley`
4. Conflict: Molly Weasley's infobox lists Bilius as 'frère ou beau-frère' (brother or brother-in-law), leaving open that he is a Prewett.
   - source: `Molly Weasley: Bilius (frère ou beau-frère)`
5. Septimus Weasley's page also hedges: he is only 'peut-être' the father of Bilius.
   - source: `Septimus Weasley: Septimus Weasley est peut-être le père de Bilius.`

**Judge note:** Gold: the wiki does not settle it. Weasley is the more likely surname (Bilius presumed to be Arthur's brother, Septimus's son; Arthur's infobox and the Famille Weasley member list call him Weasley), but the Bilius, Molly, Septimus and Famille Prewett pages say it is unproven and he may be Molly's brother (Prewett). Accept 'probably Weasley, not confirmed, possibly Prewett'. Reject a flat 'Weasley' or flat 'Prewett' stated as established fact, and reject inventing a canon surname or relationship. Giving Weasley with the wiki's own hedge is fine; noting the Arthur-page vs Bilius-page disagreement is a plus.

## BI05

**Prompt:** Tonks and Lupin age difference: how many years apart were they, and how old was each of them when they died?

**Tags:** fact, hard:calc, hard:multihop

**Web source:** https://www.reddit.com/r/HPfanfiction/comments/fujhsh/tonks_and_lupin_age_difference/

**Exact page title:** Tonks and Lupin age difference : r/HPfanfiction (title and comment text confirmed via search result; direct fetch returned 403)

**Origin / adaptation:** thread title 'Tonks and Lupin age difference' turned into a full question with the 'how old when they died' ask; page returned 403 to fetch, existence/title confirmed via search result with comment text

**Aspect:** Date / age arithmetic (Lupin and Tonks)

**Why it is hard:** Needs dates from two pages (Remus Lupin full birth date; Nymphadora Tonks year-only birth) and the shared death date, then an age calculation with an uncertainty (Tonks 24 or 25) and a gap of about 13 years. The wiki mentions the age difference but never gives a number.

**Key points (text, then source):**

1. Remus Lupin was born on 10 March 1960.
   - source: `Remus Lupin: Naissance: 10 mars 1960`
2. Tonks's birth is given only as the year 1973 (no day or month).
   - source: `Nymphadora Tonks: Naissance: 1973`
3. Both died on 2 May 1998 (Battle of Hogwarts). Computed: Lupin was 38; Tonks was 24 or 25 depending on her unknown 1973 birthday (25 if born on or before 2 May).
   - source: `Nymphadora Tonks: Mort: 2 mai 1998`
4. The wiki acknowledges an age difference between them but gives no figure. From the dates the gap is about 13 years (1973 - 1960; between roughly 12.8 and 13.8 years given Tonks's unknown birthday).
   - source: `Nymphadora Tonks: abandonne ses réticences vis-à-vis de sa différence d'âge avec Tonks`

**Judge note:** Accept 'about 13 years' (or '12-13 years', '13 by birth year'), Lupin 38 at death, and Tonks 24 or 25 with an acknowledgment that her exact 1973 birthday is not given. Reject an invented Tonks birthday or exact-day gap, Tonks born 1972, a Lupin age other than 38, or claiming the wiki states the gap or the ages outright (it only gives birth dates/year and mentions an unquantified 'différence d'âge').


## Source check

Scripted check run after writing: every non-absence key-point source (page title, then fragment after the first ": ") is an exact substring of the `/page` text for that title, fragment <120 chars, no newline. Result: 0 failures across 21 checked sources (2 absence sources skipped: BI01, BI02).

## Rejected candidates

- Hagrid age when father died as a standalone question (superseded by BI01, same pages).
- r/harrypotter "Did Anybody Else Find Tonks and Lupin's relationship a little icky?" (opinion thread, no answerable question; replaced by the r/HPfanfiction age-difference thread).
- scifi.stackexchange.com/questions/163012 "Did Draco Malfoy know that he is related to Sirius Black?" (asks about Draco's knowledge, not answerable from wiki; the reddit relationship question was used instead).
