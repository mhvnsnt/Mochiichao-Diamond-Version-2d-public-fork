# Casting reference slots — NO AUDIO SHIPS IN THIS FOLDER YET

Every Mochiichao human voice is **CASTING TBD**. This folder holds one
reference clip per character slot, named exactly as `characters.json`
says:

| Slot | File | Status |
|---|---|---|
| Mochiko | `mochiko-ref.wav` | CASTING TBD |
| Hex | `hex-ref.wav` | CASTING TBD (EP02+ need) |
| Aeon | `aeon-ref.wav` | CASTING TBD (EP02+ need) |

Rules (from `show/production/VOICE-DESIGN.md`, chain step 2):
- The ref is cast **to the character's prosody sheet** — an original
  recording, or a properly sourced licensed/dataset reference whose
  natural pacing/toning/melody matches the sheet.
- A ref that IS a recognisable performer's voice is a **failed
  casting**. Patterns transfer; identities don't.
- The Wizard Gang refs are that show's cast identities and are never
  copied here.
- Refs are small (source pipe's refs run 0.35–1.2 MB) — they live in
  the repo, not on TeraBox. Only model *weights* are TeraBox items
  (see `../TERABOX-MANIFEST.md`).
- One clean clip per character is the whole input: ~5+ seconds of
  clean speech is enough for Chatterbox zero-shot cloning; a few
  minutes of varied lines is better.

When a casting is decided: drop the file here under its slot name,
flip that character's `ref_status` in `characters.json` from
`CASTING_TBD` to `CAST`, and the renderer unblocks for that slot.
