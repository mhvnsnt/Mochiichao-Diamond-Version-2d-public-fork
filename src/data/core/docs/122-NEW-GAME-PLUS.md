# #122 — NEW GAME PLUS → New Game Plus structure

**Status of this whole spec: PROPOSED — NOT CANON.** Canon
nowhere rules that a second-cycle mode exists. This file
specifies the structure *if* the owner rules it in, built
entirely from the save architecture that already exists —
so the ruling, whenever it comes, is a one-line decision
over finished machinery, and until it comes, nothing in
this spec is a game fact.

**OWNER RULING (Jamar, 2026-10-27) — CLOSES THIS PROPOSAL:**
there is NO New Game Plus restart mode in Mochiichao. What
other games call NG+ is, here, the journey simply
continuing — the Ranger finding their way to the NEXT
REGION, party, records, and story intact. The disposition
table below is retained only as reference for
region-transition continuity questions; the mode itself is
closed and must not be landed as a feature. The live
system is List 14 #127 (region transition).

**REFINEMENT (owner, 2026-10-27, later — the fuller form of
the ruling):** it is not a one-way gate at the end of a
region either. The world is ONE CONNECTED OPEN WORLD.
Beating a region opens the way to the next — but a route
to another region can also be DISCOVERED: by travelling
and finding it (possibly early, even by accident), through
side stories, or through map connections — however it is
found. Access is discovered, by multiple routes, and the
journey just continues. In the owner's words: "it's kind
of still a new game plus but it's not — it's just
continue." #127 is specified on this model: discovery
first, progression unlock as one route among several.

**What was studied.** New Game Plus in the publicly
documented record: a completed save seeds a fresh run;
designs differ almost entirely in **what carries** —
collection records, character progression, inventory —
and in how the second run is re-balanced (scaled enemy
tables are the documented default). The kit taken: NG+ is
not a feature list, it is a *disposition table* — every
category of save state gets exactly one ruling: persist,
reset, or re-derive. A design that can't produce the table
doesn't have an NG+ design yet.

## The table (over #96's real payload sections)

#96 SAVE-INTEGRITY names the payload: `dex` (bitsets),
`flags` (four namespaces), `party`/`roster`, `world`,
`meta` — with later sections arriving as absent = default
(#97's `research` facts, #126's hall-of-fame records,
#104 honours living on roster records, #106's `location`
field). The disposition of each, under this proposal:

| Section | Disposition | Why |
|---|---|---|
| `dex` bitsets | **Owner decision** (see below) | Completion is *derived* from these (#14) — persisting the bitsets *is* persisting completion; there is no third state to design |
| `flags` story./progress. | **Reset** | Gates test flags (#11); a run whose doors start open is not a run |
| `flags` tech. | Follows the roster ruling | Techniques are held via party knowledge (#117's held/performed split) — if the roster resets, `tech.*` must too, or the flags claim a capability no one holds |
| `flags` vars. | **Reset**, except a `meta`-class cycle counter | Run facts are run facts |
| `roster` (individuals) | **Owner decision** (see below) | The emotional core of the mode; three documented shapes, consequences below |
| `world` (schedule overrides, session state) | **Reset** | Overrides in force belong to the finished run; #124 rotation re-derives them from the clock |
| `meta` | **Persist + increment** | Save version, slot id persist; a `cycle` counter increments (the one new field this spec proposes) |
| `research` facts (#97) | Follows the `dex` ruling | Research levels derive from tallies over encounters; persist tallies iff the bitsets persist, or the two dex-adjacent systems contradict |
| Hall of Fame (#126) | **Persist** | The archive is history *of* the Ranger across runs; records are per-run snapshots and say which cycle they belong to |

**The dex ruling — stated as the derivation it is:**
#14's law is that completion counts are popcounts over the
bitsets, computed at read, never stored. So "does
completion persist in NG+?" is not a design question with
a free answer — it is exactly the question "do the bitsets
persist?", and this spec refuses to pretend otherwise.
Both rulings are coherent; the owner picks one.

**The roster ruling — the three documented shapes:**

1. **Full carry** — the whole roster crosses, levels of
   growth intact. Consequence: early-run encounter bands
   are area law (#52: wild bands never read party state),
   so a carried roster walks through Region 1 unopposed
   unless NG+ overlay tables exist (below).
2. **Partner-only carry** — the partner individual crosses;
   the rest of the roster returns to the world. Consequence:
   story-locked individuals (#68's lock) who are *not* the
   partner need an explicit fate — release-into-world must
   respect the lock's meaning (a locked individual is part
   of a story, not inventory). Their handling is part of
   the ruling, not an implementation detail.
3. **No carry** — collection and honours persist (if ruled),
   individuals do not. Consequence: honours (#104 stamps
   live on individual records) die with their holders
   unless the Hall-of-Fame-style archive preserves them —
   #126's snapshot shape already stores honour ids at
   clear time, which is the only honest bridge.

**Story-locked individuals, one rule for all shapes:**
a `story_locked` individual (#68) is never silently
deleted by a cycle transition. Whatever the roster ruling,
locked records are either carried or archived — the
transition's output must account for every locked record,
by id, in the cycle report the transition writes.

**Scaled re-runs — mechanism, not numbers:** #52 forbids
bands reading party state, and this spec does not repeal
it. Scaling, if ruled in, arrives as **NG+ overlay tables**
applied at roll time — the machinery #113 already built
for swarm overlays (weighted overrides over #7 tables,
tables on disk never change), keyed to the `cycle` counter
instead of the clock. Zero overlay tables are instanced;
their contents are game-design content, OPEN. Note the
double-scaling trap: #100's rematch ladders and #87's
rematches already scale the *first* run's postgame — NG+
scaling must be ruled against that baseline, not stacked
blindly on top of it.

**Show lane:** none. The show has no saves (#96) and no
cycles; a "second run" in the show is a story decision,
not this system.

## Wiring

Operates entirely on #96's payload (sections verified in
#96 + #97/#104/#106/#126's additions); reads #14
(derivation law), #52/#113 (scaling mechanism), #68
(locks), #100/#87 (existing postgame scaling baseline).
The one proposed field (`meta.cycle`) lands as an additive
meta field under #96's absent = default rule, so pre-NG+
saves read as cycle 1.

## Coverage — honest

- **Architecture: fully documented**; the disposition-table
  form is the documented design core.
- **Contents: the mode's existence, both big rulings (dex,
  roster), the locked-individual fates under shape 2, and
  all overlay tables are OPEN.** Nothing here is playable
  canon until the owner rules the mode in.
