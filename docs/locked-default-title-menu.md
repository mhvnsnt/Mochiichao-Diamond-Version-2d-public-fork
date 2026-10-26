# Locked default: title + main menu (restoration, 2026-10-26)

Mars approved this restoration 2026-10-26 06:35 CDT ("Revert preset
playback to my locked default"), corrected 06:41 CDT (logo is never
font text), and scope-narrowed 06:47 CDT (UI Art lane's part only).
This note exists so a later lane does not re-break the default by
re-wiring a player into it.

## The default path (IntroSequence.tsx, BOOT -> INTRO -> TITLE -> MAIN_MENU)

- BOOT: untouched. Heavensent Studios card, Option B rising
  arpeggio, any key to skip. Boot audio lives in `bootAudio.ts`.
- INTRO: restored locked path, 4 text scenes (studio / world
  close-up / world pan + creature close-ups / creature fight beat).
  Any key or tap steps to the next scene, then TITLE. The intro
  music footer is corrected: PR #104 wires the official intro
  track by phase, so no "Music: GAP" label appears on this path.
- TITLE: locked phi stage (`LockedStage`, 1200x1500, resize-aware
  scale recomputed on every host resize, never frozen at init).
  Logo = Mars's uploaded logo PNG
  (`src/assets/ui/mochiichao-main-logo.png`: black-space-only
  crop 107,785,871,1235 of `ui-art/mochiichao-main-logo-official.png`,
  transparent key max-channel < 30 ramped to 60; original file
  untouched), 900 wide, centre (600,450). DIAMOND VERSION banner,
  pinned subtitle font, 556 wide, centre (600,735). PRESS ANY KEY
  at y927, blink 30 on / 15 off. Heavensent logo 556 wide, centre
  (600,1222). Ruby shine sweep kept (it already lived in the
  pre-#101 title code).
- MAIN MENU: locked v32 exactly
  (`ui-art/main-menu-default-locked-v32.md`): v32 background art
  (`main-menu-v32-background.png`), logo y180 w900, puffy-cloud
  SVG centre (600,738) 700x180, Mochii cue x170 y~790 w110,
  CONTINUE pink y788 h110 / NEW GAME yellow y918 h70 / SETTINGS
  blue y1008 h70 / BACK TO TITLE green y1098 h70. Panel labels
  follow MENU FONT; the logo is the image, never font text.
- MUSIC: PR #104 wiring kept on top (intro one-shot, title loop,
  main-menu loop; boot B + press-start M3 stay in `bootAudio.ts`).

## Presets, never default

`StartScreenPlayer` / `IntroVideoPlayer` and
`startScreenPlayback.ts` are PRESERVED (0 file deletions) as the
creator preset system: Start Screen Creator / Intro Video Creator
edit and save presets, and the players render them. No preset
plays as the default TITLE or INTRO phase. A future "set preset
as default" action would break this lock and needs Mars's own yes.

## Known conflict, reported not guessed

The pre-#101 DOM title also showed a featured-creature figure
(rotation + YogifernoTitleWalk / TitleCreatureFigure, which are
full TitleScene canvases). The locked phi spec has no figure slot
(press 927 to studio top 944 is a 17px gap), so no figure renders
on the default title. Figures are Title Creatures lane pieces
living in TitleScene/presets. If Mars wants the rotation figure
back on the default title, he says where it goes — no placement
was invented here.

## Phone fit, honestly

`LockedStage` scales by min(width/1200, height/1500) on every
resize, so on a ~390px phone the stage is 390 wide and the logo
cannot truncate. The background bleeds full-host so taller
screens do not show empty black bars around the poster. A real
390x844 phone check has NEVER been done by any browser run in
this project; the final phone check is Mars on the live build,
not a claim in this note.
