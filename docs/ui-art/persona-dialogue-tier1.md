# Persona-mode dialogue presentation — Tier 1 (presentation only)

Status: implemented, PR-open (not merged — merge is a parent call).
Base: main at PR #164 merge (5ef3003c). Branch: feature/persona-dialogue-tier1-1.

## What Tier 1 is

A presentation mode for dialogue scenes. Same characters, same dialogue
text, same typewriter / paging / choice behaviour — only the framing
changes while the scene runs, and it reverts when the scene ends (the
framing lives inside `DialogueBox`, so unmounting the box removes it).

Framing, style principles only (no Persona art, fonts, or music copied):

- Letterbox-style top and bottom bars (48 px, black, pointer-transparent,
  under the box so taps and controls still pass through).
- Larger speaker portrait while framed (96 px vs the default 56 px),
  using the speaker's existing `HumanPortrait` slot art — no new art.
- Emphasis treatment: wider speaker-name letter-spacing plus a gold
  accent rule under the name (StdWindow palette gold `#fbbf24`, the
  repo's own accent). Name text itself is unchanged — no nameplate work.

## Opt-in / non-default — the rule that protects the locked default

`DialogueBox` defaults to `presentationMode="default"`, which renders
exactly as before (no bars, no size change, no accent). Persona framing
appears ONLY when a scene explicitly selects it. Nothing here changes
the locked default title, the v32 main menu, or any default dialogue
look. No settings row was added (a global toggle would make it a
default, not a scene choice).

## Who gets it (Tier 1 only — 2 characters, 1 wired)

| Character | Wired? | Hook |
|---|---|---|
| Luigi Castagnoli | YES | Castagnoli Island NPC `id: "luigi_castagnoli"`, name "Luigi Castagnoli" (`src/world/FullWorldMaps.ts`), routed by `slotForNpc` on id/name containing "castagnoli" (`src/lib/humanSheets.ts`). `WorldEngine` passes `presentationMode="persona"` for exactly this speaker. His scene: the island dialogue, including the "...Let's battle!" follow-up lines — framing covers the whole scene, then reverts. |
| Mysterious Figure | NO — blocked, not guessed | No Mysterious Figure NPC, human slot, or dialogue scene exists in the repo (searched `src` + `docs`, 2026-10-26). The human-lane workspace research docs (`human-characters/mysterious-figure/`) are not game code and are not repo canon. No id, name, slot, scene, or nameplate was invented for this PR. |

Wiring the Mysterious Figure half needs one thing from the human lane:
a real NPC / slot / scene landed in the repo. When that lands, add its
canonical id/name to `personaPresentationForNpc` in
`src/lib/personaDialogue.ts` in the same castagnoli pattern — one
function, no `DialogueBox` change. Until then, that half stays at 0% by
design, not by omission.

## Files

- `src/lib/personaDialogue.ts` (new) — `DialoguePresentationMode`,
  `PERSONA_LETTERBOX_PX`, `personaPresentationForNpc`. The Tier 1
  allowlist lives here and nowhere else.
- `src/components/game/DialogueBox.tsx` (modified) — optional
  `presentationMode` prop; default path untouched; persona path adds
  bars, portrait size, and name emphasis only.
- `src/world/WorldEngine.tsx` (modified) — one prop on the existing
  dialogue render site: persona for Luigi Castagnoli, default for all
  others. `IntroSequence` (Prof intro), battle message panels, skins,
  presets, day/night, creator, backgrounds, cutouts, music, and sprites
  are untouched.

## Explicitly out of scope (queued, not this PR)

- Tier 2: light touches on other important beats.
- Any shroud, silhouette, or nameplate work for the Mysterious Figure.
- Any Persona art, font, or music asset; any new character, NPC, scene,
  or dialogue line; any change to dialogue text, paging, or choice flow.
- Any change to the default title, v32 menu, or default dialogue look.

## Verification

- `npm run build` (Vite) and `npx tsc --noEmit` on the branch — see the
  PR body for the recorded results.
- NOT verified: live playtest (no browser playtest in this run — a
  parent / Mars playtest should open Luigi Castagnoli's island dialogue
  and confirm framing appears for his lines only, then disappears when
  the scene ends; and confirm an ordinary NPC dialogue still looks
  exactly like the default).
- Deletions: 0. Force-push / rebase: none. Default title/menu: untouched.
