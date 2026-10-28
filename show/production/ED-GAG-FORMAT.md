# THE ED GAG FORMAT — "THE CHIBI WALK" — Mochiichao Show

**Status: STANDING FORMAT — owner-defined 2026-10-27.**
This document is the production record of the end-credits gag
format for the season's EDs. The format is the owner's, dictated
2026-10-27; it resolves the EP01 credits slot's PENDING OWNER
state at the format level. Per-episode contents vary under the
format; the format itself is standing until the owner changes it.

The gag lives in the ED's chibi credits-bit slot — the one
credits bit per episode the Chibi Card System permits
(CHIBI-CARD-SYSTEM.md). Chibi law still governs the bit: chibi
forms are proportion variants of the canon full-size likenesses,
chibi carries identity and flair only, and no shadow is baked
into character art (shadows are a composite-stage job).

---

## 1. THE SHAPE

The gag is a **side-view line**: a human character in front,
their party of Mochiichao trailing behind them in a line,
walking across the frame. The tone is mischievous chibi comedy.

Inspiration is tone and shape only. No character, art, name, or
design from any other production is carried into the bit —
mechanisms only, per the construction-kit rule
(show/WORKING-METHOD.md).

## 2. THE RULES (owner's, in substance)

1. **Interchangeable dressing.** The background colour and the
   cute background business change every time. No two instances
   share a dressing by default.
2. **The lineup varies.** Composition is per-instance: a human
   with their party, an all-Mochiichao team, one Mochiichao
   alone, one human alone, two humans, or two, three, or four
   Mochiichao. The lineup is chosen per episode, not fixed.
3. **Personality beats.** Individual characters carry little
   gags of their own inside the bit — small actions that show
   their personality, and the team's chemistry in miniature.
4. **The weighting.** The plain walking line is the signature
   form: it carries **40–50% of instances**. The remaining
   50–60% are the varied forms — other activities, settings,
   and lineups under rules 1–3.

## 3. THE FENCE

An instance is built from **its own episode's cast** — the
people and Mochiichao that episode actually showed. Nobody is
added because they would be cute, and nobody appears in a form
the episode did not earn.

Amendment (owner, 2026-10-27, after the format was set): very
rarely, an instance may smuggle in an unseen or unintroduced
person, Mochiichao, or incident — in exactly two shapes,
**foreshadowing** (a tease of what is coming) or **flashback**
(a look back at a past person or incident) — and each smuggle
is individually owner-approved. Outside those two shapes and
that rarity, the fence stands as written. EP01's founding
instance (§4) uses no smuggle: the episode's own cast only.

## 4. INSTANCE HISTORY

### EP01 — "The Garden Has a Ghost" — instance 1 (2026-10-27)

- **Owner-given name: "Outro Credit Gag Number One"** — named by
  the owner on approving the instance (2026-10-27).

- **Slot:** the ED chibi credits-bit slot, window **56–70 s** of
  the 75 s ED (per EP01-V3-staging.json). Built length 14.000 s,
  filling the window.
- **Form:** the signature plain walking line (rule 4).
- **Lineup (episode's own cast only):** Mochiko in front —
  Mochii — Kittember — Sproutle — Wispkin trailing. Cast read
  from EP01's landed episode record: Mochiko is the episode's
  on-screen keeper; Aeon is never shown in EP01 (a device ping
  only) and is excluded; Dorowani (Hex's partner) and Gabu stay
  out to hold the format's lineup size. Personality beats:
  Mochii squash-hops, Kittember's tail-tip flame rides behind,
  Sproutle's sprout wobbles, Wispkin floats instead of walking
  at the rear.
- **Dressing (rule 1):** flat dusk-plum field, pale stars, a
  crescent moon, a scalloped ground band with tiny flowers.
- **Files:** `EP01-ED-GAG-v1.mp4` (instance of record,
  1280×720, 24 fps, 14.000 s, sha256
  f81ae4ef1ffca6898c04f542411fc35d33e1c51fff2a3f460fe409fbf24fe1ef)
  and `EP01-ED-GAG-v1-canvas.transparent.webm` (the alpha walk
  canvas it was composited from, sha256
  0e16f18d4484f12428bbb429afa7ec37175c93600192a8330fdd4a5f03a3c068).
  Workspace home: `~/workspace/ep01-ed-gag/` (build notes there);
  staged for TeraBox with the EP01 set (`EP01-MANIFEST.txt` in
  the TeraBox upload set).
- **v2 — the animation upgrade (owner-ordered 2026-10-27):**
  `EP01-ED-GAG-v2.mp4` (1280×720, 24 fps, 14.000 s, sha256
  503cd42e885948260a2b64088955d83dc95f2e5488f105404e8bba7ae05041fa)
  and `EP01-ED-GAG-v2-canvas.transparent.webm` (the alpha walk
  canvas it was composited from, sha256
  5435a5cfcbe67397f815ae5a3d2b309d1cdf3e74cdcee85ec934007481dd5bd1).
  Same instance, cast, lineup, dressing, and slot as v1; the
  motion is rebuilt as authored stepped frame animation — pose
  charts rendered from the rigs, each drawing held 3 frames
  (8 poses/second) — per the studied limited-animation method.
  Build record: `BUILD-NOTES-v2.md` in the workspace home above.
- **Status: OWNER-APPROVED — v2 is the CANDIDATE CURRENT
  version.** The owner approved the instance on viewing v1
  (2026-10-27) and named it "Outro Credit Gag Number One"; v1
  stands as the first produced version. The owner-ordered
  animation upgrade, v2, is built and is the candidate current
  version pending the owner's viewing of it. The shipped EP01
  master is unchanged — it still carries the slot's empty
  placeholder frame. This instance swaps in only on the owner's
  order (Current-Version Law).

---

*Machinery note: the teardown lane's slot, fence, and format
systems (List 42 items 410/418–419; List 44's chibi-walk
systems) build the working apparatus under this record. This
document is the format's home; it does not duplicate their
specs.*
