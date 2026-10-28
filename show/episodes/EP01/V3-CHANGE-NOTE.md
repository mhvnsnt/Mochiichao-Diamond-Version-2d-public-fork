# EP01 SCRIPT v3 — CHANGE NOTE

**What this package is:** EP01-SHOOTING-SCRIPT-v3.md (the full
shooting script) + MANUAL-RULES-DRAFT.md (proposed Manual rules,
draft tier). Written 2026-10-27 from the locked v2 spine and the
owner-approved expansion beat map, after the owner answered the
beat map's five open questions. This note records what changed,
where the owner's five answers landed, and how the package lands
in the repo.

## 1. WHAT v3 ADDS VS v2
- **Length:** v2 is 28 cuts / 265s of story. v3 is 107 cuts /
  1,260s of story inside the full 24:00 slot (OP 60 + story
  1,260 + ED 75 + preview/buffer 45 = 1,440s). All 995 new
  seconds are in 79 new cuts across 11 clusters (N1–N10 +
  eyecatch), placed exactly where the beat map puts them.
- **The spine is untouched.** All 28 locked cuts keep their v2
  durations, order, scene grouping, and text — carried verbatim
  in LOCKED-SPINE blocks with per-cut rosters (durations +
  timecodes + content names). No locked line was edited to fit
  the expansion; the expansion was fitted to the locks.
- **Voice discipline changed around the spine, not inside it.**
  Per the owner's EP01 direction (low-verbal, Jack-shaped; no
  human dialogue needed in EP01), every NEW cut is wordless for
  humans: Mochiko's beat-map line intents were converted to
  performance (the wordless mornings question, V3-019; the
  gestured button, V3-102). The only human speech in the episode
  is inside the locked spine, verbatim from v2. Casting
  therefore does not gate v3 at all.
- **Sound is the episode's channel** (craft doc §2): the gate
  bell bookends the day (V3-001 / V3-095), the cold-spot shimmer
  is mixed exposed at the frost set piece, and the held silence
  in N9 is written as a floor, not a ceiling.

## 2. INTERTITLE LEDGER — exactly five (owner-approved)
| # | Cut | Timecode | Text | Status |
|---|---|---|---|---|
| 1 | V3-073 (locked cut 18) | 13:44–13:58 | *"…I keep the garden at night."* | LOCKED (v2) |
| 2 | V3-077 (locked cut 22) | 14:32–14:40 | *"…not alone anymore."* | LOCKED (v2) |
| 3 | V3-106 (locked cut 27) | 20:44–20:56 | Rule 12, owner's exact wording | LOCKED (v2) |
| 4 | V3-089 (N8) | 16:48–17:04 | *"…This is my round. Every night."* | NEW — approved as proposed in the beat map |
| 5 | V3-100 (N10) | 19:14–19:26 | *"…I practise. So the stacks stay up."* | NEW — approved as proposed in the beat map |

Acts 1 and 2 carry zero new cards, per the beat map's defence of
the number: the currency is spent only where the episode's
meanings resolve. No other cut in v3 carries a subtitle; the
SUBTITLES field says so cut by cut.

## 3. FROST DEVICE — first use note
- **Canon (owner, 2026-10-27):** the frost is the trace of
  Wispkin's nightly round — where the chill of its smoke tail
  settles as it passes; the map Mochiko learns to read. It
  carries a dark spirit aura: black-purple smoke/flame living
  inside the frost and snow.
- **First use of the FROST CLOSE-UP COLOUR SHIFT: V3-039
  (7:11–7:29), in N4, the investigation cluster** — written as a
  set piece with the three beats explicit in the VISUAL block:
  SHIFT BEAT 1 on the push-in (world palette drains to the
  indigo/violet JoJo register; Kittember's flame the only warm
  note), SHIFT BEAT 2 held (the aura moves inside the frost —
  smoke through crystals, a small black flame standing in the
  white), RESTORE BEAT on the pull-back (blues, then greens,
  then honest daylight; the frame exits identical to the frame
  entered, except for what the audience now knows).
- **The device is spent once.** N8's frost (V3-087) is played in
  honest night colours, on purpose: the shift is the moment of
  *learning to see*; afterwards the fact needs no effect.

## 4. CAMEO TREATMENT NOTE (owner-approved, Jack-style)
- **HEX — V3-002 (N1), inside an existing cut, zero added
  seconds.** A distant figure at the far fence at the edge of a
  held landscape frame. No line, no approach, no name spoken or
  shown. Gone when the composition recurs at V3-098 (the rhyme
  is noted in both cuts). Boarding protection: never closer than
  the fence line (script §7, item 10).
- **AEON — V3-043 (N4), inside an existing cut, zero added
  seconds.** Presence-by-signal: one device ping inside the
  Mochiioteca icon sequence — a single tone from outside the
  Garden's sound-world, mixed dry. No body, no voice, no name.
  It never repeats (explicitly fenced in the eyecatch note,
  V3-061).
- Both cameos follow the craft doc's law: the Garden belongs to
  Mochiko and the creatures; the wider human story is weather on
  the horizon. EP02's canon opening needs Hex and Aeon at full
  weight; EP01 spends nothing of them but their silhouettes.

## 5. DRAFT RULE USE
One new numbered rule is used in the script: **Rule 3 (DRAFT)**,
at V3-020 (N2's ritual beat) — *"Feed the helper first... The
keeper is fed by the feeding."* It is marked DRAFT-RULE in the
script and lives in full in MANUAL-RULES-DRAFT.md (12 rules:
Rule 1 canon, Rules 2–11 drafts, Rule 12 the owner's exact
wording). On screen the rule is performed as ritual — Dorowani's
reading cadence, the crew bowing at the familiar part — so the
beat survives any lock-pass outcome.

## 6. LANDING STEPS (repo: mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start)
The GitHub API window opens ~00:45 UTC; this package was written
local-first against the local verbatim copy of the locked v2.
1. Re-fetch `show/episodes/EP01/EP01-SHOOTING-SCRIPT-v2.md` from
   main and diff it against the local copy used here; if main's
   v2 differs in any character, re-carry the LOCKED-SPINE blocks
   from main's copy before landing. (Verification is verbatim or
   it did not happen.)
2. Branch `feature/ep01-script-v3-1`. Add, additions-only:
   - `show/episodes/EP01/EP01-SHOOTING-SCRIPT-v3.md`
   - `show/episodes/EP01/MANUAL-RULES-DRAFT.md`
   - `show/episodes/EP01/V3-CHANGE-NOTE.md` (this file)
   v2 is NOT modified or deleted. The beat map stays where it
   lives; v3's header cites it.
3. Append the production-log entry to
   `show/production/PRODUCTION-LOG-2026-10-27.md` built on main's
   LIVE log at landing time (additions only; verify zero
   deletions in the log diff before opening the PR).
4. Open the PR with this change note as the body. **DO NOT MERGE**
   — owner/scorer review first, per standing discipline.
