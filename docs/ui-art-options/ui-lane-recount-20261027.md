# UI lane recount — 2026-10-27 (read-only: no PR, no merge, no publish, no deletions)

Repo: mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start (PR-only; main blocks direct pushes).

## Headline

- **Main head verified via GitHub API: `60b5e62d475664d3cca8edc43b44641e742ae574` ("Environment tiles step 3 (#289)").**
- Tree snapshot: `7f116702` (merge of #279, World lane). Merges landing during this recount were file-checked
  and UI-free, so the UI tree is unchanged to the final head: #286 (116 files, 0 UI-ish), #287 (3 files, 0),
  #289 (6 files, 0). Task's starting head b79529fc (07:18 CDT) is superseded; the only UI-lane merge since
  it is #285. The "8-merge wave" (#273–#278, #280, #281) holds no UI Art menu system (battle-math, maps,
  trainers, garden, saves, overworld, Ink hookup, opponent VFX).
- **RECONSTRUCTED 40-system count: DONE 24/40 = 60%, PARTIAL 14/40 = 35%, NOT STARTED 2/40 = 5%.**
  Owed = 16/40 = 40%.
- **NOT a like-for-like delta vs old 28/40 = 70%.** No UI system left main. The original 40-item enumeration
  was not found in any file searched (see Method), so this list is reconstructed from the task's lane scope
  plus the lane checkpoint/show-and-tell record, re-verified item by item on current main. The gap vs 28/40
  is list composition (splits: skin defs/wiring, day/night spec/variants, creator export/asset-wiring; six
  open fix PRs counted as partial systems), not regression. Do NOT quote "28 → 24" as work lost.

## Method

Searched hidden_files/, files/, and mochiichao-work/ui-art/ for the 40 list: counts 26/40 (2026-10-26 08:06
drive baseline) and 28/40 (22:40, +1 for #259) are quoted in `ui-lane-100pct-drive-checkpoint.md` and
`ui-art-show-and-tell-2026-10-26-2240.md` without enumerating the 40 — hence reconstruction, labelled so.
Heads/PRs verified with read-only `hidden_files/gh-check.py` (GETs only). The bundled `github_api.py` only
implements `me`/`list-repos`, so content checks used the same surrogate-credential pattern (read-only
Contents/PR GETs; no credential values handled/stored). A depth-1 blob-less clone listed all 11,197 main-tree
paths (HEAD matched API head 7f116702 at snapshot); deciding files were then fetched per-file via the
Contents API and grepped (counts quoted per item). Scratch clone deleted afterwards. The dirty work clone
was untouched. Rule: DONE = merged on main; an open PR is PARTIAL at best, never DONE. Live not counted:
gh-pages was still `6544bd58` (#272 build) at first check — merged ≠ live, no live claim made.
Correction: the 07:38 CDT show-and-tell line "skins wiring still owed" is WRONG — all five views import the
skin module (item 19); the checkpoint's #156 wiring claim is what the code supports.

## Counted list (RECONSTRUCTED)

### A. Title & boot — 7 done, 1 partial

1. Locked default title — DONE. #137 merged 2026-10-26T12:07:33Z. LockedStage.tsx (99 lines, 1200x1500
   spec), logo PNGs in src/assets/ui/, pinned subtitle font.
2. v32 main menu restoration — DONE. Same #137; MenuList.tsx + MainMenuBackground.tsx on main. Caveat
   (playtest only): the 2026-10-26 phone double-render report has no separate fix PR in the open UI set;
   a live re-check after the next Pages rebuild is owed, but restored menu code is on main.
3. Interchangeable title start screens, wired — DONE. #259 merged 2026-10-27T03:38:18Z (10 presets, video
   + TitleScene + locked overlay). titleStartScreens.ts (11,991 B, key `mochiichao_player_title_screen_preset`),
   TitleStartScreen.tsx, Settings TITLE SCREEN + RESET TITLE SCREEN rows, IntroSequence TITLE branch
   (TitleStartScreen ×14), TitleScene `hideBackground` ×8. Trap fixes #270–#272, #283 all merged.
4. Preset-registry reconciliation (#157 defs + #199 wiring vs merged #259) — PARTIAL. Both PRs open;
   #259's registry/key is live; reconciliation 0/1. Mars explanation of the conflict still owed (~08:02 CDT).
5. PRESS ANY KEY removal from main title screens — DONE. #285 merged 2026-10-27T12:40:24Z (+62/−25, 0
   deletions); docs/title-press-prompt-removed.md on main. Residual TitleScene L937 PRESS ANY KEY sits
   inside the `startPrompt` wrapper block (off on presets) — retained by the order's scope, not a miss.
6. Intro sequence / boot flow — DONE. IntroSequence.tsx (55,675 B) on main, incl. preset TITLE branch.
   (Research docs are item 28, separate.)
7. Title painted backgrounds in title scene — DONE. 10/10 v2 files (snow/grass/water/sand/stone/forest/
   rain/night/mythar/lantern) + 10 phone 390x844 crops; titleBiomes.ts: `title-bg-` ×10, `backgroundImage` ×12.
   Key-art portrait on main is NOT a biome background and is not counted.
8. Title music wiring — DONE. #104 closed/merged (music only); mochiichao-title-v3.wav (+v2/v1/mixer stems)
   on main. (Audio-lane overlap noted; counted as a title-lane deliverable.)

### B. Menus — 11 done, 2 partial

9. Settings menu — DONE. SettingsScreen.tsx (71,199 B), SKIN rows (19) + TITLE SCREEN row (3).
10. Pause menu Y2K styling — DONE. pause.y2k-skins.json on main; `pause-y2k` ×5 in index.css (verified).
11. Bag menu Y2K styling — DONE. BagView.tsx; bag.y2k-skins.json; `bag-y2k` ×5 in index.css.
12. Shop menu Y2K styling — DONE. ShopView.tsx; shop.y2k-skins.json; `shop-y2k` ×5 in index.css.
13. PC storage menu — DONE. PcView.tsx (9,398 B): `menuSkin` ×5, `data-menu-skin` ×2.
14. Party/roster menu — DONE. RosterView.tsx (15,220 B): `menuSkin` ×4, `data-menu-skin` ×1.
15. Save menu — DONE. SaveMenu.tsx (6,039 B): `menuSkin` ×5, `data-menu-skin` ×1.
16. Battle HUD/menu — DONE. BattleView.tsx (32,989 B): `menuSkin` ×10, `data-menu-skin` ×1. (Battle math
    itself is other lanes'; the UI-skin wiring is what's counted.)
17. Dialogue box — DONE. DialogueBox.tsx (10,945 B): `menuSkin` ×7, `data-menu-skin` ×2.
18. Per-menu Y2K skin preset definitions — DONE. #151 merged 2026-10-26T13:18:21Z (8 menus × 3 flavours).
    10 JSONs in docs/ui-art/menu-skins/ (the eight + gap-fill pc/party reusing bag values verbatim).
19. Per-menu Y2K skin wiring (5 menus + Settings rows) — DONE. menuSkins.ts (11,691 B) + menuSkins.css;
    all five views in 13–17 import it; Settings renders one SKIN row per menu. Default look unchanged
    unless a skin is picked. (Corrects the stale 07:38 "still owed" line.)
20. Day/night menu spec — PARTIAL. #153 open ("spec only, not wired"); zero day/night files on main.
    Mars ~08:02 decision (default day/night-activation setting over any theme) changes no main status.
21. Day/night menu variants wiring — PARTIAL. #212 open, stacks on #153, flagged DO NOT merge to main.

### C. Creator & editor — 2 done, 5 partial

22. Intro video creator (Phase 1) — DONE. IntroVideoCreatorScreen.tsx (30,842 B) + introVideoCreator.ts
    + locked-default JSON on main.
23. Start screen creator (Phase 1) — DONE. StartScreenCreator.tsx (15,490 B) + startScreenPreset.ts.
24. Creator Phase 2 video export — PARTIAL. #155 open. On main: `introVideoExport` ×0, EXPORT VIDEO ×0 in
    both creator screens. Export exists only in the PR.
25. Creator-component wiring to open-source asset listing — PARTIAL. #155 open. openSourceAssets.ts
    (27,610 B) IS on main, but `intro-video-creator`/`start-screen-creator` tags ×0 and OpenSourceAssetPicker
    ×0 in StartScreenCreator. Listing present ≠ wiring done. Mars ~08:02 chose rework-to-clean for #155.
26. Menu Editor (in-game, live preview, templates, pause + Mochioteka) — PARTIAL. #260 open; zero
    menu-editor files on main. Workspace shots/dist are not main. Mars ~08:02 editor expansion (per-line
    colour/font, per-panel/per-line alignment, label fill/outline, heart positions) adds scope, not code.
27. Painted menu backgrounds wired as menu backgrounds — PARTIAL. Files 10/10 (item 7), wiring 0/10:
    menuCustom.ts (425 lines) has `backgroundPainted: false` in all three defaults, header: "GAP (row
    present, labelled, no effect yet)". Mars ~08:02 APPROVED all 10 v2 paintings and ordered wiring 0/10 →
    10/10 — approval recorded, wiring not yet on main. (Its "8/8 biomes" comment is stale; set is 10/10.)
28. Intro/title research finish — PARTIAL. #154 open (+462/−0, docs only). On main only the pre-#154
    color-neurochemistry-design.md; Yellow-intro and Diamond-deep-title docs absent. Finish ordered ~08:02.

### D. Fonts — 1 done, 2 not started

29. OFL Y2K font files + rows — DONE. 17 files in src/assets/fonts/ (Yagiza ttf+woff, 01 Digitall, 13 OFL
    Google Y2K fonts, Press Start 2P); fonts.ts MAIN/MENU=Yagiza, DIALOGUE/SMALL/BATTLE=01 Digitall;
    DIAMOND VERSION subtitle pinned.
30. Behance Y2K typeface (Kilo, Roadam, rest) — NOT STARTED. 0 files on main; Kilo/Roadam ×0 in fonts.ts.
    Telegram route approved ~08:02, but no verified link found and no file landed — approval ≠ arrival.
31. Custom logo font (73 glyphs) — NOT STARTED. 0 shippable glyphs on main; 6/73 evidenced (A,C,H,I,M,O)
    workspace-only; workspace POC font REJECTED (unreadable shards), never PR'd. All 73 ordered ~08:02.

### E. Title-art fixes & broad batches — 0 done, 6 partial

32. Cloud/emblem title art — PARTIAL. #261 open (+#233). Base puffy-cloud.svg on main; exact-target work
    in open PRs only; workspace moving/closeup/phone proofs are not main.
33. Cloud shape fix (exact-TARGET placement) — PARTIAL. #233 open, transform-only. Separate from #261 (own
    PR, own merge call); merging them into one cloud system gives 39 items, done unchanged: 24/39 = 62%.
34. Logo orbit fix + side stars — PARTIAL. #215 open.
35. Formula symbols v2 + logo emblems — PARTIAL. #214 open.
36. Persona-mode dialogue presentation Tier 1 — PARTIAL. #167 open (presentation only, opt-in). Mars ~08:02
    rework-without-clobbering + Mysterious Figure silhouette: still open/future, not main.
37. Phase 4: every other system + workspace mods — PARTIAL. #249 open (additions only, not merged).

### F. Menu motion & creator playback — 3 done

38. Animated menu background (v32 motion) — DONE. MainMenuBackground.tsx (7,950 B): animation ×8, sway ×8,
    fade ×8, bob ×2.
39. Intro video playback from creator presets — DONE. IntroVideoPlayer.tsx (15,008 B), uses
    introVideoCreator (×1) + titleBiomes + pinned subtitle font.
40. Start screen playback from creator presets — DONE. StartScreenPlayer.tsx (17,093 B), uses
    startScreenPreset (×1) + titleBiomes + pinned subtitle font.

## How title lane 55/55 maps here

55/55 is NOT 55 UI systems. It is the title lane's finer-grained playtest checklist for ONE system family —
interchangeable title start screens + live playtest (desktop 10/10 presets, phone 390x844, reduced motion,
trap-fix rounds #270–#272/#283, all merged). It maps principally into item 3 (DONE), supporting items 5–7,
and adds ZERO items to the 40; never add it to 24/40. The press-prompt order's separate lane scope (55→60,
55/60 = 92% at order time, 60/60 after #285 + publish + live verify) is that lane's internal number, not
the UI lane's 40. Conflating 55/55, 60/60, and 24/40 triple-counts the same title work.

## Open UI PRs (21 open total at recount start)

#153, #154, #155, #157, #167, #199, #206, #212, #214, #215, #233, #249, #260, #261 — all read
mergeable_state=None (recomputing after #284/#279), a recompute state, not a conflict verdict; no merge
call made on it. Non-UI open: #282 (CI/test budgets), #288 (human wiring, opened during recount).
Closed/merged, individually verified: #279, #281, #284, #285, #286, #287, #289.

## What moves the count next (main-code terms only)

#154 → 25/40 = 63%. #155 reworked → 27/40 = 68%. #153 then #212 → 29/40 = 73%. #260 → 30/40 = 75%.
Painted-background wiring (Mars-approved) → 31/40 = 78%. #157/#199 reconciliation → 32/40 = 80%.
Fix PRs #233/#261/#215/#214/#206/#167 + #249 → 39/40 = 98%. Behance + custom logo font → 40/40 = 100%,
both gated on Mars-supplied files/direction. None claimed done here; open PRs stay partial until merged.

## NOT verified / could not verify

- Live behaviour: gh-pages `6544bd58` (#272 build) at first check; no live playtest here; code-on-main only.
- Build/test: no npm build/tsc run (out of scope for a read-only recount; home disk was 100% full — see
  below). Prior runs' build evidence cited, not re-run.
- Phone double-render report (item 2): not re-verified live; no fix PR in the open UI set; playtest caveat,
  not a separate system.
- Menu Editor workspace state (26): shots/dist not diffed; they don't affect the main-code count.
- #287/#289: file lists checked (0 UI-ish each); merge-commit SHAs beyond the branch head not re-resolved;
  no effect on the UI count.
- Environment: home disk 100% full (22 MB → 64 KB free across this recount as other workers wrote) and /tmp
  tmpfs nearly full at points — the same root cause as other workers' "No space left on device" errors. The
  first write of this file was truncated by it; this condensed version replaces it in full. Only this
  recount's own scratch was deleted; no other worker's files touched. No deletions recommended without
  Mars's word on what to free.

## Guard compliance

Read-only job: no PR opened, nothing merged, nothing published, nothing deleted from the repo, no repo file
changed; decision-gated branches (#212, #260, #249, rest) inspected read-only via API only.
