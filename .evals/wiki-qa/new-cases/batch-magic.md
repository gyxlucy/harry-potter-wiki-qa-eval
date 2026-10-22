# Batch: magic mechanics and creatures (MG01-MG05)

Review file for `batch-magic.jsonl`. All five prompts are real questions from scifi.stackexchange.com (opened and read). Every key point's source is `<Page title>: <exact French fragment>`, machine-checked as a substring of the `/page` text (absence sources are skipped). Wiki API: https://lucygao--4fec7bbec93b11f1be841607ee4eb77e.web.val.run

| id | tags | aspect |
|---|---|---|
| MG01 | explain, hard:partial, hard:count | Animagi / magical law (registration). 'How does X work' that the wiki only partly explains. |
| MG02 | explain, hard:compare, hard:premise | Metamorphmagi vs. Animagi (comparison of two wiki pages). |
| MG03 | fact, hard:conflict | Potions: Polyjuice rules and an edge case (species rule vs. Hermione's cat-hair accident). |
| MG04 | fact, hard:premise, hard:multihop | Magical objects: Time-Turners (false premise + date calculation). |
| MG05 | abstain, hard:multihop | House-elves / Apparition / goblins: clear 'the wiki does not say' with related context. |

## MG01

**Prompt:** What does it take to become a registered Animagus? If you need a permit to be an Animagus in the Harry Potter universe, how do you learn to do it beforehand? Is there some class, or something? And as there's only seven registered Animagi, who would teach the course, and certify the person for that matter?

**Tags:** explain, hard:partial, hard:count

**Web source:** [What does it take to become a registered Animagus?](https://scifi.stackexchange.com/questions/2639/what-does-it-take-to-become-a-registered-animagus)  
Exact page title: "What does it take to become a registered Animagus?"  
Origin field: web: https://scifi.stackexchange.com/questions/2639/what-does-it-take-to-become-a-registered-animagus (adapted: title kept as the opening sentence; dropped the asker's 'So, I've wondered for some time,' and the parenthetical '(as per "Order of the Phoenix")'; otherwise verbatim)

**Aspect:** Animagi / magical law (registration). 'How does X work' that the wiki only partly explains.

**Why it is hard:** Needs 3 pages (Animagus, Pottermore text, McGonagall check) plus counts (7 registered vs. 2 named as declared; 10-step process, counted programmatically). The asker presupposes a permit/class/certification system; the wiki has the process and the register, but NOT who teaches or certifies. A good answer must say what is missing instead of importing web-answer details (Improper Use of Magic Office, 'like registering a car').

**Key points:**

1. The Ministry of Magic keeps an Animagus register; in the 20th century it contains the names of seven declared Animagi (the wiki's own 'known Animagi' list flags only two individuals as declared: McGonagall and Talbott Winger's mother, so most of the seven are not named).  
   *Source:* `Animagus: le registre contient les noms des sept Animagi déclarés et existants`
2. Unregistered (undeclared) Animagi exist and risk a prison sentence in Azkaban if discovered, i.e. registration is expected/legally enforced.  
   *Source:* `Animagus: Ces derniers risquent, si découverts, une peine de prison à Azkaban`
3. Becoming an Animagus is a very hard, years-long learning process; the wiki gives it as a complex process of ten steps (mandrake leaf kept in the mouth for a month, crystal phial, incantation twice a day, a potion drunk after a storm, etc.), and says the Ministry watches closely those who want to become one.  
   *Source:* `Animagus: Apprendre à être Animagus est très difficile et nécessite plusieurs années d'apprentissage`
4. As for who teaches: the Pottermore text on McGonagall (reproduced on the wiki) says she became an Animagus under the guidance of her Transfiguration master, and that her form was logged in the Ministry's Animagi register.  
   *Source:* `Pottermore/Textes inédits français: Sous la conduite inspirée de son maître en Métamorphose`
5. The wiki does NOT describe any permit, class, certification or registration procedure, nor who certifies or registers an Animagus (no office, form or exam is named), so the asker's questions about a 'course' and 'certification' cannot be answered from it.  
   *Source:* `absence; checked: pages Animagus, Minerva McGonagall, Métamorphose and Pottermore/Textes inédits français; searches 'Animagus permis', 'Animagus certificat', 'Animagus cours enseigne', 'Registre des Animagi', 'Animagus inscription registre bureau', 'Animagus Bureau usage abusif magie'`

**Judge note:** Counts were computed programmatically from the Animagus page: the 'Processus' section has 10 numbered steps (the page also says 'dix étapes'); the list 'Animagi connus' has exactly 2 entries tagged '(déclarée)' (McGonagall, Mère de Talbott Winger) plus one ambiguous 'déclaré ou non déclaré' (Le cadet de Jacob, a game side-quest). Accept: seven registered in the 20th century; ten-step multi-year process; Ministry registry; McGonagall learned from her Transfiguration teacher; an explicit statement that the wiki does not explain permits/certification/who certifies. Reject: inventing a permit exam, an official course, a named Ministry office or 'Improper Use of Magic Office' registration clerk as wiki fact (that comes from web answers, not the wiki); claiming the number of registered Animagi is more or fewer than seven; presenting the 'Animagus potion' recipe as something taught in class. Partial credit if the answer gives the process and the seven but does not flag what is missing.

## MG02

**Prompt:** Would Tonks' metamorphic capabilities make her a "natural" animagus? Is Tonks' ability limited in that she can't transform into a full animal the way other animagi can? If not, what's the difference?

**Tags:** explain, hard:compare, hard:premise

**Web source:** [Would Tonks' metamorphic capabilities make her a "natural" animagus?](https://scifi.stackexchange.com/questions/222011/would-tonks-metamorphic-capabilities-make-her-a-natural-animagus)  
Exact page title: "Would Tonks' metamorphic capabilities make her a "natural" animagus?"  
Origin field: web: https://scifi.stackexchange.com/questions/222011/would-tonks-metamorphic-capabilities-make-her-a-natural-animagus (adapted: kept the title and first paragraph; dropped the asker's third paragraph about Teddy Lupin; added the missing apostrophe in "Tonks' ability")

**Aspect:** Metamorphmagi vs. Animagi (comparison of two wiki pages).

**Why it is hard:** Comparison across Métamorphomage, Animagus and Nymphadora Tonks; embedded false premise ('natural animagus'); the key fact for the asker (can a Metamorphmagus become a full animal?) is NOT on the wiki, and the tempting 'limited to human features' answer is a web inference, not wiki text.

**Key points:**

1. A Métamorphomage can change their appearance spontaneously, without potions or spells, and (per the wiki) can take the appearance of anyone; Tonks is one.  
   *Source:* `Métamorphomage: se métamorphoser spontanément, sans l'aide de potions ou de sortilèges`
2. Metamorphmagus ability is innate and cannot be learned, 'unlike Animagi' (who learn it): a Métamorphomage is one from birth. So there is no 'natural Animagus': the two abilities are distinct and acquired differently.  
   *Source:* `Métamorphomage: on ne peut pas devenir métamorphomage par l'apprentissage. Un métamorphomage l'est dès la naissance.`
3. An Animagus is a wizard who learns to change at will into one animal; learning it is very hard and takes several years, via a complex process of ten steps.  
   *Source:* `Animagus: Apprendre à être Animagus est très difficile et nécessite plusieurs années d'apprentissage`
4. Tonks's page describes her power only as changing her appearance at will; her infobox 'Animagus' field is empty.  
   *Source:* `Nymphadora Tonks: Elle peut changer son apparence à volonté, étant Métamorphomage.`
5. The wiki does NOT say whether a Métamorphomage (Tonks or Teddy Lupin) can turn into a full animal, nor that the ability helps to become an Animagus, so the asker's 'can't transform into a full animal' limit is not stated by the wiki either way.  
   *Source:* `absence; checked: pages Métamorphomage, Nymphadora Tonks, Ted Lupin, Animagus; searches 'Métamorphomage animal', 'métamorphomage Animagus', 'Tonks Animagus', 'métamorphomage se transformer en animal'`

**Judge note:** Accept: the abilities are different (innate appearance-change vs. learned full transformation into a single animal); there is no 'natural' Animagus on the wiki (Animagus is learned, via a ten-step process over years); the wiki is silent on whether Tonks could or could not become an animal. Reject: stating as wiki fact that Metamorphmagi 'cannot turn into animals' or that the ability is 'genetic/recessive' (only that Teddy inherited it is on the wiki; the genetics claim comes from web answers); claiming Tonks is an Animagus; fabricating a 'pig snout' example (not on these pages). A confident 'No, because the wiki says Métamorphomages are limited to human features' is wrong: the wiki says they can take the appearance of anyone ('n'importe qui') and does not address animals.

## MG03

**Prompt:** Did J. K. Rowling contradict herself in the Polyjuice Potion article on Pottermore? In the second book/movie, Hermione used a cat's hair in her Polyjuice Potion by mistake and her body got covered in fluffy hair and she possibly even got a tail. But J. K. Rowling writes on Pottermore: "You can change age, sex and race by taking the Polyjuice Potion, but not species." Where's the catch? Yeah, Hermione didn't turn fully into a cat, but she didn't remain a human either.

**Tags:** fact, hard:conflict

**Web source:** [Did J. K. Rowling contradict herself in the Polyjuice Potion article on Pottermore?](https://scifi.stackexchange.com/questions/173523/did-j-k-rowling-contradict-herself-in-the-polyjuice-potion-article-on-pottermo)  
Exact page title: "Did J. K. Rowling contradict herself in the Polyjuice Potion article on Pottermore?"  
Origin field: web: https://scifi.stackexchange.com/questions/173523/did-j-k-rowling-contradict-herself-in-the-polyjuice-potion-article-on-pottermo (adapted: title prepended to the body; removed the final sentence 'Has anyone ever asked JKR about this?'; otherwise verbatim)

**Aspect:** Potions: Polyjuice rules and an edge case (species rule vs. Hermione's cat-hair accident).

**Why it is hard:** Rule vs. edge case across four wiki locations (Polynectar, the reproduced Pottermore text, the chapter page 2x12, Hermione/Pomfresh pages). The wiki gives 'partial' (Polynectar) and 'failed animal transformation' (2x12) but no mechanism, no duration, no tail/fur. Tempting to hallucinate the web answers' explanations (weeks in the hospital wing, 'person means human').

**Key points:**

1. The wiki's Polynectar page states the potion is reserved for human-to-human transformations: a human cannot use it to become an animal (and a half-giant cannot use it to become human).  
   *Source:* `Polynectar: un humain ne peut pas l'utiliser pour devenir un animal`
2. The Pottermore text reproduced on the wiki gives the same rule as the quote in the question: the potion lets the drinker change age, sex and race, but not species, which is why it is contraindicated for animal transformations.  
   *Source:* `Pottermore/Textes inédits français: il ne peut toutefois pas lui faire changer d'espèce`
3. In the Chamber of Secrets episode Hermione, who had unknowingly collected cat hairs instead of Millicent Bulstrode's hair, ended up only PARTIALLY transformed into a cat (and went to the infirmary) rather than fully becoming one.  
   *Source:* `Polynectar: Hermione se retrouve alors partiellement transformée en chat`
4. The wiki's chapter page for chapter 12 labels this transformation an animal one and a failed one: the potion did not work as an animal transformation, which is consistent with the species rule rather than contradicting it.  
   *Source:* `2x12: animale (donc échouée) d'Hermione Granger en chat`
5. The wiki does NOT say how long Hermione stayed in this half-cat state, nor does it describe fur, tail or eye changes, nor give an in-universe explanation of why cat hair gives a partial rather than full change.  
   *Source:* `absence; checked: pages Polynectar, Chat de Millicent Bulstrode, Hermione Granger, Pompom Pomfresh, 2x12, 2x13; searches 'Hermione chat infirmerie vacances Noël', 'Hermione moitié chat Polynectar semaines', 'Hermione fourrure infirmerie', 'Hermione queue chat'`

**Judge note:** Gold answer: no contradiction on the wiki's account. The rule (age/sex/race yes, species no; animal transformations contraindicated) is stated on both Polynectar and the Pottermore text, and Hermione's cat-hair mishap is described as a partial transformation / failed animal transformation ('quasi-transformée en chat' on the Pompom Pomfresh page), i.e. the potion did not change her species. Accept answers that say the wiki shows a partial, failed transformation and that the species rule is intact. Reject: claiming Hermione fully became a cat; claiming the wiki explains the mechanism (e.g. 'hair of a non-human is not a person's hair') or gives a recovery time (weeks) or details such as a tail; saying the wiki confirms the potion works for species changes. Minor distraction to ignore: the Polynectar infobox says one hour while the body text and Pottermore say ten minutes to twelve hours.

## MG04

**Prompt:** In Harry Potter, the Time-Turner seems like it would be a very helpful device. Why was it never used again, regardless of the purpose?

**Tags:** fact, hard:premise, hard:multihop

**Web source:** [Why was the time turner never used again?](https://scifi.stackexchange.com/questions/8679/why-was-the-time-turner-never-used-again)  
Exact page title: "Why was the time turner never used again?"  
Origin field: web: https://scifi.stackexchange.com/questions/8679/why-was-the-time-turner-never-used-again (adapted: 'In Harry Potter, the Time-Turner' replaces the bare pronoun 'It' to make the question self-contained; otherwise verbatim)

**Aspect:** Magical objects: Time-Turners (false premise + date calculation).

**Why it is hard:** Premise is false per the wiki (reappears in Harry Potter et l'Enfant Maudit). Needs Retourneur de Temps (return, destruction in 1995-96, five-hour limit, Nott's two) plus the Pottermore text for the author's reason, and a date calculation (1993-94 loan; 1995-96 destruction). Easy to answer only the 'destroyed in OotP' half and miss the premise.

**Key points:**

1. False premise: it WAS used again. In the play Harry Potter et l'Enfant Maudit, two Time-Turners confiscated from Theodore Nott are central to the plot (and, unlike in book 3, they create separate futures and bring the user back after a shorter time).  
   *Source:* `Retourneur de Temps: les deux Retourneurs de Temps confisqués à Theodore Nott sont extrêmement présents dans l'intrigue`
2. Within the main saga, Hermione's Time-Turner was a loan from the Ministry for her third-year timetable; she gave it back at the end of that year.  
   *Source:* `Retourneur de Temps: elle rend le Retourneur de Temps à la fin de l'année`
3. In 1995-1996, during the Battle of the Department of Mysteries, all of the Ministry of Magic's Time-Turners were destroyed (two school years after Hermione used hers in 1993-1994).  
   *Source:* `Retourneur de Temps: tous les Retourneurs de Temps du ministère de la Magie sont détruits`
4. Their use is strictly limited: the user turns the Time-Turner once per hour to go back, with a maximum of five hours; beyond that the traveller is in danger, and use is governed by many laws and severe penalties.  
   *Source:* `Retourneur de Temps: le maximum étant cinq heures`
5. J.K. Rowling's stated reason (Pottermore text on the wiki): she had Hermione return the only Time-Turner ever brought to Hogwarts and destroyed the Ministry's whole stock, so that her characters could not go back in time afterwards, even for short durations.  
   *Source:* `Pottermore/Textes inédits français: empêchant ainsi mes protagonistes de remonter le temps par la suite`

**Judge note:** The expected answer must challenge the premise: per the wiki, Time-Turners do reappear in Harry Potter et l'Enfant Maudit (after 2017), though not in books 4-7 where the Ministry stock is destroyed in the Battle of the Department of Mysteries (1995-1996) and Hermione's one was returned in 1993-1994. Dates: 1993-1994 -> 1995-1996 is two school years later (Pottermore says three years after Hermione got permission; accept either as long as the destruction is placed at the Department of Mysteries battle in HP5). Accept answers that give the destruction + return + legal/five-hour limits + author's reason, and mention Cursed Child. Reject: saying Time-Turners never appear again anywhere; saying Cursed Child's Time-Turners survived from Hermione's/Ministry's stock (the wiki says they were two confiscated from Theodore Nott); inventing a longer range for the standard models. Do not penalise omission of the 'six time jumps' detail.

## MG05

**Prompt:** We know that house-elves can apparate into Hogwarts, where wand-carriers can't. Could they do the same with a high security vault at Gringotts?

**Tags:** abstain, hard:multihop

**Web source:** [Could a house-elf apparate into the high security vaults at Gringotts?](https://scifi.stackexchange.com/questions/64945/could-a-house-elf-apparate-into-the-high-security-vaults-at-gringotts)  
Exact page title: "Could a house-elf apparate into the high security vaults at Gringotts?"  
Origin field: web: https://scifi.stackexchange.com/questions/64945/could-a-house-elf-apparate-into-the-high-security-vaults-at-gringotts (adapted: verbatim)

**Aspect:** House-elves / Apparition / goblins: clear 'the wiki does not say' with related context.

**Why it is hard:** Abstain case with strong distractors: the wiki states elves ignore anti-Apparition protections (Hogwarts), which tempts a confident 'yes', and Gringotts has a security section, which tempts a confident 'no'. Absence verified over 48 pages from 9 searches.

**Key points:**

1. The wiki does NOT say whether a house-elf could Apparate into a Gringotts vault: no page states that Gringotts or its vaults have (or lack) anti-Apparition protection, nor that goblins guard against elf magic, nor shows an elf entering a vault.  
   *Source:* `absence; checked: pages Gringotts la banque des sorciers, Cambriolage de Gringotts (1998), Coupe de Helga Poufsouffle, Gripsec, Bogrod, Magie, Bataille de Poudlard, Bataille du manoir des Malefoy, Pottermore/Textes inédits français; plus a scan for Gringotts/chambre forte/coffre within 250 characters of transplan/Apparition/elfe across the 48 pages returned by 9 searches ('Gringotts transplanage', 'Gringotts elfe', 'chambre forte elfe', 'coffre transplaner', 'Gringotts Kreattur', 'Gringotts Dobby', 'banque sorciers protection transplanage', 'chambre forte Lestrange', 'Gringotts sécurité magie'): no relevant statement`
2. What the wiki does say: house-elves have a powerful magic different from wizards', which can let them Apparate into places wizards could not reach by the same method.  
   *Source:* `Elfe de maison: ce qui peut leur permettre de transplaner dans des endroits auxquels des sorciers seraient incapables d'accéder`
3. The wiki's Apparition page says some places are protected against Apparition (Hogwarts is the example) and that house-elves are not affected by those protections, so they can Apparate even inside Hogwarts.  
   *Source:* `Transplanage: ils ne sont pas affectés par les protections anti transplanage`
4. The wiki's description of Gringotts security is about goblin staff controlling access and identity of clients and permanently protecting the vaults (plus vault-opening systems such as a key or a goblin's finger or palm), with no mention of Apparition or elves.  
   *Source:* `Gringotts, la banque des sorciers: ils assurent en permanence la protection des fameuses chambres fortes`

**Judge note:** This is an abstain-with-context case: the correct answer says the wiki gives no information on elves and Gringotts vaults (it cannot confirm yes or no), while explaining the related facts it does contain (elves are unaffected by anti-Apparition protections, e.g. Hogwarts; Gringotts security as described is goblin staff, vault-opening systems and a dragon, with no stated anti-Apparition ward; the only extra vault protections on the wiki are Bellatrix's Duplication and Flagrance charms on the cup, not anti-Apparition). Reject: a confident 'yes' or 'no'; claims that goblin magic is resistant to all magic, that Gringotts has anti-Apparition wards, or that Kreacher/Dobby could or could not enter vaults (all web speculation); inventing the Horcrux-cave or Grimmauld Place elf examples as wiki evidence unless actually read.

## Check result

Run with python3 against the live `/page` API (paged reads): all non-absence sources are substrings, each fragment < 120 chars with no newline. Failures: 0.

Programmatic counts (Animagus page): 10 numbered steps in 'Processus'; known-Animagi list has 2 entries tagged '(déclarée)', 5 tagged '(non déclaré/e)', 1 ambiguous ('déclaré ou non déclaré').

## Rejected candidates

- scifi.stackexchange.com/questions/59971 (Was Dumbledore an animagus?): Dumbledore topic is excluded.
- scifi.stackexchange.com/questions/47502 (What would happen if Lupin drank Polyjuice Potion?): the wiki has no Polyjuice/werewolf interaction, but it would have duplicated the abstain slot already filled by MG05 and left only a weak 'wiki is silent' answer; kept in reserve.
- scifi.stackexchange.com/questions/153405 and /156335 (Time-Turner and Sirius): Sirius/Buckbeak rescue touches the excluded Sirius topic; MG04 uses the cleaner 'never used again' question.
- scifi.stackexchange.com/questions/8408 (Can house elves apparate inside Hogwarts?): answered in one lookup on Transplanage / Elfe de maison; too easy.
- Fandom/Wikipedia/Lexicon pages: not real asker questions.
