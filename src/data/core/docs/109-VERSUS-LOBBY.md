# #109 — LINK-BATTLE FORMATS → versus battle lobby & rulesets

**What was studied.** The versus/format architecture of the
reference games, as publicly documented: a battle between two
players is governed by a **format record** — party size, how
levels are handled (natural, or set to a standard value for the
match), team preview, and **clauses** (named legality rules:
no duplicate species, no duplicate held items, restricted-class
exclusions) — and a team is **validated against the format**
before the match, by data checks only: every species exists,
every move is legal for that species, every item is legal to
hold. Tier lists and format ladders are community/official
*contents* layered over that record shape. The kit taken: the
format record + the validator. No tier contents are taken —
none could be; tiers are balance rulings, and ours are OPEN.

## The real-code boundary (stated before the format)

The validator below is specified against data whose existence
is **verified** (repo audit, `species-data-system/
AUDIT-WHAT-EXISTS.md`): `src/data/core/species.json` +
`species.schema.json`, `src/data/core/learnsets.json` (47/47
rows), `src/data/core/moves.json`, the machine-move registry
(PR #366 — 352 moves, General/Rare classes), `src/lib/
global_roster.json`, the individual record (#80), and the
storage location field (#106, list11). **No battle engine,
link/networking code, or lobby UI appears in any audited
source.** So this package specifies the ruleset format and the
validator as a data-layer spec; wiring it into an engine is an
**UNVERIFIED TARGET** (registered in STAGING.md) — the landing
lane must first find or build the engine surface it plugs
into. Claiming more would be hand-tooled integration, which
the real-code wiring law forbids.

## Native format — `mochiichao/versus-ruleset/v1` (fragment)

```
ruleset { rulesetId, displayName, partySize, levelMode,
          levelValue, clauses[], status }
```

- `levelMode` — `natural` | `set`. `levelValue` ships **null**:
  the reference standard values are documented, but
  Mochiichao's level scale/cap is not stated in any source this
  package can cite, so the value is OPEN, not borrowed.
- `clauses[]` — closed clause vocabulary, each clause a flag
  the validator enforces:
  - `species-clause` — no two party members of one species.
  - `item-clause` — no two members holding the same item
    (reads #31's `held` category records by id).
  - `mythical-class` — `allow | exclude`: reads #41's proposed
    `presentationClass` field. **Dependency flagged:** that
    field is itself a proposal awaiting the sheet-standard
    lane; until it lands, this clause is unenforceable and
    rulesets must not use it (the fragment says so).
  - `machine-moves` — `allow | general-only | none`: legality
    of machine-taught moves per the PR #366 registry classes.
- `displayName` — #23 lookup, as always. Zero rulesets are
  instanced; format *names* (the reference world's "OU"-style
  tier labels and their kin) are neither copied nor coined here.

## The validator (spec — checks, in order)

1. **Party source.** Every entrant is an individual record
   (#80) whose `location` (#106) is `party` — a stored or
   Garden-resident Mochi cannot be entered; the lobby reads
   the roster, it never reaches into storage.
2. **Species exists.** `species` resolves in species.json /
   global_roster.json. (Dorowani/Gabu note: they hold dex-layer
   records but no species.json record per the audit — under
   this check they are **not yet enterable**, which is the
   audit's known core-data gap surfacing honestly, not a ruling
   against them.)
3. **Move legality.** Each move ∈ the species' learnset row
   (learnsets.json) ∪ the individual's machine-taught records
   (PR #366 registry ids), filtered by the ruleset's
   `machine-moves` clause. Learnset rows flagged `provisional`
   in core data validate with their flag visible — the lobby
   surfaces data provenance, it does not launder it.
4. **Item legality.** Held item resolves in the #31 registry
   with `useContext.held = true`; duplicate check per
   `item-clause`.
5. **Level handling.** `natural` reads the individual's level;
   `set` reads `levelValue` (unenforceable while null — a
   `set` ruleset cannot run until the owner sets the value;
   the validator must refuse, not improvise).
6. **Ability slot.** The individual's `abilitySlot` (#107's
   proposed field) must name a slot the species record's
   `abilities`/`hiddenAbility` fields actually offer — today
   those fields are empty for all 47, so **every versus team
   currently fails this check**, which is the correct result:
   versus cannot honestly open before the ability contents
   land. Stated plainly so nobody "fixes" it by skipping the
   check.

## Lanes

Versus is **game-lane only**. The show's battles run on the
autonomous-action doctrine — creatures fight with their own
agency, Rangers direct at moments — and no lobby rule,
clause, or tier may choreograph a show fight. A show *versus
exhibition* (a dojo spectacle, a festival bout) is staged as
story, with #30/#100's encounter grammar, not with this format.

## Coverage — honest

- **Architecture: fully documented** (format records +
  data-only validation + clauses are the documented pattern).
- **Contents: zero.** No ruleset, tier, level value, or ranked
  structure is asserted. The validator is a spec against real
  schemas; its engine home is an UNVERIFIED TARGET, and two of
  its six checks depend on owner/lane contents (abilities,
  level value) that do not exist yet — by design, it says so
  instead of passing silently.
