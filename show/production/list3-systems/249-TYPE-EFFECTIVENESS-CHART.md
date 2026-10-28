# #249 — TYPE EFFECTIVENESS CHART → the filled chart for Mochiichao's fifteen types

**Supersession, stated plainly.** #17 built this chart's
shape — sparse (attacking, defending, multiplier) triples,
`mult ∈ {0, 0.5, 2}`, unlisted pairs ×1, dual-type
products computed and never stored — and asserted **zero
matchups**, leaving the contents to an owner balance pass.
Under the Pokémon-base rule (owner, 2026-10-27: fill all
gaps the way Pokémon does it), **the contents are asserted
here.** This spec and its fragment supersede List 3's
stance for the chart's contents only; #17's shape, format
(`mochiichao/type-chart/v1`), and wiring stand unchanged.

**Method (so the fill is checkable, not vibes).** Each of
the fifteen canonical element ids (#17's intake
vocabulary) was matched to its nearest Pokémon analogue,
and that type's documented (Gen VI+) offensive profile
was transposed onto Mochiichao's ids — a matchup exists
in this chart exactly where the analogue chart has one
against a type that also has a Mochiichao counterpart.
Three types have no Pokémon analogue — **Core, Silk,
Wind** — and carry authored balanced profiles, stated as
authored wherever they appear. The fragment is the
machine truth (85 triples: 56 transposed, 29 authored);
the tables below are the same data read by eye.

**Analogue map.** Aqua→Water · Flame→Fire · Flora→Grass ·
Chrome→Steel · Umbral→Dark · Mythic→Dragon · Beast→Normal ·
Strike→Fighting · Bug→Bug · Aero→Flying · Earth→Ground ·
Neon→Electric. **Authored:** Core, Silk, Wind.

## The chart — offensive profiles (×2 / ×0.5 / ×0 against)

- **Aqua** — strong: Earth, Flame · weak: Aqua, Flora, Mythic
- **Flame** — strong: Bug, Chrome, Flora, Silk · weak: Aqua, Flame, Mythic
- **Flora** — strong: Aqua, Earth · weak: Aero, Bug, Chrome, Flame, Flora, Mythic, Silk, Wind
- **Chrome** — strong: Core*, Wind* · weak: Aqua, Chrome, Flame, Neon  *(Chrome's analogue targets — the ice/rock/fairy seats — do not exist in this vocabulary; its in-chart strengths are the two authored ones. Stated, not patched over.)*
- **Core*** — strong: Chrome, Neon · weak: Core, Mythic
- **Umbral** — strong: Core* · weak: Strike, Umbral  *(its analogue's other targets — the psychic/ghost seats — likewise have no counterpart here)*
- **Mythic** — strong: Mythic · weak: Chrome
- **Beast** — strong: — · weak: Chrome  *(the Normal profile, faithfully sparse: Beast hits nothing super-effectively in this vocabulary and is resisted by Chrome alone)*
- **Strike** — strong: Beast, Chrome, Core*, Umbral · weak: Aero, Bug, Silk*
- **Bug** — strong: Flora, Umbral · weak: Aero, Chrome, Flame, Strike, Wind*
- **Silk*** — strong: Flora, Umbral · weak: Aero, Chrome, Flame  *(Bug-family authored: binds and feeds on leaf and shadow; flame and open air undo it)*
- **Aero** — strong: Bug, Flora, Silk*, Strike · weak: Chrome, Core*, Neon
- **Wind*** — strong: Bug, Flora · weak: Aero, Chrome · immune-into: Earth  *(authored as Aero's storm sibling, not its copy: wind does not move earth, and earth cannot strike wind — the pair is immune both ways)*
- **Neon** — strong: Aero, Aqua, Wind* · weak: Flora, Mythic, Neon, Core* · immune-into: Earth
- **Earth** — strong: Chrome, Flame, Neon · weak: Bug, Flora, Silk* · immune-into: Aero, Wind*

(* = an authored pairing — one side is Core, Silk, or Wind.)

Defensive profiles are the same triples read backwards;
the fragment carries them, and #18's AI and the battle UI
read the fragment, never this prose.

## The three authored profiles (design notes, so landing can defend them)

- **Core** — the essence/energy type. It overloads what
  runs on structure: strong into Chrome and Neon, blunted
  by Mythic (essence older than cores) and by itself.
  Incoming: Strike and Umbral crack it, Chrome's tools
  cut it (Chrome→Core ×2 is authored), Neon and Aero are
  partly absorbed (×0.5). Net: 2 strengths, 2 weaknesses,
  2 resistances, 1 self-resistance — mid-table, where a
  rare type belongs.
- **Silk** — Bug's authored sibling. Same diet (Flora,
  Umbral), same enemies (Flame, Aero), plus Earth and
  Strike partly resisted on defence (a web anchors; a
  blow slides). It differs from Bug where the fiction
  differs: Silk does not fear the Strike exchange the
  way Bug does on attack (no ×0.5 into Strike), and Bug
  itself has no special purchase on Silk.
- **Wind** — the weather half of the air pair (Aero is
  the winged half, Flying-transposed). Wind strips
  Flora and Bug, breaks against Chrome and Aero, and is
  the chart's second immunity pair: Earth↔Wind ×0 both
  directions. Incoming, storms conduct (Neon ×2) and
  structure outlasts weather (Chrome ×2).

## The vocabulary note (a canon gap the chart cannot fill)

The chart covers the fifteen canonical ids and nothing
else. The design lane's sheets also carry working labels
with no canonical seat — **Frost** and **Venom** (no ids),
**Terra / Gale / Volt** (unruled mappings to Earth /
Aero-or-Wind / Neon) — and #17's TBD D6 (Aero vs Wind as
one element or two) is still open; this chart carries
Aero and Wind as the separate ids #17 ships. Species
labelled with the unseated words get **no chart rows by
invention**: their matchups exist the day the vocabulary
is ruled (registered as hole H3 in #247). The game data
that exists today keys off the canonical ids (moves
carry `Aqua`, not "Water"; species core records carry
the template vocabulary) — the chart serves that data
as it stands.

## Wiring

The fragment drops into #17's format unchanged —
consumers are species `types[]` and move `type` fields
(by id, never display string), #248's chain step 2,
#18's scoring, #10's effectiveness messaging. Rebalancing
later means editing triples, exactly as #17 designed;
no species or move record ever changes with the chart.

## Coverage — honest

- **Chart: complete for the fifteen canonical ids** —
  every pair is either a listed triple or ×1 by the
  sparse rule; nothing is "to be decided" inside the
  fifteen.
- **Outside the fifteen: honestly absent** (H3). Frost,
  Venom, and the label mappings wait on a vocabulary
  ruling that is a canon decision, not a balance one —
  the one place this fill stops, and it stops in the
  open.
