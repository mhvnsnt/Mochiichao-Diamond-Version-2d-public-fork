# #81 — DEVICE-PERSONALITY SYSTEMS → MOCHIIOTECA DEVICE BEHAVIOUR SPEC

**What was studied.** Dex-devices that behave like *characters*:
the publicly documented extreme is the Rotom Dex (a device
inhabited by a creature — it talks, jokes, emotes on its screen,
and its personality *is* the UI's voice) and, at the restrained
end, devices whose "personality" is only feedback grammar: boot
and scan flourishes, state-coloured lights, sounds that differ by
discovery state, a camera that frames finds for you. The teardown
finding: device personality is a **behaviour layer over the same
data states** — the device has no knowledge the registry doesn't;
what it adds is *timing, emphasis and face*: when it wakes, what it
draws attention to, how it celebrates, when it stays quiet.

**Canon ground.** The device is the **Mochiioteca** (name canon —
held in MochiiMindService; never "Codex"/"Mochiidex"). Its
*function* is canon (creature records; discovery states unseen →
seen → kept with footprint/cry unlock rules per the dex registry);
its **physical design is an open owner decision**, and nothing in
canon gives it a voice or a resident creature. Two show laws bind
it hard: **creatures are pure cries and sounds only** (the device
is not a creature and must never become a loophole for creature
speech), and the **subtitle law** (silent-film rationing —
subtitles only at important moments). This spec therefore builds
personality from **behaviour and feedback grammar only**, and
leaves verbalisation as an explicit open decision.

## Native spec: `mochiichao/mochiioteca-device/v1`

### Behaviour states (the device's "moods" are UI states)

| state | trigger | behaviour |
|---|---|---|
| `dormant` | idle / in bag | dark screen, slow breathing light (light only — no sound) |
| `attend` | a wild Mochi is near (spawn-table proximity) | wakes, orients toward the creature's bearing; a soft attention chime — *sound, not speech* |
| `identify` | first meeting (state → seen) | scan flourish; silhouette card first, lifting as the registry's rules allow |
| `record` | state → kept | the record beat: portrait, dex text, footprint and cry unlock *staged in that order* (the completion loop's reveal order, #14) |
| `recall` | Ranger opens a known entry | quiet, fast, no flourish — familiarity is the personality |
| `celebrate` | completion milestones (#14 ladder) | the device's one big flourish register; rare by design |
| `hush` | Dark Forest depths / dread beats | **the device dims and does not chime.** Engineered absence applies to the device too: in the Forest it is a light turned low, never a commentator |

### Feedback grammar

- **Sound:** a small chime family (attend / record / error /
  celebrate), synthesised in the same house as species cries
  (Sideline D cry synth can render device chimes from parameter
  blocks — proposed wiring, values OPEN). No voice samples.
- **Light:** one signal light whose colour follows discovery state
  (unseen = dim, seen = pulse, kept = steady) — colour values come
  from the COLOR-SYSTEM identity palette, not new hues.
- **Screen face:** if the screen shows any face-like read, it is
  the *entry art itself* (silhouette → portrait) — the device has
  no mascot face of its own. A resident-creature fiction (Rotom-
  style) is **not adopted**: no canon supports it, and it would
  collide with the cries-only law in spirit.
- **Timing:** the device reacts *after* the creature, never before
  the Ranger has seen what it is reacting to — in show staging it
  is a reaction instrument (reaction close, then device), matching
  the showcase/battle phase grammar.

### Verbalisation — OPEN, with the options stated

Canon does not rule whether the Mochiioteca ever produces words.
The three coherent options, for the owner's decision:

1. **Never verbal** (this spec's default until ruled): text appears
   only as registry data on screen (dex text is *read*, not
   spoken); the device "speaks" in chimes and light only.
2. **Label-verbal:** the device renders species names and state
   words as on-screen text cards (diegetic UI, not subtitles) —
   still no voice.
3. **Voice-verbal:** a synthetic device voice — would need a
   casting/production decision and a subtitle-law carve-out.

Whichever is ruled, two constraints hold: the device never voices
*creatures* (no translated cries, ever), and its text never
carries secret-layer vocabulary (see #85: display layer only —
the device says "Iridescence", never "Mainframe").

## Wiring

- **Completion loop (#14):** `record`/`celebrate` consume the
  derived counts and registry rules (footprint kept-only, cry
  seen/kept) — the device is presentation over that data, exactly
  as MOCHIIOTECA-COMPLETION specifies.
- **Spawn tables (#7):** `attend` consumes proximity from the same
  encounter data the game rolls from; the show uses scripted
  `mark_seen` events (#12) for the same beats.
- **Wayfinding (#85):** the device is a signage surface — its map
  and direction UI follow the Iridescence wayfinding system.
- **Cry synth (species-systems):** proposed chime rendering; the
  device block in a scene's cue sheet is scored under SCORE-STATE
  like any other sound (audio-timing package) — and `hush` is
  SCORE-STATE: ABSENCE applied to the device.
- **Show staging:** device beats are written in scripts as
  VISUAL/SFX lines (house format), never DIALOGUE, until and
  unless option 3 is ruled.

## Open slots (not invented)

- **Physical design of the device** — standing owner decision
  (from the design brief's open list); this spec constrains
  behaviour only.
- Verbalisation option (1/2/3 above).
- Chime parameter values; signal-light palette slots (system
  named, hues from COLOR-SYSTEM when ruled).
- Whether the device has a name/personality *in fiction* beyond
  its product name — canon silent; default is no.
