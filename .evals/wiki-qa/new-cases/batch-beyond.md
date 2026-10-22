# New eval cases: batch BEYOND (BY01-BY05)

Status: **DRAFT, not approved, not run.** Aspect: abstain, false-premise and wizarding history beyond the main story.

Wiki snapshot: French Harry Potter wiki, 2020-02-15, read through the hosted API. Every non-absence source fragment was script-checked as an exact substring of the text returned by `/page` for the cited title (large pages read in several chunks).

| id | tags | web source |
|---|---|---|
| BY01 | abstain, hard:partial | https://scifi.stackexchange.com/questions/154377/is-gringotts-the-only-wizarding-bank-in-the-wizarding-world |
| BY02 | abstain, hard:multihop | https://scifi.stackexchange.com/questions/170978/what-are-the-missing-three-schools |
| BY03 | fact, hard:premise | https://scifi.stackexchange.com/questions/170948/are-ilvermorny-and-the-salem-witches-institute-supposed-to-be-the-same-school |
| BY04 | explain, hard:premise, hard:conflict | https://www.reddit.com/r/harrypotter/comments/j24zp0/theory_the_statue_of_secrecy_was_signed_because/ |
| BY05 | explain, hard:deep, hard:multihop | https://scifi.stackexchange.com/questions/55525/how-and-why-was-the-ministry-of-magic-founded |

---

## BY01  (abstain, hard:partial)

**Prompt**

```text
Is Gringotts the only Wizarding Bank in the Wizarding World? Are there any other Wizarding Banks in other countries like the U.S.A., France, Bulgaria, etc.?
```

**Web source**: https://scifi.stackexchange.com/questions/154377/is-gringotts-the-only-wizarding-bank-in-the-wizarding-world

- Exact page title: *Is Gringotts the only Wizarding Bank in the Wizarding World? - Science Fiction & Fantasy Stack Exchange*
- Adaptation: title plus the body sentence, with the duplicated sentence in the body removed; question text confirmed through a search-result snippet because a direct fetch returned HTTP 403

**Aspect**: Wizarding economy / Gringotts / the world outside Britain. Clean abstain.

**Why it is hard**: The wiki has plenty of adjacent facts (Gringotts is a goblin-run bank in London; a New York bank, Steen National Bank, appears in the 1926 film) that tempt a confident 'yes, only one' or 'no, there is an American one' answer. The wiki never says whether other wizarding banks exist.

**Key points**

1. The wiki does not say whether Gringotts is the only wizarding bank, nor whether wizarding banks exist in other countries (U.S.A., France, Bulgaria...).
   - source: `absence; checked: /search banque, Steen National Bank, 'banque sorciers États-Unis', 'Gringotts succursale', 'banque magique Amérique', 'banque sorciers Bulgarie France', 'seule banque des sorciers', 'autre banque sorciers'; pages Gringotts, la banque des sorciers, Gobelin, Argent des sorciers, États-Unis, Amérique du Nord, Congrès magique des États-Unis d'Amérique, Steen National Bank, Gilbert Bingley, Pottermore/Textes inédits français (full text, 0 hits for 'banque')`
2. The wiki presents Gringotts as a British banking establishment located in the Chemin de Traverse in London (infobox: Pays Royaume-Uni), not as a world-wide institution.
   - source: `Gringotts, la banque des sorciers: Gringotts est le nom d'un établissement bancaire britannique`
3. It is founded and run by goblins.
   - source: `Gringotts, la banque des sorciers: Fondée et dirigée par des gobelins`
4. The only other bank the wiki describes is the Steen National Bank in New York (Fantastic Beasts, 1926); its director, Gilbert Bingley, is a Non-Maj'. The wiki never calls it a wizarding bank.
   - source: `Steen National Bank: Steen National Bank est le nom d'un établissement bancaire new-yorkais`

**Judge note**: Correct behaviour: say the wiki does not state whether other wizarding banks exist; it only documents Gringotts (British, London, goblin-run). Accept a hedged answer that Gringotts is the only wizarding bank the wiki describes, as long as it does not assert that no others exist. Reject 'yes, Gringotts is the only one' stated as wiki fact, and reject any named foreign wizarding bank or any claim of Gringotts branches abroad (none in the wiki). Do not accept the Steen National Bank as a wizarding bank; the wiki only says it is a bank in New York run by a Non-Maj'.

---

## BY02  (abstain, hard:multihop)

**Prompt**

```text
There are eleven long-established and prestigious wizarding schools worldwide, but I can only find some of them named. What are the missing three schools? (I guess some more in Asia or Oceania would be most likely.)
```

**Web source**: https://scifi.stackexchange.com/questions/170978/what-are-the-missing-three-schools

- Exact page title: *What are the missing three schools? [duplicate] - Science Fiction & Fantasy Stack Exchange*
- Adaptation: SE body reworded into one self-contained question; dropped the asker's own count of what Pottermore listed; the 'Asia or Oceania' guess is verbatim; the SE question is marked as a duplicate but exists

**Aspect**: Wizarding world beyond Britain: the worldwide school list. Abstain on the three unnamed schools with partial wiki support.

**Why it is hard**: The wiki gives the number (eleven) and the known set (eight), so the agent must count and compare, and then refuse to name three schools; the asker's guess (Asia/Oceania) is a trap, and the wiki has a Salem 'Institute' and an Australia page that could mislead. The identity and location of the three schools are not in the wiki.

**Key points**

1. The wiki does not name or locate the three remaining schools, and mentions no school in Oceania/Australia or Canada (the only Asian school it knows is Mahoutokoro in Japan, one of the eight).
   - source: `absence; checked: /search 'trois autres écoles de sorcellerie', 'écoles de sorcellerie inconnues', 'onze écoles de sorcellerie monde', 'école de sorcellerie Australie', 'école de magie Océanie', 'école de magie Asie Inde', 'Australie', 'Canada'; pages Écoles de sorcellerie, Australie, Canada, Inde, Chine, Asie, Afrique, Amérique du Sud, Mahoutokoro, Castelobruxo, Uagadou, Koldovstoretz, Le Guide des écoles de sorcellerie en Europe, Pottermore/Textes inédits français`
2. The wiki says the International Confederation of Wizards counts eleven schools worldwide, of which only eight are known.
   - source: `Écoles de sorcellerie: recense onze écoles à travers le monde, mais seule huit nous sont connues à ce jour`
3. The eight known schools are Poudlard, Beauxbâtons, Durmstrang, Ilvermorny, Castelobruxo, Mahoutokoro, Uagadou and Koldovstoretz (8 'Article détaillé' entries counted programmatically on the page), so 11 - 8 = 3 are unnamed.
   - source: `Écoles de sorcellerie: Koldovstoretz est une école de magie russe.`
4. The wiki adds that smaller, less regulated institutions occasionally appear but vanish quickly, and are rarely registered with a ministry, so they are not part of the eleven.
   - source: `Écoles de sorcellerie: Des institutions plus petites et moins bien réglementées font parfois leur apparition`

**Judge note**: Correct behaviour: eleven recognised schools, eight known, three unknown, and the wiki does not say what or where they are. Accept an answer that lists the eight known schools as context. Reject any named ninth/tenth/eleventh school or country (Australia, Canada, India, China...; Mahoutokoro in Japan is one of the eight known, not a missing one), any claim that the Salem Witches' Institute is one of them (the wiki calls it an organisation of American witches), and any speculation presented as wiki fact. Do not penalise a correct count of 11 - 8 = 3.

---

## BY03  (fact, hard:premise)

**Prompt**

```text
I read that Ilvermorny is in Massachusetts. In Harry Potter and the Goblet of Fire, Ron and Harry meet people from the Salem Witches' Institute at the Quidditch World Cup. Are Ilvermorny and the Salem Witches' Institute supposed to be the same school?
```

**Web source**: https://scifi.stackexchange.com/questions/170948/are-ilvermorny-and-the-salem-witches-institute-supposed-to-be-the-same-school

- Exact page title: *Are Ilvermorny and the Salem Witches Institute supposed to be the same school? - Science Fiction & Fantasy Stack Exchange*
- Adaptation: verbatim

**Aspect**: Ilvermorny / the American wizarding world. False premise: the Salem Witches' Institute is treated as a school.

**Why it is hard**: Two pages are needed (Ilvermorny and Institut des sorcières de Salem), and the question presupposes that the Institute is a school. The wiki does not say the two are the same, does not call the Institute a school, and says nothing about the real-world joke Rowling made; an agent must neither say 'yes' nor invent the joke.

**Key points**

1. The wiki describes the Salem Witches' Institute as an organisation of American witches, not as a school.
   - source: `Institut des sorcières de Salem: Salem est une organisation de sorcières américaines`
2. The Institute appears only at the 1994 Quidditch World Cup campsite, under a starred banner reading 'Institut des sorcières de Salem'.
   - source: `Institut des sorcières de Salem: des sorcières de l'Institut discutent sous une bannière étoilée`
3. The Institute's infobox places it in Salem (Massachusetts).
   - source: `Institut des sorcières de Salem: Ville: Salem`
4. Ilvermorny is a separate entry: an actual school, one of the eleven principal wizarding schools, located at the summit of Mount Greylock in Massachusetts.
   - source: `Ilvermorny: L'école d'Ilvermorny se situe au sommet du mont Greylock dans le Massachusetts`
5. Ilvermorny is described as one of the eleven main wizarding schools in the world (the Institute is never described that way).
   - source: `Ilvermorny: Ilvermorny est l'une des onze principales écoles de magie du monde des sorciers`

**Judge note**: Correct behaviour: No, per the wiki they are separate; the Institute is an organisation of (American) witches, not a school, and Ilvermorny is a school on Mount Greylock. Accept 'the wiki never says they are the same' (checked: the word Salem does not occur on the Ilvermorny page, and Ilvermorny does not occur on the Institute page, and the page Écoles de sorcellerie does not list the Institute). The wiki does not state the Rowling remark that the Institute is a joke on the Women's Institute, so do not require it; accept it only as clearly external context. Reject 'yes, same school', and reject claims that the Institute is an Ilvermorny alumni society, a girls-only school or a house.

---

## BY04  (explain, hard:premise, hard:conflict)

**Prompt**

```text
Was the Statute of Secrecy signed because of the Salem Witch Trials? It is possible that witches and wizards in England were aware of what was happening in Salem in 1692, the same year the Statute of Secrecy was signed.
```

**Web source**: https://www.reddit.com/r/harrypotter/comments/j24zp0/theory_the_statue_of_secrecy_was_signed_because/

- Exact page title: *Theory: The Statue of Secrecy was signed because of the Salem Witch Trials. : r/harrypotter*
- Adaptation: the 'Theory:' title turned into a question; the body is kept; the post's typo 'Statue' corrected and 'Opinions?' dropped

**Aspect**: Ancient/early-modern wizarding history: the International Statute of Secrecy and Salem.

**Why it is hard**: The premise bundles three claims: signed in 1692, caused by Salem, English wizards watched Salem. The wiki puts the signature in 1689, gives 1692 only for the summit/implementation, says Muggle persecution in general was the cause, and links Salem causally only to the founding of the American congress (1693). Four pages must be combined, one of them 426k characters long.

**Key points**

1. The wiki dates the signing of the Code International du Secret Magique to 1689, i.e. before the Salem trials, not 1692.
   - source: `Code International du Secret Magique: Après la signature du Code International du Secret Magique en 1689`
2. 1692 is attached to the International Confederation of Wizards' summit (seven weeks of talks, on the concealment of magical creatures), so the 1692 coincidence the poster cites concerns that summit.
   - source: `Code International du Secret Magique: La Confédération internationale des sorciers débattit de ce sujet lors de la célèbre rencontre au sommet de 1692`
3. The wiki gives the Salem witchcraft trial as taking place in 1692.
   - source: `Institut des sorcières de Salem: un procès jugeant des personnes accusées de sorcellerie a eu lieu à Salem en 1692`
4. The reason the wiki gives for the Code is persecution of wizards by Muggles in general; it never cites Salem as the cause.
   - source: `Pottermore/Textes inédits français: lorsque le monde magique décida de se cacher définitivement pour échapper aux persécutions des Moldus`
5. The wiki ties Salem causally to a different event: the founding of the American magical congress (MACUSA) in 1693.
   - source: `Congrès magique des États-Unis d'Amérique: a été fondé en 1693, en conséquence des procès des sorcières de Salem`

**Judge note**: Correct behaviour: the premise is only partly supported. Accept an answer that says the wiki dates the Statute to 1689 (signature) with a 1692 summit/implementation, attributes it to Muggle persecution, and links Salem only to MACUSA's founding in 1693; and that the wiki does not say English wizards knew of Salem or that Salem caused the Statute. The 1689/1692 difference is itself a wiki conflict, so accept an answer that notes both dates; reject an answer that fixes a single date without noting the other. Reject 'yes, the Statute was signed because of Salem' as wiki fact, and reject invented causes (firearms, Ariana Dumbledore, William and Mary delegation) which the wiki does not give.

---

## BY05  (explain, hard:deep, hard:multihop)

**Prompt**

```text
How and why was the Ministry of Magic founded?
```

**Web source**: https://scifi.stackexchange.com/questions/55525/how-and-why-was-the-ministry-of-magic-founded

- Exact page title: *How and why was the Ministry of Magic founded? - Science Fiction & Fantasy Stack Exchange*
- Adaptation: verbatim title only; the asker's body, which assumes a 1620s founding date and a Parliament analogy, is not included

**Aspect**: Wizarding history: the British Ministry of Magic's origin (Council of Wizards, Statute of Secrecy, 1707).

**Why it is hard**: The Ministère de la Magie page gives no date or cause (its Fondation field is empty and it only says the Ministry succeeds the Council). The date (1707) and the reason (the 1692 Code required a more structured government) are only in the 426k-character 'Pottermore/Textes inédits français' page, and Ulick Gamp's own page adds his earlier role. An agent that stops at the Ministry page will say 'not found'.

**Key points**

1. The Ministry was officially created in 1707, with the appointment of Ulick Gamp as the first Minister for Magic.
   - source: `Pottermore/Textes inédits français: Le ministère de la Magie a été officiellement créé en 1707`
2. Why: after the Code international du secret magique (1692), the wizarding community needed a more structured, organised and complex governing body to administer and communicate with a hidden community.
   - source: `Pottermore/Textes inédits français: la communauté magique dut se doter d’un organe gouvernemental plus structuré, organisé et complexe`
3. It succeeded the Wizards' Council, which had governed the British magical community longest before 1707.
   - source: `Ministère de la Magie: Le ministère de la Magie succède au Conseil des sorciers.`
4. Gamp, the first Minister, had previously been head of the Magenmagot (a post that precedes that of Minister for Magic).
   - source: `Ulick Gamp: Son poste de chef du Magenmagot précède celui de ministre de la Magie`

**Judge note**: Correct behaviour: 1707 / Ulick Gamp as first Minister, replacing the Council of Wizards, motivated by the need for a more structured government after the 1692 Statute. All four points need two or three pages; give full credit only if both the date and the reason are given. Reject a founding date of 1629 or 1689, a Ministry that coexisted with the Council, and invented political causes (Parliament analogy, Muggle civil-war parallels), none of which are in the wiki. An answer that says 'the wiki does not say' fails: the wiki does say, but only in the long Pottermore text page.

