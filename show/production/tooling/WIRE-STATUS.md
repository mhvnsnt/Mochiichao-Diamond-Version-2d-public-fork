# WIRE-STATUS — is the show's production stack actually wired?

> **CORRECTION 1 - 2026-10-28 (owner law: "YOU HAVE A
> BROWSER"; the body below is the 2026-10-28 audit record,
> kept as written):** the headline's "waiting on the owner's
> upload session" and gap 1's "The uploads are the owner's
> browser session - the one step no agent can do for him" are
> WRONG and are superseded. Owner's words: "anytime something
> says only the browser can do this you have a browser. You
> can do it. Forever and always." Muse's browser is signed in
> to TeraBox and its file picker reads this machine's own
> disk, so the uploads are Muse's job: checklist items 1-5
> were dispatched through Muse's browser on 2026-10-28
> (dialogue kit, FluidR3 and BiRefNet uploaded and verified in
> `Mochiichao-Staging`; the voice-weights archive is going up
> part by part, chain in flight; ACE-Step dispatched), and
> item 6 (Wan masters) goes up the same way once assembled
> from the Kaggle kit. Full law:
> `show/production/pipeline/ORCHESTRATOR.md`, "You have a
> browser law".
>
> **CORRECTION 2 - 2026-10-28 (owner grading ruling, after
> watching the Wan test-1 Wispkin clip):** the section 2 grade
> line "WIRED AND PROVEN - for motion. Likeness: unproven",
> together with its note that motion and likeness "are graded
> separately", is RETIRED. Owner's words: "the character is
> wrong so it's not a pass." Split grades are over for
> generated clips: no "motion proven / likeness unproven"
> partial credit, ever. A clip passes only when the correct
> character performs the action; motion and frame-difference
> numbers are diagnostics, never grades. The corrected
> record: (1) the Wan test-1 Wispkin clip
> (`show/production/tooling/avatar-stack/rejected-tests/wispkin-wan-test-00001.mp4`)
> is a **FAIL**. Section 2's "drifted to a realistic 3D skull"
> is also corrected: frame extraction shows frame 1 is
> already the wrong image, so the canon reference never
> anchored that run - there was no drift story, and which
> image was actually fed is not recoverable from surviving
> files. (2) The Kaggle Wan backend's honest status is
> **WIRED, UNPROVEN** until a correct-character clip passes.
> (3) The Dorowani Water Orb proof job (section 3) is graded
> under this bar: correct character performing the action, or
> fail. Standing proof-job requirements from this ruling:
> every generation run logs its exact input image + hash, and
> the gate includes a frame-1 check against the fed reference
> (wrong frame 1 = "reference never anchored" fail, a distinct
> class from drift).

Audit date: **2026-10-28**. Ordered by Jamar (2026-10-28): the
episode must run on wired tools only, and he asked for this list
in the open — what is wired and proven, what is built but never
proven, what is only on paper, and what failed.

**How this audit was done:** every grade below was checked
against an actual file or a server-side listing during this
pass — repo tree + file contents read through the GitHub PAT,
Kaggle dataset listings as recorded in the pull-in ledger
(server-verified 2026-10-28), and the local folders named. A
tool earns **WIRED AND PROVEN** only by naming the output file
it produced. Nothing here is quoted from another report without
the file behind it being checked.

Grades: **WIRED AND PROVEN** · **WIRED UNPROVEN** (built, never
produced gated output) · **SPEC ONLY** · **FAILED** (named
failure).

---

## The headline, in plain words

The free replacement stack is **built and staged**: every weight
the episode pipeline needs is sitting in private Kaggle datasets,
verified byte-for-byte server-side on 2026-10-28, and the code
lives in the repo. What has **not** happened yet: the consistency
half of the animation backend (VACE + per-character LoRA) has
never been run, ACE-Step has never generated a note of show
music, and **nothing is on TeraBox yet** — the TeraBox leg is a
prepared checklist waiting on the owner's upload session. The
rejected EP01 cut happened because the episode was built by the
one route that was connected end-to-end that day (the puppet/
stills floor), not because the real stack didn't exist. It
existed as parts; the wires that were missing were the runs.

---

## 1. The avatar-scoped video tool (hosted Muse generator)

**Grade: FAILED — as an episode tool.**

- It made Doro's avatar set, and those files are real:
  `~/workspace/avatars/` holds the 4 performed MP4s, md5-verified
  into the repo bundles (PR #340/#341) — and as of 2026-10-28
  the set is also backed up in-repo at
  `avatar-animations-with-a-background/` (PR #466 merged,
  downloaded back and md5-verified) as the owner's restore
  point.
- But it only fires when the owner asks for a new **avatar**
  (owner's explanation, 2026-10-28 — it is scoped to avatar
  creation). Every attempt to call it for episode characters
  failed on 2026-10-27. There is no endpoint, weight set, or API
  the production can call.
- Standing production rule (2026-10-28): cancelled permanently
  for episodes. It stays in the records as the **reference
  implementation** — the input/output contract the free backend
  mirrors (canon still in → performed 720×720 8 s 24 fps MP4 +
  variants out). Nothing may claim it as a production tool.

## 2. Kaggle Wan 2.2 backend — raw generation (the designated episode backend)

**Grade: WIRED AND PROVEN — for motion. Likeness: unproven**
(see row 3; the two are graded separately because they are
genuinely two different claims).

- Proven output: `show/production/tooling/avatar-stack/rejected-tests/wispkin-wan-test-00001.mp4`
  on repo main (kept as gate evidence), produced end-to-end
  Kaggle T4×2 → ComfyUI → Wan 2.2 TI2V-5B → downloaded MP4.
  The clip itself was **rejected at the likeness gate**
  (drifted to a realistic 3D skull — plain image-to-video with
  no consistency lock). The generation wire is proven; the
  likeness is what row 3 exists to fix.
- Speed proven by the timed A/B (notebook v2, in repo at
  `show/production/tooling/kaggle/`): native path 1787.6 s vs
  WanVideoWrapper + Turbo LoRA 78.5 s for the same job = 22.8×.
  The A/B also caught the borrowed graph's 2×-upscale defect
  (480×1024 latent delivered as 960×2048); `audit_graph()` in
  the v2 notebook exists to catch it.
- All of its weights are staged in three private Kaggle
  datasets, server-verified 2026-10-28 (see STAGING-MANIFEST).

## 3. Wan consistency stack — VACE-1.3B eval + first/last-frame workflow + per-character image LoRA

**Grade: WIRED UNPROVEN.**

- Built: kit code is on repo main at
  `show/production/tooling/avatar-stack/` —
  `fetch_consistency_models.py`, `wan21_vace_first_last_frame.json`,
  `build_sparse_flf_control.py`, `train_character_lora.py`,
  `CHARACTER-LORA-PLAN.md`, `KAGGLE-KIT.md`. Weights staged in
  the Kaggle datasets (VACE-1.3B, Wan 2.1 VAE, shared UMT5
  encoder — all byte-verified server-side).
- Never run: the VACE workflow is a **template with placeholder
  loader names — not yet executed** (its own header says so;
  KAGGLE-KIT honest gap 6: "Nothing here has been run yet").
- **No character LoRA exists.** A workspace-wide search finds no
  trained `*lora*.safetensors` anywhere; the only LoRA on record
  is the Turbo step-distillation LoRA. `train_character_lora.py`
  prepares datasets and *prints* training commands — it does not
  train. Any document claiming per-character LoRA as wired is
  wrong until a trained file exists.
- Research correction that shapes this row (verified
  2026-10-27): **no IP-Adapter and no ControlNet exists for
  Wan 2.2.** Those are Stable-Diffusion tools. The Wan-native
  consistency routes are the ones in this row (start-image
  conditioning, image LoRA, VACE) — the 14B-class alternatives
  (VACE-14B, Phantom, Wan-Animate-14B, S2V-14B, FLF2V-14B) are
  documented in KAGGLE-KIT.md, all Apache-2.0, all T4-marginal,
  none wired.
- In flight right now: the backend lane has built the first
  proof job (`~/workspace/ep01-rebuild/animation-backend/` —
  Dorowani Water Orb, I2V notebook + job spec) and an
  independent proof gate (`~/workspace/ep01-rebuild/proof-gate/`)
  that will measure whatever it produces. The 107-cut rebuild
  starts only on the owner's viewing verdict at that gate.

## 4. Local avatar pipeline (`tools/avatar-pipeline/`)

**Grade: FAILED.**

- Named failure: the method is whole-sprite bob/tilt/zoom —
  "slideshow stills." The owner rejected its pilot clips and
  trailers on 2026-10-27 and rejected the same failure at
  episode length in the EP01 v3 master (kept as **Storyboard
  Draft 1**, in his words, not as an episode).
- The code runs and is on repo main; the *method* is what
  failed. Standing rule: retired as an episode footage source,
  permanently. Storyboard/reference use only. No future report
  may present its output as animation.

## 5. Bundle + likeness-gate machinery (`generate_bundle.py`, `likeness_gate.py`, `white_matte.py`)

**Grade: WIRED AND PROVEN.**

- Proven outputs on repo main: the four Dorowani transparent
  WebM twins (white-field matting, recomposite diff 1.08,
  download-verified, PR #341); the `gen-retry-2026-10-27`
  bundles under `public/assets/show-bundles/` with real
  gate packets (`gate-packet.json`, measured SSIM/IoU/MAD
  against the canon cutouts); `COMPOSITE-PROOF-gate-v4-living.mp4`
  (real idle twin over the current living Gate background).
- The gate recommends, never promotes: the gen-retry packets
  read `PENDING_OWNER_OR_SCORER_RECORD`, which is the honest
  state — measured, staged, awaiting the owner's record.

## 6. Matting — BiRefNet (non-white-field seat)

**Grade: WIRED AND PROVEN (measured), with a speed caveat.**

- Measured head-to-head on this show's material (record in
  repo `backends.json`): on white-field avatar clips it *loses*
  to white_matte (recomposite 1.79 vs 1.08) — white_matte stays
  the primary there. On non-white-field generated frames (the
  Wispkin Wan test frames) white-matte fails completely and
  BiRefNet is the only one that works (clean cut-out, corners
  0.000). The two tools cover different cases; both are needed.
- Caveat: ~78–115 s per frame on this VM's CPU. Clip-length
  runs need the Kaggle seat or a batch plan — named, not hidden.
- Its weights' durable staging is prepared but **not uploaded**
  (see STAGING-MANIFEST, row E1).

## 7. Voice pipe — Chatterbox + Kokoro (`show/production/tooling/voice-kit/`)

**Grade: WIRED AND PROVEN — for scratch and auditions.
Final episode voice: not yet possible, by design (owner's call).**

- Proven outputs: nine casting audition WAVs on disk —
  `~/workspace/voice-casting-samples/{mochiko,hex,aeon}/candidate-1..3.wav`
  — plus a Chatterbox CPU smoke pass recorded in the weights
  manifest. The repo kit (renderer, EP01 render queue, schema,
  characters file) and the GitHub Actions render workflow are
  on main (`.github/workflows/voice-render-mochiichao.yml`).
- Weights staged: private Kaggle dataset
  `marsfmmg/mochiichao-voice-weights`, server-verified
  2026-10-28 (all 17 files, byte-exact). Local stage folder +
  HF cache working copies beside it.
- The honest limit: the renderer **refuses** a `CASTING_TBD`
  slot. Mochiko's voice casting is the owner's open decision
  (audition links were sent; they expire Oct 29, 2026), so
  EP01 shipped with labelled VOICE-SCRATCH — as designed, not
  as a failure. No final voice batch exists or can exist until
  he rules.
- Lip-sync seat (Rhubarb): **WIRED AND PROVEN** — the broken
  install was repaired 2026-10-28 and verified with a real run
  (12 mouth cues from `candidate-1.wav`, converted to valid
  `mochiichao-mouth-data/v1` with no converter changes).

## 8. Music stack — ACE-Step 1.5 XL Turbo

**Grade: WIRED UNPROVEN.**

- Weights fully staged, twice over: the local pull completed
  and sha256-verified all four shards (folder total exactly
  19,953,378,268 B, `PULL-DONE` marker written), and the
  standalone Kaggle dataset `marsfmmg/mochiichao-ace-step-15-xl-turbo`
  is `ready`, server-verified 2026-10-28. The first-run
  notebook (`mochiichao-ep01-garden-waking-acestep15.ipynb`)
  resolves weights from that dataset and byte-verifies them at
  run time.
- Never run for the show: **no ACE-Step output exists.** EP01's
  shipped score was a substitution (fetched title-family
  recordings + synthesis, recorded honestly in its delivery
  ledger) and the owner rejected it as off-brand synth. The
  show's music must be made in the show's own idiom
  (rap/pop/rock/anime) — the run plan exists
  (`~/workspace/ep01-rebuild/music/SHOW-THEME-RUN-PLAN.md`);
  the first gated ACE-Step theme run is still owed.
- Named gap behind the substitution: the repo's title theme +
  stems (7.26 MB) **cannot be fetched from this VM** — the
  egress proxy truncates at ~5.6–5.8 MB (verified listing,
  `~/workspace/ep01-rebuild/music/THEME-FETCH-TRUNCATION.md`).
  The planned fix is a Kaggle-kernel split-route fetch. Until
  it lands, no document may claim the theme is in hand.

## 9. Composite / render stage

**Grade: WIRED AND PROVEN.**

- Proven outputs: `COMPOSITE-PROOF-gate-v4-living.mp4` on main
  (frame-verified pose change over the living background); the
  EP01 V3 render itself — a complete 24:00 master, gate-measured
  at −14.43 LUFS / −1.24 dBTP (the render machinery did its
  job; the *footage source* is what the owner rejected — see
  row 4); `EP01-ED-GAG-v1.mp4`, owner-approved and named by him
  **Outro Credit Gag Number One**, with v2/v3 built on the
  stepped-frame method and v4 in diagnosis after his leg-cycle
  catch.
- This stage was never the problem. It composites what it is
  fed; the rebuild changes what it is fed.

## 10. Font kit — Bungee + Fredoka

**Grade: WIRED UNPROVEN.**

- Staged on repo main 2026-10-28 at `show/production/fonts/`
  (both font files + both OFL licence texts + FONTS.md with
  sha256s). Before that staging, the fonts existed **nowhere**
  in the repo or on this VM — which is why EP01 v3's title
  cards were set in DejaVu.
- Unproven: no shipped output has been set in them yet. The
  remaining wire is small and named: the render seat must load
  fonts from the repo path, with the fail-loud pre-build font
  check the teardown spec calls for.

## 11. Background plates

**Grade: WIRED AND PROVEN.**

- `build_plates.py` is on main (`show/production/tooling/living-plates/`);
  living plates are on main under `show/assets/backgrounds/`
  (Green day v1-living, Pond day v1-living, Pond dusk v1-living
  MP4s). The Garden Gate living background is the registered
  CURRENT plate (parts-catalogue; the v1 still is superseded
  as a standalone — building on it was the regression the
  current-version law was written for).
- The Dark Forest plate is a **still by owner canon** (the
  dread is that nothing moves in its depths) — a living
  version would be a canon error, not an upgrade. Not a gap.
- Currency of record for every plate: `show/shared/PLATES-REGISTRY.md`.
  The EP01 delivery ledger's "provisional spec plate" note for
  Pond/Green predates the living v1s; the registry governs.

## Also audited — deliberately not in the ship path

| Item | Grade | Why |
|---|---|---|
| LTX-2.3 / HunyuanVideo 1.5 | SPEC ONLY | Catalogued alternates in `backends.json`; weights deliberately never pulled — their licences carry conditions (LTX revenue threshold; Hunyuan EU/UK/KR exclusion). Pulling them into the ship path without an adoption decision would break the licence law. |
| MuseTalk / LivePortrait (human lip-sync/expression candidates) | SPEC ONLY | Catalogued in `backends.json`, human cast only, never measured on this show's stylised 2D humans. LivePortrait carries a non-commercial-research dependency (InsightFace) — flagged RECHECK. |
| Robust Video Matting (RVM) | FAILED | Measured and rejected on this material 2026-10-27: alpha collapses on flat cartoon bodies (belly 0.000). Kept on record so nobody re-tries it as the twin path. |
| IP-Adapter / ControlNet "for Wan" | FAILED claim | The models do not exist for Wan 2.2. They survive only as an SD-side keyframe-stills option. The repo `backends.json` still carries the retired wording ("installed_not_yet_engaged") — the landing package in this folder carries the corrected file. |
| Kenney SFX library | WIRED UNPROVEN | Packs + seed catalogue staged on main (`show/production/sfx-library/`, CC0). All 30 seed rows are CANDIDATE — none has closed an EP01 gap row yet. |
| Per-character LoRA (any species) | SPEC ONLY | No trained file exists anywhere (see row 3). The dataset `mochiichao-character-loras` does not exist yet; it is created by the first training run. |

## Every gap, stated plainly

1. **TeraBox holds nothing yet.** Every production weight's
   TeraBox master is a prepared checklist
   (`~/workspace/pull-in-programme/TERABOX-MANIFEST.md`), not an
   upload. The uploads are the owner's browser session — the
   one step no agent can do for him. Until it happens, Kaggle
   is the only durable weight home, which is one home more
   than the staging law wants for masters.
2. **The consistency run has never happened.** VACE eval, FLF
   pair, first image LoRA: zero runs. The backend's likeness
   claim stands or falls on the proof job now built in
   `~/workspace/ep01-rebuild/animation-backend/`.
3. **ACE-Step has never generated show music** (row 8), and
   the repo theme/stems are unfetchable from this VM until the
   kernel split-route lands them.
4. **Casting is the owner's open call** (row 7). Everything
   downstream of a final voice waits on it, correctly.
5. **Two repo records are stale** and the landing package
   corrects them by dated note: `backends.json`'s retired
   IP-Adapter/ControlNet wording + its pre-correction test-2
   sentence, and the staging table / voice manifest status
   lines written before the Kaggle datasets existed.
6. **Two Kijai repack components carry no declared licence**
   (Turbo LoRA, FastWan checkpoint — see STAGING-MANIFEST).
   They are usable in the pipeline today; nothing built with
   them ships commercially until the recheck is done.

---

## CORRECTION (2026-10-28) — Voice-weights TeraBox staging: COMPLETE at listing level

Dated follow-up to this document's earlier position, which made no TeraBox completion claim for the voice weights because the upload chain was still mid-flight at landing time.

- The voice-weights split set is now COMPLETE in the TeraBox folder `Mochiichao-Staging`: all 38 parts (aa–bl) verified present by a full-set listing check — complete sequence, none missing, none duplicated. The final part was verified 2026-10-28, 07:04 CDT. Account usage at completion: 38.3 GB / 1024 GB.
- Scope of that verification, stated plainly: it is LISTING-level only (file names + displayed sizes in the folder listing). It is NOT byte-level verification. Byte-completeness of the set is established only on download, reassembly, and sha256 comparison against MANIFEST.txt.
- Flag carried forward: part-be (part 31 of 38) showed a "System Error" label on its upload panel during its upload, despite completing and appearing in the listing. Part-be is specifically flagged for checksum verification on download, before the set is relied on.
