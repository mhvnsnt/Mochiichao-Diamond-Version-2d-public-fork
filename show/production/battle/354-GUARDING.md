# #354 — GUARDING YOUR OWN → the victim is not a bystander in their own robbery

**The gap.** Until this spec, a steal attempt
(#268) was something that happened *to* a Ranger:
the device fired, the math ran, the victim's only
part was a bond value read off their Mochi's
record. But a Ranger standing next to their
partner is not scenery. This spec builds the
counterplay: battle actions by which a keeper —
or their fielded Mochi — actively defends against
a snag attempt, declared on the same trigger
machinery as every other battle effect, costing
what a real defence costs: the action itself.

## Native spec — `mochiichao/guarding/v1` (fragment beside this doc)

- **The guard actions (declared rows, #184's
  vocabulary; #180's law over all of them).**
  Guarding is a command class in Ranger battles,
  taken by a fielded Mochi on its Ranger's turn,
  with exactly two founded forms — both are
  *declared rows* in #184's sense: a named trigger,
  a named effect, a visible cue, or they do not
  exist:
  - **`interpose`** — trigger class `standing`,
    declared from the command until the turn ends:
    the guarding Mochi places itself between its
    partner and any throw. Effect: a snag attempt
    against the guarded target this turn resolves
    against the *interposer's* presence — the
    attempt's bond resistance (#268's read) is
    computed with the interposer's bond to the
    target's keeper added as a declared term (two
    bonds stand in the doorway, not one), and the
    throw's presentation must beat the interposer
    first (#355's staging carries the picture).
    The cue is the staging itself: the Mochi steps
    in, visibly, before any throw comes.
  - **`screen`** — trigger class `on-taken`'s
    battle-command cousin, declared as a *held
    reaction*: the guarding Mochi spends its action
    watching for the throw, and if a snag attempt
    targets its partner this turn, it **blocks one
    attempt outright** — the ball is knocked aside,
    the item is consumed (the throw happened; the
    world answered it), the attempt deed writes
    exactly as a failed attempt does (#348 — the
    thief still chose), and no roll is made. The
    cost is total: the screener did nothing else
    this turn, and a screen holds against **one**
    attempt — a second device in the same turn
    (multi formats, #157) faces only whatever
    `interpose` terms remain standing.
  Both rows are proposals into #184's resolution
  file as command-declared rows (STAGING step 6) —
  the vocabulary is #107/#184's closed set
  (`standing`, and a reaction seat inside the throw's
  queue segment per #10's cause-precedes-effect),
  and this spec founds no new trigger word.
- **What guarding costs — the turn-economy.** A
  guard action *is* the guarding Mochi's action for
  the turn: it does not also attack. That is the
  whole price, and it is deliberately real — guarding
  a partner against theft means spending the turn
  *not* winning the battle, which is why a theft
  threat warps a fight even when no throw ever
  comes: the *possibility* taxes the victim's side
  in actions, and the tax is the counterplay's
  balance. Guarding never requires a prompt (#347's
  never-list: defending your own is ordinary play),
  never writes a deed (defence is not a moral act
  the ledger scores), and never blocks a *rescue*
  throw (#349) — a guard reads the throw's class
  like the device does: interposing against a rescue
  is not a sentence this system can express, because
  rescue is aimed at the heart, not the keeping.
  (A Syndicate *holder* defending a processed Mochi
  against rescue uses the battle's ordinary tools —
  fainting the rescuer's side — not this one.)
- **The AI guards.** The opponent is not obliged to
  watch: NPC Rangers' battle AI (#18's decision
  stack, under #157's partner constraints where
  formats apply) reads an incoming snag threat —
  a known snag-class item shown, a Syndicate
  opponent's class, a first attempt already made —
  and may spend actions on guard rows, keyed to the
  Ranger's facts (a protective Ranger guards early;
  a proud one attacks through and trusts the bond;
  both are #93/#301 character data, never a uniform
  die roll). A player who has shown a device should
  expect the second attempt to meet a screen: the
  arms race is the intended texture, and it is why
  #268's witness ceiling matters — crowds and
  screens are the two walls a thief works between.
  (Commissioning note: this package's brief pointed
  at "#158" for the AI; #158 as landed is horde
  battles. The guarding decisions seat on #18's
  stack, and the correction is registered in
  STAGING — the join is to the AI's real home.)
- **Guarding and the record.** A blocked attempt
  writes the attempt deed (#348) and nothing else:
  no "thwarted" entry attaches to the victim, no
  honour accrues to the guard in any tally — the
  guard's reward is that their partner is still
  theirs. The interposer's added bond term is read
  at the attempt and never stored (derived-at-read
  discipline, like everything the ledger touches).

## Show lane

The interpose is the show's oldest creature
grammar — the partner who steps in front — and it
needs no new staging law: #82 stages it as the
behaviour it is, and #320's expression work carries
the interposer's face. The screen's knock-aside is
the spectacle version (#355): one clean beat, the
ball spinning off into the grass, the thief's
device suddenly very loud in the silence.

## Wiring

Rows proposed into #184's file (command-declared,
in #184's home — STAGING step 6); command class
seats in #10's ring for Ranger battles; bond-term
read joins #268's roll computation as a declared
input; AI decisions on #18's stack (with the #158
correction registered); rescue exclusion read from
#349's shape classification at the throw. Never
writes: a deed, an honour, a stored guard state
past the turn it was declared in.

## Open slots

The interpose bond-term's weight (whether the
interposer's bond adds whole or in part — drafted
as data beside #268's roll, tuned at landing) ·
which species' staging carries the screen's
knock-aside best (presentation data). No mechanic
is parked; no story fact is opened.

## Coverage — honest

- System: fully specified as two declared rows +
  cost + AI behaviour, over verified trigger
  machinery.
- Contents: zero guard rows instanced in #184's
  registry yet (abilities/effects remain species-
  and data-pass work there); the rows land as
  proposals with this package.
