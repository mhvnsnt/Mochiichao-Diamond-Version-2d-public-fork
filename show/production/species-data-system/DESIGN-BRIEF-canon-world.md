# DESIGN BRIEF — Canon & World (for the design lane)

**Audience and job:** the design lane already exists and already
works data-before-design, from complete species sheets. This brief
is its **canon/world companion** — the layer the sheets draw on —
for two jobs: **(A) designing NEW species** (the main effort) and
**(B) Gen 1 gap-fill** (§6). It is NOT a sheet format and NOT a
design gate: the lane's complete species-sheet format and the
design-gate standards in `research-drafts/DESIGN-THEORY-DRAFT.md`
(G-1..G-12, the MASTER gate) and `DESIGN-PRINCIPLES-DRAFT.md`
(Part 3, the per-asset quick form) govern those, and are
referenced here, never re-derived.

**Inputs per design:** (1) the completed per-species DATA record /
species sheet (lane standard), (2) THIS brief — canon, world, and
everything settled in conversation with Jamar (owner) on
2026-10-27, (3) the species' repo likeness references (§4.1).
Where sources conflict, the **newest dated owner ruling governs**
and the conflict is logged (§9). If a design question is answered
by none of these, it is an OWNER DECISION (§8) — never silently
filled. House rule: *rules first, canon-sourced, TBDs never
silently filled* (source: MEMORY.md, house writing system).

**Companion registries:** cast.json / parts-catalog.json /
clip-index.json (game⇄show shared manifests, §2.5). Currency law:
always design from the version marked CURRENT in the registry
(source: MEMORY.md, Current-Version Law).

---

## 1. CANON NAMING LAWS (settled, whole-canon scope)

Source: MEMORY.md "CANON NAMING LAWS"; repo-add/show/production/
SEASON-CANON-MAP.md.

| Law | Rule |
|---|---|
| **THE DARK FOREST** | The home forest's only name. Renamed from "Binary Woods" — ONE place, not two. Never write Binary Woods in any display text, doc, or design note. |
| **ILLUMINATE** | The Flash-equivalent technique. Never "Light-Pulse." |
| **MOCHIIOTECA** | The Pokedex-equivalent keeper device. Never "Codex," never "Mochiidex." (The name was already in canon, in MochiiMindService, and was restored.) |
| **Internal ids unchanged** | Display names change; internal file/id keys NEVER do (e.g. map id `binary_woods`, story flags `codex_get`). Wiring must not break. Design files/labels use display names; code keys stay. |
| **Two-lane consistency** | Every canon change applies in BOTH game data AND show data — names, settings, doctrines, all of it. |
| **Move rename-on-use** | Every Pokemon-named move gets a Mochiichao display name when used/attached (ids stable). Signature table: §4.5. Stats are NEVER invented — owner-TBD stays TBD. |

**The Dark Forest — what the place IS** (design to this):
one forest; mist and a humming surface ("The woods hum. Listen,
and you will hear where the wild ones are"); dread in its depths —
in full daylight the forest floor is in night anyway; no birdsong
from inside; dread by stillness, never by gore. Contents that
carry under the name: wild Kittember, doors to the Aero Dojo and
the Cave of Echoes, NPCs. Cave of Echoes line: *"The cave is dark,
but it is not empty. Bring Illuminate, and bring patience."*
(Sources: MEMORY.md canon naming laws; SEASON-CANON-MAP.md;
SHOW-BIBLE §3.)

---

## 2. THE WORLD

### 2.1 Shape and tone
- A garden of creatures in a **hyper-future Japan** that runs on
  care (SHOW-BIBLE §1). Warm, cute, hyper-pop on the surface;
  genuine dread held in one direction (the Forest) and played
  straight. The show's thesis — Rule 12, Jamar's exact wording:
  *"Everything in the garden belongs to somebody... And everybody
  belongs to the Garden."* Warm over the Garden; a warning over
  the Dark Forest (SHOW-BIBLE §5).
- Season spine resolves FROM GAME CANON, the way Pokémon's show
  was built from its games (SEASON-CANON-MAP.md).

### 2.2 Places (design-relevant; display names only)
- **THE GARDEN** — home base: Gate, pond, the Green, keeper
  board, berry store. Runs on the Manual and its Rules. Warm
  brand-blue world.
- **THE GATE** — the threshold; everything crosses here:
  arrivals, introductions, names on the board. The Garden Gate
  plate/environment card is the accepted theme anchor for the
  show's look (MEMORY.md).
- **THE DARK FOREST** — §1. Past where the path gives up.
- **Game world (Region 1 = Mainframe, season 1):** arrival by
  truck at Sector 0 / Boot Harbor → Route 1.0 → Silicon Town,
  the fields, 8 dojos (badge = FRAGMENTS; masters incl. Lin,
  Falk, Tetsu, Kenji, Phantom, Shizuku, Homura), Victory Route,
  Elite Four (Umi/Gin/Hono/Yoru), Champion on the plateau,
  post-game Seven Isles. "Mainframe" is the settled
  production-layer region name (SEASON-CANON-MAP.md); what
  in-world labels may show is governed by the display sweep
  (§2.6, conflict C1). Regions 2–5 exist in canon for later
  seasons; several champion slots are NAME GAPS in canon
  itself — never filled silently. (SEASON-CANON-MAP.md.)
- Wider-world detail grows per season grid, Pokémon-style
  (SHOW-BIBLE §3).

### 2.3 How Mochi live here
- **Garden + wild, both.** Kept Mochi live in the Garden under
  the care loop (feeding rounds, check-ins, the Manual); wild
  Mochi live out in the world (e.g. wild Kittember in the Dark
  Forest). A Mochi can be encountered, chosen, and bonded —
  EP02's game-canon opening is a rescue-choosing: Aeon, cornered
  by a wild creature, offers one from the bag. **Five starters**
  (game canon): Mochii, Razorgater, Tyrage, Kittember, Sproutle.
- **Battles:** in the show, Mochi fight with their own agency —
  continuous living fights; Rangers (see §2.4) sometimes command,
  but the fight runs between commands. Design action/posing for
  autonomy, not for waiting-on-orders (MEMORY.md, Battle
  Doctrine).
- **Growth is mutual** (Digimon layer): partners have inner
  lives and histories; the keeper grows as the creatures do
  (SHOW-BIBLE §2).

### 2.4 The human side
- **MOCHIKO** — human lead; **Assistant Mochiko of Aeon's lab**
  (game canon, per the newest ruling in SEASON-CANON-MAP.md,
  which resolves open items FROM GAME CANON by owner rule). She
  is the one who opens the Mochi Garden (R1-BEAT3: *"The Mochi
  Garden is open now..."*) — EP01's keeper framing is that
  beat, anticipated. In the show she is the Garden's keeper,
  the audience anchor, and the one who reads the Manual aloud.
  The SHOW-BIBLE's earlier "Human, 12, new keeper" formulation
  is superseded on role by the game-canon ruling; her AGE is
  not confirmed by game canon (conflict C2; §8 item 5).
- **HEX** — next-door neighbour and rival; endgame: Champion.
- **AEON** — lab figure; hands over the partner + the
  Mochiioteca in the opening; carries a hidden truth (§2.6).
- **Terminology law:** battle commanders are **RANGERS** (term
  locked by owner). "Keeper" is Garden-scoped (Mochiko's role).
  "Trainer" was never canon — it is only a data-layer seed label
  in trainers.json; never design or label with it.
- **Humans SPEAK WORDS.** The pure-cries law (§4.2) scopes to
  creatures ONLY. Human mouth/lip-sync design is in scope
  (SHOW-BIBLE §4–5; MEMORY.md, Human Talking Seat).
- Full human cast: repo `docs/human-characters/`.

### 2.5 The show lives inside the game repo
- Owner decision: the show lives INSIDE
  `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`, so
  show⇄game pull from each other directly. Design output ships
  into that repo's bundles, never a separate show repo.
- **Two-way shared manifests** (`show/shared/`, per SHOW-HOME.md):
  - `cast.json` — every character/species, pointers to game
    assets + show assets.
  - `parts-catalog.json` — every background/prop/object usable
    by both sides: path, type, scene-use, donor, filter pass.
  - `clip-index.json` — every finished clip/shot and where it
    is used.
- Game→show: reference game assets in place via manifests (no
  copies). Show→game: a show-made asset is *promoted* — its
  game-ready version lands in the game's normal homes
  (`sprite-art/`, `public/assets/`) and the manifest records
  both paths. Donor archives themselves stay OUT of the repo;
  only catalogs and selected parts at use size come in
  (SHOW-HOME.md).

### 2.6 THE SECRET (production-layer law — handle with care)
- Production-layer truth, held in the Bible as law: **the world
  is a computer that grew a wilderness.** No inhabitant knows.
  Aeon knows secretly; Luigi has a hint.
- **In-world artifacts must never betray it:** display names,
  dialogue, signs, scripts, and DESIGNS carry no overt computer
  tells. A display-name sweep scrubbing Binary/Data/Mainframe-
  class words is in force (Silicon Town keeps its name; Mochi
  Fruit, Mochi Cocoon, Champions Dojo, Iridescence Plateau are
  the swept forms). When a design or label needs a place/tech
  name, use the swept form; if none exists, it's an owner
  decision, not a coinage. (MEMORY.md, Two-Lane Consistency
  Law / THE SECRET.)

---

## 3. STYLE STACK FOR DESIGNS (Jamar's, settled)

Source: MEMORY.md Preferences (style stack); SHOW-BIBLE §2, §7.

1. **Pokémon-style base** — keeper-and-creatures bond, creature
   showcase, care loop, journey out from a home base. Readable,
   friendly creature design first.
2. **Digimon** — partners with inner lives/histories; growth is
   mutual.
3. **JoJo's Bizarre Adventure** — art-forward presentation:
   dramatic posing, held tension, menace played straight,
   sound-effect typography as graphics.
4. **Persona 5** — hyper-futuristic Japan graphic pop: ONE
   dominant colour per sequence, stylish title cards, UI as
   performance.
5. **Japanese lore & culture** — the Garden's bones (a wisp who
   keeps the night; a forest that behaves like the old stories
   say forests behave). Researched, specific, respectful.
6. **Tamagotchi / digicore hyper-pop** — the keeper tech:
   little devices, check-ins, feeding rounds, pixel-cute
   interfaces. *Cute is a design system.*

**Backgrounds/environments/camera/FX sources:** Pokémon, JoJo,
Gumball, Chowder, Dragon Ball Z (MEMORY.md).

**Visual identity locks** (SHOW-BIBLE §7; bible/IDENTITY-KIT.md):
official logo never redrawn; palette SAMPLED from the real art
(brand blues; Dorowani `#30b0d0` / `#d0f0f0`; accent red
`#a03436` for fins/eyes/alerts ONLY); Bungee display + Fredoka
text (already in repo); title-card layout fixed.

**Design-research scope note:** design research for this show is
FULL-SCOPE — character design, creature design, world-building,
and the theory and design principles behind all of them. Not
colour-only. (MEMORY.md.)

**Governing design standards (referenced, not re-derived):**
the design lane's standards live in `research-drafts/` —
**DESIGN-THEORY-DRAFT.md** is the theory spine: its **G-1..G-12
Design Gate is the MASTER gate**, and its Part 5 carries the
character/creature design standard, the world design standard,
and the expanded per-asset gate. **DESIGN-PRINCIPLES-DRAFT.md
Part 3** is the per-asset quick form of the same checks (where
wording differs, the G-series governs). Sibling extractions:
COLOR-SYSTEM-DRAFT.md, LIGHTING-SYSTEM-DRAFT.md,
ENVIRONMENT-AND-CAMERA-DRAFT.md, JOJO-POSING-STANDS-DRAFT.md.
Those documents are DRAFT for owner review — they are the lane's
governing standards as they stand, and this brief does not
restate, re-derive, or override them. Division of labour: the
drafts say HOW a design must be built and checked; this brief
says WHAT canon and world it must be true to. Where a draft and
an owner ruling in this brief conflict, the owner ruling wins.

---

## 4. HARD DESIGN LAWS

### 4.1 LIKENESS LAW (SHOW-BIBLE §5 Law 7; MEMORY.md)
- Characters are ALWAYS built from their **actual images
  already in the repo** (the avatar precedent: built off the
  exact picture Jamar sent). **Never invent a likeness from a
  text description.**
- Generative results must preserve the repo likeness AND art
  style, pass the **likeness gate** against the model sheet /
  canon cutout before being shown as production or shipped,
  and the batch must be **style-consistent**.
- Precedent rejection: the glossy-3D batch (Mochii/Gabu/
  Kittember/Sproutle/Wispkin) — Gabu converged to a literal
  Blastoise, Mochii became generic 3D slime, styles mutually
  inconsistent — REJECTED, never shipped. Do not repeat its
  failure modes: no off-model drift, no style mixing in a
  batch, no generic-creature substitution.
- Gate standards are NOT set here: the likeness/design gate is
  governed by the lane standards (§3 — DESIGN-THEORY G-series
  master gate, DESIGN-PRINCIPLES Part 3 quick form) and
  implemented in the avatar stack (likeness_gate.py). Two
  owner rulings bind regardless: **promotion is the human
  scorer's call only** (the gate packet recommends, it never
  promotes), and references are **full-body only** — the
  pose-matched crop experiment was RETIRED by owner; do not
  resurrect it. (MEMORY.md, Avatar-Stack Wiring + Option A.)
- Hash-level verification for anything presented as avatar-
  stack: checked against `~/workspace/avatars/` or it did not
  happen (MEMORY.md, Dorowani correction).
- Canon cutouts of record: `canon-cutouts/<species>.png`
  (workspace) + repo equivalents. Pilot six: Mochii, Dorowani,
  Gabu, Kittember, Sproutle, Wispkin.

### 4.2 VOICE LAW — design mouths for cries, not speech
- Creatures: **PURE CRIES AND SOUNDS ONLY.** No word-dialogue,
  no name-saying. Emotion is performance + sound (SHOW-BIBLE
  §5).
- Per-creature sound identity (SHOW-BIBLE §4): Mochii =
  bouncing squeak-cry; Dorowani = low steady croak; Gabu =
  foghorn bellow; Kittember = thin mewl; Sproutle = soft
  chirps; Wispkin = whisper-wail.
- Design consequence: creature mouth/expression systems are
  built for cries, calls, and emotion shapes — never speech
  visemes. (Human viseme/lip-sync tooling exists, §2.4, and
  applies to humans only.)
- **Subtitle law:** silent-film intertitles only, at certain
  important moments, to carry what a creature means (the
  Rule 12 line over the Dark Forest is the model). Never full
  dialogue subtitling. Design any creature-meaning graphics to
  this rationing.

### 4.3 No baked shadows (MEMORY.md; ~/AGENTS.md)
Character/creature art NEVER carries a baked-in shadow (no
painted ground/contact shadow in a cutout, sprite, or rig
texture). Shadows are added at compositing/render time so they
match scene light and ground. If source art arrives with a
baked shadow, remove it; the cleaned version becomes CURRENT
and the shadowed version is marked NOT USABLE. Precedent:
Sproutle — cleaned cutout (shadow ellipse removed) is the
current `canon-cutouts/sproutle.png`; `sproutle-v1-baked-
shadow.png` is NOT USABLE.

### 4.4 Construction-kit rule for donors (~/AGENTS.md;
TRANSFER-MANIFEST.md)
- Donor shows are DONORS, never crossovers. What comes over is
  only the construction kit: tools, pipelines, resources,
  materials, environments, props, rig systems/specs,
  conventions, systems/code patterns.
- **Never** donor characters, character names, or logos/
  branding. Anything proprietary or identity-bearing is
  REPLACED with original Mochiichao material; a piece that is
  a specific character is rebuilt natively for this cast from
  the system, not carried over as itself.
- Backgrounds/environments/items/props CAN come over directly
  and be mixed in (the filter above still applies).
- Transfer classes (TRANSFER-MANIFEST.md): Class 0 direct
  visual carry-over; Class 1 his own infra / public-domain;
  Class 2 extract-and-convert; Class 3 donor-by-donor with
  honest gaps (several donor repos are empty placeholders —
  e.g. Teen Titans — with nothing to extract; a gap stays a
  gap, it is never faked).
- Reuse-first assembly: catalogue/select/assemble existing
  parts (parts-catalog is step zero) before creating new
  assets.

### 4.5 Per-species canon the design lane must obey
- **WISPKIN — reference of record:** `canon-cutouts/wispkin.png`
  (owner-confirmed: *"that's what he needs to look like"*).
  Cracked white skull mask with dark eye holes, held ON by
  both small black hands; fat round black body; black flame
  tip; bottom dissolving into smoke with a Casper-like ghost
  tail. **No legs, no duck bill, no top hair/tuft.** The
  maskless wisp look is **pre-mask Wispkin — FLASHBACK ONLY**
  (approved asset: `show/assets/flashback/wispkin-premask-
  float.mp4`). Never ship maskless as current Wispkin.
  FROST IS CANON: Wispkin's nightly trace — a path-map Mochiko
  learns to read; frost carries a black-purple spirit-aura
  smoke/flame; the FROST CLOSE-UP COLOUR SHIFT device (world
  palette shifts on zoom-in, restores on zoom-out) is a locked
  design device. Wispkin is the Garden's night keeper
  (show-side owner canon; game canon is silent on habitat).
- **KITTEMBER — tail-tip flame:** the flame is ATTACHED to the
  tail tip, parented to the tail in the rig. Never a separate
  floating flame orb. (Repo portrait art showing a floating
  orb is wrong against canon — see §9, C3.)
- **DOROWANI — reference form:** rebuilt Dorowani ONLY — blue
  bipedal amphibian, RED fin cheeks (not the orange-cheeked
  old version), red eyes, light belly, dorsal fin, tan shell
  on its back. The live avatar set in `~/workspace/avatars/`
  is the likeness source of truth.
- **Signature attacks are PER-SPECIES canon** — never a shared
  template; each comes from game canon for that species.
  Locked display names: Mochii **HYDRO RUSH** (canon AQUA_JET),
  Kittember **FIRE STREAM**, Sproutle **LEAF BLAST** (canon
  RAZOR_LEAF; animation = that move's animation language as
  reference + original FX), Wispkin **DARK WAVE** (canon
  SHADOW_PULSE), Dorowani **WATER ORB** (his alone — he forms
  a water orb in his hands to throw/blast it; no other species
  gets a Water Orb), Gabu **TREMOR** (earthquake-class).
- **Anatomy-variance doctrine:** a move's ANIMATION depends on
  the performer's anatomy (shape/size/build, mythical/
  legendary class). Design/log the variance per move/species
  in the registry; never treat one creature's performance of
  a move as the universal animation.
- **Rigs:** pilot six have TextRig whole-image DEFORM rigs
  built from the canon cutouts (no redraw) at
  `show/production/rigs/builds/<species>/`. Kittember's flame
  is parented to the tail bone; Dorowani's water_orb_charge is
  rig poses with the orb as an FX layer. Known shortfall:
  Gabu's jaw_chomp reads subtle (canon muzzle is fused/front-
  facing) — a true open-mouth chomp needs a v2 pieces/swap
  pass (flagged in its RIG-NOTES; see §8).

---

## 5. THE WORKFLOW THIS BRIEF FEEDS (data-first)

Standing order (MEMORY.md): show characters/animations are made
with the AVATAR FULL STACK — the generative image-to-video method
that made Doro's avatar videos — with transparent twins, posters
and manifests, shipped into the repo bundles. Only frame-verified
real animation counts; whole-sprite bob/tilt/zoom "slideshow"
output is rejected by definition (Animation Law, SHOW-BIBLE §5).

**Two tracks run through this pipeline:**
- **Track B — NEW SPECIES (the main effort):** the full
  pipeline below, steps 1–8, from an empty sheet to a shipped
  bundle.
- **Track A — GEN 1 GAP-FILL (§6):** species already on the
  roster enter at the step their record is missing and only
  that step is worked — the pipeline is a checklist for them,
  not a restart.

Pipeline per species, in order — no step skipped, no step reordered:

1. **DATA FIRST.** The species' complete data record is finished
   (the lane's species-sheet standard — the full Pokémon-games-
   style record: bio, footprint spec, silhouette spec, discovery
   data, stats, moves, cry) BEFORE any design work starts.
   Design never precedes data.
2. **DESIGN FROM DATA + BRIEF + REFS.** Design is generated from
   (data record) + (this brief: canon, world, style stack,
   §4 laws) + (the species' actual repo likeness references,
   per §4.1). Text-only invention is prohibited.
3. **SILHOUETTE DERIVED.** The silhouette is extracted FROM the
   finished design — it is a discovery asset (the Mochiioteca
   "who's that" layer), never designed independently first.
4. **FOOTPRINT DERIVED.** The footprint is derived from the
   finished design's anatomy, per the data record's
   footprint_spec (foot count/type, gait, weight class) — not
   a generic paw print.
5. **CRY MATCHED.** The cry is matched/recorded to the species'
   sound identity (§4.2) — cries and sounds only.
6. **BUNDLE SHIPPED (avatar full stack).** Poster (1600) +
   variant clips (720×720, 8s, 24fps; variant names per the
   measured spec) + transparent WebM twins (MP4 has no alpha)
   + manifest with hashes, into the repo bundle home
   (`public/assets/show-bundles/<species>/` + show manifests
   updated: cast.json, clip-index.json). Likeness gate (§4.1)
   passes — or the bundle does not ship.
7. **DELIVERY TO JAMAR.** Finished design images are delivered
   to Jamar in the main chat flow as they complete. The design
   lane does NOT wait to be asked per species and Jamar does
   NOT hand-carry requests to the design lane.
8. **BATCHING.** Work is queued in batches by **Mochiioteca
   number** (the data record's dex order). New-species design
   (Track B) is the main effort and takes the batches; Gen 1
   gap-fill (Track A, §6) is audited in number order across the
   existing roster — pilot six first (Mochii, Dorowani, Gabu,
   Kittember, Sproutle, Wispkin — the cast with cutouts, rigs,
   and bundles already of record).

---

## 6. GEN 1 GAP-FILL (Track A)
The existing roster — the **47 canonical species** (repo
`src/data/core/species.json`) **plus the image-made extras**,
~60 confirmed species in total — is NOT redesigned and NOT
re-data'd. Gap-fill means exactly this:

- **Audit, don't rebuild.** Each roster species' sheet is
  checked against the lane's complete species-sheet standard.
  Whatever elements are PRESENT and settled are locked as-is —
  likeness, data, cry, bundle, whatever exists of record.
- **Fill only what's MISSING.** A species missing a footprint
  gets a footprint derived from its finished design (§5 step
  4). A species missing discovery/silhouette data gets the
  silhouette derived from its design (§5 step 3). A species
  missing a data element gets that element completed to the
  sheet standard. Missing elements are completed in
  Mochiioteca-number order, pilot six first.
- **No silent upgrades.** Gap-fill never "improves" a settled
  element — no redraws, no restats, no re-cries. If a settled
  element conflicts with canon (e.g. §9, C3/C4), it is NOT a
  gap-fill job: it goes to the owner-decisions list (§8) and
  waits.
- **Currency applies.** Where two versions of an element
  exist, the registry's CURRENT-marked version is the one
  audited against (Current-Version Law); the other is history,
  not a gap.
- **New-species design is the main effort.** Gap-fill is the
  side queue that makes the existing roster complete; it
  never displaces Track B batches (§5).

---

## 7. NUMBERS AND SCOPE (settled)
- **~60 confirmed species on the roster:** the 47 canonical
  species (repo `src/data/core/species.json`) + the image-made
  extras already confirmed in the design lane. ~51 creature
  animation folders, 10 title-video creatures in the game
  repo. Any species beyond the confirmed roster is NEW canon —
  see §8, item 1.
- Human cast: repo `docs/human-characters/` (Mochiko, Hex,
  Aeon + full cast there).
- Episode frame for design demand: EP01 is a full Pokémon-
  format episode (24-min slot, ~21 min story) built around the
  locked 28 cuts; EP02 'Choose, and Be Chosen', EP03 'One Ring
  Past the Gate', EP04 'Dojo at Dusk', EP05 'Turn On the
  Lights' (owner-approved titles).

---

## 8. OPEN CANON QUESTIONS — OWNER DECISIONS (never silently filled)

1. **Roster scope beyond the confirmed ~60.** The roster is
   settled at ~60 confirmed species (47 canonical + image-made
   extras, §7) and new-species design is already the main
   effort (§5 Track B). Open: what confirms a NEW species onto
   the roster — is the completed data sheet + this brief
   sufficient, or does each new species need an individual
   owner confirmation before its design batch?
2. **Sproutle likeness of record. RESOLVED 2026-10-28 (owner
   ruling).** There is no disagreement to settle: the
   `portraits-scripted-v3` Sproutle IS the canon likeness, and
   the blue/green front art is its LUSTRE (shiny variant)
   form, whose different colours are the point of the form.
   The gate scores the portrait family against the portrait;
   Lustre art is scored as the Lustre form. See §9 C4.
3. **Kittember portrait correction.** The repo portrait shows
   the flame as a separate floating orb; canon is tail-tip
   attached. Does the portrait family get corrected/replaced,
   and does any shipped art still carry the orb?
4. **Gate operation at production scale.** Gate STANDARDS are
   settled in the lane documents (§3) and promotion is the
   human scorer's call (§4.1) — neither is re-opened here.
   Open only as an operations question: at batch scale (new
   species arriving continuously), does every batch get a
   scorer pass before shipping, or does the owner set a
   sampling rule? Owner call; the default until he rules is
   per-batch scorer promotion.
5. **Mochiko — age lock + voice casting.** Role is SETTLED by
   the newest ruling (§2.4: Assistant Mochiko of Aeon's lab,
   who opens the Garden). Still open: her AGE (the SHOW-
   BIBLE's "12" is not confirmed by game canon — design needs
   one number for proportion sheets) and her voice casting
   (Jamar records? cast? TBD — scripts never wait for casting,
   but the human talking seat's design does need the age).
6. **Mochiioteca physical design.** The device's function and
   name are canon; its physical design is undesigned in canon
   (EP01's abstract light+icons treatment stands meanwhile).
   The digicore unit needs a bible art pass — owner decision.
7. **What stopped moving in the Dark Forest.** EP01's stinger;
   game canon does NOT answer. Design of the Forest's depths
   (and anything in them) is blocked on this — stillness only
   until decided.
8. **The Forest's in-world name.** SHOW-BIBLE open item: does
   the Forest have an in-world name distinct from its display
   name (The Dark Forest)? Display law is settled either way.
9. **Display-name sweep application.** The production-layer
   names are settled by the newest ruling (Region 1 =
   Mainframe; Champion on Mainframe Plateau —
   SEASON-CANON-MAP). Open is only the DISPLAY layer: which
   swept forms (Iridescence Plateau; the Binary/Data-class
   scrub of "Seven Data Isles," "Binary Fields") are final
   for in-world labels, signage, and design-facing text, per
   THE SECRET rule (§2.6)?
10. **Manual rules beyond Rule 12.** None exist in game canon;
    writers may draft numbered rules, owner locks them. Any
    rule a design depends on (keeper board, device UI,
    Garden signage) needs its lock first.
11. **Gabu open-mouth chomp.** Canon muzzle is fused/front-
    facing; a true chomp needs a v2 pieces/swap pass. Does
    design author the swap pieces, or does Gabu stay
    subtle-chomp?
12. **Wispkin habitat/biology beyond night-keeper.** Show-side
    owner canon says night keeper + Frost; game canon is
    silent. Anything more (where Wispkin rests, what the mask
    is) is undecided.
13. **Lustre variants.** First-lustre placement is unanswered
    in canon (SEASON-CANON-MAP). Do lustre forms get design
    passes in the first batching wave or later?
14. **Season length / episode runtime beyond the pilot
    format.** SHOW-BIBLE open item; sets design batch sizing
    for featured-species rotation (Digimon rotation law:
    featured sequences distribute evenly; featured species is
    fixed at planning).

---

## 9. CONTRADICTIONS FOUND BETWEEN SOURCES (for owner visibility)

These are logged, not resolved — resolution is an owner call
or follows the newest dated source where noted.

- **C1 — "Mainframe" naming (split by layer; display
  application still open).** MEMORY.md (Two-Lane Law / THE
  SECRET sweep): *Mainframe Plateau → Iridescence Plateau*
  (swept form). SEASON-CANON-MAP.md: *"Region 1 = Mainframe"*
  and *"CHAMPION HEX (Mainframe Plateau)."* The newest ruling
  settles the production-layer name (Mainframe), and the
  two-lane law itself supplies the split: production documents
  may hold the unswept name as law; in-world artifacts use the
  swept form. What remains open is only which swept forms are
  final on the display side. See §8 item 9.
- **C2 — Mochiko's role (resolved by newest ruling; age still
  open).** SHOW-BIBLE §4: *"MOCHIKO — Human, 12, new keeper."*
  SEASON-CANON-MAP.md: *"Mochiko = ASSISTANT Mochiko
  (aeon_lab.json); she opens the Mochi Garden at R1-BEAT3."*
  The canon map is the later, owner-ruled resolution (season
  decisions resolve FROM GAME CANON), so this brief follows
  Assistant Mochiko (§2.4) and treats the Bible formulation as
  superseded on role. Her age remains unconfirmed. See §8
  item 5.
- **C3 — Kittember's flame in repo art.** memory/2026-10-27.md
  (portrait prep notes): Kittember portrait = *"black cat with
  golden eyes and an orange flame orb"* (separate orb).
  MEMORY.md (owner canon): flame is *"attached to the tail
  (tail-tip flame), never a separate floating flame orb."*
  Canon wins; the art is the outlier. See §8 item 3.
- **C4 — Sproutle's colours. RESOLVED 2026-10-28 (owner
  ruling).** The conflict framing was wrong. The
  portraits-scripted-v3 Sproutle
  (`sprite-art/portraits-scripted-v3/sproutle-portrait-scripted-v3.png`)
  IS Sproutle's canon likeness. The blue/green front art
  (`public/assets/variants/lustre/sproutle_lustre_front.png`)
  is the LUSTRE version — the shiny variant form (Lustre =
  the alternate-palette shiny system); its different colours
  are the point of the form, not an inconsistency. The pair
  is a base form vs its Lustre form, not two competing
  likenesses, and no likeness-of-record ruling is needed.
  See §8 item 2 (closed by the same ruling).
- **C5 — Water Orb in game data (resolved drift, logged so
  nobody re-derives the old state).** MEMORY.md canon entry:
  *"No Water Orb entry exists in the game's moves.json yet."*
  MEMORY.md move-rename law (later, same day): Water Orb
  *replaces AQUA_SHOT* (id stable; WATER Special 40/100/25).
  The later ruling supersedes; design treats Water Orb as in
  game data under the AQUA_SHOT id.
- **C6 — "Keeper" scope.** SHOW-BIBLE uses "keeper" as the
  show's general frame ("a new keeper arrives," "keeper
  board," "keeper device"). MEMORY.md (Battle Doctrine):
  *'keeper' is Garden-scoped*; battle commanders are RANGERS;
  'trainer' was never canon. Design follows the doctrine:
  keeper = Garden only, Ranger = battle command.

---

## 10. SOURCE INDEX
- `~/MEMORY.md` — canon naming laws, style stack, voice/
  subtitle laws, likeness law + gate history, signature
  attacks, move laws, battle doctrine, THE SECRET, current-
  version law, no-baked-shadows law, staging law, EP01
  decisions, Wispkin reference of record, pilot rigs.
- `~/memory/2026-10-27.md` — dated log: repo inventory (47
  species, human cast docs), pilot-six art notes (C3/C4
  evidence), donor-transfer correction, show-home state.
- `~/AGENTS.md` — construction-kit rule, no-baked-shadows
  rule, current-version law, staging law, licence honesty.
- `~/workspace/mochiichao-show/SHOW-HOME.md` — show-in-repo
  layout + shared manifests (cast/parts-catalog/clip-index).
- `~/workspace/mochiichao-show/SHOW-PLAN.md` — show plan +
  repo inventory.
- `~/workspace/mochiichao-show/TRANSFER-MANIFEST.md` — donor
  transfer classes 0–3, filter, honest gaps.
- `~/workspace/mochiichao-show/PULL-IN-MAP.md` — donor repo
  finds (playbooks, pipelines, voice pipe) feeding the kit.
- `repo-add/show/bible/SHOW-BIBLE.md` — the show bible v1
  (stack, world, cast, laws, open items).
- `repo-add/show/production/SEASON-CANON-MAP.md` — game-canon
  resolutions: Forest/device renames, EP02 opening, season
  spine, what canon does not answer.
- `research-drafts/` — CANON-SIGNATURE-ATTACKS.md,
  GAME-CANON-FOR-SEASON.md, DESIGN-PRINCIPLES-DRAFT.md,
  DESIGN-THEORY-DRAFT.md and siblings (drafts; §3 note
  applies).
