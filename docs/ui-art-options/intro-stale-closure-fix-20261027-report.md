# ITEM 3 — Intro stale-closure bug fix: REPORT (no PR opened, deliberately)

Date: 2026-10-27 (CDT). Worker: UI Art lane subagent, ITEM 3 only.

## Outcome — STOPPED per task step 2, do not re-run this task as written

The bug described in the task is **already fixed on main**. The known fix
(add `introScene` to the any-key effect's dependency array) is already in
the live main code, together with a second guard (clamped scene index).
Forcing a "fix" would mean opening a no-change / comment-only PR against
the locked title file for no benefit, so no branch and no PR were created.

- **PR number/URL: NONE — no PR opened (see reason above).**
- **Files changed: 0, +0 / −0, 0 deletions.**
- **Branch `feature/intro-stale-closure-fix-20261027`: NOT created**
  (verified absent from the branch list before stopping).
- **NOT merged, NOT published to Pages** (nothing to merge/publish).
- **Locked default title and locked v32 main menu: untouched.**
- **Decision-gated PRs (#261, #260, #233, #215, #214, #212, #206, #199,
  #157, #155, #154, #153, #167): untouched.**
- **No commit/push from `~/workspace/mochiichao-work/fresh-start`**
  (that clone is dirty and its `IntroSequence.tsx` differs from main;
  it was not used for verification of main).

## Step 1 — main head verified via GitHub API first

- Repo: `mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start`
- Main head: `383d8fb59126f1694b2a0c67ed46820c50a265f5`
  (2026-10-27T12:40:23Z, "Merge pull request #285 …
  Remove PRESS ANY KEY text from main title screens (Mars 2026-10-27)")
- Authenticated as `mhvnsnt` via the `custom.github-api` helper.
- `src/components/IntroSequence.tsx` on main: blob sha prefix
  `7b9b9060f6ea4f37`, 1,018 lines, 55,675 bytes (fetched via Contents API).

## Step 2 — diagnosis checked against the actual main code (differs)

Task diagnosis: the keydown handler closes over stale `introScene`, so the
4th INTRO key press renders `scenes[4] = undefined` and black-screens;
fix = add `introScene` to that effect's dependency array.

What main actually contains (`src/components/IntroSequence.tsx`):

1. **The dependency fix is already there** — any-key effect, lines 326–346:
   handler `() => advanceIntro()` registered for `keydown` + `mousedown`
   while phase is BOOT / INTRO / TITLE, with dependency array
   `}, [phase, titleFading, introScene]);`
   The in-code comment is headed "Trap-fix round 3 (2026-10-27):
   introScene MUST be a dep" and describes exactly this task's bug
   (stale closure → `scenes[introScene]` undefined → `.title` throws,
   blanking the app; button clicks with a fresh render closure did not).
2. **A second guard is already there** — INTRO render, lines 377–385:
   `const scene = scenes[Math.min(Math.max(introScene, 0), scenes.length - 1)];`
   so even a hypothetical `introScene = 4` renders scene 3, never undefined.
3. `advanceIntro` (lines 268–280) is itself correct once the closure is
   fresh: INTRO: `if (introScene < 3) setIntroScene(s => s + 1); else
   setPhase("TITLE");` — i.e. the 4th press goes to TITLE, not to index 4.
4. No second copy of this bug: repo tree at main head (12,304 entries,
   not truncated) contains exactly one `src/components/IntroSequence.tsx`.
   The other `keydown` listeners in that file do not touch `introScene`:
   line 62 = NamePad (deps include `value`), line 255 = MAIN_MENU only,
   line 322 = preset-title R recovery (TITLE + preset only).
   `src/components/game/IntroVideoPlayer.tsx` (creator preset only, not
   the default intro path) also clamps its scene index (line 76).
5. Button-click behavior: unchanged, and was already safe (fresh closure
   per render) — untouched per task instruction.

So the task's premise ("add `introScene` to that effect's dependency
array") is satisfied by main itself. There is no remaining stale-closure
path in this file to patch.

## Step 4 — verification of the 4th key press (not from code reading alone)

Script: `~/workspace/mochiichao-work/intro-fix-tree/verify_intro_presses.js`
(run with node v24.22.1). It models React effect semantics faithfully
for this effect: a handler is re-registered only when its dep array
changes; the handler closes over the captured `introScene`/`phase`;
state updates use the functional updater as in the real code; render
uses the real scene list (4 scenes) and the real advance rule.

Results (verbatim, condensed):

- **A — buggy variant (deps `[phase, titleFading]`, unclamped render):**
  press 1 → scene 2, press 2 → scene 3, press 3 → scene 4 (index 3),
  press 4 → `introScene=4`, render THROWS
  `Cannot read properties of undefined (reading 'title')`.
  This reproduces the task's diagnosis exactly, confirming the model
  can detect the bug.
- **B — main as-is (deps include `introScene`, clamped render):**
  press 1 → scene 2, press 2 → scene 3, press 3 → scene 4 (index 3),
  press 4 → `phase=TITLE, introScene=3`, render `(phase TITLE)` —
  no throw, no undefined scene. Presses 5–6 stay in TITLE in this model
  (the 350 ms TITLE→MAIN_MENU fade timeout is not modelled; that is a
  stated model limit, not a crash and not a claim about the fade).
- **C — clamp alone, forced `introScene=4`:** renders scene 4's
  predecessor, "FIGHT BEAT" (index 3), defined, no throw.
- **D — button clicks (fresh closure):** 1→2→3→4th click → TITLE,
  matching the task's "button clicks are already safe".
- Assertions: `main-4th-press-goes-to-TITLE-no-crash: PASS`,
  `buggy-variant-reproduces-task-diagnosis: PASS`. Exit code 0.

Extra syntax check (not a build): the main `IntroSequence.tsx` file as
fetched parses cleanly under esbuild (tsx loader), exit 0, 39 KB output
to /tmp. This is a parse check only — it is NOT a vite build.

## Gates — what passed, what did not, and why

- Main-head verification: PASS (API, above).
- 4th-press verification: PASS (simulation above, main as-is).
- Full local vite build for this item: NOT RUN — and not claimed.
  Reasons: (a) there is no change to build; (b) home disk was 100% full
  (51 MB free) at run time, so a fresh `git clone` of the repo failed
  with "No space left on device", and a retry into /tmp timed out at
  120 s (repo size 580,645 KB per API, mostly assets/submodules);
  (c) the existing dirty `fresh-start` clone's IntroSequence differs
  from main, so building it would not gate main. Do NOT treat this item
  as "build passed".
- PR mergeable/clean gate: N/A — no PR exists to gate. If a parent still
  wants a paper-trail PR, it would have to be a no-op/comment-only
  change, which this worker recommends against (it would touch the
  locked title file for zero behavior change).

## Recommended parent action

Close ITEM 3 as "already fixed on main (trap-fix round 3 + clamp)" rather
than re-spawning it. If the parent's ITEM 3 list was written before
2026-10-27's trap-fix round 3 landed, that explains the stale premise.
The only follow-up worth scheduling is a live-browser 4-press playtest
on the next Pages publish (this worker cannot use the live browser);
the simulation above is the strongest check available without one.
Also flag separately: home disk at 100% (51 MB free) will block the next
scratch-clone/build worker until space is freed — that cleanup needs a
human decision about which old work dirs to remove; this worker deleted
nothing.

## Evidence files (workspace)

- This report: `~/workspace/mochiichao-work/ui-art/intro-stale-closure-fix-20261027-report.md`
- Main IntroSequence as fetched: `~/workspace/mochiichao-work/intro-fix-tree/IntroSequence-main.tsx`
- Simulation: `~/workspace/mochiichao-work/intro-fix-tree/verify_intro_presses.js`
- API helpers used: `~/workspace/mochiichao-work/intro-fix-tree/gh_read.py`,
  `gh_commits.py`, `gh_tree.py`, `gh_repo.py`
