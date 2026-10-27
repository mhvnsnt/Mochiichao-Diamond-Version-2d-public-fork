# Luigi (Dojo 8) — identity check, 2026-10-27

VERDICT: **SAME PERSON. Do NOT generate a duplicate Luigi look.**

The "Luigi (Dojo 8)" slot and Luigi Castagnoli (atlas slot `castagnoli`,
shipped in art-ship PR #286) are one character. The gap is a
**naming/routing gap** — the Dojo 8 slot is labelled "Luigi" while the shipped
atlas is labelled "castagnoli" — not a missing-character gap. No new Luigi
art steps are generated here: **0 new steps, by design, not by omission.**
If a separate Dojo 8 Luigi were generated, it would duplicate the shipped
character and risk a second, conflicting look.

## Evidence (all re-verified from canon docs this run)

1. CANON-HUMAN-CHARACTERS.md — "DOJO 8 REVEAL LOCKED 2026-10-26 (Mars):
   Luigi is the Syndicate boss at Dojo 8 in Silicon Town, last dojo in
   Region 1, gate to Victory Route and the Plateau. He is displayed as
   'Mysterious Figure' until he appears, then the surprise reveal is Luigi."
   Same section locks "Luigi Castagnoli, man, Giovanni-level former Syndicate
   boss" and his current look: "v5 rose version is the regular default, staff
   version is dramatic-only".
2. Same file — the Dojo 8 reveal "supersedes the 'not current control' note
   for Dojo 8 only" and is explicitly "his comeback out of retirement for
   Dojo 8", with the FireRed Giovanni / 8th-gym parallel (met earlier as the
   boss, returns as the 8th leader).
3. SYNDICATE-ADMINS-2026-10-26.md — "Overall Hacker/Syndicate leader = Luigi
   Castagnoli. Decoy leader in front = Jax... Luigi is the real leader behind
   the decoy." And the locked dojo-leader list ends "...Shizuku, Homura,
   Luigi" — the same Luigi, in the same breath as the Syndicate leadership.
4. DOJO8-TEAM-PICK-2026-10-26.md — "Boss displayed as 'Mysterious Figure'
   until reveal, then Luigi Castagnoli (Dojo 8 boss lock stands)."
5. Shipped atlas evidence: in-game-sheets/castagnoli-atlas-64x64.png +
   castagnoli-atlas-manifest.json + castagnoli-step8-2026-10-26.json exist,
   built from the v5 rose reference (antagonists/castagnoli-v5-rose-uploaded-source.jpg).
   The v1 Latina-woman image is explicitly superseded / NOT canon
   (CANON-HUMAN-CHARACTERS.md, named-canon check rule) and was not used.

## What proves there is NO separate person

There is no second Luigi anywhere in the canon docs: no second surname, no
second look, no second team, no second reveal, and no doc distinguishes a
"Dojo 8 Luigi" from "Castagnoli Luigi". Every Dojo 8 mention resolves to the
same reveal (Mysterious Figure → Luigi Castagnoli) and the same Syndicate
boss. The only two Luigi-adjacent variants in canon are look variants of the
same man (v5 rose = default; v4 staff = dramatic-only), not two people.

## Action for the parent (routing, not art)

- Route the Dojo 8 boss slot to the existing `castagnoli` atlas (v5 rose
  default; v4 staff for dramatic-only beats), with the UI display name
  "Mysterious Figure" until the reveal, then the reveal name — nameplates by
  the UI layer after approval, never by the generator.
- Do NOT create a `luigi` atlas slot, a `luigi` step-8 file, or a second
  portrait. Any future Dojo 8 art need is a castagnoli-variant need (e.g. a
  battle back only if he becomes a playable/swappable battler — flagged as
  owed-only in the Castagnoli step-8, not hidden).
- Count: Luigi-as-separate-character steps done **0/8, correctly 0%** —
  because the character already exists as Castagnoli at 8/8 in its own slot.
  Counting a second 8/8 would double-count one person.

## Likeness note (for any future Castagnoli variant)

Reference image first, then visible attributes only, in order (face, skin,
hair, eyes, shirt pattern, collar, tie, belt, trousers, boots, prop, pose),
framing/style separate. Never put the character's name in a generation prompt:
a 2026-10-26 prompt using the name drew Nintendo's Luigi, green cap, not this
character (LIKENESS-GENERATION-RULE.md).
