# New eval cases — draft batch 1 (5 of N) — for review

Status: **DRAFT, not approved, not run.** `cases.jsonl` (37 Chinese cases) is untouched.

## How these were made

1. **Question source.** Real questions asked on the open web (scifi.stackexchange.com Harry Potter tags). I kept the asker's own wording where the wiki could answer it and adapted it only to make it self-contained.
2. **Answerability check.** For each question I queried the hosted wiki API (`/search`, `/page`, `/titles`) and read the French pages. Every gold key point below has a French source fragment that I saw in the API output.
3. **Selection.** I picked questions where the web answer is a *hard* one (more than one page, a count, a conflict, or a boundary), and deliberately avoided the Dumbledore/Voldemort/Horcrux topics that dominate the existing 37 cases.
4. **Gold provenance.** Key points are written by me from the wiki text. They are not human-verified. Please read them.

Question language: English (the original language of the web questions). The agent must answer in the question's language.

| id | aspect | what makes it hard | web source |
|---|---|---|---|
| N01 | multi-hop object trace + wrong premise | the answer is spread over one long page, and the question's premise ("Harry got it back") is false | [SE 195417](https://scifi.stackexchange.com/questions/195417/how-did-harry-get-the-sword-of-gryffindor-back-after-he-had-given-it-to-griphook) |
| N02 | conflict between two wiki pages | the Sirius page and the Azkaban page disagree on who escaped first | [SE 59684](https://scifi.stackexchange.com/questions/59684/how-did-sirius-escape-from-azkaban), [SE 96953](https://scifi.stackexchange.com/questions/96953/how-were-sirius-black-and-barty-crouch-jr-able-to-function-inside-azkaban) |
| N03 | counting / set overlap | two long member lists must be compared; counts must be exact | adapted from [SE 213005](https://scifi.stackexchange.com/questions/213005/in-harry-potter-and-the-deathly-hallows-infiltration-of-death-eaters-in-the-mi) ("22 original members") |
| N04 | opinion question grounded in facts | the wiki has the rules and the author's intent but never says "flawed" | [SE 63521](https://scifi.stackexchange.com/questions/63521/is-quidditch-an-inherently-flawed-sport) |
| N05 | abstain with tempting adjacent facts | the wiki has Britain's rule and a US contrast, but not the answer | [SE 262073](https://scifi.stackexchange.com/questions/262073/are-the-unforgivable-curses-unforgivable-outside-of-britains-magic-community) (near-duplicate: [SE 211136](https://scifi.stackexchange.com/questions/211136)) |

### Browser check of the web sources (2026-10-20)

A browser agent opened every URL. All five exist and the asker's wording matches the question text I used. Corrections to what I first claimed:

- **N01:** the SE question is closed as a duplicate and has no accepted answer. The Neville/Sorting Hat answer is the 2nd (+3), not the top one. The question's premise is false, which is why N01 is tagged `premise`. Only the question comes from the web. The gold comes from the wiki.
- **N02:** the asker does say Sirius was "the first person … to escape" (with "allegedly"). A quoted Fandom passage in the accepted answer already says "first … until Barty Crouch Jr.'s escape was revealed", which supports the conflict case. The "Barty before Sirius" order comes from the wiki's Azkaban page, not from SE 96953.
- **N03:** the "22 original members" figure is second-hand: it sits in a lower answer (+2) that borrows the count from another answer. The question there is about Death Eater infiltration, so N03 is my adaptation. The wiki's own list also has 22 names.
- **N04:** the Rowling remark on SE is that the Snitch "infuriates men". It does not say the 150 points were deliberately disproportionate. The accepted answer (Jeff, +77) argues the sport is flawed and does not cite Rowling. The wiki-side key point 4 is unaffected, because it quotes the wiki's own sentence, not SE.
- **N05:** SE's answer is also "unknown", with the speculation that it is likely illegal elsewhere. That matches the abstain design. The wiki gold is unchanged.


---

## N01 — multihop, premise

```text
After Harry gave the Sword of Gryffindor to Griphook as payment for breaking into Gringotts, how did Harry get it back?
```

Expected behaviour: say that Harry does not get it back himself, and trace the sword to Neville.

Key points:

1. At Gringotts, Harry drops the sword in the Lestrange vault and Griphook grabs it and runs off shouting "thief".
   - source: *Épée de Gryffondor* — "Gripsec … s'enfuit avec l'épée en criant au voleur"
2. It is Neville, not Harry, who gets the sword: during the Battle of Hogwarts he pulls it out of the Sorting Hat (after Voldemort puts the Hat on him) and uses it to behead Nagini.
   - source: *Épée de Gryffondor* — "Neville … retire le Choixpeau et en tire l'épée qu'il utilise aussitôt pour décapiter Nagini"
3. Mechanism stated by the wiki: the sword is tied to the Sorting Hat and appears out of it for any worthy Gryffindor who needs it.
   - source: *Épée de Gryffondor* — "l'épée surgira du Choixpeau pour quiconque a besoin de celle-ci, à la seule condition que la personne soit un digne élève de la maison de Gryffondor"

Note for the judge: the wiki does **not** explain how the sword got from Griphook into the Hat. Accept "the wiki does not say"; do not accept an invented explanation. Context that may appear and is fine: Griphook made the sword his price for helping (source: same page, "Gripsec accepte mais à la seule condition d'avoir l'épée").

---

## N02 — conflict

```text
Sirius Black is usually described as the first person to escape from Azkaban. How did he get out, and was he really the first?
```

Expected behaviour: describe the escape, and flag that the wiki is not consistent about "first".

Key points:

1. Sirius turns into his dog form (Animagus) and slips between the bars of his cell when the Dementors open the door to bring food.
   - source: *Azkaban* — "Black utilise ses pouvoirs d'Animagus pour se transformer en chien et se glisser entre les barreaux de sa cellule"
2. Years in Azkaban had made him very thin, and as a dog he swam from the island to the coast; the Dementors are blind and did not see him leave.
   - source: *Sirius Black* — "il parvient à se faufiler entre les barreaux et à nager, de l'île … jusqu'à la côte. Les Détraqueurs, étant aveugles, ne purent le voir"
3. Why he could think clearly there: he resisted the Dementors because he knew he was innocent, and the dog form helped him stay sane. His trigger was recognising Pettigrew, as a rat, in a newspaper article about the Weasleys.
   - source: *Sirius Black* — "Sirius résiste aux Détraqueurs parce qu'il se sait innocent … En lisant un journal, Sirius reconnait Peter Pettigrow"
4. **Conflict.** The *Sirius Black* page calls him "le premier sorcier connu à s'en évader", but the *Azkaban* page lists Barty Crouch Jr.'s escape in 1983 (he swapped places with his mother, and the Dementors did not detect it) as the first escape and Sirius's in 1993 as the second.
   - source: *Sirius Black* — "fut le premier sorcier connu à s'en évader"; *Azkaban* — "En 1983 survient la première évasion … Barty Croupton Jr.", "En 1993, une seconde évasion a lieu, celle de Sirius Black"

Note for the judge: a good answer states that Sirius is "the first known" per his own page but that the Azkaban page puts Crouch Jr. first. Picking one side without mentioning the other loses key point 4.

---

## N03 — count, overlap

```text
How many people were in the original Order of the Phoenix, and how many of them were also members when it re-formed? Name those who carried over.
```

Expected behaviour: count from the two member lists and say they are the lists of *known* members.

Key points (counts checked by script on the page text):

1. The first Order of the Phoenix lists 22 known members.
   - source: *Ordre du Phénix* — "Membres connus / Premier Ordre du Phénix" (22 names, Albus Dumbledore to Emmeline Vance)
2. The second Order lists 26 known members.
   - source: *Ordre du Phénix* — "Deuxième Ordre du Phénix" (26 names)
3. Exactly 10 appear in both: Albus Dumbledore, Sirius Black, Dedalus Diggle, Elphias Doge, Mondingus Fletcher, Rubeus Hagrid, Remus Lupin, Alastor Maugrey, Sturgis Podmore, Emmeline Vance.
   - source: *Ordre du Phénix* — both lists
4. The numbers are "known members" only; the wiki does not say these are complete.
   - source: *Ordre du Phénix* — heading "Membres connus"

Note for the judge: score the number 22 and the number 10 as exact. Do not require all ten names to be listed in the same order; a missing name counts against key point 3. The question does not ask for deaths; if the answer adds them, check them against the member pages.

---

## N04 — opinion grounded in facts

```text
Is Quidditch an inherently flawed sport? The Snitch is worth 150 points and ends the game, so why bother with the goals at all?
```

Expected behaviour: give what the wiki states and say plainly that it does not call the sport flawed or discuss strategy.

Key points:

1. Catching the Golden Snitch ends the match and is worth 150 points; only the Seeker may catch it.
   - source: *Vif d'or* — "c'est la balle qui met fin au match lorsqu'elle est attrapée et qui accorde 150 points … Seul l'attrapeur peut réceptionner cette balle"
2. A Quaffle goal by a Chaser is worth 10 points.
   - source: *Quidditch* — "les poursuiveurs … font gagner dix points à leur équipe à chaque fois qu'ils réussissent à marquer"
3. The 150 comes from history: in 1269 Barberus Bragge offered 150 Galleons to whoever caught the golden snitchet, which is the origin of the Snitch.
   - source: *Quidditch* — "une récompense de cent cinquante Gallions"; *Vif d'or* — "Ces 150 points font référence aux 150 Gallions"
4. Rowling's intent: the Snitch's disproportionate points were meant to be frustrating, and Whisp's book jokes that a Snitch caught in the first five minutes frustrates spectators.
   - source: *Quidditch* — "le nombre démesuré de points apporté par le Vif d'or … frustrant"; "(à moins bien sûr que le Vif d'or soit attrapé dans les cinq premières minutes …)"
5. The wiki does **not** say the sport is flawed, and does not discuss whether a trailing Seeker should stop searching.
   - source: absence; checked on *Quidditch* and *Vif d'or*

Note for the judge: an answer that argues "yes, it is flawed" or "no, it is balanced" as the wiki's position contradicts key point 5. An opinion framed as the answerer's own, after the facts, is not a contradiction but should be marked as not from the wiki.

---

## N05 — abstain with adjacent evidence

```text
Are the Unforgivable Curses still "unforgivable" outside Britain, for example in the United States?
```

Expected behaviour: `Not found` for the main question, plus the related facts the wiki does give, clearly kept apart from the answer.

Key points:

1. The wiki does not say whether the United States or any other country treats these curses as unforgivable.
   - source: absence; checked on *Sortilèges Impardonnables*, the three curse pages, and the MACUSA pages
2. For Britain: using one on a human being, Muggle or wizard, is punishable by life in Azkaban.
   - source: *Sortilèges Impardonnables* — "l'usage de l'un d'eux sur un être humain … est passible d'une condamnation à vie à la prison d'Azkaban"
3. Related context (not an answer): Imperius and Cruciatus were banned in 1717, and Aurors were allowed to use them in the First Wizarding War.
   - source: *Sortilège de l'Imperium* / *Sortilège Doloris* — "interdit en 1717"; *Sortilèges Impardonnables* — "les Aurors étaient autorisés à les utiliser"
4. Related contrast (not an answer): the wiki says MACUSA executes serious criminals where Britain sends them to Azkaban. It does not link this to these curses.
   - source: *Congrès magique des États-Unis d'Amérique* — "les sorciers et sorcières britanniques étaient envoyés à Azkaban alors que les criminels américains étaient quant à eux exécutés"

Note for the judge: fail any answer that states or implies the US does or does not classify the curses as unforgivable. Passing answers say the wiki does not cover it, and may add key points 2–4 as clearly labelled context.

---

## Reserve candidates (not drafted yet)

- *When was Hogwarts founded?* ([SE 18550](https://scifi.stackexchange.com/questions/18550/when-was-hogwarts-founded)) — wiki gives only "10ème siècle"; tests precision boundary.
- *How many Death Eaters died in total?* ([SE 206628](https://scifi.stackexchange.com/questions/206628/how-many-death-eaters-died-in-total)) — needs a cross-page tally; I have not yet checked if the wiki can support a number.
- *Why does everyone's wand still work for them?* ([SE 6910](https://scifi.stackexchange.com/questions/6910/why-does-everyones-wand-still-work-for-them)) — wand-allegiance rules.
- *Who was the rightful owner of the Sword of Gryffindor?* ([SE 60724](https://scifi.stackexchange.com/questions/60724/who-was-the-rightful-owner-of-the-sword-of-gryffindor)) — book/film conflict (the wiki notes the film changes Scrimgeour's line).
