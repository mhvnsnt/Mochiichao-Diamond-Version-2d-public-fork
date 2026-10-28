# #93 — NPC DAILY-SCHEDULE SYSTEMS → town NPC schedule format

**What was studied.** Routine-AI scheduling in the public record:
the farming/town-sim family (per-NPC timetable: location per time
band, weather and day variants, event overrides) and the
collector games' lighter version (NPC placement keyed to time of
day). Shared architecture: a schedule is a *table, not a brain* —
rows of (condition → place + activity), evaluated top-down, first
match wins; the NPC has no memory in the schedule layer.

**The distinction this spec exists to keep.** LIVING-WORLD's
background population classes (SKY/FG-CROSS/BG-CROSS/PERCH/WATER,
rules P1–P5) are **ambience**: unnamed, roster-bound ambient
bodies that make a frame feel inhabited and are forbidden from
carrying story (P1: principals are never ambient in their own
scene; P4: no eye contact, no focal theft). A **schedule is the
opposite layer**: named NPCs with authored routines — where the
lab assistant is at dawn, when the gatekeeper changes post.
Conflating them breaks both: ambience that follows a timetable
reads as surveillance; a named NPC placed by population rules
reads as a stranger wearing a friend's face. The two systems
share *place ids and time bands* and nothing else.

**Native format — one schedule per named NPC:**

```
schedule { npc_id, rows[], default_row }
row { time_band, day_kind?, weather?, place_id, activity,
      flag_override? }
```

- Rows evaluate top-down, first match wins; `default_row` is
  mandatory (a named NPC is *always somewhere* — "off-screen" is
  a legitimate place_id value and the honest one for most hours).
- `activity` — a short authored tag (`tends-counter`,
  `walks-frost-line`, `closed-post`). Activities are presentation
  + interaction availability, not simulation.
- `flag_override` — a #12 event/flag condition that replaces the
  row while true (story beats move people; when the flag clears,
  the routine resumes — the table has no memory, by design).
- `time_band` vocabulary is shared with SPAWN-TABLES and the
  media grid (#90) — one clock for the whole game. Day kinds and
  weather bands exist as fields; **which day kinds the world has
  is OPEN** (no calendar canon yet).

**Canon state, honestly.** Canon names people (Mochiko, Aeon,
Hex and the dojo masters in the season map) but **no daily
routine is written for anyone**. Wispkin's night round is the
closest thing — and Wispkin is a Mochi, not an NPC; its path is a
trail (#89), not a schedule. Zero schedules asserted; the format
is ready for the first authored routine.

**Wiring.** Consumers: #90 media `schedule_notice` blocks (who is
where, as community information), dialogue availability (the
dialogue kit's per-NPC line sets gate on place+activity),
encounter scripting (#12 flags read schedule state through
`flag_override`, never the reverse). Show-side: a schedule row is
a *default background truth* for boarding — if a scene is set at
the Gate at dawn, the schedule says who would be there; the script
may override, and the override is a story fact, not an error.

**Coverage.** Table-evaluation architecture: standard, fully
documented. Contents: none canon — format + the ambience/routine
boundary are the yield.

**Early-arrival class declaration (#139, landing 2026-10-27):** schedules are WORLD-OPEN under #139's two-class rule — first-match tables with no memory in the schedule layer; an NPC met early is the same person their table places. Ruling layer: `src/data/core/docs/139-EARLY-DISCOVERY.md`.

**Vocabulary extension registered (#145, landing 2026-10-27):** cross-region travelling-NPC rows (spanning rows + `transit`) are an accepted extension of this doc's format, per `145-TRAVELLING-NPCS.md` (same folder) — proposed by #145, registered in this, its home format. No NPC is instanced by the registration.

**Registration (List 23 #221, landing 2026-10-27):** mentorship records seat beside this file's relationship records (the family #145 reads). Agency limit, demonstrated mechanically: no field of the mentorship record can be consumed as command authority by any battle or training system — there is nothing to wire, and that is the check.


**Landing note — List 28 (2026-10-27):** this file's world-data layer hosts #270's group records, and its schedules supply #272's witness sets at the moment of a deed (272-WITNESSES-WANTED.md): who was present is a schedule fact before it is an evidence fact. Only witnessed deeds move a group's tally — the seen/unseen split is load-bearing in #269/#270/#272/#276 at once.
