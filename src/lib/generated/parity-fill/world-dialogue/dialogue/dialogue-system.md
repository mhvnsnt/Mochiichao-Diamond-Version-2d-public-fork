# Dialogue system shape — Ink / inkjs pattern

## Pattern (not Pokemon code)
Ink (inkle) story structure: **story → knots → stitches → lines / choices**.
The `inkjs` runtime plays it with `Story.Continue()` (next line) and
`Story.ChooseChoiceIndex(i)` (player picks a choice). This slice stages the
same shape as plain JSON so the validator can check it without an ink
compiler; the JSON maps 1:1 onto a future `.ink` source and onto
`inkjs`'s compiled JSON:

| Ink concept | Staged JSON | Runtime mapping |
|---|---|---|
| `== knot ==` | `knots.<name>` | Story knot |
| `= stitch` | `knots.<name>.stitches.<name>` | Story stitch |
| line of dialogue | `lines[]: {speaker, text}` | `Continue()` text; speaker shown in the React dialogue box (the game's current dialogue UI — no new UI invented here) |
| `+ [choice text]` | `choices[]: {text, ...}` | `ChooseChoiceIndex` |
| `-> knot.stitch` divert | `choice.target: {knot, stitch}` | Divert on choice |
| `-> END` | `choice.exit: true` or a stitch with `exit: true` | Story ends; control returns to the map |
| `{flag}` conditional choice | `choice.condition: {flag, equals}` or `{all_flags: [...]}` | Choice shown only when the flag test passes (validator checks the flag exists; the runtime hides, not deletes, the choice) |
| `~ flag = true` | `choice.setFlags: [...]` | Flag set when the choice is picked (e.g. `rested_at_harbor`, `victory_route_opened`) |
| `VAR` / external function | — | NOT staged: no external functions yet. Flag checks are the only condition type, so the validator can prove every condition resolves. |

## Sample dialogue (fresh writing, NOT copied Pokemon lines)
`dialogue/sample_dialogue.ink.json`: 6 knots, 10 stitches, 14 lines,
11 choices. Knots: `harbor_guide` (stitches `main`, `north_info`),
`nurse_heal` (`main`, `after_rest`), `no_starter_block`,
`dojo_gate_blocked` (`main`, `open`), `victory_gatekeeper` (`main`, `open`),
`victory_gate_blocked` — 6 knots, 10 stitches.
Every knot is reachable from a map object or an entry point, every
choice target exists, every flag referenced exists in
`progression/progression.json`, and every stitch either exits or
offers a choice (no dead-end stitch passes validation).

## What is NOT here (open, not invented)
- Dojo 3–7 leader dialogue, Elite Four dialogue, Champion dialogue,
  admin dialogue: no knots written for them. Their slots in
  `progression.json` are null, and no placeholder lines were invented
  to fill them.
- Existing in-code dialogue (Sector 0, Dojo 1, Dojo 2/Falk, etc.) is NOT
  converted to Ink in this slice — conversion of the 16 in-code maps'
  dialogue is the next step, not claimed here.
