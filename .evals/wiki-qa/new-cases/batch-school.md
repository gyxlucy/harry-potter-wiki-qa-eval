# Batch: Hogwarts and the wizarding institutions (SC01-SC05)

Wiki: French Harry Potter wiki snapshot (2020-02-15), queried through the public API. Every source fragment is script-checked as an exact substring of the `/page` text of the cited page (absence sources are skipped).

## SC01

**Prompt:** What is on each level in the Ministry of Magic headquarters?

**Tags:** fact, hard:enumerate, hard:multihop, hard:conflict

**Web source:** https://scifi.stackexchange.com/questions/110166/what-is-on-each-level-in-the-ministry-of-magic-headquarters
- Page title: "What is on each level in the Ministry of Magic headquarters?"
- Status: Created 2015-12-11. Direct fetch returned 403 (Cloudflare); existence and title confirmed from the web-search result.
- Adaptation: verbatim title

**Aspect:** Ministry of Magic departments

**Why it is hard:** Needs 8 separate pages (Atrium + 7 departments' infoboxes) to rebuild a level-by-level map; counts departments programmatically; the wiki is internally inconsistent (seven departments vs. a Maintenance department); levels 1 and 10 are absent.

**Key points:**

1. Level 8 of the Ministry is the Atrium (the reception hall).
   - source: `Atrium: Niveau 8, Ministère de la Magie`
2. Level 9 is the Department of Mysteries.
   - source: `Département des mystères: Niveau 9, Ministère de la Magie`
3. Levels 2, 3 and 4 hold, respectively, the Department of Magical Justice (Law Enforcement), the Department of Magical Accidents and Catastrophes, and the Department for the Regulation and Control of Magical Creatures.
   - source: `Département de la justice magique: Niveau 2, Ministère de la Magie`
4. Levels 5, 6 and 7 hold, respectively, the Department of International Magical Cooperation, the Department of Magical Transportation, and the Department of Magical Games and Sports.
   - source: `Département des transports magiques: Niveau 6, Ministère de la Magie`
5. The main Ministry page says the Ministry is made up of seven departments (the six above plus Mysteries), yet a separate page lists an eighth, the Department of Magical Maintenance, as one of the Ministry's departments with no single level (it works on all levels).
   - source: `Ministère de la Magie: composé de sept départements`

**Additional fragments verified by the checker (support the grouped key points):**

- `Département des accidents et catastrophes magiques: Niveau 3, Ministère de la Magie`
- `Département de contrôle et de régulation des créatures magiques: Niveau 4, Ministère de la Magie`
- `Département de la coopération magique internationale: Niveau 5, Ministère de la Magie`
- `Département des jeux et sports magiques: Niveau 7, Ministère de la Magie`
- `Département de la maintenance magique: Le Département de la maintenance magique est l'un des départements du ministère de la Magie.`
- `Département de la maintenance magique: intervient sur tous les niveaux du ministère de la Magie`
- `Ministère de la Magie: - Département de la justice magique`

**Judge note:** Gold built from the Infobox 'Quartier général' / 'Emplacement' field of 8 pages: Atrium=8; Mysteres=9; Justice=2; Accidents et catastrophes=3; Creatures=4; Cooperation internationale=5; Transports=6; Jeux et sports=7 (all verified in the review file). Accept a level-by-level list covering levels 2-9 with those department names; partial credit for a list that gets most right. The wiki gives NO level for the Minister's offices and none for level 10 / the courtroom (searched 'Niveau 1', 'Niveau 10', 'salle d'audience'): reject answers that present 'Level 1 = Minister's office' or 'Level 10 = Courtroom Ten' as wiki facts unless clearly flagged as not in the wiki. Good answers also note the wiki's internal inconsistency: 'sept départements' (count of the list on the Ministry page = 7, counted programmatically) vs the Magical Maintenance department page that calls itself one of the Ministry's departments and says it operates on every level. Reject invented level numbers for Maintenance.

## SC02

**Prompt:** In Hogwarts we learn about the 4 House ghosts: the Fat Friar, Nearly-Headless Nick, the Bloody Baron, and the Grey Lady. Also, we're introduced to Moaning Myrtle, Professor Binns, and Peeves (if you could count him). Who are the other ghosts at Hogwarts?

**Tags:** fact, hard:enumerate, hard:filter, hard:count

**Web source:** https://scifi.stackexchange.com/questions/183299/who-are-the-other-hogwarts-ghosts
- Page title: "Who are the other Hogwarts ghosts?"
- Status: Opened and confirmed (asked 2018-03-11).
- Adaptation: removed the quoted book passage and the 'about twenty' remark/Headless Hunt aside; final question reworded to 'Who are the other ghosts at Hogwarts?'

**Aspect:** Hogwarts ghosts / institutions

**Why it is hard:** Enumeration with exclusion: agent must read the Ghost page list (13), subtract the six the asker already named, notice Peeves is a poltergeist and not listed, and cannot rely on memory (Black Knight, Toad, Edmund Grubb appear under French names); two list entries have no page.

**Key points:**

1. The wiki's Ghost page lists 13 'Fantômes de Poudlard' (Hogwarts ghosts) (counted programmatically from the list).
   - source: `Fantôme: Fantômes de Poudlard`
2. After removing the four house ghosts, Moaning Myrtle and Professor Binns named in the question, 7 entries remain: Sir Patrick Delaney-Podmore, the Headless Hunt club (Club des Chasseurs sans tête), the Black Knight (Chevalier Noir), the Toad (Crapaud), Edgar Cloggs, Lord Draben and Edmond Graille (counted programmatically).
   - source: `Fantôme: Article détaillé|Chevalier Noir`
3. Edgar Cloggs is a Hogwarts ghost who mostly haunts the Quidditch pitch.
   - source: `Edgar Cloggs: Edgar Cloggs est un fantôme de Poudlard qui hante le plus souvent le terrain de Quidditch de l'école.`
4. Edmond Graille is a plump Victorian-era Hogwarts ghost who died in front of the Great Hall door, poisoned by berries.
   - source: `Edmond Graille: Il vivait durant l'ère victorienne et mourut devant la porte de la Grande Salle, empoisonné par des baies`
5. Peeves is not on the ghost list: the wiki classes him as Hogwarts' poltergeist (esprit frappeur), not a ghost.
   - source: `Peeves: Peeves est l'esprit frappeur de Poudlard.`

**Additional fragments verified by the checker (support the grouped key points):**

- `Fantôme: Article détaillé|Sir Patrick Delaney-Podmore`
- `Fantôme: Article détaillé|Club des Chasseurs sans tête`
- `Fantôme: Article détaillé|Crapaud (fantôme)`
- `Fantôme: Article détaillé|Edgar Cloggs`
- `Fantôme: Article détaillé|Lord Draben`
- `Fantôme: Article détaillé|Edmond Graille`
- `Lord Draben: il fait le choix de revenir sous forme de fantôme pour hanter le collège Poudlard.`

**Judge note:** The Ghost page list has 13 Hogwarts entries (Binns, Nick, Moine Gras, Dame Grise, Baron Sanglant, Mimi Geignarde, Patrick Delaney-Podmore, Chasseurs sans tete, Chevalier Noir, Crapaud, Edgar Cloggs, Lord Draben, Edmond Graille); removing the 6 the asker already named leaves 7 (counted by script; Peeves is not among the 13). Accept the 7 'other' names, with the Headless Hunt counted as one club entry. The snapshot has no standalone pages for 'Chevalier Noir' or 'Crapaud (fantome)', so details about them are NOT in the wiki: reject invented backstories. The wiki does not give a total number of Hogwarts ghosts (searched 'vingtaine', 'environ vingt'); reject a confident 'about twenty' as a wiki fact. Lord Draben: wiki only says he joined Hogwarts after death and entered the Great Hall after the Grey Lady in 1991.

## SC03

**Prompt:** The original Triwizard Tournament started around 1294 and ended in 1792, with a tournament every 5 years. Beauxbatons won 62 tournaments, while Hogwarts won 63. Does that mean Durmstrang has never won a single tournament? How would you explain this?

**Tags:** explain, hard:conflict, hard:count, hard:multihop

**Web source:** https://www.reddit.com/r/harrypotter/comments/8lzqbj/i_just_realized_something_about_the_triwizard/
- Page title: "I just realized something about the Triwizard Tournament....."
- Status: Opened and confirmed (r/harrypotter discussion post, 2018; a statement/rant rather than a literal question, so the question wording is adapted).
- Adaptation: a rant-style r/harrypotter discussion post turned into a self-contained question; dropped the claimed '125 tournaments total' and the jokes; kept the 1294/1792/5-year/62/63 premises

**Aspect:** Triwizard Tournament and the other schools

**Why it is hard:** Needs two pages (Beauxbatons, Tournoi), a date calculation (1294-1792 every 5 years ~100 tournaments vs 62+63 = 125 wins), and a conflict inside the wiki; the temptation is to invent an explanation or assert Durmstrang's record.

**Key points:**

1. The wiki says Beauxbatons has won the Tournament 62 times against 63 for Hogwarts.
   - source: `Beauxbâtons: que Beauxbâtons a remporté 62 fois, contre 63 fois pour Poudlard`
2. The first Tournament was held around 1294.
   - source: `Tournoi des Trois Sorciers: aux alentours de 1294`
3. The Tournament was held traditionally every five years and was eventually cancelled after the 1792 incident (all three heads injured by a cockatrice); it was revived in 1994.
   - source: `Tournoi des Trois Sorciers: Alors qu'il avait lieu traditionnellement tous les cinq ans, le Tournoi a finalement été annulé.`
4. Date arithmetic: one Tournament every 5 years from 1294 up to 1792 gives about 100 tournaments (about 101 counting the 1994 revival), fewer than the 62+63 = 125 wins the wiki credits to just two schools, so the wiki's own figures do not fit and the premise 'Durmstrang never won' is not an established conclusion (computed programmatically).
   - source: `Tournoi des Trois Sorciers: En 1792, les trois directeurs des écoles participantes au Tournoi ont été blessés par un Cocatris`
5. The wiki never states how many times Durmstrang won, nor the total number of Tournaments held, nor how the numbers reconcile.
   - source: `absence; checked: Durmstrang, Beauxbâtons, Tournoi des Trois Sorciers, Trophée des Trois Sorciers, Tragédies des Trois Sorciers, Coupe de Feu pages; searches 'Durmstrang remporté victoire Tournoi', 'Durmstrang jamais gagné', 'Durmstrang victoires', '63 fois'`

**Judge note:** Key insight: the wiki states 62 (Beauxbatons) and 63 (Poudlard) but nothing for Durmstrang, and its own timeline (first ~1294, every 5 years, cancelled after 1792, revived 1994) allows only ~100-101 tournaments, fewer than 125 wins. Accept: flags the numerical tension, says the wiki gives no Durmstrang win count and no explanation, and does not assert that Durmstrang never won (or won N times) as a fact. Accept hedged arithmetic ~100 (100 or 101 with 1994, also ok if someone counts 99-100 because 1792 is not on the 5-year grid from 1294). Reject: invented explanations (e.g. tournaments held every year/seven years, secret Durmstrang wins, Rowling statements, a stated total of 125 tournaments as wiki fact), or a flat 'yes, Durmstrang never won' / 'Durmstrang won the remaining N'.

## SC04

**Prompt:** How long does the trip in the Hogwarts Express take?

**Tags:** abstain, hard:deep

**Web source:** https://scifi.stackexchange.com/questions/240574/how-long-does-the-trip-in-the-hogwarts-express-take
- Page title: "How long does the trip in the Hogwarts Express take?"
- Status: Opened and confirmed (asked 2020-12-18).
- Adaptation: verbatim title

**Aspect:** Hogwarts Express

**Why it is hard:** Abstain with a tempting inference: wiki gives departure (11:00) and 'début de soirée' but no duration; a model may compute 9+ hours from outside knowledge.

**Key points:**

1. The wiki does not state how long the Hogwarts Express journey takes (no duration, distance or arrival hour anywhere).
   - source: `absence; checked: Poudlard Express, Gare de Pré-au-Lard, Gare de King's Cross, Pré-au-Lard, Rentrée scolaire à Poudlard pages; searches 'Poudlard Express durée du trajet heures', 'trajet Londres Pré-au-Lard heures de train', 'Poudlard Express arrive en début de soirée'`
2. It leaves King's Cross, platform 9¾, at eleven o'clock every 1 September.
   - source: `Poudlard Express: Le train part à onze heures de la gare de King's Cross, voie 9¾, chaque 1er septembre`
3. The wiki only says it arrives at Hogsmeade station 'in the early evening' (début de soirée).
   - source: `Poudlard Express: et arrive en début de soirée à la gare de Pré-au-Lard.`
4. Hogsmeade station is in Scotland and is the terminus of the Hogwarts Express.
   - source: `Gare de Pré-au-Lard: C'est le terminus du Poudlard Express`

**Judge note:** Abstain case with an inference trap: the wiki gives a departure time (11:00) and a vague arrival ('début de soirée') but no journey length. Accept: says the wiki gives no duration and relays departure 11:00 / early-evening arrival; a clearly-labelled rough inference ('several hours, roughly from 11:00 to early evening') is fine. Reject: a specific duration (e.g. 9 hours, 9¾ hours, 11 hours, 7.5 hours) presented as wiki fact, sunset-time or real-world rail calculations (Flying Scotsman, Edinburgh/Inverness) presented as from the wiki, or a made-up stop list.

## SC05

**Prompt:** Is there any explanation for why the other 2 schools in the Triwizard Tournament are both single-gender, unlike Hogwarts? Was single-gender education normal in the wizarding world with Hogwarts being the exception?

**Tags:** explain, hard:premise, hard:multihop

**Web source:** https://scifi.stackexchange.com/questions/40626/was-the-fact-that-the-foreign-schools-were-non-coed-important
- Page title: "Was the fact that the foreign schools were non-coed important?"
- Status: Opened and confirmed (asked 2013-09-15).
- Adaptation: kept the asker's question text, dropped the film screenshots and the 'special intentional literary trick' sub-question

**Aspect:** Beauxbatons and Durmstrang (foreign schools)

**Why it is hard:** False premise: wiki says single-gender look is from the film; Beauxbatons is mixed in the novel, Durmstrang unspecified with a girl hinted. Needs three pages and a correct non-answer on the 'why'.

**Key points:**

1. The single-gender impression comes from the film only: the wiki says the Beauxbatons delegation in the novel is mixed (not all-female).
   - source: `Beauxbâtons: mais la délégation de Beauxbâtons dans le roman est mixte`
2. The Beauxbatons delegation page describes the dozen students leaving the carriage as girls and boys.
   - source: `Délégation de Beauxbâtons: une douzaine d'élèves sortent à leur tour du carrosse, filles et garçons`
3. For Durmstrang, the wiki says it only seems exclusively male (in the film) and that the novel makes no explicit statement about it being mixed.
   - source: `Durmstrang: aucune précision n'est faite en ce sens pour l'école de Durmstrang`
4. However, the wiki notes that in the novel the Durmstrang student Poliakoff nudges the girl next to him in a group of Durmstrang students, a hint that Durmstrang is not boys-only.
   - source: `Durmstrang: Poliakoff donne un coup de coude à la fille qui se trouve à côté de lui`
5. The wiki gives no explanation of why the films made the schools single-gender and does not say whether single-gender schooling was normal in the wizarding world.
   - source: `absence; checked: Durmstrang, Beauxbâtons, Délégation de Beauxbâtons pages; searches 'mixte', 'école mixte garçons filles Poudlard seule école', 'école non mixte unisexe sorciers', 'Poudlard est la seule école mixte'`

**Additional fragments verified by the checker (support the grouped key points):**

- `Durmstrang: Dans le roman, Beauxbâtons est une école mixte`

**Judge note:** The question's premise (both foreign schools are single-gender) is contradicted or at least not supported by the wiki: it says the all-girls / all-boys look is the film's, that Beauxbatons is mixed in the novel, and that Durmstrang is unspecified but with a girl hinted. Accept an answer that corrects the premise using the wiki, says Durmstrang's status is left open (wiki only hints at a girl student), and says the wiki offers no reason for the film choice and no statement on whether single-gender education was normal. Reject: accepting the premise as fact, claiming Durmstrang is definitively co-ed or definitively boys-only as a wiki fact, or invented explanations (Rowling interviews, real-world boarding schools, name symbolism, etc.).

## Programmatic counts used

- SC01: departments listed on the Ministry page: 7 (Département de la justice magique; Département des accidents et catastrophes magiques; Département de contrôle et de régulation des créatures magiques; Département de la coopération magique internationale; Département des transports magiques; Département des jeux et sports magiques; Département des mystères).
- SC02: entries under 'Fantômes de Poudlard' on the Ghost page: 13; after removing Binns, Nick, Moine Gras, Dame Grise, Baron Sanglant, Mimi Geignarde: 7 (Sir Patrick Delaney-Podmore; Club des Chasseurs sans tête; Chevalier Noir; Crapaud (fantôme); Edgar Cloggs; Lord Draben; Edmond Graille).
- SC03: tournaments from 1294 to 1792 every 5 years = floor((1792-1294)/5)+1 = 100; +1994 revival = 101; wins stated: 62 + 63 = 125.
