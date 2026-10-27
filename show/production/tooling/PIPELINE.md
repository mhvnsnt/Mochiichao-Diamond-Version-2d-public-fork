# Mochiichao show pipeline — native spec (carried in)

The show's production pipeline, synthesized natively from Jamar's
own pipeline documents: mystery-coast's dialogue-first method,
TRIPPEDD-Animation-Studio's shot stages, cape-jones' builders and
gates, and this repo's avatar-pipeline. Canonical code lives in its
home repos (TOOLING-INDEX.md) — this spec is the show's contract for
how an episode moves. Owner laws carried over: proven open-source
tools; automate the wait; **no clip ships unverified (anim gate)**.

## The shape (dialogue-first, like ATHF / 1969 Scooby)
```
beat sheet (6-beat formula, TEMPLATES.md)
  -> scratch dialogue (TTS: wizard-gang-voice-pipe pattern / Piper)
  -> ensemble voice record (final voices; improv pass kept)
  -> audio cut + animatic (cape-jones animatic_builder /
     fountain_to_animatic; Kdenlive as needed)
  -> rigs (show/production/rigs/ specs + scaffolds)
  -> animate on 2s/3s, held poses, NO blanket interpolation
     (2D puppet in Tahoma2D/Animate-style; 3D shots via
      TRIPPEDD render_shot.py -> Blender headless)
  -> motion sources where needed: body-replace (Viggle workflow)
     or generative clips -> cartoon finish (below)
  -> lip sync (Rhubarb cue sheets; Blair viseme symbols)
  -> backgrounds/props assembled from the parts catalog
     (show/shared/parts-catalog.json; donor filter applied)
  -> composite + finish (cape-jones/TRIPPEDD finish stage:
     cleanup_lines, palette-enforce, grades, grain, letterbox)
  -> score/SFX from cue library (cape-jones music_gen/sfx_gen
     patterns; species cries as voice bases)
  -> encode + ANIM GATE + deliver (ffmpeg; proof stage)
```

## Stage notes
0. **Beat sheet first.** The formula carries the structure
   (arrive → problem → split up → fake-out → trap backfires →
   unmask/resolve), subverted for the garden cast as the episode
   needs. 3–5 pages, locked before any voice work.
1. **Scratch voices are for timing only.** TTS renders (voice-pipe
   render-queue format) time the animatic; final voices replace
   them. Ad-libs from the final record get written back into the
   show bible (the "Jinkies" method from the research).
2. **Animatic before animation.** Fountain script → beats →
   animatic via cape-jones builders; storyboard sheets via
   `storyboard_sheet.py`. No shot animates without an animatic
   timing pass.
3. **Animate the HB way.** On 2s/3s, held bodies with mouth/eyes for
   dialogue, walk cycles locked to frame counts. Selective smoothing
   ONLY where a shot spec marks it — never blanket interpolation.
4. **Generated/body-replaced footage is raw material,** not finished
   animation: it enters at the finish stage (line cleanup, palette
   enforcement, holds/smear treatment per the house style) and must
   still pass the gate.
5. **Finish is a system, not a vibe.** palette-enforce against the
   episode palette sheet → grades → letterbox/titles → mix at
   −14 LUFS (TRIPPEDD post spec).
6. **Anim gate (from cape-jones ANIM-GATE + TRIPPEDD proof.py):**
   every delivered clip is reopened, ffprobe-checked, frame-sampled
   and eyeballed. QC status stays PENDING until a human/agent has
   actually looked at frames. This gate exists because a slideshow
   was once shipped as a pilot — never again.
7. **Edit loop:** pocket-studio project JSON ⇄ build.py renders —
   dialogue re-timing happens on the phone without re-animating.

## Formats (all in-repo or indexed)
- Shot spec: TRIPPEDD `shots/SPEC.md` YAML format.
- Manifests: `show/shared/cast.json`, `parts-catalog.json`,
  `clip-index.json` (SHOW-HOME plan).
- Voice queue: wizard-gang-voice-pipe `render-queue.json` format.
- Episode folder: `show/episodes/EP##/` with script, beat sheet,
  cue sheet, animatic, shots, finish, exports.
