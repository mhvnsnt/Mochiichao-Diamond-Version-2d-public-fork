# Production research — Persona 5 (Atlus) — design + UI

Study layer for the Mochiichao show build (UI/menu design and
graphic style). Sources: the five-series production-research report
compiled 2026-10-27. Prices and dates are **as reported 2026-10-27**.
The transferable principles are distilled separately in
`persona-5-ui-principles.md` — **no Atlus assets, fonts, art or files
are used anywhere in this project**.

## Production method (the headline)
Persona 5 is a **video game, not a cartoon** — there are no cartoon
rigs. Its UI was built **in-engine** from Photoshop/Illustrator
layouts converted to **vector/path data**, with 3D character models
posed in a bespoke Atlus tool for menu/battle presentation and
dedicated UI programmers per area. **No official UI source files,
tools, fonts or model files exist publicly** — by design. (The TV
anime is a separate CloverWorks production; the game's animated
cutscenes were by Production I.G.)

## Published sources
| Source | Details (as reported 2026-10-27) |
|---|---|
| ★ *Persona 5 + Persona 5 Royal: Official Design Works* — UDON Entertainment (English), 19 Nov 2024 | Hardcover, 544 pp., ISBN 9781772943238. Character illustrations, promotional art, rough concepts, detailed creator commentary, interview with series artist Shigenori Soejima; covers P5 and Royal. |
| *The Art of Persona 5* — Prima Games, 2017 | 432 pp., ISBN 9780744017311. Character gallery, initial concepts/rough sketches/drafts, setting illustrations, story scenarios, Soejima commentary throughout. |
| *Shigenori Soejima & P-Studio Art Unit Art Works 2010–2017* — Kadokawa, 2018 | 208 pp., ISBN 9784047333109 (Japanese). Soejima/P-Studio art across Persona 5 and Catherine — the broader graphic-style evolution. |
| *Persona 5 the Animation Material Book* — PIE International | ISBN 9784756252128. For the CloverWorks TV anime: character profiles, props profiles, **background designs**, visual illustrations, exclusive director (Masashi Ishihama) interview. |

## The primary UI source — Atlus's own CEDEC talk
**"Panel on the Concept and Development Behind Persona 5's UI" —
CEDEC + KYUSHU 2017**, presented by art director/UI designer
**Masayoshi Suto** and producer **Kazuhisa Wada**, 28 Oct 2017.
Reported in detail in English by Persona Central and Siliconera
from Famitsu's coverage:
https://personacentral.com/persona-5-panel-concept-development-ui/
· https://www.siliconera.com/atlus-reveals-design-secrets-behind-persona-5s-distinctive-ui/

What Atlus described (the facts the principles doc is built from):
- Tools unchanged for years: **Photoshop, Illustrator, After
  Effects**. The UI's mission is information transmission **and**
  "creating the package for the title" — the UI *is* the branding.
- **Colour is decided first**, then the title logo, then the key
  font. P3 = blue, P4 = yellow, **P5 = red**; for P5 sub-colours were
  deliberately avoided (except HP/MP) so the dominant colour wins.
- Concept: "**pop punk**" — mass-oriented × anti-establishment.
- Readability without sub-colour is solved by **gaze engineering**: a
  white line drawn at the centre of the menu screen guides the eye;
  layouts/angles shift down a hierarchy to preserve positional
  awareness; **lighting encodes priority** — high-priority info is
  lit bright, low-priority dim; relevant info sits on the mainly-
  white side.
- The posing menu character: layout in Photoshop → a motion designer
  posed a **3D model in a bespoke tool** → the 2D illustration
  texture was cut to match the final pose (the hero's menu pose
  riffs on a paparazzi "don't take my picture!" moment).
- Implementation: UI converted to **vector/path data** to scale
  between PS3/PS4 and animate cleanly; **separate designers for menu
  UI and battle UI**; the battle designer passed specs to dedicated
  UI programmers and **checked every frame, adjusting by a single
  pixel**.
- Why the investment: from Persona 3, Atlus concluded distinctive
  UI/branding was the lowest-cost way to grow the audience; director
  Katsura Hashino stresses senior designers own UI, never juniors.
  Later, on *Metaphor: ReFantazio*, Hashino confirmed the method is
  bespoke per title — and that P5's angular text was "impossible to
  read at first" and needed extensive tweaking.

## Free / public study sources
- **Siliconera — "What Makes the UI and Menus in Persona Games So
  Good?"** — battle actions circle the active character like manga
  action bubbles; every submenu follows one aesthetic.
  https://www.siliconera.com/what-makes-the-ui-and-menus-in-persona-games-so-good/
- **"Visual Design of Games: Persona 5" — Mechanics of Magic**
  (Stanford course site), 23 Apr 2022 — structured analysis of the
  battle UI: typography/colour/contrast, alignment & proximity,
  core vs supportive vs extraneous elements.
  https://mechanicsofmagic.com/2022/04/23/visual-design-of-games-persona-5/
- **Independent UX write-ups** (exercises, not canon): a Medium
  interaction-design piece on cut-out typography, halftone
  silhouettes, pulsing motion and tooltip cueing; a 5-principles
  UI/UX critique series including readability criticisms.
- **Famitsu interview with art/audio leads** (via SEGAbits): art
  director Masayoshi Sudo on flat fills over gradations and GUI that
  stands out even in non-game magazines.

## Study route (from the report)
1. Read the CEDEC 2017 breakdown (Persona Central's full summary) —
   the free, primary UI source.
2. Apply `persona-5-ui-principles.md` to Mochiichao's own menus/UI.
3. *Official Design Works* (UDON, English) for Soejima's design
   process and commentary.
4. *The Art of Persona 5* (Prima) for concepts/roughs — and the
   Stanford analysis for a structured outside view of the battle UI.

**Bottom line (report): HIGH for design knowledge, ZERO for
legitimate source files (by design).** Arguably the best-documented
UI process of the five, because Atlus presented it at a developer
conference and the translation is free.
