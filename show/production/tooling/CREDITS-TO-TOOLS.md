# CREDITS-TO-TOOLS — every role on a Pokémon episode's credits, mapped to open-source software

Research for the Mochiichao show pipeline (feeds the wiring doc / TOOLS-MANIFEST).
Compiled 2026-10-27. Pattern-level only: this takes the *credit structure* of a
real production as a checklist — no Pokémon assets, dialogue, designs, or names
are carried into the show. Tool status column is checked against
`show/production/tooling/TOOLS-MANIFEST.md` (same date).

## 0. The reference credit roll

Source episode: **HZ123 "Mochi Mayhem!"** (*Pokémon Horizons: The Series*,
OLM, Team Kumemura), whose Bulbapedia episode page and the Bulbapedia
"Animated series staff by episode (HZ121–HZ130)" table together document the
full per-episode credit block
(https://bulbapedia.bulbagarden.net/wiki/HZ123 and
https://bulbapedia.bulbagarden.net/wiki/Animated_series_staff_by_episode_(HZ121-HZ130)#HZ123).

### 0a. Roles credited per episode (verbatim role names from the HZ123 staff table)

| # | Credit role (EN) | Japanese | What the job actually is |
|---|---|---|---|
| 1 | Screenplay | 脚本 | Episode script |
| 2 | Screenplay Assistance | 脚本協力 | Script support/research |
| 3 | Storyboard | 絵コンテ | Board the whole episode |
| 4 | Episode Director | 演出 | Direct the episode's cuts/staging |
| 5 | Assistant Director | 副監督 | Series-level deputy director |
| 6 | Animation Directors | 作画監督 | Supervise/correct the episode's drawings |
| 7 | Chief Animation Director | 総作画監督 | Series-wide model consistency |
| 8 | Guest Setting | ゲスト設定 | Designs for episode-specific guests/props |
| 9 | Key Animation | 原画 | Key poses/drawings |
| 10 | 2nd Key Animation | 第2原画 | Cleanup keys / secondary keys |
| 11 | In-Between Animation | 動画 | In-between drawings |
| 12 | In-Between Animation Check | 動画検査 | QC of in-betweens |
| 13 | Color Coordination & Inspection | 色指定・検査 | Assign + verify every colour call |
| 14 | Finishing | 仕上げ | Ink & paint (cel finishing) |
| 15 | Special Effects | 特殊効果 | Drawn/photographic FX (flashes, glows) |
| 16 | Backgrounds | 背景 | Painted backgrounds |
| 17 | Photography | 撮影 | Compositing / camera (the anime "photography" dept.) |
| 18 | Line Photography | 線撮影 | Shooting/cleanup of line art into the pipeline |
| 19 | Production Assistant | 制作進行 | Shot wrangling, schedule, deliveries |
| 20 | Production Assistance | 制作協力 | External production support |
| 21 | Animation Production (team) | アニメーション制作 | The studio function itself (OLM / Team Kumemura in the infobox) |

### 0b. Series-level end-credit block (credited at series level, not per episode)

These are the standing roles on the series' credit roll (the task brief's list,
matching the standard block for this production class):

| # | Credit role | What it is |
|---|---|---|
| 22 | Series Composition | シリーズ構成 — season story architecture |
| 23 | Series Director | 監督 |
| 24 | Character Design | キャラクターデザイン |
| 25 | Art Director | 美術監督 — background art supervision |
| 26 | Color Design | 色彩設計 — the series colour system |
| 27 | Director of Photography | 撮影監督 |
| 28 | Editing | 編集 |
| 29 | CGI / 3DCG | CG shots and 3D-assisted work |
| 30 | Sound Director | 音響監督 |
| 31 | Sound Effects | 音響効果 |
| 32 | Music | 音楽 |
| 33 | Recording / Mixing | 録音・調整 |
| 34 | Voice Cast | 声の出演 |
| 35 | Production Desk | 制作デスク |
| 36 | Setting Production | 設定制作 — bible/settings management |
| 37 | Planning / Producers | 企画・プロデューサー — not a craft-tool role (see §4) |

That is **37 distinct credited functions**. §2 maps a tool to each; §3 scores
the two "one app" candidates against a 28-row craft subset (the 37 minus
duplicates/management-only lines).

---

## 1. How to read the status column

- **WIRED** — installed/working in this project per TOOLS-MANIFEST.md.
- **STANDARD** — adopted as the house standard, runs on the owner's machine
  (OpenToonz 1.8 / Tahoma2D 1.6 per the manifest).
- **SPECIFIED** — chosen in FULLSTACK-WIRING / the manifest, not yet installed.
- **NEW** — recommended by this research, not in the manifest yet.
- **KAGGLE** — runs on the settled Kaggle GPU endpoint (T4 ×2).

---

## 2. Role → best open-source fill

| Credit role(s) | Best open-source fill | Licence | Why this one | Status here |
|---|---|---|---|---|
| Series Composition (22) | Fountain/Markdown scripts in git + `build_manifest.py` | n/a (format) / project code | The role is story architecture; the working artefact is versioned structured scripts — this project's house shooting-script Markdown + manifest compiler already does it | WIRED |
| Screenplay + Assistance (1, 2) | House Markdown/Fountain pipeline (alt. editor: KIT Scenarist or Trelby) | GPL (editors) | Fountain is the open screenplay format; the project's scripts already compile to manifests — an editor is optional comfort, not a capability gap | WIRED (editor NEW/optional) |
| Storyboard (3) | **Blender** (Grease Pencil storyboard workflow) | GPL | GP boards with camera moves and timing are a flagship Blender use; exports straight into previz | SPECIFIED (owner machine) |
| Episode Direction (4) | **Tahoma2D / OpenToonz** xsheet | Modified BSD | The xsheet *is* episode direction in anime form: timing, levels, camera, per-cut notes | STANDARD |
| Assistant Director (5) | Kitsu review/task flow — or git + manifests (see note) | AGPL-3.0 | Deputy-director work = assignment + review loops; Kitsu is the purpose-built open tool. FULLSTACK-WIRING already deferred Kitsu until a second regular human joins — manifest+git covers it until then | DEFERRED (by design) |
| Animation Directors (6) | OpenToonz (level/style QC) + project likeness/anim gates | Modified BSD | Supervision = checking drawings against model + palette; OT's style system plus this project's automated likeness gate covers the check mechanically | STANDARD + WIRED (gates) |
| Chief Animation Director (7) | Model sheets (Krita) + OpenToonz palette/style enforcement + likeness gate | GPL / BSD | Series consistency lives in model sheets and enforced palettes, both covered | STANDARD/WIRED |
| Guest Setting (8) | **Krita** (+ Inkscape for hard-surface/prop sheets) | GPL-3.0 (Krita) / GPL (Inkscape) | Episode-guest design sheets are a drawing task; Krita is the strongest open painting tool | NEW |
| Character Design (24) | Krita (with the project's model-sheet docs) | GPL-3.0 | Same as above; project model sheets already exist for the pilot six | NEW (tool) / WIRED (sheets) |
| Key Animation (9) | OpenToonz/Tahoma2D (drawn) · TextRig/Rigby2D → DragonBones (puppet) · Blender GP (hybrid) | BSD / MIT / Apache-2.0 / GPL | Three genuine routes, all already in the stack: drawn keys in OT, puppet keys from the rig tools, GP for drawn-on-3D | STANDARD + INSTALLED (TextRig smoke-tested; Rigby2D cloned) |
| 2nd Key Animation (10) | Same stack as Key Animation | — | Cleanup keys are the same tools at a different pass | as above |
| In-Between Animation (11) | OpenToonz (vector-level inbetweening) + RIFE frame interpolation via ComfyUI for assists | BSD / varies (see §4) | OT auto-inbetweens vector levels; interpolation can assist raster passes — with an honest quality caveat (§4) | STANDARD + KAGGLE |
| In-Between Check (12) | OpenToonz playback/xsheet review + episode_gate-style checks | BSD | Frame-stepped review against timing is built into the xsheet workflow | STANDARD |
| Color Design (26) + Color Coordination & Inspection (13) | **OpenToonz palette/style system** (series palettes enforced per level) + project COLOR-SYSTEM.md | BSD | 色指定 is literally a palette-assignment discipline; OT's style/palette architecture was built for it | STANDARD + WIRED (doc) |
| Finishing / Ink & Paint (14) | **OpenToonz** (Cleanup → Paint) | Modified BSD | This is Toonz's historic core job — trace, clean, and paint cels to palette | STANDARD |
| Special Effects (15) | **Natron** + Blender compositor + OpenToonz FX schematic | GPL-2.0 (Natron) / GPL / BSD | Anime tokukō = glows, blurs, flashes, grain: node compositors do all of it; OT FX covers in-app cases | SPECIFIED (Natron fallback) + STANDARD |
| Backgrounds (16) | **Krita** (paint) + **Blender** (3D-assisted plates) + ComfyUI plates | GPL-3.0 / GPL / GPL-3.0 | Painted BGs in Krita; Blender for perspective-true plates; generative plates via the Kaggle endpoint | NEW (Krita) / SPECIFIED / KAGGLE-WIRED |
| Art Director (25) | Krita + Blender + project ENVIRONMENT-AND-CAMERA / COLOR-SYSTEM docs | — | Supervision role; tools are the BG stack above | as above |
| Photography / Compositing (17) | **Natron** (node comp, OCIO) — alt. Blender Compositor, OpenToonz FX | GPL-2.0 | "Photography" in anime = compositing all elements with camera + optical FX; Natron is the dedicated open compositor | SPECIFIED |
| Director of Photography (27) | Natron/Blender comp decisions (human/agent judgement on the tools above) | — | Same stack as 17 | SPECIFIED |
| Line Photography (18) | **OpenToonz Cleanup module** (GTS scanning on Windows) | Modified BSD | This credit exists for shooting line art cleanly into production; OT's Cleanup is the exact open equivalent | STANDARD |
| Editing (28) | **Kdenlive** for the edit; FFmpeg finish spine for conform/loudness | GPL-2.0+ (Kdenlive) / LGPL+GPL (FFmpeg) | A real NLE for picture edit; the project's gated finish (loudnorm etc.) already runs on FFmpeg | NEW (Kdenlive) / WIRED (FFmpeg) |
| CGI / 3DCG (29) | **Blender** (Cycles/Eevee) | GPL | Only open tool that does production 3D end-to-end | SPECIFIED |
| Sound Director (30) | **Ardour** (DAW: mix, automation, stems) | GPL-2.0+ | Full open DAW; the project's per-scene beds already prove the mix spec (−14 LUFS finish) | NEW |
| Sound Effects (31) | **Audacity** (edit/design) + Freesound CC0 via `sfx_pull.py` + FFmpeg processing | GPL-3.0 (Audacity) / CC0 (assets) | CC0 library pulls are already scripted in-project; Audacity is the bench editor | WIRED (puller; key-gated) / NEW (Audacity) |
| Music (32) | **LMMS** (compose/produce) + **MuseScore** (notation) — plus the owner's existing title track + mixer stems already in the game repo | GPL-2.0 (LMMS) / GPL-3.0 (MuseScore) | Composition tooling is solved; the show's theme/stems already exist as assets | NEW (tools) / WIRED (assets) |
| Recording (33) | **Ardour** / Audacity capture | GPL | Standard DAW recording; voice-pipe renders cover synthetic capture | NEW |
| Voice Cast (34) | **Chatterbox** (cloned human voices) + **Kokoro** (scratch) + **Rhubarb** (lip-sync timing) | MIT (Chatterbox) / Apache-2.0 (Kokoro) / MIT (Rhubarb) | Chatterbox is MIT incl. weights (verified) and is the owner's own voice-pipe engine; Rhubarb is installed. Synthetic cast ≠ human cast — see §4 | SPECIFIED (Chatterbox/Kokoro) / INSTALLED (Rhubarb) |
| Production Desk (35) + Production Assistant (19) + Production Assistance (20) | **Kitsu** (CGWire) when team size warrants; today: git + build manifests + episode_gate | AGPL-3.0 (Kitsu/Zou; Gazu LGPL) | Kitsu is the industry open-source production tracker (300–400 studios self-host). Manifest verdict stands: not warranted yet for a one-human+agents studio | DEFERRED (by design) |
| Setting Production (36) | The repo itself: show bible + shared manifests (cast/parts/clip-index) in git | n/a | 設定制作 = keeping the bible/settings authoritative and current — already the repo's structure | WIRED |
| Animation Production (21) | The assembled pipeline: OpenToonz MCP + TextRig/Rigby2D + ComfyUI + gates | mixed (all above) | The "studio" is the wired stack itself | WIRED (core) |

---

## 3. The "one thing that fills every credit" analysis

The owner asked for the single open-source application that covers the most
credit roles by itself. The two real candidates are **Blender** (GPL) and
**OpenToonz** (Modified BSD). Krita and Godot were also scored as dark horses
(summary line only — neither is close).

Scoring: ● = the app genuinely does this job at production level (1 pt) ·
◐ = partial/workaround-level (0.5) · ○ = cannot do it (0). 28 craft roles.

| # | Role | Blender | OpenToonz | Notes |
|---|---|---|---|---|
| 1 | Series composition | ◐ | ○ | Blender has a text editor, not a writing tool; OT has none |
| 2 | Screenplay | ◐ | ○ | Same as above |
| 3 | Storyboard | ● | ◐ | GP storyboarding is a flagship Blender workflow; OT can only lay panels as levels |
| 4 | Episode direction | ◐ | ● | The xsheet *is* anime episode direction; Blender assembles scenes/VSE instead |
| 5 | Assistant direction | ◐ | ◐ | Both are organisational workarounds only |
| 6 | Animation direction | ◐ | ● | OT: level/style QC in-app; Blender: review playback only |
| 7 | Chief anim. direction / model QC | ◐ | ● | OT enforces styles/palettes per level |
| 8 | Character & guest design | ◐ | ◐ | Both can draw; neither beats a paint app |
| 9 | Key animation | ● | ● | Blender: GP + 3D. OT: drawn production core |
| 10 | 2nd key animation | ● | ● | Same tools, cleanup pass |
| 11 | In-between animation | ● | ◐ | Blender: GP interpolation + shape keys. OT: auto-inbetween only on vector levels |
| 12 | In-between check | ◐ | ● | OT's frame-stepped xsheet review is the dedicated workflow |
| 13 | Color design / coordination | ◐ | ● | OT's palette/style architecture was built for 色指定 |
| 14 | Finishing (ink & paint) | ◐ | ● | Toonz's historic core job; Blender GP fill is not cel-specialised |
| 15 | Special effects | ● | ● | Blender sims + compositor; OT FX schematic (glow/blur/particles) |
| 16 | Backgrounds / art | ● | ◐ | Blender: 3D + GP plates. OT raster painting is basic |
| 17 | Photography (compositing) | ● | ● | Blender: full node compositor. OT: FX schematic models anime photography |
| 18 | Line photography (cleanup) | ○ | ● | OT Cleanup (+GTS scan) is the exact equivalent; Blender has nothing |
| 19 | Editing | ● | ◐ | Blender VSE is a real editor; OT renders/previews only |
| 20 | CGI / 3DCG | ● | ○ | Blender is a full 3D suite; OT has no native 3D scene |
| 21 | Rigging / puppet build | ● | ◐ | Blender armatures are industry-grade; OT Plastic tool is a genuine but lighter mesh puppet |
| 22 | Sound direction | ◐ | ◐ | Both sequence audio; neither is a DAW |
| 23 | Sound effects | ◐ | ◐ | Placement/editing of existing audio only |
| 24 | Music composition | ○ | ○ | Neither composes |
| 25 | Recording (audio capture) | ○ | ○ | Blender cannot record audio; OT at best scratch-grade |
| 26 | Voice performance | ○ | ○ | No TTS/performance in either |
| 27 | Lip-sync | ◐ | ◐ | Manual shape-key/mesh work in both; automation is external (Rhubarb) |
| 28 | Production desk / tracking | ○ | ○ | Neither tracks a production |
| | **TOTAL** | **16.5 / 28** | **16.0 / 28** | |

Dark horses (same rubric, abbreviated): **Krita ≈ 7** (design, BGs, drawn
keys, boards — no comp/edit/sound/3D), **Godot (MIT) ≈ 6.5** (2D rigs,
timeline animation, basic audio/video playback — it is a game engine, not a
production suite), **Kdenlive ≈ 3.5** (editing plus light audio only).

### Verdict

**Blender is the single-app winner — by half a point, and on breadth, not on
the anime core.** It is the only open application that natively spans
storyboard → key animation → rigs → CGI → compositing → editing, which is
why it takes rows 3, 11, 19, 20, 21 outright. But the honest split matters:

- **OpenToonz wins the roles that make anime look like anime**: episode
  direction (xsheet), animation supervision, colour coordination, finishing,
  line photography, in-between check. If forced to ship a 2D episode with one
  app, OpenToonz produces the more authentic artefact; Blender produces the
  more complete one.
- **Together they cover 20.5/28** (15 roles at full strength), and every
  remaining gap is filled by a small satellite already named in §2:
  scripts-in-git (composition/screenplay), LMMS/MuseScore (music),
  Ardour/Audacity (recording/SFX bench), Chatterbox+Rhubarb (voice/lip-sync),
  Kitsu-or-manifests (desk).
- **Neither app — nor any single open app — covers the whole roll.** The
  "one thing" that fills every credit does not exist as one binary; the
  closest honest answer is **Blender as the spine + OpenToonz as the anime
  core**, which is exactly the pairing this project already specified.

---

## 4. Honest gaps — roles with no good open-source fill

1. **Voice Cast (34) — no true fill.** No software replaces human voice
   actors. Chatterbox (MIT) is the project's chosen synthetic route and the
   owner's own engine, but the project's VOICE-SCRATCH law stands: synthetic
   voices are scratch until the owner casts. *Workaround:* Chatterbox renders
   from owner-chosen references + Rhubarb timing; casting decision stays open.
2. **Music (32) — tooling yes, composer no.** LMMS + MuseScore fully cover
   the *desk*, but there is no open tool that fills the credited composer
   function at network level. *Workaround (already in hand):* the owner's
   existing title track + full mixer stems in the game repo are the show's
   music base; LMMS/MuseScore extend it. ⚠️ Licence trap: generative-music
   shortcuts are mostly unusable commercially — MusicGen's code is MIT but
   its released **weights are CC-BY-NC-4.0** (likewise F5-TTS weights for
   voice). Excluded from the ship path.
3. **In-betweening at hand-drawn quality (11) — partial only.** OpenToonz
   auto-inbetweens vector levels; RIFE-class interpolation assists raster
   passes but smears on held anime timing and fast action. No open tool
   matches a studio douga pass. *Workaround:* puppet/rig animation
   (TextRig/Rigby2D) for series work — in-betweens are inherent to rigs —
   plus hand keys where it counts; interpolation only as an assist, gated.
4. **Series Composition / Sound Direction / Art Direction — judgement
   roles.** Tools support all three (Fountain+git, Ardour, Krita/Blender),
   but the credited function is taste and supervision. *Workaround:* the
   project's house systems (SHOW-BIBLE, COLOR-SYSTEM, prosody sheets) encode
   the judgement as checkable rules + gates — the role is filled by
   owner+agent, not by an app.
5. **Planning / Producers (37) — not a software role at all.** No fill
   needed or possible; Kitsu covers its paperwork shadow (schedules,
   budgets) when the team grows.
6. **Proprietary-format trap (rigging).** Spine's editor and the DragonBones
   editor are proprietary; the pipeline avoids both — TextRig (MIT) *emits*
   DragonBones format without the proprietary editor, and Rigby2D
   (Apache-2.0) is fully open. No gap in practice, flagged so nobody wires
   the proprietary editors in by habit.

---

## 5. Wiring deltas vs. TOOLS-MANIFEST.md (what this research adds)

Already wired/standard/specified and confirmed as the right fills: FFmpeg,
OpenToonz/Tahoma2D, TextRig, Rigby2D, Rhubarb, ComfyUI+Wan (Kaggle),
Blender, Natron, Chatterbox/Kokoro, git+manifests as the desk.

**New installs recommended (all small, no-sudo, ~/opt discipline):**
Krita (design/BG/guest-setting) · Kdenlive (picture edit) · Ardour (sound
direction/recording) · Audacity (SFX bench) · LMMS + MuseScore (music desk)
· Inkscape (prop/setting sheets).

**Explicitly NOT now:** Kitsu (deferred per FULLSTACK-WIRING until a second
regular human — revisit trigger unchanged) · F5-TTS and MusicGen weights
(CC-BY-NC — licence-excluded) · Spine/DragonBones proprietary editors
(format only, via TextRig).

---

## Sources

- Episode credits (HZ123 infobox: animation team, screenplay, storyboard,
  assistant director, animation directors):
  https://bulbapedia.bulbagarden.net/wiki/HZ123
- Full per-episode staff table for HZ123 (all roles in §0a, incl. key /
  2nd key / in-between / check / colour / finishing / FX / backgrounds /
  photography / line photography / production assistant):
  https://bulbapedia.bulbagarden.net/wiki/Animated_series_staff_by_episode_(HZ121-HZ130)#HZ123
- Kitsu/Zou AGPL, Gazu LGPL; studio adoption:
  https://www.cgchannel.com/2019/02/check-out-open-source-production-tracking-tool-kitsu/
  and https://forum.cloudron.io/topic/13106/kitsu-collaboration-platform-for-animation-and-vfx-studios
- Chatterbox MIT (code + weights, commercial-safe); Kokoro Apache-2.0;
  F5-TTS weights CC-BY-NC-4.0; MusicGen code MIT / weights CC-BY-NC-4.0:
  https://www.forasoft.com/blog/article/voice-cloning-synthesis and
  https://www.resemble.ai/learn/models/chatterbox-turbo
- OpenToonz New/Modified BSD licence; full 2D pipeline incl. scanning (GTS),
  cleanup, paint, compositing: https://www.linuxlinks.com/opentoonz-2d-animation-software/
- Krita GPL-3.0; LMMS GPL-2.0; OpenToonz BSD-3-Clause (listing); Godot MIT:
  https://www.gamegeniuslab.com/the-ultimate-guide-to-open-source-tools-for-indie-game-developers/
- Natron GPLv2; Kdenlive GPLv2+; Blender GPL; Ardour (DAW):
  https://wiki.snowdrift.coop/market-research/flo-tools
- Project state cross-check: `show/production/tooling/TOOLS-MANIFEST.md`
  (repo) — status column in §2 is taken from it verbatim where marked WIRED /
  STANDARD / SPECIFIED.
