# #247 — BASE COMPLETENESS AUDIT → what a Pokémon-style game needs, and what Mochiichao already has

**What this is.** A map, not a system. Lists 1–25 built
Mochiichao's world, institutions, presentation, and most of
its battle machinery on top of the Pokémon base (the owner's
standing rule: everything is built on the full Pokémon base,
Jamar's canon layered on top). This audit sweeps the base
layer itself — the core systems a Pokémon-style game cannot
run without — and records, for each one, whether Mochiichao
already has it and where it lives. It asserts nothing new.
Where the sweep finds a true hole, the hole is named plainly
as a future candidate. List 26's own items (248–256) are
included in the map as filled-here, so the audit describes
the world *after* this package lands.

**Method.** The checklist is the documented core of the
reference games (battle arithmetic, encounter machinery,
progression, economy, services). Each line was checked
against the earlier packages' own files — not against their
summaries. A system counts as *present* when a package
specifies its shape and seats; *present, contents open* when
the machinery exists and only authored data is owed (that is
a data pass, not a hole); a *hole* is machinery that does
not exist anywhere in Lists 1–26.

## The map

| Base system | State | Where it lives |
|---|---|---|
| Type effectiveness chart (shape) | present | #17 (sparse triples, `mult ∈ {0, ½, 2}`) |
| Type effectiveness chart (values) | **filled here** | #249 — analogue-transposed + authored for Core/Silk/Wind |
| Damage formula | **filled here** | #17 pipeline shape (constants PROPOSED there) → #248 locks the arithmetic |
| Stat computation (base/variance/effort/temperament) | **filled here** | seats in #80/#39/#108 + #179's conversion → #248 states the formula |
| Stat stages, accuracy/evasion, critical stages | **filled here** | #17 named the tables → #250 supplies them |
| Turn order (priority, speed, ties) | **filled here** | #251 (assumed by #10's flow, never specced until now) |
| Battle weather effects | **filled here** | #47 condition records + #181 resolution order → #252 states per-weather effects |
| Status conditions | present | #27 (vocabulary: persistent/volatile) + #182 (resolution, cures) — roster of conditions is data |
| Abilities | present | #107 (data model) + #184 (trigger resolution) — assignments are species-data work |
| Held items in battle | present | #31 (item layer) + #183 (trigger resolution) + #166 (the held slot's supply) |
| Moves (data) | present, contents growing | core `moves.json` + the 352-move machine registry (PR #366); animations: #9 + #147's coverage ledger |
| Capture | present | #38 (+ #170 safari variant, #158 horde rule) |
| Wild encounters (tables, bands) | present | #7 (spawn tables) + #52 (authored bands — never scaled to the visitor) |
| Encounter strike rate & pacing | **filled here** | #255 (tables carried weights but no rate until now) |
| Repel / lure | present, semantics resolved here | #112 (transform shapes) → #255 rules the repel floor party-relative, Pokémon-style, reconciled with #52 in writing |
| Running from a wild battle | **filled here** | #254 (no earlier package specced it) |
| Gain, levels, growth curves | present | #177 (gain) + #178 (curves; level derived, never stored) — yield/threshold *values* are data passes |
| Effort / training values | present | #39 (ledger) + #179 (application into #248's stat formula) |
| Individual variance | present | #80 |
| Temperament (the nature seat) | present as a seat | #108 — its stat-modifier *mapping table* is a data pass (hole H4) |
| Evolution | present | #8 (edges) + #199 (methods) + #228 (presentation) |
| Breeding / eggs | present | #77 + #171 + #193 + #204 — `eggGroups` assignments are a data gap (0/47) |
| Trading / gifts / surprise exchange | present | #68 + #168 + #217 + #219 |
| Money, shops, sinks/faucets | present | #20 (one currency; its name is a canon slot) + #118 (shops) |
| Prize money & losing a battle | **filled here** | #253 |
| Centres (healing, services) | present; flow **filled here** | #132 (the write boundary) → #256 (the full visit as one flow) |
| Storage | present | #106 (Mochi) + #190 (items) |
| Save | present | #96 (integrity) + #146 (one world, zero region forks) |
| Dex / discovery | present | #14 + #198 + #207 (silhouettes until discovered) + #208 (audit) |
| Field techniques, mounts, traversal | present | #117 + #123 + #192 |
| Battle field (weather/terrain/room slots) | present | #47 + #181 — terrain *contents*: no canon terrain authored yet (H7) |
| Formes & transformations | present | #130 + #175 + #185 |
| Signature moves | present | #131 (Water Orb's own entry per the owner's split, final synthesis stats) |
| Postgame facilities, ladder, rentals | present | #86 + #186 + #159 |
| Versus & multi formats, spectating, replays | present | #109 + #157 + #188 + #187 |
| Contests | present as machinery | #167 — whether any contest exists in canon is a story slot |
| World weather, time, forecasts | present | #19 + #61 + #67 + #142 + #194 — the *calendar* underneath is unruled canon (H6) |
| Difficulty, onboarding, text, camera, audio base | present | #70 + #71 + #23 + #21 + #22/#75 |

## The true remaining holes

Machinery that does not exist in Lists 1–26, named for
future lists. Nothing here blocks the base game; each is a
real absence, not a data debt.

- **H1 — Side conditions.** #47's field vector has three
  slots (WEATHER / TERRAIN / ROOM) and no seat for
  *side* conditions: entry hazards (the Stealth Rock
  class), screens (the Reflect class), tailwind-class
  side effects. #248's critical rule therefore has no
  screen records to ignore yet. A side-slot extension of
  #47 is the candidate.
- **H2 — Switching as a system.** Pieces exist — #10's
  forced-switch interrupt, #184's entry step, #251's
  order seat for the switch command — but no package
  specifies voluntary switching whole: the incoming
  individual taking the opponent's move, pivot-move
  ordering, what a switch may and may not be combined
  with. Candidate: one switch-mechanics spec over those
  seats.
- **H3 — Element vocabulary reconciliation (a canon
  fact, not mechanics).** The chart (#249) covers #17's
  canonical 15 ids. The design lane's sheets also use
  working labels with no canonical seat: **Frost** and
  **Venom** have no id at all; **Terra** (→ Earth),
  **Gale** (→ Aero or Wind), **Volt** (→ Neon) are
  unruled mappings; and #17's own TBD D6 (Aero vs Wind,
  one element or two) is still open. Until this is ruled,
  Frost-/Venom-labelled species have no chart rows and
  #252's FROST chip-exemption list stays empty. This is
  the owner's vocabulary call — the audit names it; it
  does not fill it.
- **H4 — Temperament → stat mapping (data).** #248 seats
  the temperament modifier in the stat formula (the
  nature position). Which temperament raises and lowers
  which stat is a table nobody has written. A data pass
  over #108's vocabulary, not a new system.
- **H5 — The move registry's landed home.** The core
  `moves.json` and the 352-move machine registry both
  exist; which file the game reads, and the merge path
  between them, is a carried UNVERIFIED TARGET (List 13 /
  #147 registers). Landing-audit fact, still owed.
- **H6 — The calendar.** Day kinds and seasons are
  unruled canon (carried from #93/#105/#124). It gates
  #195's seasons and any date-based base content. A
  story-side ruling, named here because so much machinery
  waits on it politely.
- **H7 — Terrain contents.** #47/#181 give terrain full
  machinery and zero canon terrains exist to instance.
  Authoring the first terrains is a contents pass (a
  dojo floor, a Garden sward) when the content lane wants
  them — the machinery is not the hole; the world is.

## Coverage — honest

The sweep was run against the packages' own files
(Lists 1–25 plus this list's 248–256). "Present" means a
spec exists and was read; it does not mean the landing
lane has finished wiring it into the repo — wiring state
is the landing lane's PR record, not this audit's claim.
Data debts (values, assignments, thresholds) are listed
as what they are and never upgraded to holes or downgraded
to done.
