# #187 — BATTLE REPLAYS & RECORDING → replay-from-record system

**What was studied.** Replay architecture in the publicly
documented record: mature replay systems (fighting games,
strategy titles, racing ghost data) do **not** store video —
they store the *inputs* and the *seed*, and re-run the
deterministic simulation at playback. The finding is
architectural: a replay is only as real as the simulation's
determinism; where a system cannot re-run, it stores outcomes
instead and calls the result a recording, honestly a lesser
thing. The kit taken: input-log replay over a seeded
simulation, the recording seated with the game's other
history records. No formats, code, or data are copied.

## Canon anchors (verified in the packages)

- **#10's flow already writes the replay payload.** In
  BATTLE-UI-FLOW, `COMMIT` is "the only input-side write" —
  the chosen command is written to the **turn record** — and
  `RESOLUTION` drains one ordered message/effect queue
  (announce / animscript / damage / status / cry / interrupt /
  tempo). A battle, as #10 defines it, *is* a sequence of
  committed commands plus the queue they caused. Nothing new
  must be captured at battle time beyond the setup and the
  seed.
- **#94's seeded discipline is the determinism precedent.**
  Facility parties are generated `{facility_id, round, seed}`
  — "same seed + round + facility = same party", reproducible
  and replayable, the seed deriving from the streak record
  (#86). Replay extends that discipline from party generation
  to resolution itself.
- **#126's Hall of Fame is the seating pattern:** battle
  history stored as snapshots *on purpose*, "append-only:
  records are never edited or deleted", ids and facts, never
  name strings. Replays are history of the same class.

## Native spec — `mochiichao/battle-replay/v1` (fragment beside this doc)

- **Replay record:** `{replayId, battleKind, setup, seed,
  turns[], outcome, recordedBeat}`. `setup` cites the battle
  plate (#128), the area, and both sides' parties as #80
  individual references *plus* the battle-relevant snapshot
  (the living records may later change — evolve, be released;
  the replay must still run, so it snapshots what resolution
  read, per #126's snapshot logic). `turns[]` is #10's turn
  records verbatim — committed commands per side per turn.
- **The determinism requirement (stated as a requirement,
  not a claim).** Playback re-runs `RESOLUTION` from setup +
  commands. Therefore: **every random draw resolution makes
  — damage variance, accuracy, AI tie-breaks (#18), any
  generated content (#94) — must draw from a seeded stream
  whose seed is recorded in the replay record.** Any
  resolution path that draws unseeded randomness makes its
  battles unreplayable; that is a defect in the engine, and
  this spec names it rather than storing outcome-video as a
  substitute. Whether the landed resolution code is fully
  seeded could not be verified from the audited sources (no
  engine code exists in them) — registered in STAGING as an
  UNVERIFIED TARGET; the requirement lands regardless.
- **Playback is a sandbox.** Re-running a battle writes
  **nothing**: gain events (#177) fired once, at the live
  battle, and never re-fire; no honours (#104), no research
  tallies (#97), no dex states (#14), no streak records
  (#86) move at playback. The playback projection is #10's
  read-only render snapshot, driven by the re-run queue.
- **Append-only, beside #126.** Replay records are never
  edited or deleted by any system in this spec. A dispute
  about a replay is settled by re-running it, not amending
  it. Retention limits (how many replays a save keeps) are
  OPEN — a capacity number, like #106's, that canon has not
  fixed.
- **Whose replay it is.** A replay belongs to its battle's
  participants: versus replays (#109) are the two Rangers'
  record; wild/dojo/facility replays are the Ranger's own.
  Sharing a replay outward rides the share grammar proposed
  in #191 (a #90-format block) — a shared replay is a view,
  never an import into another save's history.

## Show lane — stated flatly

**A replay is never show footage.** Show battles are staged
under the autonomous-action doctrine — creatures fighting
with their own agency, Rangers sometimes commanding — and
no game record is, or can be cut into, an episode's battle.
If an episode ever shows a Ranger reviewing a past fight on
the Mochiioteca, what the audience sees is staged animation
of a memory, presented through the device (#149's screen
grammar); the replay system supplies, at most, which fight
it was. The lanes do not touch.

## Wiring

Reads: #10 (turn records, queue), #94/#86 (seed
discipline), #80 (party snapshots), #128 (plates). Writes:
replay records only, in the history seat beside #126.
Suppresses at playback: #177, #104, #97, #14, #86.

## Coverage — honest

- **Architecture: fully documented** — input-log replay is
  the reference pattern across every genre that has one.
- **Contents: no battle is instanced as a replay here;**
  retention, sharing permissions beyond the participant
  rule, and the engine's actual seeding are OPEN /
  UNVERIFIED as registered.
