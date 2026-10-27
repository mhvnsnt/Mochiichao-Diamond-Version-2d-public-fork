# DONOR PULL-INS — DRAFT
## What each donor show's *production system* gives Mochiichao, and how it wires in

**Status:** DRAFT for Jamar's review — research/wiring notes, not yet committed to the repo.
**Date:** 2026-10-27
**Scope rule (Jamar's settled construction-kit rule — presumed, not re-litigated):** Donors contribute ONLY the construction kit: tools, pipelines, resources/materials, environments, props, rig systems/specs, conventions, and systems code. Backgrounds / environments / props may be adapted directly. **No source characters, no character names, no logos/branding are carried into Mochiichao.** Anything identity-bearing in a donor (a specific character's mouth pack, eyes, hands, rig, silhouette, voice) is **rebuilt natively for the Mochiichao cast from the system**, never carried over as itself.

**How to read each entry:** Every pull-in is tagged three ways —
- **What it is** — the donor's production system/quality, in production terms.
- **Mochiichao-native form** — what it becomes once rebuilt for Mochii, Dorowani, Gabu, Kittember, Sproutle, Wispkin, Mochiko and the Garden. No donor names/characters survive this step.
- **Serves** — one or more of: `environments` · `FX` · `camera` · `post` · `sound` · `format`

Mochiichao anchors used throughout (from locked canon): creatures speak **pure cries/sounds only**; subtitles appear **only at important moments** (silent-film intertitle law); humans (Mochiko) speak words; EP01 = "The Garden Has a Ghost" (~6 min, 3 locations — Gate / Pond / Green, Dark Forest stinger); style stack = Pokémon base + Digimon bond + JoJo posing/menace + Persona 5 pop + Tamagotchi/digicore care-tech.

---

## 1. Ed, Edd n Eddy (a.k.a. Cartoon, Danny Antonucci)

The most useful donor for *texture and sound*. Ed, Edd n Eddy was the last major series produced on traditional cels (switching to digital ink-and-paint only in 2004), and its signature "boiling line" was made by tracing the same drawing three times so outlines constantly shimmer — Antonucci said it "helps keep the characters alive" and likened it to 1930s cartoons [1][2]. Its sound world was built from bespoke foley (squeaking balloons, bowling balls on floorboards, metallic clangs) over jazz/brass percussion rather than a stock library [3].

### Pull-ins

**1a. Boil-line as a *living-line* post pass**
- **What it is:** 3-trace boiling outline — held poses never sit dead; the line itself breathes.
- **Mochiichao-native form:** A procedural 3-frame line-wobble pass applied in post to puppet holds and generative clips alike: outline displacement cycling on 3s, amplitude keyed per character (Wispkin highest — smoke body; Mochii medium — gel body; Mochiko lowest — she's the "real" anchor). This is the cheapest known cure for the "slideshow still" problem: a held pose with boiling line reads as *alive and choosing to hold*, which is exactly the JoJo-style held tension the style stack wants.
- **Serves:** `post` · `FX`

**1b. Cul-de-sac world-economics: one small place, exhaustively known**
- **What it is:** A single suburban cul-de-sac (plus junkyard/woods edges) reused for a decade; the constraint forced invention *inside* the location instead of new locations. Backgrounds carry the jokes (posters, junk, sticky notes).
- **Mochiichao-native form:** The Garden is built once as a master set (Gate, Pond, Green, keeper's hut, Dark Forest edge) and *never* redesigned per episode — episodes invent new *uses* of known corners. Every BG plate ships with a "lived-in layer": keeper board, worn paths, a toy duck left somewhere — props that persist between episodes so the audience learns the Garden like a home. EP01's mystery literally runs on this: things are *moved* in a place the audience already trusts.
- **Serves:** `environments` · `format`

**1c. Bespoke foley + jazz-percussion sound identity**
- **What it is:** Found-object foley and musical stings timed to physical gags; sound effects act as punctuation, not decoration [3].
- **Mochiichao-native form:** Build a small *recorded* foley kit for the Garden (gate latch, pond plops, leaf-rustle, wood knocks, duck squeak) and score creature cries against it rhythmically. Since creatures don't speak words, foley *is* dialogue support: Wispkin's appearances get a signature cold-shimmer + soft knock motif; Gabu's failed lunge lands on a sting, not a generic thud. Two EP01 SFX gaps already flagged (cold-spot shimmer, gate bell) are filled from this kit, recorded — not library-pulled.
- **Serves:** `sound`

**1d. The scam mechanism → the *desire* mechanism (gag engine)**
- **What it is:** Every episode is a machine: want one concrete thing (jawbreakers) → build an elaborate contraption/scheme → machine collapses by its own logic. The humour is the *mechanism*, played straight.
- **Mochiichao-native form:** Garden episodes run a care-loop machine instead of a scam machine: a creature wants one concrete thing (a dry sleeping spot, the shiny thing in the pond, a proper introduction — Wispkin in EP01) → the Garden's inhabitants build an elaborate, sincere attempt → it collapses by garden logic → the collapse *reveals* the real want. Same engine, kindness instead of greed. This is a writing-room template, filed with the house writing standard.
- **Serves:** `format`

---

## 2. Foster's Home for Imaginary Friends (Craig McCracken)

The closest structural relative Mochiichao has: a house full of wildly different creatures, run on rules, visited daily by a human kid. Foster's was Cartoon Network's first series animated primarily in Adobe Flash — hand-drawn art processed in Illustrator, characters built in Flash, composition in After Effects [4][5] — i.e. a **symbol/puppet pipeline with an enormous cast**, which is precisely Mochiichao's production shape.

### Pull-ins

**2a. Creature-variety system: one house, no two body plans alike**
- **What it is:** The house justifies unlimited creature design variety because the *premise* generates the variety (every child imagines differently). Designs range from near-humanoid to abstract, yet read as one world through shared line/colour discipline.
- **Mochiichao-native form:** The Garden's 47 canonical species are already this system — the show formalises it: species are introduced by *garden function* (night keeper, pond crew, green-tenders) the way Foster's introduces friends by house role, and new-species episodes use the "new arrival at the gate" ritual. Design discipline (shared ink, sampled palette, Bungee/Fredoka type world) is what lets a slime, a turtle, a cat and a smoke-wisp share a frame.
- **Serves:** `format` · `environments`

**2b. House-as-world: the building is the map**
- **What it is:** One Victorian mansion contains every story space — halls, rooms, grounds — so production builds a single deep location bible instead of many shallow ones.
- **Mochiichao-native form:** The Garden gets the Foster's treatment one level out: a location bible where every area connects physically (Gate → path → Pond → Green → hut → Forest edge), with master plates + detail plates per area, and a strict rule that camera geography never contradicts the map. The Dark Forest stinger works *because* the audience knows exactly where the Forest sits relative to the safe Garden.
- **Serves:** `environments`

**2c. Flash-symbol puppet pipeline, honestly budgeted**
- **What it is:** First CN show built primarily in Flash with Illustrator→Flash→After Effects flow [4][5] — proof a small team can sustain a huge cast with symbol libraries (mouths, eyes, hands as swappable Graphic symbols).
- **Mochiichao-native form:** This validates the existing Mochiichao rig standard (Tahoma2D symbol frames, per-species viseme/expression packs, `MC[ep]ORIGINAL_PUPPET_[CHAR]_VERSION_[###]` naming) and adds the Foster's lesson: build the *library depth* per character in proportion to screen time — pilot six get full symbol sets; background species get 6-pose sets. EP01 only needs full sets for Wispkin, Gabu, Kittember + Mochiko.
- **Serves:** `FX` · `format` (production pipeline)

**2d. House rules as story fuel**
- **What it is:** The home runs on explicit rules (visiting conditions, adoption risk); rules create stakes without villains.
- **Mochiichao-native form:** Already canon — the Keeper's Manual and its Rules (Rule 12 is the EP01 stinger). Foster's contributes the *cadence*: state a rule early, let the episode bend it, pay it off in the tag. Each episode's beat sheet names which Manual rule it touches.
- **Serves:** `format`

---

## 3. Bakugan (TMS Entertainment / Spin Master)

An anime built as a *presentation system* for a physical game: cards rain from the sky, spring-loaded balls land on metal gate cards and pop open into creatures, and battles are staged as rituals with fixed verbal/visual beats [6][7]. Ignore the IP; steal the **ritual grammar**.

### Pull-ins

**3a. Transformation/summoning sequence as reusable BANK**
- **What it is:** A fixed, high-energy sequence (throw → land → transform → roar) reused every battle with variations; the repetition *is* the pleasure, and it saves enormous production cost.
- **Mochiichao-native form:** The Garden gets two BANK rituals, built once at full quality: (1) **Gate arrival** — a new creature's first entry through the Garden Gate, keeper board updated; (2) **Bond moment** — Mochiko + creature synchronise (device chime, shared look, cry answered) for emotional peaks and evolution-adjacent growth beats later. In EP01 neither is spent at full length — the Wispkin reveal borrows the *last 3 seconds* of the bond grammar (rise + light + cry) so the full sequence still feels new when it debuts properly.
- **Serves:** `FX` · `format`

**3b. Device/card UI language**
- **What it is:** The game is legible through objects — cards with metal cores, a launcher, power numbers (G-Power) that pop on screen. The UI tells the audience the state of play without dialogue.
- **Mochiichao-native form:** Mochiko's keeper device (digicore/Tamagotchi end of the style stack) gets a Bakugan-grade UI kit: species plate, mood/health pips, night-shift log — designed as physical-feeling cards/panels in Persona-5 pop style. In EP01 the device shows one unexplained data point (a presence logged at 3:12 AM) — the mystery's first clue, delivered by UI, not exposition.
- **Serves:** `FX` · `post` · `environments` (props)

**3c. Arena staging for creature-vs-creature beats**
- **What it is:** Battles happen in a defined field with clear phases (set card → stand → ability → resolve), shot wide-then-close so power reads instantly.
- **Mochiichao-native form:** Garden "contests" (never battles-to-harm in the garden's care register) use the same phase clarity: wide establishing → the attempt → reaction close → resolve wide. EP01's Gabu lunge-and-miss is staged exactly this way, which is why it reads in 7 seconds of storyboard.
- **Serves:** `camera` · `FX`

---

## 4. Gumball — The Amazing World of Gumball (Bocquelet / Boulder Media)

The documented mixed-media outlier: traditional 2D + 3D CGI + puppetry + stop-motion + **live-action photographic backgrounds**, unified in compositing — which is why it was written by a writers' room *and* heavily boarded (detailed layout was a production necessity, not a preference) [8][9]. Compositors manually added shadows, rim light and reflections so 2D characters sit *in* photographic space [9].

### Pull-ins

**4a. Mixed-media compositing discipline (the glue spec)**
- **What it is:** Different media per element, one compositing standard: matched light direction, cast shadows, rim light, grain/grade pass over everything.
- **Mochiichao-native form:** This is the licence + the method for Mochiichao's hybrid production (puppets + generative parts + painted plates). Written as a comp spec: every shot, whatever its source, passes (1) shadow/rim pass, (2) Garden grade (sampled brand blues, one dominant colour per sequence), (3) boil-line pass (from §1a). A shot that skips the glue pass doesn't ship — this is the technical form of the Likeness/Style law.
- **Serves:** `post` · `FX`

**4b. Photographic/texture plates under painted worlds**
- **What it is:** Real photographed locations (Vallejo, CA) as Elmore's foundation, stylised in comp rather than imitated in paint [8][9].
- **Mochiichao-native form:** Garden detail (bark, pond water, stone, leaf litter) can be sourced from photo texture and *graded into* the painted style — used sparingly for close-up story props (the Manual's pages, the keeper board's wood) where tactility sells the moment. The accepted generative Garden Gate plate is the first asset produced under this rule.
- **Serves:** `environments` · `post`

**4c. Script-then-board hybrid for complex sequences**
- **What it is:** Gumball is the exception to CN's board-driven default *because* mixed media needs precise layout planning [8].
- **Mochiichao-native form:** Already adopted in the episode-planning method; Gumball adds the trigger rule: any sequence mixing ≥2 media (e.g. puppet Wispkin over generative smoke over painted Forest) must be scripted + layout-planned, never improvised at assembly. EP01's stinger is the first sequence produced under this rule.
- **Serves:** `format` · `camera`

---

## 5. Dexter's Laboratory (Genndy Tartakovsky)

Tartakovsky staged the lab *cinematically* — depth, variable shot sizes and pacing, comedy built into action rather than dialogue — drawing timing from Robert Cannon, Bob Clampett and Chuck Jones, with Hanna-Barbera-style limited mouth/nose design for animatability [10][11]. The crew's stated rule: "Whatever we could do to not have dialogue and tell more story, we did," with fast cutting that skips transitions and lands on visual impact [12].

### Pull-ins

**5a. Visual-first storytelling / dialogue-last**
- **What it is:** Stories told in action and staging; dialogue is the last resort, not the carrier [12].
- **Mochiichao-native form:** This is the production twin of the creature voice law. EP01 already runs on it (Mochiko interprets by reaction; subtitles appear 3 times total). Dexter's contributes the *board discipline*: every beat sheet line must name the visual that carries it; a beat that only works as a spoken line gets rewritten.
- **Serves:** `format` · `camera`

**5b. The lab as a *systems* environment**
- **What it is:** The lab isn't a backdrop — it's a machine with levers, sequences and cause-effect the audience learns; gags are staged in depth through its machinery [10].
- **Mochiichao-native form:** The Garden's systems get the same treatment: irrigation runs, the pond's cold spot, the gate's bell-and-board check-in. Each system is designed once (prop sheet + operation cycle) and then *used* by stories. EP01's mystery is a systems story: the cold spot (Wispkin) moves through systems the audience is learning.
- **Serves:** `environments` · `FX`

**5c. Machine-operation montage (the "robot hand" sequence)**
- **What it is:** Tartakovsky repeatedly restaged a beloved film sequence of hands/machines assembling something, as a rhythmic visual mantra for building [12].
- **Mochiichao-native form:** A keeper-routine montage grammar for Mochiko's morning rounds (open gate → board check → feed scatter → pond skim), cut on action with foley rhythm (§1c). Built once for EP01's cold open; reused as BANK with seasonal variations. Establishes Mochiko's competence wordlessly in 20 seconds.
- **Serves:** `camera` · `sound` · `format`

---

## 6. Codename: Kids Next Door (Mr. Warburton)

A global kids' organisation run from a treehouse, armed with **2×4 technology** — elaborate devices built from household objects, wood and tape (a ray gun from a jalapeño-sauce bottle, a generator that's a hamster wheel) [13][14]. The world system (sectors, operations named by acronym, decommissioning at 13) gave a silly premise total internal seriousness.

### Pull-ins

**6a. 2×4 prop language: junk-built, function-legible**
- **What it is:** Every device is visibly *made of stuff* — you can read how it works from its parts; acronym naming makes each one feel catalogued and real.
- **Mochiichao-native form:** Keeper tech is built 2×4-style from garden stuff: vine-and-wood water gates, a leaf-press field journal, the keeper device cradled in a carved wooden dock. Props get catalogue entries in the parts catalog (name, materials, function, which episode built it). This directly serves the digicore end of the style stack: tech that looks *grown and repaired*, not manufactured.
- **Serves:** `environments` (props) · `FX`

**6b. Treehouse logic: a HQ that is also a system diagram**
- **What it is:** The treehouse is simultaneously home, fortress and organisation chart — its rooms *are* the team's roles.
- **Mochiichao-native form:** The keeper's hut + Garden layout gets an organisational layer: keeper board = who's on shift; pond = day crew; Forest edge = night shift territory. When Wispkin is revealed, the audience learns the Garden has a *night organisation* they never saw — a KND-grade "the world was bigger than you knew" beat, delivered with one board update.
- **Serves:** `environments` · `format`

**6c. Played-straight seriousness (tone spec)**
- **What it is:** KND treats kid stakes with spy-thriller gravity; the comedy comes from the gap, never from winking.
- **Mochiichao-native form:** Written into the house standard as the anti-slop clause: the Garden's small stakes (a shy night keeper wants an introduction) are staged with full mystery-thriller seriousness — JoJo menace in the Forest stinger included. Nobody on screen thinks it's cute. The audience supplies the cute.
- **Serves:** `format`

---

## 7. OK K.O.! Let's Be Heroes (Ian Jones-Quartey)

A world explicitly inspired by video games and shōnen manga, set in a plaza of hero shops in retro-future "201X," developed unusually: the pilot became a mobile game *first*, and the game rebuilt the world and character designs before the series was written [15][16]. Show and game were developed in correspondence so each represented the other faithfully [17].

### Pull-ins

**7a. Game-legible world layer (levels, cards, plaza)**
- **What it is:** Hero levels, POW cards and a shop-plaza hub make the world's rules readable at a glance; growth is *quantified* and celebrated.
- **Mochiichao-native form:** The Garden is already a game — OK K.O. contributes the show-side mirror: keeper board entries styled as species cards, care milestones celebrated on-screen (first successful night-shift handover = EP01's tag), and the Garden Gate functioning as the plaza hub every episode passes through. Because show and game share `cast.json` / parts catalog, a species card designed for the show is the game's card.
- **Serves:** `format` · `environments`

**7b. Cross-media development loop**
- **What it is:** Pilot → game → redesigned world → series; each medium's version improved the others [15][17].
- **Mochiichao-native form:** This is the documented precedent for Jamar's show-inside-the-game-repo decision. Formalised: any environment or prop built for an episode is filed back into the game repo's asset structure the same week (and vice versa — game garden-poses/battle BGs are show reference). The shared manifests are the loop's plumbing.
- **Serves:** `format` (production)

**7c. Everyone-is-a-hero ensemble warmth**
- **What it is:** A world where every background character has a level and a specialty — nobody is "normal," everybody belongs.
- **Mochiichao-native form:** Background species in crowd/garden shots are never generic: each gets a one-line function on the keeper board. This is Rule 12 ("everybody belongs to the Garden") as a *casting* policy.
- **Serves:** `format` · `environments`

---

## 8. Cow and Chicken (David Feiss)

Surreal suburban sitcom from Hanna-Barbera's Cartoon Cartoons era; Feiss — an animator first — animated the pilot himself over ~10 months to set the style, and the show's humour runs on absurd premises played with total commitment, grotesque squash-and-stretch, and a single shape-shifting antagonist who re-enters each episode in a new role [18][19].

### Pull-ins

**8a. Absurd premise, straight face (staging rule)**
- **What it is:** Impossible things (parents who are only legs; a devil in a new costume weekly) are staged as mundane; the camera never reacts.
- **Mochiichao-native form:** Garden weirdness (a toy duck rolling uphill in EP01) is shot deadpan — no zoom-punch, no sting; the *characters'* reactions carry the comedy. A staging note now attached to the storyboard plan: "the Garden is normal; only people are surprised."
- **Serves:** `camera` · `format`

**8b. Creator-animates-the-pilot style lock**
- **What it is:** The style was set by one animator producing the pilot personally, so the series had a physical reference, not just drawings [19].
- **Mochiichao-native form:** The Dorowani avatar-stack clips (the one owner-approved generative bundle) serve as Mochiichao's "pilot reference" for motion feel; new character animation — puppet or generative — is gated against that reference's timing/energy, not just against model sheets.
- **Serves:** `FX` · `post`

**8c. Gross-cute squash extremes (bounded)**
- **What it is:** Ren & Stimpy-lineage exaggeration — bodies deform far past model for one beat, then snap back.
- **Mochiichao-native form:** A *bounded* version for the gel/soft species only (Mochii, Wispkin's smoke): one extreme deformation per sequence, reserved for surprise/fear beats — Wispkin's startle-flatten in EP01's reveal. Hard species (Gabu's shell, Sproutle's helmet) never deform; contrast is the joke and the physics law.
- **Serves:** `FX`

---

## 9. Johnny Bravo (Van Partible)

Built on a single repeatable engine — supreme confidence meets instant rejection — with pose-driven comedy: Partible took inspiration from Michael Jackson's whip-snap pose accents, so entrances and boasts land as *poses with sound effects*, and the show's musical/jazz timing was a deliberate craft focus [20].

### Pull-ins

**9a. Pose-and-snap character punctuation**
- **What it is:** Character attitude delivered as held poses punctuated by whip-crack SFX; the pose *is* the line.
- **Mochiichao-native form:** Each pilot species gets 2–3 signature "snap poses" in its pose library (Gabu's proud chest-out, Kittember's tail-flame flare pose, Sproutle's visor-flip) with a matched foley tick from the Garden kit. In a no-dialogue creature show, snap poses are punctuation marks — they end scenes and top gags.
- **Serves:** `FX` · `sound`

**9b. The confidence engine (single-trait episode motor)**
- **What it is:** One trait, applied to any situation, generates the episode; failure is structural, not mean.
- **Mochiichao-native form:** A secondary motor alongside §1d: Gabu episodes run on *bravery performed* (he volunteers first, understands last); Kittember on *she noticed it first*. EP01 uses both in miniature: Gabu's lunge (bravery) and Kittember's tail flame reacting before anyone sees (noticing) are the mystery's Act 2 engine.
- **Serves:** `format`

**9c. Musical timing under physical comedy**
- **What it is:** Score and pose accents composed together; jokes land on beats, literally [20].
- **Mochiichao-native form:** EP01's cue sheet already maps cries/stems per beat; the Bravo rule adds: physical gags are *timed to the title-track stem grid* at animatic stage, not scored after. Gabu's miss lands on a musical pocket, held one beat too long.
- **Serves:** `sound` · `post`

---

## 10. Camp Lazlo (Joe Murray)

Murray explicitly built Lazlo as a return to nature — inspired by the "calming" tree-filled backgrounds of Bugs Bunny and Yogi Bear cartoons, a show about kids with *no high-tech stimulus*, in a camp whose facilities, rival camp across the lake and nearby town form a complete little geography [21].

### Pull-ins

**10a. Pastoral calm as a deliberate register**
- **What it is:** Nature backgrounds designed to *lower* the audience's heart rate; the comedy plays against calm, not chaos [21].
- **Mochiichao-native form:** The Garden's day register: long, still, green holds; birdsong bed; nothing moves unless a character moves it. This calm is a production asset — it's what makes the EP01 stinger (daylight that doesn't reach into the Forest, *no birdsong from inside*) frightening by subtraction. Sound + BG departments share one rule: calm is designed, not defaulted.
- **Serves:** `environments` · `sound`

**10b. Camp geography: two territories + a town**
- **What it is:** Camp Kidney / Acorn Flats across the lake / Prickly Pines town — a triangle of shabby home, shinier rival, and commerce [21].
- **Mochiichao-native form:** Garden geography triangulation for season planning: the Garden (home, hand-made) / the far side of the pond & Forest (wild, un-managed) / the human town edge (seen only as lights and the gate road — Mochiko's off-screen world). Rivalry energy exists between *managed* and *wild*, not between good and evil.
- **Serves:** `environments` · `format`

**10c. Low-tech story constraint**
- **What it is:** No high-tech stimulus allowed; problems are solved with camp stuff and social negotiation [21].
- **Mochiichao-native form:** A soft constraint per episode: the keeper device (§3b) may *notice* things but never *solves* them; solutions are physical/social (build it, carry it, apologise to it). EP01 obeys it — the device logs the presence; Mochiko solves it by staying up and saying hello properly.
- **Serves:** `format`

---

## 11. My Gym Partner's a Monkey (Tim & Julie McNally Cahill)

One human kid in an all-animal school: the environment itself is species-adapted — birds fly the halls, monkeys swing vine routes between classes, aquatic students swim underwater hallways, and signage solves species problems ("Do Not Eat the Other Students") [22][23].

### Pull-ins

**11a. Species-adapted environment design**
- **What it is:** Architecture follows inhabitants' bodies: every space answers "how does *this* species move/eat/sleep here?" [22].
- **Mochiichao-native form:** Garden design pass with a per-species affordance checklist: Wispkin needs shade pockets and cold spots (he *maintains* them — that's his night job, revealed in EP01); Sproutle needs sunning stones; Gabu needs a lunge-clear pond bank. Environment plates are reviewed against the checklist before approval — this turns "cute background" into "world that fits its cast."
- **Serves:** `environments`

**11b. The lone-human translation figure**
- **What it is:** A human protagonist whose confusion teaches the audience the animal world's rules; the world never stops to explain itself to him.
- **Mochiichao-native form:** Mochiko's exact function, sharpened: she is *new* (first morning as keeper in EP01) so her learning curve is the audience's, but the Garden never pauses for her — creatures carry on mid-frame while she figures things out. Reaction, not exposition (pairs with §5a).
- **Serves:** `format` · `camera`

**11c. Institutional signage humour**
- **What it is:** Rules and warnings written for a multi-species institution, played as background gags [22].
- **Mochiichao-native form:** Garden signage kit (keeper board, pond rules, "night shift — do not startle" marker near the Forest path) in the show's Bungee display type. Signs are BG-layer assets, reusable, and become a running-gag surface the audience learns to check.
- **Serves:** `environments`

---

## 12. Duck Dodgers (Warner Bros. / Chuck Jones lineage)

From the 1953 Jones short: Maurice Noble's layouts imagined the future as bold graphic shapes — the enormous scanning eye, vaporizers, "wonderfully exact rocket" — with Phil DeGuard's backgrounds; the TV series later proved a board-driven show could be converted to script-first when production demanded it [24][25].

### Pull-ins

**12a. Noble-style graphic sci-fi shapes for keeper tech**
- **What it is:** Future tech drawn as confident geometric statements — few shapes, exact silhouettes, no greeble noise (Noble/DeGuard) [24].
- **Mochiichao-native form:** The keeper device and hut tech (§3b, §6a) get a Noble pass: bold silhouettes, one accent colour (the canon accent red #a03436, used sparingly), zero decorative clutter. This gives the "hyper-futuristic Japan" stack element a *graphic* rather than realistic rendering — it can sit next to hand-painted nature without breaking the world.
- **Serves:** `environments` (props) · `FX`

**12b. Genre-parody staging for one-off episodes**
- **What it is:** A straight-faced genre frame (space opera) with an incompetent centre; the genre's own staging conventions generate the jokes [24][25].
- **Mochiichao-native form:** A season tool, not an EP01 tool: one "genre day" per batch (detective-noir pond episode; kaiju-scale dandelion episode) staged with the borrowed genre's camera grammar while Garden rules still apply. Filed for season planning.
- **Serves:** `format` · `camera`

**12c. Dignity-loss reaction hold**
- **What it is:** Jones' "Oliver Hardy principle": the joke is never the destruction — it's the character's loss of dignity *afterward*, held on screen [24].
- **Mochiichao-native form:** After every physical gag, the board must contain the dignity hold: Gabu, post-lunge, sits in the pond mud one full beat, rearranging his pride before anyone helps. This is a storyboard-plan line item, not an acting suggestion.
- **Serves:** `camera` · `format`

---

## 13. Robot Chicken (Stoopid Buddy Stoodios)

Stop-motion sketch anthology running 11–15 minutes of rapid-fire segments; production is physical puppets with wire armatures, tie-downs, replacement mouths/faces, shot frame-by-frame on still cameras — and the format's power is *pacing*: a joke lands or dies in seconds and the show has already moved [26][27].

### Pull-ins

**13a. Replacement-part performance system**
- **What it is:** Faces/mouths as swappable physical parts — performance built from a finite, organised part library [27].
- **Mochiichao-native form:** The direct ancestor-validating case for Mochiichao's symbol system (Blair viseme packs, eye/hand Graphic symbols in the rig standard). Robot Chicken adds the workshop discipline: parts are *catalogued like physical stock* (counts, versions, wear) — mirrored in the parts-catalog manifest, where every symbol frame is an inventoried asset with an ID.
- **Serves:** `FX` (production pipeline)

**13b. Sketch-pacing for shorts/marketing**
- **What it is:** 3–30 second self-contained gags, cut ruthlessly; the anthology frame means zero setup cost per joke [26].
- **Mochiichao-native form:** The show's short-form lane: Garden shorts (15–45s) built from BANK poses and one gag mechanism each — cut from the same production pipeline as episodes, replacing the rejected stills-trailer approach with real performed micro-animation. Marketing is cut *from* these and from episodes, per the anti-slideshow law.
- **Serves:** `format` · `post`

**13c. Tactile imperfection as warmth**
- **What it is:** Visible fingerprints, texture and slight wobble make the physical world feel *touched*; polish is spent on lighting and camera, not on hiding the handmade [27].
- **Mochiichao-native form:** Pairs with §1a: the boil pass and a paper/grain finish keep the Garden from looking airlessly digital. Generative elements that arrive too clean get the texture pass before comp — a named step in the glue spec (§4a).
- **Serves:** `post` · `FX`

---

## 14. Looney Tunes (Warner Bros. — Jones / Noble / DeGuard unit)

The deepest craft donor. Maurice Noble designed backgrounds *around* Chuck Jones' timed character layouts — copying the poses in red pencil and building the world to serve them, prioritising design effort by screen time (establishing shots get the work; short shots get exaggerated, fast-reading shapes) [28]. Noble's stated philosophy: backgrounds and characters as "a complete statement… working in harmony" — flat shape and colour instead of fussy realism, every frame supporting the action without cluttering the gag [29]. And the unit's timing law, still quoted by modern directors: "The old shorts knew exactly when not to move. A held pose could be funnier than a flurry of animation" [30].

### Pull-ins

**14a. Layout-around-the-pose (BG serves the board)**
- **What it is:** Backgrounds are designed after — and around — the timed character layout, never as independent paintings the action must fit into [28].
- **Mochiichao-native form:** Production order change, effective EP01: no BG plate is finalised until the scene's board poses exist; the plate artist receives the key poses and designs *around* them (sightlines, negative space where Wispkin will rise, a clean silhouette field for the reveal). The accepted Garden Gate plate is grandfathered; all further plates follow pose-first.
- **Serves:** `environments` · `camera`

**14b. Screen-time-weighted design effort**
- **What it is:** Noble spent ~5 weeks on a special cartoon's layouts and ~1.5 weeks on a Road Runner, deliberately trading effort to where the audience actually looks [28].
- **Mochiichao-native form:** The parts catalog gains an effort tier per asset (Hero / Standard / Fast-Read). EP01 spends Hero effort on exactly three things: the Gate master, the Pond reveal composition, the Forest stinger plate. Everything else is Standard or Fast-Read. This is the schedule's honesty mechanism.
- **Serves:** `environments` · `format` (production)

**14c. The held pose + gag-mechanics timing**
- **What it is:** Comedy from mechanism and timing — anticipation, held reaction, escalation by rule-of-three — with stillness used as a weapon [30].
- **Mochiichao-native form:** Written into the storyboard plan as timing annotations: every gag beat names its hold length in frames; the Forest stinger is *built* from this law (motion → stops → hold → one leaf falls). Creature cries are timed like Jones-era musical cues (see §9c).
- **Serves:** `camera` · `FX` · `sound`

**14d. Shape-first background painting**
- **What it is:** Spaces built from shapes and bold palettes rather than rendered detail; abstract skies and graphic forms amplify mood [29][30].
- **Mochiichao-native form:** The Garden's painting spec: each location has 3–5 signature shapes (Gate arch, pond ellipse, Forest verticals) repeated at every angle so locations are recognisable in silhouette. The Dark Forest is *defined* by its shape language (unbroken verticals, no horizontal rest) before any detail is painted.
- **Serves:** `environments`

---

## 15. The Powerpuff Girls (Craig McCracken)

Flat, iconic design descended from UPA/early Hanna-Barbera: characters designed as *symbols* (big eyes, no noses/fingers — McCracken wanted them symbolic of children, not realistic), timing studied from Tex Avery and Bob Clampett, action sequences from anime [31]. McCracken's own study rule: "if you want to study great design you look at UPA and early Hanna-Barbera… great timing, Tex Avery and Bob Clampett… action, anime" [32]. Townsville itself is a mid-century-modern design system where every department (vehicles, effects, colour, BG) is held to one design thread [33].

### Pull-ins

**15a. Iconic reduction for background species**
- **What it is:** Characters reduced to readable icons — silhouette + one colour + one feature — without losing charm [31].
- **Mochiichao-native form:** The 47-species roster gets a two-tier design rule: pilot/core species keep full game detail; the remaining species receive a show-icon pass (silhouette test at 32px, one signature feature, one palette) so crowds and future episodes stay affordable and readable. New species cannot be cast until they pass the icon pass.
- **Serves:** `FX` · `environments` (cast design)

**15b. Cute/violent contrast — here, cute/*consequence* contrast**
- **What it is:** The show's engine is contrast: adorable design, serious impact; action staged with anime clarity [31][32].
- **Mochiichao-native form:** Garden action (a Gabu lunge, a storm, a Forest presence) is staged with full anime action clarity — speed lines, impact frames, held aftermath — while the designs stay soft. The contrast is the brand: nothing in the Garden *looks* dangerous, which is why the Forest stinger can scare with a stopped leaf.
- **Serves:** `FX` · `camera`

**15c. One design thread across departments**
- **What it is:** A named art-direction function keeping vehicles, FX, colour and BG in one universe [33].
- **Mochiichao-native form:** Already approximated by the identity kit; formalised as a checklist gate: every new asset (plate, prop, FX, UI) is checked against identity-kit palette/shapes/type before entering the parts catalog. Failed checks are reworked, not waived.
- **Serves:** `environments` · `post` · `FX`

---

## 16. Space Ghost (Hanna-Barbera library → Coast to Coast)

The economics donor. Coast to Coast existed because Cartoon Network had a huge library and almost no budget: clips from the 1966 series were recycled and re-edited on an Avid into a talk-show format, guests' interviews were re-cut against new questions, and *editing took the most time in production* — the limited animation (blink, head-turn, one arm raise) became the comedy, with long frozen holds after jokes [34][35].

### Pull-ins

**16a. Library-first production economics (BANK as a budget law)**
- **What it is:** Build from a catalogued library of reusable performance; spend new-animation money only where the library can't go [34][35].
- **Mochiichao-native form:** This is the network-standard justification for the existing clip-index/parts-catalog system, hardened into a rule: every episode's budget meeting starts from the BANK list (poses, cycles, rituals, plates); new assets require a named reason. EP01 is deliberately BANK-heavy — its only Hero spends are listed in §14b.
- **Serves:** `format` (production) · `post`

**16b. The interview-frame segment (keeper's log)**
- **What it is:** A fixed set, a host, a guest on a monitor — a format that can carry an episode at near-zero animation cost, with comedy from editing and holds [34][35].
- **Mochiichao-native form:** A recurring segment format for later episodes/shorts: Mochiko's end-of-day keeper-log recordings — she reviews the day with one creature "interviewed" via the keeper device; creatures answer in cries, Mochiko reacts, subtitles appear once (intertitle law). A bottle-segment machine for schedule relief that still advances character.
- **Serves:** `format`

**16c. The dead-air hold as house style**
- **What it is:** After a joke, the camera lingers on a frozen face for seconds; silence is the punchline's second half [35].
- **Mochiichao-native form:** Merged with §14c into one timing law with two flavours: Jones hold (anticipation/reaction) and Space Ghost hold (dead air after absurdity). EP01 uses the second exactly once — after the duck rolls uphill, nobody moves for a full beat. Once is style; twice is a tic.
- **Serves:** `camera` · `sound`

**16d. Re-edit before you re-animate**
- **What it is:** The show was *written in the edit* — existing footage gained new meaning from new juxtaposition and timing [34].
- **Mochiichao-native form:** Post-production rule for the animatic stage: before any new animation is ordered for a story problem, the editor must attempt the fix by re-timing/re-juxtaposing existing BANK and board material. Documented in the pipeline as the "Coast-to-Coast pass."
- **Serves:** `post`

---

## WIRE-UP ORDER — what EP01 needs vs what waits

EP01 ("The Garden Has a Ghost," ~6 min, Gate/Pond/Green + Forest stinger) is a *small* episode. Its job is to prove the pipeline, not to spend every system at once.

### Wire into EP01 (production-blocking or episode-defining)

| # | Pull-in | Why EP01 specifically |
|---|---|---|
| 1 | **§14a/14d Looney Tunes — pose-first BGs + shape-first painting** | The Wispkin reveal and Forest stinger are composition events; plates must be built around their poses now, before more plates are painted the old way. |
| 2 | **§1a Eds — boil-line living-line pass** | The single cheapest fix for puppet/generative stiffness; applied to every EP01 shot in post. |
| 3 | **§4a Gumball — compositing glue spec** | EP01 mixes puppets, generative smoke and painted plates; without the glue pass the mix reads as three shows. Gate for shipping any shot. |
| 4 | **§5a Dexter — visual-first board discipline** | Already the script's law; enforced at board stage (every beat names its visual). Costs nothing, saves the episode. |
| 5 | **§1c Eds — bespoke foley kit + §9c Bravo musical timing** | Audio is attached *per scene as it's made* (Jamar's standing preference). Foley kit + stem-grid timing must exist before Scene 1 is finished, not at mix. Includes the two flagged SFX (cold shimmer, gate bell). |
| 6 | **§2c Foster's — symbol-library depth for the EP01 cast only** | Full sets for Wispkin/Gabu/Kittember/Mochiko; nobody else's library is built yet. |
| 7 | **§11a Gym Partner — species-affordance check on EP01 plates** | Wispkin's cold spots/shade pockets must be *in* the Garden design for the mystery to make sense. One checklist pass over 3 locations. |
| 8 | **§14c/16c — Jones hold + one dead-air hold** | Timing annotations on the existing 28-cut board; the stinger and the duck beat depend on them. |
| 9 | **§3b Bakugan — keeper-device UI, one data point** | Small build, big story function (the 3:12 AM log is clue #1). Full card system waits. |
| 10 | **§16a Space Ghost — BANK-first budgeting for EP01** | Free, immediate: the episode's asset list is already mostly BANK; this rule keeps it that way under schedule pressure. |

### Wire next (Episodes 2–4 / first batch)

- **§2a/2b Foster's** — full Garden location bible + new-arrival-at-the-gate ritual (needs the season's species-introduction plan).
- **§3a Bakugan** — full Gate-arrival and Bond BANK sequences, shot at Hero effort once, reused all season.
- **§5c Dexter** — keeper-routine montage BANK (EP01 uses a short hand-made version; the reusable one is built from its footage).
- **§6a/6b KND** — keeper-tech prop catalogue expansion + night-organisation reveal mechanics (EP01 plants it with one board update; the system pays off across the season).
- **§7a OK K.O.** — species-card keeper board as a designed system (EP01's board is a prop; the card *system* lands with episode 2's first new species).
- **§13b Robot Chicken** — Garden shorts lane, launched once episode BANK exists to cut from.
- **§10a/10b Camp Lazlo** — pastoral sound/BG register formalised as the season's day-sound spec; managed/wild geography triangle mapped for season arcs.
- **§15a Powerpuff** — icon pass for the non-core species, before any of them are cast.

### Wire later (season-scale / format expansions)

- **§12b Duck Dodgers** — genre-day episodes (need a stable house style to bend against).
- **§16b Space Ghost** — keeper-log interview segments (schedule-relief format, most valuable mid-season).
- **§1d Eds / §6c KND** — desire-machine and played-straight templates move from EP01's instinctive use into the writers'-room template file once two episodes exist to generalise from.
- **§8c Cow and Chicken** — deformation extremes codified per species after the animators have a season of normal motion to contrast against.
- **§15c Powerpuff** — design-thread gate is noted now but becomes a staffed checklist when asset volume justifies it.

---

## Sources

Published production facts cited above. (Donor-repo holdings themselves are catalogued separately in the transfer manifest / pull-in map; this draft cites public sources for the *production systems*.)

1. Ed, Edd n Eddy — animation & boiling-line production (Wikipedia, summarising Antonucci interviews / Animation World Magazine): https://en.wikipedia.org/wiki/Ed,_Edd_n_Eddy
2. CBR — "This Cartoon Network Classic Sadly Ended an 84-Year Animation Trend" (cel production + 3-trace boil): https://cbr.com/ed-edd-n-eddy-cartoon-network-final-cel-animated-cartoon/
3. Ed, Edd n Eddy sound-design/foley analyses (found-object foley, jazz percussion): https://reelmind.ai/blog/ed-edd-n-eddy-sound-effects-pack-ai-for-cartoon-audio
4. Foster's Home for Imaginary Friends (Wikipedia — first CN series primarily in Flash; Illustrator/Flash/After Effects): https://en.wikipedia.org/wiki/Foster%27s_Home_for_Imaginary_Friends
5. House of Bloo's (Wikipedia — production: hand-drawn art processed in Illustrator, Flash, After Effects composition): https://en.wikipedia.org/wiki/House_of_Bloo%27s
6. Bakugan Battle Brawlers (bakugan.wiki — TMS/Japan Vistec production, cards + transforming creatures premise): https://bakugan.wiki/index.php?title=Bakugan_Battle_Brawlers&diff=cur&oldid=831498&mobileaction=toggle_view_mobile
7. Bakugan toy/game system (metal cards, spring-transforming balls, battle resolution): http://bakuga.battle.brawlers.jloc.tripod.com/akuganoyshatreakuganattle.html
8. The Amazing World of Gumball (Wikipedia — mixed-media stylisation; storyboard-driven pipeline): https://en.wikipedia.org/wiki/The_Amazing_World_of_Gumball
9. Gumball mixed-media production & compositing (2D/3D/puppetry over photographic BGs; manual shadow/rim/reflection work): https://eathealthy365.com/explaining-the-gumball-series-unique-animation/ and Boulder Media interview: https://www.iloveoffset.com/boulder-media/
10. Dexter's Laboratory (Wikipedia — cinematic staging for depth, limited HB-style mouth/nose design, timing influences): https://en.wikipedia.org/wiki/Dexter's_Laboratory
11. Dexter's Laboratory production notes (design/space, cinematic staging vs flat UPA): https://www.liquisearch.com/dexters_laboratory/production
12. SYFY — "How Dexter's Laboratory changed American cartoons forever" (visual-first, fast cutting, robot-hand sequence): https://www.syfy.com/syfy-wire/how-dexters-laboratory-changed-american-cartoons
13. Codename: Kids Next Door (Wikipedia — treehouse HQ, 2×4 technology, global organisation): https://en.wikipedia.org/wiki/Codename:_Kids_Next_Door — note: search session mapped this title to a disambiguation page; the series facts are corroborated by [14].
14. KND 2×4 technology detail (household-object devices, hamster-wheel generator, treehouse systems): https://en.namu.wiki/w/%EC%95%94%ED%98%B8%EB%AA%85:%20%EC%9D%B4%EC%9B%83%EC%A7%91%20%EC%95%84%EC%9D%B4%EB%93%A4
15. Television Academy — "Outside In" (OK K.O.! development: pilot → mobile game → redesigned world): https://www.televisionacademy.com/features/news/mix/outside
16. AnimationXpress — Ian Jones-Quartey interview (video-game-inspired world, retro-future 201X, plaza): https://animationxpress.com/latest-news/ian-jones-quartey-talks-about-the-animated-series-ok-k-o-lets-be-heroes/
17. GameSkinny — OK K.O.! Let's Play Heroes (show/game developed in correspondence; Persona/Viewtiful Joe inspirations): https://www.gameskinny.com/news/ok-ko-lets-play-heroes-first-official-trailer-revealed/
18. Cow and Chicken (Wikipedia — Feiss, Cartoon Cartoons, surreal sitcom): https://en.wikipedia.org/wiki/Cow_%26_Chicken
19. Cartoon Brew — David Feiss Q&A (animator-director set the pilot's style himself): https://www.cartoonbrew.com/interviews/cow-chicken-open-season-qa-david-feiss-144081.html
20. Johnny Bravo (Wikipedia / Van Partible — Mess O' Blues origin, Jackson pose-snap inspiration, in-house digital ink-and-paint short): https://en.wikipedia.org/wiki/Johnny_Bravo
21. Camp Lazlo (Wikipedia — Murray: pastoral "calming" backgrounds, back-to-nature, no high-tech stimulus): https://en.wikipedia.org/wiki/Camp_Lazlo
22. Animation World Network — My Gym Partner's a Monkey launch (species-adapted school: vine routes, underwater hallways, signage): https://www.awn.com/news/my-gym-partners-monkey-full-swing-cartoon-network
23. My Gym Partner's a Monkey (Wikipedia — premise, production): https://en.wikipedia.org/wiki/My_Gym_Partner%27s_a_Monkey
24. Duck Dodgers in the 24½th Century (Wikipedia — Jones/Maltese; Noble layouts, DeGuard backgrounds, Harry Love FX): https://en.wikipedia.org/wiki/Duck_Dodgers_in_the_24%C2%BDth_Century
25. Cracked — oral history of the Duck Dodgers TV series (board-driven seasons → script-first conversion): https://www.cracked.com/amp/article_46437_an-oral-history-of-duck-dodgers-cartoon-networks-space-age-looney-tunes-show.html
26. Robot Chicken format (Stoopid Buddy stop-motion; 11–15 min rapid sketch pacing): https://www.clicker.com/tv/robot-chicken/
27. Robot Chicken stop-motion craft (24 poses/sec, armatures, tie-downs, replacement mouths, practical FX): https://manualdobruxo.com.br/why-robot-chicken-star-wars-episode-ii-still-hits-harder-than-most-parodies-1i92
28. Tod Polson, *The Noble Approach* (Noble designed BGs around Jones' timed character layouts; screen-time-weighted effort; 5-week vs 1.5-week layouts): https://attachments.are.na/30106092/49401e9744272e5f8e33f234b8e688a7.pdf?1724126737
29. 99% Invisible, Ep. 85 "Noble Effort" (Noble's background/layout revolution): https://99percentinvisible.org/episode/episode-85-noble-effort/
30. Little White Lies — "The Elastic Worlds of the Looney Tunes" (Noble/DeGuard/Julian BGs; "knew exactly when not to move"): https://www.lwlies.com/big-s/looney-tunes-shorts
31. The Powerpuff Girls designs & animation (Wikipedia — flat UPA/HB design, iconic/symbolic characters, Avery/Clampett timing, anime action): https://en.wikipedia.org/wiki/The_Powerpuff_Girls:_Dance_Pantsed — note: search session returned the franchise article content under this result URL; design facts corroborated by [32][33].
32. LA Weekly — "Beyond Good and Evil" (McCracken's study rule: UPA/HB design, Avery/Clampett timing, anime action): https://www.laweekly.com/beyond-good-and-evil/
33. Powerpuff Girls production notes (Mike Moon on holding one design thread across vehicles/FX/colour/BG departments): https://Cinema.com/articles/1093/powerpuff-girls-the-production-notes.phtml
34. Space Ghost Coast to Coast (Wikipedia — library recycling on Avid, budget limits, editing as the main production labour): https://en.wikipedia.org/wiki/Space_Ghost_Coast_to_Coast
35. Space Ghost Coast to Coast analysis (limited-animation holds, re-cut interviews, silence as comedy): http://tviv.org/Space_Ghost_Coast_to_Coast

*Draft prepared 2026-10-27. Two source URLs ([13], [31]) are noted where the search session's returned URL differed from the canonical article path; facts at those entries are corroborated by the paired sources listed.*
