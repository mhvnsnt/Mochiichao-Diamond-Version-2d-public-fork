# CHECKPOINT SYSTEM FOR EVERYTHING (Mars, 2026-10-26, standing)

## The rule

Save and log EVERYTHING as it is built — every version, every phase,
every step — so anything can be gotten back to exactly even if it gets
lost, like a checkpoint system for everything that is built, even just
a menu. Never overwrite a version already shown to Mars; every version
gets its own saved file/checkpoint with a new dated name; logs are
appended, never rewritten, never deleted. A rebuild must start from the
saved checkpoints and history, never from guessing.

## How it works in this repo

1. **Every version is its own file.** When a version has been shown to
   Mars, it is frozen. The next version gets a new dated filename
   (for example `main-menu-v33-20261026.png`, never a reuse of the
   v32 filename). Never overwrite a shown version: a cache will serve
   the old file under the old name, so overwriting it means Mars sees
   the old version when he should see the new one.
2. **Logs are append-only.** Conversation logs, work logs, and run logs
   are appended to, never rewritten and never deleted. Earlier entries
   stay readable forever, so the history of how a thing was built —
   every correction, every lock, every number — survives.
3. **Checkpoint files live with the work.** Specs and rules go under
   `docs/`; art versions go with their lane's art folder (for example
   `docs/ui-art-options/` for main-menu versions); proof renders and
   screenshots go with the work they prove. A checkpoint is only useful
   if it can be found next to the thing it checkpoints.
4. **Restore before you rebuild.** If something is lost or broken, the
   first step is to read the saved checkpoints and history and restore
   from them. A rebuild that starts from guessing — re-deriving numbers,
   re-drawing art, re-deciding placements — is not allowed when a
   checkpoint exists. Losing work that took hours of back-and-forth and
   then half-rebuilding it is banned by this rule.
5. **Checkpoints are never deleted.** A superseded version stays in the
   repo as an option, labelled superseded where that helps. PRs that
   add checkpoints therefore have 0 deletions by construction; a PR
   that deletes a checkpoint file is blocked until the deletion is
   justified and approved by Mars.
6. **A checkpoint names what it is.** Each saved version carries its
   date, what changed from the previous version, and whether Mars
   locked it, approved it, or only saw it. A file without that context
   is not a checkpoint, it is clutter.

## Why this rule exists

The main menu took 35 versions of back-and-forth (v12–v32) on
2026-10-25 before Mars locked v32 and called the matched animation
perfect (300 symbols, 80 frames x 70ms, rise 5.5px/frame half-scale,
sway 3, bob 2, fade gone 620 / golden line 729 / full 905, layer order
rainbow < logo < cloud < panels). That history is the spec. When the
locked menu was later lost and rebuilt from guessing instead of from
the saved versions and history, the rebuild came back wrong. This rule
exists so that can never happen again: the next rebuild starts from
the checkpoint, and the result matches the locked version exactly.
