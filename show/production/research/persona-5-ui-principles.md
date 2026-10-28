# Persona 5 UI principles — distilled for Mochiichao's own UI work

**What this is:** design *principles* for Mochiichao's menus and UI,
derived from Atlus's own public CEDEC + KYUSHU 2017 talk by UI
designer Masayoshi Suto and producer Kazuhisa Wada (reported by
Persona Central / Siliconera / Famitsu; see persona-5.md for the
full sourcing). Written in our own words for our own game and show.
**No Atlus assets, fonts, art, logos or files are used** — only the
method transfers.

## The principles

1. **One dominant colour first.** Decide the single brand colour
   before anything else; build the palette as that colour + black +
   white. Reserve any accent strictly for vital information (the
   way HP/MP were the only exceptions). If everything is colourful,
   nothing is the brand.
   → *Mochiichao application:* pick the show/game's one colour and
   let every menu, title card and HUD speak it.

2. **Logo → font → UI are one package.** The title logo, the key
   font and the interface are designed together, in that order,
   because the UI *is* the product's branding — players spend much
   of their time in menus, so the interface is part of the game, not
   a wrapper around it.

3. **Guide the eye with a line, not with colour.** A single strong
   axis — Atlus used a **central white gaze line** — gives the eye a
   reference path through the screen, so hierarchy survives even in
   a one-colour design. When the player moves down a menu hierarchy,
   shift the layout/angle deliberately so they always know where
   they are.

4. **Lighting = priority hierarchy.** Brightness is information:
   light the high-priority area, dim the low-priority area, and keep
   the relevant content on the mainly-white side. Players read
   brightness faster than labels.

5. **Menus are a character performance.** The menu screen is a
   stage: a posed character sells the fantasy. Atlus's method —
   layout first (2D), pose a 3D model for the motion, then cut the
   final 2D illustration to match the chosen pose.
   → *Mochiichao application:* menu/title screens where a species
   (Mochii, Dorowani…) performs the menu — posed from the game's own
   art, animated with the show pipeline. Same asset, game + show.

6. **Build UI as vector/path data.** Resolution-independent vectors
   scale across devices and animate cleanly. Layouts in
   Photoshop/Illustrator, motion design in After Effects, then
   vectors into the engine — not baked bitmaps.

7. **Separate designers for separate UI jobs.** Menu UI and battle
   UI had different designers at Atlus, with specs handed to
   dedicated programmers and **frame-by-frame checks down to a
   single pixel**. Polish is a staffing decision, not an accident.

8. **Staff it senior, and expect iteration.** Atlus deliberately
   puts senior designers on UI because it's the cheapest audience-
   growth lever they found — and even their stylish result was
   "impossible to read at first" and needed extensive tweaking.
   Stylish-first, then readability-test, then fix. Budget for both
   passes.

## Checklist (per screen)
- [ ] One dominant colour; accents only on vital info
- [ ] A visible gaze axis/line the eye can follow
- [ ] Priority readable from brightness alone
- [ ] Character performance present where the fantasy matters
- [ ] Vectors, not bitmaps — scales and animates clean
- [ ] Readability pass AFTER the style pass, by someone senior
