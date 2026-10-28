# #104 — CONTEST RIBBONS / MEDALS → individual honours (per-Mochi career record)

**What was studied.** Ribbon/medal architecture in the reference
games, as publicly documented: decorations earned by an
*individual creature* — for contest wins, for effort milestones,
for participating in landmark battles — stored **on that
individual's record**, displayed on its summary page, and
carried with it through every later system (trades, storage,
transfers between generations in the documented cases). The
load-bearing property, and the reason this is its own system:
a ribbon is a fact about *this creature's life*, not about the
player's progress. The kit taken: per-individual stored honour
stamps with earning provenance. No ribbon lists, names, icons,
or criteria are copied.

## Not #69 — the architectural distinction, stated once

| | Achievements (#69) | Honours (this spec) |
|---|---|---|
| Belong to | The Ranger | The individual Mochi |
| Form | Predicates over derived state, evaluated at read time, **never stored** | **Stored stamps** — earned-event facts on the individual record |
| Grant | Nothing; the layer records | Nothing either — an honour is a record, not a reward |
| Travel | Stay in the Ranger's Mochiioteca | **Travel with the individual** — trade (#68), storage (#106), any future transfer |
| Example shape | "keptCount reached N" (derived) | "This Kittember was honoured at the Garden showcase, R1" (a day in a life) |

The distinction is #69's own law read from the other side: #69
refused to store what can be derived from *player* state;
honours store what can be derived from *nothing* — a specific
event in a specific individual's life either happened or it
didn't, and the stamp is the only record. (Precedent: #68's
provenance stamps — append-only facts an individual carries.)

## Native spec — `mochiichao/honours/v1` (fragment beside this doc)

- **Home:** the individual record (#80's model; the save's
  roster section, #96). An honour is a stamp in the record's
  `honours[]` list: `{honourId, earnedVia, eventRef, beatRef}`.
  - `earnedVia` — closed source vocabulary, one per accrual
    system: `care` · `showcase` · `battle`.
  - `eventRef` / `beatRef` — pointers to the earning fact: a
    careLog entry (#28 — careLog is truth), a showcase result
    (#78), a battle record (#30/#45/#100 encounter clear the
    individual participated in). A stamp without a resolvable
    earning fact is a data error.
- **Accrual rules by source:**
  - `care` — honours for a life well-kept: thresholds over the
    careLog's own facts (an individual whose care history shows
    sustained attention). Thresholds are derivations **over the
    individual's facts** — writing the stamp is done by the care
    system at the moment the threshold is crossed, so the stamp
    and its evidence can never disagree.
  - `showcase` — honours from Garden showcase participation and
    placement (#78: the showcase's phases and axis scoring are
    the earning events; its no-battle-state constraint is
    untouched — a showcase honour certifies presentation, never
    combat).
  - `battle` — honours for landmark participation: a dojo clear
    (#30), a gauntlet bout (#100), a Syndicate set-piece (#99)
    the individual was in the party for. The honour certifies
    *this Mochi was there* — the clear flag belongs to the
    Ranger (#12); the stamp belongs to the Mochi.
- **Display:** the individual's summary surfaces (game) and —
  show-side — honours are *visible character history*: a ribbon
  a Mochi wears is a prop with a provenance, citable in episode
  planning (#82's conservation: an honour shown must be an
  honour earned in an earlier record).

## OPEN register (nothing invented)

The honour **list** — ids, names, icons, tiering if any, and
every threshold — is OPEN owner content, exactly as #69 left
its achievement list open. Canon names no ribbon or medal.
The fragment ships the record shape and one shape-only worked
example with its title OPEN.

## Wiring

Writes: #28 (care thresholds), #78 (showcase results), battle
records (#30/#45/#99/#100) — each writes stamps only for its
own source kind. Reads: individual summary UI, #68 trade
(stamps travel; a trade record's provenance view may cite
them), #106 storage (stamps are part of the record that moves;
a release tombstone may carry the honour *count*, see #106),
#96 (roster section carries `honours[]`).

## Coverage — honest

- **Architecture: fully documented**; per-individual carried
  decorations are a long-documented pattern.
- **Contents: shape only.** Zero honours are named or instanced;
  the accrual *sources* are wired to real systems, the honour
  catalogue is the owner's to create.
