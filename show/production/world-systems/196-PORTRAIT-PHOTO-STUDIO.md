# #196 — PORTRAIT & PHOTO STUDIO SERVICES → the individual, sitting still

**What was studied.** Photography and portrait services in
the publicly documented record: field cameras with kept
albums, and studio services — sittings booked at a place,
portraits printed as physical objects, frames and prints
kept as items. The documented studio difference from field
photography is the *occasion*: a sitting is an appointment
with a subject, staged light, and a keeper behind the
camera. The kit taken: the studio as a service place, the
sitting as a service record, the portrait as a shutter
record under field photography's own discipline. No studio
names, print formats, or prices are copied.

## Canon anchors (verified in the packages)

- **#60 owns the shutter.** Snapshot mode already fixed
  the kept record — `{subjects[], place, time_of_day,
  weather_state, wind_state, …}` — and the album's seat:
  "shots land in the Mochiioteca beside the dex record of
  their subjects". A studio changes the occasion, never
  the record: a portrait *is* a #60 shutter record whose
  `place` is a studio.
- **#80 owns the subject.** The individual record's
  deviations carry the schema's ruling — consistency:
  **"MUST REPRODUCE in every generation of this
  individual"** — and its prohibition: "palette variation
  per individual is prohibited by the Lustre Law". A
  portrait pipeline has everything it needs, and one hard
  fence, already written.
- **#152 owns the pose.** Behaviour profiles project into
  views — the show view is "idleLoops + displayBehaviours
  + sociality, roster-bound to the area's #7 table (the
  #84 law, picture form)". A portrait poses its subject
  from the same projection: behaviour as presentation,
  bound to a roster — here, the sitter's own record.
- **#132 owns the place shape; #164 owns the booking
  pattern.** Studios are service places in #132's family;
  a sitting is booked the way #164 books repeatable
  service: a template (the studio's sitting offer) plus
  derived facts, no quest-log store.

## Native spec — `mochiichao/photo-studio/v1` (fragment beside this doc)

- **The studio.** A service place record (#132 family) on
  a #119 interior; its service vocabulary is `sitting`
  (and, where authored, `print`). Keeper staffing rides
  #93 schedules, exactly as centres do. Price posture is
  #118's: a service slot priced on #20's economy, `null`
  until ruled — the sitting's existence never depends on
  its price being invented.
- **The sitting.** `{sittingId, studioId, subjects[],
  beat}` — subjects are **individual ids (#80)**, never
  species ids: a sitting is of *these* Mochi, this Ranger,
  this party. The sitting produces shutter records in
  #60's format verbatim (`place` = the studio interior);
  they land in #60's album beside the subjects' dex
  records, like any kept shot.
- **The portrait rule (the load-bearing clause).** A
  portrait shows **the individual, not the species
  template**: the subject's rendering reproduces its
  RULED deviations (#80 — they must reproduce in *every*
  generation of the individual, and a portrait is a
  generation), poses from its species' #152 profile
  (idle/display behaviour, read as presentation), and
  never recolours — the Lustre Law fence in #80's schema
  binds prints exactly as it binds sprites. A portrait of
  the wrong individual's face on the right species is a
  data error this spec names, not a style choice.
- **Prints are items.** A print is a physical object: an
  item record in #31's layer, category `material` (the
  closed vocabulary's made-thing class), non-stackable,
  referencing its shutter record; holding one is a #190
  holding like any other item (it can be vaulted; the
  soft-lock audit ignores it — no story needs a portrait,
  which is rather the point). This package instances zero
  item rows — item data is the data lane's; the category
  ruling and the reference shape are the yield.
- **No discovery.** A studio portrait sets no dex states:
  its subjects are the Ranger's own kept individuals, and
  #60's field discovery tie (a snapshot of an unseen
  species) has no studio analogue. The studio writes
  sittings, shutter records, and print holdings — nothing
  else.

## Show lane

A portrait sitting is a ready-made quiet scene: the one
place the show's motion stops on purpose. It stages under
#82's arc grammar as an occasion episode beat — who sits,
who fidgets (the #152 profile, performed), what the keeper
sees. And the portrait rule is the show's own likeness
discipline wearing a diegetic hat: the framed face on a
character's wall is *that individual*, deviations and all,
every time it appears.

## Wiring

Record: #60 shutter format + album. Subject: #80
(deviations, Lustre fence), pose #152. Place: #132
family on #119 interiors, keepers #93. Booking: #164
pattern. Prints: #31 (`material`), holdings #190.

## Coverage — honest

- **Architecture: fully documented**; the yield is the
  join — occasion (#132/#164) × record (#60) × individual
  (#80/#152) — with the portrait rule as its clause.
- **Contents: zero studios instanced;** locations,
  keepers, sitting variants, print sizes, and prices are
  OPEN.
