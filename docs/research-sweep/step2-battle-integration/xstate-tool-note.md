# XState — tool note (Step 2, battle integration) — NEW this pass
Source: XState, JavaScript statechart library (npm: xstate). Licence: MIT
(as reported in search results / package metadata).
What it is: createMachine + interpreter; states, events, guards, final
states; machine definitions are JSON-like and can be visualised in the
Stately editor. This lane's battle-state-machine-schema.json is written in
that shape on purpose, so it can be transcribed 1:1 if the Step 2 agent
chooses XState — but the schema stands alone and does NOT require it.
What it is NOT for this lane: do NOT vendor XState source into the repo
without the Step 2 agent's dependency decision; it is an npm dependency
candidate, not a file to copy. Do NOT copy any other project's machine
definition — the lane's states (MENU / TURN_PREPARATION / IN_TURN /
MOVE_ANIMATION / CHECK_FAINT / BATTLE_OVER) are authored here.
Wiring target: Step 2 agent — battle controller only. Gate: an illegal
transition (e.g. MOVE_ANIMATION while in MENU) is rejected by the machine
instead of playing a clip out of phase.
