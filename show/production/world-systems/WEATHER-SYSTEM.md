# WEATHER SYSTEM — rendering grammar for the show (List 7, #61)

Teardown: weather in 2D anime and creature games is never one
effect — it is a *layer stack* with an order, each layer owned by
a different department (precipitation, atmosphere, wind-driven
motion, light state), plus a state record every other system can
read. Public grammar (anime production practice; the open-movie
and TV pipelines in Jamar's research): weather is staged
background-to-front, light is set by weather rather than decorated
by it, and the strongest weather beat is often a *withholding* —
weather that refuses to arrive.

## Native system

**WEATHER-STATE** — a scene/manifest global, sibling of
WIND-STATE (LIVING-WORLD) and SCORE-STATE (List 2 #13):

`weather_state ∈ {CLEAR, OVERCAST, RAIN, STORM, MIST, FROST, NONE}`

`NONE` is a real value, not an absence of data: it means the
weather system is *off* for this place — see the Forest rule.

**The layer stack (composite order, fixed):**

| # | Layer | Owner | Notes |
|---|---|---|---|
| W1 | Sky/plate response | Background | Plate's weather variant or grade; plates are versioned, weather does not repaint them per episode |
| W2 | Light state | Lighting | The lighting key is chosen *by* the weather (LIGHTING-SYSTEM keys); weather shifts land on holds like all shifts |
| W3 | Atmosphere (fog/mist/haze) | Composite | Levels **with edges** (the AMB-POND-MIST-01 precedent: mist is a level that can part, thin, or split — never a fullscreen blur) |
| W4 | Precipitation | FX cycles | Rain/storm cycles in the Ambient Cycle Library grammar (`AMB-[LOC]-RAIN-##`); rate keyed to WIND-STATE |
| W5 | Wind-driven surface response | LIVING-WORLD | Grass/leaf/water cycles already keyed to WIND-STATE — weather raises wind, wind moves the world; weather never animates surfaces directly |
| W6 | Character response | Animation | Wet sheen, shake-off, shelter-seeking are *acting* (follower REACT `weather:<state>`, #58), not an FX overlay |

Rules: a layer may be empty; the order never changes; no layer
imitates another's job (rain does not darken the plate — W2 does).

**The FROST device (canon):** Wispkin's nightly trace is Frost
carrying black-purple spirit-aura smoke/flame, with the FROST
CLOSE-UP COLOUR SHIFT — on zoom-in the world palette shifts, on
zoom-out it restores. In this system FROST is a weather_state
whose W2/W3 behaviour *is* that shift: the shift is keyed to
camera distance (a staging fact), recorded on the xsheet, and it
belongs to Frost traces only — snapshot filters and ordinary mist
may not borrow it (#60).

## Worked first case — Dark Forest mist

Canon: the Forest has mist weather; its surface hums and its
depths are where things stop moving; the stinger stages daylight
that *stops at the trunks* (FOREST-DAY "Refusal" — no key, no
shift, no takeover until TK-5).

- **Surface:** `weather_state: MIST`. W3 mist levels drift at the
  treeline and between trunks, edges visible; W5 is *starved* —
  the Forest's cycles are AMB-FOREST-NONE (no cycles run), so the
  mist moves and nothing answers it. That mismatch is the dread
  mechanic, stated as a rule: **in the Forest, atmosphere moves;
  the world does not.**
- **Depths:** `weather_state: NONE`. Not thicker mist — the
  weather system itself withdraws, with the cycles, the bed, and
  the light key. Escalation in the Forest is by *subtraction*,
  matching the inverted world-alive gate (Forest cuts fail the
  frame-diff check if they move).
- The one scripted leaf (cut 28) falls straight down — no wind
  curve — because W5 has no wind to give it. Recorded on the
  xsheet as a weather fact, not an animator's choice.

## Record format (per scene/cut, in the build manifest)

```json
{"weather_state": "MIST", "wind_state": "CALM",
 "layers": {"W2_key": "FOREST-DAY", "W3": "mist levels x2, edged",
            "W4": null, "W6": "partner REACT dread — close + quiet"}}
```

## Wiring

- LIVING-WORLD: W5 is its cycle library; AMB-POND-MIST-01 is the
  W3 precedent; the inverted Forest gate consumes `weather_state`.
- LIGHTING-SYSTEM: W2 keys and takeover rules unchanged — weather
  *selects* keys, it does not add any; the Forest still gets no
  personality preset.
- Audio: beds key to weather via the existing bed system (Forest
  bed = engineered absence); SCORE-STATE ABSENCE pairs with
  `weather_state: NONE` in the depths.
- Xsheet (List 2 #16): weather_state is a header field; the Frost
  shift is a marked camera-distance event in the camera column.

## Coverage

Layer-stack grammar: standard anime/game practice, publicly
documented. Mochiichao contents: Forest case fully canon-grounded;
per-location weather tables beyond the Forest/Pond/Gate/Green set
are owed with those locations' living plates — not extrapolated here.
