# DESIGN PRINCIPLES — draft synthesis for the Mochiichao design system

**Status:** DRAFT for owner review. Research + synthesis only: published
sources, cited inline; principles and descriptions only. No source art,
text, characters, names, or assets are reproduced or carried over — each
source contributes *method*, and every application below is native to
Mochiichao (per the construction-kit rule in `show/WORKING-METHOD.md`).

**Setting this system serves:** an original cute creature-garden show —
hyper-pop surface, Tamagotchi/digicore care-loop touches, a
futuristic-Japan garden ("the Garden") run by a human keeper with
designed keeper-tech. Creatures (Mochi species) speak in pure cries;
subtitles obey the show's silent-film subtitle law (cards appear only at
important moments). Locations named in production so far: Garden Gate,
the Pond, the Green, the Dark Forest.

**Builds on:** `show/production/research/persona-5-ui-principles.md`
(the CEDEC distillation already in-repo) and `show/bible/IDENTITY-KIT.md`
(locked palette/fonts, sampled from the real art). This draft extends
both from UI into full design: characters, states, environments.

---

# PART 1 — THE SIX SOURCES, AS PRINCIPLES

## 1. Persona / Persona 5 — graphic design as world design

Source basis: Atlus's own CEDEC + KYUSHU 2017 talk by UI designer
Masayoshi Suto / producer Kazuhisa Wada, reported by Famitsu via
Siliconera and Persona Central; director Katsura Hashino's comments to
Eurogamer.
- https://www.siliconera.com/atlus-reveals-design-secrets-behind-persona-5s-distinctive-ui/?ref=exresearch.co
- https://personacentral.com/persona-5-panel-concept-development-ui/
- https://www.eurogamer.net/lets-talk-about-persona-5s-menus

Extracted principles:

- **P5-1. One dominant colour is the brand.** Each Persona title picks a
  single main colour that carries the theme (P3 blue = cool/stylish,
  P4 yellow = retro/pop, P5 red = active/passionate). P5 went further:
  it *removed* sub-colours everywhere except vital information (HP/MP),
  specifically to protect the main colour's identity. Colour discipline
  is subtraction, not addition.
- **P5-2. Guide the eye with a line when colour can't.** With sub-colours
  banned, hierarchy is carried by a **central gaze line** — a strong axis
  the eye follows — plus angle/contrast changes between hierarchy
  levels, and lighting: high-priority space is lit bright, low-priority
  space is dimmed; key information sits on the mainly-white side.
- **P5-3. UI is a designed object in the world, not a wrapper.** The
  concept was "pop punk"; Hashino states the UI itself was the medium
  chosen to contrast ordinary life with the fantastic life. Menus,
  dialogue frames and battle graphics all share one graphic grammar:
  hard angles, halftone and starburst bursts, big integrated
  typography. Nothing on screen is "neutral chrome."
- **P5-4. The menu is a character performance.** Layouts were built in
  2D first, then a 3D model was posed and spun to *end on a pose*, and
  the final 2D art was cut to that pose. Interface screens are staged
  like character shots, and all UI data was converted to vectors so it
  could scale and animate without losing fidelity.
- **P5-5. Character design = silhouette + one theme colour + a readable
  "costume idea."** (General series practice under art director Shigenori
  Soejima, consistent with the CEDEC account of design discipline:)
  a character reads first as a black shape and a colour, and the outfit
  states one idea. Style is then *tested back down*: Hashino notes early
  UI versions were so aggressively animated they became unreadable and
  had to be pulled back — style pass first, readability pass second,
  both mandatory.

## 2. JoJo's Bizarre Adventure — pose, motif, colour-as-emotion

Source basis: Hirohiko Araki's Anime News Network interview (2017);
his *Manga in Theory and Practice* method as reported; his 2018 SPUR
(fashion magazine) interview on posing; Anime News Network's review
coverage of the David Production anime's colour/posing practice.
- https://www.animenewsnetwork.com/feature/2017-06-29/interview-jojo-bizarre-adventure-creator-hirohiko-araki/.118032
- https://www.animenewsnetwork.com/review/jojo-bizarre-adventure/stone-ocean/streaming-1-24/.189528

Extracted principles:

- **JJ-1. Design = "daily life" × "fantasy," worn on the body.** Araki,
  in his own words to ANN, builds outfits conscious of two elements at
  once: everyday fashion and impractical, bizarre fantasy clothing.
  The friction between the two is the style.
- **JJ-2. Every character carries a motif.** Ornament is not decoration:
  anchors, dolphins, butterflies, hearts recur on a character's clothes,
  accessories and surroundings, encoding personality/ability/backstory.
  A JoJo character can be identified by their motif marks alone.
- **JJ-3. Colour is emotion, not description — and it can change
  mid-scene.** Araki does not hold a fixed colour scheme per character
  (covers recolour freely); the anime institutionalised this as
  scene-specific palette shifts at emotional peaks — whole scenes
  re-grade to signal danger, resolve or dread. Colour continuity is
  subordinate to feeling.
- **JJ-4. The pose is a held tableau.** The famous poses derive from
  fashion photography/illustration (Antonio Lopez, Tony Viramontes),
  classical sculpture (contrapposto, Michelangelo's *David*) and
  ballet. Araki (SPUR, 2018) deliberately references *women's* fashion
  poses for all characters — twisted hips, bent necks — because they are
  more expressive than standard male-model standing. A pose is chosen,
  struck, and *held* so the audience reads resolve/pride/menace from
  the body alone.
- **JJ-5. The combining system: user + Stand as one design unit.** A
  Stand is the user's psyche made visible — it floats behind/above the
  user, shares the user's motif and colour accents, and mirrors or
  counterpoints the user's pose (guardian behind, weapon in front,
  swarm around). User and Stand are *posed as a pair*: the composition,
  not either figure alone, carries the meaning (duel staging: two
  user+Stand units facing off across a staged space, drama from pose
  and colour rather than motion). Sound-effect lettering (e.g. the
  "menacing" glyphs) is treated as graphic layout inside the frame —
  typography as atmosphere.
- **JJ-6. Editorial colour logic.** Jewel-tone accents on desaturated
  grounds — the fashion-catalogue recipe: one saturated accent against
  a muted field is what makes the image strike.

## 3. Chowder — pattern-fill and food-logic worlds

Source basis: published production accounts of the show (creator
C. H. Greenblatt), incl. the widely documented pattern technique and
Marzipan City's architecture references.
- https://en.wikipedia.org/wiki/Chowder_(TV_series)

Extracted principles:

- **CH-1. Pattern-fill: the pattern is a full-screen plate; the
  character is a moving window into it.** Patterns are authored as a
  full-screen image; the character's clothing/body area is filled from
  that plate, so when the character moves, the pattern stays fixed to
  the *screen* and the shape slides through it. Texture becomes a
  property of the world, not of the surface.
- **CH-2. Texture is identity.** Each character's pattern is *theirs* —
  you can identify cast members by fabric alone. Pattern choice does
  the work other shows give to colour blocking.
- **CH-3. One logic builds the whole world.** Marzipan City derives
  everything — buildings, vehicles, props, names — from a single
  system (food/cooking), with real architectural references (Moroccan
  and Indian) underneath the whimsy. The world rule is total and
  consistent, which is why it reads as a place rather than a backdrop.
- **CH-4. Organised clashing.** Colours and patterns clash *by plan*:
  each element is loud, but each is assigned to one owner/zone, so the
  frame is dense without being noisy. (Chowder also rotated media —
  watercolour, stop-motion food, puppets — as gag seasoning, not as
  the base language.)

## 4. Gumball — design by medium

Source basis: published production accounts of *The Amazing World of
Gumball* (creator Ben Bocquelet; Cartoon Network Development Studio
Europe / Studio SOI), incl. the show's documented "lack of stylistic
unity" as a deliberate feature.
- https://alchetron.com/The-Amazing-World-of-Gumball

Extracted principles:

- **GB-1. Each character/family keeps its own medium.** 2D cartoon,
  CGI, stop-motion puppet, rubber-hose, live-action — a character's
  medium *is* their design, and it never casually changes. The clash
  is the world.
- **GB-2. Real-world photographic environments, cartoon staging on
  top.** Elmore's spaces are photographed/realistic plates; flat
  cartoon characters are composited into them with cartoon staging
  (clear silhouettes, readable acting zones). The *environment* carries
  the realism; the *acting* carries the cartoon.
- **GB-3. Medium follows origin/logic.** A character's medium expresses
  what they are (a goldfish is a goldfish; a puppet neighbour is a
  puppet). Design-by-medium only works because the assignment is
  principled, not random — the audience learns the rule in one episode
  and reads it forever after.
- **GB-4. One shared light/shadow grammar unifies unlike media.**
  Whatever the medium, elements share cast shadows, grounding and
  colour temperature per scene, so unlike things sit in one space.

## 5. Dragon Ball Z — transformation grammar and scale

Source basis: Akira Toriyama's design practice as documented in
interviews and by his anime staff — notably character designer Minoru
Maeda's interview (Kanzenshuu translation) on the difficulty of
Toriyama's few-line designs, and published accounts of the Super
Saiyan design choices.
- https://www.Kanzenshuu.com/translations/golden_warrior-minoru_maeda/
- https://screenrant.com/toriyama-art-dragon-ball-dr-slump-impact-manga/

Extracted principles:

- **DB-1. Few lines, exact balance.** Toriyama's designs use minimal
  line work, but every proportion is load-bearing — Maeda testifies
  that a hair's-width shift makes "a completely different person."
  Simplicity is a precision discipline, not looseness. Designs stay
  drawable by a whole studio, forever, at any size.
- **DB-2. Silhouette survives transformation.** A powered state changes
  the silhouette in *one* big readable way (hair sweeps up and changes
  colour) while the body's identity — face, build, outfit anchors —
  stays constant. The audience never loses *who* it is; they only read
  *what state* it is. (The blonde hair itself was famously a production
  economy — no ink fill — that became iconography: state colour as a
  flat swap, not a remodel.)
- **DB-3. State is a grammar, not a moment.** Hair + colour + aura +
  eye shape change together, in the same way, every time — a reusable
  visual sentence the audience learns once. Later forms iterate the
  same channels (more silhouette, new colour) rather than inventing
  new languages.
- **DB-4. Scale by emptiness.** Signature environments alternate vast,
  simple landscapes (a few huge shapes: mesa, sky, water) against
  detailed interiors. Power and wonder are staged as a small, clear
  silhouette inside an enormous simple frame.
- **DB-5. The strongest read smallest.** Toriyama repeatedly makes the
  most powerful figures small/unassuming at rest (his villain forms
  shrink as they strengthen). Readability beats bulk: don't equate
  importance with size or detail.

## 6. Pokémon (anime/games) — creature readability rules

Source basis: Ken Sugimori's published design interviews (the "keep the
balance" account, via NintendoSoup) and scholarly analysis of the
original 151 designs' silhouette practice (Surman, in *Pokémon 151:
Complicating Kawaii*).
- https://nintendosoup.com/ken-sugimori-explains-how-he-designs-pokemon/amp/
- https://www.academia.edu/168071/Pok%C3%A9mon_151_Complicating_Kawaii

Extracted principles:

- **PK-1. Silhouette first, and silhouette is the permanent trait.**
  Colour and texture may vary; the shadow form is the identity. The
  anime literally games this ("Who's That Pokémon?") — a species is
  finished when a child can name it from its black shape alone.
- **PK-2. "Keep the balance": one deliberate flaw.** Sugimori's
  finishing technique is to *take away cool*: add something uncool,
  cheerful or odd to a too-sleek design (his example: Oshawott keeps
  its three freckles against staff objections, because removing them
  made it cuter but forgettable). Memorability beats prettiness.
- **PK-3. Habitat drives design.** A species starts from a real
  animal/thing and its ecosystem, then adds only the "essential
  elements" that state its type/fantasy. Where it lives is visible in
  what it is.
- **PK-4. Elemental colour-coding.** A limited palette per species,
  with colour doing instant habitat/type signalling at a glance.
- **PK-5. Companion staging by size class.** Species are designed in
  readable size classes, and the anime stages human + creature by
  scale contrast (shoulder-height companions, knee-height walkers,
  towering guardians) so relationships read in one frame without
  dialogue.

---

# PART 2 — THE MOCHIICHAO DESIGN SYSTEM (wired rules)

How to read: each rule has an ID, a source tag, and a *production
hook* — where the rule is enforced (model sheet, rig spec, board,
generative prompt, finish). Rules marked **[LOCKED-INPUT]** restate
`IDENTITY-KIT.md` / `persona-5-ui-principles.md` and are not re-opened
here.

## A. Silhouette & Readability

- **A1. One primitive + one sticky-out.** Every species silhouette =
  ONE simple body primitive (ball, teardrop, wedge, bean) + ONE
  signature protrusion (fin, ear pair, horn, shell, tail-flame) that
  no other species shares. If two species' black shapes can be
  confused at thumbnail size, one of them is redesigned. *(PK-1,
  DB-1.)* Hook: model-sheet black-fill panel is a required gate.
- **A2. The 64-pixel test.** The silhouette must identify the species
  at the game's own sprite scale (lustre fronts are 64px) AND at
  storyboard-thumbnail scale. Detail that only reads at full size is
  decoration, not design, and is cut first. *(PK-1, DB-1.)*
- **A3. One balance flaw, kept on purpose.** Each design carries ONE
  deliberate imperfection/asymmetry (an odd marking, a lopsided
  feature, a "too plain" patch) chosen at design time and recorded on
  the model sheet as **DO NOT FIX**. Flaws are identity. *(PK-2.)*
- **A4. Sticky-outs are stiff.** Signature protrusions hold their
  drawn shape in normal animation (hair-as-identity discipline);
  they deform only on scripted emphasis beats (surprise, state
  change). A floppy-eared frame in a neutral scene is an error.
  *(DB-2/DB-3.)* Hook: rig specs list each sticky-out's deform
  permissions.
- **A5. Size-class staging ladder.** Species are assigned a size
  class — **Palm / Knee / Waist / Tower** — recorded in cast data.
  Boards stage keeper + creatures by class contrast (Palm species on
  shoulders/hats/tech, Knee at feet, Waist as scene partners, Tower
  never fully in frame indoors). Relationship reads before anyone
  vocalises. *(PK-5, DB-4.)*
- **A6. Importance ≠ size.** The most significant creature in a scene
  is staged by accent colour and placement, not by being biggest.
  Small + saturated + centred beats large + muted. *(DB-5, JJ-6.)*

## B. Colour System

- **B1. Brand ground.** The show's ground family is the locked brand
  blues (**[LOCKED-INPUT]**: brand #70b0d0 / light #b0d0f0 / mid
  #90b0d0; ink #101010). Skies, tech, title cards and the Gate live in
  this family by default; other hues are guests. *(P5-1.)*
- **B2. One accent per character, spent in three places max.** Each
  species owns ONE accent hue. It may appear on: (1) its signature
  feature, (2) its motif mark (§C), (3) its state glow (§E). Nowhere
  else, and no second accent. Accent hexes are locked per species on
  the model sheet (Dorowani's red #a03436 is the pilot exemplar:
  fins/eyes/alerts only **[LOCKED-INPUT]**). *(P5-1, PK-4.)*
- **B3. Accents are information.** Because accents are rationed, an
  accent appearing = a signal (emotion, state, alert). A scene where
  every accent glows at once is a broken scene; accents fire in
  story order. *(P5-1.)*
- **B4. One dominant colour per location.** Each location owns a
  dominant family; scenes are graded to it before characters enter:
  - **Garden Gate** — brand blue daylight (the home grade).
  - **The Pond** — deep teal/indigo; the night-and-water grade.
  - **The Green** — hyper-pop green/pink; the play grade.
  - **The Dark Forest** — desaturated indigo-grey; daylight does not
    reach in. Accents only, no cheerful colour. *(P5-1, EP01.)*
- **B5. Palette-shift moments (JoJo rule, rationed).** A full-scene
  palette swap is a *scripted event*, allowed only at: (a) a creature
  state change (§E), (b) dread/danger beats, (c) subtitle-law moments
  (§F3). Maximum **two per episode segment**. During a shift, hue
  families rotate but **accent hexes and silhouettes never change** —
  identity survives the grade. Shifts are named in the script
  (e.g. `PALETTE: FOREST-DREAD`), never improvised in finish.
  *(JJ-3.)*
- **B6. Jewel-on-muted for menace and wonder.** Threat or awe beats
  desaturate the environment first, then let ONE accent carry the
  frame. The Dark Forest stinger grammar (stillness + one falling
  leaf + the Rule 12 card) is the house example. *(JJ-6, DB-4.)*

## C. Pattern & Motif

- **C1. One native motif per species.** Each species carries ONE
  motif drawn from its body/habitat (never borrowed iconography):
  a simple, drawable, repeatable mark. The motif appears in exactly
  four places: body marking, pattern fill (§C2), its keeper-tech
  icon (§F1), and its subtitle-card corner mark (§F3). Motif = the
  species' signature in every medium the show touches. *(JJ-2.)*
- **C2. Pattern-fill protocol (Chowder, gated).** A species may carry
  a **pattern zone** (belly plate, shell, back, mask surface) filled
  by the Chowder method: pattern authored as a full-screen plate,
  locked to screen; the zone slides through it as the creature
  moves. House limits Chowder didn't need but we do:
  - Pattern zones are named on the model sheet; nowhere else fills.
  - Pattern-fill is ON in calm/comedy/home scenes; it **stills to
    solid** in dread scenes and inside the Dark Forest — pattern
    behaviour is a mood signal the audience learns. *(CH-1, CH-2.)*
  - Pattern density ≤ the zone's readability at 64px test (A2).
  Hook: puppet rigs implement fill as a screen-locked layer;
  generative prompts specify "screen-locked pattern fill, does not
  travel with the body."
- **C3. Texture keyword per species.** Each species has ONE surface
  keyword recorded on its model sheet (e.g. *gloss gel, matte shell,
  ember-fleck, smoke gauze*). The keyword is used identically in
  puppet shading notes, generative prompts and marketing art —
  texture is identity across pipelines. *(CH-2, GB-1.)*
- **C4. Motifs on the keeper.** The keeper's gear carries the motifs
  of bonded species as physical pins/patches/stickers. Bond is shown,
  never announced: a new motif appearing on the keeper's bag is a
  story event. *(JJ-2 translated to the companion format.)*
- **C5. Creature + signature-effect = one design unit (the Stand
  rule, translated).** Mochi have no Stands — but each species' cry
  visual, state aura and signature effect are designed *with* the
  creature as one unit: same motif, same accent, posed together on
  the model sheet (creature front, effect behind/above, mirroring
  the creature's pose). When a creature and its effect are in frame,
  they are composed as a pair — effect echoes or counterpoints the
  body, never floats decoratively. *(JJ-5.)*

## D. Media & Texture

- **D1. Medium is assigned by life-mode, once.** The core cast shares
  ONE house medium (clean 2D, puppet-rigged) so the family reads as
  a family. Deviations are systematic, not per-episode whims:
  - **Water life** (Pond species): a translucent gel shading layer
    over the house style.
  - **Ghost/spirit life**: smoke-gauze composite (soft edge, layered
    translucency) over a solid house-style core.
  - **Flashback/memory**: a deliberately *different* medium is the
    sanctioned signal of the past (house precedent: the approved
    pre-mask Wispkin flashback clip lives in its own style on
    purpose). Flashback medium must be declared in the script.
  *(GB-1, GB-3.)*
- **D2. Mixed media lives in the world layer.** Photographic texture,
  halftone, starburst graphics, stop-motion-style props may appear
  in environments, keeper-tech screens and effect cards — never on a
  creature's face or body core. The character layer stays unified;
  the *world* is allowed to be collage. *(GB-2, CH-4.)*
- **D3. One light grammar for everything.** Whatever the layer —
  painted plate, photo texture, puppet, generative clip — all
  elements in a scene share one light direction, one cast-shadow
  rule and the location's colour temperature (§B4). This is the glue
  that lets mixed media sit in one garden. *(GB-4.)*
- **D4. Texture budget.** Per scene: house style + at most TWO
  deviating textures/media. A third requires a script note. Density
  is a budget, not a default. *(CH-4, GB-1.)*

## E. Transformation & State Language (DBZ grammar, translated to cute)

Mochi don't power up to fight; they change state to *feel* and to
*grow*. The DBZ grammar is kept — same channels, same order, every
time — with the content swapped from combat to care.

- **E1. Three channels, fixed order.** A state reads through, in
  order: **(1) silhouette** — the sticky-out responds (fin lifts,
  ears pin, sprout opens); **(2) colour** — the accent spreads or
  warms/cools along a pre-drawn state variant; **(3) aura/particles**
  — the species' motif (§C1) emits as particles/sparkles in its
  accent. A state is not "on" until **at least two of the three
  channels fire**. One channel alone = a mood hint, not a state.
  *(DB-3.)* Hook: every state is a drawn variant set in the rig
  (silhouette variant + palette variant + particle card), never an
  ad-lib filter.
- **E2. The state ladder (emotional, reversible).**
  - **Base** — home colours, pattern-fill live (§C2), relaxed
    sticky-out.
  - **Bright** (joy, bond, being cared for) — accent glows, motif
    particles *rise*, silhouette opens up (taller/rounder).
  - **Guard** (alert, protective, suspicious) — silhouette sharpens
    (sticky-out angles), palette cools one step, particles stop.
  - **Overwhelm** (fear, dread, forest-sick) — palette desaturates
    toward the location's dread grade, pattern stills to solid,
    silhouette *shrinks* (creature makes itself small). The strongest
    feeling reads smallest. *(DB-5.)*
- **E3. Changes happen on a held pose.** A state change is staged
  JoJo-style: the creature strikes and *holds* a signature pose
  while channels fire, optionally over a graphic burst card (§F4).
  Never mid-stride, never under dialogue. The hold is the sentence;
  the change is the punctuation. *(JJ-4, DB-2.)*
- **E4. Identity survives every state.** In all states: silhouette
  primitive unchanged, accent hex unchanged, balance flaw unchanged.
  States re-dress the creature; they never redesign it. *(DB-2,
  PK-1.)*
- **E5. Growth is silhouette-first and permanent.** A growth/bond
  evolution is announced by a NEW or enlarged sticky-out (silhouette
  channel first), palette second, and is delivered as a designed
  **growth card** in keeper-tech UI (§F1) — digicore grammar: the
  device shows the silhouette filling in. Growth is never revealed
  by dialogue alone. *(DB-2, PK-1.)*
- **E6. No escalation arms race.** States are not ranked power
  levels; Bright is not "stronger" than Guard. Later episodes reuse
  the same four states with new *causes*, not new forms. New forms
  require a growth event (E5), which is a story decision, not a
  design habit. *(DB-3, bounded.)*

## F. Typography & UI-in-World

- **F1. Keeper tech is one designed product line.** The keeper board,
  gate sign, handheld device and any screen in the Garden share one
  grammar, per the in-repo Persona distillation
  (`persona-5-ui-principles.md`): brand-blue ground **[LOCKED-INPUT]**,
  ONE accent (vital info only), a visible gaze line, lighting =
  priority, vector-built, and the locked font pair (Bungee display /
  Fredoka text **[LOCKED-INPUT]**). Every species appears on tech as
  its **motif icon** (§C1) + silhouette glyph — the device "reads"
  creatures the way the audience does. *(P5-1…P5-4, C1.)*
- **F2. Diegetic first.** If information can be a physical object in
  the Garden (board, sign, tag, ribbon), it is one — designed with
  the F1 grammar painted/carved on. Floating non-diegetic UI is
  reserved for the keeper device's own POV shots. (House precedent:
  the accepted Garden Gate plate's KEEPER BOARD with its name
  lines.) *(P5-3.)*
- **F3. Subtitle cards are designed objects (subtitle law × Persona
  grammar).** The show's subtitle law stands: cards appear ONLY at
  important moments to carry a creature's meaning, then vanish;
  creatures are never fully subtitled. When a card does appear, it
  is a designed intertitle, not a caption: dominant-colour block in
  the *location's* family (§B4), the speaking species' motif as
  corner mark, gaze line under the text, locked fonts. The Rule 12
  card over the Dark Forest is the reference build: low, held,
  total. A card's arrival may trigger a §B5 palette shift. *(P5-2,
  P5-3; subtitle law.)*
- **F4. Graphic bursts are rationed punctuation.** Halftone fields
  and starbursts (Persona graphic vocabulary) appear only at: state
  changes (§E3), growth cards (§E5), title cards, and comic shock
  beats — max density set per scene in the board. Everyday scenes
  are graphic-quiet so bursts keep their value. *(P5-3.)*
- **F5. Sound-glyph typography (JoJo, domesticated).** For creature
  cries at *big* moments only, a cry may be drawn as graphic
  lettering inside the frame using the species' motif shapes
  (menace-glyph grammar, made cute): pressure, wonder or alarm
  rendered as layout. Everyday cries stay sound-only. Never used
  for the Dark Forest — the Forest gets silence. *(JJ-5.)*

## G. Environment Design Rules

- **G1. One logic per location (garden-logic).** Each location is
  built from ONE system the way Marzipan City is built from food:
  - **Gate** — *trellis logic*: everything is grown, tied or hung;
    signs are leaf-and-vine carpentry; the keeper board is the
    location's "menu."
  - **Pond** — *float logic*: tech and furniture ride the water;
    lily-pad platforms, ripple rings as the location's motif-field.
  - **The Green** — *toy logic*: hyper-pop play structures, digicore
    plastic-and-sticker surfaces; the garden's arcade.
  - **Dark Forest** — *root logic*: everything is root, trunk and
    canopy shadow; nothing is built, only grown wrong. No keeper
    tech works decoratively here (screens dim by §B4 grade).
  A prop that belongs to no location logic doesn't ship. *(CH-3.)*
- **G2. Stage plates with acting zones.** Locations are built as
  reusable stage plates (photographic/garden texture in the world
  layer per §D2) with marked acting zones and a foreground dressing
  layer; scenes are staged ON the plate, cartoon-clear. New plates
  are capital; new angles of existing plates are cheap. *(GB-2.)*
- **G3. Scale alternation.** Episode rhythm alternates **vast-simple**
  frames (sky/water/canopy, ≤3 big shapes, creature small and clear)
  with **dense-detailed** frames (keeper hut interior, tech nook,
  board close-ups). Never two dense frames or two vast frames in a
  row without a story reason. *(DB-4.)*
- **G4. Location colour + overlay signature.** Each location pairs
  its §B4 dominant colour with ONE graphic overlay family (Gate:
  clean halftone dots; Pond: ripple rings; Green: starburst flecks;
  Forest: none — overlays are absent, and the absence reads).
  *(P5-3, B4.)*
- **G5. Environments carry the first joke/first chill.** Before any
  creature acts, the plate states the scene's tone (Chowder's world
  carrying the comedy; the Forest plate carrying dread by stillness).
  If a cold viewer can't read the tone from the empty plate, the
  plate isn't finished. *(CH-3, B6.)*

---

# PART 3 — THE DESIGN GATE (run per new asset)

A designer/animator runs this list for EVERY new species, state
variant, location plate, prop or card. Any "no" stops the asset.

**Silhouette**
- [ ] Black-fill test passed at full size AND 64px (A1, A2)
- [ ] One primitive + one sticky-out; no clash with another species
- [ ] Balance flaw present and marked DO NOT FIX on the sheet (A3)
- [ ] Size class assigned and recorded (A5)

**Colour**
- [ ] Exactly one accent hue; appears in ≤3 places (B2)
- [ ] Accent hex matches the locked model-sheet value (B2)
- [ ] Asset grades correctly into its location's dominant family (B4)
- [ ] No unscripted palette shift introduced (B5)

**Pattern & motif**
- [ ] Species motif present in its assigned places; no borrowed
      iconography (C1)
- [ ] Pattern zone named; fill is screen-locked; stills correctly
      for dread (C2)
- [ ] Texture keyword matches the model-sheet keyword (C3)
- [ ] Creature + signature effect composed as one unit (C5)

**Media**
- [ ] Medium matches the species' life-mode assignment (D1)
- [ ] No photo/halftone texture on a creature's face/body core (D2)
- [ ] Scene texture budget respected (≤2 deviations) (D4)

**States (if the asset is a state variant)**
- [ ] ≥2 of 3 channels fire; channels match the E1 order (E1)
- [ ] Change is staged on a held pose (E3)
- [ ] Primitive, accent hex and flaw unchanged from Base (E4)

**UI / typography (if the asset is tech, signage or a card)**
- [ ] F1 grammar: brand ground, one accent, gaze line, locked fonts
- [ ] Diegetic object preferred over floating UI (F2)
- [ ] Subtitle cards only at law-approved moments (F3)

**Environment (if the asset is a plate or prop)**
- [ ] Belongs to exactly one location logic (G1)
- [ ] Acting zones readable; tone reads from the empty plate (G2, G5)
- [ ] Location overlay signature correct — including *none* for the
      Forest (G4)

**Derived outputs (species assets)**
- [ ] Plush sheet emitted per PLUSH-SPEC (`mochiichao/plush/v1`, show/production/list3-systems/PLUSH-SPEC.md) — the design gate's merch output; passes on the 32px + one-colour plush-read proofs

---

# PART 4 — WORKED EXAMPLES (pilot cast)

## Mochii — the mascot read
- **Silhouette:** compact round primitive (a droplet-ball); sticky-out
  = the single droplet point at the crown. Passes A2 trivially — Mochii
  is the cast's 64px benchmark; other species are tested *against*
  Mochii's clarity.
- **Colour:** body blue #50b0f0 **[from IDENTITY-KIT]** sits inside the
  brand family, so Mochii's accent is spent on *warmth contrast*: a
  single warm accent reserved for cheek blush + state glow only (B2) —
  the mascot is the one cast member whose accent signals affection.
- **Motif & pattern:** motif = **droplet-ring** (a ring with one drop
  falling). Pattern zone: belly, filled with screen-locked droplet
  pattern in calm scenes (C2). Texture keyword: *gloss gel*.
- **States:** Bright = crown point lifts + droplet particles rise;
  Overwhelm = body squashes lower and rounder (shrinks per E2) —
  Mochii never sharpens well, so its Guard reads as *hiding behind
  the keeper* (staging, not silhouette) — an honest species limit,
  recorded rather than designed away.
- **Pose note:** Mochii's held poses are round-on-round (curl, bounce-
  settle); its E3 state changes land on the settle frame.
- **Tech icon:** droplet-ring glyph; its subtitle cards carry the ring
  as corner mark (F3).

## Dorowani — the discipline exemplar
- **Silhouette:** bipedal amphibian primitive (upright bean torso);
  sticky-outs = red fin cheeks + dorsal fin, read as one crown
  silhouette. The tan shell on its back gives the rear view its own
  read (back-silhouette test required, A1).
- **Colour:** body #30b0d0 / belly #d0f0f0 / deep #3070b0; accent red
  #a03436, **LOCKED** to fins/eyes/alerts **[LOCKED-INPUT]** — the
  pilot's proof of B2/B3: when Dorowani's red *glows*, the audience
  should already know something is wrong or wonderful.
- **Motif & pattern:** motif = **fin-wave chevron**. Pattern zone:
  the shell — screen-locked chevron weave, the cast's clearest
  Chowder-fill demonstration piece. Texture keyword: *river-smooth*.
- **States:** the full ladder is legible on Dorowani, making it the
  state-language teaching character: fins lift (silhouette) → red
  spreads to cheek-glow (colour) → chevron particles shed like sparks
  off the shell (aura). Guard = fins pinned flat, palette cools.
- **Pose note:** Dorowani takes the show's most JoJo-inflected poses —
  upright, contrapposto-leaning, fin-cheeks framed — translated to
  cute proportions (JJ-4 at chibi scale; menace becomes *resolve*).
- **Tech icon:** chevron glyph; keeper's first motif pin (C4) is
  Dorowani's — the starter bond, shown on the bag from EP01.

## Gabu — the bruiser who reads small
- **Silhouette:** bulky bruiser primitive (wide wedge); sticky-out =
  long arms that hang past the body line — silhouette reads "strong"
  from arm length, not bulk detail (DB-1: few lines, exact balance).
- **Colour:** teal body family (Pond-adjacent), accent spent on a
  single warm belly-plate hue; Gabu is the cast's test of A6/B6 — in
  group frames he is staged muted and off-centre so smaller cast
  members keep the read.
- **Motif & pattern:** motif = **shell-plate arc** (concentric arcs).
  Pattern zone: belly plate, arc pattern, screen-locked. Texture
  keyword: *matte shell*.
- **States:** Gabu inverts the ladder for comedy and heart: Bright =
  arms *rise* (the only cast member whose joy enlarges his
  silhouette); Overwhelm = arms wrap self, arcs still, Gabu makes
  himself small behind the Pond reeds (DB-5: the strongest reads
  smallest — and most vulnerable). His Guard is nearly
  indistinguishable from Base by design: Gabu doesn't threaten;
  the script must never ask his design to menace.
- **Pose note:** held poses are wide-base, low-centre tableaux —
  sculpture logic (JJ-4) at bruiser scale; the EP01 lunge-and-miss
  lands and *holds* in the miss, which is where the gag lives.
- **Tech icon:** arc glyph.

## Kittember — the accent as a literal flame (CANON: flame on tail tip)
- **Silhouette:** small feline primitive; sticky-out = the tail,
  whose **tip carries the flame** — silhouette test is run *with the
  flame shape included*: tail-up = one read, tail-curled = another,
  both must still say "cat" at 64px. The flame is part of the body
  plan, never a separate floating element (owner canon).
- **Colour:** black coat (the cast's only near-ink body — a deliberate
  exception that makes the golden eyes + tail-tip flame the whole
  colour story). Accent = flame orange, spent in exactly two places:
  tail tip, and state glow that *starts at the tip and travels up the
  tail* — the accent's path is choreographed (B2, B3).
- **Motif & pattern:** motif = **tail-tip spark** (a four-point spark
  drawn from the flame's own shape). Pattern zone: NONE — Kittember
  is the cast's pattern-refuser; its identity texture is *ember-fleck
  felt* rendered as shading, not fill (C2 is a permission, not an
  obligation; the refusal makes the others' fills read louder).
- **States:** the sensor of the cast (SHOW-BIBLE): Guard fires FIRST
  on Kittember in any scene — tail tip brightens before anyone else
  reacts (B3: accent as information, weaponised for storytelling).
  Bright = flame blooms one size class up; Overwhelm = flame shrinks
  to ember, tail wraps body. All states keep the flame attached —
  a detached or orbiting flame in any frame is an automatic gate
  failure (Part 3, Pattern & motif).
- **Pose note:** feline contrapposto — arched, twisted, paw-extended
  held poses (JJ-4's fashion logic suits a cat natively); EP01's
  "tail flame flickers at empty air" beat is staged as a held pose,
  ears flat, flame doing the acting.
- **Tech icon:** spark glyph.

## Wispkin — the mask is the face (CANON: skull mask)
- **Silhouette:** ghost-float primitive (teardrop wisp over smoke);
  sticky-out = the **white skull mask** itself — the only cast member
  whose signature feature is a *worn object*. Silhouette test
  includes the mask's crack line: the crack is Wispkin's balance flaw
  (A3), marked DO NOT FIX — a repaired mask is a different character.
- **Colour:** body in desaturated indigo/smoke greys (the Forest
  grade lives on this character — Wispkin carries its home location
  in its palette, PK-3 habitat logic); accent = mask bone-white, the
  cast's only *achromatic* accent: it glows by brightness, never by
  hue (B2 variant, recorded on the sheet).
- **Motif & pattern:** motif = **mask-crack star** (the crack,
  abstracted to a small jagged star). Pattern zone: the smoke tail —
  screen-locked wisp-stripes that *slow* (not still) in dread;
  Wispkin is the exception that teaches the C2 rule, since it comes
  from the place where patterns go quiet. Texture keyword: *smoke
  gauze* (its D1 ghost-medium layer).
- **States:** expression runs through mask tilt + hands + smoke (per
  corrected model sheet): Bright = mask tilts up, smoke lightens one
  grade; Guard = hands grip the mask's edges, smoke thins to a
  trail; Overwhelm = mask tilts down, smoke pools — Wispkin
  *dissolves toward the ground* rather than shrinking. State changes
  hold on the mask tilt (E3).
- **Pose note:** Wispkin's poses are mask-led tableaux — the body
  follows the mask's angle the way a Stand follows its user (C5
  inverted: here the *object* leads the creature). Float-up reveal
  (EP01) is staged as one slow held rise, mask first.
- **Flashback rule:** pre-mask Wispkin appears ONLY in flashback, in
  the sanctioned different medium (D1) — and per B5, flashback entry
  is a named palette-shift moment. Present-day Wispkin is never
  drawn maskless.
- **Tech icon:** crack-star glyph; on keeper tech, Wispkin's icon
  renders dimmed until it is "properly introduced" in-story — the UI
  keeps the secret the episode is about (F1 as storytelling).

---

# SOURCES (published; principles only — no assets reproduced)

- Atlus, CEDEC + KYUSHU 2017 UI talk (Suto/Wada), via Siliconera:
  https://www.siliconera.com/atlus-reveals-design-secrets-behind-persona-5s-distinctive-ui/?ref=exresearch.co
- Same talk, via Persona Central:
  https://personacentral.com/persona-5-panel-concept-development-ui/
- Hashino on Persona 5's menus, Eurogamer:
  https://www.eurogamer.net/lets-talk-about-persona-5s-menus
- Araki interview, Anime News Network (2017):
  https://www.animenewsnetwork.com/feature/2017-06-29/interview-jojo-bizarre-adventure-creator-hirohiko-araki/.118032
- ANN review coverage of JoJo anime colour/posing (Stone Ocean):
  https://www.animenewsnetwork.com/review/jojo-bizarre-adventure/stone-ocean/streaming-1-24/.189528
- Chowder production/pattern-fill account:
  https://en.wikipedia.org/wiki/Chowder_(TV_series)
- Gumball production/mixed-media account:
  https://alchetron.com/The-Amazing-World-of-Gumball
- Maeda on animating Toriyama's designs, Kanzenshuu:
  https://www.Kanzenshuu.com/translations/golden_warrior-minoru_maeda/
- Toriyama style/design coverage, ScreenRant:
  https://screenrant.com/toriyama-art-dragon-ball-dr-slump-impact-manga/
- Sugimori, "keep the balance," via NintendoSoup:
  https://nintendosoup.com/ken-sugimori-explains-how-he-designs-pokemon/amp/
- Surman, silhouette analysis of the original 151, Academia.edu:
  https://www.academia.edu/168071/Pok%C3%A9mon_151_Complicating_Kawaii
- In-repo companions: `show/production/research/persona-5-ui-principles.md`,
  `show/bible/IDENTITY-KIT.md`, `show/WORKING-METHOD.md`.

*End of draft.*
