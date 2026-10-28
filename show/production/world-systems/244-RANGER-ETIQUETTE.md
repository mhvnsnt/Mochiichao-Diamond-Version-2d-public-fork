# #244 — RANGER ETIQUETTE & REGIONAL CUSTOMS → how Rangers greet, challenge, and yield, region by region

**The gap this fills.** Rangers meet each other
constantly — on routes, at dojo doors, in towns — and
the world has ways it does these things: how a
challenge is offered, how it's accepted, what a yield
looks like, how a stranger is greeted in a harbour
town versus a mountain one. None of it is written
down. This spec gives customs a home as **world data**
— texture with a shape — and fixes the one rule that
keeps texture from becoming a lock: **a custom can
colour an interaction; it can never gate one.**

**How the reference record fills the same gap:**
Pokémon's world runs on an etiquette so steady it's
nearly invisible — a trainer who catches your eye
challenges; losing means paying out and stepping
aside; the League's ceremonies have forms. Regional
flavour sits on top in the later games (a region's
greeting, its festival forms). Mochiichao takes the
two-storey shape: a **general Ranger etiquette** every
region shares, with **regional customs** laid over it.

## Native spec — `mochiichao/etiquette/v1` (fragment beside this doc)

- **A custom record** lives on the world-data layer
  (#93's NPC/world layer — the same stratum that holds
  schedules and town texture): `{region, occasion,
  form}` where `occasion ∈ {greet, challenge, yield,
  part, ceremony}` is a closed vocabulary and `form`
  is the authored content — the words, the gesture,
  the small rite — resolved through #23 lookups like
  all display text. Region 1's forms can already lean
  on verified canon: the dojo circuit's way (a
  challenge at the dojo is offered standing, the
  Fragment case shown at gates, #98) and the harbour's
  way (Boot Harbor's arrivals are met as neighbours
  first — the season canon's own opening). Regions
  2–5's forms are **data slots**: the record shape
  waits, the contents are content-lane writing.
- **What etiquette does mechanically — the whole list:**
  - **Challenge grammar support.** The field duel
    (#210, List 22 — building in parallel; this spec
    feeds its grammar generically and depends on none
    of its internals) reads the region's `challenge`
    and `yield` forms as the duel's frame: how the
    offer is made in this region, how a refusal is
    honourably given, how the loser yields the road.
    The duel's own rules are #210's; etiquette is the
    duel's manners.
  - **NPC texture.** #93's interactions open and close
    in the local forms — a greeting in Region 1's
    harbour grammar is a different beat from the same
    greeting under another region's customs, and the
    difference is free: it is a lookup, not a system.
  - **Ceremony seats.** #216's completion ceremony and
    #98's case-showing read the `ceremony` occasion —
    the forms are data the ceremony plays.
- **What etiquette never does.** It never gates
  progress: a Ranger who greets wrong, or not at all,
  loses nothing but the moment. There is no etiquette
  score, no politeness flag, no locked door with a
  bow-shaped key. A rude Ranger is a **story fact** —
  people remember it, #201's reputation derivation may
  hear about it the way it hears about any deed — but
  the *system* never punishes it. Customs also never
  override agency: a custom that says Mochi are
  presented a certain way is a human custom about
  presentation; the Mochi's own behaviour stays its
  own (#152), in every region.
- **The show lane** reads the same records: a greeting
  done right — or pointedly wrong — is character
  writing the episode gets for free, and regional
  customs are how a new region *feels* different in
  its first ten minutes (with #215's beds and #142's
  climate). Customs are never explained to the
  audience; they are performed, and the audience
  learns them the way travellers do.

## Wiring

Home: #93's world-data layer, region-keyed. Read by:
#210 (challenge/yield frame), #93 (interaction
texture), #216/#98 (ceremony forms). Writes: nothing
— customs are authored content, not facts an
individual accrues.

## Open slots

Regional customs **contents** for Regions 2–5 (and
any Region 1 occasions beyond the canon-seeded ones)
— these are world/canon facts, the content lane's
writing, kept as slots under the gap rule. The
vocabulary, the no-gating law, and the consumers are
all fixed here; nothing mechanical waits on anyone.

## Coverage — honest

- Two-storey etiquette (general + regional) over a
  closed occasion vocabulary: the reference record's
  shape, seated on #93's verified layer.
- The #210 join is written against #210's *subject*
  (List 22, in parallel build), not its text — flagged
  in STAGING's UNVERIFIED register for the landing
  link-check, the List 20 ↔ List 19 precedent.

**Link-check reconciliation (List 25 landing, 2026-10-27):** #244 and List 22's #210 (field duels) were built in parallel and agree — etiquette governs how a duel is offered and received; #210 governs the duel itself. One line, both files.

---

**Landing citation — List 32 (2026-10-27).**

#314 yokai spectacle (`world-systems/314-YOKAI-SPECTACLE.md`) lands beside this file's customs package as its world-layer companion: power staged as etiquette, ritual shape kept in proper order. #314 shares #138's mystery fence, and the Dark Forest's contents stay canon-open under it — #314's grammar stages the dread and is forbidden to explain it.
