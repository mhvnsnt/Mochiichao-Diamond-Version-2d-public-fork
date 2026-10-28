# #263 — ROOTING MODE → a plant Mochi puts its roots down, and the world walks around it until it lifts them

**The gap this fills.** Plant sheets keep describing
an act no state covers: Verdilance's footprints show
"anchor-splays where it has rooted to brace";
Budguard's roots "grip when bracing." A plant Mochi
settling roots into soil — to rest, to brace, to
simply *be somewhere on purpose* — is behaviour the
follower system (#58) currently has to fake with
PARKED, which means "left waiting," and rooting is
not waiting. Rooting is the plant choosing the
ground. This spec proposes it as #58's next state,
under the same discipline #123's `RIDDEN` set: the
proposal is written here in full and **lands in
#58's home**, or it does not land at all.

## Native spec — `mochiichao/rooting-mode/v1` (fragment beside this doc)

- **The proposed state: `ROOTED`**, entered from
  `IDLE` or `PARKED`, plant-bodied followers only —
  eligibility is anatomy, read from the sheet (root-
  feet / rooting anatomy in the Anatomy notes), never
  a species list. The state machine's other laws are
  inherited untouched: the follower sets no flags,
  collects nothing, reads nothing for the Ranger
  (#58's standing boundary, #160's restatement).
- **What ROOTED does.** Three presentation-and-care
  facts, and no fourth:
  1. **Rest.** A rooted follower is resting in the
     plant way — its rest reads join #134's rest and
     #262's sunlight input (rooted in a sun spot is
     the fullest form of plant rest the systems can
     express).
  2. **Posture.** The drawn body braces: roots
     spread (the anchor-splay the sheets draw in
     footprints is this state's ground trace), stem
     set. #152's behaviour reads and the show's
     boards stage defence and stubbornness from it —
     a rooted Mochi has visibly *decided*.
  3. **Staying.** The Ranger walks on; the rooted
     follower does not trail. Scene grammar treats
     it the way PARKED treats a waiting partner,
     except the meaning is the Mochi's own choice of
     ground (and #237's quirks / #108's temperament
     may colour how readily an individual roots —
     reads, not rules).
- **The cost, stated plainly, because it is the
  whole state:** a rooted Mochi does not travel
  until it lifts its roots. Exit is a beat — roots
  lifting is drawn, never a teleport — back to
  `FOLLOW` (or `IDLE` where it stands). There is no
  recall shortcut inside the state; a Ranger who
  walks out of the area leaves a rooted partner the
  way they leave a parked one, under #58's existing
  area-exit handling, and the state's honesty is
  that rooting *takes time to leave*, which is why
  a plant does it on purpose.
- **Battle: this state is not in battles.** Rooting
  in combat is move business — Ingrain-class moves
  are #9 animscripts with #17/#182-resolved effects,
  and they neither use nor imply this follower
  state. A follower caught by a battle intro (#209/
  #10) exits ROOTED as part of the intro's ordinary
  state clearing, the way PARKED does — presentation
  continuity only.

## Show lane

#58's states are already board language (the xsheet
carries the follower's state per cut). `ROOTED`
joins that vocabulary with its meaning attached: a
board that says ROOTED is staging refusal, rest, or
resolve — the plant has put itself in the ground —
and the lift beat is a small ceremony the show can
hold on. Verdilance standing a long watch (its
sheet's standing behaviour) is this state, held for
an episode's length.

## Wiring

Proposal into #58's home (GARDEN-FOLLOWER-SYSTEM),
beside #123's `RIDDEN` proposal — landing seats both
in the same pass over #58's file, each cited to its
own package. Reads: sheet anatomy (eligibility),
#262 (sunlight at rest), #134 (rest joins), #152
(posture reads). Writes: nothing — a state, not a
record.

## Open slots

None that are mechanics. Whether #58 accepts the
state is a landing act in #58's home (the precedent
is #123's, and the proposal is written to be
acceptable or refusable as a whole, not negotiated
line by line here).

## Coverage — honest

- Architecture: one proposed state with its entry/
  exit/cost fully specified against #58's verified
  machine (FOLLOW / IDLE / REACT / PARKED + the
  standing no-flags boundary).
- Contents: zero species declared eligible here —
  eligibility is read from sheets at run time, the
  A3 line's root-feet being the verified examples.
