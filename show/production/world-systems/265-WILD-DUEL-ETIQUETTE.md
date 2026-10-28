# #265 — DUEL ETIQUETTE AMONG WILD MOCHI → some wild Mochi challenge formally, and the formality is data

**The gap this fills.** The encounter systems know
how fights start: a table roll (#7), an ambush charge
(#209), a territory dispute (#231). The sheets
describe a fourth way, in prose, and it is pure A3:
a first meeting with Seedquire is "being formally
challenged to step around a puddle"; Budguard is met
"standing aside with great formality to let them
pass"; the line drills in pairs, keeps rotas nobody
assigned, takes praise by standing straighter. These
species don't *start* fights — they *issue
challenges*, with a display, a pause, and the
expectation of an answer. This spec names that
behaviour as data, so an etiquette species' encounter
runs on its manners instead of the generic charge.

## Native spec — `mochiichao/wild-duel-etiquette/v1` (fragment beside this doc)

- **The profile field.** One annexed field on #152's
  behaviour profile — proposed into #152's home, in
  its closed-vocabulary style: `challengeStyle ∈
  {none, formal}` at the species level, refined per
  individual only by #108/#80 variation inside the
  species' norm (a bold Seedquire is a more flowery
  challenger, never a charger). `formal` means the
  species' challenge has three beats, always in
  order: **display** (the species' displayBehaviour
  from its own profile — the salute, the planted
  spear, the turned shield) → **wait** (a real pause
  in the encounter's staging: the challenger holds,
  and the challenged side's answer is the next
  event) → **answer** (accepted: the battle begins,
  honourably, at #10's ordinary intro with tempo
  `calm`-to-`tense` as the profiles read; declined
  or ignored: the challenger withdraws — no battle,
  no pursuit, no ambush conversion, ever).
- **What etiquette replaces, and what it never
  touches.** For a `formal` species, #209's ambush
  slot cannot fire *as a charge* — the species'
  ambush-shaped initiation *is* the formal challenge
  (same table seat, different staging, and the data
  keeps the two distinguishable). Encounter *rates*
  are untouched (#255's pacing is arithmetic;
  etiquette is what the encounter looks like once it
  exists). Territory disputes (#231) between two
  formal individuals run the same three beats
  between themselves — display, wait, answer — as
  world texture, witnessed or missed like all #231
  events.
- **Etiquette binds the challenger.** The formality
  is a constraint on the species that holds it, not
  a shield for it: a Ranger may still be drawn into
  battle by other means, and a formal challenger
  whose display is answered with an attack anyway
  fights an ordinary battle from that beat (its own
  behaviour in the fight is #18/#152's wild read as
  always). What etiquette removes is only the
  *surprise*: a formal species never takes anyone
  unawares, and the systems must not let it — the
  staging guarantee is the spec's teeth.
- **Declining costs nothing.** No flag, no reputation
  read, no locked content sits behind accepting a
  wild challenge (#58's standing boundary family:
  assistance — and challenge — is never the only
  path). The puddle gets stepped around, and the
  world keeps both parties' dignity intact.

## Show lane

A formal challenge is a ready-made honour scene:
display, held pause, answer — three boards and a
beat of silence the subtitle law loves. The bushido
flavour of the A3 line arrives in the show *as this
behaviour*, performed by the creatures themselves —
not as invented culture text, ceremonies, or human
customs layered over them. Human etiquette is
#244's system, with its own content slots; this
spec governs the wild grammar only, and the two
must never borrow each other's clothes.

## Wiring

Field proposed into #152's profile home; staging
consumed by #209 (initiation shape), #10 (intro
tempo), #231 (wild-vs-wild form); species contents
from the sheets (A3 verified formal by its own
discovery prose; other species are the distillation
pass's to call). Writes: the one field; no encounter
arithmetic anywhere.

## Open slots

None that are mechanics. Which species are `formal`
is sheet content — the pass reads discovery/behaviour
prose and calls it, species by species; zero are
assigned here beyond naming A3 as the verified
example the vocabulary was built from.

## Coverage — honest

- Architecture: one profile field + a three-beat
  staging grammar over verified encounter systems.
- Contents: one line verified as the type example,
  from its sheets' own words; the behaviour itself
  was already canon — this package's work is making
  it legible to the systems that stage encounters.
