# MOCHIICHAO SHOW — LIGHTING SYSTEM (draft v1)

**Status:** DRAFT for owner review. Built 2026-10-27 from the owner's own
lighting canon (cape-jones + Mochiichao UI-art docs) as the spine, with
published secondary research cited inline.
**Wires into:** `show/bible/COLOR-SYSTEM.md` (sibling — Colour System v2),
`show/production/ENVIRONMENT-AND-CAMERA.md`, `show/production/UNIFIED-PIPELINE.md`
(composite stage), `show/bible/DESIGN-PRINCIPLES.md`, `show/production/POSING-SYSTEM.md`.
**Canon honoured throughout:** Kittember's flame sits on the **tail tip**;
Wispkin wears the **skull mask**; accent red is **#a03436** and quarantined;
creatures vocalise in **cries only** — lighting never has to "act" dialogue
for them, it *stages* the cries.

---

## 0. THE SPINE — THE OWNER'S SEVEN LAWS, CARRIED OVER

These are not research findings. They are Jamar's own lighting philosophy,
already written down in his cape-jones and Mochiichao repos. The Mochiichao
Lighting System **adopts them as law** and translates them to the garden.
Original sources: cape-jones `docs/lighting/COLOR-GRADES.md`,
`docs/lighting/DYNAMIC-RIM-BLASTER-LIGHTING.md`, `docs/lighting/LED-CONTROLLER.md`,
`3d-assets/living-room/lighting/LIGHTING-RIG.md`; Mochiichao
`docs/ui-art/day-night-activation-overlay-spec-20261027.md`,
`day-night-menu-variants.json`, `palette-lint-note.md`.

- **L1 — Grades are built from the model sheets around a LOCKED palette.**
  A scene's grade is derived from the characters in it, not imposed on them.
  Protected identity colours are **never tinted by environment colour** — the
  cape-jones model-sheet law: the white suit stays #FFFFFF, blown out, in
  every signature grade. In Mochiichao the protected set is each species'
  Colour System v2 slots (Dominant / Support / Accent / Ink #101010).
- **L2 — Rim light is SITUATIONAL.** Rim is motivated by the scene — blue/cyan
  in space/void, LED colour in LED scenes, blast colour while a blaster
  fires. Its one non-negotiable job: **dark costume elements stay readable
  in dark settings.** Rim is never decoration; it is a readability tool
  with a story excuse.
- **L3 — TAKEOVER SOURCES.** An active light source (a firing blaster in
  cape-jones) **becomes the scene lighting while it is active**: it creates
  the rim, throws colour into the environment, drives the shot's grade, and
  releases when it stops. Every source colour carries its own lighting
  "personality" preset.
- **L4 — Named grade FAMILIES with use-when rules.** Signature grades
  (day / night / trippy), colour families (royal / ocean / ember / gold /
  ghost), and expressive outside grades — cape-jones' own doc names the
  non-naturalistic ones as written **"in the Ed, Edd n Eddy spirit"**:
  Noir (near-B&W, one colour retained), Acid Candy (hyper-saturated
  emotional colour), Storm (desaturated tension). A grade is chosen by
  name, from the family, for a stated reason.
- **L5 — Lighting is the signature device.** Owner's stated philosophy
  (2026-10-17 canon): Chowder made patterned texture its signature visual
  language; Cape Jones makes **dynamic coloured lighting** its signature.
  Carried into Mochiichao: the garden show's signature is not a filter —
  it is **light that behaves**: motivated, coloured, and allowed to take
  over the scene.
- **L6 — Animated lighting systems ship with STATIC REFERENCE LOOKS.**
  Cape Jones' LED presets are animated systems, and each has a still
  reference look for boards and thumbnails. Every animated lighting
  behaviour in Mochiichao (a shift, a takeover, a cycle) must likewise
  have a boardable still: first frame, peak frame, released frame.
- **L7 — Shifts are an OVERLAY, never a repaint.** From the Mochiichao
  day/night activation spec: day/night is an **overlay layer** — the cycle
  modulates any theme without touching it; turning it off returns the base
  exactly; gradual transitions are a first-class parameter; tint is a
  separable control. **Base = canon, shift = layer.** This is the technical
  form of every colour-shift rule in §3.

---

## 1. SECONDARY RESEARCH — WHAT THE REFERENCE SHOWS PROVE

### 1.1 JoJo's Bizarre Adventure — scene-specific colouring, staged as light

Director Naokatsu Tsuda, on the record: anime normally locks a colour
setting once established, and JoJo's manga has **no set colours** for much
of anything — so David Production adopted **scene-specific colouring**,
letting the "set colour" change "depending on the specifics of the scene"
precisely to stay faithful to a source that never fixed its palette
(Anime News Network, "Interview: JoJo's Bizarre Adventure Director
Naokatsu Tsuda," 2015 —
https://fast.animenewsnetwork.com/feature/2015-07-16/interview-jojo-bizarre-adventure-director-naokatsu-tsuda/.90413).
The A.V. Club's production history names the device **"special scene
coloring"** and notes where it lands: "moments of emotional significance"
— e.g. Dio's entrance staged against a full moon rendered in an
impossible vibrant pink
(https://www.avclub.com/jojos-bizarre-adventure-anime-history-manga-adaptation-davidpro).
Two production facts matter for us:

1. The shift is **scene-wide and instantaneous** — sky, background, and
   mood re-key together. It reads as the *light of the world changing*,
   not as characters being repainted, because the environment leads and
   the characters are graded *inside* it.
2. It is **rationed**. It marks emotional peaks; used constantly it would
   mean nothing. (Design Principles already rations JoJo palette-shifts
   to 2 per segment — §3 inherits that ration.)

### 1.2 Araki — the no-fixed-canon doctrine

Araki has stated it outright in his 25th-anniversary long interview:
**"JoJo does not have a fixed color"** — cover illustrations deliberately
recolour characters (blond Giorno drawn silver-haired) because the colour
is chosen per-image for the feeling it produces, with pink × sky-blue
named as a favourite "invincible" combination (interview as summarised at
https://en.namu.wiki/w/%EC%95%84%EB%9D%BC%ED%82%A4%20%ED%9E%88%EB%A1%9C%ED%9E%88%EC%BD%94).
The doctrine's fine print, often missed: there is no canonical colour
*scheme*, but a few identity anchors (e.g. DIO's hair) stay fixed — the
freedom is in the **field**, the discipline is in the **anchor**
(https://www.cbr.com/jojos-bizarre-adventure-misconceptions-debunked/).
That is exactly L1 + L7 in combination: Mochiichao runs it *stricter*
than JoJo — the species anchors are never freed — but JoJo proves a
production can hold character identity while the world's colour swings
wildly around it, provided the anchors and silhouettes hold.

### 1.3 Ed, Edd n Eddy — expressive colour, per-scene re-keying

The owner's own grade doc names Ed, Edd n Eddy as the spirit of the
expressive outside grades; the show's actual practice backs him up:

- Colour was a **staffed design discipline**, not an afterthought:
  episodes credit a dedicated **Colour Design** role (Bonni Reid) and
  **Colour Styling** (Ginny Ivanicki) alongside watercolour-textured
  painted backgrounds (credits, e.g.
  https://superlogos.fandom.com/wiki/Ed,_Edd_n_Eddy:_Out_with_the_Old..._in_with_the_Ed_Credits).
- The show was the last major cel-animated series (painted cels through
  season 4), with Antonucci's deliberate "wobble"/boiling-line kept even
  into digital colour — an expressive, hand-made surface that colour
  rides on top of (https://warnerbros.fandom.com/wiki/Ed,_Edd_n_Eddy).
- Colour **re-keys per scene and per emotional register** rather than
  obeying naturalism: the *Big Picture Show* finale visibly walks its
  palette from bright sunny cul-de-sac → washed-out dusty trail → dark
  neon-lit trailer park as a map of the protagonist's mental state
  (https://diffsense.com/ed-edd-n-eddys-big-picture-show-why-the-cul-de-sacs-grand-finale-still-hits-different-1s2l).

Lesson for the system: EEnE's chaos is safe because **hue is free but
value is disciplined** — the same split Colour System v2 found. Lighting
is where that split is enforced in Mochiichao (§2, LS-4).

### 1.4 Pokémon (anime) — staging light and the attack takeover

Two documented habits of the Pokémon anime translate directly:

- **Time-of-day staging is carried by the background grade.** Day, dusk
  and night versions of a location are painted/graded as distinct keys,
  and scenes are staged against them; from the *Advanced Generation* era
  the series also brightened its overall palette and moved move-effects
  to CG — the attacking body part **glows** to mark the active element,
  a deliberate readability device ("you are here" for the eye)
  (Bulbapedia production notes, AG105 —
  https://bulbapedia.bulbagarden.net/wiki/?title=AG105&oldid=3381509;
  glow convention discussed at
  https://forums.serebii.net/threads/attacks-that-didnt-satisfy-you.375398/page-4).
- **An active move lights the scene.** Energy attacks are composited with
  bloom and cast colour onto the immediate environment while they fire —
  the exact behaviour of L3's blaster law, in a creature show. The
  garden translation: a creature's signature effect in action is a
  takeover source (§4), never just a sticker on top of the frame.

### 1.5 Digimon — evolution light: the world yields to the event

Digivolution sequences are the franchise's signature set-piece, and
their lighting grammar is consistent across eras: the environment falls
away or darkens, the evolving partner becomes the **light source of the
sequence** (radiant body light, light columns, saturated colour fields),
and normal scene lighting only returns when the new form is revealed —
with *Tamers* animating the transformation part-by-part under "vibrant
use of lighting effects" and the films leaning on flashing light and
intricate detail to make each evolution "feel epic and important"
(https://the-artifice.com/digimon-analyzing-franchise/;
https://thediplomariot.com/blog/digimon-adventure-02-hurricane-touchdown-a-nostalgic-review-1764809590).
Note the structural identity with L3: **evolution is a takeover source
with a personality preset** — each line/stage has its own light colour
and behaviour, and the takeover *is* the drama. Mochiichao has no
evolution set-pieces in EP01, but the grammar governs any bond/growth
moment and the Wispkin reveal (§6): the world dims so the event can glow.

### 1.6 Animation lighting theory — the grammar underneath

The classical grammar, translated to 2D (standard cinematography/lighting
references: https://fiveable.me/cinematography/unit-8;
https://www.numberanalytics.com/blog/art-of-motivated-lighting-cinematography):

- **Key / fill / rim.** Key = the dominant motivated source, sets shadow
  direction and mood. Fill = ratio control: high-key (low ratio) reads
  bright, safe, comic; low-key (high ratio) reads tense, mysterious.
  Rim/back = separation from background — in 2D this is a *drawn/composited
  edge light*, and it is the cheapest readability tool in dark scenes
  (L2's non-negotiable job).
- **Motivated light.** Every strong light should have a visible or
  implied source in the world (sun, lamp, flame, screen glow). Unmotivated
  colour is reserved for declared expressive grades (L4) — the audience
  forgives any colour that has an excuse, and notices colour that doesn't.
- **Value staging under colour.** The eye reads value first. A scene
  whose value pattern works in greyscale survives any grade; a scene
  that only works in colour breaks under the first shift. Hence LS-4.
- **Colour temperature as time/mood.** Warm (≈2700–3200K feel) = comfort,
  intimacy, late day; neutral daylight = honesty, morning; cool
  (≈5600–6500K feel) = distance, night, unease. Temperature is the
  fastest legible clock a scene has — the system uses it as the primary
  time-of-day signal (§2), ahead of sky colour.

---

## 2. THE SYSTEM (a) — LAWS TRANSLATED TO THE GARDEN

Numbered rules. "Protected" always means the Colour System v2 slots.

- **LS-1 (Grades from sheets).** Every lighting key in §3 is specified
  against the model sheets of the cast in the scene. If a key would tint
  a protected colour, the key is wrong, not the character.
- **LS-2 (Environment colour lives on rims + atmosphere only).**
  Environment colour may touch: rim lights, atmospheric haze/glow,
  background plates, reflections, and shadow colour. It may **never**
  re-hue a character's flat fills. The white of Wispkin's skull mask is
  the garden's #FFFFFF law: the mask reads mask-white in every grade,
  blown toward the key's brightness but never dyed by it.
- **LS-3 (Rim is hired per scene, and always on night duty).** Each
  lighting sheet names its rim colour and its motivation. In any
  night/dusk key, rim is **mandatory** on dark-bodied cast (Kittember,
  Wispkin's smoke body) — that is L2's readability job, and it is a gate
  item (§7), not a taste call.
- **LS-4 (Value first).** Every key must pass a greyscale check: cast
  silhouettes separate from background, the scene's focal value pattern
  intact. Colour may go anywhere the value pattern survives.
- **LS-5 (One motivated key per shot).** A shot has one key source with a
  story excuse. A second strong source enters only as a takeover (§4)
  or a declared expressive grade (L4).
- **LS-6 (Temperature tells the time).** Time-of-day is keyed primarily
  by temperature + key angle + ratio, in that order. Sky colour follows,
  never leads.
- **LS-7 (Shifts are overlays — L7 enforced).** No lighting state in this
  system is a repaint. Implementation: grade/overlay passes in the
  composite stage (UNIFIED-PIPELINE), parameterised (tint, ratio, rim
  colour, atmosphere), removable to base exactly.
- **LS-8 (Signature = behaviour).** Per L5: at least once per episode, a
  motivated source must visibly *behave* — take over, shift, or refuse
  (§6 stinger) — so the audience learns that light is this show's
  signature device. EP01 spends its signature beats on the tail flame,
  the cold spot, and the Forest's refusal.

## 3. THE SYSTEM (b) — LIGHTING KEYS (LOCATION × TIME)

Named keys. Format: **Key name — key source / fill & ratio / rim /
temperature feel / grade family (L4)**. Boards cite the key name;
thumbnails are drawn to the key's static reference look (L6).

### Garden Gate
- **GATE-MORNING "First Bell"** — Key: low warm sun, screen-left /
  Fill: bright sky bounce, low ratio (high-key) / Rim: pale gold on
  edges facing the lane / Temp: warm-neutral, ≈morning / Grade:
  Signature Day. *The show's home key: honest, welcoming, everything
  readable.*
- **GATE-DAY "Keeper's Noon"** — Key: high sun / Fill: full, flattest
  ratio of the system / Rim: minimal sky rim / Temp: neutral daylight /
  Grade: Signature Day. *Errands, exposition, comedy at full read.*
- **GATE-DUSK "Last Errand"** — Key: low amber sun, long shadows /
  Fill: thinning, ratio rising / Rim: warm orange edge / Temp: warm
  deep (≈3200K feel) / Grade: Signature Day → Ember family edge.
  *Things still undone; the day is spending itself.*
- **GATE-NIGHT "Board Light"** — Key: the keeper-board lamp / gate
  lantern (practical, motivated) / Fill: faint cool ambient, high ratio
  / Rim: cool blue-silver, mandatory on dark cast (LS-3) / Temp: cool
  field + one warm practical / Grade: Signature Night. *The garden after
  hours belongs to the night shift.*

### Pond
- **POND-MORNING "Flat Water"** — Key: open sky / Fill: water bounce
  from below (fill direction inverted — the Pond's party trick) / Rim:
  white sparkle rim on wet edges / Temp: neutral-cool / Grade: Ocean
  family, lightest step.
- **POND-DAY "Ripple Key"** — Key: sun + moving caustic bounce / Fill:
  water / Rim: bright, broken (caustic) rim on anything at the surface
  line / Temp: neutral / Grade: Ocean. *Comedy and splashes; the water
  co-lights every shot (motivated — LS-5 exception logged: the Pond
  itself is a standing source).*
- **POND-DUSK "Stakeout"** — Key: last amber band at the horizon /
  Fill: dropping fast, ratio high / Rim: cold blue rim strengthening as
  the warm key dies — **the rim changes employer mid-scene**, from sun
  to dusk / Temp: warm→cool crossfade (gradual overlay, L7) / Grade:
  Storm family at low strength. *Built for EP01's dusk stakeout (§6):
  the crossfade IS the tension clock.*
- **POND-NIGHT "Cold Mirror"** — Key: moon / Fill: near none / Rim:
  silver-blue, mandatory / Temp: cool / Grade: Ghost family, light step.
  *Still water doubles every lit thing; reflections are motivated
  sources (§4).*

### The Green
- **GREEN-DAY "Canopy Dapple"** — Key: sun through canopy — dappled,
  broken key / Fill: green atmosphere bounce (atmosphere only, LS-2 —
  never on fills) / Rim: leaf-edge yellow-green / Temp: warm-neutral /
  Grade: Signature Day with Ocean-green lean. *The garden at play.*
- **GREEN-DUSK "Long Grass"** — Key: raking low sun through grass /
  Fill: low / Rim: gold / Temp: warm / Grade: Gold family, light step.
- **GREEN-NIGHT "Firefly Ledger"** — Key: none standing — fireflies and
  keeper tech are the only motivated sources, all takeover-class (§4) /
  Fill: minimal cool / Rim: cool silver / Temp: cool / Grade: Signature
  Night. *A location lit entirely by events.*

### Dark Forest
- **FOREST-DAY "Refusal"** — Key: **none admitted.** Daylight exists
  outside the tree line and does not reach in (locked EP01 stinger) /
  Fill: flat, directionless, low / Rim: **withheld** — the one location
  where LS-3's night-duty rim is refused, so forms at the tree line
  lose their edges / Temp: cool-neutral, desaturated / Grade: Storm
  family pushed toward Noir, but holding full colour at low saturation
  (it is *day* — that's the horror). *See §6: this key is the system's
  one lighting-by-refusal.*
- **FOREST-NIGHT "No Key"** — Not a working key. The Forest at night is
  not lit, staged, or entered in EP01; the key exists in the table so
  that its absence is a decision, not an oversight. Future use requires
  owner sign-off (open item, never filled silently).

## 4. THE SYSTEM (c) — COLOUR-SHIFT PROTOCOL (JOJO, AS LIGHT)

JoJo shifts enter Mochiichao **only as lighting events** — overlay-layer
changes in composite (LS-7), never repaints, never touching protected
slots (LS-1/LS-2). This is the stricter-than-JoJo bargain of §1.2:
JoJo frees the field *and* the character; Mochiichao frees the field
and **holds the character**.

- **CS-1 (What may shift).** Sky and background plates, atmosphere,
  shadow colour, rim colour, temperature, ratio, and grade family.
  In short: everything that is *light* in the scene.
- **CS-2 (What may never shift).** Protected identity colours (all four
  slots, all species present), the accent-red quarantine (#a03436 is
  never produced, duplicated, or approximated by a shift), subtitle-card
  colours (#d0f0f0 family per Colour System v2), and silhouette values
  (LS-4 must still pass at every point of the shift).
- **CS-3 (Triggers — closed list).** A shift fires only on: (i) a
  **reveal** (a presence enters the story's knowledge — Wispkin class);
  (ii) **menace** (threat registered by a character, not just the
  audience); (iii) an **emotion turn on a held pose** (POSING-SYSTEM:
  shifts land on holds, never mid-gesture); (iv) a **takeover source**
  igniting or releasing (§5 — a takeover is a shift with a motivation).
  No decorative shifts.
- **CS-4 (Transition grammar).** Two legal moves:
  - **HARD SHIFT** — cut or 2–4 frame snap, JoJo grammar. For reveals
    and menace. The world is different *now*.
  - **GRADUAL SHIFT** — overlay-parameter ramp over ≥ 2 seconds, the
    day/night spec's first-class gradual transition (L7). For time
    passing, emotion settling, takeovers warming up/releasing.
  Mid-scene repaints, drifting unmotivated hue wander, and shift-on-a-
  whim are all illegal.
- **CS-5 (Ration).** Max **2 hard shifts per segment** (inherited from
  Design Principles), each logged on the lighting sheet with its CS-3
  trigger. Gradual shifts tied to time-of-day keys are not rationed —
  they are the clock (LS-6), not punctuation.
- **CS-6 (Return).** Every shift names its **release**: the frame/state
  where the base key resumes. A shift without a release is a new key and
  must be re-boarded as one.

## 5. THE SYSTEM (d) — TAKEOVER SOURCES IN THE GARDEN

Per L3, each takeover source has a **personality preset**: colour, rim
behaviour, environment throw, grade push, ignition/release shape. While
a takeover is active it is the shot's key (LS-5) and the standing key
steps down to fill.

- **TK-1 — Kittember's tail flame (the garden's blaster).** Source: the
  flame on the **tail tip** — position matters: the light lives at tail
  height and moves when the tail moves, so the rim it throws is
  kinetic. Personality: warm orange key-colour; rim = flame-orange on
  facing edges; environment throw = warm pool on ground/foliage within
  a short radius, flickering at flame rhythm; grade push = Ember family,
  strength ∝ flame size. Ignition: snap (alarm) or ramp (calm).
  Release: flame shrinks, grade steps back over ~12 frames. **Canon
  check: the flame is never detached, never duplicated, never a
  free-floating orb** — a detached flame is a design-gate failure
  (Colour System v2) and here a lighting-gate failure too: an unmotivated
  floating source breaks LS-5.
- **TK-2 — Wispkin cold spots (light subtraction).** The system's only
  **negative source**: where Wispkin's chill sits, key light *dies* —
  local desaturation + value drop + rim extinction in a soft radius,
  drifting with the smoke. Personality: no colour of its own (it removes
  colour); grade push = Ghost family wherever it passes. It is how the
  audience *sees* a presence the cast can't: the light goes wrong.
  Mask note: the skull mask stays mask-white (LS-2) even inside a cold
  spot — the white floats in the dimming, which is the scare *and* the
  readability save.
- **TK-3 — Keeper-device glow.** Source: Mochiko's keeper tech
  (Persona-grammared product line, Design Principles). Personality:
  cool cyan-white, screen-flat light (it lights like a display, not a
  flame — hard-edged pool, no flicker); rim = cyan on the hand/device
  side only; grade push = minimal (it is a tool, not a mood). Statuses
  stay triple-coded per Colour System v2 — the glow never carries
  meaning by colour alone. Device warnings in orange, never #a03436.
- **TK-4 — Pond reflections.** Source: the water surface under
  POND-DAY/NIGHT keys. Personality: the standing key, doubled and
  broken — rim from below, moving caustic throw on bellies and banks.
  A reflection may act as a *secondary* motivated source (LS-5 logged
  exception, Pond only) but may never out-key the sky.
- **TK-5 — Rule burn-in (subtitle-class takeover).** The Rule 12 burn-in
  is staged as a lighting event: the card's red-on-ink arrives like a
  source igniting — the frame's grade dips toward the card, everything
  else steps down. The only takeover allowed to use #a03436, because it
  *is* the accent's home (Colour System v2 §g). See §6 stinger.
- **TK-6 — Growth/bond light (reserved).** Digimon grammar (§1.5),
  banked for growth/bond beats in later episodes: world yields (standing
  key dims 40–60%), partner becomes the source with their own preset.
  Not used in EP01; defined now so its first use is a system, not an
  invention.

## 6. THE SYSTEM (e) — LUSTRE / VARIANT BEHAVIOUR UNDER LIGHT

Colour System v2's **Lustre Law** governs what a colourway *is*; this
section governs what light may do to it. The two never negotiate: if a
lighting idea requires breaking the Lustre Law, the lighting idea dies.

- **LV-1 (Overlay may modulate: value, temperature feel, sheen).**
  A lighting overlay may raise/lower a lustre form's values, warm or
  cool its *rendered feel* via rim and atmosphere (LS-2 channels only),
  and drive its sheen. It may not re-hue its fills — same LS-1 lock as
  base forms. A lustre Dorowani under GATE-NIGHT is still the deep-blue
  colourway, rimmed silver; it does not become base-blue "because night."
- **LV-2 (Locked through light, restated for variants).** Under any key
  or shift: accent **placement** never moves, **eye-colour family**
  never changes, **ink** is never touched, the species' colour filing
  never changes, and the colourway never varies per individual. A
  lighting pass that produces any of these is a gate failure regardless
  of how good it looks.
- **LV-3 (Sheen is the lustre signature under light).** What light is
  *for*, on a lustre form, is sheen: a moving specular band keyed to the
  standing key's direction, rendered on the overlay layer (so it obeys
  L7 — remove the layer, the colourway is untouched). Sheen intensity
  scales with key hardness: full under GATE-DAY / POND-DAY, a single
  rim-sheen under night keys, **absent in the Dark Forest** (no admitted
  key, no sheen — lustre forms at the tree line read matte and wrong,
  by design).
- **LV-4 (Iridescence discipline).** Lustre sheen may borrow **one**
  neighbouring hue at its edge (the colourway's own neighbour on the
  wheel — e.g. deep-blue borrowing violet at the rim of the sheen band).
  It may never borrow the accent hue of another cast member present, and
  never anything in the #a03436 quarantine zone. Iridescence is a rim
  phenomenon only; a lustre fill that rainbows is a failure, not a
  feature.
- **LV-5 (Variants at night).** Night keys are where colourways go to
  die in lesser systems; here: rim obligation *increases* for lustre
  forms (LS-3 plus sheen-rim), because their identity is carried more
  by value-and-sheen contrast than by hue at low light. Board check:
  a lustre form at night must be identifiable in greyscale by
  silhouette + sheen placement alone (LS-4, variant clause).
- **LV-6 (Shifts treat variants as cast, not as scenery).** A CS-shift
  may swing the world around a lustre form exactly as around a base
  form — field free, anchor held (§1.2). The sheen band re-keys with
  the shift's temperature; the colourway does not.

## 7. THE SYSTEM (f) — EP01 LIGHTING PLOT (locked script)

Episode: EP01 "The Garden Has a Ghost" (EP01-SHOOTING-SCRIPT-v2, LOCKED).
Colour script: Colour System v2 §e (saturation drain across beats,
stinger at high value / ~0 saturation, red the only saturated pixel).
This plot is that script's lighting half. Signature-beat spend (LS-8):
tail flame, cold spot, Forest refusal.

| # | Scene / beat | Key | Shifts & takeovers | Protected / notes |
|---|---|---|---|---|
| 1 | **Gate, morning — keeper arrives** | GATE-MORNING "First Bell" | None. The home key at full honesty; the audience learns the base so every later deviation reads. | All slots at sheet values. Mochii's blue is the scene's coolest note against warm key. |
| 2 | **Gate — the cast assembles; first wrong details** (things moved, cold patch) | GATE-MORNING, ratio creeping up (fill quietly thinning) | **TK-2 cold spot, first pass** — a soft wrongness at frame edge: values dip, rim dies locally, nobody on screen notices yet. No grade change — restraint is the tell. | Mask-white n/a (Wispkin unseen). The cold spot removes colour; it adds none (TK-2). |
| 3 | **Pond tour** | POND-MORNING → POND-DAY "Ripple Key" | Water co-light throughout (TK-4 standing exception). One playful TK-4 beat: a reflection *leads* a gag (a "second" creature in the water that isn't there when looked at directly — mystery engine, played as comedy). | Ocean family at lightest step; saturation still near full — the drain (Colour §e) has barely begun. |
| 4 | **Green — work and worry; the haunting escalates** | GREEN-DAY "Canopy Dapple" | **TK-1 tail flame, first ignition (snap)** — Kittember's flame flares at something unseen: for ~1 second the flame is the warmest source in frame and rims the grass; releases over 12 frames. First hard punctuation of the episode. | Flame on tail tip, attached, always (TK-1 canon check). #a03436 not approached — flame orange is its own hue, quarantined from the red. |
| 5 | **Pond, dusk stakeout** | POND-DUSK "Stakeout" | **Gradual shift (CS-4)** runs the whole scene: warm→cool crossfade, rim changes employer from sun to dusk. Two **TK-2 cold-spot passes**, stronger — one crosses close enough to kill the rim on a foreground plant. **TK-3 device glow** for the log check (3:12 AM clue): brief, flat, cyan — a tool's light in a scene of dying natural light. | Value staging carries the scene (LS-4 checked at plot stage): five heads in a line against the last horizon band. Saturation measurably lower than Beat 3 (Colour §e drain). |
| 6 | **The reveal — Wispkin** | POND-DUSK tail → local night | **HARD SHIFT (CS-3i, reveal)** on the held pose: the world drops a value step and cools; then **TK-2 inverts** — the cold spot stops subtracting and *settles*: Wispkin present in frame, smoke rimmed silver (LS-3 night duty), mask-white blown clean per LS-2. Digimon grammar at garden scale (§1.5): the world yielded; the small presence holds the light. This is the episode's JoJo moment — one shift, fully earned. | **Mask-white is the brightest value in the episode to this point** — seeded in Beat 4's grade, paid off here (Colour §e). Cries only: the wail plays over a held, lit pose (POSING-SYSTEM). Subtitle (earned moment 1) on its #d0f0f0 card — card colour unshifted (CS-2). |
| 7 | **Gate, night — the name is painted** | GATE-NIGHT "Board Light" | Warm practical key (board lamp) against cool field — the two-temperature frame is the belonging theme, lit. **TK-1 tail flame at rest**: small, steady, a candle-class source at frame edge; its rim is gentle, its grade push minimal — the flame *calm* for the first time, because the garden is. Rule 12 read aloud under this key (no shift — the words do it). | Subtitle (earned moment 2) on standard card. Saturation low but warm — the drain bottoms out *warm*, so the stinger's cold drain shocks by contrast. |
| 8 | **STINGER — Dark Forest, day** | FOREST-DAY "Refusal" | **No key. No shift. No takeover — until TK-5.** Full daylight outside the tree line stops at the trunks; inside: flat, directionless, desaturated, rim withheld (edges dissolve), pattern-fill absent (Colour §f), motifs stopped (POSING-SYSTEM inversion). Something stops moving between the trunks — staged as a *cessation in the light's texture*, never a form. Then **TK-5**: the Rule 12 burn-in ignites red-on-ink — **the only saturated pixel in the stinger and the episode's single lighting takeover by a graphic** — holds, one leaf falls straight down through dead air, smash to black. | #a03436 appears only inside the burn-in (TK-5, CS-2). The Forest gets no personality preset: it is the one place the signature device (L5) refuses to perform. Dread = the system withholding itself. |

**Plot-level checks:** hard shifts used = 1 (Beat 6) of max 2/segment
(CS-5) — the second is banked, unspent. Takeovers: TK-2 ×3 (escalating),
TK-1 ×2 (flare, then rest — an arc, not a repeat), TK-3 ×1, TK-5 ×1.
Every animated behaviour above has boardable stills (first / peak /
released) per L6 — see §8 sheet format.

## 8. THE SYSTEM (g) — LIGHTING SHEET FORMAT + GATE

### 8.1 Per-scene lighting sheet (production format)

One sheet per scene (per key-change within a scene, if a shift or
takeover lands). Filed with the scene's boards; the composite stage
builds from it (UNIFIED-PIPELINE). Fields:

```
LIGHTING SHEET — EP## / Scene ## / Key-change ##
KEY NAME:            (from §3 table, or NEW KEY — requires owner sign-off)
BASE GRADE FAMILY:   (L4 family + strength)
KEY SOURCE:          (motivated source + direction)
FILL / RATIO:        (fill source, key:fill ratio, high/low-key intent)
RIM:                 (colour, motivation, who it is FOR — LS-3 duty list)
TEMPERATURE:         (feel + direction of any crossfade)
PROTECTED COLOURS:   (cast present + their locked slots — from model sheets)
SHIFT:               (none / HARD / GRADUAL — CS-3 trigger #, duration, RELEASE state)
TAKEOVER:            (TK-# + preset name, ignition shape, release shape)
LUSTRE NOTES:        (variants present, sheen behaviour under this key — §6)
STATIC REFS (L6):    [ ] first frame  [ ] peak frame  [ ] released frame
VALUE CHECK (LS-4):  [ ] greyscale pass attached
BOARD HOOKS:         (camera vocab — ENVIRONMENT-AND-CAMERA; pose holds — POSING-SYSTEM)
```

### 8.2 Lighting gate checklist (per scene, at composite)

1. ☐ Key is **named** (in §3 table or signed off as new) and motivated;
     one key only, unless a logged Pond exception or takeover.
2. ☐ **Protected colours sampled clean** — spot-check cast fills against
     model-sheet hexes; zero environment tint on fills (LS-1/LS-2).
     Wispkin mask reads mask-white.
3. ☐ **Greyscale pass attached and passing** (LS-4): silhouettes
     separate, focal values intact — *at base, at shift peak, and
     mid-takeover*.
4. ☐ **Night/dusk rim duty done** (LS-3): every dark-bodied cast member
     rimmed and readable; rim colour matches its stated motivation.
     (Dark Forest exempt — by refusal, and only there.)
5. ☐ Every shift has a **CS-3 trigger**, a legal transition (CS-4), a
     named **release** (CS-6), and the segment's hard-shift count is
     ≤ 2 (CS-5).
6. ☐ **Accent quarantine intact**: #a03436 appears only where Colour
     System v2 allows (Dorowani / alerts / Rule burn-in); no shift,
     grade, flame, or device colour has produced or approximated it.
     Subtitle cards unshifted (CS-2).
7. ☐ Takeovers use their **TK preset** (colour, rim behaviour, throw,
     ignition/release shapes); flame is **attached to the tail tip** in
     every TK-1 frame; device glow is flat/cyan and triple-coded
     meaning (TK-3).
8. ☐ **Lustre behaviour legal** (§6): no re-hued fills, accent placement
     / eye family / ink / filing untouched by the pass; sheen keyed to
     key direction, one neighbour hue max, absent in the Forest (LV-3/4);
     night variants pass the greyscale ID check (LV-5).
9. ☐ **Overlay reversibility spot-check** (L7): lighting layers off ⇒
     frame returns to base art exactly. Tint control separable from the
     cycle control.
10. ☐ **Static refs exist** (L6) for every animated lighting behaviour
     in the scene: first / peak / released frames filed with the boards.

## 9. WIRING MAP — WHERE THIS DOC PLUGS IN

- **Colour System v2** (`show/bible/COLOR-SYSTEM.md`) — supplies the
  protected slots (§a here), the lustre law (§e here is its lighting
  half), the EP01 saturation-drain script (§f here is its lighting
  half), the #a03436 quarantine and subtitle-card colours (CS-2, TK-5).
- **ENVIRONMENT-AND-CAMERA** — keys are specified per location × time to
  slot beside its camera vocabulary; grade re-keys at pose holds, and
  the camera-there/establishing grammar inherits these keys unchanged.
- **POSING-SYSTEM** — CS-3(iii): shifts land on held poses only;
  FOREST-DAY enforces its no-Presentations inversion.
- **UNIFIED-PIPELINE** — all lighting states are composite-stage overlay
  parameters (LS-7); the lighting sheet (§8.1) is a build-manifest
  input per scene; the §8.2 checklist joins the anim/likeness/colour
  gates at the per-scene gate.
- **Chowder kit** (`cn-gigaleak-chowder` KIT-INDEX) — pattern-fill
  stilling in dread scenes is executed as a lighting-layer behaviour:
  the fill's light stops moving before the fill itself is withdrawn.

## 10. OPEN ITEMS (never filled silently)

- FOREST-NIGHT "No Key" — any future use needs owner sign-off (§3).
- Keeper-device hardware design is an open item upstream; TK-3 specifies
  its *light*, not its industrial design.
- Mochiko's human lighting treatment (skin/fills under shifts) inherits
  LS-1/LS-2 by analogy until a human-cast lighting addendum is owner-
  approved.
- Grade family hex anchors for the garden (Signature Day/Night baselines)
  to be sampled from the owner-accepted Garden Gate plate at first
  composite — measured, not eyeballed, per identity-kit practice.

---

*End of draft. Owner's laws (§0) are canon and not up for revision in
review; §§2–8 are the draft system built on them.*
