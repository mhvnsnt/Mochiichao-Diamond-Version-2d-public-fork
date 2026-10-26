# Open-source assets

Licence-clean open-source asset options for the Menu Creator, UI Creator and
Panel Frame Editor. Read the machine-readable listing in
`src/lib/openSourceAssets.ts` (`OPEN_SOURCE_ASSETS`, `openSourceAssetUrl()`,
`openSourceAssetsByKind()`, `openSourceAssetsByCreatorUse()`). Wiring the creator
components themselves to this listing is a later batch — this batch ships only
the assets + the listing, and touches no existing component, settings row, font,
title scene, menu, save or audio file.

## Shipped (87 assets + 2 docs, licence verified at download via GitHub API)

| Pack | Files | Licence | Attribution | Source fetched from |
| --- | --- | --- | --- | --- |
| Kenney UI Pack + particle shapes | 60 | CC0-1.0 | Not required (credited anyway) | iwenzhou/kenney (CC0-1.0 repo licence + LICENSE.md) |
| game-icons | 25 | CC BY 3.0 | REQUIRED — see ATTRIBUTION.md | game-icons/icons (license.txt decoded) |
| 0x72 DungeonTileset II v1.2 | 2 | CC0 | Not required (credited anyway) | cjdaly/CircuitDungeon mirror README quoting the author's CC0 statement |

Kenney breakdown: panels 13, buttons 12, bars 15, cursors 3, icons 5 (incl. 2
arrows), sliders 2, dropdowns 3, particles 7. Game-icons: 25 SVGs (12 Lorc, 9
Delapouite, 2 Sbed, 1 Carl Olsen, 1 Skoll). All PNGs were magic-byte verified
and all SVGs verified to start with `<svg>` at download.

## GAP — labelled, not shipped, not claimed

- **OpenGameArt**: no single pack was named in the brief and no OpenGameArt pack
  could be fetched and licence-verified through the GitHub API in this session.
  Needs a named pack + a parent browser download, or a Mars upload.
- **Free Pixel Loops CC0 fire/smoke/auras**: do NOT blind-retry. The earlier
  itch.io download failed at the thanks page with no artifact. Needs a parent
  browser takeover or a Mars upload.
- **Behance fonts (Kilo/Roadam) and the custom logo font**: show-first items —
  they stay GAP/pending until Mars sees the actual files. Not claimed shipped,
  and not part of this batch (fonts batch owns them).
- **Audio**: this batch touches no audio. Settled roles for reference only — BOOT =
  UI Art Option B rising arpeggio, PRESS-START = M3 Mochii Chirp (PR #36); M3 is
  NOT the boot sound. Wiring those slots belongs to the audio batch, not this one.

## What was NOT changed

No existing file was modified or deleted. No package.json / package-lock change.
No title scene, Settings rows, fonts, main menu, saves, or other batches' files.
No Pokemon content of any kind.

