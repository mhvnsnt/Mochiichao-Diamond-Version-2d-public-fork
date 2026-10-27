# Mochiichao music system — plan §5

Status 2026-10-25: **system code 100% (engine + registry + validator + this doc),
tracks composed 0/37 = 0%**. The registry is a plan + a runtime contract, not
a soundtrack yet. No audio file ships in this PR, on purpose: a missing file
must never be mistaken for a finished track.

## What landed

- `public/audio/music/music.json` — the registry (plan §5d, the web
  equivalent of GBA `song_table.inc`). 37 entries: the plan's 35 table rows,
  with row 5 (`town_a` / `town_b` / `town_c`) expanded to 3 entries, so 37
  sits inside the plan's 35–45 range. 31 loops, 4 jingles, 2 one-shots.
  ~28 unique compositions: variants (night / winter / seasonal) and the
  credits medley re-use compositions, they are not new compositions.
- `src/lib/musicSystem.ts` — Web Audio engine, zero new dependencies.
- `tools/validate_music_registry.py` — offline registry gate (also mirrored
  at runtime by `validateMusicRegistry()` in `musicSystem.ts`).

## Registry fields (every entry)

`id`, `file` (planned OGG under `audio/music/<id>/`), `intro` (= loopStart),
`loopStart`, `loopEnd`, `bpm`, `key`, `stems`, `variants`, `bus` (`bgm`),
`priority` (0 music, 2 jingle interrupts), `duckOn`, `status`
(`planned` / `draft` / `composed`), `placeholder`, `wired`, `mvp`,
`compositionNote`, `draftFiles`, `licence`, `credits`.

Rules the validator enforces:

- Loops: `0 <= loopStart < loopEnd`, loop section a whole bar count at the
  track bpm, file + stems `.ogg` only. MP3 encoder padding creates an
  audible loop gap even with Web Audio loop points — MP3 loops are rejected.
- Non-loops (jingles, one-shots): `loopStart`/`loopEnd` null.
- `placeholder:true` until a real composed file exists; `wired:true` only
  after a wiring PR actually calls the track. A placeholder can never be wired.
- bpm/key are **composition targets** until a track is composed, then they
  become measured values from the rendered audio.
- One folder per track (`audio/music/<id>/`), stems as separate OGGs, a
  `credits.json` per track is owed at composition time (composer, licence,
  source) — the registry's `credits` field is null until then.

## MVP order first (10 entries, all defined, 0 composed)

In composition order: `title` (DRAFT slot, see below), `menu`,
`home_town`, `route_day`, `cave`, `wild_battle`, `trainer_battle`,
`gym_battle`, `victory`, `defeat`. Next in order after MVP: towns
(`town_a/b/c`, `city`), dungeons (`dungeon`), rival/team (`rival_battle`,
`team_battle`), elite/champion/legendary (`elite_battle`,
`champion_battle`, `legendary_battle`), events (`event_mystery`,
`event_sad`, `event_celebration`), ending/credits (`ending`, `credits`).

## Engine behaviour (`src/lib/musicSystem.ts`)

- **Buses** (GBA player idea): `bgm` (ducked by battle/jingles), `sfx`
  (UI, battle hits, cries — never ducked by music ducking), `ambience`
  (weather/wind/water loops, per-map), `voice` (reserved, no assets).
  Master + per-bus volume via `setVolumes()`; the settings UI itself is
  owned by open PR #73 and is NOT touched here.
- **Gapless loops**: `AudioBufferSourceNode` with `loop=true`,
  `loopStart`/`loopEnd`. Intro plays once (0 → loopEnd), then the loop
  section repeats forever.
- **Vertical layering**: stems start at the same context time with
  per-stem gains. Canonical map: exploration = bass + harmony; moving =
  + drums (BW tambourine/snare idea); danger/boss = + brass/percussion;
  low HP = + pinch stem (subtler than BW's full theme replacement);
  final phase = + crowd/chant stem. When stems load they ARE the track;
  the mix file is only the fallback for stem-less tracks and simple players
  (playing both would double the exploration stems).
- **Horizontal switching**: loops switch at the next bar boundary
  (`nextBarTime`, from bpm), with a 0.5–2 s crossfade (default 1 s).
  Jingles/stingers interrupt immediately — they are designed to interrupt.
- **Parameters** (FMOD/Wwise idea, in plain JS): `intensity` (battle HP /
  turn / boss phase → stem gains), moving vs idle, `timeOfDay`, `season`,
  `weather`, `proximity` (nearby NPC musician volume by distance).
  No middleware is needed for a web game.
- **Cries**: `playCry(buffer, speciesId)` on the sfx bus, deterministic
  ±5% playback-rate / ±50-cent detune variation from a species-id hash.
  The caller supplies an original Mochiichao cry buffer. No Pokemon cry
  exists in this repo's game audio and none is used.
- **Autoplay**: the context is created lazily and resumed only from a
  user gesture; the engine never fabricates one. The game shell owns the
  first gesture (boot / press-start flow, owned by PR #79 / #75).

## Title / intro — DRAFT slots, not wired

The registry lists `title` and `intro` with `status: "draft"`,
`placeholder: true`, `wired: false`, and names their existing v1/v2/v3
WAVs under `draftFiles` for reference only. Nothing in this PR plays those
WAVs as final title/intro music. Title Music lane owns approval of a
version; a later PR flips the slot to `composed` + `wired` only after that
approval. Note for that lane: main's `docs/title-music-status.md` and
`docs/title-music-v3-spec.md` call v3 "official" (Mars: "those are awesome"),
while the same status doc also says nothing is wired as final until Mars
approves after listening — this registry follows the stricter reading
(draft until the wiring approval lands) so no lane can accidentally ship
v3 as final on the back of this PR.

## Deliberately NOT in this PR (deconfliction)

- No file-path collision with open PR #88 (`feature/music-wiring-main-menu`),
  which adds its own `src/lib/music.ts` (HTMLAudioElement wiring for
  official title/intro + main-menu v1). This PR's engine is therefore
  named `src/lib/musicSystem.ts`, not `music.ts`, so both can coexist and
  the coordinator can reconcile the two modules after #88 settles.
  This PR's stance on title/intro (DRAFT slots, not wired) differs from
  #88's (wires v3 as official) — that is a Mars/Title-Music-lane decision,
  not something this PR resolves by overwriting #88.
- No wiring into `App.tsx`, `IntroSequence.tsx`, `BattleView.tsx`,
  `SettingsScreen.tsx`, `WorldEngine.tsx`, or `gameStore.ts` — those files
  are touched by open PRs #79, #75, #73, #61. A single wiring PR after
  those merge should call `musicEngine.playTrack()` from one place.
- No change to `package.json` / lockfile. Main has neither Howler nor
  Tone; Tone is proposed only in open PR #61's adapter, which this module
  does not duplicate. Howler (MIT, re-checked 2026-10-25) remains the
  approved simple-playback option if a future PR wants it, but raw Web
  Audio already covers playback + stems here, so no dependency was added.
- No BOOT / PRESS-START changes. Those roles are settled (BOOT = Option B,
  PRESS-START = M3) and owned by PR #79 / #75.
- No FMOD/Wwise runtime. Design reference only; neither has a web runtime.
- No paid/proprietary runtime, no ROMs, no Pokemon music/melodies/cries.

## Soundtrack plan — composition briefs

Compose in LMMS / Ardour / OpenMPT / FamiStudio (all $0, see plan §5b),
render stems per track, export gapless OGG loops with intro + loop section
at a bar boundary, verify by listening to 3 consecutive loops. Title motif
recurs in `ending` and `champion_battle`; `credits` is a medley re-using
town + battle stems, not a from-scratch composition.

Licence order for any adopted (not composed) material, re-check at download:

- **CC0 first.** Tallbeard Studios loop bundle: licence page states CC-0
  (re-checked via its itch page text 2026-10-25; credit "Abstraction" is
  requested but not required, and is given anyway if used). Any CC0 track
  used must be re-arranged into this soundtrack (tempo/key, shared bank,
  motif) — a verbatim CC0 loop is a placeholder, labelled as such, not a
  final track.
- **hyperpixel, Quillbit, Vacuous: NOT verified in this run.** Do not use
  any of them until their exact pack page / licence file is re-checked at
  download; Quillbit/Vacuous only WITH credit even if their page allows
  more, per the task order.
- **AI music: drafts only, labelled.** No raw AI output is shipped as
  licence-clean; a human composer re-records / re-arranges any AI draft
  and the human version is canonical (plan §5b).
- **Never:** Pokemon melodies, cries, samples, or direct_sound_samples;
  BRIA RMBG-2.0 output for commercial use (CC BY-NC); any pack whose
  licence file was not read at download time.

## What remains owed

- Tracks composed: 0/37 = 0% (MVP 0/10 = 0%). Composition is the whole
  remaining soundtrack job; the system to play it is done.
- Per-track `credits.json` at composition time: 0/37.
- Wiring PR (after #79/#75/#73/#61 settle): call `playTrack()` from map /
  battle / menu transitions, wire bus volumes to settings, add the
  procedural ambience layer for caves/forests/gardens (Tone-style
  chord-pad + pentatonic generator seeded by map id, ambience bus only —
  composed tracks carry towns/battles/story).
- Day/night + season variant renders: variants are registry entries, not
  audio yet (route night, city night, mountain winter, celebration
  seasonal). They are the same composition, different stems/mix — compose
  once, render twice.
