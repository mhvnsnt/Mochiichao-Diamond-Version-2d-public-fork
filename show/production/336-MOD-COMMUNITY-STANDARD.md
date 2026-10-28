# #336 — THE MOD-COMMUNITY STANDARD → what players now expect, audited against our base

**The gap this fills.** Decades of ROM hacks and
fan games have quietly set a floor: conveniences
players no longer experience as features, only as
*absences* when missing. The owner ordered the
modding community pulled in wherever it fills gaps
— this spec is where that order becomes a standing
audit instead of a vibe. Each expectation is checked
against our actual base and marked **HAVE** (the
system exists; the audit names its seat), **BUILD**
(it doesn't, and a small spec with a home is given),
or **REFUSE-WITH-REASON** (we could, and won't, and
here is why — a refusal is knowledge, #327's law).

**Method.** Expectations taken from the documented
ROM-hack/fan-game mainstream (the features
near-universal in modern hacks and expected in fan
games), each checked against the earlier packages'
own files at this build. A row whose seat could not
be verified in this pass is marked as an audit-open
row — the audit shows its work or it is marketing.

## The audit

| # | Expectation | Verdict | Seat / home / reason |
|---|---|---|---|
| 1 | A follower walks with you | **HAVE** | #58's follower system entire — states, #241's town rules (`welcome/park/barred` per interior), #263-family field states. The community normalised it; we built it as a system before this audit existed. |
| 2 | Chosen difficulty, honestly labelled | **HAVE** | #70's Dial C charter (fixed, named options over pre-authored bands; rubber-banding refused there) + #189's challenge modes as its operating system. Option names/count remain content slots in their homes — the *system* is had. |
| 3 | A dex that helps you hunt (where does it live?) | **BUILD** | The pieces exist and were never joined: #102's habitat range maps, #137's world atlas, #198's regional dex view, #207's discovery states. The build: a *where* read in #137/#198's home — a seen species shows its recorded habitats; an unseen one shows nothing (the silhouette law at map level: the map never teases uncanonised content); a kept species shows where *yours* was met (#80 history). Small spec, no new data — a join, not a system. |
| 4 | Storage access beyond one counter | **BUILD + REFUSE (split)** | BUILD: storage access as a service seat at centres (#132), the Garden (#28), and working properties (#332) — #106 already made storage a *view over the roster* (one `location` field), so a new seat is a counter, not a database. REFUSE: access from the pocket, anywhere, anytime. Reason: place is load-bearing in this world — #193's custody seats, #267's return geography (a released Mochi is *somewhere*), and #303/#332's property value all price in distance; a pocket box flattens the map the essence law says must stay big. |
| 5 | Reusable utility (tools that don't run out) | **HAVE + BUILD** | HAVE: #150's Ranger field kit is the reusable-utility seat (kit, not consumables), and machines are registry data (the 352-move machine registry) — using a tool is not spending it. BUILD (small): a repel-class *toggle* in the field kit, reading #255's resolved semantics (Shape A — party-lead level governs the pick; List 26 closed the question List 12 left open). The toggle lives in #150's home; #255's rule is cited, never re-decided. |
| 6 | Party-wide experience share | **BUILD (conditional)** | The modern standard (Pokémon's own current shape: a share you may switch off; hacks normalised it). Audit-open at this build: #177's landed text governs gain's shape and was not re-derived in this pass. If gain is per-battler only, the share arrives as a #150-class kit toggle (on by the modern default, off for the old road — the toggle is the community's compromise, adopted whole). If #177 already shares, this row converts to HAVE at the link check. Either way the *decision* is recorded here: share exists, switchable, never forced. |
| 7 | Presentation speed & text options | **HAVE** | #121 (accessibility) owns presentation options in the game lane — text speed and its family are its country, and this audit founds no second seat. A hack's "fast text" is a setting, and settings live where settings live. |
| 8 | A second pocket for quest/key things | **HAVE** | #165's battle bag + #190's item vault + #150's kit already partition the Ranger's carrying by kind; the community's bag-tabs expectation is met by partition-by-system rather than by tabs — noted so a future " QoL pass" doesn't re-found it as UI. |

## What the audit deliberately does not do

It does not chase every hack feature. Anything
whose pull-in case is a *system* (not a
convenience) belongs in the #327 register as its
own entry with its own gap named — this audit is
for the floor, not the ceiling. And it sets its
own renewal: the audit re-runs whenever a new list
lands a system a row cites (the row's seat is
re-checked, the verdict re-issued). An audit that
never re-runs becomes the thing it was built to
prevent — a list of things everyone assumes.

## Wiring (proposed)

The audit document lives with the #327 register
(its standing companion). Its two BUILD rows land
as small annexes in their cited homes (#137/#198
for the *where* read; #106/#132/#28/#332 for the
storage seats; #150 for the two toggles). No row
of this audit founds a system in this package.

## Open slots (nothing invented)

Row 6's conversion (HAVE or BUILD) at the link
check against #177's landed text — registered in
STAGING, not guessed here · future expectations
(the audit's renewal is a schedule, not a slot).


**CONVERSION RECORD — row 6 (applied at landing, 2026-10-27, per this audit's renewal rule):** the link check fetched and read #177's landed text: non-participants earn only if a share mechanism covers them, and the mechanism is a data slot asserted as `shareSource: null` — no mechanism is asserted by that spec. Row 6 is therefore **not HAVE**. It converts to **BUILD in the #150-class toggle form**: party-wide share exists as a switchable toggle, never forced. The conversion is recorded with this date in #150's and #177's files as well; nothing was back-written into #177's gain shape, and no other row's status is changed by this record.
