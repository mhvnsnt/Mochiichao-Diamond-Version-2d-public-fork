# Pack Manifest — CURRENT packs (v1, landed 2026-10-28)

| Character | Pack version | Front view | 3/4 | Side | Back | Expressions | LoRA set |
|---|---|---|---|---|---|---|---|
| Wispkin | v1 CURRENT | CANON (`wispkin/front.png`) | GAP | GAP | GAP | GAP | exists (Wan2.1-1.3B — see `../lora/LORA-MANIFEST.md`) |
| Dorowani | v1 CURRENT | CANON (`dorowani/front.png`) | GAP | GAP | GAP | GAP | exists (Wan2.1-1.3B) |
| Mochii | v1 CURRENT | CANON (`mochii/front.png`) | GAP | GAP | GAP | GAP | GAP |
| Gabu | v1 CURRENT | CANON (`gabu/front.png`) | GAP | GAP | GAP | GAP | GAP |
| Kittember | v1 CURRENT | CANON (`kittember/front.png`) | GAP | GAP | GAP | GAP | GAP |
| Sproutle | v1 CURRENT | CANON, cleaned (`sproutle/front.png`) | GAP | GAP | GAP | GAP | GAP |

## What the gaps mean, plainly

Every pack today is a **single-view pack**. That is enough for image-to-video
and reference-to-video generation (all engines accept a front reference), but
it is below what the platforms' own guides recommend and below what our own
LoRA round 2 already called for:

- Kling's Element guide builds an Element from a frontal image **plus up to
  3 supplementary angle images** — our supplementary slots are empty until
  sheets exist.
- Higgsfield's Soul ID trains on **20+ images** — impossible from canon today.
- Our own LoRA manifest already states round 2 needs real model sheets
  (front/¾/side/back + expressions).

**The sheet step is the same step for every engine**: produce owner-visible
model sheets for the pilot cast, approve them as canon, then upgrade each
pack to v2 with the new views marked CANON. Until then, no engine — ours or
theirs — gets more than the front view, and no generated angle may be
labelled canon.

## Superseded / excluded

- `sproutle-v1-baked-shadow.png` — excluded from the Sproutle pack
  (baked ground shadow; no-baked-shadows rule). Cleaned cutout is current.
