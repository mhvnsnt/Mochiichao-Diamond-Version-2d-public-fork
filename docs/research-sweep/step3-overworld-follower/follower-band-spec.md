# Follower distance-band spec (Step 3, overworld / follower) — NEW this pass
Source technique: public companion-follow write-ups found this pass
(follow-radius / idle-radius band). Restated here in this lane's terms;
no source code copied.
- Follow radius: the distance beyond which the follower starts moving.
- Idle radius: the comfortable distance the follower tries to hold when
  near the player; inside it, the follower stops.
- Between the two radii the follower adjusts velocity to hold the band —
  neither crowding the player nor lagging behind.
- Compare squared distances where possible (avoids a square root per
  frame); a queue/array trail (existing follower spec, PR #37 lineage)
  remains the position source, the band only decides WHEN to move.
- Queue-trailing variant (also found): record player positions in a queue
  and have the follower chase lagged entries (lag ~20–50 steps at 60 fps
  in the teaching example). This is an ALTERNATIVE to the trail rule, not
  an addition — Step 3 agent picks one source of truth, never both, or the
  follower will double-lag.
Licence: technique only; no code staged.
Wiring target: Step 3 agent — follower module tuning constants
(follow_radius, idle_radius, move_speed), playtested against the existing
1-second-to-slot gate. Multi-follower: each follower gets its own band
offset so followers form a line, not a stack.
