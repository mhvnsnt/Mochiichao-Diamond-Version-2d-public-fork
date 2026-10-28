# #14 — MOCHIIOTECA COMPLETION LOOP (teardown → native spec)

**What was studied.** The completion architecture of the reference
games: a per-species **discovery state** (never-met → seen → kept),
counts derived from those states, and a reward ladder hung on the
counts — certificates, items, and in later generations device
upgrades. The load-bearing design fact, visible across the whole
public record: **the states are per-species data; everything else —
counts, percentages, rewards, what a page shows — is presentation
computed from them.** Our canon already embodies this (below), so
this spec mostly *names* the loop and wires its open ends.

## The states (canon already runs them)

**Landing re-point (2026-10-27, authorised by the authoring lane):** the
species-systems package has since landed (PR #398) — the discovery-state
and sheet-discovery fields this spec consumes are the ones defined in
`show/production/species-systems/MOCHIIOTECA-FORMATS.md`: the species
record's `discovery` block (`seen_name`, `subtitle_eligible`,
`reveal_note`), the external `seen_bits`/`met_bits` state flags
(MOCHIIOTECA-FORMATS §1.2 and its §4 sheet mapping), the fixed footprint
grid format (§3), and the cry pointer + parameters format (§1.4). The
wiring below targets the **discovery element as canon already
implements it** — the dex media registry
(`src/lib/generated/dexEntryMedia-20261026.json`) and `DexView.tsx`,
whose stated rules are the state machine in miniature, and are the
implemented instances of those MOCHIIOTECA-FORMATS fields:

- **unseen** — slot unfilled; silhouette display (the 16×16 discovery
  silhouettes exist for exactly this); no footprint, no cry
- **seen** — the Ranger has met it: silhouette lifts, name and cry
  unlock (`cry_rule`: play-cry available for seen/caught entries;
  V1 default, R1 available)
- **kept** (caught/partnered) — full entry: portrait, dex text,
  **footprint** (`footprint_rule`: footprint visible for CAUGHT
  entries only — hidden for seen-only and undiscovered), cry, media

State transitions come from exactly three sources, all wired
elsewhere in this package: a spawn-table encounter (#7) marks
**seen**; a successful keep marks **kept**; an event effect
`mark_seen` (#12) covers scripted first meetings (a species the story
introduces before the wild does — Wispkin's EP01 logic, a face met
in dread before it is ever "encountered").

**Where the states live:** the game's registry/save layer — as
Sideline A's alignment map already established, states are
*presentation logic over one registry entry*, not fields on the
species sheet. The sheet's `discovery` element carries habitat,
method and rarity (where and how meeting happens); the state (that
it *has* happened, for this Ranger) lives with the Ranger's save.
This spec changes none of that; it consumes it.

## The loop

```
meet (spawn #7 / scripted #12)  →  seen
keep                            →  kept
counts derived at read time     →  seenCount, keptCount, per-region counts
milestones tested on counts     →  rewards (below)
```

- **Counting scope.** The roster canon counts **47** (core), with
  Dorowani and Gabu present in every dex/asset layer (49 entries in
  the registry) — completion percentages are computed against the
  registry's entry count so the device stays honest as the roster
  grows, and wave-1 species (124 stages, future-considered until the
  owner locks them from designs) **do not count** until they hold
  registry entries. A completion loop that counts un-locked species
  would punish the player for the studio's roadmap.
- **Per-region counts** ride the same derivation (a registry entry
  knows its region) — Region 1 completable in Region 1, which is
  what makes a season-shaped game feel finishable in chapters.

## The reward ladder — structure canon-shaped, contents OPEN

Canon fixes two facts: the Mochiioteca has **progression upgrades
that exist in the story flags** (season canon map), and Fragments —
not dex counts — gate the season spine (#11). So the ladder is
deliberately **device-shaped, not world-shaped**: completion rewards
upgrade the *Mochiioteca itself* and the Ranger's quality of life,
never the route graph. Proposed structure (kinds, not contents):

| Milestone kind | Reward kind | Status |
|---|---|---|
| First seen / first kept | Device wakes its registry functions (cry playback, footprint page) | Structure ours; consistent with the registry rules |
| Region seen-complete | Region certificate + a Manual-page style record | Kind proposed; contents OPEN |
| Region kept-complete | Mochiioteca upgrade flag (`story.*` — canon says upgrades live in story flags) | Kind canon-shaped; the upgrade's identity OPEN |
| Roster thresholds (25 / 49 / …) | Cosmetic/utility unlocks | OPEN — thresholds and rewards are owner/game-design decisions |

Every cell that would require inventing a reward, a threshold or an
upgrade is marked OPEN in this table on purpose. The loop's *shape*
is specified completely; its *prizes* are the owner's to name, the
same way stat numbers wait for the canon lock.

## Show-side echo

The show spends this loop as drama, not UI: a first meeting is a
subtitle-rationed moment (subtitle law), the footprint page is why
Mochiko reads tracks, and Frost — Wispkin's nightly trace — is a
seen-state the audience watches her *earn* the reading of. The
completion spec's states give episode planning a precise vocabulary:
a species can be *unseen*, *seen-but-not-met-again*, or *kept* in a
script's production notes, and the three states stage differently.

## Coverage — honest

- **Architecture: fully documented** across the public record; the
  states/counts/rewards layering is not in dispute anywhere.
- **Our wiring: canon at the state layer, structural at the reward
  layer.** The three states and their media rules are implemented
  canon (registry + DexView, PRs #228/#243). Counts derive from them
  with no new data. The reward ladder's *kinds* are specified; its
  *contents* are entirely open owner decisions, and the two
  canon facts it rests on (upgrades in story flags; Fragments gate
  the spine, not the dex) are cited rather than extended.

**Extended by:** #97 research tasks (`show/production/world-systems/97-RESEARCH-TASKS.md`) — the Mochiioteca research levels layer over this completion spec. (List 11 landing, 2026-10-27.)
