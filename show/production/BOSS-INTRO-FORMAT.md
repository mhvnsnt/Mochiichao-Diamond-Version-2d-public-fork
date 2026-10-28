# BOSS INTRO FORMAT — dojo-master entrance staging (List 7, #64)

Teardown: the boss-introduction beat in creature-catcher anime
and games — a compressed staging grammar that sells rank before a
word of the fight: the room changes first, the signature arrives
before the person, the reveal is staged by size, and a light or
sound *takeover* marks the moment the space becomes theirs.
Public grammar (anime staging practice; the JoJo/Pokémon staging
research already in the bible): an intro is a promise about the
fight's register, told in about five beats.

## Native format — the intro record

One record per boss figure, stored with their episode/dojo data.
Fields (script + board + composite all read the same record):

```text
INTRO-ID:        BOSS-INTRO-<slug>
FIGURE:          name / role (canon only)
ABSENCE BEAT:    how the space reads before they enter (what is
                 withheld — the room's ordinary life, paused)
SIGNATURE SOUND: their audio signature (cry of their partner /
                 instrument / room tone change) — lands BEFORE
                 the figure is seen
REVEAL STAGING:  silhouette staging ladder step (Palm/Knee/Waist/
                 Tower) + first readable element (motif first,
                 face last or face first — one choice, recorded)
PARTNER RULE:    partner Mochi present in intro? staged as one
                 unit with the figure (the Stand rule: creature +
                 signature composed as ONE unit) or withheld
TAKEOVER:        TK-# preset (LIGHTING-SYSTEM §5) or NONE +
                 ignition/release shapes
NAME TREATMENT:  how the episode presents the name (sign, card,
                 spoken) — in-world artifacts obey the display
                 sweep; production docs keep production names
EXIT LINE:       the held pose / final frame the intro lands on
                 (state changes land only on held poses)
```

**Grammar rules:**
- **Absence before presence.** The intro's first beat is the
  space *without* them, behaving slightly wrong (a cycle pauses,
  a room tone thins — SCORE-STATE leans TENSION). An entrance
  with no absence beat is just a walk-in.
- **Sound before sight.** The signature sound (or its deliberate
  withholding) precedes the reveal. For a dojo master, the sound
  is as likely their partner's cry as anything of theirs — the
  pair is the boss.
- **Motif before face.** The first readable element is the
  signature motif (design-principles law), the face resolves
  last — except when the recorded choice is face-first, which is
  the intimacy register (a master the show wants loved, not
  feared). One choice per figure, on the record.
- **One takeover, theirs.** If the intro uses a lighting
  takeover, it is the figure's own preset igniting — the room
  takes their light. A borrowed takeover is a lie about rank.
- **Cries-only stands.** A partner in an intro vocalizes (cries)
  or is silent; the intro never needs a creature line, and a
  master's dialogue — humans speak — is a script matter outside
  this format's fields.

## Canon roster for Region 1 (names from season canon, nothing added)

Dojo masters in canon list order: **Lin, Falk, Tetsu, Kenji,
Phantom, Shizuku, Homura**, and Dojo 8's leader — a Syndicate
boss whose **name is OPEN in canon**. The format holds Dojo 8's
intro as a record with FIGURE: OPEN; its staging fields stay
empty until the owner names the boss. Elite Four (Umi/Gin/Hono/
Yoru) and Champion Hex take the same format at a higher ladder
step when their episodes come — the format is rank-agnostic, the
ladder step and takeover carry the rank.

## Wiring

- LIGHTING-SYSTEM: TAKEOVER field references its TK presets by
  ID; a figure with no preset yet is `TAKEOVER: NONE` (honest),
  never an improvised one.
- POSING-SYSTEM: REVEAL STAGING + EXIT LINE are pose-library
  calls (intro poses enter the figure's pose vocabulary).
- SEASON-CANON-MAP / episode planning: intro records are written
  when a boss episode is planned (EPISODE-PLANNING-METHOD), not
  before — format now, contents at need.
- The game lane reads the same record for its dojo-leader
  encounter staging (List 5's dojo structure is the game-side
  sibling; this format is the show's, shared by reference).

## Coverage

Grammar: standard boss-staging practice, publicly documented,
re-expressed on house systems. Contents: roster names from season
canon only; every staging field for every figure is unwritten
until their episode is planned — Dojo 8's name explicitly OPEN.
