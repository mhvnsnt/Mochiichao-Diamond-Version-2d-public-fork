# #116 — CHARACTER OUTFIT SYSTEMS → Ranger wardrobe system

**What was studied.** Outfit systems on both sides of the
two-lane house, from public documentation: in **animation
production**, the costume-set annex of a model pack — a
character's sheet grows per-outfit breakdown pages (each
outfit drawn as its own flat shapes, with turnaround deltas
only where the silhouette actually changes), and scripts call
outfits by set name so a hundred drawings stay consistent; in
**games**, the appearance record — outfit sets keyed to
context (home/field/ceremony), unlocked or authored per
character, with the face and body never part of the swap.
The kit common to both: **sets organise what the sheet
already draws; an outfit is clothing-deep, never person-deep.**

## The anchor in what exists (verified, with one flag)

The human model-sheet standard (#33, `list4-systems/
HUMAN-MODEL-SHEET-STANDARD.md`) already owns the ground
floor: **§6 Costume breakdown** — "every worn item as its own
flat shape" — and §7 palette's four-slot discipline. What #33
does not do is organise multiple costumes per human into
**sets with contexts**. That organisation is this system: a
wardrobe annex to #33, not a new sheet standard. Human sheets
land under `show/production/model-sheets/humans/` (per #33's
staging); the wardrobe index lands with them.

**The precedent — Falk, handled honestly.** Falk is canon: a
named dojo master in the Region 1 circuit order (**Lin /
Falk / Tetsu / Kenji / Phantom / Shizuku / Homura**, #30
dojo encounters, verified in this workspace). The design lane
has worked Falk in **three outfits — a dojo set, a field set,
a casual set** (owner-confirmed in the side lane, 2026-10-27:
dojo = his leader presentation, field = out in the wild
battling, casual = off-duty). ⚠ However: **no Falk wardrobe
file exists in the workspace sources this package could
read** (searched `~/workspace/mochichao-design/` and the
teardown packages — the design lane's Falk material has not
landed as files here). So the three-outfit set is registered
as **REPORTED — UNVERIFIED TARGET**: the format below is
built to receive it, the fragment carries Falk's rows marked
with that status, and instancing them as filed canon waits
on the design lane's sheets actually landing. This is the
real-code wiring law working as intended: reported ≠ read.

## Native format — `mochiichao/wardrobe/v1` (fragment)

```
outfit { outfitId, humanId, context, breakdownRefs[],
         paletteRef, status }
wardrobeIndex (per human) { humanId, outfits: [<outfitIds>],
         defaultByContext: { field: id, dojo: id, casual: id } }
```

- `context` — **closed vocabulary of three**, the owner's own
  words for Falk's set: `field | dojo | casual`. A fourth
  context (ceremony, disguise…) is a vocabulary revision by
  ruling, never a free string — the same discipline as #31's
  categories and #107's trigger classes.
- `breakdownRefs[]` — pointers to the outfit's §6 breakdown
  entries on the human's sheet. The wardrobe system draws
  nothing: each outfit still needs its own §6 flats, and a
  turnaround delta **only** where the outfit changes the
  silhouette (a coat, a hat, armour) — head/face construction
  (§2), expression set (§3), and mouth set (§4) are shared by
  every outfit, untouched. **Wardrobe is below the neck plus
  worn items; the person is not redressable.** (Likeness law,
  applied to clothing: an outfit that changes the face read is
  a design-gate failure, not a bold choice.)
- `paletteRef` — the outfit's §7 four-slot sampling, taken
  from the character's filed art. **Worked caution, from the
  Falk ruling itself:** the owner considered changing the
  cream of Falk's jacket to red and **kept it exactly as it
  was** (side lane, 2026-10-27) — a wardrobe entry records the
  palette as locked; "fixing" a recorded colour later is a
  change that needs its own ruling.
- `status` — core provenance convention; Falk's rows carry
  `REPORTED — design lane, not yet filed` until the sheets
  land (see above).

## Who chooses the outfit (per lane)

- **Show lane:** the script/board calls the outfit by context
  (a dojo scene dresses its leader in `dojo`; a route scene in
  `field`) — the call is an xsheet/board annotation, and the
  wardrobe index is what the board artist resolves it against.
- **Game lane:** context derives from place/event state (#12
  flags + area kind) — an NPC's record names its index, the
  area supplies the context. NPC schedules (#93) may pin a
  context per timetable row (a named routine that is *always*
  the dojo set, e.g.) — schedules own routines, wardrobe owns
  the clothes; neither edits the other.

## Wiring

- **#33 human sheets:** wardrobe index annexed to each sheet;
  gates H-1/H-2 are unaffected (mouth/expression are
  outfit-invariant); the §6 gate gains one wardrobe check —
  every `defaultByContext` entry resolves to a filed §6
  breakdown, or the index row carries the REPORTED status.
- **Rig lane:** worn-item deformation follows the rig
  teardown's Shrinkwrap rule per outfit (rig-and-mouth-systems
  package) — one rig, per-outfit shrinkwrap sets; outfits
  never fork the rig.
- **Cast index:** `show/shared/cast.json` (verified real, per
  the repo audit) is the show's two-way cast index — a human's
  wardrobe index id is a candidate field for it at landing;
  proposed, not edited here.
- **Creatures:** out of scope by the standing distinction —
  creatures have no wardrobe system. A creature's worn/carried
  item is a #31 held record and a rig shrinkwrap case (e.g.
  Dorowani's shell), never an outfit.

## Coverage — honest

- **Architecture: fully documented** (costume-set annexes +
  context-keyed appearance records are standard practice on
  both lanes).
- **Contents: one reported cast member.** Falk's three
  contexts are owner-confirmed in conversation and unfiled in
  the workspace — flagged as such in the fragment, not
  laundered. Every other human's wardrobe (Mochiko, Hex, Aeon
  — all canon cast with filed art under #33's sources) is
  **OPEN**: their outfits exist as sheet art; organising them
  into indexed sets is production work this package specifies
  but does not perform.
