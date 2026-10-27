# Next Plan After the Art Lane — Work Queue for All Agents

> **Ordered by Mars, 2026-10-26 ~19:41 CDT:** put the Game Freak next-steps research in the repo so ALL agents can queue work from it to get the game finished.
> **Research date:** 2026-10-26 CDT (report written 2026-10-27 UTC).
> **Source report:** deep-research report, public sources only — no leaked internal Nintendo/Game Freak files, no unreleased source code, no ROM dumps were used, even where search results mentioned them.
> **Companion page for Mars's eye:** the "What Game Freak Does Next" artifact page (same research, readable form). This doc is the agent work queue.
> **Confidence: MODERATE, with a major caveat.** No public Game Freak interview, GDC/CEDEC talk, book, or postmortem publishes a single canonical, dated "post-art checklist." What follows is a **reconstructed, overlapping sequence — not a waterfall**. Phases overlap heavily and converge; Game Freak's own stated style is to keep adding and revising "as we break down the game into its final product."
> **How agents use this doc:** each phase has a TODO status block. To claim a phase, edit its status line (status, owner lane, date claimed). Do NOT delete phases, do NOT rewrite the sourced evidence, and do NOT present the "Could not verify" items as Game Freak practice. When a phase's work lands, update its status line and link the PR — keep the evidence sections intact for the next agent.
> **Central finding — read this first:** "art complete" is NOT a gate at Game Freak. In the 3D era, creature designs had to be **locked early** precisely so the rest of production could happen. Treating sprite/model completion as the *start* of production inverts Game Freak's order. Design lock is an *input* to integration, not the end of the art lane. Even after lock, art-adjacent fixes continue very late.

## Queue overview (Phases 0–10, as in the source report)

| Phase | Name | Status |
|---|---|---|
| 0 | Reframe the milestone: lock designs, do not wait for "all art" | TODO |
| 1 | Engine wiring / integration of art into the game | TODO |
| 2 | Data assignment: moves, types, stats, encounter and version tables | TODO |
| 3 | World / level assembly and story / event scripting | TODO |
| 4 | Battle-system tuning and balance (the longest iterative lane) | TODO |
| 5 | Sound / music integration | TODO |
| 6 | Playtesting, QA and the debug phase | TODO |
| 7 | Localisation (in parallel, but gating the worldwide release) | TODO |
| 8 | Performance optimisation, polish, and post-launch repair | TODO |
| 9 | Marketing / demo builds and release preparation | TODO |
| 10 | Overlap: the next game starts before this one ships | TODO |

---

## Phase 0 — Reframe the milestone: lock designs, do not wait for "all art"

**What it contains:** Finalise creature designs early enough for modelling, animation and data work to proceed. Art-adjacent fixes continue very late even after lock (see Phase 1).

**Public evidence:**
- *Pokémon X/Y*: art director Ken Sugimori — "since all the Pokemon are 3D models this time, we had to finalize the designs at a pretty early point in development. Most of the design team's work was completed by the end of 2012" — Polygon, 23 Oct 2013, reporting a Famitsu interview — https://www.polygon.com/2013/10/23/5015194/how-game-freak-built-the-new-creatures-and-over-700-3d-models-for

**Why it matters:** If you treat sprite/model completion as the *start* of production, you invert Game Freak's 3D-era order. Design lock is an *input* to integration, not the end of the art lane.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: none (this is the framing step)
- Done when: the art lane's lock list is frozen as integration input, with a named process for late art-adjacent fixes (Phase 1)

## Phase 1 — Engine wiring / integration of art into the game

**What it contains:** Export/import of models and animations into the game engine; delivery checks in the same environment as the title; shader/material work; late visual fixes requested from programmers; memory and loading engineering for the target hardware.

**Public evidence:**
- *X/Y* / Creatures: Takao Unno and Creatures created animated 3D models for all ~700 Pokémon then existing; "right at the very end, we begged the programmers to add light or dark thicknesses to the outlines around each 3D model, so they'll look closer to the 2D illustrations" — same Polygon/Famitsu source as Phase 0.
- Up to *Sword/Shield*, the per-title pipeline was: set title-specific specs, build data in Maya, create materials with ShaderFX, set all locators in Maya, and do delivery checks in the same environment as the title. With cumulative Pokémon passing 1,000, rebuilding every title was "reaching its limit," prompting a revised pipeline for *Legends: Arceus* and *Scarlet/Violet* — CEDEC 2022 talk by Game Freak CG Technology Director Keiichi Maezawa, as reported by Nintendo Life, 26 Aug 2022 — https://www.nintendolife.com/news/2022/08/game-freak-confirms-pokemon-legends-arceus-started-development-before-sword-and-shields-launch
- *Gold/Silver* era, same principle on Game Boy Color: because the world is connected rather than separate town maps, "as the protagonist walks down a route, the game has to pre-load the graphics of the next town and the next Pokemon he'll encounter" — Nintendo Online Magazine, July 2000 — https://greenfieldcity.net/pokemon/interviews/g2/nintendoonline_gs
- Early Game Boy capacity fight: Masuda described Red/Blue development as "a fight against capacity, a fight against what we could fit onto the cartridge," including the tile-movement trick for the map — Retro Gamer interview with Masuda and Sugimori, summarised by GoNintendo — https://gonintendo.com/stories/270126

**Practical next step (from the report):** Freeze the model/animation set, run engine-import and in-game delivery checks, and reserve programmer time for late outline/shader/loading fixes — Game Freak's own history shows these are *not* finished when the model is finished.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 0 (design lock)
- Done when: art is wired into the playable build with in-game delivery checks passed, and late-fix capacity is reserved

## Phase 2 — Data assignment: moves, types, stats, encounter and version tables

**What it contains:** Decide which moves each creature learns, its type(s), base stats, rarity/encounter rates, and which version it appears in. This is where a drawing becomes a playable battler.

**Public evidence:**
- *Red/Blue*: "We started by creating loads of different Pokemon designs, then we reduced that down to the favorite 150… After that, once we were happy with our designs, we started working on the moves they could each use. This process probably accounted for around three of those six years. There wasn't an initial plan of which Pokémon would get which moves – we designed the Pokémon then designed the moves, then decided which would fit well together as a gradual process" — Masuda, same Retro Gamer/GoNintendo source.
- Encounter design: Nishino said rare Pokémon were deliberately made hard to obtain, and animal-like Pokémon made more common, because rarity drives collecting — same Nintendo Online/Gold & Silver interview.
- Version split: *Sword/Shield* "share the same underlying systems, so throughout the early part of development, when we're developing those core systems, it'll be a single version… It's really when we start getting into more of which Pokémon appear in which game, and kind of the data table stuff, where they split into two different versions… Definitely the latter half of development" — Masuda, via Game Informer, summarised by DualShockers — https://www.Dualshockers.com/pokemon-sword-and-shield-development-story/ (search snippet only — one step lower in confidence)

**Practical next step (from the report):** Build the data tables (moves, stats, encounters, version exclusives) *after* core systems, and only then branch versions. Do not branch on art completion alone.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 1 (core systems wired)
- Done when: moves/stats/encounter/version tables are assigned and playable in the build

## Phase 3 — World / level assembly and story / event scripting

**What it contains:** Region layout (roads/routes connecting towns, not filling every inch of map), field encounters, gym/route puzzles, camera and movement systems, and story/event scripting that gives creatures a narrative function.

**Public evidence:**
- *Red/Green* world design: Tajiri said Kanto was designed as roads punctuating the map, modelled on real local roads/highways, which also avoided filling every inch — Tajiri interview, via Dr Lava translation — https://lavacutcontent.com/satoshi-tajiri-pokedex-interview/ (search snippet only)
- *Sword/Shield* tall grass: Ohmori said tall grass took "about a half-year of disagreements" to settle, because it is the main way players meet wild Pokémon; distance, space and graphics presentation all affect gameplay — Famitsu interview with Ohmori and Masuda, via Siliconera, summarised by NintendoSoup — https://nintendosoup.com/game-freak-spent-half-a-year-fussing-over-tall-grass-in-pokemon-sword-shield/ (search snippet only)
- *Sword/Shield* Wild Area and camera: Ohmori describes debate over free camera control in the Wild Area, experimentation with random vs. visible encounters, and landing on a hybrid system — Pokemon.com interview, 13 June 2019 — https://nintendobserver.com/2019/06/pokemon-we-interview-junichi-masuda-and-shigeru-ohmori-about-pokemon-sword-and-pokemon-shield/
- Story/scripting is iterative and two-directional: Sugimori said designs generally came first and a story was created to fit around them, but some Pokémon were made specifically for a story aspect; planners also asked for a Pokémon to fill a story function, e.g. blocking a path — Nintendo Online/Gold & Silver interview and Shmuplations 2000 developer interview — https://shmuplations.com/pokemon/ (search snippet only)
- Near the end of *Black/White* development, all staff played through the entire scenario and story; that playthrough is what generated the *Black/White 2* sequel idea — Game Informer interview with Masuda, Sep 2012 — https://gameinformer.com/b/features/archive/2012/09/17/gamefreak-talks-pok-233-mon-s-first-numbered-sequel?amp=

**Practical next step (from the report):** Assemble routes, encounter zones and scripted events in parallel with data work, and expect world details (grass placement, camera, encounter mode) to be argued over for months — they are gameplay, not decoration.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 2 (data tables) in parallel
- Done when: routes, encounter zones, and scripted story events are assembled and playable

## Phase 4 — Battle-system tuning and balance (the longest iterative lane)

**What it contains:** Put creatures in the game, test how they feel, adjust stats/moves/types, re-test; dedicated balance work for any new type or mechanic; internal battle competitions as a test method.

**Public evidence:**
- Gold/Silver "Fine-Tuning" section: Masuda — "It's our style here at Game Freak is to continue adding things as we break down the game into its final product… We don't just come up with ideas and stick to them, we all brainstorm as a team." Watanabe — "fine-tuning was the most difficult part." Sugimori — with 151 Pokémon, "it wouldn't work if some were really strong and others were just really weak. So we had to balance them out with a lot of fine-tuning." Nishino — Tajiri set basics, Nishino balanced intricate details: "First I'd look at the Pokemon's design and wonder 'How strong does it look?' Then we'd put it in the game and test it out — and if it didn't feel right, I'd make some adjustments. That took me a long time, doing it over and over again until it felt right." — Nintendo Online/Gold & Silver interview.
- *X/Y* Fairy type: "We have a team over at Game Freak that focuses solely on getting this balance right, so when adding fairy type they were looking at each individual Pokémon and thinking of all the different combinations of moves in battle… They even hosted internal competitions at Game Freak to battle amongst each other and check that everything was perfect!" — Masuda, Nintendo Life, 20 Sep 2013 — https://www.nintendolife.com/news/2013/09/interview_junichi_masuda_and_hironobu_yoshida_discuss_pokemon_x_and_y_mega_evolutions_and_the_2ds?page=2
- *Sword/Shield* Dynamax balance goal: "making it so that any Pokémon could be viable in battle. Virtually all the Pokémon can Dynamax… Even Pokémon that may not have had a chance to be in the spotlight until now will have a chance" — Ohmori, Pokemon.com interview (above).
- Scale constraint: Sugimori (via GamesRadar summary of a games™/Retro Gamer interview) said ~100 new Pokémon per game is set by project duration, and "If you added like 300 or so new monsters, that'd just be too many – we have to think of the balance of battles" — https://www.gamesradar.com/games/pokemon/game-freak-cant-add-hundreds-of-new-pokemon-and-more-types-every-generation-or-else-new-games-would-take-too-long-to-make-director-says-if-you-added-like-300-or-so-new-monsters-thatd-just-be-too-many/ (search snippet only)

**Practical next step (from the report):** Staff the balance loop as a dedicated, repeating cycle (design → in-game test → adjust → re-test), not as a one-off pass after art. Budget for it to be described by the team itself as the hardest part.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phases 1–2 (wired, playable battlers)
- Done when: repeated balance cycles have run (test → adjust → re-test) and no creature is dominant or useless by design

## Phase 5 — Sound / music integration

**What it contains:** Compose/arrange battle, field and event music; create creature cries/sound effects; time music and effects to in-game actions (battle start, Poké Ball throw); check that music triggers correctly in every battle context.

**Public evidence:**
- Masuda, originally composer/programmer: early Pokémon games were "being developed simultaneously with the sounds and music, so Mr. Masuda had to imagine what a scene would sound like. Sometimes I'd have a visual effect that I could match the music to, like the little falling sound before the battle begins. We also had to work on timing, such as making sure the music doesn't start until the Trainer throws out his or her Poké Ball" — PocketMonsters.net, "A Conversation with Pokémon's Musical Maestro" — https://www.pocketmonsters.net/index.php/content/Interview_A_Conversation_with_Pokemons_Musical_Maestro (search snippet only)
- *Sword/Shield*: primary composers Go Ichinose and Minako Adachi; Ohmori directed music toward UK rock; the Wild Area required longer songs with ups and downs — Pokemon.com interview (above).
- *X/Y*: Masuda returned as composer for battle themes while also directing; score by Kageyama, Adachi, Sato, Masuda, Ichinose and Aoki — Pokémon X and Y development summary — https://en.wikipedia.org/wiki/Pok%C3%A9mon_X_and_Y (secondary summary; use only for composer list, not for process claims)

**Practical next step (from the report):** Integrate audio *during* integration and balance, with explicit timing checks per scene/battle trigger — not as a post-production dub. A music-trigger bug (Elite Four/Top Champion music in *Scarlet/Violet*) was still being fixed in a post-launch patch (see Phase 8).

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phases 1, 4 (integration + balance, in parallel)
- Done when: music/effects trigger correctly per scene/battle, timing-checked

## Phase 6 — Playtesting, QA and the debug phase

**What it contains:** Internal staff playthroughs of the full scenario; partner-company debugging/testing at scale; bug fixing and fine-tuning; a recognised "beta" stage late in development.

**Public evidence:**
- *Sword/Shield* timeline: concept ~1 year, then full production, and "All of that, along with the debug phase, took about three years" — Ohmori, Pokemon.com interview (above). This is the clearest public statement that debug is a named, terminal phase in Game Freak's own vocabulary.
- *Sword/Shield* scale: "there's more than a hundred people who worked on debugging the game, the testing and all of that" at partner companies; Creatures ~100 on models; Game Freak core ~200; ~1,000 total including marketing/PR — Polygon interview with Ohmori and Masuda, summarised by GoNintendo — https://gonintendo.com/archives/321646-game-freak-breaks-down-the-1-000-person-team-that-helped-make-pokemon-sword-and — (search snippet only)
- *Sun/Moon* beta: "The idea for the Ultra games started to form late in development on Sun and Moon, when those titles were still in a beta phase" — The Verge, 19 Oct 2017, interview with Ohmori and Kazumasa Iwao — https://greenfieldcity.net/pokemon/interviews/g7/verge_usum
- *Black/White* staff playthrough near the end of development (Phase 3 above) doubles as playtesting evidence.
- *Sun/Moon* overall: "an all-new generation game takes about three years of development… Even with Sun and Moon, we had a team of around 120, but it still took us about three years" — Masuda, GameSpot — https://www.gamespot.com/articles/pokemon-sunmoon-devs-on-legendaries-pokemon-go-and/1100-6444620/

**Practical next step (from the report):** Plan a distinct, staffed debug phase (not just "fix bugs as found"), with external/partner testers, and a late beta build that is complete enough for full-scenario playthroughs.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phases 1–5 (a complete-enough build to play through)
- Done when: a named debug phase has run with full-scenario playthroughs and a late beta build

## Phase 7 — Localisation (in parallel, but gating the worldwide release)

**What it contains:** Translate script and names into all release languages in a single build; resolve name rights/trademark conflicts in every territory; test language selection and text overflow.

**Public evidence:**
- *X/Y* seven-in-one: "We didn't make different games in different languages for different countries. Instead, we took a seven-in-one approach. In other words, we put all seven languages – Japanese, English, French and so on – into one version of software, and the players can choose whichever language they like… Until now, we've always made seven separate versions of the software, one for each language, but this time we just needed to make one" — Ishihara, Iwata Asks: Pokémon X and Y — https://www.nintendo.com/en-gb/Iwata-Asks/Iwata-Asks-in-Motion-Pokemon-X-and-Pokemon-Y/Pokemon-X-Pokemon-Y/1-Simultaneous-Worldwide-Release-A-First-for-the-Series/1-Simultaneous-Worldwide-Release-A-First-for-the-Series-815772.html
- Translation workflow change: "Until now we would first write the Japanese, then translate it to English, before translating it into the various languages like French and German. But this time we went directly from the Japanese into all the other languages… Since we did it 'directly', the translation progressed speedily" — Masuda, same Iwata Asks page. Dedicated staff assigned Pokémon names, "practically in tears," because many names were already used and rights had to be cleared worldwide.
- Later scale: *Sword/Shield* voice acting was rejected in part because the RPG text was being localised and released in nine languages on the same day; organising recording and corrections in nine languages for a same-day release "would be incredibly difficult" — Ohmori, via Metro, summarised by NintendoEverything — https://nintendoeverything.com/game-freak-on-why-pokemon-sword-shield-doesnt-have-voice-acting/ (search snippet only)

**Practical next step (from the report):** Localise directly from the source script into all languages in parallel, in one build, with a dedicated naming/rights pass — do not serialise Japanese → English → others if a simultaneous worldwide launch is the goal.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 3 (scripted story text) in parallel
- Done when: all release languages live in one build, names/rights cleared, language selection tested

## Phase 8 — Performance optimisation, polish, and (in the modern era) post-launch repair

**What it contains:** Frame-rate, pop-in, loading and memory work; final polish passes; and, where pre-release optimisation is incomplete, day-one and post-launch patches.

**Public evidence:**
- Historical optimisation is inseparable from integration: Game Boy cartridge capacity, pre-loading (Phase 1), and Switch HD visuals (richer, more expressive visuals requiring more people on *Sword/Shield* — Polygon/GoNintendo source above).
- Modern cautionary case: Nintendo apologised with *Scarlet/Violet* Ver. 1.1.0 (1 Dec 2022): "We are aware that players may encounter issues that affect the games' performance… We take the feedback from players seriously and are working on improvements to the games." That patch also fixed Elite Four/Top Champion battle music and "other select bug fixes," and started Ranked Battles Season 1 — Game Developer, 1 Dec 2022 — https://www.gamedeveloper.com/business/nintendo-is-sorry-for-making-players-suffer-through-pokemon-scarlet-and-violet (search snippet only)
- Schedule pressure is acknowledged at publisher level: The Pokémon Company COO Takato Utsunomiya said in Aug 2023 (Worlds, via ComicBook.com) that Pokémon had operated on a "fairly fixed kind of a cadence," with no plan stated to alter it, but "more and more conversations" about ensuring quality products as development environments change — Shacknews, Aug 2023 — https://www.shacknews.com/article/136647/pokemon-company-coo-quality-release-schedules (search snippet only)

**Practical next step (from the report):** Treat optimisation as a phase with its own time, not as leftover time; if the release date is fixed, plan explicitly for a post-launch patch lane (ranked/online features, music triggers, performance) rather than assuming launch = done.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 6 (debug phase)
- Done when: performance/polish passes complete, and a post-launch patch lane is planned (not assumed away)

## Phase 9 — Marketing / demo builds and release preparation

**What it contains:** A sliced, public demo build (one gym/area, limited roster) for trade shows and press; marketing/PR staffing; simultaneous worldwide launch preparation; and online/connectivity features (trading, raids, Pokémon HOME-style transfer) prepared for launch or shortly after.

**Public evidence:**
- *Sword/Shield* at E3 2019: "it's the first time that Pokémon Sword and Pokémon Shield have been available for the public to play" at E3, June 2019, about five months before the November 2019 launch — Pokemon.com interview intro (above). Press previews describe a limited demo: water-gym puzzle, a few trainers, Gym Leader Nessa, Dynamax — NintendoWorldReport E3 preview — http://www.nintendoworldreport.com/hands-on-preview/50847/pokemon-sword-and-shield-switch-preview (search snippet only)
- Marketing/PR are counted in the ~1,000-person total for *Sword/Shield* (Phase 6 above) — i.e. release preparation is staffed as part of production, not added afterwards.
- Simultaneous worldwide release was itself a production goal from *X/Y* onward (Phase 7), not a marketing afterthought.

**Practical next step (from the report):** Cut a stable demo slice early enough for a public event, freeze its roster/features separately from the full game, and staff marketing/PR alongside debug — not after it.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: Phase 6 (debug) alongside, Phase 7 (localisation)
- Done when: a stable public demo slice exists with its own frozen roster/features, and launch prep is staffed

## Phase 10 — Overlap: the next game starts before this one ships

**What it contains:** Concept work for the next generation begins as soon as the previous game wraps — and, in the Switch era, a full year or more before the previous game launches.

**Public evidence:**
- *Sword/Shield* concept began "immediately after development wrapped up on Pokémon Sun and Pokémon Moon" — Ohmori (above).
- *Legends: Arceus* began fall 2018, a full year before *Sword/Shield* launched, and took over three years; *Scarlet/Violet* began around late 2019, as *Sword/Shield* was finishing — CEDEC 2022 / Nintendo Life (above).
- *Red/Blue* is the exception that proves the schedule change: Masuda and colleagues note a six-year, deadline-free development in which good ideas could be added because "Pokemon didn't have a release deadline" — Tajiri/Masuda/Sugimori interviews, via Dr Lava — https://lavacutcontent.com/satoshi-tajiri-pokedex-interview/ (search snippet only). Modern titles run on the ~3-year / ~2-year cadence described in Phases 6 and 8.

**Practical next step (from the report):** Do not plan a team's "next steps" as only finishing the current game; reserve concept/planning capacity for the next title in parallel with debug and release of the current one.

**TODO:**
- Status: TODO
- Owner lane: TBD — claim by editing this line
- Dependencies: none (runs in parallel with Phases 6–9)
- Done when: concept/planning capacity for the next title is reserved and running alongside release work

---

## Where sources disagree or the order varies by title/generation

Do NOT smooth these over. An agent that assumes a universal rule where the sources vary is inventing process.

| Variation | Source A says | Source B says | Implication |
|---|---|---|---|
| What comes first: creature design or story/concept? | *Red/Blue*: designs first, then moves, then gradual matching; story fitted around designs (Sugimori). | *Sword/Shield* starters: planners/concept designers wrote a text setting first, then artists designed to fit it (Ohmori). Planners also requested creatures for story functions (e.g. blocking a path). | Order is title-dependent. Do not assume a universal "art first" or "story first" rule. |
| Language builds | Pre-*X/Y*: seven separate language versions. | *X/Y* onward: one seven-in-one (later nine-language) build, direct translation from Japanese to all languages. | Localisation phase changes completely at Gen VI; earlier timelines do not transfer. |
| Model pipeline | Up to *Sword/Shield*: rebuild/adjust models per title in Maya/ShaderFX, delivery check in title environment. | *Legends: Arceus* + *Scarlet/Violet*: revised shared pipeline because >1,000 Pokémon made per-title rebuild unsustainable (CEDEC 2022). | Integration effort per title falls after the pipeline change — but only if the shared pipeline is adopted. |
| Schedule freedom | *Red/Green*: no release deadline; ideas added freely over ~6 years. | Modern generations: ~3 years per new generation; publisher cadence ~every 2 years for a mainline/remake/third version; COO 2023 says cadence not planned to change, quality conversations increasing. | Late polish/debug time is far more constrained now than in Gen I; post-launch patches fill the gap. |
| Post-debug changes | Normal practice (and Nintendo's view in the Mew anecdote): do not alter data after debugging tools are removed, because new bugs would be hard to fix without them. | *Red/Green* Mew was famously added after debug tools were removed, into ~300 bytes freed — a celebrated exception, not a process. | Treat post-debug additions as a risk exception requiring explicit sign-off, never as a planned phase. |
| Team size / who does what | *Red/Green*: ~20 staff at end; *Sun/Moon*: ~120, 3 years. | *Sword/Shield*: Game Freak core ~200, Creatures ~100 on models, >100 on debugging, ~1,000 total including marketing/PR. | Scale, and therefore how much can be parallelised, varies by an order of magnitude by era. |

## Could not verify / open questions — do NOT present these as findings

1. **No public, Pokémon-specific alpha → beta → gold-master → Nintendo Lotcheck/certification checklist was found.** Public Pokémon sources name a "debug phase" and a "beta phase" but do not publish submission dates, Lotcheck criteria, or gold-master timing for any title. Generic console-certification descriptions exist elsewhere, but they are not Pokémon/Game Freak sources and are therefore not presented as findings here.
2. **Exact internal sequencing of sound vs. balance vs. world assembly within a single title was not found.** Sources show these lanes running simultaneously (Masuda on music developed simultaneously with the game) and iteratively (fine-tuning throughout), not in a dated order. Any report claiming "sound always comes after balance" or vice versa would be inventing a sequence the sources do not support.
3. **A live-browser check of several secondary pages failed** (browser service error on a batch of fetches in this run). Those pages were not re-fetched; claims that would have rested solely on them (e.g. the DualShockers version-split summary, the Polygon 1,000-person breakdown) are cited here as index/search summaries, not as fully fetched pages, and should be treated as one step lower in confidence than the fully fetched interviews (Pokemon.com, Polygon *X/Y*, Nintendo Life *X/Y*, Iwata Asks, Nintendo Online Gold/Silver).
4. **GDC-specific talk:** No GDC talk by Game Freak was located as a primary source in this research. The closest equivalent found is the CEDEC 2022 talk (Japan's equivalent developer conference) by Keiichi Maezawa, reported by Nintendo Life. Do not cite a "GDC postmortem" for Pokémon unless a separate source is found.
5. **Post-launch live-service cadence** (ranked seasons, HOME connectivity timing, DLC) is only illustrated here by *Scarlet/Violet* 1.1.0; a full post-launch plan was not reconstructed title-by-title.

## Sources (all public; 21 sources)

Read during the research run, Oct 2026; all via web-index/text fetch unless noted as a search snippet.

- Pokemon.com interview with Junichi Masuda and Shigeru Ohmori on *Sword/Shield*, 13 June 2019 (mirrored) — https://nintendobserver.com/2019/06/pokemon-we-interview-junichi-masuda-and-shigeru-ohmori-about-pokemon-sword-and-pokemon-shield/ — index fetch.
- Polygon, "How Game Freak built the new creatures and 3D models of Pokemon X and Y," 23 Oct 2013 (Famitsu interviews with Sugimori and Unno) — https://www.polygon.com/2013/10/23/5015194/how-game-freak-built-the-new-creatures-and-over-700-3d-models-for — index fetch.
- Nintendo Life interview with Masuda and Hironobu Yoshida on *X/Y*, 20 Sep 2013 — https://www.nintendolife.com/news/2013/09/interview_junichi_masuda_and_hironobu_yoshida_discuss_pokemon_x_and_y_mega_evolutions_and_the_2ds?page=2 — index fetch.
- Iwata Asks: *Pokémon X and Y* — Simultaneous Worldwide Release — https://www.nintendo.com/en-gb/Iwata-Asks/Iwata-Asks-in-Motion-Pokemon-X-and-Pokemon-Y/Pokemon-X-Pokemon-Y/1-Simultaneous-Worldwide-Release-A-First-for-the-Series/1-Simultaneous-Worldwide-Release-A-First-for-the-Series-815772.html — index fetch.
- Nintendo Online Magazine, July 2000, Gold & Silver interview with Sugimori, Masuda, Nishino, Watanabe, Morimoto (mirror) — https://greenfieldcity.net/pokemon/interviews/g2/nintendoonline_gs — index fetch.
- Retro Gamer interview with Masuda and Sugimori on Red/Blue (summary) — https://gonintendo.com/stories/270126 — index.
- Game Informer interview with Masuda on *Black/White 2*, Sep 2012 — https://gameinformer.com/b/features/archive/2012/09/17/gamefreak-talks-pok-233-mon-s-first-numbered-sequel?amp= — index.
- The Verge, Ultra Sun/Ultra Moon interview with Ohmori and Iwao, 19 Oct 2017 (mirror) — https://greenfieldcity.net/pokemon/interviews/g7/verge_usum — index.
- GameSpot, Sun/Moon developers interview with Masuda — https://www.gamespot.com/articles/pokemon-sunmoon-devs-on-legendaries-pokemon-go-and/1100-6444620/ — index.
- CEDEC 2022 / Nintendo Life, Game Freak confirms *Legends: Arceus* started before *Sword/Shield* launch, 26 Aug 2022 — https://www.nintendolife.com/news/2022/08/game-freak-confirms-pokemon-legends-arceus-started-development-before-sword-and-shields-launch — index.
- DualShockers summary of Game Informer on two-version development — https://www.Dualshockers.com/pokemon-sword-and-shield-development-story/ — search snippet only.
- GoNintendo summary of Polygon on the ~1,000-person *Sword/Shield* team — https://gonintendo.com/archives/321646-game-freak-breaks-down-the-1-000-person-team-that-helped-make-pokemon-sword-and — search snippet only.
- NintendoEverything summary of Metro interview on *Sword/Shield* voice acting / nine languages — https://nintendoeverything.com/game-freak-on-why-pokemon-sword-shield-doesnt-have-voice-acting/ — search snippet only.
- NintendoSoup summary of Famitsu on *Sword/Shield* tall grass — https://nintendosoup.com/game-freak-spent-half-a-year-fussing-over-tall-grass-in-pokemon-sword-shield/ — search snippet only.
- PocketMonsters.net, "A Conversation with Pokémon's Musical Maestro" (Masuda) — https://www.pocketmonsters.net/index.php/content/Interview_A_Conversation_with_Pokemons_Musical_Maestro — search snippet only.
- Game Developer, "Nintendo is sorry for making players suffer through Pokémon Scarlet and Violet," 1 Dec 2022 — https://www.gamedeveloper.com/business/nintendo-is-sorry-for-making-players-suffer-through-pokemon-scarlet-and-violet — search snippet only.
- Shacknews, Pokémon Company COO on quality vs. release schedule, Aug 2023 — https://www.shacknews.com/article/136647/pokemon-company-coo-quality-release-schedules — search snippet only.
- GamesRadar summary of games™/Retro Gamer interview with Sugimori on ~100 Pokémon per game and battle balance — https://www.gamesradar.com/games/pokemon/game-freak-cant-add-hundreds-of-new-pokemon-and-more-types-every-generation-or-else-new-games-would-take-too-long-to-make-director-says-if-you-added-like-300-or-so-new-monsters-thatd-just-be-too-many/ — search snippet only.
- Shmuplations, Pokémon 2000 developer interview (Sugimori) — https://shmuplations.com/pokemon/ — search snippet only.
- Dr Lava translation, Satoshi Tajiri on Red & Green development — https://lavacutcontent.com/satoshi-tajiri-pokedex-interview/ — search snippet only.
- NintendoWorldReport, *Sword/Shield* E3 2019 preview — http://www.nintendoworldreport.com/hands-on-preview/50847/pokemon-sword-and-shield-switch-preview — search snippet only.

## Queue maintenance rules (for agents)

- Claim a phase by editing only its TODO block. Never delete a phase, a disagreement row, or an unverifiable item.
- When a phase completes, set Status to DONE, add the PR link, and leave the evidence text untouched.
- If new public evidence contradicts a phase, append a dated note under that phase — do not silently rewrite the sourced text.
- Leaked internal files, ROM dumps, and unreleased source code are out of scope for this queue, per Mars's standing rule.
- This doc's first version: 1 file added, 0 deletions. Keep it that way — additions and status-line edits only.
