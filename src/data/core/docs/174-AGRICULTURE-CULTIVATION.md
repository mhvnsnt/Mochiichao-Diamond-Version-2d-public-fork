# #174 — AGRICULTURE & CULTIVATION → the economy layer over #79's farm

**Seat in the doctrine — stated plainly, because the
neighbour is close:** #79 already built the farming
loop. The Mochi Fruit farm spec owns the plot model
(`{plot_id, site, state, fruit, stage, stage_count,
planted_at, tended, yield_pending}`), stage growth on
#19's clock, the tend-bonus yield rule, harvest into
items, the fruit table (schema only, contents OPEN),
and the Garden + route sites. **#174 re-specifies none
of that.** #174 is the layer above the farm:
cultivation as a *world economy system* — crops beyond
fruit, fields as world content tended by the world's
people, and the loop that carries produce into shops
and the currency economy. #79's farm is this system's
first and only canon instance; if the two ever seem to
disagree about a plot, #79 is right and this file is
wrong.

**What was studied.** Agricultural systems in the
publicly documented record, at the economy layer
rather than the plot layer: farming as a *supplier*
woven into a world's towns — fields keyed to places,
produce flowing into shop stock, regional crops
reading regional conditions, and the care-register
rule that cultivation rewards tending and never
punishes neglect with death. The kit taken: crop
record generalised, sites as world content, the
economy joins made explicit. No crop names, yields,
or prices are copied or invented.

## Native spec — `mochiichao/cultivation/v1` (fragment beside this doc)

- **The crop record, generalised.** #79's fruit table
  is the fruit case of a crop record: `{cropId (a #31
  item id), stage data (in #79's shape), yield range,
  weather affinity}` grown in #79's plot model,
  unchanged. Non-fruit crops — grains, greens, fibres,
  named here as **classes of shape only** — use the
  same record and the same plots. Crop *contents*:
  zero asserted. Every crop, like every fruit, is
  content for the data lane under this shape.
- **Cultivation sites are world content.** A field is
  a plot cluster seated on a #7 area or at a #119
  host node (a greenhouse reads weather only through
  #119's explicit exception field — interiors do not
  read #19 by default, #119's rule, inherited).
  Fields are tended by NPCs as world life — a farmer's
  day is a #93 timetable, and a tended field is a
  place's living texture keyed to #19/#142 state — or
  by the Ranger where a plot is theirs (#79's Garden
  row and route plots). **Yields belong to the plot's
  tender:** an NPC's field is an economy source and a
  place's life, not a Ranger system wearing a hat —
  the Ranger cannot harvest a field that isn't theirs,
  and this format defines no taking.
- **The economy loop, closed explicitly.** Yields are
  #31 items (the farm defines growth, never effects —
  #79's rule, inherited verbatim). Produce reaches
  #118 shops as **stock sources**: a shop's stock row
  may cite a cultivation source, while stock contents
  and gates stay #118/#20 data. Prices are #20's —
  prices are data, the global sell fraction is #20's
  PROPOSED ½, and the currency's name is #20's OPEN
  slot; none of that is re-ruled here. Regional
  expression reads through #142's climate (a crop's
  weather affinity is its own data; grown outside its
  home climate it reads the *effective* state like
  every other consumer — #142's rule).
- **The calendar dependency, inherited honestly.**
  Growth stages run on #19's clock (#79). **Seasons do
  not exist yet** — the calendar (day kinds, seasons)
  is the standing OPEN gap #93, #105, and #124 each
  registered. Seasonal planting windows and crop
  rotation are therefore specified as *slots keyed to
  the calendar-when-ruled*, and instance nothing. A
  cultivation system that invented its own seasons
  would fork the world's time; this one waits.
- **Ethics.** No real-money anything, ever — inherited
  flatly (#56's M4: the format has no field for a
  real-money layer; #20: one currency, premium
  patterns out of scope). And no fail state: neglect
  shrinks a yield, never kills a plant (#79) — the
  care register governs fields as it governs the
  Garden.
- **Show lane:** fields are living-world texture and,
  at the Garden plot row, a season clock (#79's
  staging: planted early, ripe at a later beat). The
  show depicts tending as life; the economy loop is
  game-lane system and is never displayed as a model
  (#20's show rule).

## Open slots (nothing invented)

Every crop and fruit content (inherited #79 — names,
effects, yields, affinities) · plot counts and field
sites beyond #79's canon references (the Garden row;
the R1 farm-plot talk) · the calendar and seasons
(inherited — #93/#105/#124's standing gap) · NPC farm
rosters and their timetables · whether Ranger-owned
field plots exist beyond Garden/route plots · shop
stock rows citing cultivation sources (contents are
#118's pass).
