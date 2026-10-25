# WORKLOG — Mochiichao-Diamond-Version-2d-fresh-start

Per docs/NO-DATA-LOSS-RULES.md §5: date, agent, branch, what, why, source,
backups made. No secrets in this file. Additions only unless a deletion is
named in the commit message and approved.

## 2026-10-25 — Muse, branch feature/unified-data-sprites-2.5d
- What: Added docs/QUEUE.md (full work queue, nothing-left-behind list) and
  this WORKLOG.md. No existing file changed, no file deleted.
- Why: Mars asked 2026-10-25 to queue all outstanding work in the repo, to
  push it, to make it playable/testable/merged, to build custom Mochiichao
  sprites and the proprietary Mochiichao universe, and to log the development
  conversation in the repo.
- Source: Mars / Muse conversation 2026-10-25, including: expansion build
  order, Chao Garden conversion, 50-item pull list, sprite / 2.5D work,
  cheat console + emulator-like features, decomp extraction, Gmail cleanup,
  private-duplicate question, GB Operator question, Kaggle + Netlify hookups.
- Backups: none needed — new files only, no asset replaced, no binary added.
- Deletions in this change: NONE.
- Status at write time: branch local only, not yet pushed. Push + PR + build
  check + gitleaks + CI are the next steps before any merge, per the merge
  gate in docs/NO-DATA-LOSS-RULES.md §3.

## 2026-10-25 — Muse, branch feature/unified-data-sprites-2.5d (study copy)
- What: Persistent work clone at ~/workspace/mochiichao-work/fresh-start
  (home disk, not /tmp). Submodules pulled one at a time:
  pokefirered-leafgreen @ ce6406d8, pokeheartgold @ 69881586.
  pokebw2 pull in progress at log time, not yet verified.
- Why: The earlier /tmp clone was lost when submodule init hit /tmp's
  512 MB tmpfs limit (pokebw2 alone ~356 MB, out-of-diskspace).
- Source: repo main + pret/pokefirered, pret/pokeheartgold submodules
  already declared in .gitmodules on main.
- Backups: submodule pointers on main are unchanged by this study copy.
  No main push, no submodule pointer change in this branch yet.
- Deletions: NONE.

## Earlier context (from conversation, not a commit in this branch)
- 2026-10-24: repo renamed to Mochiichao-Diamond-Version-2d-fresh-start,
  public, private mirror untouched. Three decomp submodules added to main
  via PRs #4 (HeartGold + FireRed/LeafGreen) and #5 (Black 2).
- 2026-10-25 audit: React/Vite/TS web game, 12 species in species.ts,
  ~36 moves in moves.ts, CSS/emoji renderer, no image sprites,
  SpriteGenerator placeholder model, global_roster.json 47 entries with
  2 JSON bugs (fixed locally, HP guess 45 for Pebblefist NOT confirmed).
- Mochiichao identity per Mars: Chao Garden + Pokemon, plus Digimon and
  other raising / breeding / farming games. Conversion plan is: copy real
  files in for study, convert to Mochiichao style / universe / canon, build.
