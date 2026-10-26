# UI Art boot sound options A/B/C — saved, roles settled, NOT wired

Original synthesized WAVs from the UI Art lane (2026-10-25, Python `wave`,
44.1 kHz mono — NOT Pokemon/Nintendo audio, NOT Pokemon notes).

- Option A — two-note chime, 1.55 s:
  `public/audio/mochiichao-boot-ui-art-option-a-two-note-chime.wav`
- Option B — rising arpeggio, about 1.95 s:
  `public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav`
- Option C — melodic logo, 2.30 s:
  `public/audio/mochiichao-boot-ui-art-option-c-melodic-logo.wav`

ROLES — SETTLED BY MARS (2026-10-25, 20:35 CDT):
- BOOT SOUND = UI Art Option B, rising arpeggio
  (`public/audio/mochiichao-boot-ui-art-option-b-rising-arpeggio.wav`).
- PRESS-START SOUND = M3 "Mochii Chirp"
  (`public/audio/mochiichao-boot-M3-mochii-chirp.wav`, already on main
  via PR #36).
- M3 is the PRESS-START sound, NOT the boot sound.
- Options A and C are saved options, not assigned a role in this PR.

STATUS — READ FIRST:
- This PR SAVES the three UI Art option files and records the roles
  above. It does NOT wire any sound into game code. No game code file
  is changed in this PR.
- Wiring B as the boot sound and M3 as the press-start sound is a
  separate later step, after this PR.
- M1 Data Spark and M2 Harbour Bell are untouched by this PR.
- Earlier wording that called M3 the boot chime is superseded by the
  20:35 CDT decision above and must not be used.
