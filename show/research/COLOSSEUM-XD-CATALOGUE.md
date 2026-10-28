# Pokémon Colosseum + Pokémon XD: Gale of Darkness — Complete Mechanics Catalogue

**Purpose:** research catalogue for the List 30 pull-in (owner directive, 2026-10-27: "100% of the mechanics" from Colosseum and XD). This file is documentation and systems reference only — the construction kit. Nothing here copies game assets, text, or code; Mochiichao builds native systems on top of these documented rules.

**Sources:** public documentation only — Bulbapedia (bulbapedia.bulbagarden.net) is the primary source throughout, supplemented by Serebii.net and the Smogon University "Pokémon Colosseum and Pokémon XD: Gale of Darkness Mechanics Guide" (smogon.com/ingame/guides), which documents community reverse-engineered values. Each section names its sources. Where two solid sources frame a number differently, both framings are kept and flagged.

**Scope note:** the two games are near-identical at the chassis level (Generation III battle engine, almost everything a Double Battle) and differ mainly in how fleshed-out the Shadow systems are. Differences are stated per mechanic. "Colo" = Pokémon Colosseum (2003/2004), "XD" = Pokémon XD: Gale of Darkness (2005). Both are set in the Orre region, a desert region with almost no wild Pokémon — which is *why* the snag economy exists at all.

---

## 1. The Snag System

*Sources: Bulbapedia — "Snag Machine", "Poké Ball" (side-series section), "Aura Reader", "Rui"; Smogon mechanics guide (Snag Machine and Snag Balls).*

**The machine.** The Snag Machine is a wearable device (Team Snagem's technology in Colo; a sleeker Pokémon HQ Lab model in XD) that converts an ordinary thrown Poké Ball into a **Snag Ball** at the moment of the throw. Key rules:

- A "Snag Ball" is **not a separate ball type**. Any existing ball — Poké Ball, Great Ball, Ultra Ball, Master Ball — becomes a Snag Ball when thrown through the machine, and capture math is otherwise the ball's normal math (ball bonus, target's catch rate, HP/status). Many Shadow Pokémon carry **modified catch rates, usually higher (easier) than their species' normal rate** (Bulbapedia, "List of Shadow Pokémon").
- **One ball per turn.** The machine needs time to recharge; only one snag/catch attempt can be made per turn in battle, regardless of how many Pokémon the player controls in the Double Battle.
- **Snagging works inside Double Battles, even with two opposing Pokémon on the field** — the machine handles the aiming problem that blocks wild captures in later-generation doubles. No opposing Pokémon needs to have fainted first.
- In **Colo**, a snagged Pokémon joins the player **immediately** on capture (party if there's room, otherwise the PC). In **XD**, the snagged Pokémon is only actually transferred **when the battle is won** — snagging and then losing the battle does not bank the Pokémon (Smogon).
- There are **48 snaggable Shadow Pokémon in Colo and 83 in XD** (131 unique across both lists).

**Who may be snagged — the owned-Pokémon rule.** The Snag Machine exists to break the core series' hardest capture rule: a Pokémon that already belongs to a Trainer can normally never be caught. The machine overrides that — **but only for Shadow Pokémon, and only once they have been identified as Shadow**:

- **Colo's lock is social, not mechanical.** Wes's machine has no internal restriction. The check is his partner **Rui**, who can see the dark aura and physically stops any attempt on a non-Shadow Pokémon ("That Pokémon doesn't have a black aura!"). The machine *could* steal anything; the story won't let you. (This message fires even in contexts where Rui is absent, e.g. the Mt. Battle challenge — the lock is absolute in practice.)
- **XD's lock is mechanical.** Michael's machine is paired with the **Aura Reader** (§6) and has built-in failsafes: an alarm sounds and the machine will not function if the target is not an identified Shadow Pokémon. It also refuses to work while stolen — during the story stretch where Team Snagem has taken Michael's machine, the Miror Radar also stays silent.
- Wild Pokémon (XD's Poké Spots, §7) are caught normally, with ordinary balls and no machine involvement.

**Missed chances are recoverable.** A Shadow Pokémon that is knocked out instead of snagged is not lost: its Trainer can generally be re-battled, several Shadow Pokémon have documented second locations (e.g. the un-chosen Phenac starter evolutions resurface at the Snagem Hideout and the Shadow Pokémon Lab depending on starter choice), and XD adds an explicit roving recovery system — the Miror B. loop in §7.

---

## 2. Shadow Pokémon and the Heart Gauge

*Sources: Bulbapedia — "Shadow Pokémon", "Heart Gauge", "List of Shadow Pokémon"; Smogon mechanics guide (Shadow Pokémon, Heart Gauge, Shadow Boost).*

**What a Shadow Pokémon is.** A normal Pokémon whose heart has been *artificially closed* by Cipher, turning it into a fighting machine. Fiction-side signatures: a dark aura visible only to special sight (Rui / the Aura Reader), a concealed Nature, and — for XD001 only — a visibly altered body (§9). System-side, a Shadow Pokémon is defined by a bundle of restrictions:

- It knows **Shadow moves instead of (and later alongside) its normal moves** (§5), and keeps them until the purification ceremony.
- Its **experience bar is replaced by the Heart Gauge**. Experience and friendship earned in battle are **held in escrow** and paid out all at once on purification.
- It gains **no effort values (EVs)** while Shadow (vitamins still work).
- It **cannot be traded**, cannot enter multiplayer/battle-mode content, and is barred from certain facilities (Phenac Stadium challenge in Colo; the Day Care and Orre Colosseum in XD). It **cannot evolve until purified** (in Colo no Shadow Pokémon evolves by stone anyway; XD blocks evolution while Shadow).
- Shadow Pokémon controlled by NPCs ignore most of this: they always have their full movesets and never gain or lose gauge — the gauge only runs under the player's care.

**The Heart Gauge itself.** Five equal bars displayed on the summary screen in place of the EXP bar, full (dark purple) at capture, emptying as the heart opens. Underneath, each species has its own **total gauge value**, the same way species have different HP totals — a bigger number means a longer road. Documented Colo examples from the Shadow Pokémon list: **3,000** for early captures (Makuhita; the Bayleef/Quilava/Croconaw line), **4,000** for mid-game captures (Slugma, Quagsire, Misdreavus), with late-game, pseudo-legendary and legendary Pokémon carrying much larger gauges. XD's gauges are **smaller on average** than Colo's, matched by smaller per-action reductions (§3). While any of the gauge remains, the Pokémon's Nature displays as "????" and locked moves display as "????" with the note *"This can't be used because the heart's door is shut."*

**The five doors.** Each cleared bar is a stage of the heart's door opening, with a fixed in-game message and a fixed set of unlocks. (The fiction literally counts the gauge in doors — Cipher "shuts the door to the heart.")

| Gauge remaining | Message | Colo unlocks | XD unlocks |
|---|---|---|---|
| 5 bars (100%) | "The door to its heart is tightly shut." | Only Shadow Rush usable. No EXP/friendship gain at all. Hyper Mode possible (§4) | Only Shadow moves (2–4) usable. EXP accrues at **80% of the normal rate** (paid on purification) |
| <5 bars (80–99.9%) | "The door to its heart is starting to open." | — | **Reverse Mode becomes possible** (§4) |
| <4 bars (60–80%) | "The door to its heart is opening up." | **First normal move regained** | First normal move regained. Friendship accrues at 80% rate |
| <3 bars (40–60%) | "The door to its heart is opening wider." | **Nature revealed.** EXP and friendship now accrue (paid on purification) | Nature revealed. Friendship from items accrues at 80% rate |
| <2 bars (20–40%) | "The door to its heart is nearly open." | **Second normal move regained** | Second normal move regained |
| <1 bar (0–20%) | "The door to its heart is almost fully open." | **Third normal move regained** (Colo only). Hyper Mode chance rises for many Natures | — |
| Empty (0%) | "The door to its heart is about to open. Undo the final lock!" | **Purification ceremony unlocked** | Purification ceremony unlocked |

Two cross-cutting rules: the Pokémon **keeps its Shadow moves through every stage** — normal moves come back *next to* them, and Shadow moves are only removed at the ceremony itself. And the gauge's progress feeds the frenzy systems: Hyper Mode rates are set by Nature × remaining gauge (Colo), Reverse Mode rates by species (XD).

**The Shadow Boost (XD).** Nearly every Shadow Pokémon fought in XD carries a "+" beside its level: a hidden boost to all of its stats while it is in enemy hands, small early and large late. The boost is **lost the moment it is snagged**. The Kanto legendary birds are exempt. (Smogon, crediting researcher Zari.) Design meaning: a corrupted opponent is *stronger than its sheet says*, and capturing it is also a nerf — the thing you rescue is weaker than the thing you fought.

---

## 3. Purification

*Sources: Bulbapedia — "Purification", "Heart Gauge" (reduction tables), "Purify Chamber", "Joy Scent" and sibling Scent pages; Smogon mechanics guide (Opening the Heart, Purification Process, Purify Chamber, Scents, Time Flute).*

Purification has two phases: **opening** (draining the Heart Gauge by any of the methods below) and the **ceremony** (the final act, only possible at 0% gauge). There is exactly one exception to the two-phase rule — the Time Flute — and one Pokémon that needs a third condition — XD001 (§9).

### 3.1 Opening the heart — the six channels

Every channel's yield depends on the Pokémon's **Nature** (in Colo and XD alike — the Purify Chamber is the one Nature-blind method). Each Shadow Pokémon keeps its **own step counter** for the walking channels, so party members drift out of sync.

| Channel | Colo yield range | XD yield range | Notes |
|---|---|---|---|
| **Battle** (sent into battle; once per battle — re-sending, switching back in, or reviving mid-battle doesn't re-count) | 50–200 | 70–130 | The baseline channel |
| **Call** (calling it out of Hyper/Reverse Mode in battle, §4) | 150–600 | 240–360 | The strongest single act for many Natures; also the only cure for frenzy |
| **Walking in party** (per 256 steps) | 50–200 | 70–130 | Each Pokémon counts its own steps |
| **Day Care** (per 256 player steps; **Colo only**) | 150–600 | — (XD's Day Care refuses Shadow Pokémon; data exists but is unused) | Yields no Day Care EXP — heart only |
| **Scents** (massage items, §3.2) | Joy 50–200 / Excite 100–400 / Vivid 150–600 | Joy 70–130 / Excite 140–260 / Vivid 210–390 | Repeatable, purchasable |
| **Purify Chamber** (XD only, §3.3) | — | formula, §3.3 | Nature has **no effect** here |

Reading the tables (Bulbapedia prints all 25 Natures for both games): every Nature has a *specialty channel* — e.g. in Colo, Docile Pokémon open fastest by being Called (600) and barely by battling (75); Relaxed/Timid/Gentle Pokémon open fastest in the Day Care (600); Lonely/Bashful/Mild open fastest to a Vivid Scent (600). The design is that **no single routine is optimal for everyone — you read the individual's temperament and choose the care that reaches it**. The three strongest channels overall are Call, Day Care (Colo), and Vivid Scent; even their worst Nature match beats the other channels' worst.

### 3.2 Scents (colognes)

Three massage scents, sold only in Agate Village, carried in a dedicated Cologne Case: **Joy Scent ₽600, Excite Scent ₽800, Vivid Scent ₽1,200** — strictly escalating tiers (for normal Pokémon they also raise friendship at 1×/2×/3× strength). On a Shadow Pokémon a massage cuts the gauge by the Nature-scaled amounts above. A Scent is also one of the out-of-battle **cures for Hyper/Reverse Mode** (§4).

### 3.3 The ceremony

At 0% gauge the Pokémon is *ready*, not yet purified. The ceremony proper:

- **Colo:** only at the **Relic Stone in Agate Village** (Celebi's shrine). Agate only opens after the Pyrite Town story arc, roughly a quarter into the game — purification literally cannot be completed early.
- **XD:** at the Relic Stone **or** directly in the Purify Chamber at the Pokémon HQ Lab (arranging sets can be done from any PC, but the final purification step must be done at the Lab in person).
- **On purification:** all escrowed EXP and friendship land at once; EV gain switches on; the Shadow moves are removed and the final normal moveset takes their place; the Pokémon receives a **special ribbon exclusive to purified Pokémon**; trade lock lifts. In **XD**, a purified Pokémon also learns a **bonus move it could not otherwise have** — one TM move, sometimes an egg move, and a signature-style special move (documented examples: Refresh, Heal Bell, Helping Hand across the roster). Purification is a graduation with a gift attached, not just a debuff removal.

### 3.4 The Time Flute (Colo only)

A flute that summons **Celebi** to the Relic Stone and **instantly purifies any one Shadow Pokémon regardless of gauge** — the only skip in the system. It is deliberately scarce: **exactly three exist** in Colo (one awarded after the Mt. Battle story section, one in The Under reached via the U-Disk, one at Mt. Battle's summit just before the 100th battle). The documented advice is to spend them on the largest gauges (the legendary beasts, the pseudo-legendaries). XD has no Time Flute equivalent — its accelerator is the Chamber.

### 3.5 The Purification Chamber (XD) — full mechanics

*Source: Bulbapedia — "Purify Chamber" (mechanics + rate formula); Serebii — "Pokémon XD – Purification Chamber".*

The Chamber, built at the Pokémon HQ Lab by Professor Krane and Michael's late father *in case Cipher ever returned*, replaces Colo's Day Care channel with a full arrangement puzzle:

- **Nine Sets.** Each Set is a ring of **up to four non-Shadow Pokémon** arranged around **one Shadow Pokémon in the centre** — so up to **nine Shadow Pokémon purify simultaneously**, and the ring Pokémon are ordinary party/storage Pokémon doing the work by *who they are next to*.
- **Flow** is the quality of the ring's **clockwise type chain**: for each adjacent pair, the left Pokémon's type effectiveness against the next Pokémon clockwise sets the strength — super effective = strongest, neutral = weaker, resisted = weaker still, immunity = weakest (with two house rules: **Normal counts as super effective against Normal**, and dual-types are judged by their weakness if they have one — weaknesses are prioritised over resistances). The Shadow Pokémon's own type matchup against the ring Pokémon it *faces* (it can be rotated) also feeds flow: facing something it hits super effectively strengthens flow, facing something that resists it weakens it. A ring whose four Pokémon have **no overlapping types** generates the strongest flow, and stacking Sets that meet that standard adds **cross-Set bonus bars** (one small bar per qualifying Set) — but removing a Pokémon from anywhere costs every Set a bar, and a Shadow Pokémon sharing a type with a ring member caps that Set's flow at four bars.
- **Tempo** is the speed the Set actually purifies at. High flow raises tempo (the chamber music literally speeds up); low flow purifies at about the rate of just walking with the Pokémon in the party. Flow and tempo are raised similarly but are **mechanically distinct** — which matters for exactly one Pokémon (§9).
- **Rate formula (Bulbapedia's documented calculation).** Every **161 steps**, each Set reduces its centre Pokémon's gauge by:
  - a **base set by ring size**: 1 ring Pokémon = 10, 2 = 27, 3 = 49, 4 = 96;
  - **+6 per super-effective matchup** in the ring, **−3 per not-very-effective matchup** (doubled if the ring is full at 4);
  - multiplied by **×4/3** if the Shadow Pokémon faces a ring Pokémon it is super effective against, **×2/3** if resisted (rounded up);
  - plus, when at least two Sets have "perfect" flow (four unique, synergistic types), a cumulative bonus to each such Set by how many Sets qualify: **+1, +5, +10, +15, +25, +35, +50, +100** for 2 through 9 qualifying Sets.
  - **Nature is ignored** — the Chamber is the one temperament-blind channel.
- A notification pops when a chambered Pokémon is ready for the ceremony; pulling a Pokémon out mid-process simply pauses its progress (gauge already lost stays lost) — **except XD001, whose gauge resets to full if the process is interrupted** (§9).

---

## 4. Hyper Mode (Colo) and Reverse Mode (XD)

*Sources: Bulbapedia — "Hyper Mode" (entry rates, disobedience table, cures), "Reverse Mode", "Critical hit", "Shadow Rush"; Serebii — "Pokémon XD – Reverse Mode"; Smogon mechanics guide.*

A Shadow Pokémon under the player's control can slip into a frenzy state in battle. The two games implement it as near-mirror designs with opposite tempers. **Entering the state costs Colo a turn** (the Pokémon spends the turn with its emotions "rising to a fever pitch"; its status meter and aura turn red-and-black) and **costs XD nothing** (it can trigger at the end of the Pokémon's phase, even as the opposing Trainer falls). Both states **persist after the battle ends**; NPC Shadow Pokémon never enter either.

### 4.1 Hyper Mode (Colo)

- **Trigger:** only when ordered to use **Shadow Rush**. Entry chance is set by **Nature × remaining gauge** — documented bands run from 5% up to 70% depending on the Nature group and how many bars remain; several Nature groups stay dangerous right up to the ceremony (one group holds 50% at every stage; the Adamant/Bashful/Hardy/Relaxed group peaks at 70% with four bars left). Counter-intuitively, some Natures get *more* likely to slip as the heart opens before settling.
- **The upside:** Shadow Rush becomes a near-guaranteed critical hit. Bulbapedia's Shadow Rush article states a **95%** critical chance in Hyper Mode; its Critical hit and Hyper Mode articles decompose the mechanic as a **second, independent 90% crit roll** after the normal 6.25% roll (≈90.6% overall). Both framings are documented; the take-away is "crits almost always."
- **The cost — disobedience.** Ordered to use **any move other than Shadow Rush**, a Hyper Mode Pokémon may instead: fire off a random eligible move on its own; attack the opposing **Trainer** (no mechanical effect); attack **its own Trainer** (no mechanical effect); hit **itself** (confusion-style self-damage); freeze and do nothing; try to **use an item without permission** (its held item, or nothing if it holds none); or try to **return to its Ball** (switching itself for the first available party member, ignoring trapping effects). Each outcome — including simply obeying (a flat 10% in most bands) — has a documented per-Nature probability; e.g. the Gentle/Jolly/Mild/Naive group uses a random move 40% of the time, the Careful/Docile/Quiet/Serious group spreads ~12% across everything with 16% obedience.
- **Item lock:** no items may be used on a Pokémon in Hyper Mode — *"It won't accept an item!"* — **except Scents**.
- **Cures:** **Call** it in battle (also drains gauge by the Nature-scaled Call value, 150–600 — calling out of frenzy is the single biggest heart-opener for several Natures); a **Scent** out of battle; leaving it at the **Day Care**; fainting; or a **1/256 chance per turn processed** of snapping out on its own. (If it faints to poison damage on the overworld, it *stays* in Hyper Mode when healed.) Purifying a Pokémon ends the state by definition.

### 4.2 Reverse Mode (XD)

- **Trigger:** can activate after **any Shadow move is used in the battle — even one used by a different Pokémon**, with an activation rate set by **species**; available once the first gauge bar has started opening (gauge below full).
- **Effects:** the Pokémon hurts **itself at the end of every turn** for **1/16 of its maximum HP** (rounded down, ±1 chosen at random, the same tick as Colo's Shadow Rush recoil). No critical-hit bonus. Items are blocked except Scents, as in Hyper Mode. *Source disagreement, flagged honestly:* Bulbapedia's current Reverse Mode article states Reverse Mode causes **no disobedience effects**, while Serebii's XD coverage (and Bulbapedia's older revision) describe it as possibly **disobeying when ordered to use a non-Shadow move** while using Shadow moves freely. The self-damage and item lock are agreed by all sources.
- **Cures:** Call, a Scent, or fainting. Calling out of Reverse Mode also opens the heart (XD Call yields 240–360 by Nature).
- Neither state can touch **Shadow Lugia**, which is immune to both (§9).

### 4.3 The Call command (both games)

Orre battles replace the **Run** command with **Call** — there is no running from Trainer battles, and from wild battles only via Teleport/Roar/Whirlwind-class effects (escape items traded in from the GBA games are flatly "forbidden in the Orre region"; a traded-in Smoke Ball still works). Call's uses: snap a Pokémon out of Hyper/Reverse Mode (with the gauge drain above); **wake a sleeping Pokémon** (it functions as the games' Poké Flute); in Colo, calling a Pokémon that is neither frenzied nor asleep simply wastes the turn (which is itself a documented stall tactic while snagging); in XD, calling such a Pokémon instead **raises its accuracy by one stage**, so the command is never dead.

---

## 5. Shadow Moves

*Sources: Bulbapedia — "Shadow move" / "Shadow (type)" (full table + type rules), "Shadow Rush", "Recoil"; Smogon mechanics guide.*

**The class rules.** Shadow moves are a move class with **no type** (the type slot displays blank). They:

- have **infinite PP** (displayed as "--") and can never be copied by Mimic, Sketch, or Mirror Move;
- are **forgotten at purification** — they exist only while the heart is closed;
- in **Colo** are exactly one move, neutrally effective against everything (though they still hit through Wonder Guard);
- in **XD** follow the class's signature effectiveness rule: **super effective against every non-Shadow Pokémon, not very effective against Shadow Pokémon**. XD's damaging Shadow moves are also the franchise's first **per-move physical/special split** — each move carries its own category a generation before the main series adopted it. No Pokémon gets STAB on a Shadow move, since nothing has the Shadow type.
- As the Heart Gauge drains, normal moves **return alongside** the Shadow moves at the door thresholds (§2); Shadow moves are only removed at the ceremony, where in XD the purified Pokémon additionally picks up its bonus move (§3.3).
- In XD, **every Legendary Shadow Pokémon carries a signature Shadow move** — a corrupted mirror of a move it would normally know (Shadow Lugia's Shadow Blast mirrors Aeroblast), at lower base power than the original but effectively stronger because it is almost always super effective.

**The full class list (XD values; Colo's single move shown in both forms):**

| Move | Cat. | Power | Acc. | Targets | Effect |
|---|---|---|---|---|---|
| Shadow Rush (Colo) | Physical | 90 | 100% | Single | Recoil of 1/16 user's max HP (not blocked by Rock Head); near-guaranteed crit in Hyper Mode (§4.1) |
| Shadow Rush (XD) | Physical | 55 | 100% | Single | Power cut, recoil removed |
| Shadow Blitz | Physical | 40 | 100% | Single | Basic tackle-class hit |
| Shadow Break | Physical | 75 | 100% | Single | Ram-class hit |
| Shadow End | Physical | 120 | 60% | Single | Recoil of **half the user's current HP** |
| Shadow Blast | Physical | 80 | 100% | Single | Blade of shadowy air; signature of Shadow Lugia; elevated critical-hit tendency |
| Shadow Wave | Special | 50 | 100% | Both opponents | Spread hit |
| Shadow Rave | Special | 70 | 100% | Both opponents | Shadowy spikes from the ground |
| Shadow Storm | Special | 95 | 100% | Both opponents | Spread tornado; strongest spread Shadow move |
| Shadow Bolt | Special | 75 | 100% | Single | May paralyze |
| Shadow Chill | Special | 75 | 100% | Single | May freeze |
| Shadow Fire | Special | 75 | 100% | Single | May burn |
| Shadow Sky | Status | — | 100% | Field | **Shadow weather for 5 turns**: damages all non-Shadow Pokémon each turn; Shadow Pokémon are unharmed |
| Shadow Hold | Status | — | 80% | Both opponents | Opponents cannot escape/switch |
| Shadow Mist | Status | — | 100% | Both opponents | Sharply lowers evasiveness (−2 stages class) |
| Shadow Panic | Status | — | 60% | Both opponents | Confuses all targets |
| Shadow Down | Status | — | 100% | Both opponents | Sharply lowers Defense |
| Shadow Shed | Status | — | 100% | Opposing side | Removes Reflect/Light Screen-class effects |
| Shadow Half | Status | — | 100% | **All Pokémon on the field** | **Every Pokémon's HP is cut in half** — including the user's side |

Design notes the table makes plain: every Shadow status move is *hostile* (debuffs, traps, confusion, field damage) — none buffs the user or its team — and the class's two field moves bend the whole battle around corruption: Shadow Sky makes the weather itself a weapon that only the corrupted are immune to, and Shadow Half is a symmetric board-wipe of HP that the corrupted side plans around and the clean side fears.

---

## 6. The Aura Reader (XD) — and Rui (Colo)

*Sources: Bulbapedia — "Aura Reader", "Snag Machine", "Michael", "Rui".*

Identification is the gate the whole snag economy hangs on, and the two games gate it with different technology:

- **Colo — a person.** Rui has a natural gift: she can *see* the black aura around a Shadow Pokémon. In battle she identifies the Shadow Pokémon on sight, and her intervention is the only thing enforcing the Shadow-only snag rule (§1). The system dependency is a companion character.
- **XD — a device.** The **Aura Reader** is an ear-worn scanner with a lens that swings down over the eye, built into Michael's Snag Machine package. When an opponent sends out a Pokémon, the Reader fires automatically and flags whether it carries the dark aura; the Snag Machine's failsafes then unlock snagging for that target and stay locked (with an alarm) for everything else. The sequel's move from *gifted person* to *mass-produced scanner* is also the fiction's tell that the technology has matured between games — identification is no longer a miracle, it's equipment.

Either way, the rule the pair of games teach is identical: **you may only take what you can prove is corrupted** — detection first, seizure second, and the seizure tool refuses to work without the detection step in XD's implementation.

---

## 7. Poké Spots, the Spot Monitor, and the Miror B. Loop (XD)

*Sources: Bulbapedia — "Poké Spot", "Miror Radar", "List of Shadow Pokémon"; Serebii — XD Poké Spots / Purification Chamber coverage; Smogon mechanics guide (Poké Spots).*

XD reintroduces wild Pokémon to Orre through a bait-and-wait system:

**The three spots.** Exactly three Poké Spots exist — **Rock** (east, near the Outskirt Stand), **Oasis** (west, near Pyrite Town), **Cave** (north, on Mt. Battle's flank) — each a terrain-typed lure point with a stone platform in the middle for bait. Each spot has a three-species table with fixed **50% / 35% / 15%** encounter weights:

| Spot | Common (50%) | Uncommon (35%) | Rare (15%) | Levels |
|---|---|---|---|---|
| Rock | Sandshrew | Gligar | Trapinch | 10–23 |
| Oasis | Hoppip | Phanpy | Surskit | 10–20 |
| Cave | Zubat | Aron | Wooper | 10–21 |

**Snacks and timing.** Wild Pokémon only appear if **Poké Snacks** are left on the platform — up to **10 at a time** (₽300 each at any Poké Mart once the system unlocks; Duking hands you your first 10 and the Spot Monitor). The snacks are **slowly eaten while a visiting Pokémon feeds**, so the bait pile is a countdown timer: the **Spot Monitor** function of the P★DA alerts you when a Pokémon is at a spot, and you must **physically travel there before the snacks run out** or the encounter is gone. The visitor's species, Nature, and shininess are locked in the moment the Monitor trips; its level and IVs are only rolled when the battle starts (the documented soft-reset seam). Two scripted visitors bend the table: the Gateon Port herb-seller's runaway **Munchlax** (10% chance in place of a normal visitor — it can't be caught and eats snacks much faster, but its owner arrives, refunds **10 snacks**, and adds a random herbal medicine as apology — a repeatable subsidy loop), and the runaway **Bonsly** (30% appearance chance after the S.S. Libra incident; it isn't battled — you creep up on it slowly to return it to its owner, which is also what unlocks the Special Battle Bingo card in §8).

**The rare-catch trade loop.** Catching a spot's rare species (Trapinch, Surskit, or Wooper — GBA-caught specimens also qualify) unlocks an in-game trade with **Duking** for a Pokémon carrying special moves (his Meditite, Shuckle, and Larvitar at level 20 with loaded movesets).

**The Miror Radar and Miror B.** XD's answer to "I knocked out the Shadow Pokémon instead of snagging it" is a *person*, not a menu. Any missed Shadow Pokémon ends up in the hands of **Miror B.** — Cipher's flamboyant ex-admin turned wandering collector (Colo spoiler baked into the design: in Colo he was the man *distributing* Shadow Pokémon as Pyrite Colosseum prizes; by XD he's scooping up the ones you drop). The **Miror Radar** (a key item he literally drops after your first XD encounter at the Cave Poké Spot) alarms whenever he surfaces, naming his location: the **Pyrite Colosseum**, the **Realgam Colosseum** — where he **randomly replaces one of the four Trainers in your current challenge round** — or one of the **three Poké Spots** (where sometimes only his henchmen Trudly and Folly show up instead). His team carries **one or two of your missed Shadow Pokémon**, giving you a live re-match for them. Ignore an alert too long and the signal is lost until the next one. The loop's endgame is itself content: after you've snagged 82 of the 83, the Radar fires at Gateon Port, where Miror B. is waiting with **#83, Shadow Dragonite** — and once you take it, **the Radar breaks and leaves your bag**. The tracking system exists only as long as there's something left to recover.

(In Colo, recovery is simpler and more static: re-battle the Trainer, or find the Pokémon again at fixed post-game haunts — Realgam Tower, the Snagem Hideout, the Shadow Pokémon Lab.)

---

## 8. Battle Structures

*Sources: Smogon mechanics guide (Stadiums and Colosseums, Mt. Battle, Realgam Tower, Orre Colosseum, Battle Bingo) is the backbone here; Bulbapedia — "Battle CD", "Battle Sims", "Mt. Battle" coverage; Serebii — XD facility pages.*

A general chassis rule first: **in the Orre games, doubles are the default format** — story battles, facilities, everything. Both games also share a "challenge" template for the colosseum venues: **4 rounds × 4 consecutive battles**, cash prize per cleared round (Amulet Coin-sensitive), and a **TM prize the first time each round is cleared**, with levels and species pools scaling per venue.

### 8.1 The colosseum circuit (Colo story venues, reused in Battle Mode)

- **Phenac Stadium** (Colo): levels ~40–42, weak/first-stage Pokémon; round TMs: Rain Dance, Sunny Day, Giga Drain, Solarbeam. Notable as the **only story area in Colo where Shadow Pokémon may not enter**. In XD the same stadium is a **plot location** rather than a challenge venue (Cipher's takeover of Phenac plays out there).
- **Pyrite Colosseum** (Colo): levels 50–55 after its mandatory story segment; TMs: Focus Punch, Hail, Roar, Brick Break. Fiction-side, this is Miror B.'s distribution stage (§9). In XD it returns as a flat **level 20** challenge; TMs: Brick Break, Taunt, Torment, Roar.
- **Under Colosseum** (Colo, in The Under beneath Pyrite): levels 55–59, final battles of each round fully evolved; TMs: Sandstorm, Sludge Bomb, Shadow Ball, Iron Tail. Doesn't exist in XD (The Under is gone from XD's map).
- **Realgam Colosseum / Realgam Tower** (both games): the gleaming tower is Colo's **final story dungeon** and hosts a colosseum challenge (in XD, flat level 40; TMs: Snatch, Giga Drain, Iron Tail, Solarbeam; the colosseum unlocks once you first reach the Snagem Hideout even though the tower unlocks earlier). In XD the tower grounds also host the **Battle Sim terminal** (§8.4) and its CD shop corner.
- **Deep Colosseum** (Colo only, post-game, beneath The Under): the connoisseur's venue — **five rounds instead of four**, levels 60–70; TMs: Taunt, Skill Swap, Rest, Dragon Claw (round 5 awards no TM).

### 8.2 Mt. Battle — the long climb (both games)

A volcano facility of **100 consecutive battles: 10 Zones (Areas) × 10 Trainers**. Story-mode rules:

- A Zone, once started, must be finished or abandoned — leave mid-Zone and you restart that Zone from battle 1. Zones can be repeated freely.
- Pokémon **gain EXP** here and are **fully healed after every battle** — it's Orre's premier training ground as well as a challenge.
- Winning pays in **Poké Coupons**, a facility-only currency (the Battle Points ancestor) exchanged at the Mt. Battle counter for items and TMs; in XD each Zone also awards a TM on first completion.
- The climb has story weight in Colo (Cipher attacks Mt. Battle mid-game; the summit, just before battle 100, holds one of the three Time Flutes; clearing the story section awards another).

**Battle Mode Mt. Battle VS 100 (Colo):** the 100-battle streak as a pure challenge — bring a team from your story save or from a GBA cartridge, fight 3v3 singles or 4v4 doubles drawn from a party of 6, no EXP, enemy levels scale to your team's highest (floor 50), no mid-run party swaps, suspend-but-not-quit, and "continues" earned by winning a battle without losing a Pokémon. Its famous prize: clear VS 100 **with a story-mode team after snagging and purifying all 48 Shadow Pokémon**, and you are gifted a **level 70 Ho-Oh**.

**Mt. Battle in XD:** same 100-battle spine, ending in the high 60s/low 70s with sharp level jumps every two Areas. Its prize is a choice: clear all 100 battles **in one unbroken run without ever swapping your party through the PC**, and you may pick **one Johto starter** — Chikorita, Totodile, or Cyndaquil — at level 5, each carrying an egg move plus its line's ultimate elemental move (**Frenzy Plant / Blast Burn / Hydro Cannon**). Repeatable for the others.

### 8.3 Orre Colosseum

- **Colo (Battle Mode only):** level 50 and open-level (100) brackets, Singles and Doubles, **8 Trainers in a row** per bracket — the game's pure endgame ladder.
- **XD (post-game, in-world):** rebuilt as a full facility — **7 rounds × 4 Trainers**, fixed **4v4 Doubles**, levels starting at 60 and scaling to your party's maximum. Documented as comparable in difficulty to the Battle Frontier / Pokémon World Tournament: the true final exam of XD.

### 8.4 Battle CDs and Battle Sims (XD)

*Sources: Bulbapedia — "Battle CD", "Battle Sims".*

**Battle Sims** are virtual battles against "Sim Trainers" — pre-set tactical puzzles. You are **given the team**; the battle is the exam. Themes and constraints vary: win within a turn limit, themed showdowns ("Legendary Beasts vs. Legendary Golems"), an all-Metronome battle. XD **opens with one** (Michael piloting a Salamence against a Metagross) as its tutorial-by-immersion. Beginner sims also run at the **Pokémon HQ Lab** under a Battle Coach (the game's first five sims live there).

**Battle CDs** are the collectible keys to the Realgam Tower sim library: **50 discs** scattered across Orre (some only obtainable post-story), each instantiating one Sim with an item prize on first clear (potions up to Rare Candies and TMs). Buy price where sold: ₽1,000. Clearing **all 50 pays 15,000 Poké Coupons**. (Datamined footnote in Bulbapedia's documentation: ten unobtainable CDs numbered 51–60 exist in the data, the last five duplicating the HQ Lab's beginner sims.)

### 8.5 Battle Bingo (XD)

*Source: Smogon mechanics guide (Battle Bingo); Bulbapedia — "Battle Bingo".*

Single-player bingo on a **4×4 card**. Each card deals you one preset Pokémon (exactly **one move** each — and not always a move of its own type) facing a grid of panel Pokémon. Entering a panel costs **1 Entry Point (EP)**; you start with **2 EP and 2 Master Balls**; each panel is a mini-battle you must **defeat or capture**, with spare Master Balls and EP hidden in some panels and **+1 EP per completed line**. Clear the card for Poké Coupons plus a first-clear item, with bonus coupons for leftover EP and Master Balls. Five difficulty tiers — **Beginner, Intermediate, Expert, Extra, Special** — across ten standard cards; finishing Beginner-through-Extra unlocks **1-Panel mode** (after your first panel, every next panel must be adjacent — a pathing puzzle). The **Special card** requires the **Bonsly Card**, earned by rescuing the runaway Bonsly (§7) — which also made it the first place a Generation IV Pokémon could be used in battle.

### 8.6 Quick battle modes

Colo's Battle Mode also offers GBA-linked versus play — teams uploaded from Ruby/Sapphire/FireRed/LeafGreen/Emerald cartridges via the GCN–GBA cable, plus the Mt. Battle VS 100 and Orre Colosseum above — and a **Battle Now** instant-battle option with preset teams. XD folds the equivalent into a **Quick Battle** mode (its Battle Now successor), since XD has no separate Battle Mode menu.

---

## 9. Cipher + Team Snagem — the Villain Structure as System Design

*Sources: Bulbapedia — "Shadow Lugia", "Orre", "Shadow Pokémon", "List of Shadow Pokémon"; community documentation via Pokémon Wiki (Shadow Lugia history). Character/episode specifics are used here only as system-design documentation (who operates which part of the machine), per the construction-kit rule.*

The two games share one villain **economy**, run by two organisations with different jobs — and the split is the design:

**Team Snagem — the thieves.** A gang whose one great asset is the **Snag Machine technology itself**: snagging is their trade and their name ("Snag 'em"). They are not ideologues; they are the supply of *seizure capability*. Colo opens with the protagonist stealing a Snag Machine from them and blowing up their hideout — the hero's core tool is villain tech, captured. By XD, Snagem has flipped to a rough anti-Cipher alliance of convenience (they want Cipher gone and their own legend restored), and at one point they steal Michael's machine in turn — the technology keeps changing hands, and every hand it passes through moves the war.

**Cipher — the manufacturer.** The syndicate that industrialised cruelty:

- **Production.** Cipher's scientists (Ein in Colo, Lovrina in XD) worked out how to *artificially close the door to a Pokémon's heart* — and, per Ein's research files, the explicit design goal was a Pokémon **not afraid to attack Trainers**, i.e. a weapon, not a partner. Colo production sits in the Shadow Pokémon Lab; XD scales it up at the **Cipher Key Lair**, a factory fed by bulk capture (the hijacked S.S. Libra's cargo of Pokémon, flown in by XD001 itself).
- **Distribution.** Finished Shadow Pokémon are issued to Cipher Peons and Admins as battle assets — in Colo, field agents carry **exactly one each**; by XD the pipeline has matured and multi-Shadow teams are common (the final boss fields **seven**). Distribution also ran through *legitimate-looking channels*: in Colo, Miror B. hands Shadow Pokémon out as **prizes in the Pyrite Colosseum tournament** he hosts — corruption distributed through the region's own sport, in public, with Duking (Pyrite's strongman) begging the player to enter and expose it.
- **Escalation doctrine.** Colo's endgame pairs its two strongest Shadow Pokémon with its two top men (Nascour's Shadow Metagross, Evice's Shadow Tyranitar). XD is the sequel-as-arms-race: Cipher's answer to Colo's mass purification is an R&D programme for a Shadow Pokémon that **cannot be purified at all**.

**XD001 — Shadow Lugia, the flagship as a system rule.** Lugia, captured and corrupted by Admin Lovrina into the first of a planned "XD series," is the one Shadow Pokémon whose body itself changed (dark purple plumage, jagged silver eye-spikes, red eyes, clawed toes). Its system rules are a deliberate break-list against everything §2–§4 established:

- It **cannot enter Reverse Mode** (or Hyper Mode, by Colo's parallel logic) — no frenzy flaw.
- **No ordinary channel opens its heart.** Battle, walking, calling, scents — none of it moves its gauge. In-fiction it is stated to be *completely* immune to purification.
- **The single exception is a facility at absolute maximum:** place XD001 in a Purify Chamber Set while **all nine Sets are at maximum tempo** (§3.5) and its gauge empties **instantly** — the maximal version of the community-arrangement system is the only key that fits the maximal corruption.
- **Interrupt it and it resets:** remove XD001 from the chamber before the ceremony and its Heart Gauge **closes completely again** — the only Pokémon whose progress is all-or-nothing.
- On purification it sheds its four Shadow moves (Shadow Blast, Shadow Storm, Shadow Down, Shadow Shed) and comes back with **Psycho Boost and Feather Dance as purification-exclusive moves**, alongside Earthquake and Hydro Pump.

Greevil, XD's Grand Master, fights the finale behind XD001 plus a full bench of Shadow legendaries — the economy's whole output concentrated in one team, which the player then dismantles piece by piece with the same snag-and-purify loop the economy created.

---

## 10. Everything Else Mechanical

*Sources: Bulbapedia — game articles for Colosseum and XD, "Sun Shard", "Moon Shard", "List of Shadow Pokémon"; Smogon mechanics guide (Regional Differences, In-Game Trades and Gifts, glitches); Serebii forums FAQ.*

**Starters — two opposite philosophies.**
- **Colo:** no choice at all. Wes begins with **Espeon (Lv 25) and Umbreon (Lv 26)** — already-evolved, already-loyal, non-Shadow partners from his Snagem past. The "starter choice" moment is displaced into the snag economy: early in Phenac City you confront three Cipher Peons holding **Bayleef, Quilava, and Croconaw**, and whichever you snag first becomes your de facto starter; the other two resurface later at the Snagem Hideout and the Shadow Pokémon Lab (the one strong against your pick waits at the Lab).
- **XD:** a classic single **Eevee (Lv 10)**, a gift from Michael's late father — but no clock exists in XD, so the Espeon/Umbreon friendship evolutions needed a workaround: early on, at Gateon Port's parts shop, an Eevee expert offers you **exactly one of five evolution items** — Fire Stone, Water Stone, Thunder Stone, or the XD-exclusive **Sun Shard** (→ Espeon) and **Moon Shard** (→ Umbreon). Stones go to the normal bag and work any time; a Shard is a *key item* that fires automatically the next time a high-friendship Eevee levels up, and is consumed doing it. The choice is the game's one starter decision, and it's about *which evolution*, made once, early, and permanently.

**Trading and GBA link — the transfer system.**
- Both games connect to the Generation III GBA games (Ruby, Sapphire, Emerald, FireRed, LeafGreen) by GCN–GBA cable, and **story-mode trading is an endgame privilege**: in Colo it unlocks at the Phenac City Pokémon Center basement **after defeating Evice**; XD likewise gates trading until its story is beaten. The standing rule underneath: **only purified Pokémon may be traded** — a Shadow Pokémon can never leave Orre's systems, which is why purification doubles as the export licence. (FireRed/LeafGreen additionally require their own post-game objectives before they'll accept Orre trades.)
- Colo's **Battle Mode** leans on the link the other way: GBA cartridge teams are uploaded for colosseum ladders, versus battles, and the Mt. Battle VS 100 (§8.2, §8.6).

**The P★DA (both games).** The player's handheld is the tracking layer: e-mail drives story beats, and XD's P★DA adds two dedicated monitors — the **Spot Monitor** (§7) and a **Shadow Monitor** logging every Shadow Pokémon encountered, snagged, and purified: the snag list as a completion ledger (48 / 83).

**e-Reader extras (Japanese Colo).** The Japanese release hides an **e-Reader room beside the Phenac Stadium lobby**: scanning Pokémon Colosseum Double Battle e cards unlocks additional challenge battles, including three extra Shadow Pokémon — **Togepi, Mareep, and Scizor** — with Scizor obtainable *only* this way (its line otherwise appears as Flaaffy/Togetic in Colo and Scyther in XD). The room and cards never shipped in the North American or PAL builds; the content exists in those builds' data only as far as the list documents it.

**Bonus discs.** Colo shipped with regional bonus-disc distributions that feed the GBA games: the North American disc delivers a **Jirachi** to a GBA save; the Japanese disc delivers a **Celebi** to any Colosseum save that has purified all 48 Shadow Pokémon — and from there up to 48 further Celebi can be passed to GBA saves (saved in a Pokémon Center, Elite Four beaten). Distribution as a reward for total purification: the completion state itself is the key.

**Documented quirks worth knowing as systems trivia.** (1) The **Master Ball glitch** (Colo): with a second Pokémon re-arranging the bag mid-throw, a thrown ball isn't consumed — an infinite-Master-Ball exploit the community routes around snag difficulty with. (2) **Shiny generation uses the *opponent's* Trainer ID** for Shadow Pokémon, so a Shadow Pokémon can visibly change shiny status between the battle and your summary screen after capture; XD patches the seam by shiny-locking Shadow Pokémon outright (Poké Spot and gift Pokémon can still be shiny). (3) Colo's Ho-Oh (§8.2) and the Japanese Celebi make **100% purification the unlock condition for the games' biggest gifts** — the whole loop is the lock and the key.

---

## BIGGEST FITS FOR MOCHIICHAO

*(My read, labelled as my read. Numbers are Mochiichao's existing system slots; everything below is a mapping suggestion for the List 30 build, not new canon.)*

1. **Snag → Stealing (#268) — but the identification gate is the real inheritance.** The games' deepest design choice isn't that you *can* take an owned Pokémon; it's that the tool **refuses to fire without a detection step first** — Rui's eyes in Colo, the Aura Reader failsafe in XD. Mochiichao's stealing system can borrow that shape wholesale: a steal attempt is only ever legal against a target the system has *marked* (stolen goods, a corrupted heart, a Syndicate asset), and unmarked targets are refused by the tool itself, not just punished afterwards. That one rule is what lets the same mechanic be heroism in one Ranger's hands and villainy in the thief anti-hero's — his version has the failsafe stripped. The one-attempt-per-turn recharge is also a clean pacing rule for steal attempts in battle.

2. **Purification → the recovery engine for stolen Mochi (#273) and redemption (#275) — the single biggest fit in this catalogue.** XD/Colo prove that "winning it back" is only the first third of the story; the long tail is a *care process with multiple channels*, and the channels are **temperament-weighted**: what reaches one individual (battle alongside it) barely touches another (who needs quiet time in care, or the scent/massage equivalent — attention in its own love language). That ports directly onto Mochiichao's bond/temperament data: a recovered stolen Mochi shouldn't flip back to normal on re-catch — it should carry a closed-heart gauge whose stages visibly hand back its moves, its nature, its trust, in a fixed order. And the **Purify Chamber** is the multiplayer-shaped version: recovery speed depends on *the company arranged around the recovering individual* — a Set of companions whose natures/types harmonise (clockwise super-effective chain) literally accelerates healing. For a Garden-centred game, "who you house a recovering Mochi with" becoming a real care decision is a gift of a mechanic. The owner's List 28 design already makes returning stolen Mochi the biggest redemption step (#275); purification gives that return a *process* instead of an event.

3. **The Heart Gauge → closed hearts (#287).** Five visible stages, each with a fiction name and a concrete give-back, and an escrow rule (growth earned while closed is banked, not lost, and lands all at once at recovery). The escrow is the humane detail worth stealing outright: time spent corrupted isn't deleted from the individual's life, it's *deferred*. The five-stage shape also mirrors neatly onto the 50-step morale ladder's banding habit (#271) — Mochiichao already likes staged, nameable states.

4. **Hyper Mode → frenzy (#289).** A berserk state that is *tempting* (near-guaranteed crits) and *costly* (a full disobedience table — including attacking its own Ranger, which the show can stage and the game can log), entered through the corrupted move class itself, cured by a **voice**: the Call. Call replacing Run is a beautiful swap for Mochiichao's battle doctrine — in a world where Rangers command and Mochi have agency, "spend your turn reaching them instead of acting" is a command with moral weight, and it doubles as the biggest heart-opener in the source games. Reverse Mode's version (no crit candy, just self-harm at 1/16 per turn) is the darker gen-two iteration if the design wants frenzy to be pure cost.

5. **Shadow moves → the shadow move class (#290).** A typeless move class that is super effective against everything *except its own kind* inverts the type chart instead of joining it — corrupted Mochi hit clean Mochi hardest, and corrupted-vs-corrupted fights are grinding wars of resistance. Shadow Sky (weather that wounds only the clean) and Shadow Half (halve *everyone*) are set-piece moves a show can build episodes around and a game can gate behind its worst villains. The rule that the class **evaporates at recovery** (replaced by the individual's real moves, plus a bonus move learned *because* it recovered) keeps corruption from ever being a build choice — it's a condition, not a spec.

6. **Poké Spots → lure spots (#291), and the Miror B. loop → missed-chance recovery.** Baited fixed points with a consumable timer and a *remote alert you must physically answer* make encounters an appointment system rather than a random roll — a perfect fit for an open-world game (#297) that wants the world to call the player somewhere. The deeper steal is the **Miror Radar loop**: a failed recovery isn't a fail state, it's a *debt that walks around in the world* — your missed Shadow Pokémon literally end up in a specific flamboyant NPC's party, your device tells you where he's surfaced, and going to get your second chance is an event (he might even have replaced a Trainer in a tournament you entered). That maps straight onto List 28's stolen-Mochi recovery (#273) and the wanted/witness layer (#272): what got away from you should resurface, carried by someone, somewhere your devices can point to. The Radar breaking when the last one is recovered is the kind of systemic punctuation Mochiichao should copy shamelessly.

7. **Mt. Battle and the tower circuits → the long climb (#292).** The 100-battle climb with a facility currency, heal-between-fights, restart-the-zone stakes, and an ultimate prize locked behind *full completion of the recovery loop* (Ho-Oh demands all 48 purified, not merely snagged) shows how to bind a battle structure to the game's moral engine: the ladder's best reward is gated on having *healed everything you took*. XD's version — the Johto starter prize for an unbroken, no-PC-swaps run — adds the "one sitting, one team" purity condition as a prestige variant.

8. **XD001 → the special-case rule for flagship corruption.** Every system in the catalogue bends for exactly one individual: no frenzy, no gradual opening, progress that resets if interrupted, and a single unlock condition that is *the community system at absolute maximum* (all nine chamber Sets at max tempo). That's a ready-made template for Mochiichao's story-flagship cases — the thief anti-hero's most damaged partner (List 29, #284), or a legendary-tier closed heart (#287): the rule "some hearts can't be opened by any one person's effort — only by the whole support system running perfectly at once" is a thesis statement disguised as a mechanic, and it gives the Garden/care facilities a final exam. Cipher's two-org split (Snagem = theft capability, Cipher = manufacturing and distribution, corruption handed out as tournament prizes) is likewise the ready-made skeleton for the Syndicate's operations in both lanes: villains as an *economy with a supply chain*, not a boss list.
