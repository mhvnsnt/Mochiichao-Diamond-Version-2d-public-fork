# #300 — CHOICE & CONSEQUENCE STANDARD → side stories grow teeth, on a checklist

**What #138 built, and what it couldn't do.**
#138 made side stories a content class: short #12
flag chains with an owner and a home, state derived,
no quest-log store — and a scope law that bars them
from the spine and the secrets. That was the right
floor for a Pokémon-base world. The owner's essence
statement names Fallout and Persona 5, and in those
worlds a side story is where the player *finds out
who they are being*: choices are offered, doors close
behind them, and weeks later a stranger finishes a
sentence your choice started. This spec is the
standard every side story is now authored against so
that consequence is a property of the class, not an
accident of one good writer. **The checklist is the
deliverable.**

**What was studied.** Choice-and-consequence
architecture in the named kin, as publicly
documented: Fallout's branching side quests (a
choice that writes a world fact and closes the
other road's content), Persona 5's confidant
calendar pressure (time itself is the closed door —
you cannot be everywhere), Skyrim's smaller, harder
lesson (most doors stay open; the ones that close
are famous *because* they close). The kit taken:
the closed door must be *authored and visible as a
cost*, the delayed echo must be *scheduled through
the world's own systems*, and permanence is
respected by everything downstream (#173 already
rules the shape: a rematch never re-opens a closed
story flag; this standard generalises that respect).

## Native spec — `mochiichao/choice-standard/v1` (fragment beside this doc — the checklist itself, as data)

Every side story authored from this list onward is
checked against four required parts. A story missing
one is not yet a Mochiichao side story; it is a
fetch with dialogue.

1. **Choice points, honestly forked.** At least one
   point where the Ranger *does* one thing rather
   than another — a deed, a side taken, a door
   walked through — and each branch is real content,
   not a colour on the same outcome. A choice whose
   branches re-converge to identical world facts is
   a defect the checklist names (`false fork`). The
   branches are #12 fact chains, per #138's
   architecture; what is new is that forking is
   *required and audited*, not optional flavour.
2. **Written facts.** Every branch writes at least
   one world fact in the standing vocabularies — a
   #12 flag, a #269 deed, a #270-moving witnessed
   report, a #299 membership change, a #106/#80
   record change through a real system. A consequence
   that lives only in a line of dialogue is not a
   consequence; the checklist requires the write to
   be named in the story's record (which system,
   which fact).
3. **Closed doors, declared.** At least one door the
   un-chosen branch held open is now shut *by the
   story's own record*: a service that will not serve
   you (#270's read), a route of the story that ends,
   a person's trust spent (#280's false friendship is
   this standard's darkest instance). The closing is
   declared in the story's checklist entry — door,
   closing fact, and whether anything in the world
   can ever reopen it (the default answer is
   **never**: #173's respect for closed flags is the
   programme's law, and a reopening is itself an
   authored exception, named, never a reset).
4. **Delayed echoes.** At least one consequence that
   surfaces *later and elsewhere*, delivered by the
   world's own systems rather than by the story's
   narrator: a #93 schedule change (the person you
   helped now works somewhere better), a #145
   traveller carrying the news, a #172 broadcast
   naming the deed, a #270 group's greeting changed
   when you next walk in. The echo is scheduled as a
   world fact with a trigger, not scripted as a
   cutscene ambush — the player meets it by living in
   the world the choice changed.

**The scope law still binds, unchanged.** #138 bars
side stories from the spine and the secrets, and
this standard does not lift either bar: a side
story's closed doors are side-story-scale doors
(a person's trust, a local door, one road of one
story) — never a region, never the league's spine,
never what stopped moving in the Dark Forest.
Consequence has weight *because* its scale is
honest: what you close forever is a kitchen door
in one town that will never serve you again, and
the town remembers why.

**Refusals are choices too.** Walking away from a
story that was offered (#298's walk-away law at
story scale) is a branch: it writes the refusal
fact, and the story's world resolves without the
Ranger (the person's trouble ends badly, or someone
else — a #145 traveller, a rival — becomes its
hero, and the echo names *them*). A world where
only participation has consequences is a vending
machine; this standard makes absence cost, gently
and truly.

## Show lane

The standard is the writers' room's mirror: a show
side story is checked against the same four parts
(the lead's choice, the written fact in the world's
records, the door that stays shut in later episodes,
the echo an arc later). #82's conservation discipline
is where the check is run; #227's provenance law
(the record is true) is what the echoes must agree
with.

## Wiring

Authored over #138 (its chains, its scope law, its
derived state). Writes ride #12, #269, #270, #299,
and the transfer/rescue systems' own doors. Echoes
ride #93, #145, #172. The checklist record lives
with the story's own record in #138's home; a story
landing without a checklist entry is incomplete by
definition — the landing PR names the four parts or
sends the story back.

## Open slots

Every actual story — its choices, doors, and echoes
— is content. So is any *class* of story the world
hasn't authored yet. Nothing mechanical is open:
the four required parts, the false-fork defect, the
never-reopen default, and the scope law are filled
in full.

## Coverage — honest

- Standard: complete and checkable (the fragment is
  the checklist, field for field).
- Contents: zero stories re-authored under it here;
  applying the standard to the existing side-story
  contents is a content pass, named in STAGING.
