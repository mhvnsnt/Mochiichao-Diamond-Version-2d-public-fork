# Mochiichao Voice Kit

Human voices for the Mochiichao show, built on the owner's Wizard
Gang pipe pattern (Chatterbox zero-shot clone + per-character tuned
exaggeration/CFG + single-slot render queue), rebuilt native:
character data in config, prosody typed per line, scratch/final
status stamped on every output.

**Humans only.** Creatures are cries-only by owner law — they have no
slots here, ever.

Full teardown + design: `docs/VOICE-KIT.md`. EP01 wiring: `WIRING.md`.
Weights staging: `TERABOX-MANIFEST.md` (weights never live in the
repo — staging rule).

## Characters

| Slot | Defaults (ex / cfg) | Ref | Status |
|---|---|---|---|
| `mochiko` | 0.45 / 0.5 | `refs/mochiko-ref.wav` | CASTING TBD |
| `hex` | 0.30 / 0.6 | `refs/hex-ref.wav` | CASTING TBD |
| `aeon` | 0.40 / 0.55 | `refs/aeon-ref.wav` | CASTING TBD |

Defaults are DRAFT starts from `show/production/VOICE-DESIGN.md` —
the owner tunes. A `CASTING_TBD` slot renders nothing: the renderer
refuses rather than inventing a voice.

## Render a batch (production path)

1. Edit `render-queue.json` — one character, one param set, a
   `lines[]` array; every line carries `label`, `text`,
   `prosody_type`, `contour` (format: `render-queue.schema.json`).
2. Commit + push. The **Voice Render (Mochiichao)** workflow renders
   on GitHub Actions (the local VM lacks the RAM for inference),
   converts WAV → MP3, and uploads an artifact (~15–30 min/line CPU).
3. Or run it by hand: Actions → Voice Render (Mochiichao) → Run
   workflow, for a single line.

Local plan/test (dry-run is the default — nothing renders on spec):

```bash
pip install -r requirements.txt
python scripts/render_voice.py --queue render-queue.json          # plan
python scripts/render_voice.py --queue render-queue.json --run    # render
```

Outputs land in `output/` as
`<character>-<label>.VOICE-SCRATCH.wav` (+ `.mp3` in CI). Everything
is `VOICE-SCRATCH` — fit to time the animatic, not to ship — until
the owner passes the casting and a batch is marked `FINAL`
(VOICE-DESIGN gate).

## Add a character

1. Cast a reference to the character's prosody sheet; drop it in
   `refs/<name>-ref.wav` (see `refs/README.md` for the casting rules).
2. Add the slot to `characters.json` (ref path, defaults, prosody
   sheet) and set `ref_status` to `CAST`.
3. Add the name to the workflow's `character` choice list and to
   `render-queue.schema.json`'s enum.

## Prosody in one paragraph

Each line's delivery does a story job — `emotional-connection`,
`narrative-beat`, `audience-retention`, `character-bonding`, or
`baseline` — in one of the character's sheet contours (`wonder`,
`reverence`, `dead-level`, `lecturer`, …). Exaggeration is the
expressiveness dial (per character, overridden per line only for
register shifts); CFG buys legibility, not expression. And the
performance is still written into the text itself — caps, ellipses,
dashes — exactly as the source pipe's queues do it.
