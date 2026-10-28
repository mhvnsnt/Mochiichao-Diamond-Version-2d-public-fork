# LIVING WORLD — ambient motion, background population, B-roll, ambient sound, composite life

**Status: DRAFT for owner review.** Commissioned 2026-10-27, in direct
response to the EP01 Scene 1 animatic v1. The owner's ruling: the
animatic is a correct production *start* — real shows begin exactly
there, board-timed stills over the audio skeleton — but it is not the
show. The finished show is a *living* world, and the systems that make
it live are specified **now**, so every next build and cut includes
them by default instead of being retrofitted.

**What this doc is:** the research + the wired systems. Five systems:

1. **Ambient Cycle Library** — the environment never holds still.
2. **Background Population** — the garden is inhabited, not cast-only.
3. **B-Roll BANK** — between-scene life shots, stocked per location.
4. **Ambient Sound** — a full foley/ambience layer under every scene.
5. **Composite Life** — light itself breathes (generalises LS-8).

**Governing docs it plugs into:** UNIFIED-PIPELINE (routing: puppet
default / generative flagged / hybrid; Natron composite; FFmpeg spine;
audio-first per scene), ENVIRONMENT-AND-CAMERA (camera vocabulary:
`ESTAB-PAN`, `STAGE-WIDE`, `STILL-FOREST`…), LIGHTING-SYSTEM (LS-8:
one visibly *behaving* light event per episode — this doc generalises
it), COLOR-SYSTEM v2 (location colour scripts), EP01 CUE-SHEET
(audio GAPs this doc closes). House laws apply throughout: reuse-first
(catalogue → select → assemble → create only what's missing), open
items are flagged, never silently filled, and the Animation Law —
none of this turns an animatic into "animation"; it specifies what
*production* picture must contain.

> **The one-sentence version:** characters may hold — that's acting.
> The world may not hold — that's death. The only place the world is
> *allowed* to stop is the Dark Forest, and there the stopping is the
> horror (script cuts 25–28; `STILL-FOREST`).

---

## PART 1 — RESEARCH

### 1.1 Environmental motion: how productions keep the world moving

**The layer model (classical, still the grammar).** Preston Blair's
*Cartoon Animation* lays out the multi-plane logic every TV pipeline
still uses: a pan background moves under the characters while
*overlay* backgrounds (foreground trees, framing elements) move at
two and three times the pan speed — "close trees move faster than
distant trees… variations in pan overlay speeds are plotted using
actual perspective moves." Blair also documents the **cycle
background**: a pan BG "planned with three or more fields, such as
the first and last fields, painted exactly alike," so the background
can be jumped between fields in a loop indefinitely. Two production
facts follow that this doc builds on: (a) ambient motion is a
*layer* problem, not a redraw problem — the master plate stays still
and life is added on separable overlay levels; (b) loopability is
designed in at the painting stage (first/last field match), not
discovered in the edit. [Source: Preston Blair, *Cartoon Animation*,
ch. "Pan Backgrounds, Overlays, Cels" — scribd.com/document/739832648]

**TV-budget grammar (Hanna-Barbera planned animation).** HB's
economy is the ancestor of every system in this doc: simplified
designs, "backgrounds and animation cycles (walks, runs, etc.)
regularly re-purposed," characters split into levels so only the
part that must move does, the rest held. A seven-minute short ran on
~2,000 drawings instead of ~14,000 — and the compensation was
explicit: "dialogue, music, and sound effects were emphasized over
action." Read correctly for Mochiichao: a *cycle library* + a *sound
layer* is not a compromise version of a living world; historically it
**is** the TV living world. The cycles are built once, banked, and
re-dressed; the sound bed does half the life-work. [Source:
Hanna-Barbera production history, en.wikipedia.org/wiki/Hanna-Barbera]

**Pokémon: BANK + background animation as the hero exception.** The
show's own environment doc (ENVIRONMENT-AND-CAMERA §Pokémon) already
records the base grammar: stock establishing pans and BANK reuse for
places, graphic effect-fields for impact. Against that economy,
Masaaki Iwane's signature is the exception that proves where life
pays: his battle cuts *rotate the whole frame and animate the
background with the characters* — "the world moves, not just the
fighter" [Sakugabooru #10587 commentary, via ENVIRONMENT-AND-CAMERA].
Iwane himself, and OLM staff around him, describe the method as
economic, not lavish: his drawing count is *not* higher than other
episodes' — he "makes the movements seem bigger" within the same
limit, and part of his speed is a personal bank: "he'll take some
effects he's done previously and reuse them as bank animation
somewhere else… he's already got the patterns and format for some
cuts ready." [Sources: Kanzenshuu, Animage Iwane interview
translation, kanzenshuu.com/forum/viewtopic.php?t=42117; fullfrontal.moe
Satoshi Nakano interview: fullfrontal.moe/nakano] Series director
Tetsuo Yajima's XY doctrine adds the staging half: realistic
locations, in-depth layouts, characters walking foreground-to-
background — depth of *space* is what ambient layers animate inside.
[Source: Yajima interview translation, truthordeal.neocities.org/
translations/yajimainterview]

*Transfer:* Mochiichao runs the Pokémon split — BANK ambient cycles
everywhere (cheap, always on), and **background animation spent like
Iwane spends it: on hero beats only**, where the whole environment
joins the action (EP01: Gabu's lunge splash, cut 14; Wispkin's
float-up, cut 23 — both already boarded as ACTION BEATs).

**Ghibli foliage practice (the quality ceiling, and its lesson).**
Kazuo Oga's stated aim for Mononoke's backgrounds was "simplicity
within the detail" — not reproducing nature, but simplifying and
caricaturing its essential meanings; the observed result is a cinema
of *attended* natural moments: "the wind bending the stalks of grass
in a field," "the first drops of rain darkening a path," a kingfisher
taking flight at a river's edge. [Source: Princess Mononoke
discussion/Oga quotation, studypool.com/discuss/47392024] Miyazaki's
own formulation is the animator's rule underneath all of it: "The
wind is something you cannot draw. But when you see the grass bending
or the hair blowing or the clothes flapping, you know it's there.
That is the art of animation." [Source: Miyazaki interview with The
New Yorker, Jan 2005, collected at kabushikihakushi.com/en/
entertainment/hayao-miyazaki] Ghibli's per-blade full animation is
**not** the transfer — a weekly TV budget cannot and should not chase
it. The transfer is the *principle*: wind is never drawn; its
**evidence** is animated — grass, leaves, water, smoke, a hanging
sign — and the evidence is chosen per location and cycled. The
TV-budget version of Oga is a well-chosen 8-frame grass cycle, not a
thousand unique blades.

**Held cel + moving layer, modern form.** In the digital pipeline
the same layer model runs in Tahoma2D/ComfyUI/Natron terms
(UNIFIED-PIPELINE §2/§5): the painted plate is a held level; ambient
cycles live on their own levels above and below the character level;
composite adds drift, shadow and defocus. What changed since Blair
is only the tooling: cycles are now cheap enough to be *procedural*
(warp/turbulence on a painted strip) as well as drawn — §2.1 routes
each cycle to whichever is cheaper at equal quality.

### 1.2 Background population: the inhabited frame

**The observed standard (US TV): background characters with idle
lives.** *My Little Pony: Friendship Is Magic* is the widely noted
Flash-era case: backgrounds are populated with distinct background
characters rather than faceless masses, and "looking closely in the
background one can see them blinking, shifting and moving slightly,
and talking to each other" — idle micro-motion, not full acting, is
what reads as *inhabited*; the same production later normalised
depth-of-field separation on close shots. [Source: TV Tropes, Sugar
Wiki/Visual Effects of Awesome — observed-convention source, labelled
as such: TVtropes.org/pmwiki/pmwiki.php/SugarWiki/VisualEffectsOfAwesome]
The budget shape matters: extras get **cycles and micro-motion**
(blink, shift, bob, a 2–4 drawing idle), never bespoke animation.

**Depth staging does the focus work.** Standard layout/staging
practice keeps non-focus elements readable but subordinate: focal
clarity is controlled by "color contrast, blurring background
details, or adjusting the lighting," with foreground/midground/
background layering carrying the hierarchy [Source: "Animation
Layout," CGWire blog, blog.cg-wire.com/animation-layout]. In
composite terms (and in anime practice, observed convention):
non-focus crossings are treated with a combination of **defocus
blur, value darkening, reduced contrast, and smaller scale** — the
element is present, moving, and *demoted*. Foreground crossings do
the opposite job at the opposite treatment: large, soft, fast, often
near-silhouette — a wipe of life between camera and subject that
sells depth precisely because it is *not* looked at.

**Silhouette/darkened extras (anime crowd practice, observed
convention).** TV anime routinely renders crowd/background figures
as simplified shapes — reduced detail, muted or silhouette value —
reserving full model treatment for anyone the story touches. For a
creature garden this maps cleanly: ambient Mochi are staged at
silhouette-or-sprite detail (the game's own garden-pose and lustre
sprites are already at exactly that read distance — reuse-first),
and only *named* cast get puppet treatment.

**The Pokémon precedent for creature extras.** A world of creatures
is populated by creatures: Pokémon's environments habitually carry
ambient species — birds crossing skies, water-types surfacing —
as *world* information, staged small and unfocused (observed series
convention; the show's creature-first staging is also why EP01's
owner note specifies "not so much people but other creatures"). The
roster cost is near zero *if* the extras are drawn from the series'
own species library — which for Mochiichao is literal: 47 canonical
species with in-repo sprite/pose/cry assets (cast.json roster
sources: `src/data/core/species.json`).

### 1.3 B-roll and interstitials: the breathing cuts

**Eyecatch (documented form).** The eyecatch is a 2–6 second
segment produced by the production company itself, "considered a
part of the program itself," placed at segment breaks; children's
programmes' are "longer and more elaborate," and some carry snippets
of world information not in the main content. [Source: Eyecatch,
Animanga Wiki, animanga.fandom.com/wiki/Eyecatch] EP01's board
already calls for "keeper device check-in eyecatch energy" at cut 12
— this doc stocks the form properly: the eyecatch is a *life shot
with a device frame*, not a logo card.

**Bank cuts as system (documented).** Academic production study of
Evangelion documents the bank system plainly: a small set of shots
reused "over and over," where the reuse itself builds place-identity
— a recognisable cut "establishes a sequence as taking part in [a
known location] and sets a mood" before any new animation appears.
[Source: *Anime Studies: Media-Specific Approaches to Neon Genesis
Evangelion*, Stockholm University Press, stockholmuniversitypress.se]
That is the B-roll BANK's job description: a stocked library of
short life shots per location that (a) transition scenes, (b)
re-establish place instantly, (c) let the episode *breathe* between
story beats — the Pokémon `ESTAB-PAN` (ENVIRONMENT-AND-CAMERA) is the
same device in establishing form.

**Where B-roll sits in a 6-minute episode.** EP01's board totals
≈4:14 of story cuts against a ~6:00 format; the board note already
assigns the remainder to "title card, eyecatch, transitions, held
beats." This doc converts "transitions" from padding into a stocked
asset class with names, durations and audio (§2.3), so the breathing
is *cast*, not improvised in the edit.

### 1.4 Ambient sound design: everything is built

**The foundational fact:** in animation there is no production
sound — every audible thing is placed. Standard sound-design
teaching splits the placed world into layers: **Ambience** ("the
background noises that define the environment" — wind, water, room
tone), **Hard Effects/Foley** (sounds "timed specifically to an
action on screen" — footsteps, rustles), and **Soft Effects**
(not sync-locked, but story-bearing — a distant call, a far bell).
"Good sound design is all about layering." [Source: Sound Design
Crash Course, animationexploration.org] Professional SFX library
practice adds the taxonomy used in §2.4's spot list: ambience/
backgrounds, foley by location and material, motion (ascend/descend,
fast/slow), impacts, animal/nature, vocal effects — and the habit of
building a **production SFX library per show** from recorded +
library sources, catalogued so any cue can be retrieved and its
source documented. [Source: *Designing Sound for Animation*,
anyflip.com/smicy/gihv]

**Why this layer is load-bearing for Mochiichao specifically.** The
Voice Law (creatures = cries and sounds only) and the Subtitle Law
(silent-film economy) mean the show's world-exposition runs through
sound more than dialogue: the garden's life is *heard* — rustle,
water, distant cries — before it is seen. HB's economy lesson (§1.1)
says the same thing historically. The cue sheet's two GAPs (cold-spot
shimmer; gate bell) are closed by §2.4's sourcing table.

**Open-licence sourcing (already indexed in-repo).** UNIFIED-PIPELINE
§5's SFX table is adopted wholesale: **Freesound** filtered to CC0
(~381k CC0 sounds; licences are per-file — check and log each one),
**Kenney** audio packs (CC0), **Sonniss GDC Game Audio Bundles**
(royalty-free, no attribution), **Pixabay SFX** (Pixabay Content
License), **OpenGameArt** (per-item, CC0 filter) — the same
OpenGameArt index the EP01 cue sheet already points at via the
TRIPPEDD source manifests. Rules carried over: CC0 filter only,
per-file licence logged in the manifest, no NC material anywhere in
the chain. [Source: UNIFIED-PIPELINE §5 + its cited free SFX/music
license reference, app.cinevva.com/guides/free-sound-effects-music]

### 1.5 Composite life: light that breathes

LIGHTING-SYSTEM **LS-8** already mandates one visibly *behaving*
light event per episode (a source takes over, shifts, or — the
Forest — refuses). The research above generalises it: Ghibli's
background art is famous for *light behaving continuously* — Oga's
light filtering through trees is the cited signature [studypool
Mononoke discussion, §1.1] — and the TV-affordable version of that
is a **composite layer**, not painted animation: drifting cloud
shadows crossing the plate, pollen/motes on a slow particle drift,
shimmer on water, light leaks through canopy gaps. These are the
cheapest life in the entire doc (procedural, Natron/FFmpeg stage)
and the first thing whose *absence* dates the animatic. §2.5 specs
the layer; the LS-8 event remains the scored, singular version of
what this layer does quietly all episode.

---

## PART 2 — THE WIRED SYSTEMS

Naming: every asset below gets a stable ID. Cycles: `AMB-[LOC]-[ELEMENT]-##`.
Population cycles: `POP-[CLASS]-##`. B-roll: `BR-[LOC]-##`. Sound beds:
`BED-[LOC]-[TIME]`. Spot effects: `SFX-[ACTION]-##`. IDs are how the
build manifest (UNIFIED-PIPELINE step 1) will call them — the manifest
compiler gains `ambient`, `population`, `wind_state`, and `bed` fields
per cut (see Part 4).

### 2.1 AMBIENT CYCLE LIBRARY — the environment never holds still

**Design rules (apply to every cycle):**

- **C1 — Layered, never baked.** A cycle lives on its own level
  (underlay / overlay / foreground, per Blair's pan+overlay model).
  The master plate is never re-painted to include motion. A cut can
  then re-time, re-speed or drop a cycle without touching the plate.
- **C2 — Prime-length loops, offset phases.** Loop lengths are chosen
  non-commensurate (e.g. 2.3s / 3.1s / 4.7s / 7.3s at 24fps ≈ 55 / 74 /
  113 / 175 frames) and cycles start at different phase offsets per
  cut, so layered loops never visibly synchronise into a pattern the
  eye can catch. Two cycles in the same cut never share a length.
- **C3 — One wind, everywhere (the WIND-STATE system).** Every
  wind-driven cycle reads a per-scene global: `WIND ∈ {CALM, BREEZE,
  GUST}`. Grass angle, leaf rate, cloud speed, sign sway, water chop
  and the wind audio bed all key off the same state, so a gust is a
  *world event*, not five coincidences. Wind-state is a storytelling
  dial: it can die (Kittember's ears flatten, cut 09 — the air
  stopping is the tell), rise (stinger approach), or refuse (Forest,
  §2.1 table). The board marks wind-state per cut; default BREEZE.
- **C4 — Speed ratios by depth.** Foreground overlay cycles run
  ~2–3× the rate of midground, background ~½ (Blair's plotted
  perspective speeds). Cloud drift is the slowest thing in any cut.
- **C5 — BANK and re-dress.** Cycles are built per *element*, not per
  cut, and re-dressed per location/time by the Colour/Lighting
  overlays (a dusk ripple is the morning ripple under the dusk key —
  LS overlay law: shifts are layers, never repaints). New cycles are
  MAKE items only when no banked cycle fits (KIT-AUDIT discipline).
- **C6 — The Forest exception.** In the Dark Forest, ambient cycles
  are **OFF** by rule. Stillness is the location's design (Colour
  System: patterns absent; Lighting: FOREST keys are refusals;
  Camera: `STILL-FOREST`). The single sanctioned motion is scripted,
  singular, and non-looping (cut 28's one leaf). Any cycle found
  running in a Forest cut fails the gate (Part 4).

**Cycle catalogue — GATE (build first; EP01's home location):**

| ID | Element / layer | Loop | Notes |
|---|---|---|---|
| AMB-GATE-SWING-01 | Gate door sway on hinges (overlay, the door as separate level) | 4.7s ease loop | Amplitude keyed to WIND-STATE; creak sync in §2.4. Cut 03's *ridden* swing is the puppet/action version — the ambient sway is its idle state. |
| AMB-GATE-GRASS-01 | Foreground grass strip sway (FG overlay) | 2.3s | Drawn cycle or painted-strip warp; phase-offset tufts (3 phase variants A/B/C). |
| AMB-GATE-LEAF-01 | Leaf drift across frame (FG overlay) | 7.3s crossing | Spawn rule: 0–2 leaves per crossing, never on a dialogue-critical beat; path curves with WIND. |
| AMB-GATE-CLOUD-01 | Cloud drift (BG level, behind plate sky) | 30s+ translate | Plate sky is painted cloudless; clouds are a separable level so `ESTAB-PAN` can move them independently. |
| AMB-GATE-SIGN-01 | Keeper-board / hanging sign sway | 3.1s | Tiny amplitude; the board is a story prop (cuts 20–22) — ambient sway stops the moment a hand touches it (acting beats override ambient, always). |
| AMB-GATE-BANNER-01 | Cloth/flag flutter, if dressed | 1.9s | Only when the Gate is dressed for an episode event; off by default. |

**POND:**

| ID | Element / layer | Loop | Notes |
|---|---|---|---|
| AMB-POND-RIPPLE-01 | Concentric ripple rings from fixed points (overlay on water level) | 3.7s per ring set | 2–3 emitter points; emitters are *motivated* (fish-kiss, drip, skim) — a ripple with no cause reads as an error, with a cause reads as life. |
| AMB-POND-REED-01 | Reed/cattail sway at banks (MG overlay) | 2.9s | WIND-keyed; phase variants. |
| AMB-POND-LILY-01 | Lily pad bob + slow rotation | 5.3s | Rotation ≤2° — anything more reads as a vehicle, not a plant. |
| AMB-POND-SHIMMER-01 | Light shimmer on water surface (composite, §2.5) | procedural | Brightness/sparkle field keyed to the lighting key; dies at dusk stakeout (cut 13) as the Stakeout key takes the rim. |
| AMB-POND-MIST-01 | Mist layer drift (overlay, dusk/night only) | 11s slow translate | Built for cuts 13–17; mist is a *layer with edges*, so cut 17's "mist parts" is a level split, not a redraw. |

**GREEN:**

| ID | Element / layer | Loop | Notes |
|---|---|---|---|
| AMB-GREEN-GRASSWAVE-01 | Grass wave passing across the Green (full-width overlay) | 6.1s | The Ghibli evidence-shot at TV budget: a brightness/bend wave travelling with WIND. This is the Green's signature cycle. |
| AMB-GREEN-LEAF-01 | Leaf fall, sparse (FG overlay) | event-spawn | 1 leaf per 6–10s max; the Forest's single leaf (cut 28) is this cycle's dread twin — same asset language, opposite rule. |
| AMB-GREEN-FLOWER-01 | Flower-head bob (MG overlay clusters) | 2.3s | Shares phase variants with Gate grass (same wind). |
| AMB-GREEN-CLOUDSHADOW-01 | Cloud shadows crossing the Green (composite, §2.5) | 13s | Big soft dark shapes; the cheapest "the sky is alive" cue in the doc. |

**DARK FOREST:** *(catalogue intentionally near-empty)*

| ID | Element | Rule |
|---|---|---|
| AMB-FOREST-NONE | — | No cycles run. No population (§2.2). No B-roll (§2.3). The bed is near-silence (§2.4). One scripted leaf, once (cut 28), falling *straight down* — no wind curve: the absence of WIND in a place the wind should reach is the scare. |

### 2.2 BACKGROUND POPULATION — the garden is inhabited

**Classes (the only five ways an ambient creature may appear):**

| Class | Staging | Treatment | Cycle |
|---|---|---|---|
| `POP-SKY` | Bird-type Mochi crossing the distant sky | Small scale (≤6% frame height), silhouette-leaning value, full detail OFF | `POP-SKY-FLAP-01` (2-frame flap + glide ratio 3:1), crossing 6–9s |
| `POP-FG-CROSS` | Small Mochi crossing *foreground*, between camera and subject | Large, defocused (heavy blur), fast (1.5–2.5s), near-silhouette dark | `POP-FG-SCURRY-01` run cycle from game assets, re-timed |
| `POP-BG-CROSS` | Small Mochi crossing background path/ridge | Small, defocused (light blur), value-darkened ~20%, reduced contrast | `POP-BG-WALK-01` / `-HOP-01` |
| `POP-PERCH` | Perched/sitting ambient fauna (fence, branch, stone) | In focus only if on the focal plane; blink + shift micro-motion only | `POP-PERCH-IDLE-01` (blink 3–5s random, weight shift 6–9s) |
| `POP-WATER` | Water-class Mochi at the Pond: surfacing, skimming, fin/ripple cause | Mostly *implied*: ripple emitter + brief surface break | `POP-WATER-SURFACE-01` + AMB-POND-RIPPLE-01 emitter sync |

**Population laws:**

- **P1 — Principals are never ambient in their own scene.** A named
  cast member appears as cast or not at all. (Series-level BANK gags
  are an owner decision, not a default.)
- **P2 — Roster binding, no invented species.** Ambient picks are
  species IDs from the canonical 47 (`src/data/core/species.json`,
  via cast.json), bound by **habitat class × location**: sky class →
  Gate/Green skies; small ground class → crossings; water class →
  Pond; perch class → Gate fence, Green stones. The binding table is
  a build task at first use (open item, §5) — this spec fixes classes
  and rules, not names, because names are canon and canon is the
  roster's, not this doc's.
- **P3 — Reuse-first bodies.** Ambient bodies come from in-repo game
  assets in place (garden-poses sets, animation folders, lustre
  fronts) at sprite detail — the read distance is the design. Puppet
  builds for ambient fauna are forbidden by budget law; if a species
  has no usable cycle asset, it is not cast as ambient until it does.
- **P4 — Focus discipline.** Ambient fauna never: make eye contact
  with camera or cast; cross the focal plane in focus; vocalise above
  the distant-cry level (§2.4); or intersect a subtitle card's screen
  zone. A crossing that upstages a story beat is a staging bug, cut
  in the gate, not in the edit.
- **P5 — Density budgets.** Gate: 1 sky crossing *or* 1 perch per
  cut, max 2 ambient events/cut. Green: ≤3 events/cut (it's the
  living-room of the garden). Pond: ≤2 + water class. Forest: **0 —
  and the zero is a plot point** (cut 26: something *stops*; an
  audience trained on a populated world feels the stop).
- **P6 — Time truth.** Population follows the location clock: dawn
  chorus classes at morning, water class at dusk, near-empty at
  night except night class at the Gate (cut 20–24: one distant
  crossing max — the garden sleeps; Wispkin works).

### 2.3 B-ROLL BANK — stocked life between the story

**Form:** 3–8s self-contained life shots, no story information,
each shipped as a *pair*: picture + its bed slice (§2.4), so a
transition is one manifest call, not an edit decision. B-roll is
BANK: shot once, reused across episodes, re-dressed by overlay keys.

**Stock list (v1 — build with EP01, grow per episode):**

| ID | Shot | Dur | Primary use |
|---|---|---|---|
| BR-GATE-01 | Gate wide, full ambient stack running, one POP-SKY crossing | 6s | Scene-in to any Gate scene; the series' front door |
| BR-GATE-02 | Keeper board close: sign swaying, leaf crossing FG | 4s | Into keeper-business scenes (Manual, rules) |
| BR-GATE-03 | Path stones + grass FG, POP-FG-CROSS scurry | 3s | Comic/energy transition |
| BR-POND-01 | Pond wide: ripples, reeds, one POP-WATER surface break | 6s | Scene-in to Pond |
| BR-POND-02 | Lily + shimmer close, dragonfly-class skim (POP-WATER) | 4s | Into quiet Pond beats; pre-stinger calm |
| BR-POND-03 | Dusk variant of BR-POND-01 under Stakeout key, mist layer on | 6s | Into night Pond scenes (EP01 cut 13 reuses in-episode) |
| BR-GREEN-01 | Grass wave crossing the Green, POP-BG-CROSS pair | 5s | Scene-in to Green; series signature B-roll |
| BR-GREEN-02 | Flower cluster + flower-bob, leaf drift | 3s | Soft transition / breath after action |
| BR-SKY-01 | Pure sky: cloud drift + layered POP-SKY crossings | 5s | Time-passage card (morning→later), episode breath |
| BR-FOREST-01 | — | — | **Does not exist.** The Forest gets no B-roll, ever: you are never *eased* into it. Scene changes to the Forest are hard cuts into stillness (cuts 25–28 are the template). |

**Rules:** B-roll never carries plot, dialogue or a first
appearance; a B-roll shot may not premiere a location (premieres are
story cuts; B-roll *returns* you). Eyecatch adjacency: the cut-12
device check-in is the episode's eyecatch-energy beat — B-roll feeds
into and out of it, and from EP02 the eyecatch itself is cast from
the BANK (`BR-*` shot + device frame), per the eyecatch form (§1.3).

### 2.4 AMBIENT SOUND — beds, foley, spot effects

**Layer model (per §1.4):** every scene ships **BED + FOLEY + SPOT**
over the existing music/cries, inside the per-scene audio bed the
pipeline already builds (Scene 1/2/4 beds exist; this spec is their
v2 content). Beds are continuous location×time recordings, mixed
*under* — target ≈ −30 LUFS relative momentary under dialogue
scenes, finish still −14 LUFS integrated (cue-sheet/TRIPPEDD spec).

**Beds (looping, seamless, 60–120s source loops, crossfaded):**

| ID | Bed | Contents |
|---|---|---|
| BED-GATE-MORNING | Gate, morning | Light wind in grass, distant sky-class cries (sparse, low), far leaf rustle, occasional board creak (long interval) |
| BED-GATE-NIGHT | Gate, night | Crickets (script cut 21 "cricket beat" — the bed *is* the beat), soft wind, one distant night-class cry max per minute |
| BED-POND-DAY | Pond, day | Water lap, reed rustle keyed to gusts, water-class splashes (distant), insect shimmer |
| BED-POND-DUSK | Pond, dusk | Water + cooling air; insect layer thinning across the stakeout (the bed *empties* as tension rises) |
| BED-GREEN-DAY | Green, day | Grass wind (WIND-STATE audible), ground-class rustles, distant play sounds of the garden |
| BED-FOREST-DAY | Forest, day | **Near-silence by design:** no birdsong from inside (locked script), no rustle; a low room-tone-like hush + the *garden's* sounds arriving faintly from *behind* camera. The bed is an absence with edges. |

Wind coherence: bed wind gain/swell keys to the same `WIND-STATE`
as the picture cycles (§2.1 C3) — one parameter drives both.

**Spot-effect list — EP01's actions (the v1 production library):**

| SFX ID | Action | Where | Source route |
|---|---|---|---|
| SFX-GATE-SHUT-01 | Gate shuts (wood + latch) | scene exits, tag | Source CC0 (wood door/latch) + sweeten |
| SFX-GATE-CREAK-01 | Gate swing creak, 3 lengths | cut 03 + ambient sway sync | Source CC0; pitch-matched per length |
| SFX-STEP-PATH-01 | Footsteps, garden path (packed earth/gravel) | cuts 02, 19 | Source CC0 set, per-character weight edit |
| SFX-STEP-GRASS-01 | Footsteps, grass | Green scenes | Source CC0 |
| SFX-STEP-WOOD-01 | Footsteps, board/wood at Gate | cuts 20–22 | Source CC0 |
| SFX-RUNTHROUGH-01 | Small creature run-through (steps + grass whoosh) | POP-FG-CROSS events | Built: steps × rustle layer, panned with picture |
| SFX-RUSTLE-GUST-01 | Leaf/grass rustle gust | WIND GUST events | Source CC0, gain keyed to WIND-STATE |
| SFX-RUSTLE-BUSH-01 | Bush disturbance (unseen hands) | cut 07 area / stakeout | Source CC0 + hand foley if needed |
| SFX-SPLASH-01 | Lunge splash (ACTION BEAT A) | cut 14 | Source CC0 big splash + droplet tail |
| SFX-BERRY-01 | Berry plops/stack | cuts 06–07 | Already in locked script SFX; source CC0 soft plops |
| SFX-DUCK-01 | Toy duck squeak | cuts 08, 17 | Script SFX; source CC0 or synthesis — one signature sound, keep consistent |
| SFX-BELL-01 | Gate bell (tag) | cut 23 | **Closes cue-sheet GAP:** foley/record or CC0 bell, single approved take becomes canon |
| SFX-COLDSPOT-01 | Cold-spot shimmer | beats 2–4 | **Closes cue-sheet GAP:** synthesise (reversed bell partials + air) — a *designed* sound, not a found one; it is a Takeover-class sound (TK-2) and must not resemble any natural source |
| SFX-CRY-DIST-01… | Distant ambient cries (sky/water/night classes) | beds | **Derived, never recorded new:** repo cry files (`public/audio/cries/`) pitch/time-varied, low-passed, low gain — ambient fauna sound like the world they live in because they *are* its species |

**Sourcing table (licences — adopted from UNIFIED-PIPELINE §5):**

| Source | Licence | Use for | Rule |
|---|---|---|---|
| Freesound (CC0 filter) | CC0 per file | Beds, steps, water, wood | Per-file licence logged in manifest; CC0 **only** |
| Kenney audio packs | CC0 | UI/device ticks, small spots | Bulk-safe |
| OpenGameArt (CC0 filter) | CC0 per item | GAP closures, odd spots | Via TRIPPEDD source manifests index (already the cue sheet's pointer) |
| Sonniss GDC bundles | Royalty-free, no attribution | Bed sweetening, big water | Annual bundle, keep receipt with project |
| Pixabay SFX | Pixabay Content License | Fills | Log per file |
| In-repo cries/music | Owner's own | Distant cries, all creature sound | Derived variants only (SFX-CRY-DIST) |
| Record/synthesise | Original | SFX-BELL-01, SFX-COLDSPOT-01, signatures | Anything *recognisable as the show* is made, not found |

### 2.5 COMPOSITE LIFE — the light breathes

A single composite level (or two, FG/BG) added at the Natron stage,
procedural, keyed to the scene's lighting key:

- **CL-1 Cloud shadows.** Large, soft, slow dark shapes drifting
  across ground levels (AMB-GREEN-CLOUDSHADOW-01 is the Green's
  instance). Speed = cloud level speed × depth ratio. Off in the
  Forest (no sky reaches in — script) and off at night.
- **CL-2 Motes / pollen.** Sparse particle drift in light shafts and
  Gate/Green mornings; density low (life, not weather). At the Pond
  at dusk, motes become mist-glint (ties AMB-POND-MIST-01).
- **CL-3 Water shimmer.** AMB-POND-SHIMMER-01 lives here (composite
  sparkle field on the water level), keyed to key direction; the
  one place heat-shimmer language is stocked — Pond high-day only,
  **not used in EP01** (no noon scene; stocked for the library).
- **CL-4 Canopy light drift.** Where a location has overhead cover
  (Gate arch, Green trees), a slow intensity breathing (±5%) on the
  rim/atmosphere — the LS overlay breathing so light is never a
  frozen grade.
- **LS-8 relation:** this layer is LS-8 *generalised to a floor*:
  light always breathes quietly (CL-1…CL-4); once per episode it
  *behaves* (LS-8 event: tail-flame takeover TK-1, cold spot TK-2,
  Forest refusal). The floor makes the event legible.

---

## PART 3 — EP01 APPLICATION

### 3.1 Scene 1 v2 — the exact upgrade list (cuts 01–05, Garden Gate, morning)

Animatic v1 state, for reference: accepted Gate plate + canon
cutouts held at board timings over the gated Scene-1 audio bed
(music + cries; Mochiko VOICE-SCRATCH). Every row below is *additive*
— v2 keeps v1's timings and bed skeleton and layers the living
world in. `WIND-STATE` for the scene: BREEZE throughout, one GUST
at cut 04 (Mochii's speed kicking the air up — the world agrees
with the joke).

| Cut | Board content | Ambient cycles (picture) | Population | Composite life | Sound (bed + spot) |
|---|---|---|---|---|---|
| 01 (0:08) Gate wide, morning, `ESTAB-PAN` | Establishing pan over the accepted plate | AMB-GATE-CLOUD-01 (drift behind plate sky) · AMB-GATE-GRASS-01 A/B/C phases · AMB-GATE-SIGN-01 (board sway) · gate at rest: AMB-GATE-SWING-01 micro-sway | 1 × POP-SKY crossing at ~0:05, far, small — the audience's first "the sky is inhabited" | CL-1 cloud shadow entering frame edge late in the pan · CL-2 motes in the light | BED-GATE-MORNING fades in under title tail · SFX-RUSTLE-GUST-01 (soft, at pan start) · SFX-CRY-DIST (sky class, once, distant) |
| 02 (0:06) Mochiko arrives, backpack bigger than her | Arrival on the path | AMB-GATE-GRASS-01 (FG strip) · AMB-GATE-LEAF-01 (one leaf crossing, early) | 1 × POP-PERCH on the fence, blink only — it watches her so the audience does | CL-2 motes | BED continues · SFX-STEP-PATH-01 synced to her steps (weight: child + oversized pack = slight double-tap) · pack-strap creaks (foley from SFX library, leather/strap class) |
| 03 (0:05) Gate swings — Mochii bouncing on it, squeak-cry | The gate's first *acted* motion | Gate level switches from AMB-GATE-SWING-01 idle to the boarded ridden swing (ambient yields to acting — C-rule: acting beats override ambient) · grass answers the swing's air (grass cycle phase bump) | POP-PERCH startles: one hop + resettle (micro-motion, no exit) | — | SFX-GATE-CREAK-01 synced per swing arc (this is the creak's premiere — it must match AMB-GATE-SWING-01's idle creak family) · Mochii cry (existing bed) · hinge rattle tail |
| 04 (0:08) Mochii circles her at speed; Mochiko's line | Energy peak of the scene | WIND-STATE → GUST (grass flattens in pulses with each pass — the cycle *performs* the speed) · AMB-GATE-LEAF-01 spawn ×2, fast crossings | 1 × POP-FG-CROSS scurry at ~0:06, defocused, *with* SFX-RUNTHROUGH-01 — a second small life agreeing with the chaos; POP-PERCH exits (wings, off top-frame — sky class) | CL-1 cloud shadow passes (sky is moving too) | BED wind layer swells with GUST · SFX-RUNTHROUGH-01 panned L→R with picture · Mochii bounce cycle SFX (existing script SFX family) under her line — line stays VOICE-SCRATCH until casting |
| 05 (0:10) Dorowani enters with the Manual; gavel-tap; Rule 1 read | The scene settles into ceremony | WIND-STATE → CALM (the world quiets for the Manual — ambient as respect) · SIGN sway decays to near-still · grass at CALM amplitude | POP-SKY: none (sky empties for the read) · POP-PERCH: the fence bird returns, lands ~0:03, still | CL-4 canopy breathing only, at minimum | BED thins (wind layer down; this is BED-GATE-MORNING's CALM mix state) · SFX-STEP-WOOD-01 as Dorowani reaches the board · gavel-tap + Manual page sounds (existing script SFX) · Dorowani cry (existing bed) |

**What v2 proves when it passes:** the same 37 seconds, the same
board, the same bed skeleton — but the frame is alive in every cut,
the sound has a floor, and the world's energy curve (BREEZE → GUST →
CALM) now *acts the scene's shape* alongside the cast. That is the
difference between the animatic and the show, itemised.

### 3.2 Scene 2 notes (cuts 06–12, Pond tour → Green → frost trail)

- Cut 06 (Pond arrival): BR-POND-01 is shot *as* this cut's base
  (BANK discipline runs both ways — story cuts that match a B-roll
  spec are built to the spec and banked after). AMB-POND-RIPPLE-01
  emitters live under the berry stack; every berry plop (SFX-BERRY-01)
  gets its ripple — cause and effect is the Pond's life grammar.
- Cut 07 (berries un-stack, unseen): SFX-RUSTLE-BUSH-01 + a ripple
  emitter firing from *under* the stack. Population: **zero visible**
  — the absence is the mystery engine (P5 discipline pays here).
- Cut 08 (duck rolls uphill): water goes *still* for the gag's
  duration (ripple cycle paused) — a held world under a wrong event,
  the comic twin of the Forest's dread stillness. SFX-DUCK-01.
- Cut 09 (Kittember, tail flame flickers at empty air): **WIND-STATE
  → CALM in one beat** — grass/reeds stop mid-sway as her ears
  flatten; the cold spot's first full tell is *ambient*, before any
  grade change (matches Lighting plot beat 2: the cold spot removes,
  it does not add). SFX-COLDSPOT-01, first pass, low.
- Cuts 10–11 (Green; Gabu; Sproutle frost trail): AMB-GREEN-
  GRASSWAVE-01 at full BREEZE for Gabu's entrance (the wave parts
  around the stomp — one hero-beat BG-animation spend, §1.1);
  frost patches are decal levels that *kill* the grass cycle locally
  as they form (bent, pale, still tufts) — the trail reads because
  the living grass stops along it.
- Cut 12 (device check-in, eyecatch energy): B-roll grammar in-place
  (BR-GATE-02 language at the device) + the eyecatch form stocked
  per §2.3. Device prop itself remains an **OPEN ITEM** — ambient
  work does not touch it.

### 3.3 Scene 4 notes (cuts 13–18, Pond dusk stakeout → reveal)

- Cut 13 (stakeout, five heads): BR-POND-03 (dusk B-roll) is this
  cut's base plate state. BED-POND-DUSK begins its *emptying*: the
  insect layer thins across cuts 13–15 (mix automation, written into
  the bed spec, not improvised). Population withdraws in picture
  too: one last POP-WATER surface break early in 13, then none —
  the Pond holds its breath with the cast.
- Cut 14 (Gabu LUNGES — splash): the episode's second hero
  BG-animation spend: AMB-POND-MIST-01 and the ripple field are
  *destroyed and re-formed* by the splash (SFX-SPLASH-01 + droplet
  tail); mist level splits early here so cut 17's parting is cheap.
- Cut 15 (tail-flame FLARES, shadow on mist): mist layer is the
  screen for the shadow gag — ambient layer as projection surface
  (TK-1 takeover: the flame is the scene's light source while it
  flares; Lighting §TK-1). SFX-COLDSPOT-01 second pass under it.
- Cut 17 (mist parts; Wispkin, holding the duck): population and
  cycles return at *minimum* — one ripple ring, reeds barely moving.
  The world comes back at the volume of Wispkin's shyness. This is
  the living-world thesis in one cut: ambient level = emotional
  level, all episode.
- Cut 18 (the wail; SUBTITLE 1): all ambient *sound* ducks under the
  wail (bed −6 dB momentary); no FG crossings (P4 subtitle zone).

### 3.4 Stinger (cuts 25–28) — the anti-application

Nothing in this doc applies, and that is the application. No cycles
(C6), no population (P5: the zero the audience now *feels*, having
lived in a populated garden for six minutes), no B-roll in or out
(BR-FOREST-01 does not exist), no composite life, bed =
BED-FOREST-DAY (engineered absence). Cut 26's "something stops
moving" only terrifies if the audience has been trained that things
*move* — Parts 2–3.3 are what train them. Cut 28's single leaf falls
straight down through dead air. The living world is the stinger's
setup; this doc is therefore also a horror document.

---

## PART 4 — PRODUCTION ROUTING

Per UNIFIED-PIPELINE (puppet default · generative flagged cuts only ·
hybrid for FX elements · composite in Natron · FFmpeg spine · audio
attached per scene, audio-first). Ambient work adds **no new route** —
it assigns each system to the stage that already exists:

| System | Puppet layer (Tahoma2D) | Generative (flagged) | Composite (Natron / FFmpeg) | Audio stage |
|---|---|---|---|---|
| Ambient cycles — drawn (grass, reeds, gate sway, sign) | **Primary.** Cycles built as levels in the scene file; BANKED as reusable scene fragments (TRIPPEDD render_shot conventions) | No — cycles must loop perfectly; generative loops drift | Phase-offsetting, re-dress overlays, speed variants | — |
| Ambient cycles — procedural (cloud drift, mist, leaf paths, water shimmer) | Levels placed here | No | **Primary.** Warp/translate/particle passes; shimmer field; cloud-shadow shapes (CL-1) | — |
| Hero BG animation (lunge splash, grass parting) | Puppet levels + drawn FX | **Flagged option:** generative water/mist element, re-flattened via EbSynth, gated on likeness-of-*place* (palette + line), else puppet fallback | Assembled here either way | Splash/spot sync here |
| Background population | **Primary** for PERCH idle (puppet micro-motion on sprite-derived levels) | No | **Primary** for crossings: sprite cycles (game assets in place) composited with defocus/darken per class; FG blur, BG blur+value | Distant cries derived at audio stage (SFX-CRY-DIST) |
| B-roll BANK | Shot through the normal scene pipeline, then banked as finished pairs (picture + bed slice) | No | Re-dress variants (dusk) via overlays | Bed slice exported with the shot — one manifest asset |
| Ambient sound | — | — | — | **Primary.** Beds + foley + spots built in the per-scene audio pass (beds v2 replace the music+cries skeleton); J/L-cut bed bridges across scene joins; loudnorm −14 LUFS finish |
| Composite life (CL-1…CL-4) | — | No | **Primary.** All procedural, keyed to the lighting key | — |

**Manifest additions (build-manifest compiler):** per cut —
`wind_state`, `ambient: [AMB-…]`, `population: [POP-…]`,
`composite_life: [CL-…]`, `bed: BED-…`, `sfx_spots: [SFX-…]`.
HALTs and open items inherit: a cut whose manifest lists an unbuilt
cycle is flagged MAKE, exactly as BGs are today.

**Gate additions (ANIM-GATE extension):**

- **World-alive check (frame-diff, BG ROIs):** in every non-Forest
  cut, background regions of interest must show motion above
  threshold *excluding* character ROIs — the mechanical form of
  "the world may not hold." Forest cuts must show ≈zero (inverted
  check — stillness is gated too).
- **Loop-seam check:** banked cycles looped 3× must not show a
  visible seam/pop (frame-diff spike at the join fails it).
- **Focus check:** population events intersecting the subtitle zone
  or the focal plane in focus fail the cut (P4).
- **Bed presence check:** every scene's audio bed measures a
  continuous ambience floor (no digital-silence gaps outside
  scripted absences — the Forest bed and cut 18's duck are scripted).

---

## PART 5 — OPEN ITEMS (flagged, not filled)

1. **Ambient roster binding (P2):** habitat-class → species-ID table
   from `src/data/core/species.json` — build task at first ambient
   cast; this doc deliberately names no ambient species.
2. **SFX-BELL-01 / SFX-COLDSPOT-01** remain the two designed-sound
   builds (§2.4); cold-spot is synthesis-first, bell is foley-first
   with CC0 fallback — cue-sheet GAPs close when the approved takes
   exist, not before.
3. **Heat shimmer (CL-3):** stocked, unused in EP01 (no high-day
   Pond scene); first use needs an owner look.
4. **Keeper device (cut 12)** and **Mochiko casting** are untouched
   open items from the script/manifest; ambient and B-roll work
   routes around both, and Scene beds remain VOICE-SCRATCH for her
   lines until casting lands.
5. **What stopped moving in the Dark Forest** is not an ambient
   question and this doc does not speculate. The systems above exist
   so that, whatever it is, the audience will feel it stop.

*— End of draft. On owner approval, this lands as
`show/production/LIVING-WORLD.md`, with the cycle/B-roll/bed
catalogues mirrored into `show/shared/parts-catalog.json` and the
manifest fields added to the build-manifest compiler.*

---

**Construction manual for §2.4's beds:** `show/production/list3-systems/ENVIRONMENTAL-SOUND.md` (List-3 teardown #22) — this document owns *which* beds exist; that one owns *how a bed is built*. Cross-linked at landing (2026-10-27).
