# HUMAN CHARACTER DESIGN LANE — CHARTER

**Project:** Mochiichao (game repo `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`; show lives inside the same repo).
**Lane status:** CHARTERED 2026-10-27 by owner direction. **Production phase PARKED** — see §6, the priority gate. This charter, the sources audit (`SOURCES.md`), and the cast queue (`CAST-QUEUE.md`) are the only outputs of this pass. **No designs are produced until the owner releases the lane.**
**Companions:** `SOURCES.md` (what design material actually exists, with repo paths) · `CAST-QUEUE.md` (who needs art, in season order) · `LANDING-STEPS.md` (how this package lands in the repo).

---

## 1. What this lane is

Later seasons' humans — dojo leaders, Elite Four members, Champions, the Syndicate admins, the Wizard Gang's Nine, the transplant cast — need likenesses when their seasons come. This lane designs those likenesses **from the owner's own design material**: the design documents and design conversations already in the repo (`docs/human-characters/`, `docs/canon-draft-likenesses.md`, `docs/representation-canon.md`), the human design grammar the owner set while building the v1/v2 cast, and — for transplants — the owner's own home-canon imagery in his other repos.

A new likeness in this lane is a **design in the owner's system**, documented the way the v2 cast's sheets are documented. It is never invented from nothing, never borrowed from another production's characters, and never presented as canon before the owner sees it.

## 2. The likeness law for NEW humans

1. **Design brief first, from canon sources.** Every design starts as a written brief assembled from repo material: the character's canon role, locked dialogue, team, placement, and any traits the owner has already stated (a mould, a prop, a voice seed, a palette note). If canon holds no look for a named character, the brief says so plainly — the character is marked **UNVERIFIED / proposal** and the gap goes to the owner. A look is never silently invented and presented as canon. (Repo precedent: the Falk brief and the Luigi identity check both run exactly this way.)
2. **Visible attributes only, in the owner's order.** When a likeness is generated or drawn, the brief lists only what is visible, in this order: **face, skin, hair, eyes, shirt pattern, collar, tie, belt, trousers, boots, prop, pose**. Framing and style are specified separately.
3. **Never put the character's name in a generation prompt.** (Owner's rule, 2026-10-26: a name prompt produced Nintendo's Luigi. Prompts describe; they do not name.)
4. **One character at a time, text-only references.** Never chain multiple character images as generation references — the repo's identity-bleed failures (Player C "corrected v2" = Player A's identity; Player B "corrected v2" = a new female; Player D in-game v1 = an A/D mashup) are all marked FAILED/discarded and are never pushed. Eye-check identity before anything is presented.
5. **The diversity rule (owner, 2026-10-25, standing).** No character defaults to white/pale. Every new character gets a **named race/ethnicity in its brief AND in the canon file**, checked across the whole batch before showing. An all-pale batch is a failed batch — redo. (Canon records it exactly this way: Player A Black, B East Asian, C Latina, D white/blonde — D is one option, not the default. The v2 cast of record: Mochiko East Asian, Hex Black primary, Aeon Black primary; Mom's race varies with the player pick, and representation canon resolved 2026-10-26 that there is **no separate parents'-race selector** — more races arrive only as more player presets the owner names.)
6. **Outfit grammar (from the locked human style guide).** Outfits must read at sprite size: one jacket/vest, one trouser, one shoe. No layered shorts-over-leggings, no crystal backpack pods, no stacked gimmick accessories. Techwear chrome/silver accents are fine. A signature prop is allowed when canon gives the character one (Merv's cap + belt device, Luigi's rose, Faye's nurse cap) — a prop is part of the brief, not decoration added at render time.
7. **Change discipline.** A likeness changes **only if the owner says so in his own words**. A new version is a **new filename**; the old file is kept, marked superseded, never overwritten or deleted. Drift noticed in a later sheet is not a canon change — flag it. Mocks are not canon. (Current-version law applies per piece and per use: the registry names which version is current for which use.)
8. **No baked shadows.** Character art never carries a painted ground/contact shadow. Shadows are added at compositing/render time so they match the scene.
9. **Transplants are built from actual images.** A transplant's 2D likeness is built from the real source imagery in the owner's home repos — roster cards, concept plates, GLB/Tripo renders, sheet sets — through the likeness pipeline and its gate. Never from a text description alone. (The transplant naming law and flag register live in the transplant roster; flags are the owner's call — flagged names are never renamed or dropped by this lane.)

## 3. The naming method (owner's grammar — briefs must follow it)

New human names in this project's canon follow the owner's demonstrated method, as recorded across the repo's naming docs:

- **Plain vocabulary first, type-tell where earned.** Most names are ordinary words/names a person could plausibly carry; the type or role shows through the word choice (a Chrome champion named for brightness, a Core leader named for stone) rather than through fantasy syllables.
- **Short.** One to two syllables is the centre of gravity for dojo-tier names (Lin, Falk, Tetsu, Kenji, Shimo, Rin, Ren, Delta, Merv, Lark, Faye).
- **Elemental ranks in Japanese where the slot calls for it** (the dojo-elite set: Tetsu, Kenji, Shizuku, Homura, Umi, Gin, Hono, Yoru) — used as a system, not sprinkled.
- **Outlier languages mark outlier roles.** A name that breaks the local pattern signals a character who comes from outside the local order (Luigi Castagnoli, the Syndicate boss displayed as "Mysterious Figure" until his reveal).
- **Concept names are rationed.** Abstract/emblem names (Phantom, Cipher, Theory, Origin-class names) are spent rarely and on characters whose role carries them.
- **No surnames by default.** Canon humans are single-named unless the owner's material gives a surname (Castagnoli is the standing exception, and it is load-bearing).
- **Renames are the owner's act.** When the owner renames, display names change and internal ids/keys stay stable. This lane never renames on its own authority — it flags collisions (e.g. the vitiligo cartographer's owner-ordered simplification to "Voss" collides with admin Voss; the recommended resolution — admin keeps Voss, cartographer becomes "Meridian" — is **unresolved and waits on the owner**).

## 4. Representation canon (locked 2026-10-26 — binding on every brief)

From `docs/representation-canon.md`, the owner's words preserved in that file:

- Representation is approved in principle: non-binary/androgynous, gay, lesbian, asexual, disabled, prosthetic, wheelchair, amputee, skin disorders, mental disorders.
- **Cool, not lame-generic** — the register is JoJo / Bleach / Naruto, not a pamphlet.
- **Two tracks only:** (a) a really generic background character who just exists, or (b) a really cool named character with the trait built into the design and fighting style. There is no middle track.
- **Never diagnosed, named, or explained in dialogue on screen, ever.** Representation lives in visual identity, team, dialogue style, and relationships.
- No single token representative: a trait appears in more than one character, in different jobs.
- No stat penalty, no cure-as-reward. A prosthetic is tech; a limitation becomes a fighting style.
- Every such character is **show-first to the owner** before anything ships. The canon file itself creates no character.

Standing test case on the books: **vitiligo** (Nurse Faye's design note already carries it).

## 5. Style law for humans

- **THE MOCHIICHAO ART STYLE is the only render style.** For humans, the finish of record is the repo's locked human **STYLE-GUIDE (2026-10-25)**: clean 2D anime cel-shaded game art; full-body front on plain light grey; **no shadow pool, no text**; large expressive anime eyes with clean highlights; small nose/mouth; face ≈ 1/6–1/7 of body height; ~6–7 heads tall; hair as bold separated strands/spikes/curls that still read as a silhouette at sprite size; flat colour + simple cel shading; dark outlines. Anchors: **Player D primary, Player A second**.
- **Fight-read applies to humans too.** A design that reads as a preschool mascot fails automatically, whatever its other merits: assertive/angular accents, hard cel shadow, anime eyes with edge, attitude. Human designs must look like people who can stand in this world's fight register — dojo leaders, admins, and champions above all.
- Design *influences* may lean by regional flavour (R1 Pokémon-base, R2 Digimon-lean, R3 Monster Rancher-lean, R4 mix + originals, R5 the owner's own universe + Malakor). The **render never varies**.
- **Reference-image discipline:** the likeness pipeline starts from the actual reference image for that character (their canon cutout / model sheet / home-repo imagery), then the visible-attribute list. Text-only generation is used only where the repo's own workflow used it (fresh model sheets for genuinely new characters, one at a time, per §2.4) — and its output is a proposal until the owner confirms it.

## 6. The pipeline (when the lane is released)

1. **Cast need** — a queue entry in `CAST-QUEUE.md` becomes active for its season.
2. **Design brief** — assembled from canon sources per §2.1 (role, placement, dialogue, team, stated traits, named race/ethnicity, outfit grammar, palette). Gaps are listed in the brief, not filled.
3. **Design** — model sheet built under §2/§5 (reference first where a reference exists; one character at a time; no name in prompts).
4. **Owner see-first verdict** — nothing is canon, shipped, or wired before the owner sees and rules. Rejects are kept, marked, and never pushed.
5. **Model sheet lock** — an approved sheet enters canon the way the v2 cast's did, with casting notes recorded (race/ethnicity, outfit, palette) in the canon file.
6. **In-game sheet (the 8-step completion standard)** — a character is finished only at 8/8: (1) model sheet, (2) world front/back/left/right, (3) walk frames, (4) battle front (NPC) / back (player; a rival gets both), (5) portrait icon, (6) special-action variants **only where the character actually does that thing**, (7) data (role / location / dialogue / party / class), (8) 64×64 atlas + JSON manifest. A model sheet alone is not a finished character.
7. **Show rig** — humans speak words (the pure-cries law scopes to creatures only), so an approved human design feeds the human talking seat: voice → viseme timings → mouth charts → rig, per the pipeline already wired for the v2 cast.

## 7. Priority gate — READ FIRST

**Season 1 / Episode 1 outrank this lane.** The lane's production phase is **parked** until the owner releases it. Until then this lane produces exactly three things: this charter, the sources audit, and the queue — plus corrections to them when canon moves. No briefs are written, no designs are generated, no art is requested for queued characters while the gate is closed, **including the queue's #1 fresh-design gap (Falk)** — Falk is documented, briefed-by-canon as far as canon goes, and waits like everything else.

When the owner releases the lane, work runs in queue order (season order; inside a season, art-base-first per §2.9), one character at a time, show-first at every verdict point.
