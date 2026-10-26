# UI Art boot sound options A/B/C — saved as options, NOT wired

Original synthesized WAVs from the UI Art lane (2026-10-25, Python `wave`,
44.1 kHz mono — NOT Pokemon/Nintendo audio, NOT Pokemon notes).

- Option A — two-note chime, 1.55 s:
  `public/audio/mochiichao-boot-ui-art-option-a-two-note-chime.wav`
- Option B — rising arpeggio, about 1.95 s:
  `public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav`
- Option C — melodic logo, 2.30 s:
  `public/audio/mochiichao-boot-ui-art-option-c-melodic-logo.wav`

STATUS — READ FIRST:
- These three files are SAVED OPTIONS / DRAFTS ONLY.
- They are NOT wired into game code by this PR. No game code file is
  changed in this PR.
- They do NOT replace the already-picked boot chime: M3 "Mochii Chirp",
  `public/audio/mochiichao-boot-M3-mochii-chirp.wav` (PR #36), which
  remains the picked boot chime unless Mars later says otherwise.
- M1 Data Spark and M2 Harbour Bell are likewise untouched by this PR.
- Mars later said in the UI Art lane "I pick option b, save the other 2
  to the repo stil" — this PR saves all three as options and wires
  NONE of them, so that pick (B vs the already-picked M3) is left for
  Mars / the parent agent to resolve explicitly before any wiring step.
