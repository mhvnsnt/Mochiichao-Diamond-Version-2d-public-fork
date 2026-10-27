# FIRST START — how the pros start a show, and how Mochiichao starts

Written 2026-10-27 from: the five-series production research
(show/production/research/), the donor-repo production research
(mystery-coast, cape-jones, TRIPPEDD), and the franchise models
below. **The anti-slideshow clause is §3 and it is binding:** a
"pilot" made of stills with pans/zooms and music is not a pilot and
will never be called one again.

---

## 1. How each of them actually does it

### Pokémon — game first, show as the game's second screen
- Creature designs and the world are locked in the **game** first.
  The anime adapts them through standardized **model sheets** so a
  creature looks identical across game, show, and merchandise.
- Episodes are built on a repeatable engine: travel → new creature
  showcased → problem → resolution. The creature-of-the-week IS the
  structure.
- The show exists to extend the game's world — assets flow game →
  show continuously.
→ **Our version:** Mochiichao is already game-first: 47 species,
   model art, cries, title videos, garden poses. The show adapts the
   game — species-of-the-week engine on the garden.

### Persona — identity first, everything branded, anime as adaptation
- Atlus locks **one dominant colour → logo → key font** before
  building anything; the UI *is* the branding (CEDEC 2017).
- The game's design language is so fixed that the TV anime got its
  own **Material Book** (character profiles, props, *background
  designs*) — the anime production works from the game's design kit.
- Menus/screens are **character performances**, not decoration.
→ **Our version:** lock the show's colour/logo/font kit and the
   garden-form palettes first; every title card, menu and trailer
   speaks that kit. Design kit before episodes.

### SpongeBob — the storyboard IS the script
- Writers produce an **outline**; board teams draw the episode from
  it. The creative director's rough-vs-final board videos (public!)
  show the real unit of work: **the board panel**, plussed, timed by
  a timing director, THEN animated (by hand, overseas).
- Nobody animates from a script alone. Boards → animatic timing →
  animation.
→ **Our version:** no episode starts from prose. Beat sheet →
   boards → animatic with timed voices → animate the boards.

### Naruto / DBZ / JoJo — settei first, then genga discipline
- A designer **adapts** the source designs into animation model
  sheets (**settei**) — Nishii (JoJo Part 4): designs checked
  against the source, bodies slimmed/adjusted so they can MOVE.
- Production runs e-konte (board) → layout → **genga** (keys) →
  douga (in-betweens), with supervisor corrections teaching
  consistency. Nothing moves before its settei exists.
→ **Our version:** every cast member gets the 8-part model-sheet
   set (TEMPLATES.md) BEFORE rigging; the rig is built from the
   settei, and the ROM battery is our supervisor-correction step.

### Hanna-Barbera / Scooby — budget is the style, dialogue leads
- The system was designed around a real per-minute budget: animate
  on **2s and 3s**, hold poses, split characters into levels
  (mouth/eyes move on a held body), reuse cycles forever.
- **Voices are recorded first**; animation serves the performance.
  A 6-beat formula carries episodes so a small team can generate a
  season.
→ **Our version:** this is our cost engine — dialogue-first
   (PIPELINE.md), HB timing, formula beat sheets, cycles reused
   across episodes.

### CN Flash/puppet era (Gumball, Foster's) — rigs + file discipline
- Characters are **puppets**: layered parts, mouth/hand/eye symbols,
  built once, animated for years. The filename IS the production
  tracker; versions are never overwritten (Jamar's fla-conventions
  notes).
- Gumball layers mixed media on top of that discipline — the chaos
  is organized underneath.
→ **Our version:** our rig layer (production/rigs/) already follows
   this; build the six puppets once, properly, and EP01 is animated
   with them — not with stills.

### Jamar's own studios (TRIPPEDD / Cape Jones / Wizard Gang)
- Dialogue-first scripts → TTS scratch → phone-timeline edit
  (pocket-studio) → body-replace/render pipelines → **gates**
  (ANIM-GATE, proof stages). Wizard Gang EP01/EP02 exist because
  the pipeline, not inspiration, carried them.
→ **Our version:** we run HIS pipeline pattern, not a new invention.

## 2. The pattern (what ALL of them share)
1. **Kit before episodes** — designs, palettes, model sheets, rigs.
2. **Boards/animatic before animation** — timing is decided on
   paper, with voices, before anyone animates.
3. **Voices before pictures** (or at least before final animation).
4. **A repeatable episode engine** — formula + reusable assets, so
   episode 2 is cheaper than episode 1.
5. **Marketing comes FROM production** — trailers are cut from real
   episode footage and real assets, never manufactured separately
   from stills.

## 3. The anti-slideshow clause (binding definition of done)
A clip counts as show animation ONLY if, at frame level:
- characters **perform**: mouths articulate dialogue (visemes),
  bodies/limbs act with intent, eyes blink/react;
- motion is **drawn/generated/performed** — not a still image being
  panned, zoomed, tilted, or cross-faded;
- holds are **chosen** (HB style), not the absence of animation;
- it passed the **anim gate**: frames sampled and eyeballed, status
  recorded in show/shared/clip-index.json.
Anything else is a placeholder, gets labeled placeholder in the
clip index, and is never presented as a pilot, trailer, or episode.

## 4. Mochiichao EP01 — the actual first start

**Scope (deliberately Pokémon/HB-sized):** ONE episode, ~6 minutes,
6 characters (the pilot six), 3 locations, mostly dialogue
performance (cheap, character-driven) + 2 action beats (where the
motion budget goes).

1. **Identity kit lock (Persona step).** Show colour, logo lockup,
   key font choice, title-card template — from the game's official
   logo + garden-form palettes. One page, locked.
2. **Settei pass (anime step).** 8-part model-sheet sets for the
   pilot six (TEMPLATES.md standard), from the repo's existing
   portraits/variants — proportions checked for movement.
3. **Rig builds (CN puppet step).** Build the six puppets from
   production/rigs/ specs + scaffolds; each must pass its **ROM
   battery + proof frames** (rig gate) before EP01 uses it.
4. **Writing (Pokémon + Scooby step).** Beat sheet on the 6-beat
   formula, species-of-the-week = the episode's featured creature;
   Fountain script; cue sheet.
5. **Voices first (HB step).** Scratch voices via the voice-pipe
   pattern (species cries as voice bases), timed in pocket-studio
   format; Jamar records/replaces finals where he wants.
6. **Animatic (SpongeBob step).** Boards from the script
   (storyboard_sheet.py), animatic_builder timing locked to the
   voice cut. **Gate: animatic reviewed before any animation.**
7. **Animation.** Puppet animation on 2s/3s for dialogue scenes;
   the 2 action beats via body-replace/generative sources finished
   through cleanup + palette-enforce. Backgrounds/props assembled
   from parts-catalog (converted donor pieces + native sets).
8. **Finish + gate (his studio step).** Finish chain → anim gate
   frame-check → clip-index entries with honest quality_status.
9. **Only then:** the trailer is CUT FROM EP01 footage. Marketing
   is a by-product of production, like Pokémon and Persona do it.

**First three work orders, in order:** (1) identity kit one-pager,
(2) Mochii + Dorowani model sheets (the two leads), (3) Dorowani
rig build + ROM proof — the same single-character proof discipline
as the rig standard, before the other four rigs are built.
