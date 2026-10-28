# THE MOCHIICHAO SHOW BIBLE v1

*Everything decided lives here. Everything undecided lives in the
open-items lists — never filled in silently. (House rule, from
Jamar's cape-jones shooting script system.)*

## 1. THE SHOW IN ONE LINE
A new keeper arrives at a garden of creatures in a hyper-future
Japan that runs on care — and beyond the gate, in full daylight,
there is a forest the light doesn't reach.

**Series one-line memo (season shape):** Mochiko learns the
Garden, one creature and one rule at a time, while the Dark Forest
keeps not being looked at.

## 2. THE STACK (what this show is made of — Jamar, 2026-10-27)
- **Pokémon (base):** keeper-and-creatures bond, creature
  showcase, the care loop, journey out from a home base.
- **Digimon:** partners with inner lives and histories; growth is
  mutual — the keeper grows as the creatures do (Seki's law).
- **JoJo's Bizarre Adventure:** art-forward presentation —
  dramatic posing, held tension, menace played straight,
  sound-effect typography as graphics.
- **Persona 5:** hyper-futuristic Japan graphic pop — one
  dominant colour per sequence, stylish title cards, UI as
  performance (identity kit: bible/IDENTITY-KIT.md).
- **Japanese lore & culture:** the Garden's bones — a wisp who
  keeps the night, a forest that behaves like the old stories say
  forests behave. Researched, specific, respectful.
- **Tamagotchi / digicore hyper-pop:** the keeper tech — little
  devices, check-ins, feeding rounds, pixel-cute interfaces. Cute
  is a design system.

## 3. THE WORLD
- **THE GARDEN** — home base. Gate, pond, green, keeper board,
  berry store. Runs on the Manual and its Rules. Warm brand-blue
  world (identity kit palette).
- **THE GATE** — the threshold. Everything crosses here:
  arrivals, introductions, names on the board.
- **THE DARK FOREST** — past where the path gives up. A horror of
  **anticipation in daylight**: the sun is up; the forest floor is
  in night anyway. No birdsong from inside it. Dread by stillness,
  never by gore. What stopped moving in there in EP01 is an OPEN
  ITEM (see §9) — it is not decided, and it will not be invented
  quietly.
- **THE WIDER WORLD (hyper-future Japan)** — exists beyond the
  Garden (the game's world: towns, dojo, arena). Enters the show
  as the keeper tech, visitors, and journeys out. Detail level:
  bible grows it per season grid, Pokémon-style.

## 4. THE CAST
| Character | Kind | Sound (law: §5) | Function |
|---|---|---|---|
| MOCHIKO | Human, 12, new keeper | The only word-voice | Audience anchor; reads the Manual aloud |
| MOCHII | Creature — round blue drop | Bouncing squeak-cry | Welcome, speed, joy; the Garden's heartbeat |
| DOROWANI | Creature — bipedal amphibian, red fin cheeks, shell | Low steady croak | Steady hand; carries the Manual; thesis keeper |
| GABU | Creature — long-armed turtle bruiser | Foghorn bellow | Confidence without plans; the muscle; comedy engine |
| KITTEMBER | Creature — black cat, flame ON THE TAIL TIP (attached, owner canon) | Thin mewl | Sensor; the tail flame reacts before anyone sees |
| SPROUTLE | Creature — plant biped | Soft chirps | Noticer; reads the ground; gentle courage |
| WISPKIN | Creature — dark wisp over smoke, wears a SKULL MASK (owner canon) | Whisper-wail | Night keeper; the Garden's secret shift; EP01's heart. Pre-mask Wispkin appears in flashback only (approved asset: show/assets/flashback/) |

Full roster: 47 species (cast.json; species.json) + human cast
(docs/human-characters/). **Digimon rotation law:** featured
sequences distribute evenly across the cast across a season; the
featured species is fixed at planning (Pokémon meeting rule) and
tracked in the season grid.

## 5. THE LAWS (locked 2026-10-27)
1. **Voice law:** creatures = pure cries and sounds only. No
   words. No name-saying. Emotion is performance + sound.
2. **Subtitle law:** subtitles are silent-film intertitles —
   they appear ONLY at certain important moments to carry a
   creature's meaning, then vanish. Rationed hard.
3. **Rule 12 (the thesis, Jamar's exact wording):**
   *"Everything in the garden belongs to somebody... And
   everybody belongs to the Garden."* — warm over the Garden,
   a warning over the Dark Forest. The show's promise and its
   threat are the same sentence.
4. **Construction-kit law:** WORKING-METHOD.md governs all
   borrowed material (no donor characters, names, logos).
5. **Writing law:** WRITING-STANDARD.md — Jamar's house system:
   rules first, canon-sourced beats, open items never silently
   filled, gags are mechanisms, silence is a tool, line economy.
6. **Animation law:** FIRST-START.md §3 — only frame-verified
   real performance counts as animation. No slideshows, ever.
7. **LIKENESS LAW (Jamar, 2026-10-27 — learned from the avatar):**
   every character is built from the character's ACTUAL image
   already in this repo — the way the owner's avatar was built
   from the picture he sent, candidates generated off that exact
   image. NEVER invent a likeness from a text description.
   Generative work takes the repo art file as its image source
   and must preserve the likeness and the art style of that
   source. **Likeness gate:** before any generated character
   asset is used or shipped, frames are checked against the
   character's model sheet — same character, same style, or it
   is rejected and does not enter the repo. (Rejected under this
   law, 2026-10-27: the glossy-3D gen-pilot2 batch — Mochii/Gabu/
   Kittember/Sproutle/Wispkin clips that drifted off-model. They
   were never pushed to this repo.)

8. **BATTLE DOCTRINE — AUTONOMOUS-ACTION MODEL (Jamar,
   2026-10-27):** in the SHOW, Mochi fight with their own
   agency. A battle is a continuous living fight — creatures
   do not stand idle waiting to be told each move. Rangers
   sometimes command and direct, but the fight runs between
   commands and without them: a battle is alive between its
   decisive beats. (The GAME lane runs the mirror doctrine —
   command-driven battles where between-command action is
   non-scoring presentation: docs/arena-battle-presentation-
   spec.md §9.) **Term — CLOSED (owner lock, 2026-10-27):**
   the canon name for the human who commands in battle is
   RANGERS. Game data's display wording was "trainers";
   "keeper" is the Garden role only. Structural ids
   (role:"trainer", trainer_*) are unchanged — this lock
   is display/canon text (§9, item 7, closed).

9. **THE SECRET (Jamar, 2026-10-27 — a production-layer truth,
   never an in-world fact):** the world is a computer that grew
   a wilderness. NO inhabitant knows this. Professor Aeon knows
   secretly: he may slip and say "the Mainframe," then correct
   himself to "the mainland" — **"the mainland" is the cover
   word**, and the slip-and-correction is the only shape in
   which the truth may surface in a script. Luigi has a hint,
   not knowledge: he may circle it, never state it. Villain
   hacker-speak is double-layered dramatic irony — villains may
   speak the Secret's vocabulary openly, because in-world
   listeners hear only mundane tech talk, and no ordinary
   character may ever decode the second layer. Production
   documents (this Bible) may hold the truth; in-world
   artifacts — place names, signs, dialogue — must not betray
   it. That is why the region reads IRIDESCENCE on every map
   and sign, whatever it is called in this room.

10. **TWO-LANE CONSISTENCY LAW (Jamar, 2026-10-27):** every
   canon change applies in BOTH lanes — the game data and the
   show data. Names, settings, doctrines: a ruling made in one
   lane is a ruling in the other, applied everywhere it
   appears, in the same terms. (Display names change; internal
   ids/keys stay stable, so wiring cannot break.) Neither lane
   may quietly keep a name or rule the other lane has
   superseded.

## 6. THE EPISODE ENGINE
Pokémon showcase × 6-beat garden formula (mystery-heart):
1. Arrival/errand at the Gate 2. The oddity 3. Investigation
(care-loop tools: feeding, checking, the Manual) 4. False scare
5. Reveal — the creature was never the problem 6. Resolution:
a name on the board, a rule learned + tag (gag mechanism).
**Slot shape (pilot format):** cold open at the Gate → title card
(Persona pop, identity-kit layout) → A-part → eyecatch (keeper
device check-in) → B-part → tag → STINGER (the Forest, when the
season calls for it).

## 7. VISUAL IDENTITY
IDENTITY-KIT.md + identity-kit.json: official logo (never
redrawn), palette SAMPLED from the real art (brand blues,
Dorowani #30b0d0/#d0f0f0, accent red #a03436 for fins/eyes/
alerts only), Bungee display + Fredoka text (already in repo),
one dominant colour per sequence, title-card layout fixed.

## 8. PRODUCTION METHOD
EPISODE-PLANNING-METHOD.md (researched): one-line memo → beat
sheet (Jamar approves direction) → shooting script (house
format) → e-konte-discipline boards (cuts, seconds, BANK marks)
→ **board pitch gate** → voices + animatic lock → production
(PIPELINE.md) → anim gate → clip index. Characters are made with
the avatar full stack + puppet rigs (Jamar's standing order).

## 9. OPEN ITEMS (never filled in silently)
1. What stopped moving in the Dark Forest (EP01 stinger).
2. Mochiko's voice casting (Jamar records? cast? TBD).
3. Season length + episode runtime beyond the pilot format.
4. The Forest's name in-world (if it has one).
5. Keeper device design (digicore unit) — bible art pass.
6. Whether the Manual's other Rules get written before EP02.
7. CLOSED (owner lock, 2026-10-27): the canon term for the
   human who commands in battle is RANGERS (game data said
   "trainers"; the Garden role is "keeper").

## THE ESSENCE (owner law, 2026-10-27)

Mochiichao — the game and the show — is at its heart and soul an OPEN-WORLD RPG universe, deeper and more open than a Pokemon game, even though it is built on the Pokemon base. Its heart, soul, and mechanics are kin to Fallout, Skyrim, Persona 5, Grand Theft Auto, Red Dead Redemption, Pokemon, Dragon Ball Z: Buu's Fury, and JoJo's Bizarre Adventure. It is one whole world and universe that gets created and can be explored through the show, or the game, or both. The Pokemon-base rule says how systems work; this law says what kind of thing we are making. When a scope or design choice makes the world smaller, more corridor-like, or shallower than that statement, the choice is wrong by default and the open-world reading wins.
