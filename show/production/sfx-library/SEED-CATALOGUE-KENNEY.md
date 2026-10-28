# SFX LIBRARY — Kenney seed candidates (teardown #51 format)

Seed rows for `show/production/SFX-LIBRARY.md` (#51), in its §3
record format exactly. Pulled in 2026-10-28 by the free pull-in
programme. Audio lives beside this file under `audio/`.

**Status law honoured (§3):** every row below is `CANDIDATE`.
Sourcing a candidate does NOT close a GAP — only an approved take
becomes CANON. The door/creak candidates audition against the EP01
seed GAP rows `SFX-GATE-SHUT-01` and `SFX-GATE-CREAK-01` (§4);
the UI rows are first stock for the `UI-CARD` class (Mochiioteca /
card sounds, sparse by law). Rows for the remaining pack files are
born at first use (§3: "first use is the row's birth") — both packs
are staged whole under `audio/packs/` (see PACKS.md).

Licence for every row: **CC0** (open, public domain) — verified at
source 2026-10-28 three ways: the kenney.nl pack page's own
License field ("Creative Commons CC0"), the OpenGameArt page's
license-name field ("CC0"), and the `License.txt` inside each pack
(staged beside the audio). Author: Kenney Vleugels (kenney.nl).
No attribution required.

## MECHANISM candidates — Kenney RPG Audio

```
id            SFX-DOOR-CLOSE-01 … -04
layer         FOLEY
class         MECHANISM
status        CANDIDATE (auditions against seed GAP SFX-GATE-SHUT-01)
source_kind   library
source_ref    Kenney "RPG Audio" via OpenGameArt "50 RPG sound effects"
              (opengameart.org/content/50-rpg-sound-effects),
              RPGsounds_Kenney.zip → OGG/doorClose_{1..4}.ogg;
              licence CC0, verified 2026-10-28
used_in       []
gate          not yet gated — candidate (beds finish −14 LUFS at mix)
```
Files: `audio/kenney-rpg-audio/doorClose_1.ogg` … `doorClose_4.ogg`
(one row each: SFX-DOOR-CLOSE-01 = doorClose_1, -02 = _2, -03 = _3,
-04 = _4).

```
id            SFX-DOOR-OPEN-01 … -02
layer         FOLEY
class         MECHANISM
status        CANDIDATE (gate family; no EP01 seed row — general stock)
source_kind   library
source_ref    same pack/source as above, OGG/doorOpen_{1,2}.ogg; CC0, 2026-10-28
used_in       []
gate          not yet gated — candidate
```
Files: `audio/kenney-rpg-audio/doorOpen_1.ogg`, `doorOpen_2.ogg`.

```
id            SFX-CREAK-01 … -03
layer         FOLEY
class         MECHANISM
status        CANDIDATE (auditions against seed GAP SFX-GATE-CREAK-01,
              whose route asks for a 3-length pitch-matched family)
source_kind   library
source_ref    same pack/source as above, OGG/creak{1,2,3}.ogg; CC0, 2026-10-28
used_in       []
gate          not yet gated — candidate
```
Files: `audio/kenney-rpg-audio/creak1.ogg`, `creak2.ogg`, `creak3.ogg`.

## UI-CARD candidates — Kenney Interface Sounds

All rows: layer SPOT, class UI-CARD, status CANDIDATE,
source_kind library, source_ref: Kenney "Interface Sounds" via
OpenGameArt "Interface Sounds"
(opengameart.org/content/interface-sounds),
kenney_interfaceSounds.zip → Audio/<file>; licence CC0, verified
2026-10-28 (pack License.txt staged). used_in [], gate: not yet
gated — candidate.

| id | file |
|---|---|
| SFX-UI-CLICK-01 … -05 | `audio/kenney-interface-sounds/click_001.ogg` … `click_005.ogg` |
| SFX-UI-CONFIRM-01 … -04 | `audio/kenney-interface-sounds/confirmation_001.ogg` … `confirmation_004.ogg` |
| SFX-UI-OPEN-01 … -04 | `audio/kenney-interface-sounds/open_001.ogg` … `open_004.ogg` |
| SFX-UI-CLOSE-01 … -04 | `audio/kenney-interface-sounds/close_001.ogg` … `close_004.ogg` |
| SFX-UI-SELECT-01 … -04 | `audio/kenney-interface-sounds/select_001.ogg` … `select_004.ogg` |
