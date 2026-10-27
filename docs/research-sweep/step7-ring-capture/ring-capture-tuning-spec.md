# Ring-capture tuning spec (Step 7, gated ring-capture zone) — NEW this pass
Status: this ADDS tuning parameters to the existing gated system
(captureLoop.js + ring-capture-zone-spec.md, PR #37 lineage). It does
NOT change the gate, the mechanic, or the defaults.
Unchanged (restated so this file cannot be misread as a redesign):
- Mechanic stays ring capture. Default capture stays the standard orb
  throw (Luigi Cubes: standard x1 / sturdy x1.5 / prime x2 / sure).
- Ring capture is gated: zone visited + zone played + ring items > 0,
  else completeLoop/decay/struggle refuse and capture nothing.
- Arcade is THEME/SETTING only (cabinets, neon, retro scenery as
  atmosphere). No token economy, no cabinet mini-games, no high-score
  mechanics. The zone is NOT called "Arcade Zone" and is NOT a Safari
  variant; its name is still open for Mars to pick.
New tuning parameters (authored here, for the Step 7 agent to playtest):
- ring_close_ms: time for the thrown ring to geometrically close around
  the target (tune 400–900 ms; too fast reads as a snap, too slow reads
  as a miss).
- ring_shrink_visual: the ring's on-screen radius shrinks as it closes;
  the visual shrink and the geometric close MUST use the same clock, or
  the player reads a closed ring that has not closed.
- struggle_checks: number of break-out checks during the close (tune
  1–3); each check uses the target's existing struggle logic, never a
  new random table.
- item_cost: exactly 1 ring item per attempt, never below zero (existing
  consumeRingItem rule, unchanged).
- fail_feedback: a failed attempt shows the ring opening + target
  settling (visual only); it never consumes a second item and never
  changes the target's state.
Wiring target: Step 7 agent — captureLoop tuning constants + zone spec
addendum. Gate: 20 gated attempts (10 success-path, 10 fail-path) consume
exactly 20 items, refuse cleanly at 0 items, and never capture while
locked.
