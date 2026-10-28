# #172 — IN-WORLD BROADCAST MEDIA → broadcast records over #90's channel grid

**Seat in the doctrine:** #90 built the media
architecture — the channel grid (`channel {channel_id,
kind, blocks[]}`, `block {time_band, generator,
state_inputs[]}`), the kinds (`broadcast | feed |
bulletin`), the generator vocabulary (`spawn_report`,
`event_echo`, `discovery_count`, `schedule_notice`),
the law that a block with no state input is authored
script rather than generated content, and the naming
discipline (display name **Iridescence**; the system's
speakers never slip). #90 asserted zero channels —
none are canon. #172 is the **broadcast record layer**
over that grid: what a scheduled broadcast is as data,
the content classes it may carry, and the rules each
class obeys. It invents no channel, programme, or
media personality.

**What was studied.** Diegetic broadcast systems in
the publicly documented record: scheduled programming
that reports the world's own state back to the people
in it — weather from the weather system, results from
the league, notices from the community — where the
medium's credibility comes from it never knowing more
than the systems beneath it. The kit taken: broadcast
as a *scheduled read* over named state inputs, with
content classes closed and each class's honesty rule
stated. No station names, programme formats, or
scripts are copied.

## Native spec — `mochiichao/broadcast/v1` (fragment beside this doc)

- **The broadcast record:** `{broadcastId, channelId
  (#90 grid ref), blockRef (#90 block), schedule,
  contentClass, stateInputs[]}`. `stateInputs` are
  inherited from the block — a record may narrow them,
  never widen them (#90's law: a broadcast with no
  state input is authored script, and must be labelled
  as such wherever it is listed). `schedule` is a
  cadence over #19 phases resolved through #124's
  rotation derivation: **airing is derived at read
  time** — nothing stores "on air now," and the media
  can never announce a broadcast the derivation
  wouldn't activate (one function, two readers — #124's
  discipline applied to programmes).
- **Content classes (closed):**
  - `weather` — reads #61's producer output as filtered
    by #142's climate: **reports of the effective
    state**, in the region's own terms.
  - `phenomena` — reads #153's records: condition
    windows for catalogued phenomena and witness
    reports after the fact.
  - `league` — reads #143's league instances and the
    result facts of #151/#100: coverage *of records* —
    a broadcast may report a fixture that happened; it
    may not invent one that didn't.
  - `forest_bulletin` — reads #163's sealing behaviour
    and #84's ecology: **TRACE-class content only**
    (sign | effect | absence — never a location, never
    a withheld species).
  - `community` — #90's `schedule_notice` generator:
    who is where, gatherings, #164's board postings —
    the town talking to itself.
  - `deeds` — #90's `event_echo`: the world reporting
    the Ranger's own deeds back, from #12 facts.
- **The forecast rule — a registered clarification.**
  #142's law is verbatim binding on this system: media
  "may only report the *effective* state — no
  forecasting fiction the system can't back." So the
  `weather` class carries a forecast **only** where
  the underlying machinery is deterministic and the
  forecast is a projection of that derivation — #124
  rotation fixtures, #153 phenomenon condition windows
  — and then it is presented as a projection, in those
  terms. A forecast of #61's producer output where the
  producer is not deterministic is fiction this format
  refuses: **the record has no field for it.** (This
  package's commissioning brief said "weather
  forecasts"; they survive only in the derived sense
  above — the discrepancy is registered in STAGING,
  not smoothed over.)
- **Forest bulletins under the Leak rule.** A
  `forest_bulletin` may carry TRACE-class content and
  nothing else. The depths contribute *absence* (#84:
  the depths table is empty by design) — and a bulletin
  "about" the depths can only ever be an authored beat,
  never a generator output, because the depths have no
  state inputs to generate from. What stopped moving is
  not a content class.
- **The voice law, broadcast form.** Broadcasts are
  human speech and world sound. A creature's cry may
  appear as *recorded sound* inside a report-class item
  exactly as it sounds in the field (#84's placed
  cries) — **a cry is never broadcast as speech**: no
  translated cries, no creature interviews, no
  verbalisation. (#81's no-verbalisation ruling governs
  the device; the same discipline binds the media —
  the world's creatures do not talk on the radio
  either.)
- **Show-lane mirror.** A broadcast the cast can hear
  is story texture: a radio in a room is a set, a sound
  cue, a character beat — episodes treat heard
  broadcasts as authored content under the subtitle law
  (rationed to important moments), and a broadcast
  never delivers exposition the Leak rule would bar
  from a screen (#149's discipline applies to any
  screen the broadcast appears on).

## Open slots (nothing invented)

Every channel, programme, and media personality
(inherited #90 — none canon; the device fiction itself
is OPEN there) · every block schedule (they wait on
#124's calendar, itself OPEN) · whether `league`
coverage has anything to cover beyond Region 1's
circuit (Regions 2–5 league records are null, #143) ·
the bulletin voice/register per place (community
content is authored work, not format).
