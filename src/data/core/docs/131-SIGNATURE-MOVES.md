# #131 — SIGNATURE MOVES → signature move system (designation in data + presentation)

**What was studied.** Signature-move practice in the
reference games and anime, as publicly documented: a move
so bound to one species that the move *is* the species in
the audience's mind — in game data usually an exclusivity
fact (a learnset of one) rather than a flag, in the anime
a performed identity (the attack the character is framed
by). The kit taken: signature status is a **designation
record over the registry**, not a move property and never
a stat — the same move id, marked as *this species'
signature*, with presentation consequences in both lanes.
No move data or text are copied.

## Canon anchors (verified — this is a locked table)

**Signature attacks are per-species canon (owner ruling,
2026-10-27):** a signature belongs to its species alone;
no shared attack templates. The locked seed register:

| Species | Signature (display) | Basis |
|---|---|---|
| Mochii | **Hydro Rush** | registry id AQUA_JET (display-renamed); learned by Mochii alone in learnsets.json — 1/47, STAB (CANON-SIGNATURE-ATTACKS, verified against learnsets data) |
| Kittember | **Fire Stream** | registry id FIRE_STREAM (already an original name); Kittember alone — 1/47, its highest-power STAB |
| Sproutle | **Leaf Blast** | registry id RAZOR_LEAF (display-renamed); Sproutle alone learns it |
| Wispkin | **Dark Wave** | registry id SHADOW_PULSE (display-renamed); a family move — its learnset entry is flagged **provisional** in the research mapping |
| Dorowani | **Water Orb** | **owner canon** (the making_something avatar animation IS the attack; PR #345). No moves.json entry exists; **stats owner-TBD, never invented** |
| Gabu | **Tremor** | **owner canon** (later owner ruling supersedes the research draft's OWNER CALL); game data assigns Gabu no canon attack — see the tension note |

**Tension flagged, not resolved:** the move-programme's
registry rename pass recorded display renames *touching*
nearby rows (AQUA_SHOT's display in the renaming batch;
EARTH_TREMOR as Tremor's underlying id in the rename
notes), while the research mapping states on file evidence
that Water Orb is **not** AQUA_SHOT and Gabu had **no**
assigned move. This spec registers both signatures as
owner canon with `moveId: null` and the conflict written
here and in STAGING — the registry representation of
Water Orb and Tremor is a landing/owner reconciliation,
never a join this package asserts. (Dorowani/Gabu also sit
outside the 47-species core data — species.ts 147/148,
held out of the roster conversion; the core-data gap is
Sideline A's flagged item, inherited here.)

## Native spec — `mochiichao/signature-moves/v1` (fragment = the seed register)

- `signature` — a designation record *on the species'
  move block* (beside the learnset, where #101's owed
  `tutor` list also lands): `{moveId | null, displayName
  (a #23 lookup key, not a literal), basis:
  exclusivity | owner-canon, status: locked |
  provisional}`.
- **Exclusivity is derived, not trusted:** for
  `basis: exclusivity`, the designation is checkable
  against the learnsets (the research mapping did exactly
  this: count learners; a signature claimed exclusive
  that a second species learns is a data error the
  landing audit can catch mechanically).
- **Teaching/learning, per lane (two-lane doctrine):**
  game lane — the signature is learned by whatever row
  grants it (learnset row via #129's flow, or another
  canon route); the designation adds **no** learning
  mechanic of its own and no power, accuracy, or priority
  modification — signature is identity, not a buff.
  Show lane — the signature is the species' framed
  attack: learned/perfected through #101's training
  grammar (DEMONSTRATE → ATTEMPT → FAIL-FORWARD →
  MASTERY), and arc planning (#82) treats a signature's
  first mastery as a character beat.
- **Presentation:** the signature's #9 animscript carries
  the fullest per-anatomy performance set for its species
  (the worked exemplar already exists: Hydro Rush scripted
  for Mochii in the battle-presentation package), and show
  choreography frames it as the species' identity shot.
  The animscript's `variance_notes` law is unchanged — a
  signature is performed by its species' anatomy, and
  (owner law) is never handed to another species as a
  template performance.

## Wiring

Designation lives on the species move block (core data
neighbourhood); joins the move registry (PR #366) by id
where an id exists, #129 (learning flow), #101 (both
lanes' teaching), #9 (performance), #82 (show beats),
#23 (display lookups). The register fragment ships the
six locked rows; the wider roster's signatures (the 47's
remaining species) are **OPEN** — the research mapping's
method (exclusivity from learnsets) is the documented way
they get derived, species by species, never batch-asserted.

## Coverage — honest

- **Architecture: documented pattern** (exclusivity-based
  signatures in data; identity attacks in the anime).
- **Contents: six locked rows, two with a flagged
  registry conflict.** Wispkin's row is provisional by its
  source's own flag; Dorowani's and Gabu's stats/existence
  in the registry are owner-TBD. Nothing beyond the locked
  table is asserted.
