# #26 — CREDITS-ROLL SYSTEMS → show credits format

**Teardown (published broadcast practice + the project's own
CREDITS-TO-TOOLS mapping).** An anime credit roll is a *fixed-order
staff table*, not free text: series-level roles first (planning,
original work, series composition, direction, character design,
music), then per-episode roles (screenplay, storyboard, episode
direction, animation supervision, key animation), then cast, then
production/copyright cards. Two artefacts share the roll: the
**OP/ED card stack** (held cards over picture/music) and the
**episode data record** the roll is generated from. The project's
CREDITS-TO-TOOLS research already established the role list (the
HZ123 roll: 21 per-episode + 16 series-level functions) and mapped
every role to its open-source fill in this pipeline — the credits
format is where that mapping becomes a deliverable.

**Native spec — `mochiichao/credits/v1`.**

- **Source of truth is data, never the rendered roll:** each episode
  carries a `credits.json` beside its cue sheet with two blocks —
  `series_roles` (inherited, changed only on a series-level change)
  and `episode_roles` (per episode). Role names use the research
  doc's verbatim role vocabulary so the tool mapping stays joined:
  every credited role in the file can be looked up in
  CREDITS-TO-TOOLS §0a/§2 in one step.
- **People vs pipeline:** this production's roles are filled by the
  pipeline + owner, and the roll must say what actually happened —
  each role entry is `{role, credit_name, tool_ref}` where
  `tool_ref` names the wired tool/system that performed it (from
  the mapping: e.g. Animation Production → OpenToonz/Tahoma2D +
  Blender spine; Music → Ardour + owner stems; Voices → voice-kit).
  Roles with no honest fill (the research doc's gaps — e.g. voice
  cast pre-casting) are credited as they stand in reality
  (VOICE-SCRATCH state shown in production records; the *broadcast*
  roll lists the cast once cast — until then episodes are
  pre-release artefacts and the format marks `roll_status:
  PROVISIONAL`). Never credit a tool or person for work not done.
- **Roll rendering:** ED card stack generated from `credits.json`
  (series block → episode block → cast → production card), held-card
  durations from the episode plan's ED budget (75 s in EP01's
  full-length accounting), typography from the identity kit (same
  lockup discipline as the #24 title card). A render is a build
  artefact: regenerate on any credits.json change, never hand-edit.
- **Cast block ordering:** humans before creatures is wrong here by
  the show's own law — cast lists the human voice cast by name;
  creatures are credited by species with cry credit to the cry
  system (parameter design), not to a performer who doesn't exist.

**Wiring.** CREDITS-TO-TOOLS.md is the role/tool authority; the
episode package format gains `credits.json` next to the cue sheet;
the timing system (#16) reserves the ED card timings in the same
xsheet discipline; the OP spec (#24) and this format share the
identity kit so title and credits are one visual system.

**Coverage.** Roll structure: standard, fully documented, and the
role vocabulary is the project's own verified research. Who fills
each role on a given episode is production fact recorded per
episode — this format asserts structure only.
