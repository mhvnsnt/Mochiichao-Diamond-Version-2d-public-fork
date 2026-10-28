# Production Pattern — THE recommended workflow (all engines)

Status: CURRENT recommended pattern, 2026-10-28. Engines are swappable slots
under this one pattern. Our own Kaggle backend is the free/shipping slot;
commercial platforms (see VERIFIED-PLATFORMS.md) plug into the same steps
when the owner chooses to pay for a test or a run.

## The seven steps

1. **Sheets first.** Every recurring character gets a reference pack
   (`reference-packs/`): canon front view today; ¾, side, back, and
   expression views are GAP-flagged until the owner-visible sheet step
   produces them from canon art. No engine ever receives an unlogged
   reference — `parity/preflight.py` hash-checks every reference before
   GPU time is spent.
2. **Lock once, per character.** The pack IS the lock. On our backend the
   lock is enforced by VACE reference control + per-character LoRA
   (`parity/workflow-i2v-locked.json`). On a commercial slot the same pack
   files become that platform's Elements / reference assets / ingredients.
   One pack, every engine — the pack never forks per platform.
3. **Short reference clips first.** Before any episode work on a new
   engine, run the two test characters (Wispkin + Dorowani) on 2–3 short
   clips (5–8s) doing canon actions (Dorowani's Water Orb, Wispkin's Dark
   Wave). These are the comparison set for narrowing the stack.
4. **Multi-shot where verified, chaining everywhere else.** Where an
   engine VERIFIES multi-shot in one generation (Kling Multi-Shot,
   Seedance 2.5, open MultiShotMaster), group the shots in the job
   (`multi_shot_group`). Everywhere else, shots are separate jobs joined
   by `freedom/chain_segments.py` — same job format, no pattern change.
5. **Composite and finish in our tooling, always.** Characters are
   generated as layers and composited over the CURRENT living background
   for the scene (`freedom/scene_composite.py`); shadows are added at
   composite time only — never baked into character art. Audio (voices,
   cries, music) is laid in at this step from our own lanes. FFmpeg
   finishing is the repo path that already exists.
6. **Gates on every output, every engine.** Frame-1 gate
   (`parity/frame1_gate.py`) + likeness gate run on platform outputs
   exactly as on ours. A clip with the wrong character FAILS, whatever
   it cost. Paid retries are budgeted (3 attempts per keeper) and the
   spend stops at the budget.
7. **Stage everything.** Clips, packs, and manifests land in GitHub
   (small) or TeraBox/Kaggle datasets (large) with registry entries.
   Nothing production-related lives only on local disk.

## Engine slots (pick per production decision, not per habit)

| Slot | Engine | Bucket | When |
|---|---|---|---|
| Shipping (default) | Our Kaggle backend — Wan 2.2 + VACE lock | open source (Apache-2.0) | Always available; likeness proof pending the locked run |
| Speed eval | FastWan via FastVideo (Apache-2.0) | open source | When the locked run passes and speed becomes the bottleneck |
| Multi-shot eval | MultiShotMaster (Apache-2.0, on Wan) | open source | Grouped-shot scenes |
| Reference eval | Phantom-Wan (Apache-2.0) | open source | If VACE lock underperforms on multi-subject shots |
| Paid test | Kling VIDEO 3.0 / 4.0 Elements | paid | Owner-approved test batch only |
| Paid test | Higgsfield Seedance 2.5 (Plus+) | paid | Owner-approved test batch only |
| Zero-cost look | Google Flow free daily credits | free proprietary / rights unclear | Scratch comparison only — outputs NOT cleared for shipping |

## OWNER-LOCKED — the multi-character workflow (locked 2026-10-28)

This section is the GOVERNING statement of the production method. The
seven steps above implement it; where wording ever differs, this section
wins.

> Multi-character workflow locked as the production method. Per scene:
> (1) Generate each character's reaction separately (per character, same
> scene prompt + likeness lock). (2) Cut the background out of each
> generated character plate. (3) Overlay the cutouts onto the real moving
> background/scene plate. (4) Post-production (timing, shadows, color,
> effects, final polish) on top of the composite. Tier mapping: Tier 2 =
> per-character generation; Tier 3 = cutout + overlay/rigging/
> compositing; Tier 4 = post on the final composite.

Standing practice alongside the locked steps (already wired — these are
not new proposals):

- **Plate gate between steps 1→2:** every generated character plate
  passes the frame-1 gate + likeness gate (`parity/frame1_gate.py`)
  BEFORE it is cut out. A failed plate is regenerated, never repaired
  downstream.
- **One shared scene timing map per scene,** used by every character's
  generation for that scene, so separately generated reactions land on
  the same beats when composited.
- **Step 4 order is fixed:** shadows land on the composite BEFORE the
  color grade. (Shadows are never baked into character art — standing
  rule; they are a composite/post effect.)
- **Cutout tooling for step 2:** `white_matte.py` is PRIMARY for flat
  cartoon plates (RVM was measured and rejected on this material in the
  parity round); BiRefNet is the backup; solid-field prompting at
  generation time (ask the engine for a plain solid field behind the
  character) is kept as insurance so the matte has a clean field to key
  on.

## What never changes across slots

- Reference packs are the single source of character truth.
- Prompts follow PROMPT-PATTERNS.md (flat 2D, no baked shadows, canon
  traits named).
- Gates decide pass/fail; cost already spent never argues a fail into a
  pass.
- Licence buckets are stated on every manifest; free-but-restricted
  material is scratch only and never enters a shipping composite.
