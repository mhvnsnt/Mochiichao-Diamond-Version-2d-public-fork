# Main Menu NEED list — 100% order, fastest first (Mars, 2026-10-25 17:28 CDT)
Goal: finish every NEED, in this order, so we can move to the
next menu/screen. "Done" here = asset/spec made in this lane.
Game wiring (main lane) is a separate step and is NOT claimed done
until it is on Pages and playtested. Nothing is skipped to go faster.

## FASTEST FIRST — done as assets today (17:28 CDT)
1. Styled footer — © 2026 MOCHII STUDIOS
   Asset: footer-mochii-studios.png (900x60, transparent)
   Placement: bottom of main menu, below BACK TO TITLE, centred.
   Status: ASSET DONE, wiring NEED.
2. Styled back-to-title / help line
   Asset: help-line-back-to-title.png (1200x60)
   Pokemon base: option help bar 30x2, "PICK / SWITCH / CANCEL"
   Mochiichao: "A: SELECT  LEFT/RIGHT: CHANGE  B: BACK TO TITLE"
   Status: ASSET DONE, wiring NEED.
3. Styled DIAMOND VERSION subtitle
   Asset: diamond-version-subtitle.png (900x120, transparent)
   Y2K rule: version word below logo, cleaner bold font, pink
   outline, white fill. Placement: directly below logo, above arcs.
   Font note: DejaVu Bold used for this draft asset only;
   Phase 2 font row will swap in the OFL lookalike (Bungee/Titan
   One/Fredoka) — asset is a placeholder for the final font, not
   a final font decision.
   Status: ASSET DONE, final font NEED (Phase 2).
4. Cursor / selected highlight art
   Asset: cursor-selected-highlight.png (120x120, transparent)
   Gold ► + glow ring, Y2K highlight.
   Status: ASSET DONE, wiring NEED.
5. Y2K glossy menu window frames
   Assets: panel-frame-y2k-pink/yellow/blue/green.png (600x140)
   Rounded 22, white border, gloss highlight top.
   Status: ASSET DONE, wiring NEED (9-slice in game, main lane).
6. Background sparkles / stars / orbit matching logo
   Asset: sparkles-stars-orbit-layer.png (1200x1500, transparent)
   Gold/pink/blue/white 4-point stars + blue + pink orbit ellipses,
   same orbit as logo.
   Status: ASSET DONE, wiring NEED.

## MEDIUM — next, not blocked
7. Mascot / creature art placement behind logo
   HAVE: Mochii cutout (cutouts/mochii-front-cut.png), used by
   CONTINUE in v32. NEED: a version placed BEHIND the logo
   (not by CONTINUE), sized to logo, with orbit/stars behind it.
   Next step: composite test with Mochii behind logo, Mars eye-check.
   Status: NEED, unblocked, next after 1-6.
8. Menu Creator / UI Creator / Layout Editor wiring in game
   HAVE: full specs (settings-menu-creator-spec.md v2 + appendices),
   mocks, element index, frame/font/option rows.
   NEED: main lane to wire Settings -> Menu Creator -> UI Creator
   / Layout Editor as full screens, with presets + Reset to v32.
   Status: SPEC DONE, CODE NEED (main lane).

## SLOWER / BLOCKED — still 100%, do not skip
9. Clean player portrait inside CONTINUE
   BLOCKED on Human Characters lane: needs a transparent cutout
   of Player A (or Player D, Mars's pick) — in-game player is
   currently in a small white-background box, atlas 100% opaque,
   no chroma-key hack allowed. Human lane must re-cut transparent.
   Status: BLOCKED, not forgotten. Workaround until then: CONTINUE
   keeps text-only sublabel "Last: Core Fragment", no white box.
10. Title background scene art
    HARDEST. No original scene art exists yet in the repo for the
    title background. Options, in Pokemon-first order: (a) use
    v32 symbol layer + gradient as the background for now,
    (b) commission/generate original Mochiichao scene art in Y2K
    style, Mars eye-check, (c) Kenney CC0 scene pieces as a base,
    reskinned. Do NOT use Pokemon scene art.
    Status: NEED, longest. This is the last main-menu item before
    "main menu 100%" can be claimed, and it must not be faked
    with a v32 composite and called scene art.

## After main menu 100% — next menu/screen, in order
11. Real Settings screen (Pokemon options layout, full screen)
12. Prof. Aeon intro screen (FireRed oak_speech structure, Mochiichao words)
13. Pause Menu (FireRed start_menu order, Mochiichao slots)
14. Battle screen UI (healthboxes, 2x2, message window — already
    partially wired, needs UI Creator rows applied)
15. Routes / towns / dojos, one at a time, FireRed first.

## What "100%" means here
Every item above is either ASSET DONE, SPEC DONE, or explicitly
BLOCKED with a named blocker — none are silently dropped, none
are claimed wired until they are on Pages and playtested.
