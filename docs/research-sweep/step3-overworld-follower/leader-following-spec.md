# Leader-following spec (Step 3, overworld / follower) — NEW this pass
Source technique: Craig Reynolds' steering behaviours, "leader following"
(public teaching paper, GDC 1999 write-up; technique description, no code
staged). This EXTENDS the existing follower-steering-spec (seek / arrive /
separation) — it does not replace the trail rule.
Rules added:
- Arrival target = a point offset slightly BEHIND the leader, not the
  leader's position. The offset distance may grow with the leader's speed.
- If the follower ends up in the rectangular region IN FRONT of the leader,
  it steers laterally away from the leader's path first, then resumes
  arrival. This is what stops a follower blocking the player's way after a
  sharp turn, which pure trail-following handles badly.
- Separation still applies follower-vs-player and follower-vs-follower so
  multiple followers never crowd each other.
Licence: technique only, public-domain-era teaching material; no code
staged, no licence obligation created.
Wiring target: Step 3 agent — follower movement module, between trail-point
selection and position update (same seam as the existing steering pass).
Gate: after a 180-degree player turn, the follower clears the player's path
within 1 second without overlapping the player, and settles behind (not in
front of) the player.
Shadow rule: follower shadows are the separate engine shadow layer, never
baked into walk frames.
