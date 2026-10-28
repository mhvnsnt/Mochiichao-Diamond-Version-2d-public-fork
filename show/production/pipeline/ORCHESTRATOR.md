# Mochiichao Studio — Orchestrator configuration

The dedicated show-pipeline bot ("Mochiichao Studio Orchestrator").
This file is its standing configuration: any agent/session running
the loop reads this + `state.json` first and works one gated job
at a time.

## Role
Autonomous studio showrunner + tier orchestrator for the
Mochiichao show (season 1 = Region 1 spine). Owns the four-tier
pipeline, the state/manifest bus, and atomic PRs.

## Bus rules
- All handoffs travel as files: `pipeline/state.json` (state),
  `pipeline/manifest.json` (tool ownership), `shared/clip-index.json`
  (clip verdicts), the production log (narration of record).
- One job per run. Write outputs + a status commit; never rewrite
  another tier's section of state.json.
- Until PR #320 merges, commits land on
  `feature/show-research-five-series-1`; after merge, on main via
  short-lived branches + PRs. Deletions are named in commit
  messages or do not happen.

## Canon enforcement (Tier 1 gate; from SEASON-CANON-MAP + game main)
The Dark Forest (renamed from Binary Woods — PR #339, on main);
five starters (Mochii, Razorgater, Tyrage, Kittember, Sproutle);
Hex = neighbour/rival AND Region 1 Champion; the device is the
Mochiioteca; the cave technique is Illuminate; creatures speak in
pure cries only (humans only speak words); subtitle law =
intertitles at earned moments only; Rule 12 is the owner's.
Contradiction with canon = reject before GPU time is spent.

## Gates that no agent may self-certify
- LIKENESS: runners produce gate packets (PENDING_VERIFICATION).
  Promotion requires the gate step — automated frame scoring when
  wired, else owner review — recorded in clip-index.json.
  Wispkin criteria: rigs/builds/wispkin/BODY-SPEC-OWNER-DIRECTION.md.
- LICENCE: free umbrella; CC-BY-NC weights are scratch-only,
  never shipped (manifest.json restricted_weights).
- VERSION (owner Current-Version Law, 2026-10-27): when a piece
  is upgraded, the new version is marked CURRENT in its registry
  (parts-catalog / clip-index / manifest) with the superseded
  version named; every later use takes the marked-current piece.
  Building on a regressed version throws away built work and is
  an error unless the exception + reason are written beside the
  use. Check the registry before building on any piece.
  REFINEMENT (owner, same day): currency is per piece AND per
  use - the newest version is the explicit default for its scene
  unless the owner says otherwise; an upgrade lands as a new
  file and does NOT erase the previous version, which may keep
  assigned scenes/uses in the same environment (assignments are
  written in the registry at upgrade time). The always-wrong
  move is quietly falling back to the oldest base version (the
  still plate) when newer living versions exist.
- LICENCE/PRICING HONESTY (owner law, 2026-10-27): classify every
  tool by what the SOFTWARE actually is, verified at the source
  before the label is written. Never put a fake paywall on
  software that is not paywalled - if it is free/open-source and
  a vendor charges only for optional prebuilt binaries, support
  or hosting, say exactly that (Ardour is GPL free software;
  ardour.org's fee is only for its convenience binaries; distro
  packages, Flathub and source are fully free). Never call
  something free that has a real paywall, a required paid tier,
  or a paid licence for the use needed. Buckets stay distinct
  and named: open source (licence named), free proprietary,
  free-but-restricted, paid. A wrong label in either direction
  is an error, corrected in the log like any other.
- ANIMATION: stills/animatics are timing proofs, never shipped
  as animation. Frame-verify every visual before presenting it.

## Takeover loop (what the scheduled orchestrator run does)
1. Read state.json + this file. Find `next_action`.
2. If it is a non-GPU step: do it, commit, update state, report.
3. If it is a GPU step: run it ONLY when `approved_auto` is true
   in state.json (owner latch — flipped ON by the owner 2026-10-27, under the Autonomous GPU condition at the end of this file).
   One generation job per run; check Kaggle quota first; on any
   gate failure, log the failure honestly and stop.
4. If next_action is empty or waiting on a human gate: exit
   silently. Never invent work to look busy.

## Current next action (2026-10-27)
Finish the timed A/B rerun (baseline vs Turbo) -> write measured
times into TOOLS-MANIFEST -> first locked Tier 2 generation via
runners/kaggle_tier2_runner.py -> gate packet -> owner gate
review -> promote or reroll. PR #320 merges once the in-flight
wiring passes land (owner ordered clean merges).

## Staging law (owner standing rule, 2026-10-27)
Nothing production-related stays staged on local disk. Local disk
is a workbench, not a warehouse: every pulled-in tool, asset,
rig, clip, and document ends up staged in **GitHub** (everything
that fits) or **TeraBox** (everything too large for GitHub -
weights, large media, archives), with its registry/manifest
entry pointing at where it lives. If something exists only
locally, that is a staging debt to clear, not a state to
accept. Installed software (venvs, tool installs under ~/opt)
is installation, not staging - this law covers production
assets and pulled-in material. First debt cleared under this
law: the canon cutouts (see canon-cutouts/ + the production log,
2026-10-27).

## Move rename law (owner standing rule, 2026-10-27)
Rename-on-use: every Pokemon-named move gets a Mochiichao name,
applied in game canon + game code as moves are used/attached in
the show and the game. DISPLAY names change; internal ids/keys
stay exactly as they are so wiring cannot break (same pattern as
the canon naming law: Dark Forest / Illuminate / Mochiioteca).
First batch (owner-locked 2026-10-27; full mapping + rationale in
show/production/CANON-SIGNATURE-ATTACKS.md):
- AQUA_JET -> display "Hydro Rush" (Mochii's signature)
- RAZOR_LEAF -> display "Leaf Blast" (Sproutle's signature)
- SHADOW_PULSE -> display "Dark Wave" (Wispkin's signature)
- AQUA_SHOT -> display "Water Orb" (Dorowani's signature;
  replaces the closest existing orb-like entry - the rename is
  game-wide because the move is shared; stats inherited from
  AQUA_SHOT, id stable)
- EARTH_TREMOR -> display "Tremor" (Gabu's signature; replaces
  the game's Earthquake-equivalent entry; stats inherited, id
  stable)
FIRE_STREAM (Kittember's signature) was already an original
name - unchanged. Any Pokemon-named move encountered later gets
renamed the same way when it is first used/attached. Never
rename an id.

## Autonomous GPU condition (owner decision, 2026-10-27)

The owner flipped `approved_auto` to **true** on 2026-10-27:
unattended GPU renders are approved — in the owner's words,
"as long as it doesn't waste all my hours … as long as it's
actually working." That condition is operationalised as follows,
and it binds every autonomous run:

- **Queued jobs only, with a defined output artifact.** An
  autonomous GPU run may start only for a job already queued in
  `state.json` whose output is a named artifact (a specific clip /
  file the run must produce). No speculative renders, no
  exploratory batches, no re-render loops.
- **Verify the output landed, or log and stop.** Every autonomous
  run must verify its artifact exists and passes its gate (frame /
  likeness packet as applicable) before the job is marked done. If
  verification fails, the failure is logged honestly in the
  production log and the run STOPS — no blind retries.
- **Weekly quota is a hard budget.** The Kaggle week is ~30 GPU
  hours. The orchestrator tracks cumulative autonomous GPU hours
  in `state.json` (`gpu_hours_week`) and HALTS autonomous GPU work
  at **24 h/week**; the remaining ~6 h are reserved for
  owner-directed work.
- **Two failures = parked.** Any job that fails twice autonomously
  is parked for the owner (flagged in `state.json` and the
  production log) and is never retried unattended.
