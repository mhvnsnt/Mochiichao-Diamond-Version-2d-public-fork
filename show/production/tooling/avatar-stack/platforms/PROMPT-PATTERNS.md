# Prompt Patterns — flat 2D cartoon, per stack

Status: CURRENT, 2026-10-28. Patterns are written for OUR show: flat 2D
cartoon, recurring cast, canon traits named from the reference packs.
Sources are marked per pattern: [platform docs] = the platform's own
guide/help; [our gates] = derived from our measured failures; [third-party]
= community/blog material, unverified by the platform.

## The shared spine (every engine)

Every generation prompt is built in this order:

1. **Style lock first:** "flat 2D cartoon, clean outlines, flat colors,
   no gradients on characters" — style words lead, because every engine
   weights early tokens heavily [our gates: both failed proofs drifted
   toward soft 3D rendering when style was not led].
2. **Character by pack name + canon traits:** name the character, then
   the 2–3 do-not-change traits from its pack (e.g. Dorowani: "red fin
   cheeks, red eyes, tan shell on its back"). Traits are repeated in
   EVERY prompt, not assumed from the reference [platform docs: Kling's
   guide has Elements bound by description as well as images; Phantom's
   paper requires prompts rephrased to describe each reference subject
   explicitly to avoid subject confusion].
3. **Action as one verb phrase, one action per shot:** "Dorowani rears
   back and fires a glowing sphere of water" — one action, present
   tense, no stacked actions. Multi-beat action = multi-shot group or a
   chained segment, never a longer sentence [our gates].
4. **Camera last:** one camera instruction ("static wide shot", "slow
   push-in") or none. Camera stacks fight the action phrase.
5. **Background described separately from characters** — our pattern
   composites characters over living backgrounds, so generation prompts
   ask for plain/transparent-friendly staging where the engine allows,
   and the background slot stays empty on purpose.

## Negative prompt (shared, engines that accept one)

```
3d render, cgi, photorealistic, painterly shading, gradient shading on
characters, drop shadow under character, ground shadow, contact shadow,
extra limbs, extra characters, character redesign, different colors,
hat, clothing not in reference, text, watermark, logo
```

The shadow lines are the no-baked-shadows rule in prompt form: shadows
are added at composite time, never generated onto the character
[our gates / standing rule].

## Per-stack notes

### Our backend (Wan 2.2 + VACE, ComfyUI)
- Reference-usage phrasing: the VACE reference image does the identity
  work; the prompt still names the character + traits (belt and braces —
  the failed unlocked proofs show what happens when the reference is not
  actually wired: SSIM 0.29–0.40).
- Use `freedom/prompt_library.json` entries as the base text; the spine
  above is the edit rule when adapting them.

### Kling (Elements) [platform docs: official VIDEO 3.0 guide]
- Build the Element first (frontal image + angle images from the pack),
  then reference it in the prompt by its Element name and describe the
  action per shot.
- Multi-Shot phrasing: one prompt, shots separated with per-shot framing,
  duration, and camera — the guide's Custom Multi-Shot format.
- Voice binding (30s+ sample) is for the HUMAN cast only; creatures use
  cries from our own lanes.

### Higgsfield / Seedance 2.5 [platform docs: ByteDance launch post; Runway dev docs]
- References are called into the prompt as saved Elements (@-style
  handles); up to 50 references per generation — attach the pack views
  plus the background plate reference where the shot needs it.
- Multi-shot: describe the shot sequence in one prompt; ByteDance's own
  post warns multi-subject stability is the weak point — keep two-
  character shots on the test list, not in episode commitment, until
  graded by our gates.

### Google Flow (Veo 3.1 / Gemini Omni Flash) [platform docs: Google Flow help]
- Ingredients phrasing: name each ingredient and its role ("the blue
  creature from ingredient 1 performs…"). Base clips are 4/6/8s — prompt
  for ONE beat per clip and chain with Extend.

### Phantom-Wan (open eval slot) [platform docs: Phantom paper/README]
- The paper is explicit: prompts must be rephrased so each reference
  subject is described in appearance AND behavior, or subjects get
  confused. Our spine step 2 is mandatory here, doubled for two-character
  shots. 1–4 reference images accepted.

### MultiShotMaster (open eval slot) [platform docs: project page]
- Global description + per-shot captions + reference images for
  characters and backgrounds; 1–5 shots per pass. Write the global
  description as the scene's spine prompt, per-shot captions as spine
  steps 3–4 only.

## Follow-up additions (2026-10-28) — prompt-compiler patterns, adapted

Sources, both MIT-licensed and verified at source in
OPEN-STUDIOS-AND-PROMPT-ENGINES.md: **allenGKC/Seedance-2.5** ("Seedance
2.5 Codex Skill OS", MIT — attribution: prompt-compiler structure after
allenGKC) and **ZeroLu/awesome-seedance-2.5** (MIT — attribution:
curated prompt collection by ZeroLu). Patterns below are ADAPTED to our
engines and our cast — structures transfer, Seedance-specific syntax
and third-party prompt text do not get copied into episode work.

- **Reference declaration / role map** [allenGKC]: before the action
  text, declare every reference and the ONE job it owns — identity,
  motion only, rhythm only, background only ("@Image1 controls
  identity; @Video1 supplies motion only; @Audio1 controls rhythm").
  This is the prompt-side twin of our per-character layer method: a
  reference with no declared role gets used for everything, including
  the things it should never drive. Applies on every engine that takes
  multiple references (Seedance lanes, Kling, Flow ingredients, our
  Phantom eval slot).
- **Timestamp beat structure** [allenGKC]: for clips over ~8s, write
  the action as timestamped beats ("0–3s: …; 3–6s: …") instead of one
  long sentence. On engines without timestamp support, the same beats
  become the segment boundaries for chaining — one beat per segment.
- **Failure-diagnosis → prompt-rewrite loop** [allenGKC]: when a clip
  fails a gate, name the failure class first (face/identity change,
  rough transition, wrong motion owner) and rewrite ONLY the prompt
  part that owns that class (role map for identity, beat split for
  transitions). This formalises what our gates already measure: a
  frame-1 likeness FAIL is a role-map/reference problem, never a
  "try a longer prompt" problem.
- **Seamless extension recipe** [allenGKC]: extend accepted footage by
  prompting continuation from the last frame with motion/camera
  continuity restated — the prompt-side version of our
  `freedom/chain_segments.py` chaining; use the recipe's wording shape
  on engines with native extend (Flow Extend, Seedance lanes) and the
  chaining tool everywhere else.
- **Multi-panel storyboard recipe** [allenGKC]: a grid/storyboard image
  as a reference with panel order declared ("follow the panel order in
  @Image1") — on our pattern this feeds Shot Groups: one storyboard
  panel per shot intent in the `multi_shot_group`.
- **Blocking/white-model pattern** [allenGKC]: a rough untextured
  blocking pass (or our own storyboard-draft footage) used as a
  MOTION-ONLY reference under the role map — the engine renders the
  real character over our staging. Directly useful with the episode's
  storyboard draft 1 as staging reference.
- **Multi-reference stress test** [ZeroLu]: their "Antique Market
  Multi-Reference Test" construction — many references at once, each
  with a distinct owner — is the shape of our rotation's two-character
  test (FREE-TEST-ROTATION.md): if an engine scrambles owners on the
  test, it does not get two-character episode work.
- **Category prompt shapes** [ZeroLu]: their anime & animation
  category shows the working shape for cartoon prompts on Seedance —
  style block first, character block second, camera third — which
  converges with our shared spine (style lock → traits → action →
  camera). Recorded as independent confirmation of the spine, not a
  replacement for it.

## What we do NOT do

- No prompt pattern borrowed from a third-party blog is marked verified —
  blog-sourced phrasing tricks are [third-party] until our own gates
  grade clips made with them.
- No pattern asks an engine to imitate another production's characters,
  names, or branding (construction-kit rule). Style words describe OUR
  flat 2D look only.
