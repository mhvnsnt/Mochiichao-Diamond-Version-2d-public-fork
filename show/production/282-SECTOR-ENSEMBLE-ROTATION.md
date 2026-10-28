# #282 — SECTOR & ENSEMBLE ROTATION → the camera moves; the world doesn't pause

**The owner's shape (2026-10-27).** Within a part, the
story **swaps around** — Sonic Adventure 2 is his named
model: different characters, different settings and
sectors, arcs that feel different while plainly
belonging to one world and one stretch of its history.
#277 built the rotation *between* parts; this spec is
the rotation *inside* one: how a part follows several
viewpoint characters across several sectors without
the world freezing behind the camera — and without
any character's story dissolving while they're
off-screen.

## Native spec — `mochiichao/sector-rotation/v1` (fragment beside this doc)

- **A viewpoint assignment is production data.** In
  the part's arc planning (#82), each arc (and, where
  an arc interleaves, each episode block) carries
  `viewpoint`: the character followed and the sector(s)
  staged. Rotation is therefore **planned, recorded,
  and auditable** — not a rhythm a season drifts into:
  the part record can answer "who carried episodes
  5–8, and where" from its plans alone. A part with
  one viewpoint throughout is a legal shape (the early
  parts are); rotation is a tool the record makes
  available, never a quota.
- **The simulation floor: the world runs on #93 and
  #145, and that is enough.** Off-screen life is not
  simulated by a new engine; it is *already* the
  programme's floor — named NPCs are always somewhere
  (#93's default-row law), travellers are always on a
  circuit (#145), weather and phase tick (#19/#61),
  festivals and rotations fire (#105/#124). A
  rotated-away sector is therefore not empty between
  visits: when the camera returns, the world's state
  is read from the same tables the camera left, plus
  the facts the intervening time and arcs have written.
  What this spec adds is only the **accounting rule**
  below — the floor itself is verified machinery, not
  a promise.
- **A rotated-away character's story continues as
  world facts.** While a viewpoint character is off-
  camera, what happens to them enters the record only
  as facts other arcs can meet: a #12 story fact (they
  did the thing — the beat's *consequences* are in the
  world), a #93 flag_override (their routine is
  displaced by the events, and resumes after), a
  traveller's tale (#145 — news arrives by carrier, at
  carrier speed), a List 28 standing change the world
  can see (#270 — reputation moves off-screen exactly
  as it moves on). **Nothing about them is resolved
  off-screen that an arc would have wanted to stage:**
  rotation moves the camera, it does not spend beats.
  The returning arc opens by *meeting* the accumulated
  facts — the character is caught up with, the way
  #145's travellers are met: as a person whose life
  visibly continued.
- **Interleaving grammar (the SA2 lesson, kept
  structural).** Parallel arcs in one part share one
  timeline: a shared event is staged once per
  viewpoint that was *there*, and the arc plans cite
  the same world fact for it (one explosion, two
  episodes, one #12 fact). Sector contrast is the
  point of the tool — different places, different
  temperatures (#285's tone dials are set per part but
  *read* per sector) — and the record keeps the
  chronology honest so contrast never curdles into
  contradiction (#82's conservation at timeline scale).

## Game mirror

The game has no camera to rotate, but the same floor
serves the thief route and any ensemble content: the
player's Ranger meets a world whose people have been
somewhere (#93/#145 reads), news travels by carrier,
and a sector left for a season of play is re-read,
not restored. Any playable ensemble content (SA2-style
character chapters) is authored content over the part
record (#277) — the rotation *record* shape is shared
between the lanes so a chapter plan and an arc plan
are the same document with different yields.

## Wiring

Reads: #82 (arc plans carry viewpoint), #93 (the
floor), #145 (carriers + meeting discipline), #12
(world facts), #19/#61/#105/#124 (the world's clock
and calendar facts), #277 (the part this rotates
inside), #285 (tone read per sector). Writes: the
viewpoint fields in arc-plan records (landing in
#82's home, cited) and nothing else — no world state
is this spec's to write.

## Open slots

Which characters a part rotates among, and which
sectors — the part's casting and geography, owner/
writers' canon per part. Rotation cadence (how often
the camera moves) is production taste, recorded in
the part record when a part is planned — not a
standing rule this package sets. No mechanic is open.

## Coverage — honest

- Architecture: complete, and deliberately thin — the
  yield is the accounting rule and the plan fields,
  seated on #93/#145 machinery verified as built for
  exactly this weight (#145's whole premise is a world
  that continues between meetings).
- Contents: zero rotations instanced; no part beyond
  Gen 1 exists yet to rotate inside.
