# CANON CONSISTENCY — the four boxes, the sorting procedure, and where rulings live

> **STATUS: DRAFT FOR OWNER LOCK** (drafted 2026-10-28 under the owner's
> charter of the same day). Nothing in this doc overrides an owner ruling.
> When the owner locks it, this becomes the front door every lane checks
> first when something doesn't match.

**Owner charter (Jamar, 2026-10-28):** *"We're going to work on canon
inconsistency and non-canon inconsistency and canon variation versus
non-canon variation. So we can lock that down on the consistency fronts.
And where we're okay with inconsistency and variation and where
consistency continues to be locked canonically."*

## What this doc is — and is not

This is the **sorting layer**. It does not replace the systems that
already hold canon; it names the four boxes every mismatch falls into,
gives the test that sorts a new case, and points at the record that owns
the fact. The systems it stands on:

- The **Individual Variation Doctrine** and the deviation data model —
  `show/production/species-data/80-INDIVIDUAL-VARIATION.md` (#80).
- The **ruled-deviation register** — the compiled index
  `show/production/species-data/RULED-DEVIATION-REGISTRY.json`, its spec
  `show/production/species-data/318-RULED-DEVIATION-REGISTER.md` (#318),
  and the inheritance rule
  `show/production/species-data/324-DEVIATION-INHERITANCE.md` (#324).
- The **laws** — `show/bible/SHOW-BIBLE.md` (Law 7 Likeness, Law 9 The
  Secret, Law 10 Two-Lane Consistency), the Lustre Law in
  `show/bible/COLOR-SYSTEM.md`, the naming law in
  `show/production/pipeline/ORCHESTRATOR.md`.
- The **generation-facing seats of rulings** — each pilot's
  `pack.json` under
  `show/production/tooling/avatar-stack/reference-packs/`
  (`do_not_change`, `prompt_negative_additions`, `owner_rulings`).
- The **index of rulings** — `show/production/PRODUCTION-LOG-2026-10-27.md`
  (its own header: "This log is the index of rulings; the governing text
  lives in the docs named").

If this doc and one of those disagree, the disagreement is itself a
canon inconsistency (Box 1) — the newest owner ruling wins, and the
resolution gets recorded where the conflict lives.

---

## 1. THE FOUR BOXES

Every mismatch anyone finds — in a clip, a sheet, a doc, a data file —
is exactly one of these four. Each box has a test. Run the test; the box
tells you what happens next.

### Box 1 — CANON INCONSISTENCY
*Two canon sources, or two rulings, contradict each other.*

**The test:** can you point at **two records that are both supposed to
be canon** and show they say different things about the same fact? If
yes, it's this box — no generation is at fault; the record itself is
split.

**Worked cases:**
- **Sproutle's two likenesses.** Two repo likenesses of Sproutle
  disagree on colours (the portraits-scripted-v3 Sproutle vs its
  blue/green lustre front art). No likeness-of-record ruling for the
  portrait family exists yet — recorded as conflict C4 in
  `show/production/species-data-system/DESIGN-BRIEF-canon-world.md` §9,
  waiting on the owner-decisions list (§8 item 2). Until the owner
  rules, **neither** likeness may be quietly treated as the one.
- **Production layer vs display layer (names).** The same fact wears
  two names on purpose: the battle commander is **Rangers** in canon
  display text while the structural id stays `role:"trainer"` in game
  data (SHOW-BIBLE Law 8's term lock; Law 10). This is only an
  inconsistency if a lane mixes the layers — display text carrying the
  structural word, or code renamed to the display word. The layers
  themselves are the resolution, already ruled.
- **A live one, caught 2026-10-28.** The register, #80, and the
  production log attribute the Dorowani eye-whites to "the avatar/show
  Dorowani"; the owner's 2026-10-28 correction (recorded in the
  Dorowani reference pack's `owner_rulings`) says the whites belong to
  **one specific made Dorowani** and the avatar is not the subject of
  the ruling. The newest ruling wins; the older records are being
  brought into line. This is the procedure in §2(d) working as designed.

- **The register vs its own rulebook — RESOLVED 2026-10-28.** #318 and
  the deviation-register fragment named the maskless Verdilance a
  founding RULED entry, but `RULED-DEVIATION-REGISTRY.json` held no
  Verdilance at all — and instead carried the PR #389 Kittember as
  `PROPOSED`, which #318's own fence says must never appear in the
  register. The owner's ruling (2026-10-28): **both are variants.**
  The maskless Verdilance is restored to the register as a RULED canon
  variation, carrying its own likeness lock and a percentage
  (occurrence) rate recorded as OWNER-TBD (the number is the owner's
  to set; none was invented). The PR #389 Kittember is canon as the
  **Region 4 regional Kittember variant** — its seven deviations from
  the base form are that regional form's locked traits, superseding
  the 2026-10-27 `unused_draft_special_case` ruling. Base (Region 1)
  Kittember canon is unchanged.

**What happens:** the newest owner ruling wins. If there is no ruling
yet, the conflict goes on the owner-decisions list and **waits** — it is
never settled by whoever found it, and never "fixed" by editing one
side quietly.

### Box 2 — NON-CANON INCONSISTENCY
*Output contradicts locked canon — or contradicts itself over time.*

**The test:** does the thing in front of you break a **locked** trait,
name, or law — or does a trait that is supposed to be fixed **change**
across frames, shots, or scenes? Either is this box. This is a defect,
not a discussion.

**Worked cases:**
- **The Flow Dorowani's eyes.** In the 2026-10-28 Google Flow scratch
  clip, white **grew** around Dorowani's eyes. Eye-whites on any
  Dorowani except the one ruled individual are against canon — and
  even for a ruled trait, *changing* is the defect: whites that grow,
  shrink, or flicker in and out across a scene or a frame are wrong
  even where whites themselves are allowed. The clip stands as
  acceptable scratch; the class is a named defect, and the Dorowani
  pack now carries the countermeasure ("no white around the eyes, no
  sclera" in `prompt_negative_additions`).
- Any locked trait drifting mid-clip: a mask crack pattern that
  redraws itself, a shell that becomes a hat, fin cheeks that change
  colour between shots. The trait was locked; the output moved; the
  output is wrong.

**What happens:** fix or regenerate. The failure gets logged and the
countermeasure wired (gate item, prompt line, pack note) so the class
cannot recur silently — the corrective-autonomy rule
(`show/production/WORKING-RULES.md` rule 7).

### Box 3 — CANON VARIATION
*A deviation the owner has RULED as true. From the ruling onward, it is
locked — for that individual, not for the species.*

**The test:** is there an **owner ruling on record** for this exact
deviation — in the register, in a pack's `owner_rulings`, or in the
production log? If yes, the deviation is not an error and must never be
"fixed." Reproducing it is the consistency requirement (#80: a RULED
deviation carries "MUST REPRODUCE in every generation of this
individual").

**Worked cases:**
- **The one made Dorowani's eye-whites.** The species pattern is red +
  black eyes, no sclera. One specific made Dorowani has whites —
  ruled, his alone, fixed and steady for him in every generation.
  Never extended to any other Dorowani; never flickering for him
  either. (Register entry #1's trait, `eyes.sclera`; owner correction
  of 2026-10-28 recorded in the Dorowani pack.)
- **Wispkin horns.** Some Wispkin individuals have horns, in different
  horn styles; some have none. Horns are not Wispkin's always-form and
  not a likeness failure. Gates and prompts must neither fail a clip
  for horns nor force horns (Wispkin pack `variant_traits` +
  `owner_rulings`, 2026-10-28).
- **Black-around-the-eyes Dorowani.** #80's doctrine text: other
  Dorowani follow the species pattern, and some individuals may carry
  black around the eyes instead — per-individual variation inside the
  species pattern's own space.
- **The register's other founding rulings:** the bipedal Kittember
  (one named wild individual; the species default is quadrupedal) and
  the maskless Verdilance (an absence-class deviation — the lack is
  the trait, and fidelity must render the lack, not restore the part)
  — #318 / `RULED-DEVIATION-REGISTRY.json`. (The Verdilance entry was
  restored to the register by the owner's 2026-10-28 ruling — Box 1 —
  as a RULED canon variation with its own likeness lock and its
  percentage (occurrence) rate recorded as OWNER-TBD. The same ruling
  made the PR #389 Kittember canon as the Region 4 regional variant:
  its seven base-form deviations are that form's locked traits.)

**What happens:** nothing — that is the point. The variation is canon.
Anyone who "corrects" it has made a Box 2 error.

### Box 4 — NON-CANON VARIATION
*A deviation nobody has ruled yet. It is PENDING — never silently canon,
never silently rejected.*

**The test:** the output differs from canon, no locked trait is broken
(that would be Box 2), and **no ruling exists** (that would be Box 3).
Then it sits in this box until the owner rules. A pending deviation is
not input for the next generation: #80's rule 1 — generators never read
PROPOSED entries.

**Worked case — both exits from this box:**
- **Rejected: PR #389's Kittember.** The generated Kittember differed
  from canon on seven measured traits (coat colour, stance, an invented
  white chest patch, ear interiors, eye shape, tail-tip form, coat
  texture). The owner ruled it **rejected as canon** — and kept it,
  labelled `unused_draft_special_case`, never used, never deleted
  (production log, 2026-10-27; the bundle's manifest and clip-index
  carry the status). The rejection is recorded so the same deviation is
  never re-proposed as new. **Superseded 2026-10-28:** the owner later
  ruled this exact form canon as the Region 4 regional Kittember
  variant (Box 1). The rejection record stays — it is the history the
  new ruling supersedes — but the status no longer stands: the seven
  traits are the regional form's locked traits now. A rejection is a
  ruling, and a later ruling can supersede it; what it cannot do is
  vanish.
- **Absorbed: the eye-whites and the horns** both started in this box
  — generation drift nobody had ruled — and left it through the owner's
  ruling into Box 3. Same box, opposite exit. The box is the waiting
  room; the ruling is the door.

**What happens:** it goes to the owner as a ruling question, in plain
words, with the deviation shown. Until he rules, work continues around
it — a pending variation never holds a lane hostage, and never sneaks
into canon by being repeated.

---

## 2. THE SORTING PROCEDURE

For any new deviation, in this order — stop at the first step that
answers:

**(a) Does it touch a locked trait, name, or law?**
(§3's zones: a canon name, a signature move, the render style, a
species anchor, a ruled per-individual trait, the Secret.)
→ **Box 2, non-canon inconsistency.** Defect. Fix or regenerate, log
it, wire the countermeasure.

**(b) Is it already ruled?**
Check, in order: the register
(`RULED-DEVIATION-REGISTRY.json`), the individual's #80 record, the
character's pack (`owner_rulings`), the production log's ruling index.
→ Apply the ruling **exactly** — reproduce a ruled variation (Box 3),
never extend it to another individual, never re-litigate it.

**(c) Unruled, and mostly close?**
→ **Box 4.** It goes to the owner for a ruling:
- **Absorb** — it becomes canon variation (Box 3): record the ruling,
  lock it per individual, update the gates and prompts that enforce it.
- **Reject** — record the rejection with its status (the
  `unused_draft_special_case` pattern) so it is never re-proposed as
  new.
Either way the ruling is written down the same day, in the seats named
in §5. Unruled does not mean unrecorded.

**(d) Is the contradiction between canon sources themselves?**
→ **Box 1, canon inconsistency.** The newest owner ruling wins. No
ruling yet → the conflict is written down where it lives (a conflict
note in the doc/data that carries it, like conflict C4 in the
DESIGN-BRIEF), put on the owner-decisions list, and left open — never
silently resolved by an edit.

---

## 3. LOCKED-CONSISTENCY ZONES — never varies

These are not preferences. A deviation here is Box 2 by definition.

- **Canon names and the naming laws.** Display names are the owner's
  locks (The Dark Forest, Illuminate, the Mochiioteca); display names
  change only by owner ruling, internal ids/keys never change, so
  wiring cannot break. A ruling made in one lane applies in both lanes
  — game and show, same terms. *(Naming law:
  `show/production/pipeline/ORCHESTRATOR.md`; SHOW-BIBLE Law 10;
  `show/production/moves-registry/MOCHIICHAO-NAME-MAP.md`.)*
- **Per-species signature moves.** One species, one signature, mapped
  individually — never shared, never templated across species.
  *(Locked table: `show/production/CANON-SIGNATURE-ATTACKS.md` —
  Mochii Hydro Rush, Kittember Fire Stream, Sproutle Leaf Blast,
  Wispkin Dark Wave, Dorowani Water Orb, Gabu Tremor.)*
- **The Mochiichao render style itself.** Same character, same style,
  or the work is rejected and does not enter the repo. Design influence
  may vary by region (§4); the render style never does.
  *(SHOW-BIBLE Law 7, the Likeness Law; colour discipline: the Lustre
  Law, `show/bible/COLOR-SYSTEM.md` §(b) — colourways are per-species,
  never per-individual.)*
- **No baked shadows.** Character art never carries a baked-in
  ground/contact shadow; shadows are added at composite time so they
  match the scene. Source art that arrives shadowed is cleaned, the
  clean version becomes the current one, and the shadowed version is
  marked not usable. *(Standing rule; enforced in every pack's
  `do_not_change`; the cleaned Sproutle cutout is the worked case.)*
- **Per-individual traits, once ruled.** A RULED deviation is part of
  the character: reproduce it exactly, in every generation of that
  individual — and it persists across that individual's own evolution,
  while never being inherited by offspring. *(#80 deviation rules;
  #324 for the inheritance fence.)*
- **Species anchors.** The features that make a species read as itself:
  Wispkin's cracked white skull mask, held in both hands in front of
  the body, body dissolving to smoke; Kittember's tail-tip orb, flame
  attached to the tail tip, never a separate floating orb; Dorowani's
  red fin cheeks (not orange), red eyes, light belly, dorsal fin, and
  the tan shell on his back — a shell, never a hat. *(Each pack's
  `do_not_change`; the Kittember tail-tip ruling, production log
  2026-10-27.)*
- **The Mainframe secret law.** The Secret is a production-layer truth,
  never an in-world fact: no inhabitant knows it, ordinary world speech
  never names it, and in-world artifacts must not betray it.
  *(SHOW-BIBLE Law 9.)*
- **"Forever and always."** Reserved for threshold moments of trust and
  bond — a Ranger leaning in to another Ranger, or to their own
  Mochiichao, right before a battle or a perilous crossing. Spoken by
  different characters in different stories; never one character's
  catchphrase, never spent on an ordinary scene. *(Owner law; this doc
  is its first seat in the repo.)*
- **Two-lane consistency itself.** A canon change that lands in only
  one lane is an unfinished change. *(SHOW-BIBLE Law 10.)*

## 4. VARIATION-ALLOWED ZONES — variation is expected here

Variation in these zones is the world working as designed. It does not
need a ruling, and policing it would be the error.

- **Per-individual traits inside a species.** Same-species individuals
  are mostly alike with real deviations — that is the Individual
  Variation Doctrine. Underneath the visible layer, #80's variance
  (bounded stat variance, size class, temperament read) makes every
  individual numerically its own. Visible deviations follow the boxes:
  ruled → Box 3; unruled → Box 4 until the owner rules. *(#80.)*
- **Species-level colourways (lustre).** A species may carry a designed
  variant colourway — deeper, paler, metallic — set at design time for
  the species. It never varies per individual. *(Lustre Law,
  `show/bible/COLOR-SYSTEM.md` §(b).)*
- **Move-performance anatomy variance.** A move is performed by the
  body performing it: performer shape, size, and class — including
  mythical/legendary anatomy — change the performance, and the variance
  is logged per move/species in the registry. One creature's
  performance of a move is never the universal animation.
  *(`show/production/battle/MOVE-ANIM-SCRIPT-FORMAT.md`.)*
- **Design-influence regional flavour.** The design influence shifts by
  region (R1 Pokémon-base, R2 Digimon-lean, R3 Monster Rancher-lean,
  R4 a mix plus originals). The render style on top of it never varies
  (§3). *(Owner style law, 2026-10-27.)*
- **Chibi proportion variants — as a device only.** Characters are
  full-size by default; chibi versions exist for in-between/eyecatch
  cards, B-roll/transitions, intro/outro/credits bits, and brief
  dramatic-comedic snap moments, inside the per-episode caps. Chibi
  models are proportion variants of the canon likenesses — same
  character, never a separate likeness. *(`show/production/CHIBI-CARD-SYSTEM.md`.)*
- **Background individuals.** Unnamed members of a species differ from
  the named cast and from each other — generated variation is their
  normal state. Only a **named** individual the owner rules enters the
  register; the variation generator may not mint register-class
  deviations (no absence-of-part, no posture-class changes) on its own.
  *(#318's fence; #80.)*

---

## 5. THE REGISTER — how a ruling becomes enforceable

There is **one** register. This framework does not create a second one;
it describes the flow that already exists, so every ruling travels it
the same way:

1. **The owner rules** — in chat, in a verdict, in a correction. His
   words are the ruling; a summary of them is how rulings drift (#318).
2. **The ruling lands in the individual's own record first** — a
   `deviations[]` entry in the #80 individual record: trait, species
   pattern, individual value, `status: RULED`, `ruled_by`, `ruled_on`,
   the consistency order ("MUST REPRODUCE in every generation of this
   individual"), and `source` pointing at where the ruling lives.
   PROPOSED entries are discussion only; generators never read them.
3. **The register re-compiles.** `RULED-DEVIATION-REGISTRY.json` is the
   cross-individual index over those RULED entries — an index, not a
   second store (#318). It exists so a casting director, portrait
   artist, or encounter designer can see every exception in one place
   and none is forgotten, "fixed," or handed to a second individual.
   Intake is owner rulings only.
4. **The generation-facing copy lands in the character's pack** —
   `pack.json` under `reference-packs/`: the ruling in `owner_rulings`,
   its hard edges in `do_not_change`, its wording in
   `prompt_negative_additions` / `variant_traits` where a prompt needs
   it. The Dorowani pack (eye-whites, 2026-10-28) and the Wispkin pack
   (horns, 2026-10-28) are the worked examples. This is the copy the
   generators and gates actually read.
5. **The production log indexes it** — a dated entry in
   `show/production/PRODUCTION-LOG-2026-10-27.md` (and its successors),
   so the ruling is findable by date and the governing text is named.
6. **The gates enforce it.** Frame-1 and likeness gates
   (`show/production/tooling/avatar-stack/` — `parity/frame1_gate.py`,
   `likeness_gate.py`) and the pre-delivery gate
   (`show/production/tooling/proof-gate/delivery_gate.py`, per
   `show/production/WORKING-RULES.md`) check output against the packs
   and the canon references. A gate that meets a deviation it cannot
   sort by §2 stops and names it — it never passes it silently.

**Rejections travel the same road.** A rejected deviation is recorded
with its status on the artifact itself (bundle manifest + clip-index
`unused_draft_special_case`, and a register note that it is a draft,
not a story individual) — so it stays findable, stays unused, and is
never re-proposed as new. The one worked rejection travelled further:
the owner superseded it on 2026-10-28, ruling the PR #389 Kittember
canon as the Region 4 regional variant, and every seat named here was
updated the same day (Box 1).

**What never happens:** a ruling that lives only in a chat message; a
register entry created by a generator; a pack edited to match a clip
instead of the clip regenerated to match the pack. The record leads;
the output follows.

## 6. THE ANTI-SLOP DOCTRINE

The owner is fighting AI slop — and learning to work with it when it
happens, when it's mostly close. That is why the variant rulings keep
happening, and they are policy, not accidents: when a generation lands
mostly right, the deviation can be absorbed into canon as a ruled
per-individual variant — slop becomes cast diversity, the thing real
species have anyway — instead of burning attempts chasing
pixel-perfection. The eye-whites and the horns both entered canon
exactly this way.

The price of absorption is the lock. Once a deviation is ruled, it is
**fixed for that individual**: it never flickers, grows, shrinks, or
vanishes, in a frame, a scene, or a season — and it never spreads to
another individual on its own. Variation that has been ruled is canon
and is policed like canon. **After a ruling, inconsistency is the
defect.** That is the whole bargain: generous at the ruling, absolute
after it.

---

*Drafted 2026-10-28. Seats this framework reads from: #80, #318, #324,
the reference packs, the production log, SHOW-BIBLE Laws 7/9/10,
COLOR-SYSTEM §(b), ORCHESTRATOR.md, WORKING-RULES.md,
CANON-SIGNATURE-ATTACKS.md, CHIBI-CARD-SYSTEM.md,
MOVE-ANIM-SCRIPT-FORMAT.md, DESIGN-BRIEF-canon-world.md §9. Owner lock
pending.*
