# #88 — ATTRACTION / MINIGAME LOOP DESIGN → Garden attraction formats

**What was studied.** Amusement-attraction grammar from the public
creature-game record: the Safari/contest/minigame family — short
self-contained loops with (1) a verb the main game doesn't use,
(2) a visible stake the creature reacts to, (3) a score or souvenir
that feeds back into the main loop, and (4) a strict time budget.
The raising-game half (Chao Garden races/checkpoints) adds the
second grammar: the *creature* performs, the player coaches —
stats the player raised become the performance.

**Native format — one record per attraction:**

```
{ attraction_id, site, verb, performer, stake, reward_hook,
  session_budget_s, care_axis_inputs[] }
```

- `site` — Garden-complex area id (spawn/ecology tables already
  name the Garden's areas; attractions attach to them, they do not
  create new places).
- `verb` — the one action the loop is built on, in one word.
- `performer` — `creature` (raising grammar: the Mochi performs,
  the Ranger coaches) or `ranger` (main-game grammar). The Garden
  default is `creature`; a `ranger`-performed attraction inside
  the Garden needs a written reason.
- `care_axis_inputs[]` — which raising axes (#28 care system,
  list4-systems) the performance reads. Empty list = the loop is
  decoration, and the format *says so* — an attraction that reads
  no axis must declare `reward_hook: "none"` too.
- `reward_hook` — what flows back to the main loop (bond, item,
  discovery progress). Token/economy hooks route through #56
  (list6-systems minigame loops), never a private currency here.

**Canon state, honestly.** The Garden exists in canon (opened by
Assistant Mochiko at R1-BEAT3; garden poses/palettes per species in
repo) but **no attraction is canon yet** — no race, contest, or
game is named. This is the shape the first one takes; zero
instances asserted. Session budgets and reward values are
owner/game-design numbers and stay null until set.

**Wiring.** Consumes #28 care axes (performance inputs) and #56
token loops (rewards); sites bind to world-systems SPAWN-TABLES
Garden areas; show-side, an attraction is a set the episode can
visit — the show uses the place, not the loop's numbers (two-lane
law: the show shows the Garden alive; the game owns the math).

**Coverage.** Grammar: well documented across both source
families. Contents: none canon — format only, flagged as such.
