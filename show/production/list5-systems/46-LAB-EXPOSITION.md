# #46 — LAB EXPOSITION SYSTEMS (teardown → Aeon's lab + Mochiioteca reveal format)

**What was studied.** How the reference anime and games use the
laboratory as an exposition engine, as publicly documented in
genre production writing: the lab is where the world explains
itself *by showing an instrument do something*. The grammar is
consistent: a **question walks in** (a creature, a trace, a
broken thing), the **instrument answers partially** (a silhouette
fills, a reading spikes, a drawer opens), and the **expert
translates, incompletely** — the lab always knows more than it
says, which is what makes it a story place instead of a tutorial.
Mochiichao's lab is Aeon's, its instrument of record is the
Mochiioteca, and its founding beat is already canon: Aeon,
cornered by a wild creature, hands over the partner and the
Mochiioteca and the journey starts (season canon map). This
format writes the lab's recurring scene-shape so every future
lab scene — species reveals, device reveals, revival process
(#44), mythical traces (#41) — is built the same way.

## Canon anchors (fixed)

- **Aeon** — lab figure; secretly knows THE SECRET (production
  layer only — §2.6 display law binds every lab scene: nothing
  the lab shows or says in-world may betray computer tells; Aeon
  may *know*, the set may not *tell*).
- **Assistant Mochiko** — the lab is her workplace before it is
  her mystery: she opens the Mochi Garden at R1-BEAT3. Lab scenes
  are where her competence is established — she runs instruments;
  she is not their audience-surrogate.
- **The Mochiioteca** — name and function canon (the keeper
  registry device); **physical design undesigned** (DESIGN-BRIEF
  §8 item 6 — owner decision). This format therefore specifies
  lab *displays* functionally (what a reveal shows, in what
  order) and never describes the device's body. EP01's abstract
  light+icons treatment is the standing placeholder and is
  compatible with everything below.
- **The growth card visual family** (§E5/§F1): keeper-tech UI is
  one product line — lab displays, the growth card (#42), and
  the circuit map (#45) share silhouette-fill grammar, one
  dominant colour, and the device voice (icons + light, words
  rationed).

## The reveal format (script format, house blocks)

A reveal is a five-beat sub-block inside a lab scene, written in
the house blocks (VISUAL / ACTION / DIALOGUE / MUSIC / SFX):

```
REVEAL — <subject: species | device-function | trace | revival>
  1 IN       : <the question carried in — who carries it, what state it's in>
  2 INSTRUMENT: <what the Mochiioteca/lab does — silhouette fills in
                 stages: outline → pattern → colour (§E channels, UI form)>
  3 PARTIAL  : <what the instrument refuses or cannot show —
                 the beat that keeps the lab honest>
  4 TRANSLATE: <Aeon or Mochiko names what it means — in-world words
                 only; Aeon's line may carry a production-layer
                 double meaning for the audience, never a tell>
  5 OUT      : <what leaves the lab changed — a slot filled, a
                 question opened, a journey re-aimed>
```

Beat rules:

- **INSTRUMENT stages mirror the transformation channels**
  (silhouette → colour → motif, §E1). The audience learns one
  reading order for change everywhere: on a body, on a screen,
  on a growth card. Discovery media rules bind the display: an
  unmet species shows as silhouette at most (MOCHIIOTECA registry
  rules); the lab cannot display what the registry has not
  earned — Aeon's private knowledge is shown as *behaviour*
  (a drawer he doesn't open), never as a screen state the data
  contradicts.
- **PARTIAL is mandatory.** Every reveal withholds something
  with an in-world reason (trace too faint, species unrecorded,
  instrument at its limit). A lab that answers fully is a
  tutorial; a lab that answers partially is a place. For
  mythicals (#41), PARTIAL is the whole reveal: the instrument
  registers trace, never specimen.
- **TRANSLATE is human dialogue** — the lab is a *human talking
  seat* (humans speak words; creatures are cries-only). Creature
  meaning, when the revealed subject is present, follows the
  subtitle rationing; the default lab sound is human speech +
  instrument voice + the subject's cry, in that order of
  prominence.
- **OUT must change the board.** A reveal that ends with
  everyone knowing one more fact and doing nothing differently
  is cut. Each reveal closes a completion/display state (#14)
  or opens a route/flag (#11/#12) — the production notes cite
  which, exactly as transformation blocks cite their edge (#42).

## First-use instances the format already covers

- **The opening handover** (canon, EP02's game-canon opening):
  IN = the wild creature's pressure; INSTRUMENT = the
  Mochiioteca wakes; PARTIAL = everything about Aeon;
  TRANSLATE = the offer of the partner; OUT = Route 1.0 exists.
  Written retroactively as format proof — the format was derived
  *from* this beat, and the script of record is not rewritten.
- **A new species' first registration** — the design lane's
  workflow step 6/7 in story form: the sheet's data is what the
  instrument shows; the reveal episode is where a Track-B species
  becomes a citizen of the registry (and of the audience's
  memory) in the same act.
- **A revival intake** (#44, if the owner adopts the system):
  the remnant is the IN; PARTIAL is structural — the instrument
  can show a silhouette-shaped absence (`pointsTo: null` staged
  as an empty slot) without naming what fills it.

## Wiring

- Registry/display rules: **MOCHIIOTECA-FORMATS + completion
  (#14)**. Channel grammar: **DESIGN-PRINCIPLES §E/§F1** via
  #42's staging. State changes cited: **event flags (#12)**,
  **route graph (#11)**. Subject systems: **#41** (trace
  reveals), **#44** (revival intake), **#40** (a variant's first
  appearance may be a lab reveal — the delta read aloud as
  pattern-before-colour), **#38** (if canon ever designs the
  keeper instrument, its reveal is a REVEAL block, and the
  capture spec's tier list gains its first entry by that act).

## Coverage — honest

- **Architecture: fully documented as genre grammar.** Question
  in → partial instrument answer → incomplete translation →
  changed board is the consistent lab-scene pattern across the
  reference series; Mochiichao's founding beat already obeys it.
- **Contents: anchors only.** Canon fixes Aeon, Mochiko, the
  device name/function, and the handover. The device's physical
  design, the lab's layout beyond its existence, and any
  additional instruments are OPEN — this format is deliberately
  body-agnostic so the owner's design pass, when it comes, slots
  into a working grammar instead of a blank page.
