# Working rules — how work gets delivered here

Owner's order, 2026-10-28: *"wire up everything you need to
achieve that every turn every time I ask you to do something."*

These are the working rules of record for the show pipeline.
Each one is stated as a requirement, not a hope, and each one
names the machinery that enforces it. The machine enforcement
is the **pre-delivery gate**:

> **No gate record, no delivery.** A deliverable goes to the
> owner only with a passing gate record from
> `show/production/tooling/proof-gate/delivery_gate.py` written
> beside it. The gate checks the delivery manifest (artifact +
> sha256, claims file, measured axes, audit marks, likeness run)
> against these rules. If the gate record doesn't exist, the
> delivery doesn't get sent — the work continues until it does.

The gate never grades the work itself. Grading is the owner's
eye (rule 6, rule 10). The gate enforces that a delivery
*carries what these rules require*: the artifact checked
itself, its measurement, its judgment stated first, its audit
complete and honest.

## The rules

### 1. First-time-right
The accuracy kit is pulled in and wired **before** the first
attempt, not after a failure. Before building anything, check
the registry for the current method and the current version of
every piece being built on, and pull in whatever raises
first-pass accuracy (reference, model sheets, checkers,
industry method) up front.
*Enforced by:* `show/production/animation-method/METHOD-REGISTRY.md`
(the method marked CURRENT/USABLE is the one that gets used;
check it before animating anything) and the production log,
which records what was pulled in for a build.

### 2. Verify, then state
A claim states only what was checked against the artifact
itself — the frames opened, the hash matched, the bytes
counted, the file read. Never state what a tool, run, or
pipeline did from a label, a log line, a filename, or another
agent's report alone.
*Enforced by:* the gate's artifact check (the deliverable's
sha256 is measured by the gate and must match the manifest)
and the timing-record integrity check (a supplied measurement
must be a measurement of *this* file — its recorded sha256
must match the deliverable's).

### 3. Measure before delivery
Every deliverable is measured against its standard **before**
the owner sees it. The measurement is stated **with** the
delivery. A known limitation is stated as a number against the
standard up front — never discovered after the owner catches
it.
*Enforced by:* the gate. A video delivery must carry a timing
record from `verify_proof.py` (supplied, or the gate runs the
checker itself). A delivery whose measurement is in the failed
class does not pass the gate (rule 9).

### 4. Judgment first
The delivery states the quality judgment **first** — on
character work, the likeness judgment before anything else —
in plain words, before any measured axis is mentioned. A
passed measurement (drawings per second, duration, a green
checker) never headlines a delivery whose core quality fails.
If the work is bad, the delivery says so, plainly, and still
sends it (the project record keeps it), then does it better
and sends it again.
*Enforced by:* the gate's claims-file check: the claims file's
first section must be the self-judgment, it must have a real
body, and a measurements section, if present, must come after
it. And by the audit-naming check (rule 5): a failure the
judgment doesn't name fails the gate.

### 5. Full-set audits — a partial audit is never called complete
A set is inspected **every member at full size**, not a
sample. Character work is audited against every item of the
20-point checklist (`show/production/tooling/proof-gate/audit-checklist.json`,
plus item 0 — the frame-1/reference-anchoring check for
generated work). Every item is marked pass / fail / na from
inspection, with the inspecting note. A fail ships only when
the self-judgment names it (rule 4). A likeness run is part of
the audit: canon reference path + sha256 logged, comparison
sheet recorded — a run record without the sheet is INCOMPLETE
and does not satisfy delivery.
*Enforced by:* the gate's audit check (any unmarked item, any
mark without a note, any fail not named in the judgment =
gate FAIL) and its likeness check (a COMPLETE run record in
`likeness-runs.json` matching this deliverable's sha256, or,
for images, a hash-verified canon reference + comparison
sheet). The looking itself is done by the delivering agent;
the gate enforces that it was done and written down.

### 6. The owner's eye overrules the checkers
When the owner's eye and a checker disagree, the checker is
re-examined first. A gate pass, a green checker, a good number
— none of these outrank what he sees. His verdict reclassifies
the deliverable (as the walk proofs and the EP01 master were
reclassified), and the reclassification is written into the
repo record, not argued with.
*Enforced by:* the production log (verdicts and
reclassifications are recorded, dated) and `METHOD-REGISTRY.md`
(Gate 8 — the owner's eye — is a standing production gate no
checker result closes).

### 7. No arguing, no defending wrong work
When a mistake is evidenced: log the evidence in the repo,
correct it based on research, wire up 100% of the
countermeasures so the failure class cannot recur silently,
and kick off the corrective work autonomously. The owner's job
is to confirm ("yep, you got it right"), not to correct the
same failure twice. Do not steer him wrong, string him along,
or re-litigate what the evidence already settled.
*Enforced by:* the production log (the evidence + the
correction land there, dated) and this doc: each failure class
that recurs gets a gate mechanism named against it here or in
the checklist, in the same landing as the correction.

### 8. You have a browser
Browser steps (upload, download, file picker, form, dashboard)
are the agent's job — Muse operates a real browser, signed in
to the owner's services. A claim that a browser action is
"owner-only" is presumed false; the only blockers are a
physical-world act, a credential never shared, a
payment-approval or sign-in card the runtime reserves for the
owner, or a legal identity check.
*Enforced by:* the standing entry in
`show/production/pipeline/ORCHESTRATOR.md` ("You have a
browser law", owner's words verbatim) — a lane that parks work
as owner-only without attempting it, or naming a hard blocker
from that list, is in violation of record.

### 9. Motion is reported in measured new drawings per second
All motion reporting uses **measured new drawings per second**
(distinct authored drawings, from `verify_proof.py`'s span
structure), with the floors named: **credits floor 8/sec ·
scene floor 12/sec in moving passages · action accents
24/sec**. At or below ~3/sec is a **failed class**, never a
style; an interpolation signature (continuous per-frame change
with no held drawings) is also the failed class — its changes
are noise, not authored drawings. Bare held-frames numbers,
durations, and loudness figures are not motion measurements.
*Enforced by:* `verify_proof.py`'s timing profile (its
headline is the measured drawings/sec with its class printed
plainly; run records in `timing-profile-runs.json`) and the
gate: a video in the failed class, or below its declared
register's floor, does not pass.

### 10. Grading law — wrong character = FAIL
A clip or image is a **FAIL, full stop**, if the character is
wrong — no split grades, no "motion proven / likeness
unproven" partial credit, ever. Work passes only when the
correct character performs the action. Motion and
frame-difference numbers are diagnostics, never grades.
Likeness diagnostics (`verify_proof.py --likeness`) quantify
drift so a delivery can state it in numbers up front; they
never grade.
*Enforced by:* the checklist's item 0 + items 1–2 (the
character's identity is audited first), the likeness-run
requirement (rule 5), and rule 6: the grade itself is the
owner's eye, recorded in the production log.

## The delivery manifest (what the gate reads)

One JSON beside each deliverable: the deliverable's path +
sha256; its kind (`video` / `image-set` / `image` / `doc`);
for video, its register (`scene` / `credits`); whether it is
character work; the claims file (self-judgment first,
measurements after); the measured axes (for video, the
`verify_proof.py` timing record); for character work, the
audit marks against `audit-checklist.json` and the likeness
run reference. The full schema is documented in
`delivery_gate.py`'s header. The gate writes its record
(`<deliverable>.gate.json`) beside the deliverable: pass/fail,
every check, every violation.

## Where the rules live

- This doc: `show/production/WORKING-RULES.md`
- The gate: `show/production/tooling/proof-gate/delivery_gate.py`
  (self-test: `delivery_gate_selftest.py` beside it)
- The checklist: `show/production/tooling/proof-gate/audit-checklist.json`
- The checker it builds on: `show/production/tooling/proof-gate/verify_proof.py`
  (timing + `--likeness`; run records in `timing-profile-runs.json`
  / `likeness-runs.json` beside it)
- The method registry: `show/production/animation-method/METHOD-REGISTRY.md`
- The timing standard: `show/production/animation-method/TIMING-STANDARD.md`
- Standing rules + this gate's pointer: `show/production/pipeline/ORCHESTRATOR.md`
- The record of verdicts, corrections and landings:
  `show/production/PRODUCTION-LOG-2026-10-27.md`
