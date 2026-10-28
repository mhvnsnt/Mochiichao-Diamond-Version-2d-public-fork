# EP01 "The Garden Has a Ghost" — v3 MASTER DELIVERY LEDGER

Status: FINISHED EPISODE, rig/puppet pipeline. quality_status: RIG PERFORMANCE
(TextRig whole-image deform rigs over canon art; generative avatar-stack clips
swap in later as current-version upgrades when the owner promotes them through
the likeness gate — PR #389 bundles are PENDING_GATE, none swapped in).

## Gate numbers (FINAL master, measured on the shipped file)
- Runtime: **1440.000s exactly** (24:00) — duration_matches_spec TRUE
- Integrated loudness: **-14.43 LUFS** (target -14, within ±1) ✓
- True peak: **-1.24 dBTP** (house ceiling ≤ -0.9) ✓
- Master: 189,596,484 bytes, md5 b4e9fec3a1f78dd7d04de0771b70c36d,
  sha256 37b9290d8ee315b7bea58629e2188f2732d2f23a086c60a8a088b719abf0962b
- FINISH CORRECTION (coordinator): episode_build.py's own finish landed at
  -18.49 LUFS / -1.04 dBTP — its peak pull-down (4.44 dB for a -0.55 source
  peak) dragged the programme 4.5 LU under target, and the tool reported the
  miss honestly (loudness_within_1LU: false; the as-built file + its report
  are preserved in the finish workspace). The shipped master keeps the tool's
  picture and scene assembly untouched and re-finishes ONLY the audio:
  loudnorm at target with a -3.5 dBTP ceiling pre-encode, so the AAC encode's
  measured overshoot lands at -1.24 dBTP post-encode with loudness -14.43.
  Two earlier iterations are documented in the finish workspace work logs
  (TP -1.00 WAV -> +0.21 post-encode; TP -2.30 WAV -> -0.43 post-encode).
- Per-cut ledger: renders/LEDGER.md — 110/110 shots OK (OP + V3-001..107 + ED + PREV),
  every duration ffprobe-verified against the script-exact spec durations.
- Audio beds: audio/BEDS.md — 20/20 beds, total exactly 1,440.0s.

## What the episode is
24:00 slot exactly: OP 60s + story 1,260s (107 cuts; the locked 28-cut v2 spine
sits verbatim at its beat-map placements with its gated audio beds) + ED 75s +
next-episode preview 45s. Five silent-film intertitles (V3-073 / V3-077 / V3-089 /
V3-100 / V3-106), Rule 12 in the owner's exact words over the Dark Forest still.
EP01 has NO human dialogue in the new cuts; the spine's Mochiko lines ride the
gated beds as VOICE-SCRATCH, as designed. Creatures: pure cries only (recorded
repo cries + cry-synth renders from species specs; see BEDS.md per-render table).

## Set pieces as scripted
- V3-039 FROST CLOSE-UP COLOUR SHIFT: push-in, world palette drains to indigo/
  violet for the hold (frost aura exposed, Kittember's tail-tip flame the only
  warm note), restore on pull-back. COORDINATOR CORRECTION: the first shipped
  background had no palette shift (measured green-dominant inside the hold);
  rebuilt with a verified hue+145 grade over the 3-13s window — frame means
  2s (108,168,113) -> 8s (112,94,152) -> 16s (108,168,106). See renders/LEDGER.md.
- V3-002 / V3-098: Hex cameo — one distant figure at the far fence, no line;
  gone again in the rhyme frame.
- V3-043: Aeon's single device ping — one clean dry 2093 Hz sine in the bed
  (untreated, once) + one warm-white icon flash at 7.0-7.45s in the graphic.
- V3-094: 16s held silence — crickets and night cycles only.
- Stinger (V3-104..107): the gated engineered-absence bed (-51.85 LUFS, exempt
  by design).

## Audio decisions of record
- scene_audio_bed.py loudnorm bug FIXED (analysis now runs at target settings;
  validated -13.77 LUFS / -0.98 dBTP) — fix is in the tooling folder + BEDS.md.
- F1 RESOLVED as decided: the shipped Scene 4 bed's events were timed to v1
  beats; in the v3 S4 bed they are re-placed at the v3 script's cue timings
  (Gabu lunge 24.0->15.0s, Kittember flare 34.0->25.0s, Sproutle gag 38.5->33.0s,
  Wispkin wail 45.0->52.0s). Full table in BEDS.md. The v3 S4 bed supersedes the
  audio-timing xsheet's Scene-4 anchors.
- S4/S5 boundary: cut 19's 10s segment rides at the end of the S4 bed (64-74s);
  S5 bed = gated Scene-5 bed minus its first 10s + 4.8s own-tail room-tone pad.
  Every timed cry/line event occurs exactly once, at v3 picture timing.
- N4 loudness defect found and closed: final bed -14.03 LUFS / -1.00 dBTP via
  two-pass loudnorm at target (see BEDS.md coordinator note).
- MUSIC SUBSTITUTION (honest): the title theme + mixer stems in the repo are
  7.26MB files; this VM's credential proxy truncates every transfer at
  ~5.6-5.8MB, so they are unfetchable from here. OP/ED/cues are built from the
  fetched in-repo title-family recordings (intro-v3, main-menu-v1, vocal-lead)
  + synthesis; "stem solo" directions are arrangement-style approximations.
  ACE-Step versions may supersede under the Current-Version Law.

## Laws applied (staging.json carries the full record)
- Mochiichao art style of record; FIGHT-READ + ANTI-PRESCHOOL tests applied to
  every new painted element (FX, props, cards, berry-store plate).
- Character size law: story 100% FULL-SIZE; chibi confined to card slots.
- EP01 slot verdict (chibi card system §7): OP/title no chibi; PREV is the
  designated chibi home (chibi-FRAMED, footage full-size); eyecatch V3-061 as
  scripted, no chibi variant; stinger never. ED carries ONE chibi credits-bit
  slot as an EMPTY marked placeholder — the gag itself is PENDING OWNER.
- Dorowani's eye-whites: kept individual trait of the show's Dorowani (Hex's
  partner), NOT corrected away, NOT extended to any other creature.
- No baked shadows: all character shadows are post/composite layers.
- Forest cycles OFF: the Dark Forest plate is a still in every appearance.

## Honest limits
- Pond / Green / Dark Forest plates and the berry-store interior are
  PROVISIONAL spec plates (flat cel renders from the still-to-build registry,
  marked CURRENT for provisional use). The Garden Gate is the only canon
  painted background. Canon plates supersede under the Current-Version Law.
- Mochiko's kneel (V3-053, V3-074) is a whole-image deform approximation —
  no pose library exists for her.
- Several creature action beats are closest-clip stagings from the rig sets
  (e.g. Gabu's lunge = jaw_chomp + canvas travel), per the v2 COVERAGE flags.
- Fonts: Bungee/Fredoka are not installed on this VM; cards are set in
  DejaVu Serif/Sans Bold. A font pass supersedes when the brand fonts land.

## Files
- Master: EP01-V3-MASTER.mp4 (TeraBox upload manifest — exceeds GitHub's
  100MB single-file cap; sha256 in STEMS-AND-MASTER-MANIFEST.md)
- Stems: 20 scene beds, 48kHz WAV (same manifest; 363MB total)
- In-repo with this ledger: build report JSON, render LEDGER, BEDS.md,
  staging.json, episode spec JSON, this ledger.

## Annotation (2026-10-27) — ED chibi credits-bit: format defined, instance 1 built

The laws-applied entry above records the ED chibi credits-bit slot as
PENDING OWNER; that was the as-shipped state, and the wording above stands
as the delivery record. The slot's state is now converted by annotation:
the owner defined the gag format on 2026-10-27 — "the chibi walk",
recorded in show/production/ED-GAG-FORMAT.md. EP01 instance 1
(EP01-ED-GAG-v1, 14.000s, built for this slot's 56-70s window; Mochiko
leading Mochii, Kittember, Sproutle and Wispkin — the episode's own cast)
is built and registered as an upgrade candidate. The shipped master is
NOT changed: it still carries the empty placeholder frame, and the
instance swaps in only on the owner's order (Current-Version Law).
