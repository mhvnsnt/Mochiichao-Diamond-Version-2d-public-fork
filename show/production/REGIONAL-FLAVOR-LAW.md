# REGIONAL FLAVOR LAW — how each region's creatures are designed

**Status: FUTURE CONSIDERED IDEAS — a design-law draft for owner review (2026-10-27).**
This document writes down the owner's directed flavour progression so future species work
stays consistent. It changes nothing in canon: the canon roster is **47 species** and does
not change. The two owner-directed transplants named below (Pantera, the Volcano Oni) are
**owner decisions**, not brainstorm — they are recorded here as anchors and documented in
full by the sibling TRANSPLANT ROSTER job; this file cross-references them and does not
duplicate their documentation.

**Companion files:** `NEW-SPECIES-IDEAS.md` (the brainstormed concepts built under this law) ·
`LANDING-STEPS.md` (how this package reaches the repo).

---

## 0. The shape of the law

The owner's direction, in his own framing: the creatures start as *our Pokémon*, and each
region lets another monster tradition's flavour seep in — Digimon in Region 2, Monster
Rancher in Region 3, everything at once plus a mecha/toy-battle register in Region 4 —
until Region 5, where the flavour stops being borrowed at all: it is the owner's own
universe, plus MALAKOR (owner-decided 2026-10-27, see §5). Nothing in this law may be
extrapolated beyond the owner's own words for any region.

| Region | Flavour | Drift strength |
|---|---|---|
| R1 (Iridescence) | Pokémon-like — the established canon base | none — this is the reference |
| R2 (Twin/Return) | Pokémon core, a little more **Digimon**-like — evolutions included | light drift (~a quarter turn) |
| R3 (Sea/Land) | A bit more **Monster Rancher**-like — raising, mixture, ranch life | light drift (~a quarter turn) |
| R4 (Rift) | **Full mix** of all three traditions **+ mecha/toy-battle register** (Bionicle, Transformers, Beyblade, Bakugan, Gundam, Evangelion) **+ original expansion** (unused animals, insects, yokai/oni, spirits/demons, cryptids, world folklore) | full mix |
| R5 (New Continent) | **The owner's own universe** (Off the Top Rope · BANNON · Western Heart · Brutal Fist · Wizard Gang · God Molecule · the TRIPPED studios) **+ heavy MALAKOR inspiration** | owner-set — no external donor leads |

---

## 1. Region 1 — the base design language (evidence: the canon 47)

Everything later is measured against how the canon roster actually behaves. From
`species.json` / `species.ts` / the rig and learnset data, the R1 language is:

- **Silhouette.** Compact, round, readable at sprite size. One animal **+ one idea**
  (an element, an object, a job) fused into a single readable shape. Big heads, soft
  volumes, no clutter. (Mochii: a small water creature that *bounces* to move; Sproutle:
  sprout + tortoise; Wispkin: a masked wisp whose body dissolves into smoke.)
- **Evolution = growth, not transformation.** Three-stage lines dominate. Each stage is
  the *same body plan, more so*: Kittember → Pyropaw → Manticlaw stays a feline that
  gains fire, mane, claw; Razorgater → Chromejaww → Reaperdile stays a gator that gains
  chrome jaw, then reaper menace; Sproutle's line gains the Chrome (steel) half at the
  Shellguard/Dreadtoise stage — a second element may arrive at the final stage, the
  animal never changes.
- **Elements (show names).** Aqua · Flame · Flora · Chrome · Umbral · Beast — the
  working element vocabulary of canon (battle types in data: WATER/FIRE/GRASS/STEEL/
  GHOST/DARK/+).
- **Naming.** Short portmanteaus whose parts you can hear: *Kitten+ember, Sprout+turtle,
  Wisp+kin, Razor+gator, Zeph(yr)+ling, Tiide+biite, Aqua+riiOS.* One joke or one
  meaning per name, never two. Species names are original coinages — inspirations are
  recorded, source names are never carried (construction-kit filter).
- **Temperament.** Pet-scaled and garden-compatible: these creatures live in a Chao
  Garden world, have cries (never speech), individual signature attacks, and
  personalities that read in a 1.4–2.6 s rig animation.
- **Mythic register exists but is fenced.** Mythar and the Mythic Form sit *outside* the
  ordinary roster's design grammar — the base game is cute-first.

**R1 is not "generic Pokémon."** It is this specific grammar. R2–R4 drift is measured
from *it*, not from Pokémon in the abstract.

---

## 2. Region 2 — the Digimon drift (Pokémon core, a little more Digimon)

### What Digimon concretely does differently (the donor mechanics)

- **Evolution is transformation, not growth.** A Digimon line routinely breaks its body
  plan: a round blob can become a dinosaur, then a humanoid knight. Stages are a
  *maturity ladder* (fresh → in-training → rookie → champion → ultimate → mega), and
  the top of the ladder is regularly **humanoid, armoured, or weapon-bearing**.
- **Weapons and armour are anatomy.** Swords, cannons, shields, and missile pods grow
  out of the body as organs. A champion-stage beast wears its arsenal.
- **Evolution is bond-driven and often temporary.** A partner's Digimon evolves *in
  answer to the partner's need*, fights, and reverts. Evolution is an event in a
  relationship, not just a level milestone — and lines **branch** (care and temperament
  steer which final form arrives, including dark/failed evolutions).
- **The mechanical and the gothic sit inside the bestiary** — machine Digimon,
  undead Digimon, fallen-angel Digimon — at a higher rate than Pokémon ever allows.

### The R2 application (a quarter turn — the core stays Pokémon)

1. **One body-plan break per line, at the final stage.** Base and middle stages stay
   R1-grammar animals. The final stage may stand up, arm itself, or take a humanoid or
   armoured read — *once*, as the line's payoff. (See NEW-SPECIES-IDEAS bucket A:
   a sprout that ends as a lance-bearing knight; a pike-fish that ends as a halberd
   drake; an imp ladder that ends as a horned battler.)
2. **Grown gear.** Blades, shields, lances, crank-horns: equipment that is visibly
   *grown*, never held merchandise. If it could be taken off and sold, it fails the rule.
3. **Silhouette licence widens at the top only.** Final stages may be asymmetric,
   taller, more vertical. First stages keep R1 roundness — a Ranger still meets a pet
   before they meet a weapon.
4. **One bond-flavoured mechanic per line at most.** A line whose final evolution reads
   as answering its Ranger (a pair that evolves *together*; a guard-form that arrives
   when its person is threatened). Branch evolution is allowed as a *seed* (two finals
   by temperament) — data design stays owner-side.
5. **Hard guardrails (what the drift may NOT import):** no "-mon" name suffixes (naming
   stays Mochiichao portmanteau); no speech (cries only — Digimon talk, Mochi don't);
   no maturity-ladder renaming of stages; evolution stays permanent in the game lane.

### Anchor — PANTERA (owner-directed, not brainstorm)

**Pantera**, from the owner's own repos, becomes a Mochichao — owner-suggested home:
**Region 2**. It sits naturally under this section's law: a feline battle-form whose
presence is exactly the R2 quarter-turn (animal core, harder battle read). Full source
documentation lives in the sibling **TRANSPLANT ROSTER** job — cross-reference there;
not duplicated here.

---

## 3. Region 3 — the Monster Rancher drift

### What Monster Rancher concretely does differently (the donor mechanics)

- **Monsters are mixtures.** A Rancher monster is a main breed wearing a sub-breed's
  parts, colours, and traits — one body plan visibly crossed with another. Mixture is
  the default state of the bestiary, not a special event.
- **Raising is the fiction.** Monsters are working ranch animals with **jobs,
  temperaments, fatigue, loyalty, and lifespans**. A monster's personality (glutton,
  stubborn, proud, spoiled) is a gameplay stat and a design brief at once.
- **Proportions are goofier.** Rancher tolerates — celebrates — one absurd feature per
  body: a single giant eyeball, a stack of rocks for a torso, a worm in an apple.
  Cuteness and weirdness outrank coolness.
- **Food and object hybrids are ordinary citizens** (a mochi creature is that
  franchise's mascot class). *Note for our naming hygiene: Rancher's mascot is named
  "Mocchi" — a different production's character. Our Mochii (001) is canon and prior;
  the R3 drift borrows Rancher's combination/raising flavour, never its cast.*

### The R3 application (a quarter turn)

1. **Mixture bodies.** R3 concepts are designed as visible crosses: *A's body wearing
   B's parts* — including **crossing pairs**: two species whose designed "cross" is a
   third concept (see bucket B's Stormewe). Combination is flavour and silhouette,
   not a breeding-system spec (systems stay owner-side).
2. **Ranch-first design briefs.** Every R3 concept carries a **job** (plough, lookout,
   mill-wheel, ferry, haystack) and a **temperament** (one word, load-bearing). If a
   concept has no job, it isn't R3 yet.
3. **Proportion licence.** One huge feature per body is not just allowed, it's the
   house style here — a species may be mostly ear, mostly belly, mostly stack.
4. **Stage count loosens.** Single-stage and two-stage species are common in R3
   (Rancher monsters don't climb Pokémon ladders). Evolution, where present, can be a
   *promotion* inside a social structure (worker → queen) rather than a shine.
5. **Guardrails:** mixture never becomes gore or body-horror; temperament never becomes
   speech; the Garden stays a kind place — R3 creatures are co-workers, not livestock
   product.

### Anchor — THE VOLCANO ONI OF THE FESTIVAL (owner-directed, not brainstorm)

The owner has defined Region 3's **Mochichao Festival**: it is the festival **of a
volcano Mochichao — Susano-style** — and the **fire Susano spirit from the owner's
Western Heart repo becomes that volcano Mochichao, a spiritual Oni-type species**.
This species is the R3 festival anchor: the region's celebration, its Sea/Land
factions' shared table, and its fire all orbit this one creature. R3's other concepts
(bucket B) are written to live in a region whose year turns around a volcano oni's
festival. Full source documentation (the Western Heart character, his lore, his
existing design) lives in the sibling **TRANSPLANT ROSTER** job — cross-reference
there; not duplicated here.

---

## 4. Region 4 — the full mix + the toy-battle register + the expansion harvest

Region 4 (the Rift region — the institute, the cracks, the world coming apart) is where
every tradition the owner named is allowed on stage at once, **plus** the register he
added: the toy-battle fictions. The Rift is the in-fiction excuse — a region where the
world's seams show is where creature design itself may show its seams.

### 4.1 The three base traditions, simultaneously

Any R4 concept may combine: Pokémon growth-lines (R1 grammar) · Digimon transformation
and grown gear (R2 markers) · Rancher mixture bodies, jobs, and temperaments (R3
markers). A single R4 line may legitimately be a Rancher-mixture baby that
Digivolves-style transforms into an armoured final. Restraint rule: **one tradition
leads, the others flavour** — a concept that is equally everything reads as nothing.

### 4.2 The toy-battle register (owner expansion, 2026-10-27)

Each donor fiction contributes **one concrete mechanic** — translated into creature
biology, never imported as branding, names, or actual technology:

| Donor | The mechanic taken | The Mochiichao translation |
|---|---|---|
| **Bakugan** | Creatures that travel as balls and **pop open** into battle form on the field | Species whose resting form is a perfect ball (sleep, travel, defence) and whose battle form *springs* out of it. The pop is an anatomy event, like a flower opening. |
| **Beyblade** | A small **spirit-core housed in a spinning toy body**; battles are spin duels | Species with a dense spinning body (top, shell, wheel) whose inner creature-face/core shows only at full spin; duels of endurance and balance, not blows. |
| **Transformers** | **Alt-modes**: one being, two complete forms, transformation as identity | Species with a beast mode and a *carrier/gear mode* (a walking frame others ride; a shelter form). Both modes are the creature; neither is a vehicle anyone built. |
| **Bionicle** | **Masks as power and role**; bio-mechanical tribes — living tissue under grown armour | Mask-bearing species: carved shell-masks grown and shed across a life, each mask a tribal role. Armour is chitin and bone the body makes. (Masks are original designs — no kanohi shapes or names carried.) |
| **Gundam** | The **piloted frame**: small pilot + large mobile frame; remote child units (funnels/bits) | **Partner pairs as one species-entry**: a palm-sized rider species bonded to a giant frame species; the frame's small detachable mite/swarm children act as remote helpers. The "cockpit" is a nest-hollow; the bond is symbiosis, not machinery. |
| **Evangelion** | The "machine" is a **living organism in restraints**; a sync-link with its partner whose strain has stakes | Bio-mecha species born inside grown restraint-armour; the armour is a *calming* shell, and the species' drama is emotional (it panics without its keeper's voice) — played as trust, never as horror or gore. |

Plus the register's shared moves, available to any R4 concept:

- **Combining (gestalt) species:** two or three small species that merge into one large
  form for a scene and separate afterwards — separation is part of the design (they
  argue, they misalign, they prefer different weather).
- **Panel-and-rivet bodies that are grown, not built:** interlocking scale-plates,
  chitin vents, a visible furnace-heart — the *read* of a machine with the *facts* of
  an animal.

**Secret-law care (binding):** R4's machine-like creatures are **creatures**. Nobody
inside the world built them, pilots them as technology, or explains them as machines —
in-world they are strange beasts of the Rift, full stop. The technology reading of the
world belongs only to the Secret's licensed holders (Aeon, the villains' double-layer),
exactly as everywhere else in canon. "Piloted" in this register always means a
creature-bond (a rider species and a frame species who choose each other), never an
operator and a vehicle.

**Cross-reference:** holdings and machinery detail for this register (Bakugan files
first) are being mapped by the sibling **REGION-BUILDING SOURCE MAP** job. When it
lands, its R4 machinery notes attach to this section; the species concepts in
`NEW-SPECIES-IDEAS.md` bucket C1 were written independently and stand either way.

### 4.3 The expansion harvest (the owner's original R4 direction)

Alongside the mix, R4 is where the bestiary deliberately widens beyond the usual
monster-game animal set — all original species, inspirations recorded, nothing carried:

- **Animals Pokémon has not used yet** — verified one by one against the full official
  roster before claiming "unused" (verification log in NEW-SPECIES-IDEAS §5; the known
  traps — dolphin, koala, flamingo, red panda, honey badger — were checked and
  excluded or flagged).
- **Insects and small crawlers** beyond the standard butterfly/beetle/mantis set.
- **Mythical creatures; yokai and oni; spirits and demons** — with Pokémon's own
  yokai coverage (kitsune, kappa, baku, yuki-onna…) treated as occupied territory:
  the harvest goes to the yokai Pokémon *hasn't* taken.
- **Cryptids** — tsuchinoko-class and beyond (the famous ones Pokémon already claimed,
  like the tsuchinoko itself, are flagged and re-seeded, never repeated).
- **World folklore broadly** — not only Japanese: Irish, Chinese, Filipino,
  West African, Slavic, Australian, and American traditions all contribute.

### 4.4 R4 naming flavour

All three naming registers at once: R1 portmanteaus · harder R2 compounds (gear, sigil,
frame words) · R3 two-creature mixture names — plus folklore names that keep the
*shape* of the source word without taking a source character's name.

---

## 5. Region 5 — the owner's own universe + MALAKOR (owner-decided 2026-10-27)

Region 5's flavour is no longer open. The owner has set it, and it breaks the pattern
of §§2–4 on purpose: after three regions of borrowed traditions, **R5's core is the
owner's own universe** — the design grammar of his other shows treated as this
region's native tradition:

- **Off the Top Rope** — the wrestling register: entrances, showboating, launch-off-
  anything combat, personality before stats.
- **Western Heart** — the western register: dust, distance, spirits of the road
  (the same show that donates R3's Volcano Oni — there it gives fire; here it gives
  the road).
- **Brutal Fist** — the brawler register: formal challenge, honour-duel framing,
  fists as character.
- **Wizard Gang** — the magic-gang register: crews, turf, familiars with jobs in the
  organisation. **In-world, Region 5 is heavily controlled by Wizard Gang** (owner,
  2026-10-27) — R5 species design must assume a region whose wild places have turf
  rules: creatures run in crews, hold corners, and pay (or collect) tribute. *Seam
  note:* the mined game spine names **The Front** as R5's antagonist face; how the
  Front and Wizard Gang's control fit is the owner's to stitch — this law records
  both and invents no relationship between them.
- **God Molecule** — the governed-cosmic register: solemn, systemised, anthology-
  disciplined (its bible is the most governed document in the owner's whole sample);
  R5's cosmic species carry that register's orderliness — systems that speak, rules
  that orbit.
- **BANNON** — one of the universe's banners, recorded here as part of the R5 core
  on the owner's word. No local document available to this pass describes a distinct
  creature grammar for it, so none is claimed (see the gap note below).
- **The TRIPPED studios** — the production banner over the universe; R5 is where the
  show-within-the-show's cast and the game's bestiary are allowed to touch.

**Plus: heavy MALAKOR inspiration** (owner-spelled M-A-L-A-K-O-R, "from TikTok").
**Gap, stated plainly:** this pass could not retrieve or verify MALAKOR's creature
grammar — searches returned only unrelated namesakes and one small TikTok account
that could not be verified as the reference. MALAKOR is therefore recorded as a
*named, heavy* inspiration with an empty chair (see NEW-SPECIES-IDEAS D6), under the
same OPEN-gap discipline the owner's own God Molecule bible uses: the inspiration is
law, its content is not invented. When the owner points at the specific series or
account, the chair gets its design pass.

**Depth discipline:** R5 design stays **light**. Seasons 1 (and possibly 2) live in
Region 1; R5's species work in this package is six register sketches
(NEW-SPECIES-IDEAS Bucket D), not worked concepts. The full R5 pass belongs to the
season that actually goes there — and by then the transplants, the MALAKOR chair,
and the Wizard Gang seam will all be owner-settled material to build on.

---

## 6. The law in one table (for whoever designs next)

| | R1 | R2 | R3 | R4 | R5 |
|---|---|---|---|---|---|
| Body plan across evolution | never breaks | breaks **once**, at final stage | often single/two-stage; promotions | any, incl. transforms & alt-modes | his shows' grammar — set by character, not by ladder |
| Gear | none | **grown** weapons/armour at final stage | tools are jobs, not weapons | grown gear + ball forms, spin bodies, frames, masks | show props as anatomy (ropes, wands, boots, belts) |
| Mixture bodies | no | no | **yes — the default** | yes | crossover casting — his universe's faces in creature form |
| Humanoid finals | no | allowed at final stage | rare | allowed | common — his casts are personalities first |
| Temperament/job in the brief | light | light | **mandatory** | common | **mandatory** — a role in the turf (Wizard Gang control) |
| Naming | portmanteau | portmanteau + hard second element | two-creature mixture names | all registers + folklore shapes | house style across his universe + the MALAKOR chair (gap) |
| Anchor | the canon 47 | **Pantera** (owner-directed) | **Volcano Oni of the Festival** (owner-directed) | the Rift itself | **Wizard Gang** (in-world control, owner-directed) |
