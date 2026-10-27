# Title-creature cry spec — canon-based proposals, staged only

Status: SPEC ONLY, staged 2026-10-26. No audio has been generated, no
repo file has been edited, no file has been shipped. This document is
shown to Mars first; no cry production starts until he approves this
spec (whole spec or per creature, in his words).

## What this spec is for

Mars wants a cry made for each of the 10 title-pool creatures, based on
their canon, for the Pokemon-style title press. FireRed reference is
STRUCTURE ONLY, never copied audio: press -> PlayCry, 90-frame wait,
white fade (`pokefirered-leafgreen/src/title_screen.c`, Cry scene and
`PlayCry_Normal(TITLE_SPECIES, 0)`). At 60 frames per second the
90-frame wait is 1.5 seconds, which is why every proposal below targets
roughly 1-2 seconds, nominally 1.5 seconds.

Title music is a separate thing and is NOT per creature: the official
title track (`mochiichao-title-v3.wav`, loop) stays the SAME each time
unless Mars chooses something different. These cries sit on top of that
press moment; they do not replace the music, and they do not change
which music plays.

## Canon sources used — and their limits

Canon in this repo is scattered. There is no single lore doc. The
sources checked for this spec, in the clean gate clone
(`~/workspace/mochiichao-work/title-creatures-9/repo`, read-only):

- `src/lib/titleRotation.ts` — the 10-creature pool, dex numbers where
  stated, and one vibe/theme line per creature. This is the only source
  that covers all 10.
- `src/lib/species.ts` — only 12 entries. Of the title pool, 5 are in
  it: Mochii (#001), Razorgater (#004), Tyrage (#007), Kittember
  (#010), Sproutle (#038). NOT in it: Dorowani, Gabu, Wispkin,
  Yogiferno, Mythar. Each species.ts entry has types, base stats, one
  description sentence, a learnset, and (for most) an evolution.
- `src/lib/global_roster.json` — 47 entries. Of the title pool, 8 are
  in it: Mochii, Razorgater, Tyrage, Kittember, Sproutle, Wispkin,
  Yogiferno, Mythar. NOT in it: Dorowani, Gabu. Each roster entry has
  elements, base stats, evolution requirements, and search tags
  (visual descriptors, not voice canon). Data-quality flag, reported
  not fixed (this task forbids repo edits): the file as read has a
  syntax typo at line 14 (`"atk: 63` missing its closing quote) that
  breaks a strict JSON parse, so entries here were extracted by
  pattern, not by a clean parse. Do not treat roster numbers as
  settled where they conflict with species.ts; conflicts are listed
  per creature below.
- `~/workspace/goals/mochiichao-fresh-start-repo/files/unification-map.md`
  — the 12 True Elements (Water, Chrome, Earth, Bug, Umbral, Aero,
  Core, Strike, Deep, Flame, Mythic, Normal) and five OPEN element
  decisions. Two of the five touch this pool directly: Beast and
  Flora. They are marked OPEN below and are NOT resolved silently.
- `sprite-art/2d-sheets/<creature>/` — a sheet directory exists for
  all 10 pool creatures. Sheet generation prompts were NOT used as
  canon; visual descriptions below come from titleRotation and the
  roster tags, which are the project's own words.

Rule used throughout: where a source does not state a creature's size,
personality, or voice, the spec writes UNKNOWN. It never invents canon
to fill a gap. Everything under "Proposed cry" is a PROPOSAL tied to
that creature's stated element/vibe, not canon.

## Per-creature spec (pool order)

### 1. Mochii (#001) — Water

- Canon basis: titleRotation vibe "Blue water drop — Boot Harbor
  dawn". species.ts #001: types [WATER], base stats 45/49/49/65/65/45,
  description "A small, water-based creature that bounces to move.",
  evolves to #002 at level 16. Roster #001: elements [Aqua] (maps to
  Water, settled), same stats, tags "blue water slime", "cute bouncy
  ball", "bloop".
- Element/type: Water (settled in all three sources).
- Size/personality from sources: small; bounces to move; "cute" is a
  roster search tag, not a personality statement. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch mid-high; timbre wet and
  round, a watery bloop; duration ~1.2 seconds; fast attack, soft
  bubbly decay; special character: a single bubble-pop bloop, playful
  rather than fierce, matching the bounce.

### 2. Razorgater (#004) — Chrome / Water

- Canon basis: titleRotation vibe "Steel / water starter — chrome
  edge". species.ts #004: types [WATER, STEEL], base stats
  50/65/64/44/48/43, description "A small crocodile with metallic
  scales.", evolves to #005 at level 18. Roster #004: elements
  [Chrome] only, same stats, tags "small metallic crocodile",
  "chrome jaws", "silver lizard".
- Element/type: Chrome (roster) with Water as second type in
  species.ts (WATER/STEEL maps to Water/Chrome). The roster's
  single-element listing vs species.ts's two types is a conflict to
  note, not to resolve here; the cry proposal uses both the chrome
  edge and the water base.
- Size/personality from sources: small crocodile. Temperament: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch mid-low; timbre a throaty
  crocodile growl with a metallic jaw-snap edge; duration ~1.5
  seconds; sharp attack on the snap, short growling decay; special
  character: jaw snap, chrome-edged, not a full roar.

### 3. Tyrage (#007) — Core / Earth (conflict noted)

- Canon basis: titleRotation vibe "Ground starter — ember dust".
  species.ts #007: types [GROUND], base stats 45/60/40/30/40/50,
  description "A tiny dinosaur made of packed earth.", evolves to
  #008 at level 16. Roster #007: elements [Core], same stats, tags
  "tiny earth dinosaur", "rocky ground dino", "mud lizard".
- Element/type: roster Core vs species.ts GROUND, which the
  unification map proposes mapping to Earth (candidate, tied to the
  same Flora question). Mark as Core/Earth, unresolved. The cry
  proposal leans on "packed earth dinosaur" either way.
- Size/personality from sources: tiny dinosaur. Temperament: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch low-mid; timbre gravelly,
  a small earth rumble; duration ~1.4 seconds; medium attack, dusty
  rumbling decay; special character: earth rumble, small in scale to
  match "tiny", not a large predator roar.

### 4. Kittember (#010) — Flame + Beast (OPEN)

- Canon basis: titleRotation vibe "Fire starter — warm glow".
  species.ts #010: types [FIRE], base stats 40/50/40/60/40/60,
  description "A fiery little feline.", learnset Ember Toss / Fire
  Stream. Roster #010: elements [Beast, Flame], same stats, tags
  "fiery red kitten", "flame paws", "cute fire cat".
- Element/type: Flame (settled second element). Beast is OPEN per the
  unification map: Beast is a body category (feline/canine), not a
  type; GameData types this same creature Umbral, not Beast. Options
  on the table (Mars to choose): drop Beast and keep Flame as the
  type, or map Beast to Normal. The cry proposal uses Flame + feline,
  and does not assume an answer.
- Size/personality from sources: little feline; "cute" is a roster
  search tag. Voice: UNKNOWN. Note: roster evolution (target #011 at
  level 14) has no matching evolution field in the species.ts entry;
  that conflict is unrelated to the cry but is recorded here so it
  is not silently merged later.
- PROPOSED cry (proposal, not canon): pitch mid-high; timbre a
  kitten-like chirp with a crackling fire edge; duration ~1.3
  seconds; quick attack, crackling decay; special character: fiery
  chirp, warm rather than snarling, matching the "warm glow" vibe.

### 5. Sproutle (#038) — Flora (OPEN) + Chrome (conflict noted)

- Canon basis: titleRotation vibe "Grass starter — fresh sprout".
  species.ts #038: types [GRASS], base stats 50/60/50/40/40/30,
  description "A little plant turtle.", evolves to #039 at level 18.
  Roster #038: elements [Flora, Chrome], tags "grassy plant turtle",
  "sprout shell tortoise", "chrome leaf reptile" — but roster base
  stats here read 55/68/64/45/55/31, which CONFLICTS with species.ts
  (50/60/50/40/40/30). Do not pick a winner here; the cry does not
  depend on which stat line is right, but the conflict is real.
- Element/type: Flora is OPEN per the unification map (plant
  descriptor; candidate Flora -> Earth, alternative keep Flora as a
  13th element breaking the 12; Mars to choose). Roster second
  element Chrome conflicts with species.ts GRASS. Mark as Flora
  (OPEN) / Chrome / Earth (candidate) — unresolved. The cry proposal
  leans on "fresh sprout / plant turtle", not on a settled type.
- Size/personality from sources: little plant turtle. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch mid; timbre soft and
  breezy, a gentle leafy trill; duration ~1.2 seconds; soft attack,
  rustling decay; special character: leaf rustle inside the trill,
  calm rather than sharp.

### 6. Dorowani (#147) — element UNKNOWN

- Canon basis: titleRotation ONLY: dex #147, vibe "Blue water
  starter — tall head fin", primary colour #60a5fa. NOT in
  species.ts. NOT in global_roster.json. Its title card background
  is water (from the title-cards lane), but a card background is not
  a type statement and is not used as one here.
- Element/type: UNKNOWN in canon. The proposal below leans Water
  because titleRotation itself says "blue water starter" — that is a
  proposal inference from the vibe line, NOT a settled type, and
  Mars's type decision for Dorowani is still on the game-wide held
  list (stats/types/evolutions undecided).
- Size/personality from sources: UNKNOWN, except the tall head fin
  visual. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch mid; timbre clear and
  watery, a rising sweep like a fin cutting water; duration ~1.5
  seconds; smooth rising attack, clean watery decay; special
  character: rising water sweep. If Mars types Dorowani differently,
  this proposal should be reworked, not kept.

### 7. Gabu (#148) — element UNKNOWN

- Canon basis: titleRotation ONLY: dex #148, vibe "Teal starter —
  spiky crown", primary colour #2dd4bf. NOT in species.ts. NOT in
  global_roster.json. Its title card background is forest (from the
  title-cards lane), but a card background is not a type statement
  and is not used as one here.
- Element/type: UNKNOWN in canon. No type is proposed from the
  forest card. Mars's type decision for Gabu is still on the
  game-wide held list (stats/types/evolutions undecided).
- Size/personality from sources: UNKNOWN, except the spiky crown
  visual. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch mid; timbre bright and
  spiky, a chirp with a faint metallic ping edge from the crown;
  duration ~1.2 seconds; quick spiky attack, short bright decay;
  special character: crown ping inside the chirp. Element-dependent
  rework applies if Mars types Gabu differently.

### 8. Wispkin (#042) — Umbral

- Canon basis: titleRotation vibe "Ghost — black drop, white cracked
  skull face, black wisp smoke, purple theme (V1 default/base)".
  NOT in species.ts. Roster #042: elements [Umbral], base stats
  40/30/30/60/60/70, tags "floating dark wisp", "shadowy soul ghost",
  "spooky little spirit", evolves to #043 at level 28.
- Element/type: Umbral (settled in roster; species.ts has no entry
  to conflict with it).
- Size/personality from sources: floating wisp; "spooky" and
  "spirit" are roster search tags. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch high; timbre thin and
  airy, a whispering wisp with no words; duration ~1.8 seconds (the
  longest in the set, for the ghost fade); slow attack, long
  whispering decay; special character: whisper, airy and unsettling
  rather than loud, matching the wisp smoke.

### 9. Yogiferno (#046) — Flame / Mythic

- Canon basis: titleRotation vibe "White yeti / gorilla — blue
  tribal markings, fire halo + fire staff". NOT in species.ts.
  Roster #046: elements [Flame, Mythic], base stats
  80/90/70/120/90/110, tags "enlightened inferno deity", "floating
  lava god", "flaming aura mythical master". TitleRotation habitat
  note (for later, not title code): desert (Fire/Ground), forest,
  rain, Safari-type, mountain, snow/ice regions — deeper/later
  regions; snow encounter level/route NOT locked.
- Element/type: Flame + Mythic (roster, settled in the 12).
- Size/personality from sources: scale question, flagged not
  resolved — the title yeti/gorilla visual reads as a large creature,
  and the roster stats (notably 120 special attack, 110 speed) and
  "deity / lava god" tags read as deity-tier, not starter-tier. The
  cry proposal leans big and resonant; if Mars places Yogiferno as
  a regular yeti rather than a deity, the proposal should be scaled
  down, not kept as is.
- PROPOSED cry (proposal, not canon): pitch low; timbre deep and
  resonant, a roar-chant with a fire-crackle edge; duration ~1.8
  seconds; strong swell attack, crackling resonant decay; special
  character: chant-like swell under the roar, tribal rather than
  animal-only, matching the tribal markings.

### 10. Mythar (#331) — Mythic

- Canon basis: titleRotation vibe "Pearl / diamond iridescent —
  sine-wave rings, diamond sparkles", plus the earlier recorded
  description: white iridescent cat, stained-glass wings, gold
  rings. NOT in species.ts. Roster #331: elements [Mythic], base
  stats 100 in every stat (100/100/100/100/100/100), tags "divine
  celestial creator", "glowing ethereal legendary", "almighty
  mythical origin god". Stays in the title pool until Mars says
  otherwise.
- Element/type: Mythic (settled in roster).
- Size/personality from sources: legendary-tier by stats and tags
  ("creator", "origin god"). No personality or voice statement in
  canon beyond that scale. Voice: UNKNOWN.
- PROPOSED cry (proposal, not canon): pitch high; timbre pure and
  crystalline, a sine-like chime; duration ~2.0 seconds (the
  longest in the set, for the legendary ring-out); gentle attack,
  long shimmering decay; special character: a single chime
  arpeggio, celestial rather than melodic, matching the sine-wave
  rings and diamond sparkles.

## Gaps list — what canon does NOT say about these voices

Canon says nothing about any of these creatures' voices, in any
source checked. That is the headline gap, per creature:

- Mochii: no voice, call, or sound word in canon. Only "bounces to
  move" (movement) and the search tag "bloop" (a visual/audio
  search hint, not a cry description).
- Razorgater: no voice in canon. "Chrome jaws" describes the visual,
  not a sound.
- Tyrage: no voice in canon. "Packed earth" describes the body, not
  a sound.
- Kittember: no voice in canon. "Flame paws" and "warm glow"
  describe fire, not a sound. Beast element also OPEN (see above).
- Sproutle: no voice in canon. Flora element OPEN and roster vs
  species.ts stats conflict (see above).
- Dorowani: almost nothing at all in canon beyond dex #147, "blue
  water starter", and a tall head fin. No type, no stats, no
  description sentence, no evolution, no voice.
- Gabu: almost nothing at all in canon beyond dex #148, "teal
  starter", and a spiky crown. No type, no stats, no description
  sentence, no evolution, no voice.
- Wispkin: no voice in canon. "Wisp" and "spirit" describe what it
  is, not what it sounds like.
- Yogiferno: no voice in canon. Scale/deity-vs-yeti question open
  (see above). Habitat list is not a voice.
- Mythar: no voice in canon. Legendary scale is stated (100s, "origin
  god") but no sound, call, or personality beyond that.

Cross-cutting gaps: no source gives a cry length, pitch range, or
timbre for any title creature; no source says whether title cries
should also play in battle, in the lab, or anywhere else (this spec
covers the title press only); no source gives a quality bar (synth
vs recorded vs chiptune-style) for cry production.

## Wiring note — what would eventually be needed (no files created now)

TitleScene's cry gate currently has no Mochiichao audio to gate on
(noted in `src/lib/titleAnimations.ts` itself: the cry gate has no
audio, and the exit currently waits on a documented duration rather
than a finished cry). When audio production is approved, the 10 files
that would be needed — one per pool creature, title press only — are
suggested here with names and a format consistent with the game's
existing audio (boot sounds and title track are WAV:
`public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav`,
`public/audio/mochiichao-boot-M3-mochii-chirp.wav`,
`public/audio/mochiichao-title-v3.wav`):

- `public/audio/cries/mochii-cry.wav` — Mochii
- `public/audio/cries/razorgater-cry.wav` — Razorgater
- `public/audio/cries/tyrage-cry.wav` — Tyrage
- `public/audio/cries/kittember-cry.wav` — Kittember
- `public/audio/cries/sproutle-cry.wav` — Sproutle
- `public/audio/cries/dorowani-cry.wav` — Dorowani
- `public/audio/cries/gabu-cry.wav` — Gabu
- `public/audio/cries/wispkin-cry.wav` — Wispkin
- `public/audio/cries/yogiferno-cry.wav` — Yogiferno
- `public/audio/cries/mythar-cry.wav` — Mythar

Each: WAV, one-shot (loop = false), roughly 1-2 seconds (nominally
1.5 seconds to match the FireRed 90-frame press-cry wait), played on
the title press, followed by the white fade, with the looping title
track underneath unchanged. No files were created by this spec. No
Pokemon cry audio is to be copied, sampled, or used as a base at any
stage — these are original Mochiichao cries or they do not ship.

## What needs Mars's decision before any audio production

1. Spec approval: this whole spec, or per creature, in his words.
   Nothing in "Proposed cry" is canon until he says so.
2. Open elements: Beast for Kittember (drop it and keep Flame, or map
   Beast to Normal) and Flora for Sproutle (map to Earth, or keep
   Flora as a 13th element) — both from the unification map, both
   still open.
3. Dorowani and Gabu in full: type, stats, description, evolution,
   and voice direction. Their proposals above are placeholders built
   from a single vibe line each and should be reworked once he fills
   the canon in.
4. Yogiferno scale: deity-tier (roster stats/tags) or regular yeti
   (title visual)? The proposed cry leans deity-tier and scales down
   if he says otherwise.
5. Mythar's place in the pool: it stays until he says otherwise, and
   its cry is legendary-tier on that basis. If he removes it, its cry
   drops from the set.
6. Scope: title press only, or should these cries also play in
   battle, in the lab, or elsewhere? This spec assumes title press
   only.
7. Production bar: synth, recorded, chiptune-style, or something
   else — and whether he wants to hear raw takes before any wiring.
   Wiring itself (the TitleScene cry gate) is a separate step after
   audio exists; it is not done by this spec.
