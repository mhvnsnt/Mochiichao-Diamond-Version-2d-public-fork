# Automated playtest bot + balance score spec (Step 5) — NEW this pass
Source: academic paper "RuleSmith: Multi-Agent LLMs for Automated Game
Balancing" (arXiv, found this pass) — STUDY-ONLY citation; no paper text
or code staged, only the balance-score formula and the method shape.
- Balance score: L = |wA - 0.5| + |wB - 0.5| + 0.5 x wDraw, where wA/wB
  are the two sides' win rates and wDraw is the draw rate. Perfect
  balance = 0; the 0.5 draw weight tolerates occasional stalemates while
  penalising systematic indecisiveness.
- Method shape: parameterise the tunable numbers (damage, HP, costs,
  speeds), run many bot-vs-bot matches, report win rates per matchup,
  then change ONE parameter at a time toward L = 0.
- Bot policies for this lane (authored here): (a) random — baseline;
  (b) greedy — always the highest-DPS available move; (c) type-aware —
  greedy filtered by effectiveness. A matchup is only judged after a
  minimum match count (lane to set: 100 matches minimum before a balance
  claim, so a 55/45 split is not mistaken for a real edge).
- Streaming-telemetry note (found, same pass): sliding-window anomaly
  detection (damage outliers / spikes over a window) is a live-game
  technique; for this lane it becomes a playtest-log check, not a live
  service — flag any playtest session whose damage total exceeds the
  balance table's expected range by 2x for manual review (overpowered
  move OR exploit, same signal, human decides which).
Licence/status: academic paper = study-only citation; bot spec itself is
authored for this lane, no licence issue.
Wiring target: Step 5 agent — playtest harness (Node script, no game
dependency): inputs = move table + species table, outputs = win-rate
matrix + balance score + flagged outliers. Step 6 agent re-runs it as a
regression gate before lock.
