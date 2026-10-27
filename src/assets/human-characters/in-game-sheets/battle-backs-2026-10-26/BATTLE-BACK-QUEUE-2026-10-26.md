# Battle Back Queue — Swappable-Character / Character-Select System
Date: 2026-10-26. Status: ART ONLY, staged show-first. NOT PR'd, NOT wired, NOT on main.
Order: Mars 2026-10-26 ~20:05 CDT — make ALL missing battle backs now (art), code only the backs
the current game absolutely needs right now, queue the rest for the future swappable-character /
character-select system. The coding of these backs is a SEPARATE coordinator's job; this document is
what that coordinator consumes later.

## How Pokemon decides a back is needed (the rule applied here)

In the Pokemon decomp structure a human character needs a battle BACK sprite (player-side figure)
only when the game ever shows that character from behind in battle. That happens in exactly these cases:
1. Playable character — the player IS that character (character select / swappable player).
2. Tutorial moment — the game shows that character battling as the player-side figure.
3. Watched battle — the player watches that character battle someone else, from their side.
4. Team member — that character is on the player's team and is shown as the player-side figure.
A battle OPPONENT needs only a battle FRONT. That is why, today, dojo leaders, admins, and bosses
show fronts in battle and need no back in current code — and why every back below is queued, not coded now.

## Audit (432 set = 54 characters: core 35 + dojo/elite 9 + admin 10)

- Already HAD a true battle back before this batch: 30/54 = 55.6%
  (core 20/35, admin 10/10, dojo/elite 0/9).
- Made in this batch: 24/24 = 100% of the missing backs.
- After this batch, battle-back art on files: 54/54 = 100% of the 432 set.
- Wired NOW (current game code needs): 0/24 = 0% of this batch — none of these 24 appears today
  as a BattleView player figure, a tutorial player-side figure, a watched-battle figure, or a team
  member. The backs the current game does need (Players A–D, presets) already existed and are untouched here.
- Queued for character-select wiring: 24/24 = 100% of this batch.

## Queue list — art done staged, wiring queued, not coded yet

Folder for every file below:
`~/workspace/mochiichao-work/human-characters/in-game-sheets/battle-backs-2026-10-26/`

### Priority 1 — Dojo / Elite (9/9) — future playable + watched battles
These are battle opponents today (front only). Their backs are needed the moment any of them
becomes playable via character select, appears in a tutorial battle, or is watched battling.

| Character | Back file | Pokemon-style need case | Status |
|---|---|---|---|
| Tetsu (Dojo 3) | dojo-elite-tetsu-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Kenji (Dojo 4) | dojo-elite-kenji-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Phantom (Dojo 5) | dojo-elite-phantom-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Shizuku (Dojo 6) | dojo-elite-shizuku-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Homura (Dojo 7) | dojo-elite-homura-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Umi (Elite 1) | dojo-elite-umi-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Gin (Elite 2) | dojo-elite-gin-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Hono (Elite 3) | dojo-elite-hono-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Yoru (Elite 4) | dojo-elite-yoru-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |

### Priority 2 — Core baseline leaders / bosses / story battlers (6)
Battle opponents or story figures today (front only). Backs needed for playable / watched / team use.

| Character | Back file | Pokemon-style need case | Status |
|---|---|---|---|
| Lin (Dojo 1 leader) | lin-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Castagnoli | castagnoli-battle-back-2026-10-26.webp | Playable / watched battle (rose default; staff variant NOT used) | Art staged, wiring queued |
| Champion Mythar (human) | champion-mythar-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Cowboy Farmer | cowboy-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Hoshino | hoshino-battle-back-2026-10-26.webp | Playable / watched battle | Art staged, wiring queued |
| Hacker Grunt | hacker-grunt-battle-back-2026-10-26.webp | Playable / team member (if a grunt joins) | Art staged, wiring queued |

### Priority 3 — Core baseline staff / officials / townspeople (9)
Non-battlers or generic NPCs today. Backs needed only if character select ever lets the player
be them, or if a tutorial/watched scene shows them battling. Lowest wiring priority, art complete.

| Character | Back file | Pokemon-style need case | Status |
|---|---|---|---|
| Announcer (Arena) | announcer-battle-back-2026-10-26.webp | Watched battle / playable only | Art staged, wiring queued |
| Lab Assistant | lab-assistant-battle-back-2026-10-26.webp | Playable / tutorial only | Art staged, wiring queued |
| PC Clerk | pc-clerk-battle-back-2026-10-26.webp | Playable only | Art staged, wiring queued |
| Garden Race Official | garden-race-official-battle-back-2026-10-26.webp | Playable / watched battle only | Art staged, wiring queued |
| Flame Tee townsperson | flame-tee-battle-back-2026-10-26.webp | Playable only | Art staged, wiring queued |
| Junkyard townsperson | junkyard-battle-back-2026-10-26.webp | Playable only | Art staged, wiring queued |
| Logo Tee townsperson | logo-tee-battle-back-2026-10-26.webp | Playable only | Art staged, wiring queued |
| Racing townsperson | racing-battle-back-2026-10-26.webp | Playable only | Art staged, wiring queued |
| Terra | terra-battle-back-2026-10-26.webp | Playable / watched battle (Warp A current) | Art staged, wiring queued |

## Already had a back — NOT regenerated (30/54)

Admin 10/10: Voss, Ferren, Marlow, Tamsen (redesign), Corvin, Ilsa, Aldous, Mireille, Cassian, Soren.
Core 20/35: Player A, Player B, Player C, Player D, Hex, Aeon, Mochiko, Mom Black, Mom East Asian,
Mom Latina, Mom White, Dojo Student, Garden Keeper, Tech Tinkerer, Shopkeeper, Krix, Syndicate Grunt,
Liberation Front, Lark, Ferry Captain.
Presets E–H also have backs but are OUTSIDE the 432 count and are not counted above.

## NOT in this batch — separate gaps, do not confuse with battle backs

- Falk (Dojo 2 leader) and Luigi (Dojo 8 leader): NO files at all in `in-game-sheets/` — they are
  not in the 432 set, so a back alone cannot be made for them. They are a full-character gap
  (front/world/walk/portrait/back), not a battle-back gap. No back was invented for either.
- Old Tamsin files: DO NOT USE / superseded. The Tamsen redesign back already existed and was not remade.

## What the wiring coordinator still owes for these 24 (not done here)

1. Mars eye-check on all 24 backs (flags are in the three batch manifests below).
2. A PR that adds the 24 backs + atlas/step-8 integration. NOTE, honestly: the three batch
   manifests below are staged, but NO atlas file and NO step-8 JSON was edited in this batch —
   shipped atlases were not touched, per the art-only brief. Atlas-cell and step-8 updates belong
   to that PR/wiring step, not to this staged art.
3. Wiring per character into `humanSheets.ts` slots + routing, ONLY for the cases in the
   "Pokemon-style need case" column, once character select / watched-battle / team code exists.
   Until then: wired-now stays 0/24 for this batch, by Mars's 20:05 order.

## Batch manifests (per-character reference, attributes, flags)

- [battle-backs-dojo-elite-manifest-2026-10-26.json](sandbox://workspace/mochiichao-work/human-characters/in-game-sheets/battle-backs-2026-10-26/battle-backs-dojo-elite-manifest-2026-10-26.json)
- [battle-backs-core-baseline-a-manifest-2026-10-26.json](sandbox://workspace/mochiichao-work/human-characters/in-game-sheets/battle-backs-2026-10-26/battle-backs-core-baseline-a-manifest-2026-10-26.json)
- [battle-backs-core-baseline-b-manifest-2026-10-26.json](sandbox://workspace/mochiichao-work/human-characters/in-game-sheets/battle-backs-2026-10-26/battle-backs-core-baseline-b-manifest-2026-10-26.json)

## Flags carried (full detail in the manifests — Mars eye-check owed on each back)

- Dojo/elite: Tetsu belt-pouch side may be mirror-flipped, jacket rivets interpreted; Kenji sash
  knot/tail interpreted; Phantom back bow is generator-invented (front sash ties at front) — a
  re-render without it may be wanted, sword diagonal and mask band inferred; Shizuku wristband
  side may be flipped, wave layout interpreted, battle-front shoes used not world sandals; Homura
  flame layout and hem interpreted, one trouser stripe position ambiguous; Umi coat merges
  capelet + side panels (interpreted), sash tail side unconfirmed; Gin chevron/V panel interpreted,
  battle-front tall boots used not world ankle boots, chain drape unresolved (no chain drawn);
  Hono skirt hidden behind closed coat back (coverage, not a confirmed match), flame layout
  interpreted; Yoru wristband side may be flipped, coat closed at back.
- Core A: Announcer braid arrangement inferred, mic boom peeks at side; Castagnoli rose position
  inferred, belt buckle renders on the back (eye-check owed); Champion Mythar robe back panel
  invented, front-held glowing orb correctly absent; Flame Tee back flame follows the step-8
  walk-back precedent (mirror kept for Mars to decide); Garden Race Official jacket back floral
  layout inferred, source front filename is truncated (`battle-fr`) in the folder; Hacker Grunt
  hoodie-back circuit layout inferred, neck mask correctly absent; Hoshino belt buckle panel on
  the back (eye-check owed), rhinestone layout inferred.
- Core B: Junkyard back patch number/positions generator-invented (no canonical back-patch map);
  Lab Assistant back red patch position follows the step-8 patchwork note but is not
  front-confirmed, back collar reads slightly hood-like; Lin trouser gold stripe runs inner leg
  in the back vs. outer side in the front (possible render error); Logo Tee ponytail centred
  down the back vs. side-swept in the front; PC Clerk jacket back blocking interpreted
  (horizontal teal-over-cream vs. front vertical split), wrist-device side may be flipped;
  Racing checkered band mirrored as expected for a true back (confirm the mirror); Terra blonde
  streak side may be flipped, dragon wrap does not continue onto the back (unknown from front alone).
- All core-A backs: plain light-grey backgrounds like the front sheets, NOT transparent —
  transparency is a later step if the game needs it, not claimed here.
