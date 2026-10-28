# List 28 — Research Sources: Stealing, Morale, Reputation, and Released Mochi Returning

**What this file is:** the research pass for the owner's 2026-10-27 brief — (1) released Mochi findable in the wild again, (2) stealing another Ranger's Mochi as a real system (the thing that was cheat-only in Pokémon), (3) a personal morale scale pulled 100% from Red Dead Redemption 2's Honor, and (4) reputation pulled 100% from another game — Fallout: New Vegas — with a long good/bad spectrum (the owner asked for roughly 25 steps a side, ~50 in total).

**How to read it:** every claim names its source. These are other games' documented designs, studied as construction kit — mechanics, numbers, and structures only. No text, assets, names, or characters from any source game are carried into Mochiichao; the specs built on top of this file are native. Where sources disagree, the disagreement is stated instead of smoothed over. Where nothing exists, that is stated plainly too.

**Sources used, by area:**
- Red Dead Redemption 2 Honor and Wanted — Red Dead Wiki (reddead.fandom.com, "Honor" and "Law Enforcement in Red Dead Redemption 2"), plus guide coverage from Accelerated Ideas, GameFAQs, GameRant, Polygon, Shacknews, and Gameranx.
- Fallout: New Vegas reputation — The Fallout Wiki (fallout.wiki, "Reputation" and "Fallout: New Vegas Reputation").
- Snagging — Bulbapedia ("Snagging," "Shadow Pokémon"), Smogon's Colosseum spotlight, the Pokémon Colosseum manual, Serebii's XD walkthrough, Wikipedia (Pokémon XD).
- Cheat-device stealing — PokéHarbor's Emerald cheat listings, PokéCommunity cheat threads, and the pret/pokeemerald decompilation wiki ("Add Thief Ball"), which quotes the games' own battle text.
- Mods/hacks — PokéCommunity (ellabrella's steal-trainer-mon decomp branch; the Rocket Edition thread), the pret/pokeemerald wiki, ScreenRant, CheatCC, and the Rocket Edition feature listings.
- Released Pokémon — Bulbapedia ("Released Pokémon," "Roaming Pokémon," "List of wild Pokémon from in-game events").

---

## 1. Red Dead Redemption 2 — the Honor system, 100%

*(Source for this section unless noted: Red Dead Wiki, "Honor.")*

### 1.1 The scale and the ladder

- Honor is **one single number** the player never sees directly: it runs from **−320 to +320**.
- That number is cut into **17 ranks: −8 through 0 to +8**, one rank every **40 points**. Rank 0 is neutral.
- The bar is **story-capped early on**: Arthur's honor "is capped at the beginning of the game and can't be maxed out as fully bad or good until after 'A Fork in the Road'" (a Chapter 6 story mission). So the extremes of the ladder are deliberately locked until late.
- In **Chapter 6, every honor change is multiplied by ×1.5** — the endgame makes your choices swing the scale harder.
- **There is no way to stop honor from changing in RDR2.** Wearing a bandana does *not* freeze honor (that was the first game's rule); in RDR2 the bandana only stops eyewitnesses recognising you. The wiki's framing matters for design: in RDR2 honor "is more about Arthur's self-reflection instead of his reputation" — it moves **even when nobody saw the deed**. (Polygon's bounty guide confirms the same split from the Wanted side: an unseen crime has no bounty, but "it will still affect your Honor score and your conscience.")

### 1.2 How honor moves — the actual numbers

RDR2's everyday numbers are **small** — single digits. The Red Dead Wiki's RDR2 table:

**Loses honor:**
| Deed | Change |
|---|---|
| Steal from beggars | −10 |
| Kill an innocent person | −5, ramping to −10 each if you keep killing innocents in a streak |
| Kill a horse / domestic animals / livestock | −5 |
| Let a wild animal bleed out and die | −5 |
| Knock out an innocent person | −2 |
| Loot an innocent corpse | −1 |
| Rob a person | −1 |
| Theft, vehicle theft, horse theft | −1 |
| Antagonise people (every 3rd time) | −1 |

**Gains honor:**
| Deed | Change |
|---|---|
| Capture bounty targets alive | +5 |
| Donate to beggars | +5 |
| Help people (stranger encounters) | +5 |
| Do camp or homestead chores | +5 |
| Surrender to law enforcement | +1 |
| Donate to the camp | +1 |
| Release a caught fish instead of keeping it | +1 |
| Kill rats in town | +1 |
| Greet people (every 3rd time) | +1 |

On top of the everyday table, **story missions carry their own bigger choices** (spare or kill, help or take the money, rescue or refuse). Guide coverage (Accelerated Ideas) puts most story choices at roughly **±10**, concentrated in Chapters 2 and 6. The design shape is: *tiny drips from daily behaviour, real movement from deliberate choices.*

**Contrast — the first game was much louder.** In Red Dead Redemption (2010) the same deed table ran into the hundreds: defend a stagecoach +400, complete a gang hideout +200, capture a bounty alive +200, kill an outlaw +10; kill an innocent −50, kill a lawman −100, bribe a lawman −500 (or −1000 with a $500+ bounty) (Red Dead Wiki, "Honor," RDR1 table). RDR2 deliberately compressed this so no single act rockets you across the ladder.

### 1.3 The rank ladder and what each rank actually does

RDR2 gives its ranks **no names** — just numbers and icons. The effects, per the Red Dead Wiki and corroborating guides (Accelerated Ideas; GameFAQs rank list):

| Rank | Points | Effect |
|---|---|---|
| +8 | +320 | (top of scale — no extra perk listed beyond rank 7's) |
| +7 | +280 | **50% discount in all shops** |
| +6 | +240 | A set of 8 outfits unlocks for purchase |
| +5 | +200 | **25% discount in all shops** *(see the disagreement note below)* |
| +4 | +160 | The Cattleman revolver's "Hero's Pearl Grip" becomes available |
| +3 | +120 | A first set of 8 outfits unlocks for purchase |
| +2 | +80 | **10% discount in all shops** |
| +1 | +40 | Looting bodies yields better *wholesome* drops — tonics, restoratives, jewellery, food |
| 0 | 0 | Standard loot |
| −1 | −40 | Looting bodies yields better *outlaw* drops — Dead Eye tonics, thrown weapons, alcohol, tobacco; more money and jewellery from dead lawmen |
| −4 | −160 | The Double-Action revolver's "Gunslinger Ebony Grip" becomes available |
| −2, −3, −5…−8 | — | **No further listed perks** — the low side's reward is the loot table at −1 and the grip at −4; below that, low honor is mostly story and reaction, not perks |

**Source disagreement, stated honestly:** the Red Dead Wiki's prose says the 25% discount arrives at **rank 4**, while its own guide ecosystem (Accelerated Ideas' table, the GameFAQs rank post) puts 25% at **rank 5 (+200)** and leaves rank 4 blank apart from the grip. The 10% (rank 2) and 50% (rank 7) thresholds agree everywhere. Anyone building on this should pick the guide-table version (2 / 5 / 7) or the wiki-prose version (2 / 4 / 7) knowingly — they are not the same ladder.

**The named ladder belongs to the first game.** RDR1 had only 7 ranks, and they were named (Red Dead Wiki, "Honor," RDR1 section): **+3 Hero, +2 Peacemaker, +1 Honest Joe, 0 Drifter, −1 Rustler, −2 Road Agent, −3 Desperado.** Its effects were chunkier: Honest Joe = jobs pay double; Peacemaker = shop prices improved 50% and the Duster Coat; Hero = lawmen and civilians only report crimes after a first murder or bank robbery, and a nun gifts a protective item; Rustler = bribing eyewitnesses costs 50% less; Road Agent = 50% better prices in the outlaw town of Thieves' Landing, and whistling can summon a unique Dark Horse; Desperado = civilians only report crimes after a first murder or bank robbery.

### 1.4 Every other concrete effect

- **NPC reactions.** At high honor, civilians are friendlier day to day; if you accidentally startle or bump someone they are more likely to shrug it off than draw on you or report you (GameRant's honor guide). Witnesses are **more willing to accept a bribe** to look the other way at high honor. At low honor the world reads you as selfish and dangerous, and greetings/dialogue sour.
- **The loot flip.** Honor quietly re-themes what the world drops for you: the good man's world gives tonics, food, and jewellery; the bad man's world gives Dead Eye tonics, throwables, alcohol, tobacco, and richer pickings off dead lawmen (Red Dead Wiki; GameFAQs). Neither side is strictly better — both sides *pay*, differently. That is the system's core trick.
- **Story and ending.** Honor changes cutscene dialogue throughout, Arthur's remembered voice-lines and visions (a buck in sunlight at high honor, a black coyote in the rain at low), and **the ending itself**: a high-honor Arthur dies succumbing to illness and wounds; a low-honor Arthur is killed directly by Micah. His tombstone, epitaph, and the animal that visits it (eagle vs coyote) all follow honor. His final outfit's waistcoat is blue at high honor, red at low (Red Dead Wiki).
- **Mission/opportunity gating.** Honor gates *goods*, not whole missions, in the story mode: outfits at +3 and +6, weapon grips at +4 and −4, discounts at +2/+5/+7. (In Red Dead Online, the same scale *does* gate content directly: high honor routes you to the "Path of the Gunslinger" mission set, low honor to the "Path of the Outlaw" set — four missions each — and honor can be reset by paying Old Man Jones 3 gold bars. Red Dead Wiki, Online section.)
- **Law interaction.** In RDR2 proper, honor does not change your bounty maths — that is the Wanted system's job (Section 5). Honor's law-side effects are the soft ones above (witness forgiveness, bribe acceptance). The hard "witnesses stop reporting small crimes" effect is an **RDR1** Hero/Desperado perk, not RDR2 — worth knowing because the two games are often conflated.

### 1.5 Design shape, in one paragraph

One hidden number, −320…+320; 17 ranks; everyday deeds move it by 1–10 points, story choices by ~10; both extremes *reward* you but with opposite goods (discounts and trust vs outlaw loot); the extremes are story-locked until late; the last chapter multiplies everything by 1.5; and the scale measures **who you are when nobody is watching** — it moves for unseen deeds, separately from whether the law ever finds out.

---

## 2. Fallout: New Vegas — reputation, 100%

*(Source for this section: The Fallout Wiki — fallout.wiki — "Reputation" and "Fallout: New Vegas Reputation.")*

### 2.1 The core idea: two piles that never cancel

- Reputation is tracked **separately for every faction and town** (NCR, Caesar's Legion, Brotherhood of Steel, Boomers, Great Khans, Powder Gangers, Followers of the Apocalypse, White Glove Society, plus towns like Goodsprings, Novac, Primm, Freeside, the Strip).
- For each group there are **two separate counters: Fame (good deeds toward them) and Infamy (bad deeds toward them). They are tracked separately and never subtract from each other.** Doing good does not erase your infamy; it just adds fame next to it. The wiki is explicit: "there is no permanent way to move from 'Hated' back to 'Neutral'" — you can only pile enough fame to change the *combination* (Hated → Sneering Punk → Unpredictable → Dark Hero), and once you reach the most mixed label of all (Wild Child) "there is no ability to change it at all."
- Points arrive in fixed scripted bumps. The editor's five bump sizes convert to **1 / 2 / 4 / 7 / 12 points** (Very Minor / Minor / Average / Major / Very Major). Two universal examples the wiki lists for every town and faction: **being caught stealing = −2 infamy each time; openly killing a member of the group = −30 infamy each.**
- Each counter is bucketed into **4 ranges**, and **the range thresholds are different for every faction** — a big faction is harder to impress. Examples (Range 2 / 3 / 4 thresholds): Goodsprings 3 / 8 / 15; Brotherhood of Steel 3 / 10 / 20; Boomers and Followers 8 / 25 / 50; NCR 12 / 40 / 80; Caesar's Legion 15 / 50 / 100; the Strip 6 / 20 / 40. (Some secondary listings use a standardised 0–4 / 5–14 / 15–29 / 30+ grid; the per-faction table on the main wiki page is the detailed one and is what is quoted here.)

### 2.2 The 16 named reputations

Your label with a group is the **combination** of your fame range (columns) and infamy range (rows) — 16 named outcomes:

| Infamy ↓ / Fame → | Range 1 (none) | Range 2 | Range 3 | Range 4 (most) |
|---|---|---|---|---|
| **Range 1 (none)** | **Neutral** — "People don't know enough about you to form an opinion." | **Accepted** | **Liked** | **Idolized** |
| **Range 2** | **Shunned** | **Mixed** — "people haven't figured you out yet" | **Smiling Troublemaker** — "good at heart even though you're occasionally a troublemaker" | **Good-Natured Rascal** |
| **Range 3** | **Hated** | **Sneering Punk** | **Unpredictable** | **Dark Hero** — "some kind of hero, but you sure can be nasty sometimes" |
| **Range 4 (most)** | **Vilified** — "for your overwhelmingly monstrous behavior" | **Merciful Thug** | **Soft-Hearted Devil** — "the devil himself, but most admit you've also done a world of good" | **Wild Child** — "your wild, seemingly capricious behavior leaves people… avoiding close contact" |

The mixed middle is the point: New Vegas can say "hero with a dark streak" (Dark Hero), "beloved rascal" (Good-Natured Rascal), and "nobody can read you" (Wild Child) — labels a single good/bad line **cannot express**, because on a single line those deeds would have cancelled out to "neutral."

### 2.3 What reputation actually does

Effects are **per-faction and hand-authored**, not a global formula (The Fallout Wiki, consequences tables). Documented examples:

- **Goods/merchants:** Powder Ganger merchants sell at a straight 1-to-1 rate once you're Liked; the Brotherhood's Knight Torres sells an extended stock at Smiling Troublemaker-or-better and her *entire* stock only at Idolized — but taking the mixed-reputation discount route (Mixed to Wild Child makes her sell cheaper) **blocks** the Idolized full stock. Reputation routes can close each other off.
- **Regular gifts:** at Positive with the Powder Gangers, Eddie hands you dynamite and powder every few days, and the amount scales with how positive the label is (up to 5 sticks and 20 powder at Idolized). The Brotherhood restocks an ammo crate for you at positive labels.
- **Keys, safehouses, access:** Liked with the NCR earns the Ranger Safehouse key and monorail access without hostility; Liked with the Legion earns the Legion Safehouse key; Accepted with the Legion unlocks a special unarmed move taught by Lucius (with the skill to learn it); Idolized with the Followers earns a lab coat and safehouse key; Positive with the NCR earns the NCR Emergency Radio.
- **Companions as moral sensors:** Arcade Gannon joins only at Positive with the Followers and refuses at Negative, and refuses if you're friendly with the Legion; Veronica leaves — and can turn hostile — if your Brotherhood reputation sours; Boone and Cass refuse you at negative NCR standing.
- **Hit squads:** at Negative with the NCR or Legion, that faction sends **assassins/hit squads after you in the world**; the NCR first sends a warning squad that gives you **three days to fix your reputation** before they come to kill you.
- **Disguises:** wearing a faction's armour resets how *other* factions read you (you're treated as that faction, reputation neutral) — and a hidden, silent, one-hit kill on a faction member earns no infamy; being seen is what costs you.
- **Rare resets:** reputation almost never comes off either pile. The only erasers are story moments — meeting Mr. House clears your NCR infamy pool, confronting Benny triggers Caesar clearing your Legion infamy — and one paid rumour-monger in Freeside who can shave infamy or add fame for caps, a limited number of times.
- New Vegas *also* still has the series' old single-axis **Karma**, but the wiki and the design agree it is minor next to reputation: reputation is what NPCs, prices, and access actually read.

### 2.4 How this differs from a single good/bad scale

On a single scale (RDR2's Honor), good and bad deeds **cancel** — steal ten, help ten, you're nobody. In New Vegas they **accumulate in parallel**, per group: you can be Idolized by one town and Vilified by its enemy at the same time, and with a single group you can be a Dark Hero — famous for good *and* bad, permanently. Reputation is also **about what is known**: hidden kills don't count; disguises change what people think you are. Honor knows what you did in the dark; reputation only knows what the world heard.

---

## 3. Stealing / catching an owned Pokémon

### 3(a). The official version: Colosseum & XD's Snag system

*(Sources: Bulbapedia, "Snagging" and "Shadow Pokémon"; Smogon, "Spinoff Spotlight: Pokémon Colosseum"; the Colosseum manual; Wikipedia, "Pokémon XD: Gale of Darkness.")*

- **The tool:** a **Snag Machine** worn on the arm. It converts **any normal Poké Ball into a Snag Ball** — there is no special ball economy; the machine is the licence to steal.
- **The restriction that makes it moral:** you can only snag **Shadow Pokémon** — Pokémon whose hearts were artificially closed by the villain organisation Cipher. Ordinary owned Pokémon **cannot** be snagged. In-fiction, the hero isn't a thief; he's repossessing abused Pokémon from the people who corrupted them. (The villains, Team Snagem, use the same machines to steal Pokémon *for* Cipher — the technology is neutral, the target list is the morality.)
- **You can't even see the targets yourself:** the hero cannot tell a Shadow Pokémon from a normal one. His partner can see their dark auras and will **physically stop you throwing a ball at a normal Pokémon**. Identification is a separate sense the game gives you through a companion.
- **The catch itself is exactly a wild catch:** weaken it, status it, throw. The Snag Ball "ignores that the Pokémon has already been caught and tries to catch it as if it was a wild Pokémon" (Bulbapedia). Success = the Pokémon is yours, immediately (Colosseum: straight into party/PC; if you then white out, **the snag still counts** — on the rematch the trainer's party is missing that Pokémon or has a replacement. XD changed this: snagged Pokémon sit in an on-screen tally and only join you **if you win the battle**; lose, and they're returned or flee).
- **Second chances are built in:** if you miss a Shadow Pokémon in XD, the wandering boss **Miror B. turns up later carrying the ones you missed** — the game tracks un-snagged Shadows (an in-game **Snag List / Shadow Monitor** keeps each one's status and whereabouts, and its nature/IVs/gender are fixed from your first encounter) and offers them again.
- **Aftercare is half the system — purification.** A snagged Shadow Pokémon arrives *broken*: it knows only Shadow moves (Shadow Rush: typeless, 90 power, recoil), **cannot gain XP, levels, EVs, or friendship, cannot evolve, be nicknamed, be traded, or be reordered** until purified, and may slip into **Hyper Mode** (Colosseum) / Reverse Mode (XD) where it ignores orders. It carries a **Heart Gauge — five bars** where its XP bar should be. The gauge empties through care: walking with it (a step of progress every 256 steps), battling with it, **calling it back to its senses** when it enters Hyper Mode (the battle menu's "Call" command exists for exactly this), scent massages, and (Colosseum only) Day Care time. As bars empty, its real moves and nature are revealed in stages (at 20% intervals: a move, then its nature, then more moves). At zero, a purification ritual at the Relic Stone (or XD's **Purify Chamber**, a set-up puzzle where surrounding purified Pokémon's type advantages set the "tempo") finishes the job: it gains its final move and **all the XP it would have earned, paid out at once**. Rare Time Flutes summon Celebi to purify instantly. XD has **83** Shadow Pokémon; that tracking-and-recovery loop *is* the game.

**The design lesson:** official Pokémon has exactly one stealing system, and it is fenced three ways — a special device, a special *kind* of victim (corrupted Pokémon only), and a long rehabilitation afterwards. Stealing is rescue, and rescue has a cost in care.

### 3(b). The cheat-device tradition: "catch the trainer's Pokémon" codes

*(Sources: PokéHarbor's Emerald cheat listings; PokéCommunity cheat threads; the games' own text as quoted in the pret/pokeemerald decompilation wiki.)*

- **The normal rule, in the game's own words:** in a trainer battle, throwing a ball produces the battle messages **"The TRAINER blocked the BALL!"** and **"Don't be a thief!"** — those two strings are in the retail games' battle text (preserved in pokeemerald's `battle_message.c` and quoted in the pret wiki's Thief Ball tutorial). The ball is wasted and nothing can be caught. Ownership is a hard block in the catch logic, not a catch-rate of zero.
- **What the codes do:** the famous GameShark / Action Replay codes for Ruby/Sapphire/Emerald and FireRed/LeafGreen (and equivalents for Diamond/Pearl/Platinum) patch that check out. PokéHarbor's Emerald listing gives the 4-line GameShark v3/Action Replay code under the heading "Catch Other Trainer's Pokemon," with the instruction used across listings: **press L+R before throwing the Poké Ball, then throw it and the trainer's Pokémon is caught as if it were wild.** The DS-era Action Replay versions are single short codes ("Steal Trainers Pokemon") doing the same job.
- **What can go wrong is part of the tradition:** PokéHarbor's listing warns the L+R step matters "to avoid getting a Bad Egg" — a stolen Pokémon carries its original trainer's ID/OT data, which doesn't match yours, and mishandled steals can corrupt into Bad Eggs. (The same OT mismatch is why decomp modders, below, had to write extra code for nicknaming and permanent theft.) In other words: the cheat doesn't add a system, it **removes a guardrail**, and the save file pays for the missing bookkeeping.

### 3(c). Mods, hacks, and decomp projects that made stealing a real feature

**1. ellabrella's `steal-trainer-mon` branch for pokeemerald (PokéCommunity, decomp thread "[Battle] — Catch Trainer's Pokemon? (decomp)").**
A working pokeemerald decompilation branch, installable by git remote into a clean pokeemerald project, built for a "Thieflocke" run (a Nuzlocke variant using *only* stolen Pokémon). It removes the trainer-block so balls work in trainer battles **and the battle continues after a successful steal** (the thing the cheat codes don't do cleanly). Known gaps the author states: stolen Pokémon get **no nickname prompt**, and because their OT isn't yours, the Name Rater won't rename them either — the thread pairs it with the pret wiki's "nickname from the party menu" mod as the workaround.

**2. devolov's "Thief Ball" — pret/pokeemerald wiki tutorial ("Add Thief Ball").**
The fullest documented implementation. Instead of removing the block for all balls, it adds **one special ball** (built by replacing the Premier Ball):
- Behaves like a normal Poké Ball on wild Pokémon, but has a **2.5× catch modifier against trainers' Pokémon**.
- The stolen Pokémon **keeps the original trainer as its OT** — the theft stays on its record.
- **Theft is permanent for important trainers:** a flag per stolen Pokémon means if you steal your rival's starter in battle one, **he will not have its evolution in the final battle**; Wally's and the Elite Four's teams are likewise edited by what you took. (The author notes the cost: a flag is needed for every permanently-stolen Pokémon, so only a curated set — rival, Wally, Elite Four, one gym Pokémon — is wired that way.)
- **Deliberate exclusions, with in-fiction reasons:** it doesn't work in the Battle Frontier, link/secret-base/e-Reader battles, or **double battles** — the tutorial adds the battle text **"There's too many witnesses…"** for that case, and **"Thief balls don't work in this kind of battle!"** for the others. Witnesses as a *mechanical* gate on stealing was invented here, by a modder.
- Stated limits: no Pokédex-entry/nickname screen on a steal, and stolen Pokémon aren't "valid" in external tools (PKHeX) because they were caught in places their species doesn't naturally occur.

**3. Pokémon FireRed: Rocket Edition (colonelsalt, PokéCommunity) — stealing as the whole game.**
The best-known full hack built on theft (CheatCC lists it under villain stories: "Steal a Pokémon from every Trainer"; ScreenRant and the project's own feature list agree on the mechanics):
- You play a Team Rocket grunt. **After you defeat a trainer, you may steal one Pokémon from their party.** Not mid-battle — *after*, as the spoils choice.
- **Rank gates the victims:** as you rise through Team Rocket's ranks you unlock the ability to steal from **more trainer classes**, eventually including major characters — early on you can only rob weak trainers; stealing a gym leader's Pokémon is a late-game privilege.
- It runs a **morality system and branching sidequests** alongside: citizens and criminals offer missions, whom you help or double-cross has "far-reaching consequences," and the game rewards playing nice *or* villainous. Secondary coverage describes a **bounty** layer on top: stealing raises your bounty, police and bounty hunters pursue you, and higher bounties unlock more lucrative underworld work — the theft, the law, and the underworld economy are one loop. (PokéCommunity thread discussion notes players found the bounty-gated content thin in practice — an honest warning that the loop needs content behind its gates.)

**Also noted:** other Rocket-themed hacks exist (e.g. the separate Pokémon Team Rocket Edition project), but Rocket Edition is the documented reference for theft-as-system; the decomp work above is the documented reference for theft-as-mechanic. No other widely documented hack was found that implements mid-battle trainer-catching as a headline feature — the space is mostly these two poles: *steal during battle with a special ball* (decomp) vs *steal after battle by rank* (Rocket Edition).

---

## 4. Released Pokémon coming back

### 4.1 The official rule: they don't

Bulbapedia, "Released Pokémon," states it flatly: in the core series, once a Pokémon is released "it is removed from the player's possession and **cannot be encountered again**." Release is deletion with a farewell message ("Bye-bye, Pokémon!"). That has been true from Generation I to IX. **No core Pokémon game lets you re-find a specific released individual.** In that strict sense, the owner's feature — *release a Mochi, later find that same individual in the wild, and it can be caught again by you or by another player* — **does not exist in Pokémon, and no ROM hack or fan game implementing released-individual tracking was found in this research either.** That piece of the design will be original, built on Pokémon parts (below).

### 4.2 The near-misses — official pieces that behave like it

- **The Pokémon that refuses to leave (Gen III–IV).** If you try to release the *only* Pokémon you own that knows a needed HM (Surf/Dive in Gen III; Surf/Waterfall/Rock Climb, plus Fly in HGSS, in Gen IV), the release fails and the Pokémon **comes back**, with the text **"<Pokémon> came back! Was it worried about you?"** (Bulbapedia, "Released Pokémon"). Pokémon Yellow's starter Pikachu likewise refuses release outright. This is the games' own precedent for *a release that doesn't take because the bond/need is real* — presented as the Pokémon's choice.
- **Event Pokémon respawn — but only if you never caught them.** Bulbapedia's "List of wild Pokémon from in-game events": stationary/event Pokémon (legendaries and the like) that you **defeat or run from** reappear — from Platinum onward, entering the Hall of Fame respawns them; Dialga/Palkia at Spear Pillar respawn after the Hall of Fame in Diamond/Pearl. But the moment you **catch** one, that door closes: catching and then releasing a legendary loses it forever (the respawn checks "never caught," not "not currently owned"). So even here, release ≠ return.
- **Roaming Pokémon — the persistent individual.** This is the closest machinery to what the owner wants (Bulbapedia, "Roaming Pokémon"). A roaming legendary is **one specific individual** the game tracks across the whole map and across encounters: its HP, damage taken, status condition (from Gen III), nature/IVs/shininess are generated once and **persist between battles** — you can wound it, lose it, find it three routes away, and it's *still hurt, still the same one*. It only stops when caught or defeated. A released-Mochi system needs exactly this pattern — a persistent individual record living in the wild encounter tables — pointed at ordinary species instead of legendaries.
- **Spin-off exception (Mystery Dungeon).** In the Mystery Dungeon games, legendary/mythical Pokémon you say farewell to **will reappear in dungeons again** (unless they joined via a story event) (Bulbapedia, "Released Pokémon," Mystery Dungeon section). It's a recruitment-roster mechanic, not a wild-individual simulation, but it is the one place in the franchise where "released" and "can be met again" coexist by design.

### 4.3 Verdict for the design

Released-individual return is **original design space**. The parts to build it from are all Pokémon parts: the roaming-Pokémon persistent-individual record (identity + state saved in the wild), the HM-Pikachu "came back" refusal as the emotional grammar for special cases, and the Colosseum Shadow Monitor / Snag List as the model for a device that can *track* a known individual in the wild. Nobody — official or modding — has shipped "your released partner, findable again, catchable by someone else." The multiplayer half (another player catching your released Mochi) has no precedent at all in the sources searched; Wonder/Surprise Trade moves owned Pokémon *between* players, but always by the owner's act, never via the wild.

---

## 5. Red Dead Redemption 2 — the Wanted system (brief)

*(Sources: Red Dead Wiki, "Law Enforcement in Red Dead Redemption 2"; Polygon's RDR2 bounty/wanted guide; Gameranx and Shacknews crime guides.)*

Honor decides how the world *feels* about you; Wanted decides whether it is *currently hunting* you. The chain:

1. **No witness, no crime (legally).** "If there's no one around to see you, is it really a crime?" (Polygon). Unseen crimes cost honor only — never a bounty.
2. **Witnesses investigate, then run.** A bystander who notices something shows as a **white eye icon**: they're figuring out whether a crime happened. Once sure (or if they saw it plainly), they become a **red eye** and run for the nearest lawman. In that window you can **chase them down and threaten them into silence, bribe them (high-honor witnesses fold easier), or kill them** — killing risks more witnesses. If they reach a lawman, the report lands.
3. **Unknown Suspect vs Known Suspect.** If you were masked/unrecognised, lawmen hunt an **"Unknown Suspect"**: a red search area appears on the map, lawmen sweep it, and if you slip out or run the timer down without being spotted, **there is no bounty at all** — the crime evaporates. If you were recognised — or lawmen spot you during the sweep (lawmen **always recognise you, mask or not**) — you become a **Known Suspect** and a **bounty is placed**. Clothing matters: townsfolk can recognise your *outfit* from a previous crime even if your face is covered this time.
4. **While wanted:** you stay wanted as long as lawmen have eyes on you; the higher the bounty, the more lawmen join. Defusing is possible for minor matters — an unknown suspect can talk investigating lawmen down, and for petty crimes you can **apologise and walk away**. You can also **surrender** before any shootout starts: you do jail time, lose money, or get busted out by the gang — and surrendering even gives +1 honor.
5. **The bounty persists, per state.** Bounties are **state-specific** and **accumulate** across crimes; bounty hunters only hunt you in states where you're charged. A high enough bounty flips you to **"Dead or Alive"**: pursuers turn aggressive, local lawmen are replaced or backed by **vigilantes, US Marshals, and dogs**, and bounty hunters come more often. Serious rampages can put a town into **lockdown** (shops shut, lawmen shoot on sight) for about six in-game hours (Polygon).
6. **Paying it off:** any bounty can be paid in cash at **any post office** — you don't have to sneak back into the state that wants you. Paying, surrendering, or never being identified are the three exits; the bounty never just decays on its own.

**The pairing with Honor, in one line:** Wanted is short-term and *evidentiary* (it needs a witness and an identification, and it can be paid away); Honor is permanent and *moral* (it needs no witness, moves in the dark, and can only be outweighed by living differently). RDR2 runs both at once, and they answer different questions — "are they after me?" vs "what have I become?"

---

## Sources index

- Red Dead Wiki — "Honor" (reddead.fandom.com/wiki/Honor): RDR2 scale −320…+320, rank effects, RDR2 and RDR1 deed tables, named RDR1 ranks, story/ending effects, Online paths.
- Red Dead Wiki — "Law Enforcement in Red Dead Redemption 2": witness reporting, Unknown/Known suspect, Dead or Alive, surrender, post-office payment.
- Accelerated Ideas — "Red Dead Redemption 2 Honor Guide": rank/points table (10% @2, 25% @5, 50% @7), story-choice magnitudes, deed lists.
- GameFAQs — "Honor Ranks — Red Dead Redemption 2": corroborating rank table.
- GameRant — "How the Honor System Works": NPC forgiveness and witness bribes at high honor; loot/rank summary.
- Polygon — "Red Dead Redemption 2 guide to Bounties and Bounty Hunting": witness eye-icon flow, Unknown Suspect search area, lockdown duration.
- Gameranx / Shacknews — wanted and bounty explainers: state-specific bounties, paying at any post office, surrender/jail.
- The Fallout Wiki (fallout.wiki) — "Reputation" and "Fallout: New Vegas Reputation": Fame/Infamy separation, bump sizes 1/2/4/7/12, per-faction range thresholds, the 16 named combinations and their flavour text, per-faction consequences, hit squads, disguises, reset exceptions, "no way back to Neutral."
- Bulbapedia — "Snagging": Snag Machine/Balls, catch-as-wild rule, Colosseum vs XD post-snag handling.
- Bulbapedia — "Shadow Pokémon": Heart Gauge, purification methods and restrictions, Hyper/Reverse Mode, Purify Chamber, Shadow Monitor.
- Bulbapedia — "Released Pokémon": the gone-forever rule, the HM "came back!" exception, Yellow Pikachu, Mystery Dungeon farewell exception.
- Bulbapedia — "Roaming Pokémon" and "List of wild Pokémon from in-game events": persistent individual state across encounters; event-Pokémon respawn conditions.
- Smogon — "Spinoff Spotlight: Pokémon Colosseum": snagging/purification play summary, Shadow Rush, Time Flutes.
- Pokémon Colosseum manual (via ManualMachine): snagging and purifying as the game itself teaches them.
- Wikipedia — "Pokémon XD: Gale of Darkness": 83 Shadow Pokémon, Miror B. second-chance appearances, Purify Chamber tempo.
- PokéHarbor — Pokémon Emerald cheats: "Catch Other Trainer's Pokemon" GameShark/Action Replay code, L+R instruction, Bad Egg warning.
- PokéCommunity — "[Battle] — Catch Trainer's Pokemon? (decomp)" (ellabrella): steal-trainer-mon branch, battle continuation, OT/nickname gaps.
- pret/pokeemerald wiki — "Add Thief Ball" (devolov): 2.5× Thief Ball, original-OT record, permanent-theft flags, witness/battle-type exclusions, "The TRAINER blocked the BALL!" / "Don't be a thief!" retail text.
- PokéCommunity / ScreenRant / CheatCC / Rocket Edition feature listings: Rocket Edition's post-battle steal-one rule, Rocket-rank gating of trainer classes, morality system, and bounty coverage.
