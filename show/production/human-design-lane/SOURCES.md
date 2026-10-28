# SOURCES — AUDIT OF THE HUMAN-DESIGN MATERIAL IN THE REPO

**Audited:** 2026-10-27, read-only, via the GitHub PAT connector (contents API walk; the recursive git-tree call truncates at ~5.7 MB, so the tree was walked directory by directory). Repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`.
**Local copies:** all 43 text files of `docs/human-characters/` (284,980 B) plus 4 related `docs/` files are mirrored at `~/workspace/human-design-lane/_sources/repo/` for this lane's working use. The 9 JPG show sheets were inventoried, not downloaded (165–235 KB each; they are staged per the staging law when the lane lands).

**Headline:** the repo holds a complete, owner-locked design grammar for humans — a style guide, a diversity rule, a canon cast file with v2 sheets of record, a representation canon, a likeness-generation rule, an 8-step completion standard, and ~432 counted steps of R1 human art (on files; see §4 for the on-files vs on-main distinction). What it does **not** hold is any locked look for most post-R1 humans — that absence is exactly what the queue (`CAST-QUEUE.md`) is for.

---

## 1. The grammar documents (what each contributes)

| Repo path | Contributes |
|---|---|
| `docs/human-characters/CANON-HUMAN-CHARACTERS.md` | **The cast of record + the diversity rule** (owner, 2026-10-25): no default to white/pale; every new character gets a named race/ethnicity in prompt and canon file; batch checked as a set. Players A Black / B East Asian / C Latina / D white-blonde. V2 sheets of record for Mochiko (East Asian), Hex (Black primary; pale v1 kept as variant), Aeon (Black primary; v1 variant), Mom (race varies with player pick; constant = low bun, teal apron, mug). |
| `docs/human-characters/STYLE-GUIDE.md` | **The locked human finish** (2026-10-25): clean 2D anime cel, full-body front, light grey bg, no shadow pool/text; eyes/nose/mouth spec; face ≈1/6–1/7 body; ~6–7 heads; bold separated hair reading as silhouette; flat colour + cel shade; outfit simplicity rules (no layered shorts-over-leggings, no crystal pods, no stacked accessories); anchors Player D (primary) + Player A. Records the identity-bleed failures and the one-at-a-time text-only rule. |
| `docs/representation-canon.md` | **Representation canon, LOCKED 2026-10-26** (owner's verbatim words in-file): approved trait list; cool-not-generic register; two tracks only; never named/explained in dialogue; no token singles; no stat penalty / no cure-as-reward; show-first always; vitiligo = test case. Also resolves: no separate parents'-race selector. |
| `docs/canon-draft-likenesses.md` | Draft likeness notes bridging game canon and the design files (working layer under the canon file; drafts, not locks). |
| Likeness-generation rule *(cited in-repo; file itself not in the walked tree — see §5)* | Reference image first, then visible attributes only, in order: face, skin, hair, eyes, shirt pattern, collar, tie, belt, trousers, boots, prop, pose; framing/style separate; **never the character's name in a prompt**. Named-canon check rule: a named character with no look in canon is marked UNVERIFIED/proposal — never silently invented. |

## 2. The working record (conversations, checkpoints, manifests)

| Repo path | Contributes |
|---|---|
| `docs/human-characters/CONVERSATION-LOG-2026-10-25.md` | The design conversation of record: how the v1→v2 cast, the style locks, and the corrections were actually decided; Player B v3 / C v3 later reacted 👍 by the owner (treated as approved for in-game sheet work). |
| `docs/human-characters/README-HUMAN-CHARACTERS.md` | Lane orientation: where the human material lives and how the folder is organised. |
| `docs/human-characters/CHECKPOINT-2026-10-26.md` | Counted state at 2026-10-26: R1 scope 34 characters, 115/272 steps at checkpoint time (superseded by the recount below). |
| `docs/human-characters/GAP-CHECKLIST-ACTUAL-GAMES.md` | **The 8-step completion standard**, derived from FireRed/HeartGold structure: model sheet → world F/B/L/R → walk → battle front/back → portrait → special variants only where earned → data → 64×64 atlas + manifest. Plus the change procedure (owner's words only; new filename; old kept marked superseded; drift ≠ canon change; mocks ≠ canon). |
| `docs/human-characters/HUMAN-LANE-SHIP-MANIFEST-2026-10-27.md` | Ship state 2026-10-27: three-quarter sets 25/26 shipped; the RACING set still owed (generation failed at the tool 2026-10-26, not retried at manifest time; the recount shows it on files — shipping, not existence, is the gap). |
| `docs/human-characters/human-lane-100/human-lane-100-RECOUNT-2026-10-26.md` | Recount 2026-10-26 17:40: **327/432 steps on files** at recount time (core 235/280, dojo/elite 72/72, admin 20/80), with the admin verification note superseding admin to 80/80 on files. |
| `docs/human-characters/human-lane-100/human-lane-100-pr-manifest-2026-10-26.md` | **The closing-delta draft PR** (`feature/human-lane-100-art-20261026`, additions-only, 263 files, DRAFT — do not merge on the manifest's strength): ships core to 280/280 and dojo/elite 72/72 on files; admin 72/80 — **Tamsen held out completely** (see §3). Records the owner eye-check confirmations of 2026-10-26 (~18:39 CDT: core batches 1–8, Lark 8/8, admins Marlow/Corvin/Ilsa/Aldous/Mireille/Cassian/Soren, dojo/elite Tetsu/Kenji/Phantom/Shizuku/Homura/Umi/Gin; Voss + Ferren ~18:02; Hono + Yoru ~17:40 blanket; Ferry Captain Merv 8/8 locked 17:34). States plainly: 424/432 is an **on-files** count, not an on-main count; a baseline-consolidation decision is still owed. |
| `docs/human-characters/manifest-named-canon-batch1.md` | 2026-10-25 batch record: v1 model sheets for Hex / Aeon / Mochiko / Mom with eye-check notes (the v1 layer the v2 canon file supersedes; kept as history). |
| `docs/human-characters/manifest-players-batch1…` + `player-a-portrait-2026-10-27.json` | Player batch manifests; Player A portrait correction (brown eyes) staged **show-first only, not wired**. |

## 3. Per-character and per-group design records

| Repo path | Contributes |
|---|---|
| `docs/human-characters/falk-brief-and-gaps-2026-10-27.md` | **The #1 fresh-design gap, documented.** Falk, Dojo 2 leader (Aero / Wind Fragment, Stoneport area): dialogue APPROVED 2026-10-26 (voice seeds "I'm high as a kite", "free like a bird" — voice is not a look); art **0/8**; **no locked look anywhere** — no face/skin/hair/eyes/age/build/outfit/prop on record. Team-lock **conflict** across lane docs (Aero team 019 Zephling Lv18 / 020 Aerobeak Lv19 / 021 Stormtalon Lv20 called LOCKED in two docs vs "REPLACE placeholder, not owner-confirmed" in others; code placeholder = single Sproutle). Owner must supply look basics or an approved reference + team confirmation before any generation. |
| `docs/human-characters/luigi-dojo8-identity-check-2026-10-27.md` | Dojo 8 = **Luigi Castagnoli** (Syndicate boss, Giovanni-parallel; displayed "Mysterious Figure" until reveal). Current look v5 (rose) = default; v4 (staff) = dramatic-only. Shipped as atlas slot `castagnoli`, 8/8. Standing instruction: never generate a separate "Luigi". Jax is his decoy leader. |
| `docs/human-characters/DOJO-ELITE-VERIFICATION-2026-10-26.md` (+ `.json`, 48 KB) | Verification record for the dojo/elite nine — **Tetsu, Kenji, Phantom, Shizuku, Homura, Umi, Gin, Hono, Yoru** — at 8/8 on files (Lin also holds step-8 + atlas). The 9 JPG show sheets in `human-lane-100/` (`dojo-elite-show-{gin,homura,hono,kenji,phantom,shizuku,tetsu,umi,yoru}-2026-10-26.jpg`) are this set's presentation layer; **no Lin or Falk JPG exists**. |
| `docs/human-characters/dialogue-2026-10-26/show-sheets-2026-10-26/` (index + owed lists, admins sheet, 13 per-character sheets) | Show-first dialogue/design sheets. Notable: **Nurse Faye** (clinic; lavender nurse cap, pine-green scrubs, vitiligo in the design note; heal + battle dialogue drafted; approval PENDING; art 0/8). **Iwao** carryover + revision-owed sheets: Brock-mould mentor (different hair/outfit/name/dialogue — mould only, not a copy); recorded traits line/squint eyes, broad face, miner jacket; **dual placement stated locked per coordinator brief — first fight R2 Dojo 3 Chrome, return fight R3 Dojo 1 Core**; dialogue revision (9 lines) and carryover team both PENDING owner; no art. Town labels in these sheets ("Goldenrod", "Rustboro", etc.) come from a goal-workspace team file and are **working labels, not confirmed Mochiichao canon town names**. |
| `docs/human-characters/REPRESENTATION-RENAMES-IWAO-OPEN-DOJO-ADMIN-CODE-2026-10-26.md` | The Oct-26 open-slot tables (R2–R4 dojo/Elite/admin structure) + representation rename proposals: broker/performer → **Wisteria Vale** (rec.) / Seren Marlowe / Noa Quill; mechanic → **Tessa Bolt** (rec.) / Molly Gear / Dottie Sparks; cook → **Saffron Potts** (rec.) / Mina Simmer / Cleo Bunsen — **0/3 picked by owner**. Vitiligo cartographer: owner ordered the name simplified to "Voss", colliding with admin Voss — **UNRESOLVED** (rec.: cartographer becomes "Meridian", alt "Atlas"). **Riku Hayama ("Dash")** exists, explicitly NOT renamed. Admin structure (b): 2 per R1–R4 + 2 roving = **10 admins** — Voss (R1), Ferren (R1), Marlow (R2), **Tamsen** (R2 — spelling T-A-M-S-E-N per the PR manifest), Corvin (R3), Ilsa (R3), Aldous (R4), Mireille (R4), Cassian (roving), Soren (roving). |
| `docs/human-characters/human-lane-100/…` Tamsen record (in the PR manifest, §2) | **Tamsen's old look was scrapped completely by the owner 2026-10-26 ~18:39** (16 old-"Tamsin" files = DO NOT USE / superseded) and a redesign ordered. Her 8 steps are the admin set's only remainder: new design → shown → confirmed → shipped as follow-up. |
| `docs/champion-mythar-transform-2026-10-26.md` | Champion **Mythar** (creature #331) human↔creature transform: fight order locked (Hex first, then Mythar); system code 100%, BattleView wiring 0%; the `championMytharHuman` sprite + portrait **do not exist yet** as transform assets (Mythar step-8/atlas files in in-game-sheets are the creature side). |
| `docs/human-atlas-whitebox-fix-20261026.md` | Atlas production note (white-box fix) — pipeline record for step 8 work. |
| `docs/human-characters/dialogue-2026-10-26/ink-dialogue-draft-admins-faye….json` (31,883 B) | Dialogue draft data (admins + Faye). Dialogue, not design — inventoried for completeness; this lane does not design from it beyond what the briefs already cite. |

**Also on record in the walked tree:** Krix (dreadlocks + gold tooth canon), Syndicate Grunt, Liberation Front (current v2), Garden Keeper (front current v2), Dojo Student, Tech Tinkerer, Shopkeeper (portrait current v2 cel), Terra (current = Warp A), Hoshino (party proposal in canon), Cowboy Farmer Kid (party in canon; personal name still open), Lab Assistant, Hacker Grunt, **Ferry Captain Merv (LOCKED 8/8** — cap + belt device kept; per owner 2026-10-27 he is **also R2's Olivine lighthouse dojo leader, Dojo 5**), Arena Announcer, PC Clerk, Garden Race Official v2, **Lark** (Harbor City ferry-dock dispatcher, tide-board keeper; created for the previously unnamed 35th slot; clarified 2026-10-26: never anyone else, not a rename, not Merv; 8/8 confirmed).

## 4. Asset trees (art on record)

| Tree | Contents |
|---|---|
| `src/assets/human-characters/named-canon/` | V2 model-sheet webps + 631 B JSON sidecars for the named canon cast — the sheets the show rigs were built from. |
| `src/assets/human-characters/players/` | 4 player sheets + sidecars (A/B/C/D). |
| `src/assets/human-characters/in-game-sheets/` | **400 entries**; ~120 step-8 / atlas-manifest files covering ~50 characters incl. all 10 admins. **Caveat (per the PR manifest):** main holds only part of the staged total — the 432-step figure is an on-files count across staging + the draft PR branch; a baseline-consolidation pass is still owed before anyone claims 432/432 on main. |

## 5. Honest gaps — cited but NOT in the walked repo tree

These files are cited by the lane docs above but were **not found** in the repo tree as walked. They live in the original lane's local root (`~/workspace/mochiichao-work/human-characters/` — not on this VM) or in goal workspaces (e.g. `trainer-teams-all-regions.md` under `~/workspace/goals/mochiichao-fresh-start-repo/files/`, the source of the Oct-26 open-dojo tables):

- `LIKENESS-GENERATION-RULE.md` (the rule is quoted and followed in-repo; the file itself is absent)
- `SYNDICATE-ADMINS-2026-10-26.md` · `CANON-FILL-2026-10-26.md` · `MASTER-FALK-DIALOGUE-DRAFT-2026-10-26.md` · `mars-voice-dialogue-2026-10-26.md` · `dialogue-drafts.json`
- `POKEMON-PARITY-GAPS…`, `TEAM-VARIATION-SYSTEM-PROPOSAL…`, `MARS-DECISIONS-REMAINING…`, `LUSTRE-10-VARIANT-SPEC…`, `CAPSULE-STATS-FILL…`, `DOJO8-TEAM-PICK…` (all 2026-10-26)

**Supersession note:** the Oct-26 doc's claim "Region 2 — 8/8 dojo slots open" is superseded by the Oct-27 locks (Shimo, Rin & Ren, Nagisa, Delta, Kairos, Bannon, Merv). Where an Oct-26 table and an Oct-27 lock disagree, the lock wins and the table is history.
