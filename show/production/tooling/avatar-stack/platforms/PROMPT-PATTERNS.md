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

## What we do NOT do

- No prompt pattern borrowed from a third-party blog is marked verified —
  blog-sourced phrasing tricks are [third-party] until our own gates
  grade clips made with them.
- No pattern asks an engine to imitate another production's characters,
  names, or branding (construction-kit rule). Style words describe OUR
  flat 2D look only.
