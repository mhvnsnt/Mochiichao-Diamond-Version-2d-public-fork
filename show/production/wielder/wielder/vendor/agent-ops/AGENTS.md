# AGENTS.md

# ANTI-CLOBBER LAWS (owner 2026-10-17 — the DXMMII 54k-file wipe)

On 2026-10-17, commit cd3bf38 ("DXMMII limb system", PR mhvnsnt/western-heart#221) deleted 54,456 files against 105 additions. The commit message said nothing about deletions. Nobody read the deletion list before merging. The repo was 99.996% gone. These laws exist so that never happens again. Every agent, every repo, every commit, every merge.

1. DELETION CHECK — before every commit, read `git status` and the diff stat. Every deleted file in the diff must be something your task intended to delete. A deleted file your task did not delete on purpose means STOP: do not commit, do not push, report what you found. The working tree is wrong, not the task.

2. OWN THE TREE — never `git add -A` or `git commit -a` in a working tree you did not fully populate yourself. Before committing, verify the tree is complete: file counts match the remote branch you branched from (your task's own additions and changes aside). A tree missing files you didn't delete is damaged — don't sweep it into history.

3. CIRCUIT BREAKER — if a commit would delete more than a handful of files outside your task's scope, STOP and report instead of committing. A big deletion count is a hard stop, not a warning to scroll past. Committing unexplained deletions "and letting someone else figure it out" is the failure.

4. SAY THE DELETIONS — the commit message names every deletion. One deleted file gets one line; many deleted files get a count plus what category went. A commit whose message and diff disagree is a hard failure — don't push it.

5. MERGE GATE — the merger reads the PR's deletion list against the task description before merging. Unexplained deletions block the merge. "CI is green" does not excuse a deletion list the task never asked for. A red, conflicting, or lossy PR stays open with a comment naming the blocker.

(Co-authored with Aider and Copilot per the ALL-AGENTS-WORKFLOW LAW. Cline's seat stays open — its free-tier API was down during drafting.)

Instructions for every AI agent working in this repo.

## No-data-loss rules (MANDATORY)
Read and follow [`docs/NO-DATA-LOSS-RULES.md`](docs/NO-DATA-LOSS-RULES.md) (canonical: mhvnsnt/agent-ops). No force-push, no rebase/amend of pushed work, no history rewrite, no branch/asset deletion without backup + owner approval, PRs only, empty D-filter + gitleaks + green CI before merge, push incrementally, keep WORKLOG, back up and sha256-verify before disk cleanup, never touch other agents' or Muse's work.

### NO-SPARSE-COMMIT LAW (2026-10-23 — the cape-jones #219 main wipe)
NEVER commit or push from a sparse/partial checkout. On 2026-10-23 the overnight pipeline committed PR #219 from a sparse checkout that materialized only docs/ — the merge DELETED the other 21 root entries from cape-jones main. A sparse checkout that looks complete can silently carry deletions. RULE: before any commit from a non-full clone, verify the working tree against the branch's real tree (diff the root listing, or compare tree SHAs). Default recovery path for a bad merge: revert the merge commit (-m 1) and re-add the branch's real payload — nothing lost on either side. When in doubt, build the commit via the Git Data API from verified tree SHAs instead of a local checkout. GOTCHA: gh's `-f content=@file` does NOT expand @file for the blobs API — base64 the content explicitly or the blob will contain the literal path string.

---

## MERGE QUEUE — COMING SOON (owner-ordered briefing, 2026-10-24)

Read this if you work on western-heart or agent-ops. Nothing changes today. This is advance notice only.

**What is changing:** soon, pull requests will merge one at a time, in a line, instead of every lane merging whenever it wants. Each PR in the line gets checked against the newest main before it goes in. That is called a merge queue.

**Why:** two lanes merged at almost the same time and one wiped out the other's work. The line stops that happening.

**What changes for your lane, once the flip happens:**
- Merging a PR directly will stop working. GitHub will reject a direct merge.
- Instead you add your PR to the queue. GitHub merges it when its turn comes, after re-checking it against the newest main.
- If the queue asks you to update your branch (because main moved under you), update it and it goes back in line. Do not force-push. Do not merge main into your branch by hand to get around it.
- The merge method stays "merge". Never squash, never rebase. Same as now.

**When:** NOT YET. The flip happens only after every active lane has confirmed it knows. This briefing is the advance notice — today, merging works exactly the way it always has.

**How to confirm:** reply "merge-queue briefing confirmed" in your chat, or drop that line as a comment on your PR, or tell the merge coordinator at your next check-in. Confirmations are tracked in mhvnsnt/agent-ops at `MERGE-QUEUE-BRIEFING-CONFIRMATIONS-2026-10-24.md`.

**Status 2026-10-24:** the queue plumbing is ready on both repos (western-heart PR #742 and agent-ops PR #39 both merged the merge_group triggers). The flip itself has NOT happened. No branch protection has changed.
