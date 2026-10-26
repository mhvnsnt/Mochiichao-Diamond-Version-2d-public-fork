# VFX + AUDIO HOOKUP GAP CLOSURE (item (12), 2026-10-25)

Added scope (Mars consolidated owed list 2026-10-25 ~21:48 CDT): close the
VFX + audio hookup gaps per the research-sweep wiring targets, after
FIRST verifying whether PR #28's Title/Press/Settings wiring created a
real Settings screen. The verification record is
`sprite-art/qa/SETTINGS-VERIFICATION-PR28.md`; the summary is here.

## 1. Settings screen: gap CLOSED (verified in main code, not assumed)

PR #28 "Title / Press / Settings wiring in game code" — state closed,
merged 2026-10-25T23:42:25Z, head feature/title-press-settings-wiring-1.
It ADDED `src/components/game/SettingsScreen.tsx` (348 lines at merge;
503 lines on main now after later lanes' expansions) and
`src/lib/gameSettings.ts` (251 lines at merge). The screen is a real full
screen (FireRed option-menu structure: header/list/help bar, label left /
value right, UP/DOWN wraps, LEFT/RIGHT cycles, CANCEL saves + exits),
persisted two ways (zustand game state + localStorage), with TEXT SPEED,
BATTLE SCENE, BATTLE STYLE, SOUND, BUTTON MODE, FRAME, CANCEL.

So "audio wiring was 0/6 steps with a Settings gap" is OUTDATED for the
Settings part: the screen exists. What was still open, stated in the
screen's own code (SettingsScreen.tsx SOUND row note: "stored flag only
— no audio engine in this build yet to route mono/stereo"), was the
audio ENGINE end — closed by §3 below as a module, with the one-call
wiring into the game shell still owed (stated, not claimed).

## 2. Per-archetype / per-element frame-0 VFX + SFX: CLOSED as data

File: `frame0VfxSfx.js` (+ test, 10/10 checks with the manager tests).
Frame 0 = TELEGRAPH start, t = 0 ms, the first treatments timeline phase.
2 archetype kinds x 12 True Elements = 24 combos, all resolving:

- melee: charge glow ON the attacker at frame 0.
- projectile: muzzle glow at the attacker's launch point at frame 0.
- Family shape/colours/flash tint come from `elementImpactVfx.js`;
  SFX key `telegraph_<element>` + impact key `impact_<element>`.
- Multi-hit: frame 0 repeats once per sub-hit (subHitIndex/total).
- Unknown kind/element throws — no silent default.

## 3. Web Audio manager: CLOSED as a module (in-game wiring still owed)

File: `webAudioManager.js` (+ test). It is the manager, not the wiring:
BattleView / the game shell adopts it; this file touches no component.

- Routes the Settings SOUND flag: MONO -> pan 0 both sides; STEREO ->
  player -0.4 / foe +0.4.
- Cry plans from `creatureCries.js` specs (original synth only).
- Impact plans from `elementImpactVfx.js` families + `battleTreatments.js`
  SEVERITY counts (not re-declared).
- Loop registry starts EMPTY (matching `battleMusicCues.js` null file
  slots). Licence gate enforced in code: CC0 needs no credit;
  credit-required without its exact credit string THROWS on registration;
  a loop without a licence throws; an unregistered loop plays its named
  synth fallback, so the game never goes silent.
- OWED, stated plainly: the game shell passing its stored SOUND setting
  into `createManager()` and calling the play methods from BattleView.
  That one call is wiring-lane work; this batch does not claim BattleView
  plays these sounds yet.

## 4. CC0 loops licence re-check: RECORDED, nothing to re-check yet

- Battle loops: NOTHING has been downloaded. All `battleMusicCues.js`
  file slots are null, and the manager registry starts empty. There is
  no CC0 loop whose licence needs re-checking, and no credit-required
  track in use for battle — the re-check obligation is recorded here
  and triggers the moment a loop is registered (see §3 gate).
- `public/audio/` WAVs on main (title/intro v1-v3, boot options): per
  `docs/title-music-status.md` (Title Music lane, on main), these are
  lane-generated original tracks, NOT CC0 downloads and NOT
  credit-required packs. Chosen slots: BOOT = UI Art Option B "rising
  arpeggio"; PRESS-START = M3 "Mochii Chirp". Title/intro v2 are LOCKED
  DRAFTS, v3 awaits Mars's listen + approval, and nothing there is
  wired as final until Mars approves after listening. Battle music is
  a separate slot from title/intro and is NOT wired from those drafts.
- Credit-required material rule, unchanged: usable ONLY with its exact
  credit string on the credits screen (enforced by the manager gate).

## What is NOT claimed

- BattleView does not yet call this manager (wiring owed, §3).
- No battle loop file has been downloaded or registered (slots null).
- Title/intro v3 approval is Mars's listen decision, not this batch's.
