# Grants Architecture — how the programme stops asking the owner to tap

Owner order, 2026-10-28. Companion to `show/production/pipeline/ORCHESTRATOR.md`;
wiring state of record stays in `show/production/tooling/WIRE-STATUS.md` and
`show/production/tooling/STAGING-MANIFEST.md`.

## The problem, measured

The owner already picks **always allow** everywhere the platform offers it.
The prompts keep coming anyway, because most of the cards the programme
generates are a class that offers **no lasting option at all** — the only
choices are allow-once or deny. His words: "sometimes they say always allow,
I hit always — but the ones that don't have a choice still pop up."

Audit of the approval record (read-only, 2026-10-28; the 60 most recent
resolved approval records, spanning 2026-10-28 03:49–13:09 UTC):

| Class | Records | Decisions |
|---|---|---|
| Connector approvals (`connector-*` ids) | 55 | **53 "Allowed once", 2 timed out, 0 lasting** |
| All other approvals | 5 | 2 "Site always allowed", 2 "Allowed for this task", 1 timed out |

- **Not one** of the 55 connector approvals in the window was decided with a
  lasting grant. Every connector call the programme makes ad hoc re-asks.
- The wait tail is real work stoppage: decided-after waits of **9m24s**
  (13:00:30→13:09:54 UTC), **10m55s**, **17m30s**, and **2h16m39s**
  (09:10:09→11:26:48 UTC) appear in the same window, and **3 records expired
  undecided** (timed out at card expiry).
- Record limitation, stated plainly: every record in the window carries
  "original tool call unavailable", so the history does **not** identify
  which connector or which action each card covered. This audit names
  classes only at the level the record supports — connector calls as one
  recurring one-shot class, split by requesting surface (main chat / side
  chat). Any finer claim would be invented.

## What already runs silently (durable grants in force, verified 2026-10-28)

These rails already hold lasting allows and must be preferred:

- **Browser**: durable "Visit websites: allow" override; durable
  "Fill saved credentials" for accounts.google.com.
- **Shell network rules (`/bin/bash`, durable allow)**: github.com,
  media.githubusercontent.com, kaggle.com, kaggleusercontent.com,
  huggingface.co, hf.co, cas-server.xethub.hf.co, download.pytorch.org,
  download-r2.pytorch.org, storage.googleapis.com, www.googleapis.com,
  docker.com, docker.io, flathub.org, microsoft.com, nodesource.com.
- **GitHub itself** runs through the `custom.github-pat` connector
  (registered API access; no per-call card for repo reads/writes via the
  helper pattern) — this is how every recent PR landed.

## Standing routing rules (binding on every lane)

1. **Scheduled-task rails first.** Any operation that recurs — polling,
   harvesting, retrying, generating, staging checks — runs as a
   goal-owned scheduled task (cron owned by the goal it serves), NOT as
   ad-hoc calls from a chat. A scheduled task can hold a **lasting
   per-task grant**; an ad-hoc connector call cannot outlive its one tap.
2. **Batch connector work.** Where a connector call is unavoidable, a lane
   gathers its calls into one batch per approval window — one approval
   covers the batch. One call per item is a routing defect.
3. **Declare the surface up front.** Every new lane's brief names its
   hosts, tools, and connectors before it starts. First-use grants for
   the whole lane accrue in **one batch at lane start**, never dripped
   across days of work.
4. **Prefer granted channels.** Route through surfaces that already hold
   durable grants (PAT connector for GitHub; granted CLI hosts for
   Kaggle/Hugging Face/PyTorch; browser durable site allows) before
   opening any new surface. A new surface needs a written reason in the
   lane's record.
5. **No idle on a card.** A pending approval parks only the lane that
   needs it, with its exact blocker named. Every other lane keeps moving
   (standing rule, 2026-10-28).
6. **Hard-floor taps are pre-declared.** If a lane knows it will hit the
   hard floor below, it says so in its brief, up front, batched — it
   never drips them mid-run.

## The hard floor (platform-fixed — routing cannot remove these)

Per Muse's own permission rules, these always ask, no matter the routing:

- **Purchases in chat** — fresh approval every time; no lasting default
  exists by design.
- **Certain social posts and sends** — e.g. Threads posts and messages,
  Facebook posts/comments/Page posts, and Messenger sends outside an
  already-allowed conversation always ask, even from a scheduled task.
- **Credential-sharing cards** — sharing a one-time code from connected
  mail/messages with a sign-in/checkout step is approved per use.

These are the **only** owner taps the programme may still generate, and
per rule 6 they are flagged in advance, batched, and never presented as
surprises. There is no global "never ask" setting in the product (owner
verified on his own Permissions page, 2026-10-28: the defaults offered
are "Ask for some" and "Always ask"), and no agent-side change can create
one — this document exists so the programme stops *needing* one.

## Applied check — locked-run retry (2026-10-28)

Cron `locked-vace-run-retry` (owner `goal:mochiichao-show`, run-once,
created in the side chat it delivers to) was inspected against these
rules: it is goal-owned, self-contained, and its external work runs over
already-granted rails (Kaggle CLI over the durable kaggle.com /
kaggleusercontent.com network rules; repo work through the PAT
connector). **No change needed from this pass.** Standing note for future
retries: create them the same way — goal-owned, one job per outcome, so
any first-use grant attaches to the task itself instead of to a chat.

## Landed with

This document + a cross-link in `ORCHESTRATOR.md` ("Standing references").
