# 49 — SMEAR-FRAME GRAMMAR (the show's action language)

Teardown List 6, item 49. Native spec for the Mochiichao show.
Derived from publicly documented 2D-animation practice (smear frames,
multiples, and impact frames as taught in standard animation
literature and documented production commentary) — a grammar of
*techniques*, re-systematised for this show's pipeline. No show's
frames are reproduced.

Wires into: TIMING-SYSTEM.md (xsheet grammar, List 2 #16),
MOVE-ANIM-SCRIPT-FORMAT.md (List 2 #9), LIGHTING-SYSTEM.md §5
(takeover sources), the G-series design gate.

---

## 1. Teardown — what smears and multiples actually are

- **Smear frame:** one drawing that stretches a fast-moving form
  along its motion path — the blur a camera would record, drawn.
  Used on the fastest 1–3 frames of a move; the form's silhouette
  deforms but its *volume anchors* (head, signature motif) survive
  inside the stretch.
- **Multiples:** the same form drawn 2–4 times in one frame at
  successive path positions (limbs especially — three arms on one
  swing). Reads as speed without deforming any single instance.
- **Dry-brush / speed-line fields:** trailing strokes behind the
  form; environment dressing, not the form itself.
- **Impact frame:** a 1–2 frame full-screen graphic interruption at
  contact — inverted values, graphic shapes, or a held graphic
  colour field (pairs with colour-shift protocol, LIGHTING §4 /
  COLOR-SYSTEM). The *beat* the audience remembers.
- **Recovery law (documented across productions):** a smear is
  bracketed — clean drawing before (anticipation), smear at peak
  velocity, clean drawing after (settle). A smear without clean
  brackets reads as a mistake, not speed. Smears are spent on the
  *peak* only; sustained speed is carried by cycles, staging, and
  sound.

## 2. Native spec — action-language vocabulary for Mochiichao

### 2.1 The five legal devices (and only these, until the board adds one)

| Device | Code | Use | Frame budget @24fps |
|---|---|---|---|
| Stretch smear | `SM-STRETCH` | dashes, lunges, thrown arcs — whole-body or one limb | 1–3f at peak |
| Multiples | `SM-MULTI` | limb swings, tail whips, wing beats too fast to cycle | 2–4 instances, 1–2f |
| Trail field | `SM-TRAIL` | speed dressing behind form (leaves, water, dust) | ≤6f decay |
| Impact frame | `SM-IMPACT` | contact beats: hits, blocks, the lunge that *misses* (EP01 beat 4 class) | 1–2f, graphic |
| Smear-to-silhouette | `SM-SIL` | a form crosses light/dark boundary mid-move; smear rendered as pure silhouette value | 1–3f |

### 2.2 House rules

- **HR1 — Motif survives.** In any smear, the species' signature
  motif stays legible inside the deformation: Kittember's tail-tip
  flame remains a flame-shaped anchor at the tail's end; Wispkin's
  mask stays a mask (tilt/smoke are its expression instruments —
  the mask itself never smears into a blob).
- **HR2 — Eyes lead.** Where the face survives the smear, eyes are
  drawn at the *destination* position first (audience reads intent),
  body smears behind them. Standard practice, made law here.
- **HR3 — Bracket law.** Every smear device requires a clean
  anticipation drawing ≥2f before and a clean settle ≥3f after in
  the same shot. The xsheet (§3) cannot encode an unbracketed smear.
- **HR4 — Rationing.** Per cut: ≤2 smear devices; per action beat:
  ≤1 `SM-IMPACT`. EP01's single action-saturation spike
  (COLOR-SYSTEM §e beat 4) is the model: the show spends impact the
  way it spends subtitles — rarely, on purpose.
- **HR5 — Sound sync.** A smear's peak frame is an SFX spot by
  definition: the xsheet audio column marks it, and the SFX library
  (#51) `motion` class supplies the whoosh family. No silent smears.
- **HR6 — No interpolation across a smear.** Smears are drawn poses,
  never tweened through (house no-blanket-interpolation rule from
  the pipeline spec). The avatar-stack/generative lane renders
  smears as discrete frames in the animscript, not motion blur.

### 2.3 Anatomy variance (inherited from List 2 #9)

The animscript's per-anatomy performance blocks choose the device:
limbless_swimmer bodies take `SM-STRETCH` whole-body + `SM-TRAIL`
wake (Flickfin Hydro Rush pattern); quadrupeds take `SM-MULTI` on
legs at gallop peaks; biped_small takes `SM-STRETCH` on the dash
limb + `SM-SIL` on gate-crossings. A performance may only cue
devices its body plan supports — validator rule, same closed-world
discipline as anchors.

## 3. Wiring — xsheet encoding (TIMING-SYSTEM extension)

In the TIMING-SYSTEM xsheet, a smear is a CHAR-column entry with the
device code in the action note and the bracket frames marked:

```
f041–042  CHAR: anticipation (clean)      [bracket-open]
f043      CHAR: SM-STRETCH peak           [audio: SFX spot]
f044–046  CHAR: settle (clean)            [bracket-close]
```

Gate addition (composite stage): a frame-diff pass flags any smear
device whose bracket frames are missing or tweened — joins the
existing gate set beside the Forest stillness check.

## 4. Coverage notes

Technique definitions and the bracket/recovery discipline are
standard, widely published animation pedagogy and production
practice — high confidence, described in our own words. Frame
budgets and rationing numbers (HR4, §2.1) are **house settings set
by this spec**, tuned to TV-budget limited animation economics
(the show's documented model), not recovered constants. Device
codes are native; no production's notation is copied.
