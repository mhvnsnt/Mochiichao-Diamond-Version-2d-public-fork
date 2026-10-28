# #138 — SIDE-STORY SYSTEM → side stories as a content class (and an unlock route)

**Doctrine seat (OWNER REFINEMENT, 2026-10-27):** side
stories are one of the named ways a Ranger DISCOVERS a way
to another region. This spec makes "side story" a real
content class in the data — authored, tracked, and
finished like any other content — and defines its one
systemic power: a completed (or even begun) side story can
be the hint source, or the opener, of a world connection
(#137). It invents no stories.

**What was studied.** Optional quest content in the
publicly documented record: side quests tracked as small
flag chains (met → helped → resolved), whose rewards are
usually items or access rather than main-plot progress;
and television's bottle/errand episodes that move a
secondary character's thread without moving the season's
spine. The kit taken: a side story is a *short flag chain
with an owner* — someone it belongs to, somewhere it
lives, and a resolution the save remembers — and its
systemic effects are expressed only as the flags it sets.

## Native spec — `mochiichao/side-story/v1` (fragment beside this doc)

- `sideStory` record: `{storyId, homeArea (#11 node /
  #119 interior / #140 border zone), ownerNpc (nullable),
  beats[] — an ordered list of #12 flag ids the story
  sets as it plays, resolutionFlag (the final beat),
  unlockConnection (nullable #137 connectionId),
  repeatable: false}`.
- **Tracking is #12 and nothing else.** A side story's
  state (unstarted / in progress / resolved) is *derived*
  from which of its beat flags are set — first unset beat
  is the current step. No quest-log store exists or is
  proposed; the log is a view, like #98's licence.
- **The unlock role, exactly:** if `unlockConnection` is
  set, the story's beats are registered as hint sources
  on that connection (#137), and its `resolutionFlag` may
  serve as that connection's arrival-route evidence *if
  the story physically takes the Ranger there* — the
  distinction is the author's, recorded per story: a tale
  that merely *tells* of the far region hints; a story
  that *travels* opens. The side story never writes
  "region unlocked" anywhere — #137 derives.
- **Scope law:** a side story may not move main-story
  facts. Its beats live in `story.*` under its own id
  prefix; it never sets a dojo/circuit progress flag
  (#45's spine is main content), never sets a capstone
  flag (#100), and never answers a world secret — in
  particular it may not touch what stopped moving in the
  Dark Forest (inherited from #82's arc law, applied to
  game content verbatim).

**Show lane mirror (#82):** a show side story is an arc
whose plan already obeys entry = exit conservation —
no permanent partners, moves, or items gained. The game
class and the show class share one discipline from two
sides: side stories *enrich* the world and *reveal* its
connections; they do not advance the spine or leave the
party changed. A show side story that discovers a region
route is the season's connective tissue (#145's travellers
walk it in person); its exit state still equals its entry
state plus knowledge.

## Wiring

Flags in #12 namespaces; homes join #11/#119/#140;
owners join #93 schedules (a side story's NPC is where
their schedule says they are — the story waits for the
person, not the reverse); unlock role joins #137's hint
derivation; show mirror joins #82's arc format; media may
*hint at* a side story's existence via #90 only from flags
already set (no spoilers by generator).

## Coverage — honest

- **Architecture: fully specified** (record shape,
  derived state, unlock semantics, scope law).
- **Instances: zero.** Every actual side story — its
  owner, beats, whether it hints or opens, and every
  story that exists at all — is content, and OPEN. This
  spec also does not rule whether side stories are
  missable or time-windowed (rotation joins #124): that
  interaction is named here as an OPEN design question,
  not decided by silence.

**Landing gate — List 31 (2026-10-27).** #300's choice-and-consequence checklist is registered in this file's home (`show/production/world-systems/300-CHOICE-CONSEQUENCE-STANDARD.md`): a side story landing without its four parts named (fork / written fact / closed door / echo) is incomplete and is sent back. Applying the standard retroactively to existing side-story contents is a separate content pass; List 31 re-authors no story.
