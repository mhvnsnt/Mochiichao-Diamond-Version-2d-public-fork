# SNAPSHOT MODE — the camera toy (List 7, #60)

Teardown: photo/snapshot modes in creature games — a first-class
camera the player aims at creatures in the world, with framing,
filters, subject reactions, and a kept album. Public architecture:
the camera is a *toy*, not a renderer — free framing on a bounded
stage, subjects that notice and pose, and output that is a record
of a real moment in the running world.

## House law first (scope)

Marketing is cut from real episode/gameplay material — never
manufactured stills (anti-slideshow law). Snapshot mode respects
that by construction: it photographs **the living world as it
runs** (game) or is staged as an **in-show device gag** (show).
A snapshot is evidence of a real moment, not a substitute render.
It is never a production shortcut for art the pipeline owes.

## Native spec

**Owner of the toy:** the Mochiioteca gains a camera function —
one device, one product line (keeper-tech grammar). Physical
device design is still OPEN in canon (the Mochiioteca's physical
design is undesigned); this spec defines behaviour, not the
object's look.

**Capture model (game):**
- Free-frame within the current map; the world does not pause —
  cycles keep cycling (LIVING-WORLD), so a snapshot catches a
  *moment*, including wind state and weather as they stand.
- Subjects notice at the follower's REACT range (#58): a partner
  poses (its pose-library `snapshot` set — an owed cycle class,
  tracked like idle/hurry); wild/background individuals react per
  population class or ignore the camera. No reaction may be
  invented per-species here; the pose set is species data.
- Shutter record (kept with each shot):
  `{subjects[], place, time_of_day, weather_state, wind_state,
  score_state, flags_at_capture}` — the manifest habit applied to
  a toy: every shot knows the world-state that produced it.

**Filters:** in-world only — the device's own treatments (the
FROST CLOSE-UP shift is a lighting device, not a filter; filters
may not borrow it). Filter list is OPEN — no canon list exists;
the format holds slots, names none.

**Album:** shots land in the Mochiioteca beside the dex record of
their subjects (discovery tie: a snapshot of an unseen species is
a *sighting* — it feeds the `seen` bitset's presentation, it does
not grant `met`; the two-bitset law from List 1 #1 stands).

**Show use:** the camera is a character beat, not a segment —
Mochiko photographing the Garden is bonding texture (prosody
type: character-bonding); a snapshot beat may carry a meaning-
subtitle moment but is never an exposition delivery device.
On-screen photos shown in an episode are frames of that episode's
real animation, per the scope law above.

## Wiring

- Discovery system (List 1 #1/#3): sighting presentation.
- Follower system (#58): pose/reaction ranges shared.
- LIVING-WORLD: snapshot metadata reuses its state globals
  (WIND-STATE; weather per #61; SCORE-STATE from List 2 #13).
- Bundle/manifest convention: shot records follow the pipeline's
  hash-what-you-keep habit when exported from the game.

## Coverage

Camera-toy architecture: standard, publicly documented.
Mochiichao specifics: behaviour spec complete; the device's
physical design, filter list, and per-species snapshot pose sets
are OPEN/owed — none invented.
