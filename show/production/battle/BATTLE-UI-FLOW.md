# BATTLE UI FLOW — TEARDOWN + NATIVE SPEC (List 2, #10)

Sideline H, 2026-10-27. For the GAME lane. The show lane's battles
follow the autonomous-action model; this spec is the game's, under the
BATTLE DOCTRINE (MEMORY.md): **in the game, battles stay
command-driven — player commands are what affect health and outcome —
but between commands the creatures visibly fight and move in an active
living fight; the between-command action is presentation only and does
not affect health until a command resolves.**

## Teardown: how a turn flows (structure, public documentation)

Documented turn-based battle systems share one skeleton:

1. **A strict state machine.** Intro → command input → resolution →
   end-of-turn checks → next command. Resolution is never free-form:
   everything the player must read is emitted through **one ordered
   message/effect queue** (announcement → animation → damage →
   status messages), drained in order, so cause always precedes
   effect on screen.
2. **Input is locked outside the command state.** No state changes
   can arrive while the queue drains; interrupts (a faint, a forced
   switch) are queue items with priority, not exceptions.
3. **The Persona contribution is grammar, not skeleton** (CEDEC +
   KYUSHU 2017, Atlus's own panel, as researched in
   `~/workspace/research_notes/naruto-spongebob-production-materials-20261027-1633/report.md`):
   one dominant colour decided first and held across every screen;
   a central white gaze line that the eye rides down the hierarchy;
   **lighting as priority** (important information is lit, the rest is
   dimmed); hierarchy changes encoded by angle and position, not just
   size; and the command menu as a **character performance** — in P5
   the battle commands ring the active character like action bubbles.
   None of Atlus's files, fonts or code are shared or used; this is
   the published design grammar, re-expressed natively below.

## Native spec: `mochiichao/battle-ui-flow/v1`

### States

| state | what happens | writes battle state? |
|---|---|---|
| `INTRO` | field/battle backdrop in; creatures enter (animscript-class entrance cues); health bars slide | no |
| `LIVING_FIELD` | the between-command living fight: paired idle-combat loops (prowl, feint, circle, pant) driven by `tempo_state` (calm / tense / dread — presentation only) | **never** |
| `COMMAND_RING` | command input for the active Mochi (below) | no |
| `TARGET_SELECT` | ring collapses to a gaze-line target picker | no |
| `COMMIT` | the chosen command is written to the turn record — **the only input-side write** | yes (the command) |
| `RESOLUTION` | the message/effect queue drains (below); animscripts play; damage and status resolve here and only here | yes (outcomes) |
| `END_CHECK` | faint / forced-switch / battle-end checks, in queue order | yes (flags) |
| → `LIVING_FIELD` or `COMMAND_RING` | next beat | — |

**Doctrine guardrail (architectural, not a comment):** the
`LIVING_FIELD` presentation layer holds no reference to the battle
state object — it receives a read-only render snapshot (species,
positions, tempo). A living-fight loop *cannot* deal damage, because
it has no write path. Commands are the only input; `RESOLUTION` is
the only place outcomes are computed.

### The command ring (Persona grammar, Mochiichao-native)

- Commands **ring the active Mochi**: FIGHT (opening the move list),
  ITEM, MOCHI (switch), RUN — arranged on an arc around the creature,
  which performs in the centre (idle-combat loop continues, subdued —
  the menu is a performance, per the grammar).
- **One dominant colour**: the game's locked key colour (design-lane
  decision; not copied from any other title) + black/white. Accent
  colour is reserved for vital stats only (HP thresholds, the
  selected command).
- **Gaze line**: a single bright axis runs ring → active Mochi →
  target side; the eye never has to hunt. When the hierarchy descends
  (FIGHT → move list), the layout **rotates angle** rather than
  re-flowing, so positional awareness survives.
- **Lighting as priority**: during `COMMAND_RING` the field dims one
  step except the active Mochi and the ring; during `RESOLUTION` the
  light follows the queue (performer lit on its cue, target lit at
  impact).
- Move list entries carry the move's **display name** (rename law),
  type chip, and remaining PP — read from moves.json, never hardcoded.

### The message/effect queue (the resolution contract)

FIFO with two priority inserts. Each item is one of:
`announce` (text) · `animscript` (a move-animscript/v1 file reference
+ performance block for the acting anatomy) · `damage` (number +
bar tween) · `status` (inflict/expire message) · `cry` (species-sheet
cry variant) · `interrupt` (faint/forced switch — jumps the queue,
nothing outranks a faint) · `tempo` (set `tempo_state` for the next
`LIVING_FIELD`).

Rules: an `animscript` item must complete its beat map before the
`damage` item it caused may display (cause precedes effect); `cry`
items ride inside the animscript's audio track, not the queue, unless
the cry is itself the message (faint cry at `END_CHECK`).

### Show-lane note (one paragraph, no more)

The show renders the same beats without `COMMAND_RING`: Rangers
sometimes command, the fight runs between and without commands. The
animscript format is shared — a show battle is a game battle with the
ring removed and the living field promoted to the main track. That is
the whole crossover; the two lanes' state machines stay separate.

## Coverage notes

- Turn state-machine + message-queue structure: consistently
  documented across public battle-system teardowns and decomp
  documentation; confidence high.
- Persona grammar: Atlus's own CEDEC + KYUSHU 2017 panel as reported
  by Persona Central / Siliconera / Famitsu coverage (workspace
  research report, 2026-10-27). Principles only — no Atlus assets,
  fonts, files or code exist publicly or are used here.

**Resolution orders (List 19 landing, 2026-10-27 — registered once, here):** (a) #182's status check order and END_CHECK tick order resolve in this flow's queue, over #27's `persistent | volatile` records (correction C5: #27's words, no second vocabulary). Negative tests: a second persistent application fails legibly; no volatile condition survives its battle on any record; a #132 centre cure touches persistent conditions only. (b) #183 + #184 share ONE trigger order — acting side, then receiving side; within a side, abilities before held items — implemented once and cited by both specs, never as two orderings that can drift.

**Determinism obligation (List 20 #187, landing 2026-10-27):** every random draw in resolution must come from a recorded seed stream, so a battle replay can re-run a recorded outcome exactly. This is an obligation on a future engine — no engine exists yet, so no report may call replays 'working' until a re-run reproduces a recorded outcome. Replay playback is write-suppressed by construction: it produces no gain, honour, research, kept, or facility writes.
