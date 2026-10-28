# #194 — WEATHER FORECASTING SERVICE → the derivation #172 presupposes

**What was studied.** Forecast systems in the publicly
documented record: weather NPCs and forecast broadcasts
that tell the player tomorrow's sky — and, in the honest
implementations, are projections of the same weather
simulation that will produce the day, which is why they can
be right. The kit taken: a forecast is not a content
feature bolted onto weather; it is the weather derivation
evaluated early, with its confidence stated. No forecast
formats, texts, or accuracy numbers are copied.

## Canon anchors (verified in the packages)

- **#172 already wrote this system's charter.** Its
  registered clarification: broadcast media carries a
  forecast **only where a derivation backs it** — "a
  forecast is a projection of that derivation", in #124's
  terms, and a forecast of #61's producer output where no
  derivation exists is "forecasting fiction the system
  can't back". #172's `weather` class therefore carries
  forecasts only where *this* package supplies the
  derivation. #194 is that supply, proposed to be cited
  from #172's home.
- **#61 + #142 are the derivation.** #61's producer emits
  `weather_state ∈ {CLEAR, OVERCAST, RAIN, STORM, MIST,
  FROST, NONE}` per area; #142's consumption rule filters
  and weights it by the region's climate record. #19's
  weather priority — `script > area > global` — is the
  confidence key (below).
- **#124 is the determinism pattern.** Rotation resolves
  as a deterministic read-time function over the world
  clock, and media announces only what the derivation
  activates — one function, read by everyone. Forecasts
  adopt the rule verbatim.

## Native spec — `mochiichao/weather-forecast/v1` (fragment beside this doc)

- **The projection.** A forecast is the #61+#142 weather
  derivation evaluated at a future clock position:
  `{issuedBeat, targetWindow, areaId | regionId,
  projectedState, basis, horizon}`. It stores nothing
  about the world — it is a read, taken early, and two
  readers at the same beat derive the same forecast.
- **Basis and the accuracy window (the honesty field).**
  Every forecast carries its `basis`:
  - `scripted` — the target window's weather is fixed by
    script priority (#19): the projection is **exact**,
    and may be stated as fact.
  - `derived` — area/global derivation from current state:
    the projection holds for a stated horizon and is
    worded as an expectation.
  - `weighted` — the climate record's weights rule the
    window: the projection is a **likelihood**, worded as
    one, and may never be upgraded in delivery copy.
  The accuracy window is a property of the horizon and the
  basis — it narrows toward the present and toward
  `scripted`, and the record carries it (`windowBeats`,
  values OPEN) rather than letting delivery imply
  certainty the derivation doesn't have.
- **Phenomena are possibilities at most.** A #153
  phenomenon's conditions (climate, phase, weather
  precondition) can be *approached* by a projection; a
  forecast may therefore list a phenomenon as `possible`
  when its conditions are projected to gather — and **may
  never assert one will occur**. Phenomenon records gain
  no forecast field; the reference lives on the forecast,
  pointing one way.
- **The depths.** The Dark Forest depths are weather
  NONE (#61, #142 hard canon) at every clock position, so
  the forecast for the depths is always NONE — the one
  perfectly certain forecast in the system, and it tells
  the Ranger nothing they didn't know. No forecast may
  project any other state into the depths; a record naming
  the depths with a non-NONE projection is a data error.
- **Delivery — two channels, one derivation.** (1) #172's
  `weather` broadcast class carries forecasts verbatim
  from this derivation — media never announces a sky the
  derivation didn't produce (#124's one-function rule).
  (2) The Mochiioteca: #149's screen classes are closed
  (identify / map / scan / alert), so device delivery is a
  proposed `forecast` class, landing only in #149's home;
  until accepted there, device-side forecasts are
  spec-level and broadcast delivery is the live channel.
- **Service or device function?** Whether forecasting is a
  free device function or a keeper's service (#132 family,
  priced on #20) is an owner ruling — the cost slot ships
  `null` per the service precedent, and the derivation
  works identically either way.

## Show lane

A forecast in the show is a Ranger tool used on screen —
a broadcast half-heard at breakfast (#172's classes), a
device checked before a crossing. It obeys the same
honesty: a character may *trust* a weighted forecast and
be rained on; the system never promised otherwise, and
neither may the script's staging imply it did.

## Wiring

Derivation: #61 producer + #142 climate, priority per
#19. Determinism pattern: #124. Delivery: #172 `weather`
class (live); `forecast` class proposed into #149.
Phenomena: #153 (one-way reference, possibilities only).

## Coverage — honest

- **Architecture: fully documented** as a pattern; the
  load-bearing yield is the `basis` field — confidence as
  data, not tone.
- **Contents: zero forecasts instanced;** horizon lengths,
  accuracy-window values, and the service-vs-device ruling
  are OPEN.
