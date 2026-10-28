# #33 — HUMAN CHARACTER SHEET SYSTEMS → human cast model-sheet standard

**What was studied.** The human-character sheet grammar of TV
animation production, publicly documented in settei/model-pack
practice (and in this project's own donor research): a human
sheet is a *production contract* — turnaround, head construction,
expression set, mouth set (humans talk — this is the sheet class
creatures never get), costume breakdown, palette, scale chart,
and prop interaction. Creature sheets answer "what is it";
human sheets answer "how does it act, speak, and stay on-model
across a hundred drawings."

## The standing distinction (house law, restated as spec)

Humans are a **separate production track** from creatures:
creatures are cries-only with expression *instruments*; humans
speak words, carry dialogue scenes, and need lip-sync-ready
mouth sets (Blair visemes — the rig-and-mouth-systems package
owns the format, `mochiichao-mouth-data/v1`). A human sheet
missing its mouth/expression sections is incomplete in a way a
creature sheet can never be, and vice versa: no human sheet
carries cry/silhouette/footprint sections. The two standards
share only the palette discipline and the gate (below).

## Canon anchors

- The cast: **Mochiko** (Assistant Mochiko, Aeon's lab; opens
  the Mochi Garden at R1-BEAT3), **Hex** (next-door neighbour
  and rival; Region 1 Champion), **Aeon** (lab head; gives the
  partner + the Mochiioteca). Roles are canon; **ages are
  unconfirmed** (the brief's open list carries Mochiko's age —
  OPEN, not filled here).
- Source material of record: repo `docs/human-characters/`
  (55 files incl. a STYLE-GUIDE and canon doc, per KIT-AUDIT).
  Likeness law applies in full: sheets build from the actual
  repo images, never from text invention.
- The pilot creature sheets' home is `show/production/
  model-sheets/`; human sheets land in the same folder under
  a `humans/` subfolder (STAGING.md) so one gate reviews both
  tracks without merging them.

## The standard — 9 required sections per human sheet

1. **Turnaround** — front/¾/side/back at locked proportions,
   head-count height stated (design-theory head-count discipline)
2. **Head & face construction** — the geometry under the face;
   eye construction in the family grammar (the Mochiichao Style
   Spec's eye rules apply to humans as cast, with human anatomy)
3. **Expression set** — the acting range the scripts use;
   extremes included, each labelled by story function
4. **Mouth set** — Blair viseme frames keyed to
   `mochiichao-mouth-data/v1` frame ids (rest=1 … W_Q=10),
   drawn for *this* face (never a donor character's mouth pack —
   rebuilt natively, per the materials-index rule)
5. **Hands set** — open/point/grip/prop-hold; humans handle the
   world's props (Mochiioteca first among them)
6. **Costume breakdown** — every worn item as its own flat
   shape; worn-item deformation follows the rig teardown's
   Shrinkwrap rule at rig time
7. **Palette** — four-slot discipline (Dominant/Support/
   Accent/Ink) sampled from the repo art; #a03436 stays
   reserved (alerts/Dorowani/Rule burn-in) unless a sheet's
   canon source already spends it
8. **Scale chart** — the human against the series' creature
   staging ladder (Palm/Knee/Waist/Tower) and against the
   other humans; one chart per cast member, same baselines
9. **Device/prop interaction** — Mochiioteca hold/present
   poses for anyone canon gives the device to (Mochiko, Hex,
   Aeon all qualify by role); the device's physical design is
   OPEN in canon, so this section ships as *pose slots* until
   the device is designed — flagged, not faked

**Gate**: human sheets pass the same Design Gate spine
(G-series where it applies — silhouette G-1, colour G-3/G-4,
wrong-note G-7, open-items G-12) plus two human-track checks:
**H-1** mouth set complete and keyed to the mouth-data format;
**H-2** expression range covers the character's scripted
registers on record (prosody sheets in VOICE-DESIGN are the
reference — face and voice are cast together).

## Coverage — honest

- **Grammar: fully documented** (settei/model-pack practice +
  this project's own rig/mouth/format packages).
- **Contents: this package writes the standard, not the
  sheets.** The three sheets themselves are production work
  from the repo's human-character art under the likeness law;
  ages, the device design, and voice casting stay OPEN where
  canon leaves them.
