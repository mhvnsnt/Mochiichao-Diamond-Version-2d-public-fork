# PRODUCTION LOG — 2026-10-27 (the conversation of record)

Owner-directed: the decisions and philosophies from the production
conversations live IN the repo, for the show lane now and game
production later (same universe). This log is the index of rulings;
the governing text lives in the docs named. New rulings append new
dated logs; nothing here is silently rewritten.

## Identity & method
- Construction-kit rule (WORKING-METHOD.md): donors give systems,
  tools, materials, environments, props — never characters, names,
  logos. Backgrounds/environments/props may come over directly.
  Reuse-first: catalogue → select → assemble → make only gaps.
- RESEARCH DIRECTIVE: all future moves research-based only
  (RESEARCH-DIRECTIVE.md + INTEGRATIONS-MAP.md).
- Unified build: everything in ONE flow per scene — research,
  environments, animation (puppets + generative co-author), FX,
  camera, post, audio attached as the scene is built
  (UNIFIED-PIPELINE.md). Studio tools + generative AI combined.
- Wide frame first: design research is the full theory spine, not
  narrow slices (owner correction) — DESIGN-THEORY.md is the spine;
  COLOUR/POSING/PRINCIPLES are its chapters.

## Locked laws (bible §5 + systems docs)
- Voice Law: creatures = pure cries/sounds only. No word dialogue,
  no name-saying. Humans speak.
- Subtitle Law: silent-film intertitles at earned moments only
  (EP01 has exactly 3).
- Likeness Law: characters built from their actual repo art
  (canon title cutouts are the source of truth); generative work
  passes the likeness gate vs the model sheet before it is shown
  as production or shipped. Batch style consistency required.
- Animation Law: animatics/stills are timing proofs, never shipped
  or presented as animation. Frame-verified real motion only.
- Colour: Colour System v2 — four-slot species colourways, the
  Lustre Law, #a03436 discipline, per-location scripts.
- Lighting: the owner's own laws carried from cape-jones +
  Mochiichao (protected identity colours, rim-only environment
  colour, situational rim, takeover sources, overlay-layer shifts)
  — LIGHTING-SYSTEM.md L1–L7.
- Repaints: JoJo-style per-scene non-canon repaints are WELCOME,
  governed by REPAINT-PROTOCOL.md (light engine + lustre engine;
  protected anchors never move).

## Owner rulings & corrections (2026-10-27)
- EP01 "The Garden Has a Ghost" — title + direction approved;
  script v2 LOCKED; v1 deleted so no version confusion. Rule 12
  wording is exact (bible §5). Stinger: Dark Forest, daylight that
  doesn't reach in; something stops moving; never shown.
- Generative pilot batch REJECTED on likeness/style (batch record
  in clip-index + memory): Gabu converged to a Pokémon lookalike;
  Sproutle likewise; Mochii off-style; styles mutually
  inconsistent. Lesson wired in: seed from FULL canon art (title
  cutouts), one style anchor, gate before showing.
- Kittember: CLOSE but rejected — canon correction: the flame is
  ATTACHED TO THE TAIL TIP (never a floating orb); fixed in specs,
  rig scaffold, model sheet, bible, EP01 docs. A detached flame is
  now an automatic design-gate failure.
- Wispkin clip ACCEPTED FOR FLASHBACK ONLY: canon Wispkin wears a
  SKULL MASK; the maskless clip = pre-mask Wispkin; its different
  style is the flashback device. Asset: show/assets/flashback/.
  Wispkin model sheet corrected from the canon cutout.
- Garden Gate plate ACCEPTED as a background; its look is the
  theme anchor for environments going forward.
- Reference set for environments/camera/FX/post: Pokémon, Dragon
  Ball Z, JoJo, Gumball, Chowder (DBZ was the fifth the owner
  named). Chowder donor repo created (cn-gigaleak-chowder) for
  research + native kit under the construction-kit rule.
- LIVING WORLD requirement (owner, on the Scene 1 animatic): the
  animatic is the correct production start, and the finished show
  must live — swinging gate, swaying trees/grass/leaves, moving
  clouds, background creatures (bird-type Mochi in the sky, small
  Mochi crossing fore/background out of focus), B-roll between
  scenes, full ambient sound (rustles, gate shut, footsteps,
  run-throughs, ambience), lighting/after-effects life. Systems
  specced in LIVING-WORLD work (production/research) and wired
  into the next cuts; a still cut is a storyboard, not a scene.

## Open items (never filled silently)
Mochiko voice casting · keeper device design · what stopped
moving in the Dark Forest · the Forest's in-world name · season
length/runtime beyond pilot · the Manual's other Rules · GPU
endpoint for diffusion steps (owner's box via ComfyUI API vs
hosted) · first lustre appearance episode.


## Addendum — EP02–EP05 written (owner delegation 2026-10-27)
Owner delegated writing the first five episodes outright ("let me see what you do"). EP01 was already locked. EP02–EP05 packages (beat sheet + shooting script v1 DRAFT + storyboard plan + cue sheet) committed this date:
- EP02 "Choose, and Be Chosen" (PROPOSED title) — humans enter; Aeon presents the three starter lines; Mochiko chooses Mochii at cut 14 and THE SWITCH hands the protagonist role to Mochii; Hex button sets EP04.
- EP03 "One Ring Past the Gate" (PROPOSED) — first outing; ring game as play-ritual; Gabu featured; Zephling (roster 019, verified from species.json) ambient crossing; EP02/EP04 "tomorrow" tension resolved as a director's reading inside EP03 SS6 (no lines changed).
- EP04 "Dojo at Dusk" (PROPOSED) — Hex + Dorowani featured; dojo sparring; draw by custom (rule text = open item, none invented); the one hard grade spent at the turn (cut 20).
- EP05 "Leave the Light On" (PROPOSED) — night episode; Wispkin leads; the lantern; the Forest acknowledges with one turned leaf; its nature stays a deliberate open item.
All four: creatures cries-only, exactly 2 subtitles each, in-repo audio only on cue sheets, titles PROPOSED pending owner approval.
Owner rulings recorded this date: NAMING LAW (Mochii stays Mochii; Mochiko is the separate human character — never a nickname); VOICES = real voice-clone weights via his Wizard Gang method (Chatterbox + per-character reference audio + tuned params), not plain TTS; STAGING RULE (GitHub for what fits, TeraBox for what's too big, ration into repos in batches, never re-download).

## Addendum — Owner canon rename rulings (2026-10-27, later)
Three naming rulings, whole-canon scope, applied game + show:
1. BINARY WOODS -> THE DARK FOREST. One place, one name, in the
   canon, the whole repo, the whole game. Its contents (mist,
   wild Kittember, Aero Dojo + Cave of Echoes doors, NPCs, the
   humming beat line) carry under the new name; the EP01
   stinger's dread is this same Forest's depths.
2. LIGHT-PULSE -> ILLUMINATE. The world's Flash-equivalent is
   named Illuminate; "Light-Pulse" is retired everywhere.
3. CODEX -> MOCHIIOTECA. The world's Pokedex equivalent takes
   the name canon already held (MochiiMindService); settles the
   Codex/Mochiidex/mochiioteca drift.
Game-repo application: display-name strings renamed on a
dedicated branch off main; internal file/id keys (e.g.
binary_woods.json, story-flag ids) unchanged so wiring cannot
break. Show-side: SEASON-CANON-MAP carries all three rulings.

Rename EXECUTED same day: game repo PR #339 (branch
feature/canon-renames-1, commits 7a90142 + 0802b4e) - Dark
Forest (34 occurrences / 22 files) + Illuminate (2) +
Mochiioteca (6 files), verified at branch head; identifiers
(map ids, story flags) deliberately unchanged; PR open,
unmerged, awaiting the owner.
