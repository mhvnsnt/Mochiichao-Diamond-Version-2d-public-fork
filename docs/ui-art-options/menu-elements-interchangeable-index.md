# Main Menu Elements — Interchangeable Index (Mars, 2026-10-25 17:27 CDT)
Rule: NOTHING shown is thrown away. Every element from every
prototype draft becomes a selectable row/value in Menu Creator /
UI Creator / Layout Editor, so any element can be swapped back in
interchangeably. Locked v32 is the DEFAULT, not the only option.

## How interchange works
- Menu Creator row = pick an element. UI Creator row = pick how
  it looks. Layout Editor row = pick where/how big it is.
- LEFT/RIGHT cycles values, A opens the element page. Saving
  makes a preset. Only a new lock from Mars changes the default.
- Rejected-as-default does NOT mean deleted: v31, v22, v23, and
  the sparse flow demo are kept as options, labelled as such.

## Elements, source, and where they become a row
### LOGO
- Official chrome logo (Mars upload, black bg knocked out) — DEFAULT
  Row: Menu Creator / Logo Image = OFFICIAL
- Logo draft v1 — Row: Logo Image = V1 (mochiichao-logo-draft-v1.png)
- Logo draft v2 Y2K — Row: Logo Image = V2 (mochiichao-logo-y2k-v2.png)
- Logo draft v3 mixed Y2K — Row: Logo Image = V3 (mochiichao-logo-y2k-mixed-v3.png)
- Logo black backing (v16, dilated alpha) — Row: Outline Backing = BLACK
- Logo white orbit ellipse + sparkles — Row: Orbit Ring = ON

### BACKGROUND
- White background (v14 onward) — DEFAULT
  Row: Background = WHITE
- Blue gradient background (early prototype drafts, v12/v13 color
  panels) — Row: Background = BLUE GRADIENT
- Pink / yellow / blue / green panel colors (v3 colors, v13) —
  Row: Panel Colors = V3 / Y2K
- Blue circles + pink circles behind logo (v14/v15) —
  Row: Logo Circles = ON, colors BLUE / PINK
- Blue heart + pink heart (v14) — Row: Logo Hearts = ON
- Black sparkles / black stars around logo (v14-v16) —
  Row: Logo Stars = BLACK
- Rainbow semi-circles, pink/orange/yellow/green/blue/purple,
  rotated -90deg (v15-v17) — Row: Rainbow Arcs = ON, Rotation = -90
- Puffy cloud, real SVG (puffy-cloud.svg, v19-v24) —
  Row: Cloud = ON, Size 700x180, Position 600,738 (v21/v24)
  Also kept as options: cloud at logo centre 600,454 (v22),
  cloud on top of logo (v23) — labelled SUPERSEDED, still selectable
- Blue gradient panels / glossy Y2K panels (theme file) —
  Row: Panel Style = GLOSSY Y2K

### SYMBOLS / COVERAGE / FADE
- v26: 42 golden-angle symbols, solid colors —
  Row: Symbols = 42, Coverage = GOLDEN
- v27 research: 15 pastel symbols, bottom 75-85% blank, fade to
  white 20px above CONTINUE — Row: Symbols = 15 PASTEL, Coverage = RESEARCH
- v28: fill from half-CONTINUE down, 5% fade above CONTINUE —
  Row: Coverage = HALF-CONTINUE
- v29: full zone from y=1280, double 5% fade — Row: Coverage = BELOW-PANELS
- v30: full zone from y=905, fade 755-905 — Row: Coverage = 50%
- v31: full zone from y=723, fade 573-723, 61.8% — Row: Coverage = 61.8%
  Labelled REJECTED AS DEFAULT (too high, too much negative space),
  still selectable as an option
- v32 LOCKED DEFAULT: full zone 905-1500, fade 285, gone 620,
  golden line 729 — Row: Coverage = LOCKED V32

### ANIMATION (all kept, even superseded modes)
- Static v32 (no motion) — Row: Animation = STATIC
- Sine only (v32 sine-only GIF) — Row: Animation = SINE ONLY
- Flow only, sparse 36-symbol demo — Row: Animation = FLOW SPARSE
  Labelled SUPERSEDED (Mars rejected: too sparse, do not use as default)
- Combined rise+fade+sine, all 300 — Row: Animation = COMBINED
- Combined, matched speed (80x70ms, rise 5.5, sway 3, bob 2) —
  Row: Animation = MATCHED (Mars: "perfect", current approved mode)

### OTHER ELEMENTS
- Mochii cue by CONTINUE — Row: Mascot Cue = ON
- CONTINUE sublabel "Last: Core Fragment" — Row: Sublabel = ON
- Cursor ►, selected highlight — Row: Cursor = ►, Highlight = GOLD/TEAL
- 48 SVG cut-out UI pieces (PR #14, ui-art/assets/) —
  Row: UI Pieces = 48 SVG SET, mapped in ui-art-wiring.json

### STILL NEED (not yet made, do not pretend they exist)
- Title background scene art, styled DIAMOND VERSION subtitle,
  mascot art behind logo (beyond Mochii cue), PRESS ANY KEY as a
  game prompt — Row: NEED TO MAKE, per v12 nine-item list.
