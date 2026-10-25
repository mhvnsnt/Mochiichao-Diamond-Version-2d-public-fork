# POKEMON-FIRST RULE — standing, Mars, 2026-10-25 17:14 CDT
Applies to EVERY lane, EVERY agent, EVERY request, forever, until
Mars himself changes it in his own words.

1. Build from the real game files FIRST.
   Before making anything new, open the decomp files already in the
   repo (FireRed first, then HeartGold, then Black 2, in that order),
   find how Pokemon actually set that screen/system up — its
   structure, order, windows, inputs, and values — and write that
   down: Pokemon element -> Mochiichao replacement in that exact
   spot -> HAVE / NEED TO MAKE.
2. THEN build what Mars asked for ON TOP of that structure.
   Mochiichao words, names, art, and colors go into Pokemon's slots.
   No new structure invented outside that flow.
3. NO hand-tooled inventions outside the flow. No terminal menus,
   no overlay popups, no little terminal-style panels, no new UI
   patterns that Pokemon did not use for that screen, unless Mars
   explicitly asks for that exact pattern in his own words.
4. If the real files do not have a thing, say so plainly, show the
   closest real structure, and stop for Mars's call — do not guess
   a replacement and do not quietly invent one.
5. This rule overrides any agent default, any earlier draft, and
   any "faster / cheaper" shortcut. A shortcut that breaks the
   flow is not progress.

Violation example (2026-10-25): Settings > Menu Creator was first
mocked as a dark terminal-style overlay panel on top of the main
menu. That is NOT how Pokemon does settings. Corrected to a full
dedicated screen, see settings-menu-creator-spec.md v2.

## Amendment (2026-10-25 17:16 CDT, Mars, confirmed "Exactly")
- This applies to ANYTHING Mars asks for, not just menus.
- Sources, in order: (1) the game files we have (FireRed, then
  HeartGold, then Black 2 decomp files in the repo); (2) open
  source projects; (3) anything else we can find that is legal to
  use; (4) industry-standard and academic projects.
- Open source / industry / academic sources ADD TO the game-file
  structure, they do not replace it and they do not justify a
  hand-tooled terminal UI. No bullshit terminal UI, ever, unless
  Mars explicitly asks for that exact thing in his own words.
- Pokemon menus do NOT do popups like that. A menu is a dedicated
  full screen in Pokemon's flow, and Mochiichao menus follow that.

## Local-only test workflow (agreed 2026-10-25 17:23 CDT)
When Mars asks to put a proprietary-type item (dialogue, art,
exact code) in: do it LOCALLY ONLY, as a marked stand-in in the
exact slot, gitignored, never committed, never PR'd, and replace
it with the Mochiichao version BEFORE any push. Releasable build
= 0 such items. Do not copy the actual Pokemon file into the repo
as a shipped asset.

## Real Research rule (Mars, 2026-10-25 17:35 CDT)
Every turn, do REAL research and use it — do not do a cheap,
dumb, bullshit version. That means: check the actual game files
first, then open-source / industry / academic sources, golden
ratio, color theory, and the color/neurochemistry research already
in the repo (docs/research/color-neurochemistry-design.md), and
apply their numbers (phi lines, fade lengths, 60-30-10, pastel
proportions, red/orange <2%, twinkle 3-7s) — labelled as research,
not as lab-validated thresholds where the research does not
validate them. If a turn has no research behind it, say so and
do the research before presenting it as done.

## Always work from this, unless Mars says otherwise (2026-10-25 17:41 CDT)
- Always work from golden ratio / real research placement and
  scaling, like the DIAMOND VERSION subtitle phi placement
  (width = logo / phi, centre = logo centre * phi), unless Mars
  explicitly says otherwise for a specific item.
- That means: no eyeballed placements, no arbitrary sizes, when
  a phi / research calculation exists for that element. If Mars
  overrides it for an item, that override is logged for that item
  only, and the default returns to phi/research for the next item.
