# 50 — EPISODE COLOUR-SCRIPT FORMAT

Teardown List 6, item 50. Native production format for the
Mochiichao show. Generalises the one worked instance that already
exists — COLOR-SYSTEM.md §(e), the EP01 colour script — into the
reusable per-episode format every future episode is written in.
Read with: COLOR-SYSTEM.md (Part 2 system + colour gate) and
LIGHTING-SYSTEM.md (keys §3, shift protocol §4, per-scene sheet §8).

No new colour decisions are made here. This is a **format**: fields,
rules for filling them, and the checks that tie an episode script to
the systems that already govern colour and light.

---

## 1. Teardown — what a colour script is (documented practice)

The colour script (Pixar method, documented in production-design
literature and cited in COLOR-SYSTEM §5) is a one-glance map of an
episode/film's colour *over time*: one panel or line per beat giving
dominant colour, value, and saturation, so the emotional arc is
visible as a colour arc before a single scene is graded. Its
production functions: (i) the arc is *decided* once, up front;
(ii) every scene grade is checked against its line; (iii) deviations
are deliberate (a scripted spike/shift) or errors — never accidents.

## 2. Native format — `EP##-COLOUR-SCRIPT.md` (one per episode)

### 2.1 Header block (mandatory)

```
episode:        EP## — "<title>"
arc_statement:  one sentence: what the colour does across the episode
                (e.g. EP01: "drains as the mystery deepens, returns on the reveal")
drain_axis:     which channel carries the arc — saturation | value | temperature
                (exactly one primary; EP01 = saturation, value held)
shift_licence:  which locations may JoJo-shift this episode (default: Dark
                Forest only, per COLOR-SYSTEM §d; any addition is OWNER call)
spark_budget:   count + placement of saturated "spark" beats (default ≤1
                action spike + stinger exception only if scripted)
```

### 2.2 Beat table (the script itself — EP01's columns, now the standard)

| Beat | Scene | Location grade ref | Dominant | Value | Saturation | The spark |
|---|---|---|---|---|---|---|

- **Location grade ref** points at COLOR-SYSTEM §(d)'s per-location
  script (dominant family + day/night policy + shift rule) — the
  episode script *instantiates* grades, never redefines them.
- **The spark** names the single saturated accent the beat is
  allowed (a tail flame, a mask-white, the accent-red Rule burn-in).
  A beat with no spark writes `none` — EP01's stinger proves
  "no spark is the spark" is a legal, powerful entry.
- Beats follow the locked script's beat numbering; the colour
  script is re-issued (new version, never overwritten — currency
  law) when the script version changes.

### 2.3 Per-scene lighting link (mandatory per scene, not per beat)

Each scene row in the episode's lighting plot (LIGHTING-SYSTEM §8.1
sheet) cites: colour-script beat(s) it serves + location×time key
(LIGHTING §3) + any shift-protocol invocation (LIGHTING §4, named
and justified in one line). A scene whose grade cannot cite a beat
line fails the lighting gate (§8.2) — this format is what makes that
check mechanical.

### 2.4 Frost / colour-shift close-ups (canon device)

EP-canon device (owner-ruled): the FROST CLOSE-UP COLOUR SHIFT —
world palette shifts on zoom-in to frost, restores on zoom-out. In
this format it is entered as a beat-level spark variant:
`spark: FROST-SHIFT (close-up only)`, and the lighting sheet records
the in/out frame addresses. It does not consume the episode's
action-spike budget.

## 3. Fill rules

- **F1 — One colour change per cut** (COLOR-SYSTEM time-of-day law):
  a beat line may move location *or* temperature, not both, across
  a cut boundary; the script's job is to make violations visible.
- **F2 — Value discipline under saturation play:** when saturation
  is the drain axis, value keys stay on the location grade's policy
  (the EP01/Eds lesson: hue chaos survives on a value leash).
- **F3 — Variant behaviour is inherited:** lustre/variant reads
  under each grade follow COLOR-SYSTEM §(b) + LIGHTING §6; the
  episode script never re-specifies them.
- **F4 — Subtitle/UI colour is not a spark:** subtitle cards and
  Rule burn-ins use COLOR-SYSTEM §(g)'s fixed discipline and are
  noted in the beat line's spark cell as `(+card)` / `(+Rule)`.

## 4. Gate additions (join the COLOUR GATE, COLOR-SYSTEM end)

- ☐ Header complete; drain axis single; shift licence within §(d).
- ☐ Every beat line's grade ref resolves to a §(d) location script.
- ☐ Spark budget respected; every spark is named, none implied.
- ☐ Every scene lighting sheet cites its beat line(s) (§2.3).

## 5. Wiring points

- Lands in each episode package beside BEAT-SHEET.md / CUE-SHEET.md
  as `EP##-COLOUR-SCRIPT.md`; EP01's §(e) table is re-issued in
  this format at landing (values unchanged — format migration only).
- Build-manifest/compiler: per-scene records gain `colour_beat`
  refs alongside `wind_state / score_state / stems` (List 2 #13/#16
  wiring), making the §4 checks runnable at composite.

## 6. Coverage notes

The colour-script method is published production practice (Pixar
colour scripts are extensively documented); the *format* here is
native, generalised from this show's own EP01 instance — the
highest-confidence kind of teardown, since the worked example is
ours and locked. No third-party colour scripts or palettes are
reproduced. Open by design: EP02+ arc statements don't exist yet
and are episode work, not format work.
