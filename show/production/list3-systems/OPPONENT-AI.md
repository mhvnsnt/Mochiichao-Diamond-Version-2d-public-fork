# #18 — OPPONENT AI SCORING → Ranger/opponent AI spec (game lane)

**Teardown (public documentation).** Reference-game trainer AI is a
**scoring pass, not a search**: every legal action gets points from a
stack of small heuristic scorers run in sequence — a base move scorer
(damage expectation, heavily weighted by the type-chart product),
discouragers (don't use a status move on an already-statused target,
don't buff at low HP), situational experts (setup when safe, heal
under a threshold for item-holding classes), and a final random jitter
so equal scores don't play identically twice. Smarter opponents differ
by **which scorers are switched on** (a per-trainer-class flag word)
and how much jitter they get — not by a different engine. Switching AI
adds a separate scorer: staying in must beat the expected value of the
best available switch.

**Native spec — `mochiichao/opponent-ai/v1`.**

- Scorer stack (each a named module, toggled per opponent class):
  `S-DAMAGE` (chart product × power × accuracy expectation — reads
  #17), `S-STATUS` (apply conditions the target lacks), `S-SETUP`
  (stage moves only above an HP/safety floor), `S-SURVIVAL` (heal/
  protect under threshold), `S-SWITCH` (expected-value comparison),
  `S-FINISH` (prefer a KO this turn over any other gain).
- Opponent classes as flag sets: `wild` (S-DAMAGE only + heavy jitter
  — wild Mochi fight on instinct), `ranger-young` (+S-STATUS),
  `ranger` (+S-SETUP, S-FINISH), `dojo` (+S-SWITCH, low jitter),
  `elite/champion` (all scorers, minimal jitter, S-SWITCH threshold
  tightened). Class names are roles, not persons — assigning them to
  canon Rangers (Hex as rival/champion class, dojo masters as `dojo`)
  follows the season canon map at data-entry time.
- Determinism: seeded RNG, seed stored in the battle record, so any AI
  decision is replay-debuggable. Jitter ranges per class are
  **PROPOSED** values pending game-lane tuning.

**Battle Doctrine compliance (the reason this spec is game-only).**
In the **game**, battles are command-driven and this AI is the
opposing commander — full stop. In the **show**, Mochi fight with
their own agency in a continuous living fight and Rangers only
sometimes direct; therefore **no scorer output may be ported to show
choreography** — the show's fights are authored (animscript format,
battle-presentation teardown), and at most the *class personalities*
above (a dojo master fights *smarter-looking*) are a writing note,
never a mechanism. The spec file carries this as a hard scope line so
a future lane can't wire it across by accident.

**Wiring.** Consumes #17's chart + moves/learnsets by stable id;
produces decisions consumed by the battle UI flow's RESOLUTION state;
wild encounters rolled by the spawn tables (#7, world-systems) hand
the AI the `wild` class automatically.

**Coverage.** Architecture: fully publicly documented pattern, high
confidence. Tuning numbers: PROPOSED, unplayed — a balance/tuning pass
on a running build is owed and is not claimed here.
