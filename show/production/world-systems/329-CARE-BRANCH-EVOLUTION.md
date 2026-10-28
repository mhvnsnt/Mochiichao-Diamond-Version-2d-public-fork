# #329 — CARE-SHAPED EVOLUTION BRANCHES → how you raised them picks the road

**The gap this fills.** #8's edge model and #199's
method layer give every evolution one edge and one
method class from a closed vocabulary (`growth |
level | bond | colony | form-shift | item | trade |
place | time`). What neither has is *branch
selection*: one individual standing at a fork where
the road taken is read from how it was raised.
Digimon's evolution grammar is built on exactly
that — care, training, and care mistakes shape
which branch a Digimon takes — and Region 2's
flavour law (Pokémon core + a Digimon quarter-turn;
a line may break its body plan once at the final
stage) has declared the *taste* for it without a
mechanism. This spec is the mechanism. It mints
**no new method word** (#199's law): a branch is
not a method. It is two or more ordinary edges from
one node, told apart by their conditions.

**What was studied.** Digimon's care-branch
grammar as publicly documented (care quality,
training load, and mistake counts discriminating
evolution outcomes), and Pokémon's own single
native precedent, which the translation stands on:
Wurmple's branch (Silcoon or Cascoon) is picked by
a hidden per-individual value read at the evolution
moment. Pokémon already forks an edge and reads a
fact to choose; Digimon's contribution is *which*
fact — not a hidden roll, but the care history.

## Native spec — branch selection over `mochiichao/evolution-edges/v1` (#8/#199)

- **Declaration is per line, on the sheet.** A line
  declares `branching: care` on its sheet (the
  design lane's act, beside the method prose).
  Undeclared lines have single edges and evolve
  exactly as they do today — the Pokémon base's
  fixed lines are the default state of the world,
  and branching is the exception a sheet opts into.
  Zero lines are declared by this package.
- **A branch is edges + conditions, nothing new.**
  A branching stage carries two or more edges with
  the same `from`, different `to`, the *same*
  methodClass (the method is still how it evolves —
  usually `growth`, `level`, or `bond`), and
  `conditions[]` carrying care reads. Condition
  operands are care facts the programme already
  keeps: #39's bond/care facts, #28's care axes and
  keeper-steered alignment read (via #293's raising
  layer), #179's training values, and the absence
  side Digimon calls mistakes — in our records, the
  care gaps the same facts already show (a drive
  left unmet is a fact in #28's family, not a new
  "mistake counter" — no new ledger is founded).
- **Selection happens once, at the moment.** When
  the method's trigger fires, the consumer reads
  the branch conditions over the individual's facts
  *as they stand* and takes the first edge whose
  conditions hold; a declared branch must carry a
  **default edge** (conditions empty) so a fork can
  never strand an individual whose care history
  matches no authored road. The read is then
  spent: the evolved individual is the *same*
  individual (#199's law for every class), and no
  system re-reads the fork afterwards — there is no
  branch-switching, no second chance at the other
  road, and no presentation may pretend otherwise.
- **The A9 fence — untouched, again.** Pair-merge
  edges (Lonelily → Pairbloom → Twinvow) carry
  `representation: "OWNER_DECISION"` in #8's data;
  branch selection defines no semantics for them,
  and care conditions may not be authored onto a
  pair-merge edge to route around that decision.
  Care never merges anybody. (The #103 refusal is
  the same wall seen from the other side.)
- **Show-lane mirror.** #199's mirror holds, word
  for word: the method is biography, never a
  trigger. In the show, a branching evolution is
  the creature's own growth answering the life it
  actually lived — a script may show the care as
  the moment's *meaning*; no Ranger steers a branch
  like a lever, and no episode may stage a character
  "aiming" a Mochi at a branch, because in the game
  there is no aiming either — there is only the
  care, and then the moment reads it.

## Wiring (proposed)

Lands inside #8/#199's home as a semantics section
+ a sheet-declaration field in the design lane's
sheet format: **zero vocabulary edits, zero schema
shape edits** — branch edges are ordinary edges
whose conditions cite care facts. Consumers: the
evolution consumer that already reads #199's
classes gains the first-matching-edge rule for
declared forks only. Reads: #8 edges, sheet prose,
#39, #28/#293, #179. Writes: nothing (the evolution
itself writes what it always wrote).

## Open slots (nothing invented)

Which lines declare care branching (per-line design
acts — R2 lines are the flavour law's candidates,
not its assignments) · each declared fork's
condition values (sheet data, authored with the
line) · A9 pair-merge representation (**OWNER
DECISION** — #103's flag, carried verbatim, third
package running).


**Reconciliation — List 35 #337 (recorded at List 35's landing, 2026-10-27):** #337's drift is NOT this file's input, and this file's care-shaped branches are NOT drift outputs. The two systems meet only at the individual they both describe.
