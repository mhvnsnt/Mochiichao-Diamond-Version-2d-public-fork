# HANDOFF — Mochiichao-Diamond-Version-2d-public-fork

**Last updated: 2026-11-22 (America/New_York).**
**Repo:** `mhvnsnt/Mochiichao-Diamond-Version-2d-public-fork` (PUBLIC, ~1.07 GB), default branch `main`.
**Purpose of this file:** any agent that picks up work here reads this FIRST, then the linked docs. It states what we've done, where we're at, and what we're working toward — so the owner can say "go to this repo, pick up the work" and you just know. Update this file in the same PR whenever the state changes (add, don't delete).

## 1. What this repo is

The OLD public Diamond repo — now REFERENCE ONLY. The description says it plainly: "MOVED — work now happens in the private repo mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start. This public fork is kept for reference only." (`MOVED-TO-PRIVATE-REPO.md`.) Diamond work lands in fresh-start, never here. Do not build here. Do not merge feature work here.

## 2. Where we're at

### DONE
- **Move notice (2026-10-28, PR #506 merged):** the moved notice landed.
- **M1 owner directive (2026-10-31, PR #507 merged):** M1 ONLY — M1 is the face, all game work to M1 + Crystal.
- **The move itself:** live Diamond work now happens in `Mochiichao-Diamond-Version-2d-fresh-start` (public, cleaned history, Stage B build 2026-10-29).

### IN PROGRESS
- **Open PRs — all stale / held, do not merge blindly:** #186 ([HELD] Batch 2 moves/learnsets/evolutions staged data — DO NOT MERGE, species-ID drift); #256 (Human dojo: Iwao Earth + Chrome, dual placement — DRAFT); #282 (CI + test budgets: atlas, bundle gate, Vitest scaffolding, Playwright/Lighthouse skeletons); #296 ([UNGATED — DO NOT MERGE YET] sprite lane disc-to-repo audit + Mars-word dossier, 2026-10-27); #322 (menu stack follow-up: pink heart mirrored, panel labels white + black outline — UNMERGED proposal, Mars judges renders first). Next step: none of these move unless the owner says so — several are explicitly marked do-not-merge. If any of them is still wanted, it gets redone against fresh-start, not merged here.
- Last push 2026-10-31. The repo has been frozen since the move.

### BLOCKED
- Not blocked — retired. Freezing is the intended state.

## 3. What we're working toward

Nothing is built here anymore. The goal for this repo is to stay a clean, readable reference of where Diamond was at the move — so anyone can look back at the pre-move history without disturbing live work. Live Diamond work is in fresh-start; Crystal is where everything lands.

## 4. Standing rules that apply here

- **Branch → PR → merge, always.** Never push to main directly. Add-only, zero-conflict PRs, no force pushes. (This applies to the HANDOFF itself and any reference fix — not to feature work, which does not belong here.)
- **Do NOT land feature work here.** Diamond work goes to `Mochiichao-Diamond-Version-2d-fresh-start`.
- **Do NOT merge the held PRs** (#186, #296) — they are marked DO NOT MERGE for real reasons (species-ID drift, ungated audit). If the work is still wanted, redo it against fresh-start.
- **Checkpoint-and-save law:** CHECKPOINT.md first, update after every step; the repo is the save; resume, never restart.
- **No-temp-storage law:** nothing in /tmp or any wipeable location, ever.
- **Real-source-only:** every part comes from the actual source code and files, wired up fully. No hand-tooled lookalikes.
- **M1 ONLY directive (owner, 2026-10-31):** M1 is the face; all game work goes to M1 + Crystal.
- **Sanitize rule:** cries, literal dialogue, logos, and images never go in.

## 5. Key files and paths

| What | Where |
|---|---|
| Move notice (read first) | `MOVED-TO-PRIVATE-REPO.md` |
| M1 directive | `M1-OWNER-DIRECTIVE.md` |
| Canon / work log | `AGENTS.md`, `WORKING-METHOD.md`, `WORKLOG.md` |
| Live Diamond repo | `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start` |
| Crystal (where everything lands) | `mhvnsnt/Mochiichao-Crystal-Version-2d` |

## 6. Open decisions needing the owner

- **Held PRs (#186, #256, #282, #296, #322):** close them, or redo the wanted ones against fresh-start. His call — lanes do not merge or revive them on their own.
- **Whether this fork stays public:** his call. Until he says otherwise, it stays as the public reference.

## 7. How to pick up

1. Read this HANDOFF.md first, then `MOVED-TO-PRIVATE-REPO.md`.
2. **Do not start Diamond work here.** Go to `Mochiichao-Diamond-Version-2d-fresh-start` and read its HANDOFF.md instead.
3. The only work that belongs here: reference fixes and this HANDOFF.md itself, branch → PR → merge, add-only.
4. Update this HANDOFF.md in the same PR when the state changes.
