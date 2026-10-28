# #146 — ONE-WORLD SAVE & VISIT RECORDS → the save architecture of a continuous world

**Seat in the doctrine:** #122's NG+ question dissolved
into a better one. If the world is one and the journey
just continues (OWNER RULING + REFINEMENT, 2026-10-27),
the save never faces a cycle boundary at all — no
persist/reset table, no second run. What it faces instead
is *extent*: one payload that must hold a whole connected
world without growing a per-region fork for every system.
This spec is #96's payload read under that condition, and
it adds exactly one derived view and zero stored fields.

**What was studied.** Save design in the publicly
documented record for persistent single-world games:
the durable pattern is *facts stored once, views derived
everywhere* — a world map's "visited" shading, a journal's
region pages, and a completion percentage are all renders
over the same encounter/flag facts, and the games that
store the renders separately are the ones whose saves
contradict themselves. #14 already made this programme
law (completion is a derived popcount); #96 fixed the
payload. The kit taken: audit every section for region
forking pressure, and refuse each fork with a derivation.

## The audit (over #96's verified payload sections)

| Section (#96) | One-world pressure | Disposition |
|---|---|---|
| `dex` bitsets | "Per-region dex storage" | **Refused** — global bitsets; regional sections are views (#127/#144) |
| `flags` (story/progress/tech/vars) | "New namespace per region" | **Refused** — the four namespaces are region-blind; region lives in the flag *ids* (`story.r1_*` precedent verified in #12), not in new namespaces |
| `party` / `roster` | "Region party boxes" | **Refused** — individuals are individuals (#80/#106); `location` already says where someone is kept, and a region is not a storage class |
| `world` | "Per-region world state" | **Refused as a fork; read as scoped content** — the section holds schedule overrides in force + session state (#96/#93 shapes); overrides name their areas, and areas know their regions. One section, area-keyed contents |
| `meta` | "Cycle counter" (#122's proposal) | **Dead with #122** — no cycle exists; `meta` keeps save version / playtime / slot id, unchanged |

Net stored change proposed by the entire connected-world
doctrine: **none.** That is the doctrine's proof at the
data layer — a world that needs no new save machinery to
be one world was already one world in its facts.

## The one derived view — `mochiichao/visit-record/v1` (fragment beside this doc)

- `visitRecord` (derived at read time, never persisted):
  per region — `{regionId, visited (bool), firstArrival
  (the flag id that evidences it, nullable), circuits:
  the #143 record's capstone state, isles/areas evidence
  count}`.
- **Derivation:** a region is `visited` iff any #12 flag
  whose id belongs to that region is set — arrival beats
  (#127), progress clears, #32 reveal flags — OR any #7
  encounter fact / #97 research tally exists for an area
  in it. `firstArrival` names the *earliest-evidencing*
  flag the record can cite (by the flag's own story
  order where the atlas knows it; where order is
  unknowable, the field renders the *set*, not a guessed
  first — honesty over tidiness).
- **Consumers:** the licence (#98) renders the visit
  record as its "everywhere the Ranger has been" page —
  standings-as-views law holds (the licence stores
  identity only). The atlas (#137) shades visited regions
  from the same derivation. #146's view is the *single
  home* of "visited": any other system that needs the
  fact reads this derivation, never its own.

## Wiring

Audits #96's sections (no edits proposed to #96 itself);
flag-id discipline joins #12; views join #127/#144
(regional sections), #98 (licence page), #137 (atlas
shading); integrity rules unchanged from #96 (dual-slot
rotation, per-section CRCs, derived data recomputed on
load, never saved — this view obeys that law by being
one of the derived).

## Coverage — honest

- **Architecture: fully specified** (audit table + one
  derivation, with its unknowable-order case stated).
- **The one thing this spec cannot do:** verify the
  in-repo save implementation. The audit evidence (per
  List 13's register) covers data + docs — `src/data/
  core/`, `src/lib/global_roster.json` — and #96 is
  itself a spec over that evidence. Whether a runtime
  save *file* exists in the repo today is an UNVERIFIED
  TARGET carried into STAGING: this package's claim is
  about the architecture the specs jointly describe, and
  it is labelled as such, never as engine wiring.

**Registration (List 23 #223, landing 2026-10-27):** world-visiting sessions register beside this file's visit records. The zero-write audit is the wiring, as with this file's own audit: every proposed guest-write is refused with a derivation, and the net stored change to a host save is ZERO. (Addendum: guest-seeing writes no dex entries; session cap of four.)
