# #191 — PLAYER JOURNAL & MAP ANNOTATIONS → the player layer, mechanically separate

**What was studied.** Player-authored annotation systems in
the publicly documented record: map pins and freehand marks
in open-world games, stamp/note systems in handheld titles,
and journal logs the player writes against the game's
geography. The documented design fault line is always the
same: annotations are beloved exactly because they are the
player's own layer over a world they do not own. The kit
taken: a player layer that *references* the canon world and
can never write it — enforced by the record's shape, not by
policy text. No pin sets, icons, or text are copied.

## Canon anchors (verified in the packages)

- **#137's atlas is the surface annotations pin to.** The
  atlas is a derived view over presence and hearsay —
  connections as first-class records, discovery in three
  derived states (unknown / hinted / open), the Leak rule
  binding every display. An annotation layer must sit *on*
  that view without entering its derivation: the atlas may
  never learn anything from a pin.
- **#19's world state is the clock.** Phases
  `dawn | day | dusk | night` from the single time producer;
  #106's tombstones already timestamp facts in beats
  (`keptBeat`, `releasedBeat`). Journal timestamps use the
  same two coordinates: beat + phase.
- **#90's media is the share channel's grammar.** Blocks
  with generators reading state — a presentation format,
  not a data pipe; #124 fixed the rule that media announces
  only what a derivation produces. Shares inherit it.

## Native spec — `mochiichao/player-journal/v1` (fragment beside this doc)

- **The two-layer rule, made mechanical.** An annotation
  record is `{annotationId, target, body, pinnedBeat,
  phase, editedBeat}`. Its schema contains **no field that
  could name a world fact** — no flags, no states, no
  quantities, no spawn or discovery data. `target` is a
  *reference* (`{kind: node | area | connection | species
  | place, id}`) into canon data, read-only. A player layer
  whose records cannot express a world write cannot make
  one: this is the whole law, and it is structural.
- **Where the layer lives.** Annotations and journal
  entries are proposed as a `journal` section in #96's
  save payload map — player-authored content in the save,
  checksummed like any section, owned by no world system.
  (Proposal into #96's map; lands only there.)
- **Map annotations.** Pins render on the player's own
  atlas view (#137) as an overlay layer above the canon
  rendering — the canon rendering is byte-identical with
  the layer on or off, and an undiscovered connection
  stays unrendered canon-side no matter what a pin says
  (a pin *on* an undiscovered target renders only when its
  target renders; the player's memory is not the atlas's
  evidence). System strings around pins (menus, prompts)
  obey the Leak rule like every display surface; the
  player's own words in `body` are the player's content —
  as #106 ruled for box labels, "the label is the Ranger's
  own word" — not system vocabulary and not policed as
  such.
- **Journal entries.** Chronological player entries,
  timestamped `{beat, phase}` on #19's clock at writing;
  editing updates `editedBeat` and never the original
  timestamp (the #126 append-only ethic, softened exactly
  once: a player may edit their own words, and the record
  admits it).
- **Export & share.** Sharing produces a #90-format block
  via a proposed `journal_share` generator (lands only in
  #90's home). A shared journal is an **artefact, read-only**
  in the recipient's hands — it is never merged into the
  recipient's journal layer, never pins onto their atlas,
  and imports no facts into their world. Receiving is
  viewing, exactly as #188 rules spectating.

## Show lane

None — and that is the spec's point. The journal is the
*player's* layer over the game; the show's Rangers keep
whatever notebooks fiction gives them, as props and
character, under episode grammar. No journal mechanic
crosses into the show, and no show notebook is a system.

## Wiring

Surface: #137 atlas (overlay only). Clock: #19 (+ beat
idiom from #106). Seat: proposed #96 `journal` section.
Share: proposed generator into #90's vocabulary.

## Coverage — honest

- **Architecture: fully documented**; the structural
  separation is the load-bearing yield.
- **Contents: zero annotations instanced;** pin limits,
  text limits, and whether sharing exists beyond local
  export at all are OPEN (networking scope is an owner
  ruling, not a default).
