# JoJo Posing Language & the Stand+User System — Research Draft

**Purpose:** Deep research for the Mochiichao show's native posing and partner-composition
system. Part 1 covers JoJo's posing language, Part 2 the Stand+user design/pairing system,
Part 3 converts the *principles* (never the designs) into a Mochiichao-native system wired
into the existing rig scaffolds (`show/production/rigs/scaffolds/*.rig.json`) and the
existing camera vocabulary in `show/production/ENVIRONMENT-AND-CAMERA.md`
(`HOLD-TENSION`, `PUNCH-IN`, `STILL-FOREST`, etc.).

**Source rule:** Published sources only — Araki's own craft book and interviews, director
interviews, published art-book commentary, and reputable secondary analysis — cited inline.
Techniques are described in words only; no copyrighted art or text is reproduced.

---

## PART 1 — THE JOJO POSING LANGUAGE

### 1.1 Roots: where the poses actually come from

The JoJo pose is not an anime invention. Araki has been unusually explicit, in print,
about his three source wells:

1. **Classical and Mannerist sculpture.** In *Manga in Theory and Practice: The Craft of
   Creating Manga* (Shueisha 2015; VIZ Media English ed. 2017), Araki describes a formative
   trip to Italy: at the Galleria Borghese in Rome he saw Bernini's *Apollo and Daphne* and
   wanted to draw that twisting motion in manga; he notes such twisting poses were rarely
   found in Japanese museums, and credits the trip with giving him his style (Araki,
   *Manga in Theory and Practice*, "I Found My Style in Italy," pp. 139–141, as quoted in
   "Araki Hirohiko: Elevating the Craft of Manga through Art Nouveau and Art Deco,"
   academia.edu — https://www.academia.edu/144207216/Araki_Hirohiko_Elevating_the_Craft_of_Manga_through_Art_Nouveau_and_Art_Deco).
   In the same passage he states the doctrine plainly: if his art has one distinctive
   feature it is the posing of figures, acquired on that trip; in JoJo he pushes the limits
   of the human body with poses, amplifying the *signification* of a pose to an extreme
   until the form is free of everything extraneous (ibid.). Secondary accounts consistently
   add Michelangelo — the *David*'s weight-shifted stance is the textbook contrapposto
   reference — plus ballet dancers' held lines, as sources Araki himself names
   (The Diplomat Rio, "Unveiling Hirohiko Araki's Bizarre World,"
   https://thediplomariot.com/blog/unveiling-hirohiko-arakis-bizarre-world-a-master-mangaka-1764804931).
2. **Fashion illustration and editorial photography.** Araki's other documented well is
   1980s fashion illustration — above all Tony Viramontes and Antonio Lopez — and the
   fashion magazines (*Vogue*, *Spur*) whose models contort to display garments
   (academia.edu paper above, citing fashion-illustration scholarship and *JoJo 6251*;
   Manual do Bruxo, "Joseph and Caesar Pose,"
   https://manualdobruxo.com.br/joseph-and-caesar-pose-why-this-jojo-stance-still-dominates-anime-culture-sol).
   The relationship later became literal: Gucci commissioned Araki for the "Rohan Kishibe
   Goes to Gucci" one-shot (2011, *Spur*) and the worldwide "Jolyne, Fly High with Gucci"
   window campaign (2013) (Shapes.inc, "JoJo's Bizarre Adventure Fashion & Poses").
3. **Mannerism as method.** Mannerist art deliberately elongates proportions and makes
   poses "artificial" to heighten emotion; analysis of Araki's method identifies this —
   not anatomical correctness — as the operating principle: anatomy is a suggestion,
   silhouette is the law, and forced perspective (a foreground fist drawn many times head
   size) is used constantly for three-dimensional impact (Manual do Bruxo, "Why JoJo's
   Bizarre Adventure Drawing Styles Keep Changing,"
   https://manualdobruxo.com.br/why-jojos-bizarre-adventure-drawing-styles-keep-changing-and-how-to-master-them-1k5y).

Araki's book adds two craft tools relevant to posing: the **"golden ratio of beauty"** —
he composes figures and panels against golden-ratio divisions — and **signification**,
the deliberate simplification of a form to its readable essence (his own example: Mickey
Mouse's head reduced to three circles) (book summary, Blinkist,
https://www.blinkist.com/en/books/manga-in-theory-and-practice-en; publisher's summary,
VIZ Media edition, https://www.thenile.com.au/books/hirohiko-araki/manga-in-theory-and-practice/9781421594071).

### 1.2 Anatomy of a JoJo pose — what makes it read as "JoJo"

Distilled from the sources above, a pose reads as JoJo when most of these are present:

- **Extreme contrapposto, pushed past anatomy.** Weight thrown onto one leg so hips and
  shoulders counter-tilt, then exaggerated further into a full **S-curve** (or Z-curve)
  running head→hips→feet. The hips/shoulder counter-tilt is the classical contrapposto
  mechanism; Araki "dialed it up to eleven" (Manual do Bruxo, Joseph/Caesar analysis,
  URL above). The result is a body that looks still and moving at once — "static movement."
- **Torsion.** The torso twists against the pelvis — shoulders facing one direction, hips
  another — the Bernini inheritance. A JoJo figure rarely faces the camera squarely with
  all planes aligned; something is always wrung.
- **Hand choreography as punctuation.** Hands are never neutral filler: fingers splayed,
  wrists bent at fashion-model angles, an index finger pointed to frame or accuse, palms
  presented flat to camera. Analysis of the style identifies intentional hand gestures as
  one of its three signature pillars, functioning as "expressive punctuation marks"
  (GoodNovel Q&A synthesis of artist commentary,
  https://yfbwww.goodnovel.com/qa/jojo-poses-reflect-character-personalities — secondary,
  consistent with the primary sources above).
- **Gaze that breaks the pose's direction.** The face frequently turns *against* the
  body's motion — looking back over a twisted shoulder, eyes to camera while the body
  addresses someone in-scene. The mismatch between body vector and eye vector is a large
  part of the tension.
- **Silhouette-first readability with negative space.** Poses are composed so the
  outline alone identifies the character and the emotion; limbs are arranged to open
  clear negative-space shapes (the triangle under a bent arm, the gap between arched back
  and arm) rather than crossing the torso and muddying the read (style analyses above).
- **Fashion silhouette over uniform silhouette.** Elongated necks, dramatic collars,
  fabric that flows as if it has its own agenda — the body is dressed and posed like a
  runway shot even mid-battle (Manual do Bruxo, drawing-styles analysis, URL above).
- **Heaviness in the rendering.** Dense blacks and hatching give the contorted figure
  sculptural weight, so the pose reads as a statue caught mid-gesture rather than a
  sketch (ibid.).

**Dyad principle (curve vs. line).** Poses are also designed in *pairs*. The canonical
breakdown of the famous Joseph/Caesar pairing: Joseph is the curve — loose, arched,
implying he's about to spring (or run away); Caesar is the straight line — forward-facing,
wide firm stance, one straight arm and clenched fist forming a vertical anchor. Together
they make a balanced composition out of opposite body grammars (Manual do Bruxo,
Joseph/Caesar analysis, URL above). This pairing principle becomes central in Part 2 —
and in the Mochiichao application it becomes the keeper/creature composition rule.

### 1.3 How the anime stages a pose (David Production)

The manga pose is a still; the anime's job is to make a still *play* in time. David
Production's documented toolkit:

- **Poses are treated as key frames, and the hold is the point.** The adaptation does
  not try to smooth Araki's snapshot moments into realistic motion; it captures the
  *feeling* of the snapshot — freeze frames at climactic beats, slow motion on Stand
  rushes, and graphic on-screen sound-effect text are direct translations of the manga's
  graphic design into motion (AnimePapa, "Canon Comparisons: How JoJo's Bizarre
  Adventure Adapts Its Manga Across Generations,"
  https://animepapa.com/article/canon-comparisons-how-jojos-bizarre-adventure-adapts-its-manga-across-generations/).
- **Scene-specific colour shifts at the hold.** Director Naokatsu Tsuda, in his Anime
  News Network interview, explains the system directly: manga JoJo has no fixed colours,
  and anime normally cannot change an established colour setting — so the production
  adopted **scene-specific colouring**, letting the "set colour" change with the
  specifics of a scene (ANN, "Interview: JoJo's Bizarre Adventure Director Naokatsu
  Tsuda," 2015,
  https://www.animenewsnetwork.com/feature/2015-07-16/interview-jojo-bizarre-adventure-director-naokatsu-tsuda/.90413).
  In a later fan-event interview summary, Tsuda adds the two reasons: no other anime does
  it, and it recreates the way every reader had imagined the colours differently
  (Interview Archive, JoJo's Bizarre Wiki,
  https://jojo.fandom.com/wiki/Interview_Archive?file=ArakiFamicomJump.jpg).
  In practice: at a pose-hold or reveal, the whole palette inverts or re-keys — skies go
  purple, grass goes pink — signalling that psychology, not physics, now owns the frame
  (secondary production analyses, ibid.).
- **The "menacing" glyphs as graphic design, not language.** The katakana ゴゴゴ
  ("gogogo") is technically a *gitaigo* — an ideophone for a state (a rumbling, menacing
  atmosphere), not a sound anything makes (Know Your Meme, "Menacing / ゴゴゴゴ,"
  https://knowyourmeme.com/memes/menacing-%E3%82%B4%E3%82%B4%E3%82%B4%E3%82%B4).
  Araki used it from the manga's first issues in January 1987, set as expressive
  typography *inside* the illustration, creeping in from panel edges around a threatening
  presence (ibid.). Tsuda's team likewise treats on-screen SFX text as a purely visual
  element rather than language (ANN interview coverage, URL above). In the anime the
  glyphs are animated — they jitter, swell, and take the scene's lighting/colour, so the
  typography behaves like weather around the character (VFX production analysis,
  Diffsense, https://diffsense.com/jojo-vfx-onomatopoeia-sheet-why-these-sounds-hit-different-1jnn
  — secondary source, flagged).
- **Sound design around the hold.** The anime's documented approach pairs the freeze
  with sonic punctuation: a low rumble under the "menacing" beat, arc-specific
  leitmotifs, and — critically — *deliberate dramatic silences* that the printed page
  could only imply; sound is how the adaptation "turns subtext into texture"
  (AnimePapa, URL above). The pose-hold is therefore a three-layer event: picture
  freezes, colour re-keys, sound either swells or drops out.
- **Camera at the hold.** Coverage of the adaptation notes the camera behaviour around
  poses: low, dramatic angles looking up at the posed figure (hero/villain scale),
  slow push-ins that arrive *at* the pose and then stop, and held frames where the only
  motion is the glyph drift and a colour pulse (AnimePapa, URL above; Shapes.inc,
  Stardust Crusaders study). The camera's restraint is the tell: motion belongs to
  entrances and strikes; authority belongs to stillness.

### 1.4 Posing as characterisation

A JoJo character's posing vocabulary *is* their personality sheet, and it is consistent
enough to be a recognition system:

- **Signature stance vocabulary.** Each recurring character poses in a recognisable
  personal grammar — the flamboyant, space-claiming theatricality of a villain like Dio
  reads as arrogance and superiority before he speaks; a timid character's closed,
  self-protecting body language visibly opens up as they grow (character-posing
  analysis, GoodNovel Q&A, URL above — secondary, consistent with Araki's published
  character-first method below). Fans recreate specific characters' stances as
  "JoJo dachi" (JoJo standing), and the poses function as identity marks in the culture
  at large (Shapes.inc, Fashion & Poses).
- **Poses evolve with the character.** Because the stance vocabulary is personal, a
  *change* in how a character poses is legible as character development — e.g., in Part
  4's opening, a stoic character's signature finger-point softens into a playful dance
  pose, signalling growth without a line of dialogue (TV Tropes, Diamond is Unbreakable
  production notes — descriptive, flagged as tertiary).
- **Araki's process supports this:** he writes an "investigative report" on each
  character — a dossier of traits, history, and habits — before drawing them, and treats
  character as the first of his three fundamentals (character, setting, story — story
  ranked last) (*Manga in Theory and Practice*, per publisher's summary and Blinkist
  summary, URLs above). The pose vocabulary is designed downstream of that dossier:
  stance is the dossier made visible.

### 1.5 Group and team compositions

- **The ensemble tableau.** JoJo group shots are arranged like fashion editorial group
  photographs: each member holds a *different* personal pose (never a uniform line-up),
  at staggered depths, with mixed facing directions — some to camera, some in profile,
  some turned away — so the eye travels. The openings and key art codified this: a team
  is a chord of individual poses, not a chorus line (Shapes.inc, Fashion & Poses;
  TV Tropes production notes on Part 4's dancing/posing opening, URL above).
- **Dyads inside the group.** Within the tableau, curve/line pairings (§1.2) create
  local balance: an arched, mobile figure next to a vertical, anchored one.
- **Hierarchy by scale and stillness.** The most dangerous person in a group frame is
  usually the *stillest* and often the largest in frame or highest in the composition;
  subordinates get the more extravagant motion. Menace is inversely proportional to
  fidgeting.

### 1.6 What poses DO in a scene (function grammar)

Across the sources, poses perform four recurring jobs:

1. **Intimidation / dominance display.** A character takes a pose *instead of* attacking;
   the opponent (and audience) must read it. Paired with menacing glyphs, colour shift,
   and the pose-hold, it converts "this person is dangerous" from dialogue into staging
   (Know Your Meme; AnimePapa, URLs above).
2. **The reveal.** A new character, a new ability, or a Stand's first appearance is
   staged as a pose event: emergence + hold + colour re-key (see §2.5). The pose is the
   punctuation that says "remember this frame."
3. **The pre-attack beat.** Battles run on a rhythm of pose → strike: the held pose is
   the wind-up the audience learns to anticipate, making the release (a rush, a single
   blow) land harder. Freeze frames at the climax of attacks are the same device at the
   other end of the motion (AnimePapa, URL above).
4. **Declaration without dialogue.** Resolve, defiance, loyalty, contempt — the pose
   carries the emotional line while the mouth is shut (§1.1, Araki on signification;
   §1.4). In a show with limited dialogue this is not decoration; it is the dialogue.

---

## PART 2 — THE STAND + USER SYSTEM

### 2.1 What a Stand is, in Araki's own framing

Araki's stated problem was depiction: supernatural power was traditionally shown only
through light effects and after-effects (crumbling buildings). For *Stardust Crusaders*
(1989 author's note) he asked how to express an invisible power — and answered by giving
psychic power a visible form and shape: the Stand (Araki, author's note, *Stardust
Crusaders*, JoJo's Bizarre Wiki archive,
https://jojo.fandom.com/wiki/Author%27s_Note_(Stardust_Crusaders)).
He repeats the point in Shueisha's official interview series: he wanted to take
invisible, supernatural things — curses, energies not tied to the body — and turn them
into something visible he could show readers; that line of thought produced Hamon and
then Stands (Shueisha, "JoJo's Bizarre Adventure — Hirohiko Araki Interview,"
https://mangamillion.shueisha.co.jp/en/featured/79).

Two more documented origin facts matter for design:

- **The guardian-spirit model.** The Stand concept was inspired by the guardian spirit
  in Jiro Tsunoda's *Ushiro no Hyakutarō* — a presence that stands behind/beside its
  person (Stand reference, JoJo's Bizarre Wiki, https://jojo.fandom.com/wiki/Stand).
  In a 1993 *JoJo 6251* interview, Araki says the name came from how the figure looms
  nearby like a light stand (a tall lamp), as retold in ScreenRant, "The Secret Reason
  Why Stands Were Created,"
  https://screenrant.com/jojos-bizarre-adventure-stands-created-secret-reason/.
  In Araki's own university-lecture summaries he describes Stands as guardians that
  would "stand" by their master (Interview Archive, URL above). Either way, the staging
  constant is identical: **the presence is beside/behind the user, looming, in frame.**
- **Ability first, person second.** Araki explains that a Stand's ability is often the
  *first* element he conceives for a character, and he then develops the character's
  personality and appearance in harmony with that power (Stand reference, JoJo's Bizarre
  Wiki, URL above). Design pairing is therefore not decoration applied afterward — the
  pair is designed as one unit from a single seed.

### 2.2 The rules that create the staging grammar

The manga itself codifies the Stand rules (summarised on the cover page of chapter 139
and a later bonus chapter; full list archived at the JoJo's Bizarre Wiki Stand page,
URL above). The ones that dictate *staging*:

- **A Stand is part of its user; damage is reflected between them.** What happens to the
  presence happens to the person. Staging consequence: user and Stand react as one
  body — a hit on the Stand snaps the user's head; the pair shares one performance.
- **Power is inversely proportional to range.** The further a Stand operates from its
  user, the weaker and less precise it becomes. Close-range power types work within
  roughly two metres of the user (e.g., The World, per Manual do Bruxo's rules
  breakdown, https://manualdobruxo.com.br/jojo-bizarre-adventure-stands-what-most-people-get-wrong-1w3p);
  long-range types trade strength for reach (Hierophant Green's strings travel blocks,
  but the body is frail). **Staging consequence: distance is a readable stat.** How far
  the presence stands from its user tells the audience the pair's whole combat economy
  before anything happens.
- **Only Stand users can see Stands; only a Stand can harm a Stand.** To a non-user, a
  fight looks like a person battling thin air. Staging consequence: scenes can run two
  realities in one frame — the calm visible world and the violent true one.
- **One person, one Stand; the Stand acts as guardian**, sometimes protecting the user
  without direct orders (rules archive, URL above). Staging consequence: the presence
  has a default "post" — it returns to guard position beside/behind the user the way a
  bodyguard returns to station.
- **Form taxonomy.** Stands are classified as natural humanoid, artificial humanoid,
  non-humanoid (creature/object), and phenomenon types (rules archive, URL above) —
  i.e., the "partner presence" need not be humanoid at all; what defines it is pairing
  and post, not anatomy.

### 2.3 Visual pairing rules: how a Stand is designed to sit next to its user

From Araki's published art-book commentary (*JOJOVELLER* Stand Guide) and his
*Jojonium* Vol. 15 interview, plus design analysis of the published work:

- **Fusion construction.** Araki, in the *Jojonium* interview: when designing Stands he
  often takes inspiration from artifacts — clothing, masks, dolls of indigenous peoples —
  and fuses that with something biological or mechanical; he imagined Stands as something
  inorganic powered by life force, hence designs that fuse living beings with machines.
  He names The Fool (a dog fused with a Native American mask and car tires) as close to
  his ideal Stand design (interview excerpt reproduced in neonUFO, "Analysis of Stand
  Design," https://neonufo-jjbameta.weebly.com/analysis-of-stand-design.html).
  Pairing lesson: the presence is built from the *user's world* (their culture, trade,
  obsessions) rendered as artifact+organism.
- **Personality externalised — including the flaw.** Araki's *JOJOVELLER* commentaries
  consistently explain a Stand's look through its user's psychology and theme: a cooking
  Stand (Pearl Jam) got a "somewhat crazy appearance based on tomatoes and Italian
  vegetables" because he wanted suspense built from cooking; Echoes was designed to
  *change forms across Acts* because he wanted to draw its user Koichi's growth — larva,
  then child, then a form Araki describes as Koichi's image made into a Stand, with its
  own personality, "like a friend" (*JOJOVELLER* Stand Guide, pp. 84–98, archived at
  https://jojo.fandom.com/wiki/JOJOVELLER/Commentaries).
  Pairing lesson: the presence shows what the user *is becoming* or *cannot say*, not
  just what they can do.
- **Silhouette echo and contrast.** In the published designs, a pair reads in one of two
  modes: **echo** — the Stand repeats the user's silhouette language at larger scale
  (a broad-shouldered user with a broad-shouldered humanoid presence; the presence is
  the user's outline with the volume turned up), or **contrast** — a small,
  unimposing user paired with a hulking presence (or the reverse: a huge user with a
  tiny, precise presence). Design analysis of Parts 3–4 notes the gradual unification
  of a house language for Stands — shared eye design ("Stand eyes," first standardised
  on Hierophant Green), recurring mask/mouth hardware — which makes members of the
  category read as one species of thing while each stays individual (neonUFO, URL
  above). Pairing lesson: *category consistency, individual variation* — the audience
  must instantly know "that is a partner-presence" and "that one belongs to her."
- **Colour relationship.** Pairs are colour-keyed: matched (presence in the user's
  dominant hue family — the gold user with the gold presence), complementary
  (presence in the opponent hue, marking the presence as the user's *other* self), or
  material-keyed (Araki's hero Stands of Parts 3–6 are named for materials — Star
  **Platinum**, Crazy **Diamond**, **Gold** Experience, **Stone** Free — and designed
  with that material's colour/finish as the anchor) (Stand reference, JoJo's Bizarre
  Wiki, URL above). Because the anime re-keys colour per scene anyway (§1.3), the
  *relationship* between the two palettes is the constant, not the literal colours.
- **Size/mass relationship.** The presence is usually at or above the user's scale —
  it looms (the lamp/guardian origin, §2.1). Where it is smaller, that smallness is
  itself the characterisation: precision, sneakiness, or a child-stage of growth
  (Echoes ACT1–2 vs ACT3, *JOJOVELLER*, URL above).

### 2.4 Presentation grammar in frame

- **The emergence.** A Stand's arrival is staged, not casual: the presence resolves
  out of/behind the user — over the shoulder, rising behind the back, sliding out from
  the user's silhouette — usually with a dedicated SFX glyph for the appearance and a
  beat of hold once fully present (SFX catalogue, Diffsense, URL above — secondary;
  emergence staging is consistently documented in adaptation analyses, AnimePapa,
  URL above). The user typically strikes or settles into their pose *as* the presence
  completes the composition: the pose is the "full stop" of the emergence sentence.
- **Partial concealment.** Especially for antagonists and first reveals, the presence
  is shown in part — an arm, a masked face over a shoulder, a shape in shadow behind
  the user — before any full view. Concealment is information control: the audience
  (and the opponent) is made to price the threat before seeing it whole.
- **The two-shot as default unit.** Because range is short for power types (§2.2), the
  canonical frame is the pair in one composition: user foregrounded in their stance,
  presence behind/above, both eyelines converging on the same target. The pair reads
  as a single two-headed actor: the user *decides* (face, gaze, pose), the presence
  *executes* (fists, effects). In dialogue scenes the presence commonly hovers in
  guard post, reacting in small ways the user suppresses — the second actor carrying
  the subtext.
- **Distance as acting.** Within the pair's choreography, closing or opening the gap
  between user and presence is a legible beat: presence drifts forward = intent to act;
  presence recalled tight = defence/fear; presence sent far = the pair accepting
  weakness for reach (§2.2 range rule made visible).

### 2.5 Aura, menace, and the reveal

- **Menace staging stack.** A threat reveal assembles, in order of escalation: (1) the
  pose (stillness), (2) glyph drift (ゴゴゴ entering frame edges), (3) colour re-key
  (§1.3), (4) sound — rumble or drop-out (§1.3), (5) the presence's emergence or a
  tightening of its guard post. Any subset reads as "pressure"; the full stack is
  reserved for true reveals. The glyphs' anime behaviour — jitter, growth, tinting to
  scene light — keeps them as *atmosphere*, not captions (Diffsense, URL above).
- **The Stand reveal as episode event.** A first full reveal combines all of it:
  concealment broken, emergence, pose-hold, colour shift, and the pair's two-shot
  locked for a breath before action resumes. It is staged like a character
  introduction because it is one — the audience is meeting the second cast member.

### 2.6 Battle choreography grammar

- **Pose → strike rhythm.** Exchanges are built as: approach/talk → pose-hold (the
  threat is *posed*, §1.6) → release. The hold loads the strike; cutting the hold
  short is itself a shock device.
- **The rush (barrage).** The signature release: the presence delivers a high-speed
  fist barrage while the pair's shared battle cry repeats rhythmically — Star
  Platinum's "ORA ORA" first appeared against Hierophant Green in chapter 119 (1989),
  and DIO's "MUDA MUDA" answered it in their final clash (Stand-cry reference,
  Dubbing AI, https://dubbingai.io/voice-changer/jojo — tertiary, for the date/detail
  only). Animation-wise the rush is handled with speed effects, smearing, and
  frequently a freeze or slow-down at its peak rather than literal per-punch clarity
  (AnimePapa, URL above). Note the structural point: the cry belongs to user *and*
  presence as one voice — the pair performs as a single instrument.
- **The counter-pose.** Defensively, a character may pose *to be hit* — the stance
  itself is the trap (the pose as bait is a recurring gambit structure in the series'
  fight writing; cf. game-adaptation move documentation of pose-counters — tertiary).
  Choreography lesson: in this grammar, posing is not the pause between actions; it is
  one of the actions.
- **Aftermath hold.** Victories and defeats end on a held pose tableau, not on the
  last blow — the final image of an exchange is a composition, allowing the colour
  grade to restore and the sound to settle (§1.3).

---

## PART 3 — THE MOCHIICHAO APPLICATION (native system)

Mochiichao translation, in one line: **Mochiko is the user; each creature is the
partner-presence.** The garden's creatures already live by Stand-like rules — they are
bonded to the keeper, they act on her behalf, they have limited "range" (the garden,
their home patches), and per the show's voice law the creatures DO NOT speak words —
they vocalise cries and sounds only, while humans speak. That last law makes the JoJo
transfer *more* apt, not less: JoJo's grammar is built for characters whose meaning is
carried by pose, presence, and cry rather than dialogue (§1.6.4, §2.6).

Working name for the native system: **PRESENT poses** (a creature "presents" beside
its keeper) — original terminology, no JoJo vocabulary imported into the show's own
documents beyond this research draft.

### 3.1 (a) Pose vocabulary per creature type

Every creature gets a **stance dossier** (Araki's "investigative report" method, §1.4)
from which poses are derived. Four dramatic functions, mapped from §1.6, in cute-cast
register:

| Function (JoJo job) | Mochiichao register | Stage picture |
|---|---|---|
| REVEAL pose | "First Presentation" | Creature's signature full-body stance, held 12–24f, keeper's colour grade warms; used at introductions and episode cold-opens |
| TENSION pose | "Brace" | Creature plants between keeper and threat, body lowered/widened, silhouette at maximum width; keeper behind, small |
| JOY pose | "Bloom" | Maximum S-curve the body plan allows; the creature's motif feature (fin, flame, sprout, smoke) at full display; 2s-bounce settle |
| MENACE pose | "Wrongness" (Dark Forest register) | Stillness, not size: creature frozen mid-gesture, motif feature *stopped* (flame unlit-flicker, smoke not drifting); see §3.3 |

**Per body-plan vocabularies** (derived from the rig scaffolds' `body_plan` values —
the pose grammar follows the skeleton, exactly as JoJo's follows each character's
build):

- **compact_round (Mochii).** No limbs to choreograph — the pose language is *whole-body
  signification* (§1.1): squash into a wide defiant pancake (TENSION), stretch into a
  tall teardrop exclamation (REVEAL), S-curve via asymmetric cheek-puff and lean
  (JOY). Hands-punctuation is replaced by **surface punctuation**: cheek marks and the
  droplet tip act as the "pointing finger."
- **bipedal_amphibian (Dorowani).** The cast's true JoJo body: hips, shoulders, arms,
  hands. Full contrapposto available — weight on one leg, hip cocked, dorsal fin
  breaking the back line, one hand presented flat (the host's "welcome") or pointed
  (the host's "look!"). Dorowani carries the show's *declaration* poses; he is the
  greeter, so his vocabulary leans presentation-forward (open palms, chest out).
- **bulky_bruiser (Gabu).** The straight-line anchor (Caesar function, §1.2): wide
  planted stance, vertical fist/arm as the composition's pillar, laugh poses that throw
  the head back and open the whole chest. Gabu's TENSION pose is the garden's wall —
  in a dyad he is always the line to someone else's curve.
- **small_feline (Kittember).** Curve incarnate: spine S-curves are native to a cat.
  Signature punctuation is the **tail** — and per owner canon the flame rides the tail
  TIP, so every Kittember pose is composed tail-first: tail raised with flame high =
  REVEAL/alert; tail curled around the body, flame cupped = JOY/calm; tail lashing,
  flame streaming sideways = TENSION. The flame is her glyph-layer: it brightens at
  holds the way JoJo's colour re-keys.
- **small_plant_biped (Sproutle).** Posing via *growth posture*: sprout/helmet line is
  the silhouette signature. REVEAL = full "sun salutation" stretch, visor catching
  light; TENSION = rooted crouch, arms spread as if bracing a pot; JOY = sway-dance
  with the sprout describing the S-curve the spine can't.
- **ghost_float (Wispkin).** No ground contact — contrapposto is replaced by *drift
  geometry*: body tilts against its own smoke trail so figure and trail form the
  S-curve together. The skull mask (owner canon) is the face-punctuation: mask angled
  down + hands gripping its edges = shyness (REVEAL is a *peek* — mask emerging from
  behind the keeper or a tree, §2.4 concealment grammar, played gentle); mask tilted
  up to the light = rare JOY. MENACE register: Wispkin perfectly still, smoke
  *not moving*, is the garden's scariest image (§3.3).

### 3.2 (b) Creature + keeper paired composition rules

The Stand grammar (§2) restated as Mochiichao staging law. These are composition
rules for boards and rig blocking, not story rules:

1. **The Post.** Each creature has a default guard post relative to Mochiko —
   over her shoulder, at her hip, above her head, behind her legs — derived from its
   body plan and temperament (Wispkin: behind/above, half-concealed; Gabu: front-flank,
   full view; Kittember: at her feet or on the fence beside her, tail up). The pair's
   two-shot always begins from Post. (Stand guard-post rule, §2.2.)
2. **Emergence staging for reveals.** A creature entering a scene "presents": it
   resolves into frame from behind the keeper, over her shoulder, out of her shadow
   or the garden feature she's beside — never a plain walk-in for a *first*
   presentation in an episode. Full Presentation (pose + hold, §3.1) completes the
   emergence. (Emergence grammar, §2.4.)
3. **Echo vs. contrast pairing (one per pair, fixed).** Each keeper–creature pair is
   assigned ONE silhouette relationship and keeps it all series: **echo** pairs repeat
   the keeper's shape language (Mochiko + Mochii: round-on-round, the creature as her
   outline with volume up) or **contrast** pairs oppose it (Mochiko + Gabu: small
   keeper, wall of creature; Mochiko + Wispkin: solid girl, dissolving ghost).
   Consistency is what makes it a signature (pairing rules, §2.3).
4. **Colour relationship, not colour copy.** Each creature's accent is keyed to
   Mochiko's palette as match or complement and stays in that *relationship* through
   scene colour shifts (the grade may re-key — Persona 5 one-dominant-colour rule and
   JoJo scene-specific colouring agree here — but pair relationships hold). Concrete:
   Dorowani's fin-red is the accent Mochiko's outfit never wears — he carries her
   complementary accent *for* her.
5. **Distance is a readable stat.** Creature within arm's reach of Mochiko = bonded,
   calm, "close-range" trust. Creature at the edge of its home patch, keeper calling
   across the gap = strain, independence, or a sulking beat. Boards must *show* the
   gap; scripts should write distance, not just dialogue. (Range rule, §2.2.)
6. **Shared reaction.** The pair performs as one body (§2.2 damage-reflection,
   translated to emotion): a startle hits the creature a beat *before* Mochiko
   (creatures sense first), and Mochiko's flinch echoes in the creature a beat after.
   In two-shots, eyelines converge on the same target except when the joke/beats
   needs them split.
7. **Second-actor rule.** In keeper dialogue scenes, the creature in Post carries the
   subtext Mochiko suppresses — drooping when she's brave-facing, flaming when she's
   embarrassed. The creature is cast in every two-shot as an actor, not a prop
   (§2.4 two-shot grammar).
8. **Group tableau (garden roll-call).** Multi-creature frames follow §1.5: every
   creature in its own signature pose, staggered depths, mixed facings, Gabu as the
   vertical anchor, stillness ranked by seniority — the eldest/most powerful creature
   moves least. Never a chorus line.

### 3.3 (c) Pose-holds × existing camera vocabulary × Dark Forest

The camera vocabulary already locked in `ENVIRONMENT-AND-CAMERA.md`:
`ESTAB-PAN`, `PUSH-ARRIVAL`, `HOLD-TENSION` (DBZ hold, seconds counted on the board),
`PUNCH-IN` (snap zoom at release), `STAGE-WIDE`, `CAMERA-THERE` (max 2/episode),
`STILL-FOREST` (locked frame, no drift, Dark Forest only).

- **HOLD-TENSION is now a pose event, not just a camera event.** Rule: a HOLD-TENSION
  board must name *whose pose* is being held (creature Brace, keeper declaration,
  pair two-shot). The hold's seconds are counted against the pose, and the release is
  either a PUNCH-IN (threat/action) or a slow PUSH (emotion) — never a plain cut, or
  the hold's charge is wasted. This is the JoJo pose→strike rhythm (§2.6) wired into
  the existing terms.
- **PUNCH-IN lands ON the pose.** The snap zoom's final frame must be the completed
  pose (fist planted, flame lit, mask revealed), not the motion toward it — the anime
  freezes at the snapshot (§1.3). Board notation: `PUNCH-IN → [pose name]`.
- **Colour re-key at holds (show version).** Following Tsuda's scene-specific
  colouring (§1.3) and the show's Persona 5 dominant-colour law: a Presentation or
  Brace hold may trigger a one-step grade shift in the location's dominant colour.
  Garden registers: Gate = warm push; Pond = cool deepen; Green = saturation bloom.
  The shift restores on the aftermath hold (§2.6).
- **Glyph layer, nativised.** Mochiichao does NOT import ゴゴゴ. The transferable
  principle is "atmosphere typography/motif drift at the frame edge during a hold."
  Native equivalents already in the show's language: drifting leaf/petal motes at
  frame edges for garden tension; Kittember's flame behaving like a glyph (flicker
  pattern = punctuation); subtitle-law moments (the show's silent-film subtitle rule)
  reserved for the rare true-menace beat. The motif must *move* (jitter/drift) and
  take scene light, per the anime's glyph behaviour (§2.5) — a static overlay is a
  sticker, not weather.
- **Dark Forest dread beats.** The Forest inverts every rule, which is what makes it
  dread: `STILL-FOREST` forbids camera drift; the pose grammar inverts with it.
  (1) **No Presentations in the Forest** — creatures do not strike signature poses
  there; a creature *failing* to pose (starting its Bloom and stopping) is the
  scare beat. (2) **Motif stop** — flame, smoke, sprout-sway and mote-drift all
  *cease* (§3.1 Wrongness register); in JoJo grammar, menace is glyphs arriving; in
  Forest grammar, menace is the garden's own glyphs *leaving*. (3) **The stinger
  rule** (locked EP01 stinger): something stops moving between the trunks, never
  shown; the Rule 12 subtitle burns in low and holds; one leaf falls straight down.
  That leaf is the Forest's only permitted "glyph" — a single falling object in a
  frame where even falling has stopped. (4) Keeper–creature distance rule inverts:
  in the Forest the creature presses *closer* than Post (against the keeper's leg,
  under her arm) — distance inversion as the fear tell (§3.2.5 read backwards).

### 3.4 (d) Rig pose-library additions (per pilot character)

Additions to the `pose_library` arrays in
`show/production/rigs/scaffolds/{character}.rig.json`. Naming convention follows the
existing snake_case style. Each entry: pose name — what it is — where it fires.
Existing library entries are untouched; these are additive.

**All six (shared dramatic set):**
- `present_reveal` — the character's First Presentation pose (§3.1) — cold-opens,
  introductions, episode-title beats.
- `brace_guard` — TENSION pose, max-width silhouette, planted — threat beats,
  HOLD-TENSION boards.
- `bloom_joy` — JOY pose, motif feature at full display — reunions, victories,
  musical beats.
- `wrongness_still` — the inverted pose: mid-gesture arrested, motif feature stopped
  — Dark Forest and dread beats ONLY (rationed; overuse kills it).
- `post_default` — the character's guard Post stance beside the keeper (§3.2.1) —
  the resting two-shot; every rig needs this as its true idle for paired scenes.
- `aftermath_hold` — post-action settled tableau pose — ends of exchanges (§2.6).

**Mochii** (compact_round — whole-body signification):
- `pancake_defiant` — squash to max width, cheeks puffed asymmetric — Brace variant.
- `teardrop_exclaim` — stretch tall, droplet tip quivering — Reveal punctuation.
- `lean_curve` — full-body S-lean with cheek-puff counterweight — Bloom base.

**Dorowani** (bipedal_amphibian — the declaration body):
- `host_welcome` — contrapposto, one palm presented flat, chest open, fin high —
  his Reveal; the garden's front door in one pose.
- `host_point` — torsion twist, arm extended in a flat point, gaze back over the
  shoulder against the point — declaration/attention beats. (Extends the existing
  `hero_stand`/`host_point` entries in his scaffold with a dedicated torsion pose.)
- `fin_flare_brace` — planted wide, dorsal fin and cheek fins at max spread — Brace.

**Gabu** (bulky_bruiser — the straight line):
- `wall_stand` — feet planted, one arm vertical, fist clenched, chin up — the dyad
  anchor pose (§1.2 line function); pairs with anyone's curve.
- `laugh_monument` — head thrown back, chest fully open, arms akimbo — Joy at
  architectural scale.
- `crouch_spring` — compressed coil, all mass low — pre-lunge beat for the EP01
  lunge-and-miss action grammar (pose→strike, §2.6).

**Kittember** (small_feline — tail-first composition):
- `tail_beacon` — seated tall, tail vertical, flame at its highest point above her
  head — Reveal; the flame is the exclamation mark.
- `tail_cup_calm` — loaf variant with tail curled around, flame cupped low and
  steady — Post default for quiet two-shots.
- `tail_lash_alert` — arched S-spine, tail streaming sideways, flame elongated —
  Brace (extends existing `startled_arch` into a held pose, not a flinch).

**Sproutle** (small_plant_biped — growth posture):
- `sun_salutation` — full upward stretch, sprout unfurled, visor catching light —
  Reveal.
- `rooted_brace` — low crouch, arms spread wide, sprout flattened — Brace; reads as
  "I am a fence."
- `sway_curve` — dance sway where the sprout draws the S-curve — Bloom base
  (extends existing `dance`).

**Wispkin** (ghost_float — drift geometry; skull-mask canon):
- `mask_peek` — mask emerging from concealment (behind keeper/tree), hands gripping
  mask edges, body still mostly smoke — his Reveal; a peek, never a flourish.
- `mask_down_shy` — mask angled down, hands over its crown, smoke pooled low — Post
  default / subtext actor (§3.2.7).
- `trail_curve` — body and smoke trail composed into one long S — Bloom/travel pose.
- `smoke_stop` — Wispkin's `wrongness_still` specialisation: smoke frozen mid-curl,
  mask facing camera dead-on — the single most rationed pose in the system; Dark
  Forest and stinger-adjacent beats only.

**Mochiko (keeper) — pair poses** (for the human rig, when built):
- `keeper_declare` — weight on one leg, one hand on hip, chin up: the keeper's
  echo-source pose that creature Presentations answer.
- `keeper_shelter` — crouch/open-arm stance that creatures' Forest-closeness
  (§3.3) plays against.

### 3.5 The line: inspired grammar vs. traced pose

**The line.** Everything transferred in this document is *grammar*: contrapposto,
torsion, hand punctuation, silhouette-first composition, pose-as-characterisation,
emergence staging, pairing relationships, distance-as-stat, hold-and-release rhythm.
These are centuries-old staging principles (classical sculpture and fashion
photography are Araki's own published sources) and are not ownable expression. What
must never transfer is *specific expression*: no JoJo character's actual signature
pose may be traced, rotoscoped, or reproduced recognisably (no character's famous
stance redrawn with a Mochiichao body in it), no Stand design, silhouette, costume,
or colour scheme may be adapted, and no JoJo names, glyphs (ゴゴゴ), or battle cries
enter the show. The test for any new pose in the library: it must be derivable from
the *creature's own* stance dossier and body plan (§3.1) — if the honest description
of how a pose was made is "we copied the shape from a JoJo panel," it fails the gate;
if it is "we applied counter-tilt, torsion, and a motif punctuation to this creature's
own skeleton," it passes. This is the show's standing construction-kit rule applied to
choreography: systems and principles come over; identity stays behind.

---

## Sources (published; cited inline above)

- Araki, Hirohiko. *Manga in Theory and Practice: The Craft of Creating Manga*
  (Shueisha 2015; VIZ Media 2017) — Italy/Bernini chapter (pp. 139–141) as quoted in
  "Araki Hirohiko: Elevating the Craft of Manga through Art Nouveau and Art Deco,"
  academia.edu:
  https://www.academia.edu/144207216/Araki_Hirohiko_Elevating_the_Craft_of_Manga_through_Art_Nouveau_and_Art_Deco
  · Book summaries: https://www.blinkist.com/en/books/manga-in-theory-and-practice-en ·
  https://www.thenile.com.au/books/hirohiko-araki/manga-in-theory-and-practice/9781421594071
- Araki, Hirohiko. Author's note, *Stardust Crusaders* (1989), archived:
  https://jojo.fandom.com/wiki/Author%27s_Note_(Stardust_Crusaders)
- Araki, Hirohiko. Interview, Shueisha Manga Million:
  https://mangamillion.shueisha.co.jp/en/featured/79
- Araki, Hirohiko. *JOJOVELLER* Stand Guide commentaries (Echoes, Pearl Jam, et al.),
  archived: https://jojo.fandom.com/wiki/JOJOVELLER/Commentaries
- Araki, Hirohiko. *Jojonium* Vol. 15 interview (Stand design fusion; The Fool),
  excerpted in neonUFO, "Analysis of Stand Design":
  https://neonufo-jjbameta.weebly.com/analysis-of-stand-design.html
- Araki, Hirohiko. *JoJo 6251* interview (1993), retold in ScreenRant:
  https://screenrant.com/jojos-bizarre-adventure-stands-created-secret-reason/
- Tsuda, Naokatsu. Interview, Anime News Network (2015) — scene-specific colouring:
  https://www.animenewsnetwork.com/feature/2015-07-16/interview-jojo-bizarre-adventure-director-naokatsu-tsuda/.90413
- Tsuda, Naokatsu. Fan-event interview summary (colour-change rationale, Medicos
  palettes), Interview Archive: https://jojo.fandom.com/wiki/Interview_Archive?file=ArakiFamicomJump.jpg
- Stand concept & rules (manga ch. 139 summary; guardian-spirit origin; ability-first
  design): https://jojo.fandom.com/wiki/Stand
- "Menacing / ゴゴゴゴ," Know Your Meme:
  https://knowyourmeme.com/memes/menacing-%E3%82%B4%E3%82%B4%E3%82%B4%E3%82%B4
- "Canon Comparisons: How JoJo's Bizarre Adventure Adapts Its Manga Across
  Generations," AnimePapa:
  https://animepapa.com/article/canon-comparisons-how-jojos-bizarre-adventure-adapts-its-manga-across-generations/
- "Joseph and Caesar Pose," Manual do Bruxo:
  https://manualdobruxo.com.br/joseph-and-caesar-pose-why-this-jojo-stance-still-dominates-anime-culture-sol
- "Why JoJo's Bizarre Adventure Drawing Styles Keep Changing," Manual do Bruxo:
  https://manualdobruxo.com.br/why-jojos-bizarre-adventure-drawing-styles-keep-changing-and-how-to-master-them-1k5y
- "JoJo Bizarre Adventure Stands: What Most People Get Wrong" (range figures),
  Manual do Bruxo:
  https://manualdobruxo.com.br/jojo-bizarre-adventure-stands-what-most-people-get-wrong-1w3p
- "Unveiling Hirohiko Araki's Bizarre World," The Diplomat Rio:
  https://thediplomariot.com/blog/unveiling-hirohiko-arakis-bizarre-world-a-master-mangaka-1764804931
- "JoJo's Bizarre Adventure Fashion & Poses" and Stardust Crusaders study,
  Shapes.inc (accessed via search index; no stable URL available).
- Secondary/tertiary, flagged where used: GoodNovel Q&A syntheses on pose/personality;
  Diffsense VFX onomatopoeia sheet (anime glyph behaviour);
  https://diffsense.com/jojo-vfx-onomatopoeia-sheet-why-these-sounds-hit-different-1jnn;
  Dubbing AI (Stand-cry first-appearance detail): https://dubbingai.io/voice-changer/jojo

*Draft status: research complete; Part 3 is a proposal for owner review before any of
it is promoted into the show bible or rig scaffolds.*
