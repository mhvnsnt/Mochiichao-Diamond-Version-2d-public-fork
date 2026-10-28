# #350 — INPUT HONESTY → the record can trust deeds because no input can fake one

**Why this spec exists.** The whole conscience
layer (#347–#349) leans on one claim: *every theft
attempt in the ledger was deliberate.* That claim
is only as good as the input pipeline underneath
it. If any sequence of button presses — a misclick,
a buffered input, a menu shortcut, a remapped
control — can produce a snag throw that never
passed the prompt, then the ledger holds accidents
wearing the clothing of choices, and #269's
addendum ("there is no accidental-theft state
anywhere in the system") is a slogan instead of a
fact. This spec makes it a fact: a property of the
battle input design, stated as a test.

## Native spec — `mochiichao/input-honesty/v1` (fragment beside this doc)

- **The pipeline — one road, in order.** A capture
  input in battle resolves through exactly these
  stages, in this order, with no side doors:
  1. **Targeting.** The throw input names a target
     on the field (#10's ring / #165's bag-command
     grammar — capture attempts are bag commands;
     their legality is read at command time).
  2. **Device check.** The selected item's record
     is read: snag class or ordinary (#31), reader
     present or absent (#349). Refusal classes are
     evaluated here (#351) — a refused input ends
     at this stage, spoken, unconsumed.
  3. **The block.** An ordinary item at an owned
     target stops at #268's owned-block — refused
     before any roll, before any prompt: there is
     nothing to confirm, because the tool cannot do
     the thing at all.
  4. **The conscience gate.** A snag-class item at
     a prompt-class target (#347's taxonomy, shaped
     by #349's read) raises the prompt. **The throw
     does not exist until this stage completes with
     YES.** The prompt is not a warning attached to
     the throw; it is a gate the throw is built
     behind.
  5. **The throw.** On YES, the attempt runs (#268's
     math) and the deed vocabulary writes what
     happened (#269/#348).
  Any input path that reaches stage 5 without
  passing stage 4 for a prompt-class target is a
  **defect by construction** — not a balance issue,
  not an edge case: the system's central integrity
  bug, and it is stated here so a landing PR can be
  tested against it (STAGING step 4).
- **Cancels are NO, at every stage.** The cancel
  input (B-button class — whatever the platform's
  backing-out control is) at the prompt equals NO:
  the input cancels whole, the battle returns to
  the command ring with the turn unspent, and
  nothing is written (#347's family law applied to
  hardware). A cancel *before* the prompt (in
  targeting, in the bag) is ordinary menu behaviour
  and equally silent. There is no input — cancel,
  confirm, shortcut, or buffered repeat — whose
  meaning at the conscience gate is anything but
  the answer the player visibly gave.
- **No buffering across the gate.** Inputs queued
  before the prompt appears cannot answer it: the
  prompt reads a fresh input made while it stands.
  (Pokémon's own menus forgive a held button; a
  conscience gate may not — a YES the player never
  saw themselves give is an accident wearing a
  choice's clothing, which is the exact failure
  this spec exists to prevent.) The same rule binds
  the prompt's own dismissal: the confirming press
  is consumed by the prompt and cannot leak into
  the throw's stage as a second command.
- **Symmetry — the AI's inputs are honest too.**
  NPC snag attempts (#268) pass through the same
  stages minus the gate (the gate is a player
  conscience, #347): device check, block, throw.
  An NPC whose device is refused (witness ceiling,
  story-lock) has *not attempted* anything — the
  player's record of the battle shows a refusal, not
  a thwarted crime, and #272 witnesses only what
  stage 5 produced. Honesty runs both ways: the
  system never inflates a refusal into an attempt
  to make a villain look worse, and never inflates
  a player's hesitation into one either.

## Show lane

None directly — this is game-lane integrity. Its
show consequence is foundational, though: because
every throw in the shared record was deliberate,
the show can stage a theft as a *choice* with a
clear conscience of its own (#355/#276) — there is
no "the game made me do it" anywhere in canon.

## Wiring

Pipeline stages seat on #10's command flow and
#165's bag-command legality read; device data from
#31; gate from #347/#349; refusal order from #351;
deed writes from #269/#348. The integrity property
lands as a negative test in STAGING (step 4): an
automated or scripted input sweep over prompt-class
targets must produce zero stage-5 throws without a
recorded YES — the test is the spec's teeth.

## Open slots

None. Platform control names (which physical button
is "cancel") are platform data, not a spec slot;
the rule binds whatever control the platform maps.

## Coverage — honest

- Property: fully specified as pipeline order +
  cancel/buffer rules + a testable negative claim.
- Runtime: no engine exists in the audited sources
  to run the test against yet — the obligation is
  spec-level and registered in STAGING's UNVERIFIED
  register with the rest of the battle runtime.
