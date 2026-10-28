# #87 — RIVAL REMATCH SYSTEMS → postgame Ranger rematch spec

**What was studied.** The collector games' rematch architecture, as
documented publicly (decomp literature + community references): a
defeated trainer is not re-fought as stored — the game keeps a
*rematch table* per trainer: a ladder of team versions, a flag that
marks the first defeat, and a gate (story progress, an item, or a
rematch device) that unlocks the next rung. Scaling is data, not
code: each rung is its own team entry with its own levels, and the
ladder caps at a final version that repeats. Later games fold the
same shape into phone/device registries and postgame facilities.

**Native spec — `rematch.schema.json` shape (one record per Ranger):**

```
{ ranger_id, first_defeat_flag, rungs[], repeat_rung, gate }
```

- `first_defeat_flag` — an event/flag key in the #12 namespace
  (`progress.*`), set by the first loss; the rematch system never
  stores its own copy of "beaten" state.
- `rungs[]` — ordered team references `{team_id, min_level_hint,
  condition}`; conditions reuse the #12/#8 condition shape
  (story flag, fragment count, time band). A rung is a *reference*
  to a party record, never an inline copy — party data has one home.
- `repeat_rung` — index of the rung that loops once the ladder is
  exhausted (the architecture's "final version repeats" rule).
- `gate` — how rematches are offered (in-person revisit, device
  call, facility). **OPEN:** canon names no rematch device or
  facility for Mochiichao yet; the field ships empty.

**Canon state, honestly.** No rematch content exists in canon: no
Ranger is written as re-fightable, Hex's champion rematch is
undecided, and there is no postgame battle facility on record (the
Seven Mochii Isles postgame format — List 7 #66 — is the natural
home, unconfirmed). This file is the *format* a rematch takes when
canon creates one; it asserts zero instances.

**Wiring.** Reads #12 flags (world-systems EVENT-FLAG-ARCHITECTURE)
for defeat state; party records resolve through the same party data
the dojo/facility systems use (#94 generates facility parties;
organic Rangers' parties are authored, never generated — §94 keeps
the two apart). Postgame placement ties to #66's isles structure.

**Coverage.** Architecture: fully documented publicly, low risk.
Contents: format-only by design; every content slot OPEN.
