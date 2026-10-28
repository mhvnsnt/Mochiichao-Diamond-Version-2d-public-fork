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
  — #318 / `RULED-DEVIATION-REGISTRY.json`.

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
  never re-proposed as new.
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
→ **Box 1, can
...[truncated 10073 chars]