# PROSODY-SYSTEM — how Mochiichao human voices are designed, directed, and timed

**Status:** Landed in the repo 2026-10-27 (lock-everything wave) as the standing method companion to VOICE-DESIGN.md — NOT a casting and NOT canon-locked until the owner passes it.
**Companion to:** `show/production/VOICE-DESIGN.md` (the parameter sheets live there; this doc is the method and the line-reading rules that use them — it does not duplicate or supersede them).
**Scope:** Human characters only — Mochiko, Hex, Prof. Aeon. Creatures are covered only where the system contrasts them (§7): creatures are pure cries and sounds only, no words, no name-saying (owner law). No prosody rule in this doc gives a creature words.
**Casting state:** **PENDING CASTING for all three humans.** Per-character reference casting is still awaiting the owner's ear. Everything in this doc is written to work as the standing method regardless of which references are eventually cast. Anything that cannot be finalised until a reference exists is marked **PENDING CASTING** in-line and collected in §8.
**Sources:** Synthesised from exactly three research inputs, cited section-by-section in the Source map appendix at the end of this document:
- **[A]** Industry report — `research_notes/prosody-voice-tv-20261027/report.md` (workspace research doc, not in repo)
- **[B]** Repo mine — `mochiichao-show/research-drafts/PROSODY-REPO-MINE.md` (workspace research doc, not in repo)
- **[C]** Bible-craft study — `mochiichao-show/research-drafts/BIBLE-CRAFT-STUDY.md` (workspace research doc, not in repo)

Plus the existing draft sheets in VOICE-DESIGN.md, which this doc builds on (cited as [V]).

**Terminology (owner's anchor, [A] preamble):** *Prosody* = the pattern-level features of speech above the words themselves — pitch contour / intonation, tempo / rhythm, stress, pausing, loudness dynamics, and voice quality. **Patterns transfer, identities don't.** We study how performances are shaped; we never clone a specific performer.

---

## 0. The system in one page

1. **A voice is designed, not found.** Each human character gets a prosody sheet (§3) derived from voice-*type* inspirations — pacing, tone, rhythm, energy — decomposed into channels (§1). No sheet is "do X's voice."
2. **A voice = one reference + two numbers** [B §8.1]. The reference is cast *to* the sheet [V chain step 2; A §4.3]; the numbers are Chatterbox `exaggeration` (expressiveness / character identity) and `cfg_weight` (pace / adherence / legibility), with per-character defaults held in VOICE-DESIGN.md [B §8.2].
3. **Every line is directed before it is rendered** (§4). The script carries the direction — stress word, contour, register, physical action, button — because in a synthetic pipeline there is no session where a director can supply it verbally [A §3.2–3.3, §4.2.3].
4. **Scratch ≠ final, and the boundary is law** (§5). Scratch voices are for animatics ONLY. Final voices are human — recorded human performance, or an owner-ear-locked clone from an owner-cast reference. A Chatterbox render is scratch until the owner promotes it; the model never promotes itself.
5. **Dialogue first, always** [B §8.7]. Script → scratch voice (timing only) → final voice → audio cut → animatic lock → animation → lip-sync. Animation serves the performance; the X-sheet's dialogue column is filled first and everything else times against it.
6. **Prosody has frame numbers** (§6). 144 BPM = 10 frames per beat at 24 fps is the timing grid; mouth rhythm, stress placement, pauses, and inter-line gaps all have measured defaults, not vibes [B §7, §8.14–15].
7. **The owner's ear is the lock** [B §8.11]. Nothing sound-locks before the owner ear-checks it. Every shipped clip has a provenance manifest row. No clip ships without its row.
8. **Keep the signature stable, vary the state** [A §6]. A character's habitual contour / tempo / stress habits are their prosodic identity and do not drift across the series; emotional state varies *inside* that identity.

---

## 1. The voice-type design method

*How a character's prosody is derived from type inspirations without cloning a performer. This is the method VOICE-DESIGN.md's chain step 1 assumes; here it is spelled out as a repeatable procedure.*

### Step 1 — Start from cognition and function, not from sound

Write, before any audio is discussed:

- **Cognitive style** — what this character notices first, what they would never say, how they handle pressure. Network bibles specify voice this way by default: the prose describes the mind, and prosody follows from cognition — a voice actor and a writer reading the same paragraph converge on the same delivery [C §4.1].
- **Scene function / tempo law** — one sentence in the form: *"X's [tempo trait] controls the pace of [scene type]."* This is the sample's only explicit prosody-as-craft device (a character whose deliberate speed *is* the scene's metronome, whose limitations are the comic opportunities) [C §4.5], and it is the form a board artist and an editor can actually execute. "Sounds cheerful" is not executable; a metronome assignment is [C §6.3].
- **Counter-rhythm partner** — voice is relational. At least one lead in the strongest voice specimen in the bible sample is specified *purely* as counter-rhythm to the other (deadpan authority vs. the partner who says what the first won't) [C §4.6]. Specify each Mochiichao human against the humans they share scenes with, not in isolation. This also serves the house asymmetry rule: protect one sincere party per episode — "the format collapses when everyone performs" [B §5b, §8.10].

### Step 2 — Decompose the type inspiration into channels

A voice-*type* inspiration ("a bright eager keeper-type", "a dry presenter-type") is never taken whole. It is split into separately borrowable channels — the bible sample's precedent is a persona specified as separate named analogues for *lines, intensity, moves, and voice*, one channel at a time [C §1.5, §4.4]. For Mochiichao the channels are:

| Channel | What is borrowed from the type | What is never borrowed |
|---|---|---|
| **Pacing** | Default tempo band; where the character speeds up / slows down | A performer's exact timings on specific lines |
| **Tone / register** | Pitch register band; brightness / dryness / warmth of voice quality | A recognisable performer's timbre |
| **Rhythm & stress** | Which word in a sentence habitually takes the beat (first word vs. last word); staccato vs. legato syllable separation | A performer's signature catchphrase delivery |
| **Melody / contour** | Habitual sentence melody — e.g. ends tilt up in discovery, land flat in reverence [V: Mochiko] | Quoted signature lines |
| **Energy curve** | How energy builds and releases across a scene; where the peaks sit; how rarely the melody moves | A specific recorded performance |
| **Breath & pausing** | Breath length; pause habits; what gets space around it | — |
| **Negations** | What the voice *never* does (see Step 3) | — |

Failure test, from VOICE-DESIGN.md [V chain step 2]: **a reference or a sheet that resolves to a recognisable specific performer is a failed casting.** Patterns transfer; identities don't [A preamble].

### Step 3 — Write the sheet in the house field order

Adapted from the most explicit voice specimen in the bible sample — the field set *device · diction/sources · register · negation cues · relational counter-rhythm* [C §4.6] — extended with the fields the repo mine proves the owner actually directs with [B §8] and the two exemplar fields the classic sample uses [C §4.2]:

1. **Essence word + function** (one word; what the character is *for* in a scene) [C §1.1, §4.8].
2. **Native device** — the character's speech *form* and its failure mode in one line (form + how it breaks) [C §4.6].
3. **Register** — pitch band, voice quality, delivery law.
4. **Pacing defaults** — tempo band, rhythm / stress habit, breath, pause habit, tempo law (Step 1).
5. **Melody / contour defaults** — habitual sentence shapes.
6. **Energy curve** — scene-level build / release; where peaks are allowed.
7. **Diction & verbal tics that are OURS** — phrase sources the character raids; tics invented for Mochiichao, never imported [V §"Draft sheets"].
8. **Negation cues** — "never ___" lines. Negations are load-bearing in the sample ("never winks", "never explain the weirdness") [C §4.6] and in the owner's own sheets ("no baby-talk" [V: Mochiko]).
9. **Emotional registers** — how each basic state is played *inside* this identity (Step 4).
10. **Counter-rhythm** — who they are timed against, and how [C §4.6].
11. **Signature utterance** — one line in the character's own diction that carries rhythm, vocabulary level, and attitude in miniature (the "oft heard saying" slot), plus a **motto-as-diction-sample** (a philosophy line phrased as the character would actually say it) [C §4.2]. A writer who can produce these two fields for a character has effectively cast the voice on paper.
12. **Numeric defaults** — pointer only: `exaggeration` / `cfg_weight` live in VOICE-DESIGN.md, not here [V; B §1a].

### Step 4 — Give every emotion its acoustic recipe, inside the identity

Emotion is not left to the performer or the model to invent. The speech-science vocabulary the industry report establishes [A §1.2]:

| State | Rate | Pitch height | Pitch range | Intensity | Contour notes |
|---|---|---|---|---|---|
| Joy | rapid | high | large | bright timbre | — |
| Sadness | slow | low | narrow | low | descending shapes recur |
| Anger | fast | high | wide | high | rising contours |
| Fear | fast | high | large *variability* | varied loudness | short cries / gasps decode better than sentences [A §1.3] |

Rules for using the table:

- The recipe is **filtered through the character's identity** (Rule 8, §0). Hex angry is not Mochiko angry at a lower pitch; it is anger's rate/range pressure expressed through Hex's restraint (see §3 sheets). Listeners decode emotion from voice alone at roughly 4–5× chance — anger ~79%, sadness ~74%, joy ~71%, fear ~58%, disgust ~47% in the cross-study table [A §1.3] — so a wrong recipe is a legible error, not a subtle one.
- **The signature stays stable; the state varies within it** [A §6, final principle]. If a register requires breaking the character's negation cues, the register is wrong, not the character.
- Emotion in this house is also specified at the levels *above* the line — series emotional thesis, character emotional function, story-level turn, protected feelings the show may not spend cheaply [C §4.8]. A line reading that is locally correct but spends a protected feeling is a fail (see §4, Rule L14).

### Step 5 — Cast the reference TO the sheet

- The sheet exists first; the reference serves it, never the other way round [V chain step 2].
- Chatterbox reality makes this non-optional: the reference's own prosody, tempo, and accent **bleed into every output**, and parameters can only partially correct a mismatch [A §4.1, §4.3]. ~5–10 s of clean reference is the documented working range; shorter, low-noise clips often beat longer ones [A §4.1]. Pin all parameter expectations against the exact Chatterbox build in the owner's voice-pipe, not against generic ranges — documented ranges differ between implementations [A §5].
- The repos contain **no written casting criteria** beyond this discipline — provenance, correct attribution, and owner ear-check govern pulled audio, and the one positive casting datum in the mine is a labelled dataset sample marked TEMP [B §9]. So the casting judgement itself is, by design, the owner's ear (§8, PENDING CASTING). This doc supplies the sheet to cast *against*; it does not invent a casting the owner has not made.
- **Never reuse another show's references.** The Wizard Gang reference clips are that show's cast identities and are explicitly not transferable [B §10]. Mochiichao references are cast fresh to these sheets.

### Step 6 — Prove the sheet on real lines before it locks

- A voice (like a mouth system) is only done when it survives **actual dialogue, not isolated sounds** — the viseme-pack gate in the owner's archive requires testing with 10 seconds of actual dialogue [B §7e]. Apply the same gate to voice: the sheet + reference + numbers must render a real scene's lines — including one button and one quiet register — before the owner is asked to lock anything.
- Review against the sheet, not against taste-in-the-moment: does the pacing / melody / energy match? [V chain step 4]. The pick is the owner's (§5).

### Step 7 — Attach the condensed block where writers trip over it

Network bibles mostly keep voice out of the bible's architecture, but the two strongest voice specimens in the sample both live **inside** the bible, attached to the character entry [C §4.7]. Recommendation (for the owner to pass, not enacted here): when this system lands, a condensed spec block — essence · function · sound · signature utterance · tempo law [C §6.1–6.2] — is attached to each human's cast entry in the show Bible, with the full sheet staying in `show/production/`. Attachment, not relocation [C §4.7].

---

## 2. What the two Chatterbox numbers actually mean (direction translation)

From the industry report's primary-source account [A §4.1] and the repo mine's lived values [B §1a–b]:

| Dial | Actually controls | House reading |
|---|---|---|
| `exaggeration` | Scales the emotion-conditioning signal; global prosodic intensity / expressiveness. ~0.5 = default natural; low (0.25–0.5) → flat / neutral; 0.7+ → dramatic; extremes risk instability / over-articulation | **Character identity.** Set per character, never globally. Lived house scale: 0.35 soft-spoken → 0.50 deadpan / narration → 0.70 gruff → 0.85 feral [B §8.2] |
| `cfg_weight` | Classifier-free guidance: conditioning strength — pacing and adherence to reference + text. Higher → slower, more controlled, more reference-faithful; lower → faster, looser, more varied | **Legibility / adherence.** Authority voices raise CFG, not exaggeration (the mine's narrator: ex 0.50, cfg 0.7 in every queue state) [B §1a–b, §8.2] |

**Documented interaction — do not treat the dials as independent:** higher exaggeration tends to *speed speech up*; reducing CFG helps compensate with slower, more deliberate pacing. The documented dramatic combination is cfg ~0.3 with exaggeration ~0.7+; if a reference speaker speaks fast, lowering CFG (~0.3) improves pacing [A §4.1]. Defaults 0.5 / 0.5 "work well for most prompts" — which is precisely why the house treats them as neutral, not as any character's voice [A §4.3].

**Honest limits — what no setting can do** [A §4.2]:

1. **No per-word control exists.** There is no shipping control for "stress *this* word, pause *here*, fall on the last syllable" other than text punctuation, line breaks, parameter nudges, and re-rolls. Timbre, style, and emotion enter as *global, per-generation* conditioning.
2. **Timbre / style / emotion are entangled** in cloning systems; independent control of identity vs. manner is a known open problem, and speaker similarity degrades specifically on emotional speech.
3. **No long-range memory.** Generation is utterance-level and stateless across calls: a voice will not gradually tire, escalate, or soften across a scene unless *each line is individually directed*. The synthetic equivalent of a director's read-ins and line readings is a human direction pass per line. That pass is §4 of this doc — it is not optional decoration; it is the only place scene-level performance exists.

Per-character starting numbers (Mochiko 0.45 / 0.5 · Hex 0.3 / 0.6 · Aeon 0.4 / 0.55) are held in VOICE-DESIGN.md [V] and are **not restated as canon here** — if they change there, this doc does not need to change. Read them off the sheets in §3 as pointers.

---

## 3. Per-character prosody sheets — Mochiko, Hex, Aeon

**How to read these sheets.** Each sheet applies the §1 field order to the draft sheet already in VOICE-DESIGN.md [V]. The register / contour / tic material quoted or paraphrased from [V] is marked [V]; everything else is the *system's application* of [A]/[B]/[C] to that draft — method, not new canon. Where a sheet would need a cast reference or an owner ruling to be final, it says **PENDING CASTING** / **TBD — owner**. No TBD is filled silently anywhere in this section (house writing law).

> Parameter pointer (all three sheets): numeric render starts live in VOICE-DESIGN.md — Mochiko ex 0.45 / cfg 0.5 · Hex ex 0.3 / cfg 0.6 · Aeon ex 0.4 / cfg 0.55 [V]. The only prosody comment made here is the directional one the numbers already encode: Hex is the lowest-exaggeration / highest-CFG human (restraint is the performance; adherence over expression — the narrator pattern [B §8.2]), and that relationship between the three sets should survive any retune the owner makes.

### 3.1 MOCHIKO — the keeper

- **Essence / function:** Keeper; the show's sincere party and word-voice anchor. *[V: "the keeper". House asymmetry: at least one sincere party per episode [B §8.10].]*
- **Native device:** Names what she sees before she judges it [V tic: "Ducks don't roll uphill."]. Form: observation first, verdict second. Failure mode to direct *against*: verdict-first snap judgements — if a line lands as a judgement before it lands as an observation, the reading is wrong for the character.
- **Register:** Bright, mid-high [V]. Voice quality: open, unguarded.
- **Pacing defaults:** Quick, eager pace [V]. Short breaths [V]. Tempo law (system application of [C §4.5]): **Mochiko's pace is the Garden's working tempo** — investigation and care scenes take their cutting rhythm from her; when she slows, the scene is telling the audience the moment matters (see Reverence, below).
- **Melody / contour defaults — two named contours** [V]:
  - **Wonder contour:** sentences tilt UP at the end when she is discovering something.
  - **Reverence contour:** FLAT and SLOW when she reads the Manual aloud — the rules slow her down. This is a register shift, so under house override discipline it is one of the few sanctioned per-line deviations from her defaults (§4, Rule L3): direction goes *downward* in energy for the controlled / intimate moment, exactly as the mine's only whisper override did [B §1b].
- **Energy curve:** Peaks are discoveries and connection beats, not volume contests. Her escalation shape is *quicker + higher + wider* (the joy recipe [A §1.2] through an eager identity), never *louder-only*.
- **Diction / tics:** Observation-naming (above). She talks to creatures in the same voice she talks to people — **no baby-talk, ever** (house respect rule / negation cue) [V].
- **Negation cues:** Never baby-talk. Never word-performs *at* a creature as if the creature were a prop. Never fills a creature's silence with chatter — silence is scored (§4, Rule L9), including hers.
- **Emotional registers (recipes [A §1.2] through her identity):**
  - *Joy / discovery:* rapid rate, high pitch, large range — her native state; direct it as Wonder contour, not as generic excitement.
  - *Sadness:* slow, low, narrow, low intensity — played as pace collapse from her quick default; the contrast with her default *is* the signal, so do not raise exaggeration to "act" it.
  - *Anger:* fast / high / wide / high-intensity recipe, but Mochiko's anger stays observation-shaped — she names the thing that is wrong. TBD — owner: whether Mochiko is ever permitted a full anger register, or whether her ceiling is protest / distress. **Not filled here.**
  - *Fear:* fast, high, highly variable pitch, varied loudness [A §1.2]; fear decodes weakest in sentences and best in short vocalisations [A §1.3] — direct fear beats short.
- **Counter-rhythm:** Against Hex (§3.2): she supplies the movement his stillness answers. Against creatures: her words answer their cries — contour answers contour (§4, Rule L7); a Mochiko line is never directed in a vacuum next to a cry it is responding to.
- **Signature utterance:** The [V] tic line ("Ducks don't roll uphill.") is the working exemplar — observation-syntax in miniature [C §4.2]. A motto-as-diction-sample in her own phrasing is **TBD — owner** (do not invent one here).
- **PENDING CASTING:** Reference audio, final exaggeration / CFG tune, motto exemplar. EP01 note: Mochiko is the only word-voice EP01 requires — her casting is the only one of the three that gates an episode (context: EP01 casting brief draft, local workspace — see the Source map appendix, "Additional context consulted").

### 3.2 HEX — the mirror

- **Essence / function:** Mirror [V]. The counterweight: precision as armour [V tic note].
- **Native device:** States the time or the count [V tic: "Tomorrow, then."]. Form: a measured fact placed where a feeling would go. Failure mode to direct against: explanation — Hex does not talk a point round; if a Hex line needs a second sentence to land, the line (or the reading) is wrong.
- **Register:** Lower, drier [V].
- **Pacing defaults:** Deliberate [V]. **Beats land on the LAST word, not the first** [V] — this is his stress habit, and it is the single most important direction on this sheet: stress placement is written into the script metadata for every Hex line (§4, Rule L5), because Chatterbox has no per-word stress control and will not find the last word by itself [A §4.2.1].
- **Melody / contour defaults:** Dead-level melody that **only moves twice an episode, so the two times read as events** [V]. This is a rationing rule, not a description: the script / direction pass must *choose* the two movements in advance (Kim-Possible-style rationing of a scarce device [C §1.4, §6.11] applied to melody). A render pass that lets his melody wander has spent the episode's budget without permission.
- **Energy curve:** Inverted. **Never raises volume to win a point; goes QUIETER** [V]. His peaks are drops. In acoustic-recipe terms, his intensity dial moves opposite to the other characters' — direct it explicitly per line; neither a human session habit nor a model default will produce it unasked.
- **Diction / tics:** Time / count statements [V]. Line economy at its hardest after narration: the mine's narrator ran 3–6-word declarative fragments ("Nothing was resolved.") and that economy is a house instinct, not a genre quote [B §1b, §8.5]. Hex lines should be auditable against that scale — if a Hex line is long, the length must be the point.
- **Negation cues:** Never raises volume to win. Never explains the weirdness (negation form after [C §4.6]). Never performs sincerity he doesn't have — he is not the sincere party (§3.1); the asymmetry is cast on purpose [B §8.10].
- **Emotional registers (recipes [A §1.2] through his restraint):**
  - *Joy:* not a rate/range expansion — a melody movement, spent from the two-per-episode budget, or a beat landing softer. TBD — owner: confirm the budget applies to joy specifically. **Not filled here.**
  - *Sadness:* his default is already slow / low / narrow; sadness is played as *less* — fewer words, longer pauses (pause placement is a prosody channel [A §1.1]).
  - *Anger:* quieter + slower + last-word stress driven harder. Explicitly *not* the textbook fast/high/wide recipe at full strength — the recipe is filtered through the identity (§1 Step 4), and his negation cue outranks the recipe.
  - *Fear:* the one register where his variability may legitimately rise [A §1.2: fear = large pitch *variability*] — a crack in the level melody. Because his melody budget is rationed, a fear crack is an episode event; mark it in the script, don't let it happen by render accident.
- **Counter-rhythm:** Defined against Mochiko (§3.1) and against Aeon (§3.3): he is the still point both of their warmer / quicker rhythms play off. The bible sample's purest voice specification is exactly this — a voice specified purely as counter-rhythm to its scene partner [C §4.6].
- **Signature utterance:** "Tomorrow, then." [V] is the working exemplar — precision-as-armour in two words. Motto-as-diction-sample: **TBD — owner.**
- **PENDING CASTING:** Reference audio, final tune. Not an EP01 gate (Hex is not in EP01's cast).

### 3.3 PROF. AEON — the presenter

- **Essence / function:** Presenter [V]. The authority voice — and in this house, authority is carried by CFG-style adherence and space, not by exaggeration [B §8.2: the narrator pattern].
- **Native device:** Deflation [V tic: "There isn't one."-style — pops pomposity, including his own]. Form: a thesis given full ceremony, then popped — by himself, before anyone else can. Failure mode to direct against: pomposity that survives the line; an Aeon line that ends more impressed with itself than it started is misread.
- **Register:** Warm low register, unhurried [V]. **The laugh lives in the voice even when the line is straight** [V] — voice quality, not added laughter: warmth as a standing condition, not a per-line effect.
- **Pacing defaults:** Lecturer's prosody [V]:
  - **Thesis lines get space around them** [V] — pause *before and after* is part of the line's direction (§4, Rule L10; pause placement [A §1.1]).
  - **Lists are ceremonies: each item's name lands alone** [V]. A list is never rendered as a run-on; each item is its own landing, with the inter-item gap treated like the house inter-line gap (§6).
- **Melody / contour defaults:** Unhurried, settled falls on thesis lines (statement contour), with the warmth preventing flatness from reading as coldness. Contrast Hex: Hex's flatness is armour; Aeon's settledness is hospitality. Same acoustic neighbourhood, opposite function — the sheets must not be allowed to converge in casting. **PENDING CASTING:** this distinction is precisely what the owner's ear is needed to verify in references.
- **Energy curve:** Slow builds, ceremonial peaks. Aeon is the natural owner of act-level thesis lines and buttons that land by *weight* rather than by energy (§4, Rule L11).
- **Diction / tics:** Deflations [V]. TBD — owner: Aeon's phrase sources (the diction fields the sample's voice sections specify — the phrase-worlds a character raids [C §4.6]) are **not** in the [V] draft and are **not invented here**.
- **Negation cues:** Never leaves his own pomposity unpopped. Never hurries a thesis. Never explains the weirdness *as* weirdness — cosmic facts stated plainly is the house deadpan scale-mismatch register [B §3d, tone rule — pattern-level transfer only].
- **Emotional registers (recipes [A §1.2] through his ceremony):**
  - *Joy:* warmth up, rate stays unhurried — joy expressed as range and brightness, not speed. (If his rate goes rapid, he stops sounding like Aeon; identity outranks recipe, §1 Step 4.)
  - *Sadness:* slower still, lower intensity, space widening around lines.
  - *Anger:* TBD — owner. Nothing in [V] specifies Aeon angry, and this doc does not invent it. **Not filled here.**
  - *Fear / wonder:* thesis-space applied to the unknown — he gives a frightening or wonderful fact the same ceremony as a thesis, which is itself the character statement.
- **Counter-rhythm:** Against Hex: two low, deliberate voices differentiated by function — Aeon's deliberateness *gives* (space, ceremony), Hex's *withholds* (dryness, count). Against Mochiko: he is the slow ground her quickness plays over; in BH6 form [C §4.5], **Aeon's deliberateness can be assigned as a scene's metronome** for presentation / exposition scenes, where Mochiko's tempo law (§3.1) yields to his.
- **Signature utterance:** The deflation form [V] is the working exemplar. A fixed signature line: **TBD — owner.**
- **PENDING CASTING:** Reference audio, final tune, diction sources, anger register. Not an EP01 gate (Aeon is not in EP01's cast); becomes an EP02+ question.

### 3.4 The three sheets as a system (relational summary)

| | Mochiko | Hex | Aeon |
|---|---|---|---|
| Tempo law | Sets the Garden's working tempo | Still point; others move around him | Metronome for presentation scenes |
| Stress habit | Observation lands first | **Last word** | Thesis word, with space around it |
| Melody budget | Two named contours (Wonder / Reverence) | Dead-level; **moves twice per episode** | Settled falls; warmth constant |
| Peak shape | Quicker / higher / wider | **Quieter** | Slower / more ceremonial |
| Sincerity slot | The sincere party | Withholds | Warm authority, self-deflating |

A scene containing two or more humans is directed from this table first and from the individual sheets second: prosody is relational [A §6; C §4.6], and a line performed in a vacuum sounds like one [A §4.2.3].

---

## 4. Line-reading rules — what the voice pipeline follows when rendering ANY line

Rules-first (house writing system): these rules precede any render. A render that breaks a rule is not a take to be judged; it is a rule violation to be re-done. Lines themselves are canon-sourced only — beats come from the locked script; **no line is invented at the render stage, and no script TBD is filled by a render** (house writing law; also the mine's precedent: some characters get no invented lines at all [B §8.12]).

### A. Before the render

- **L1 — Dialogue-first order is fixed.** Script (beat sheet) → scratch voice for timing → final voice record → audio cut → animatic → animation → lip-sync [B §5c, §8.7]. No step borrows authority from a later one: animation never dictates a reading, and a scratch timing never becomes a final performance by being animated to (see §5).
- **L2 — Defaults rule.** Render from the character's VOICE-DESIGN.md defaults first [B §8.3]. The character default is the performance; deviation is the exception that must justify itself.
- **L3 — Per-line overrides are rare, and mean "register shift."** The entire queue history in the mine contains two override types: a *whisper* (exaggeration dropped, e.g. 0.50 → 0.35, with lowercase + ellipses written into the text) and a *manic character reined in* (exaggeration dropped from default) [B §1b]. House rule derived from that evidence: **overrides move exaggeration only, they move it downward for intimate / controlled moments, and CFG is never overridden per line for expression** (a character's CFG is a character property, repeated identically in every queue entry) [B §1b, §8.3]. Any proposed override that doesn't fit the register-shift pattern needs an owner note in the queue label, not just a new number.
- **L4 — Direction lives in the script metadata before anyone renders.** For each line, the script / direction pass specifies in writing: the **stress word**, the **landing contour** (rise / fall / level, and which named contour if the character has them, §3), the **register** (which §3 emotional register, with its acoustic recipe [A §1.2]), the **physical action during the line**, and the **button** if the line is one (§3.3 / L11). Professional basis: line readings — specifying the exact word to hit because a punch lands on it or a callback is being planted — are a legitimate, expected direction tool, not cheating [A §3.2]; and in a synthetic pipeline this information has nowhere else to live, because the model has no long-range performance memory [A §4.2.3].

### B. In the text itself

- **L5 — The text IS the direction.** The owner's working queue format has no `direction` / `emotion` field doing the heavy lifting — prosody is carried by punctuation and orthography: ALL-CAPS bursts for detonation, em-dash interruptions, ellipses for trailing off, repeated short questions as a rhythm device, and escalation written as *shortening sentences ending in a caps detonation* [B §1b, §8.4]. Chatterbox reality ratifies this: with no per-word stress control, punctuation, line breaks, line length, and word choice are the prosody controls that actually exist [A §4.2.1, §4.3]. Therefore: **never "fix" a script line's punctuation at render time** — a changed ellipsis is a changed performance. (Schema note: the one exception in the owner's stack is the cape-jones dialogue JSON, which adds a per-line `emotion` tag + optional free-text `instruct` [B §2c]. If Mochiichao adopts that schema, the tag *supplements* the punctuated text; it does not replace it.)
- **L6 — Line economy, hardest on narration and on Hex.** Short, declarative, well-punctuated lines are both the house style and the most synthesis-stable input [A §4.3]. Benchmarks from the mine: narrator lines at 3–6 words, declarative fragments [B §8.5]; a hero's whole episode can be two short lines, each annotated as carrying a turn or the punchline [B §3a]. A long line must earn its length in the direction note.
- **L7 — Prosody is relational: never render a line in a vacuum.** Performances are reactions [A §3.2, §6]. In session terms: read the actor in, in character-appropriate energy, or the response is a guess. In pipeline terms: render / select takes **against the cue line** (the preceding line or cry), keep relative levels and distance consistent so separately rendered lines sound like one room, one conversation [A §3.2], and judge the take by whether its contour *answers* the cue contour.
- **L8 — Give the performance the picture.** Storyboard / animatic context measurably speeds sessions and cuts later fixes; a director must verbally supply the physical action during a line or the prosody won't match the body [A §3.2]. Pipeline form: the direction note for every line states the physical action (with the specific prop / colour / staging fact from the script, per house writing law — not "she is busy" but what she is holding, wearing, crossing). No talking at full intensity during a fast head turn — either the head moves or the mouth moves [B §7b].

### C. Silence, buttons, and gags

- **L9 — Silence is scored, not empty.** Whole scenes may be blocked "DIALOGUE: None. Music only."; music *cuts out* to make room for the one line that matters; "hold silence" is an approval-level ending option, decided, not defaulted [B §3a, §3c, §8.6]. Silence is a tool in the house writing system: if a scene's power is its silence, the voice pipeline's job is to *protect* it — no scratch chatter, no filler takes, no render "just to have something." Creature subtitles follow the same economy (show law: subtitles only at important moments) — a subtitle card is a prosodic event, not a translation service.
- **L10 — Pauses are specified, not emergent.** Pause placement is a prosody channel [A §1.1]. Working numbers: a pause must reach **≥ 150 ms** before it counts as a phrase break [B §7d]; the default gap between lines is **250 ms** (`t += dur + 0.25` in the owner's dialogue pipeline) [B §2c]; Aeon's thesis space and list ceremony (§3.3) are deliberate, written exceptions *above* those defaults. Return to rest / neutral between phrases — don't hold the last shape or the last energy into the gap [B §7a].
- **L11 — Every scene has a button, and the button is a prosodic event.** The final line / cry / silence of a scene is designed to land its emotion and pull forward; it is staffed by the scene's most important character [A §3.3, §6]. The direction pass names each scene's button in advance (L4). Buttons, act-outs, and connection beats are the lines that get the takes budget (L13).
- **L12 — Gag mechanisms, not quips: timing is the mechanism.** House writing law: gags are mechanisms, not quips — and prosodically, the mechanism is usually a timing fact: deadpan scale-mismatch (cosmic stakes handled like a parking dispute — pattern-level tone rule [B §3d]), a body / voice arriving a beat late (the lead/lag rule: one element leads, the body follows a beat late [B §3d]), a music cue cutting out under the line [B §3a], or a take length (a 4-frame take is funny, a 12-frame take is dramatic [B §7c]). Direct the *mechanism*: if the gag is the pause before the line, the pause is in the direction note with a frame count (§6), and no render may "improve" the line into a quip.

### D. Takes, gates, and locks

- **L13 — Peaks get re-rolls; defaults get one honest take.** Emotional high points — buttons, act-outs, connection beats — get multiple generations / takes and a human pick; direction effort concentrates where audiences decode most [A §4.3, §6]. Routine lines at character defaults do not get endless re-rolls: if a default line won't land after a small number of honest takes, the fault is upstream (text, reference, or numbers — in that order of suspicion) and is logged, not brute-forced.
- **L14 — Protected feelings are a render gate.** A take that is locally expressive but spends a rationed device — Hex's melody movement (§3.2), a protected subtitle moment, an Aeon register marked TBD — fails the gate regardless of quality [C §4.8; §1 Step 4].
- **L15 — The owner's ear is the lock.** Nothing sound-locks before the owner ear-checks it; unverifiable or mislabelled audio is refused even when it is *probably* right [B §8.11, §4]. **Every delivered clip carries a manifest row** — source, path, character, line / label, exaggeration, CFG, reference used, scratch/final status. No clip ships without its row [B §4]. Take labels name episode-position + take / register (the mine's `n1-v2`, `ritual-whisper`, `h1-temp` pattern) so the queue file is also the take log [B §1b].
- **L16 — Keep the signature stable across the series.** A take that is good in isolation but drifts the character's habitual contour / tempo fails: repeated, consistent, recognisable presence is how serial attachment is built, and the prosodic signature is one of the most-repeated signals in the show [A §1.4, §6]. (Honest flag: the prosody → attachment link is an inference from adjacent literatures, not a directly measured effect [A §5]. The consistency rule stands on the mine's own lock discipline [B §8.11] regardless.)
- **L17 — Adapt the feeling, not the syllables.** If a line is re-rendered, re-timed, or moved between pipelines, duration and emotional beat are the invariants; wording and contour shape are the adjustable variables [A §2.3, §6]. Never force a re-render to mimic a scratch render's accidental rhythm.

---

## 5. The scratch-vs-final law — exactly what it means for Chatterbox renders

**The law, in its source forms:**

> "Scratch voices are for animatics ONLY. Final voices are human." — Mystery Coast pipeline, Stage 1 rule [B §5c]

> Pattern form: "Scratch TTS (Piper/Dia) exists to *time* a production; final voices are human/recorded or owner-locked clones. Temp tracks are labelled temp." [B §8.8]

> VOICE-DESIGN.md form: "Scratch renders are labelled VOICE-SCRATCH until the owner passes a casting." [V chain step 4]

**What that means, operationally, for every Chatterbox render in the Mochiichao pipeline:**

1. **Every Chatterbox render is SCRATCH on creation — automatically, regardless of how good it sounds.** Its legal uses are exactly three: (a) timing a scene (durations, `timing.json`, X-sheet dialogue column), (b) timing / drafting the animatic, (c) drafting visemes / mouth timing (§6). Scratch audio may be *cut into an animatic*; it may not be cut into a locked episode mix.
2. **Scratch must be labelled.** File / queue label carries `VOICE-SCRATCH` or the take-label `temp` marker (the mine's `h1-temp` precedent [B §1b, §8.8]), and its manifest row (L15) states scratch status + which reference and numbers produced it. An unlabelled render is treated as scratch with a labelling defect, never as final by default.
3. **Promotion to FINAL happens by exactly two routes, and no other:**
   - **Route 1 — Human performance.** The final line is a recorded human performance (the pipeline's ensemble-record stage: cast recorded, ad-lib / improv pass harvested, best material canonised [B §5c–d]). This is the law's primary meaning.
   - **Route 2 — Owner-locked clone.** A Chatterbox clone whose **reference the owner has cast to the sheet (§1 Step 5) and whose rendered take the owner has ear-checked and passed** (L15). This is the "owner-locked clone" the pattern form names [B §8.8], and it is the only sense in which a synthetic render can be final. The lock is per casting and per take-set, recorded in the manifest — it is not a blanket approval of the engine, the character, or future re-renders.
4. **Until a route is completed, the following are prohibited for a scratch render:** presenting it as the character's voice (to the owner as a finished casting, or anywhere outside the production), sound-locking it, mixing it as final, or letting animation polish proceed *against its performance* (animation may proceed against its *timing* — that is what scratch is for [B §5c]).
5. **Casting-pending consequence (current state):** because all three humans are **PENDING CASTING**, every Mochiko / Hex / Aeon render produced today is scratch by definition — including renders made with VOICE-DESIGN.md's draft numbers, which are *render starts for owner tuning* [V], not a casting. EP01 timing / animatic work is unblocked by this; EP01 final voice is blocked on Mochiko's casting route (owner's ear), exactly as the EP01 casting-brief draft frames the choice (supply a reference / audition-then-clone / defer).
6. **Never-synthesised boundary:** the mine records voices that are never synthesised and characters who get no invented lines in the owner's other work [B §8.12]. For Mochiichao, no equivalent owner ruling for a human character exists in the three inputs, and none is invented here. **TBD — owner:** whether any Mochiichao human voice is record-only. If the owner so rules for any character, Route 2 closes for that character entirely.
7. **Engine law (applies to scratch and final alike):** Chatterbox is the character-voice default by owner law; other engines complement, never replace — pulled in only for a named direction capability (emotion tags, plain-English per-line instruction, cross-language) or for bulk / scratch work, and licence-flagged or unstable engines (rate drift is a named disqualifying prosody fault) are documented-and-excluded, never silently used [B §2, §3b, §8.16]. Scratch engines in the owner's stack (Piper / Dia / espeak temp track at 175 wpm fallback [B §2c, §5d]) inherit the same labelling law — an espeak or Piper timing track is scratch even when nobody would mistake it for a performance.

---

## 6. Timing integration — beats, frames, mouths, and the human talking seat

Prosody is not finished when it sounds right; it is finished when it times right. This section wires the voice system into animation timing and into the show's human talking seat: **Chatterbox → Rhubarb visemes → Preston Blair mouths** (the wired seat; complementary engines / tools catalogued elsewhere in the owner's stack are complements under §5.7, not replacements).

### 6.1 The beat grid: 144 BPM = 10 frames per beat

- The measured-timing doctrine from the owner's curated HB research: at 24 fps, beats were marked so that **a 144 BPM click equals 10 frames per beat** — "HB's snappy comic timing was measured, not felt" [B §5d]. Arithmetic: 144 beats/min = 2.4 beats/sec; 24 frames/sec ÷ 2.4 = **10 frames per beat**. This is the grid prosodic landings are planned on: stress hits, button landings, blink-on-emphasis, and gag lead/lag (§4 L12) are placed on beat positions, not floated.
- **Frame-rate caution (stated in the source):** the playbook's constants are given at 24 fps and episodes are 30 fps — "scale accordingly" [B §7b]. At 30 fps, one 144 BPM beat = 12.5 frames — a non-integer. Consequence for the pipeline: time the *voice* on the beat grid in seconds / BPM (frame-rate-independent), and convert to frames at the episode's actual rate, rounding stress landings to the *early* side (see M/B/P rule below). Do not silently carry 24 fps frame counts into a 30 fps timeline.
- **Uniform timing is the named failure mode** [B §8.15, §7c]. The grid is a ruler, not a metronome to obey flatly: hold lengths are varied *deliberately* — a heavy character's actions get 2× the frames of a light character's; a 4-frame take is funny, a 12-frame take is dramatic [B §7c]. Prosody direction (§4 L4) should state *where* a line sits stiffly on the grid and where it deliberately pushes / drags.

### 6.2 The talking seat, stage by stage

| Stage | Tool / system | Input → output | Governing rules |
|---|---|---|---|
| 1. Voice | Chatterbox (per-character reference + tuned exaggeration / CFG, render-queue pattern) [V chain step 3; B §1] | Directed line text (§4) → per-line WAVs | §4 rules; §5 scratch/final status recorded per WAV |
| 2. Timing sheet | `timing.json` (owner pipeline contract: index, character, voice, emotion, line, wav, start, duration — lines laid end-to-end with the 250 ms default gap) [B §2c] | WAVs + transcript → timing sheet | Voice first, timing sheet second, mouths third — always in that order [B §2c]. X-sheet dialogue column is filled from this, first, before any other element is timed [B §7c] |
| 3. Visemes | Rhubarb (the wired seat's viseme stage; the owner's dialogue contract names Rhubarb / OpenFaceFX as the WAV + transcript → viseme consumers [B §2c]) | WAV + transcript → viseme cue timings | Viseme output is a *starting point for the animator, not a final lip-sync* — human refines against the X-sheet (the doctrine as stated for the owner's timing tooling [B §7d]; applied here to the seat as a whole) |
| 4. Mouths | Preston Blair mouth system (~10 shapes; per-character viseme pack drawn **in the character's own style** — never generic mouths pasted on) [B §7a, §7e] in Tahoma2D / Blender (human talking seat) | Viseme cues → mouth animation | §6.3 mouth rules. Gate: the pack must be tested with **10 seconds of actual dialogue**, and lip-sync must read clearly, before it counts as done [B §7e] |
| 5. Performance layer | Animation over the locked audio | Mouths + body | Blinks, moving holds, head/mouth exclusivity (§6.3). Animation serves the performance [B §8.7] |

Energy-VAD timing tooling exists in the owner's archive as a *draft* timing-sheet generator (20 ms frames, −40 dB threshold, 80 ms min speech, **150 ms min silence**) [B §7d] — its heuristics (OPEN 3f / CLOSED 2f alternating) are a starting grid for mouth timing only, superseded by Rhubarb cues + human refinement wherever they conflict. It is not the viseme stage.

### 6.3 Mouth and performance timing constants

From the animation playbook — prosody's frame numbers [B §7, §8.13–14]. At 24 fps unless noted; scale for 30 fps per §6.1:

- **Rhythm over accuracy, stress over coverage.** The audience reads mouth *rhythm*, not mouth accuracy. Break dialogue into phonemes, not words; **hit the stressed syllables hard** — the shapes on stressed beats carry the performance; unstressed syllables can use approximate shapes [B §7a]. This is why §4 L4 requires the stress word in writing: the mouth stage needs it as much as the voice stage does.
- **M/B/P is non-negotiable.** Whenever the audio has a b, p, or m, the mouth MUST close — a missed lip closure is the #1 lip-sync error and the eye catches it instantly. Closures land **exactly on the consonant; 1 frame early is better than 1 frame late** [B §7a–b].
- **Lead the audio by 1 frame.** Animation that hits exactly on the sound feels late; 1 frame early feels right [B §7b].
- **Hold lengths:** average mouth shape hold 2–3 frames (1 frame at 30 fps for fast dialogue); vowels 2–4 frames depending on stress; **never hold a single shape more than 6 frames** unless it is a sustained sound — it starts looking frozen [B §7b].
- **Return to Rest between phrases.** Snap back to the neutral / closed Rest shape on pauses; don't hold the last shape [B §7a].
- **Blinks:** every 3–5 seconds during dialogue; **blink on emphasis** — a blink on a stressed word adds punch; **don't blink during a held stare** — the absence of blinks creates intensity [B §7c].
- **Moving hold:** something must move every 2–3 seconds; a small breathing loop keeps a character alive through a 10-second dialogue shot [B §7c].
- **Head vs. mouth:** no talking at full intensity during fast head turns — pick one [B §7b; §4 L8].

### 6.4 How prosody decisions appear on the timing grid (worked pattern)

For any directed line, the direction pass (§4 L4) plus this grid produce a complete timing instruction. Pattern (illustrative structure only — no new script line is written here):

1. Stress word chosen → its stressed syllable is placed on a beat position (10f grid at 24 fps) → mouth shape on that syllable is held at the top of the vowel range (up to 4f) and, if it carries an M/B/P closure nearby, the closure is set 1 frame early.
2. Named contour chosen (e.g. Mochiko Reverence: flat + slow) → rate change is realised first in the render (exaggeration override down, per L3) and only secondarily by stretching frames; the grid position of the button does not move to accommodate a slow reading — the reading is re-taken or the line is re-blocked (L17: feeling and duration are invariants in conflict, resolved by re-direction, not by drift).
3. Phrase breaks are only real at ≥ 150 ms [B §7d]; shorter gaps are rhythm inside the phrase and get no Rest shape and no blink.
4. Inter-line gap defaults to 250 ms [B §2c]; Aeon's thesis space and any scored silence (L9) are written exceptions with their own durations.
5. Blink is cued on the line's stress word unless the shot is a held stare, in which case the *absence* is the direction and is written as such.

---

## 7. Contrast: creatures (out of scope, except where the system touches them)

- Creatures are **pure cries and sounds only — no words, no name-saying** (owner law). This doc designs no creature dialogue, and §3–§4 apply to humans only [V open items].
- The one pattern that transfers, from the industry report's Pokémon study [A §2.1]: **cries are performances, not samples.** The reference method (Ōtani's) is to perform every cry against a *specific intended sentence / meaning* for that scene — if the nuance were the same, a recording would do. Mochiichao is *stricter* than that reference (no name-syllable carrier at all), but the discipline transfers intact: every cry entry is tagged with its intended meaning and emotional contour for its specific beat; a fixed small cry vocabulary + consistent contours is what teaches the audience to read a creature; variation is the vocabulary lesson. Non-verbal vocalisations decode emotion *better* than speech-embedded prosody (>72–81% vs. ~50–60%) [A §1.3] — the cries-only law is working with the strongest channel, not around a limitation.
- The mine's only creature-side ancestor is a discipline precedent, not a library: a non-verbal character's vocalisations are *selected by ear for dramatic intent, never written as invented lines*, with provenance per clip [B §3a, §4, §9]. No repo contains a cry-design system [B §9] — creature prosody beyond this contrast section is **TBD — a separate doc's subject**, and nothing here should be read as filling it.
- Human talking-seat tooling (lip-sync, visemes, Blair mouths, §6) is **in scope for humans because humans speak words**; creature work does not use the word-mouth seat. (Scope note carried from the owner's standing correction on the human talking seat.)

---

## 8. Open items / PENDING CASTING

Everything below is genuinely open. None of it is filled, assumed, or worked around in §§1–7.

| # | Item | Blocks | Source of the gap |
|---|---|---|---|
| 1 | **PENDING CASTING — reference audio for Mochiko, Hex, Aeon.** Owner's ear decides; refs cast to §3 sheets per §1 Step 5. No reference from any other show may be reused [B §10] | Final voice for all three (Route 2, §5); EP01 final voice (Mochiko only) | [V open items]; task casting state |
| 2 | **PENDING CASTING — final exaggeration / CFG tunes.** VOICE-DESIGN.md numbers are render starts for owner tuning [V] | Locked per-character defaults | [V] |
| 3 | **TBD — owner: record-only ruling.** Whether any Mochiichao human voice is never synthesised (which would close §5 Route 2 for that character) | §5 route availability per character | No ruling in any input [B §8.12 is another show's law, pattern only] |
| 4 | **TBD — owner: Mochiko anger ceiling; Hex joy-budget confirmation; Aeon diction sources + anger register; signature motto lines for all three** (flagged in-line in §3) | Completion of §3 sheets | Absent from [V] drafts; not invented here |
| 5 | **TBD — owner: Hex's two melody movements per episode** — who chooses them (writer / director / owner) and at what stage | §3.2 rationing in production | System raises the ration [C §6.11 pattern]; no owner procedure exists yet |
| 6 | **Decision pending: condensed Bible spec blocks.** Whether / when §1 Step 7's attachment (essence · function · sound · signature utterance · tempo law per human cast entry) is made in the show Bible | Bible landing, not voice production | Recommendation from [C §4.7, §6.1–6.2] |
| 7 | **Verify Chatterbox parameter ranges against the exact build in use** before treating any range in §2 as operational — ranges differ between implementations | Render-queue documentation | [A §5] |
| 8 | **Creature prosody system** — cry vocabulary, contour tagging, selection discipline beyond §7's contrast | Creature voice production (separate doc) | No system exists in any input [B §9] |
| 9 | **Scratch-engine choice per production phase** (Piper / Dia / preset voices for timing tracks) is a pipeline decision, not settled by this doc — the labelling law (§5) applies whichever is chosen | Nothing (animatic timing can proceed) | [B §2c, §5c–d] lists options, no Mochiichao pick |
| 10 | **This doc's own canon status.** It is a synthesis draft for owner review. Landing steps are in the companion `LANDING-STEPS.md`; no PR is opened by this synthesis | Repo landing | Task instruction |

---

## 9. One-page checklist (for the render queue)

```
[ ] Line is from the locked script — not invented, no TBD filled        (§4 head)
[ ] Character defaults from VOICE-DESIGN.md applied first               (L2)
[ ] Override? Only exaggeration, only for a register shift, labelled    (L3)
[ ] Direction metadata written: stress word / contour / register /
    physical action (specific prop, colour, staging) / button           (L4, L8)
[ ] Text punctuation untouched — the text IS the direction              (L5)
[ ] Take judged against the cue line / cry, not in a vacuum             (L7)
[ ] Button / peak line? Multiple takes, human pick                      (L11, L13)
[ ] Rationed devices respected (Hex melody, protected feelings)         (L14)
[ ] Labelled VOICE-SCRATCH (or temp) — or final route documented        (§5)
[ ] Manifest row written: source / ref / numbers / status               (L15)
[ ] Timing: stress on the beat grid; M/B/P 1f early; Rest on phrases;
    >=150ms = break; 250ms default inter-line gap                       (§6)
[ ] Owner ear-check before anything is called final                     (L15, §5)
```

*End of PROSODY-SYSTEM.md — synthesis draft, 2026-10-27. Companion files in this folder: `SOURCE-MAP.md` (section-level audit trail to the three inputs), `LANDING-STEPS.md` (repo placement beside `show/production/VOICE-DESIGN.md` — not pushed).*

---

## Appendix — Source map (audit trail)

**Purpose:** every claim / rule in `PROSODY-SYSTEM.md` (same folder) traced to the input it came from, at section level, so the owner can audit the synthesis. Nothing in the synthesis is attributed to a source that does not contain it.

**Inputs, as read for this synthesis (2026-10-27):**

| Key | Input | Path as read | State |
|---|---|---|---|
| **[A]** | Industry report | `~/workspace/research_notes/prosody-voice-tv-20261027/report.md` | Read in full. The folder contains **only** `report.md` — no companion files exist there (see Gaps). |
| **[B]** | Repo mine | `~/workspace/mochiichao-show/research-drafts/PROSODY-REPO-MINE.md` | Read in full (10 numbered sections +patterns §8.1–8.16 + honest gaps §9). |
| **[C]** | Bible-craft study | `~/workspace/mochiichao-show/research-drafts/BIBLE-CRAFT-STUDY.md` | Read in full (architecture, comparative table, voice/prosody/emotion §4, transferable principles §6). |
| **[V]** | Existing doc (companion base, not one of the three research inputs) | `show/production/VOICE-DESIGN.md` — read from the local staging copy at `~/workspace/mochiichao-show/repo-add/show/production/VOICE-DESIGN.md` | Read in full. Supplies the chain (sheet → reference → render → gate), the three draft sheets, and all numeric render starts. PROSODY-SYSTEM.md is written as its companion and does not restate its numbers as canon. |

**Additional context consulted (not a research input; used only for casting-state framing, never as a finding):** `~/workspace/mochiichao-show/EP01-MOCHIKO-CASTING-BRIEF-DRAFT.md` — for the facts that EP01's cast table has exactly one word-voice (Mochiko), that Hex / Aeon are not in EP01, and that the owner's casting choice is framed as supply-a-reference / audition-then-clone / defer. Where PROSODY-SYSTEM.md uses these, it says so in-line (§3.1, §5.5, §8).

**Standing owner context applied (from the task brief, not from the inputs):** creatures pure-cries-only law; humans speak; Chatterbox → Rhubarb → Preston Blair as the human talking seat; house writing system (rules-first, canon-sourced beats, TBDs never silently filled, specific props/colours, gag mechanisms not quips, silence as a tool); per-character reference casting awaiting the owner's ear. These frame the synthesis; no finding below is attributed to them.

---

## Section-by-section map

### PROSODY-SYSTEM §0 — The system in one page
Summary section; every numbered point restates a mapped section below (1→§1, 2→§1 Step 5 + §2, 3→§4, 4→§5, 5→§4 L1, 6→§6, 7→§4 L15, 8→§1 Step 4). No new claims.

### §1 — Voice-type design method
| Claim / rule | Source |
|---|---|
| Prosody definition; patterns transfer, identities don't | [A] preamble / terminology anchor |
| Voice specified via cognitive style; prosody follows from cognition | [C] §4.1 |
| Tempo-as-function ("X's tempo trait controls the pace of scene type"); robot character as scene metronome | [C] §4.5, §6.3 |
| Counter-rhythm specification; voice defined relative to scene partner | [C] §4.6 |
| Protect asymmetry / one sincere party; "format collapses when everyone performs" | [B] §5b (Proposal 5), §3d (straight-man cast slot), §8.10 |
| Per-channel analogue casting (separate analogues for lines / intensity / moves / voice) | [C] §1.5, §4.4 (Johnny Bravo) |
| "A ref that IS a recognisable performer is a failed casting" | [V] chain step 2 (also stated in task brief as house rule) |
| God Molecule voice field set (device · diction · register · negation cues · counter-rhythm; running devices) | [C] §4.6 |
| Signature utterance + motto-as-diction ("Oft heard saying", "Philosophy") exemplar fields | [C] §4.2 |
| Emotion acoustic recipes (joy / sadness / anger / fear: rate × pitch × range × intensity × contour) | [A] §1.2 |
| Emotion decoded from voice alone ~60%, 4–5× chance; per-emotion rates (anger ~79% … disgust ~47%); fear better in short vocalisations | [A] §1.3 |
| Signature stable / state varies within identity | [A] §6, final principle |
| Emotion specified at series / character / story / protected-feeling levels | [C] §4.8 |
| Reference prosody / accent bleed; ~5–10 s clean reference; shorter low-noise often better | [A] §4.1 |
| Pin parameter ranges to the exact build; ranges differ between implementations | [A] §5 (also §4.1 sources) |
| No written casting criteria in repos except provenance / attribution / ear-check; onyx TEMP dataset sample as sole positive datum | [B] §9, §4, §1a |
| Wizard Gang references not reusable for Mochiichao | [B] §10 |
| Test with 10 seconds of actual dialogue, not isolated sounds (viseme-pack gate, applied by analogy to voice and flagged as analogy in the doc) | [B] §7e |
| Gate: review lines against the sheet (pacing / melody / energy) | [V] chain step 4 |
| Attach condensed spec block to Bible cast entries; attachment not relocation | [C] §4.7, §6.1–6.2 |

### §2 — The two Chatterbox numbers
| Claim / rule | Source |
|---|---|
| Exaggeration = emotion-conditioning scale, global prosodic intensity; value bands and instability at extremes | [A] §4.1 |
| CFG = conditioning strength, pacing + adherence; higher = slower / more faithful | [A] §4.1 |
| Interaction: exaggeration speeds speech; lower CFG compensates; dramatic combo cfg ~0.3 / ex ~0.7+; fast reference → lower CFG; defaults 0.5/0.5 | [A] §4.1 (Resemble README as cited there) |
| Exaggeration = character identity on lived scale 0.35→0.85; CFG rarely touched; narrator raises CFG (0.7) not exaggeration | [B] §1a–b, §8.2 |
| No per-word stress / pause / contour control; global embedding loses prosodic detail | [A] §4.2.1 |
| Timbre / style / emotion entangled; similarity degrades on emotional speech | [A] §4.2.2 |
| No long-range performance memory; stateless per-generation conditioning; per-line human direction pass required | [A] §4.2.3, §4.1 internals |
| Numeric starts for Mochiko / Hex / Aeon | [V] draft sheets — pointer only in PROSODY-SYSTEM; not re-derived from any input |

### §3 — Per-character sheets
| Element | Source |
|---|---|
| Mochiko: bright mid-high, quick eager pace, Wonder (up-tilt) + Reverence (flat/slow, Manual) contours, short breaths, no baby-talk, observation-naming tic + exemplar line, ex 0.45 / cfg 0.5 | [V] Mochiko sheet |
| Hex: lower drier, deliberate, beats land on LAST word, dead-level melody moving twice/episode, goes quieter not louder, time/count tic + "Tomorrow, then.", ex 0.3 / cfg 0.6 | [V] Hex sheet |
| Aeon: warm low, unhurried, lecturer's prosody, thesis space, lists as ceremonies, laugh in the voice, deflation tic, ex 0.4 / cfg 0.55 | [V] Aeon sheet |
| Emotional-register tables for all three (recipes filtered through identity) | [A] §1.2 recipes applied to [V] sheets — **synthesis application, marked as such in the doc**; where [V] has no register (Aeon anger, Aeon diction, Mochiko anger ceiling, Hex joy-budget), the sheet marks TBD instead of inventing |
| Hex line-economy benchmark (narrator 3–6-word fragments) | [B] §1b, §8.5 |
| Hex melody rationing framed as a rationing rule | [C] §1.4 (power-item rationing), §6.11 — pattern applied, marked as system application |
| Authority-by-CFG reading of Aeon / Hex numbers | [B] §8.2 pattern applied to [V] numbers |
| Relational summary (§3.4) | [A] §6 (prosody is relational); [C] §4.6 (counter-rhythm) |
| EP01 gating note (Mochiko only) | Additional context file (see header), not [A]/[B]/[C] |

### §4 — Line-reading rules
| Rule | Source |
|---|---|
| Head: canon-sourced lines only; no invented lines; TBDs not filled by renders | House writing system (task brief); supported by [B] §8.12 (no invented lines precedent) |
| L1 dialogue-first order (script → scratch → final voice → audio cut → animatic → animation → lip-sync); X-sheet dialogue column first | [B] §5c, §7c, §8.7 |
| L2 defaults rule; L3 overrides rare / register-shift only, exaggeration-only, downward (whisper 0.50→0.35; manic reined 0.85→0.70); CFG never per-line for expression | [B] §1b, §8.3 |
| L4 direction metadata in writing; line readings legitimate; stress word for punch / callback planting | [A] §3.2 (Romano), §4.2.3 |
| L5 text IS the direction (caps bursts, em-dashes, ellipses, shortening-sentence escalation — Cipher money line); no direction field in queue format; cape-jones `emotion` + `instruct` schema exception | [B] §1b, §8.4, §2c |
| L6 line economy; short declarative = most synthesis-stable | [B] §8.5, §3a; [A] §4.3 |
| L7 relational performance; read-ins; relative levels / one-room illusion | [A] §3.2 |
| L8 picture context speeds sessions, cuts ADR; director supplies physical action; no talking during fast head turns | [A] §3.2; [B] §7b |
| L9 silence scored (scenes blocked "DIALOGUE: None"; music cuts for the line; hold-silence as approval-level ending) | [B] §3a, §3c, §8.6 |
| L10 pause numbers: ≥150 ms phrase break; 250 ms inter-line gap; return to Rest | [B] §7d, §2c, §7a |
| L11 buttons as prosodic events; button staffed by key character; script the button | [A] §3.3, §6 |
| L12 gag timing mechanisms (deadpan scale-mismatch; lead/lag beat-late; music cut-out; 4f funny / 12f dramatic) | House writing law (task brief) + [B] §3d, §3a, §7c |
| L13 peaks get re-rolls / multiple takes + human pick | [A] §4.3, §6 |
| L14 protected feelings gate | [C] §4.8 |
| L15 owner's ear is the lock; refusal of probably-right audio; manifest row per clip; take-label pattern | [B] §4, §3a (§6 lock sheet), §8.11, §1b |
| L16 signature stability; serial attachment via repeated recognisable presence — **with the doc's own honesty flag that the direct prosody→attachment link is inferred, not measured** | [A] §1.4, §5, §6 |
| L17 adapt the feeling, not the syllables (duration + emotional beat invariant) | [A] §2.3, §6 |

### §5 — Scratch-vs-final law
| Claim / rule | Source |
|---|---|
| "Scratch voices are for animatics ONLY. Final voices are human." (Stage 1 rule) | [B] §5c (Mystery Coast PIPELINE.md as mined) |
| Pattern form: scratch TTS times a production; final = human/recorded or owner-locked clones; temp tracks labelled temp (`h1-temp`, espeak temp track) | [B] §8.8, §5d, §2c |
| "Scratch renders are labelled VOICE-SCRATCH until the owner passes a casting" | [V] chain step 4 |
| Ensemble record + improv pass + canonised ad-libs ("Jinkies" method) as the human final-voice stage | [B] §5b–d |
| Chatterbox default / complements-only engine law; licence-flagged and rate-drift-unstable engines excluded | [B] §2, §3b, §8.16 |
| espeak scratch fallback at 175 wpm | [B] §2c |
| Never-synthesised voices / no invented lines exist as owner law in another show — **explicitly NOT transferred as a Mochiichao ruling**; posed as TBD (§5.6) | [B] §3a, §8.12 (with [B] §10 non-transfer discipline) |
| Operational consequences 1–5 (scratch-on-creation, three legal uses, two promotion routes, prohibitions, casting-pending consequence) | **Synthesis:** the doc's stated application of the three source forms above to Chatterbox renders, as the task required ("state exactly what that means"). No source sentence is quoted for these beyond the three forms; they are rules derived from them, and §5 quotes the sources first so the derivation is auditable |

### §6 — Timing integration
| Claim / rule | Source |
|---|---|
| 144 BPM = 10 frames per beat at 24 fps; metronome timing "measured, not felt" | [B] §5d (HB research), §8.15 |
| Playbook constants at 24 fps; episodes 30 fps, scale accordingly; 30 fps beat = 12.5 frames (arithmetic from the two sourced numbers, shown in the doc) | [B] §7b + arithmetic |
| Uniform timing as the AI failure mode; vary hold lengths; heavy = 2× frames; 4f funny / 12f dramatic | [B] §7c (§14.10), §8.15 |
| Talking seat order: voice → timing.json → visemes → mouths; `timing.json` fields; 250 ms gap in code | [B] §2c |
| Rhubarb / OpenFaceFX consume WAV + transcript → visemes | [B] §2c (seat assignment to Rhubarb specifically: task-brief standing context — see header) |
| Preston Blair ~10 shapes; rhythm-not-accuracy; phonemes not words; stressed syllables hard; M/B/P non-negotiable; return to Rest | [B] §7a |
| Holds 2–3f (1f at 30 fps fast); closures exactly on consonant, 1f early > 1f late; vowels 2–4f; max 6f hold; lead audio by 1 frame | [B] §7b |
| Blinks 3–5 s / on emphasis / none in held stare; moving hold every 2–3 s; "number of frames IS the performance" | [B] §7c |
| VAD timing tool constants (20 ms, −40 dB, 80 ms / 150 ms minima; OPEN 3f / CLOSED 2f heuristics); "starting point, human refines against X-sheet"; rules printed per run | [B] §7d |
| Viseme pack in character's own style; gate = 10 s actual dialogue + lip-sync reads clearly | [B] §7e |
| X-sheet dialogue column first | [B] §7c (§13/§16) |

### §7 — Creature contrast
| Claim / rule | Source |
|---|---|
| Pure cries only, no words, no name-saying | Owner law (task brief / standing context); [V] open items ("this doc governs HUMANS only") |
| Ōtani method: perform each cry against a specific intended sentence; fresh performance over sample library; fixed tiny vocabulary + consistent contours teaches reading; lead creature voice kept across languages | [A] §2.1 |
| Mochiichao stricter than the Pokémon carrier (no name-syllables) — noted as a house difference in the source itself | [A] §2.1 closing note |
| Non-verbal vocalisations decode higher (>72–81%) than speech prosody (~50–60%) | [A] §1.3 |
| Non-verbal vocalisations selected by ear for dramatic intent, never invented lines; provenance per clip; **no cry-design system exists in any repo** | [B] §3a, §4, §9 |

### §8 — Open items
Each row names its own gap source in the doc itself. Rows 1–2: [V] open items + task casting state. Row 3: absence in all inputs. Rows 4–5: absences in [V] / procedure gaps raised by [C] patterns. Row 6: [C] §4.7 recommendation, undecided. Row 7: [A] §5. Row 8: [B] §9. Row 9: [B] §2c/§5 options without a Mochiichao pick. Row 10: task instruction.

---

## Gaps and thin spots — stated, not papered over

**In [A] (industry report):**
- The folder held **only `report.md`** — the "any companions" anticipated in the task do not exist. Nothing was missing from the report itself; it is self-contained.
- [A]'s own §5 flags: **no direct prosody→retention/attachment studies exist** (§1.4 is an inference chain — PROSODY-SYSTEM L16 carries that flag); JP→EN dub material (§2.3) rests partly on trade / content-marketing pages quoting real directors; TV-structure terms (§3.3) are secondary summaries, not a network standards document; Ōtani fan-vocabulary specifics are fan-sourced; Chatterbox ranges vary by implementation. The synthesis uses §2.3 only for the single "feeling, not syllables" principle and §3.3 only for the button principle, both flagged at their source strength.
- [A] says nothing about Hex / Aeon / Mochiko specifically — all character material comes from [V]; [A] supplies method and limits only. The synthesis does not attribute any character trait to [A].

**In [B] (repo mine):**
- [B]'s own §9: **no repo contains a prose per-character prosody sheet** — the owner's native format is numeric + punctuation-as-direction + one-word labels. PROSODY-SYSTEM's prose sheets (§3) are therefore a *new format built on his patterns*, extending the system rather than quoting it — the doc says so (§3 head, following [B] §9's own wording).
- No casting criteria beyond negative discipline [B §9] — hence §1 Step 5 supplies the sheet-to-cast-against and leaves the judgement PENDING CASTING rather than inventing criteria.
- Creature prosody: exactly one ancestor data point (selection discipline), no system [B §9] — hence §7 is a contrast section only and §8 row 8 stays open.
- TRIPPEDD voice content and the referenced Goodville voice-synced example are absent at HEAD [B §6, §9] — nothing from them is used.
- Mystery Coast voice-first material is a **proposal** file + pipeline/research docs, not canon in its own bible [B §5a–b, §9] — the scratch/final law is quoted from its pipeline doc (where it *is* stated as a stage rule), and §5 presents all three source forms so the owner can see the law's provenance.

**In [C] (bible-craft study):**
- Nick-side bibles were **not locatable**; the study makes no claims about them, and neither does the synthesis [C §0].
- Several CN sources were sampled, not read end-to-end (Camp Lazlo, Ed Edd n Eddy binder), and the Gumball bible's text layer is degraded — claims from them in [C] are limited to legible material [C §0–§1]. The synthesis uses [C] only for its §4 voice mechanisms and §6 principles, which rest mainly on the fully-read Disney bibles, Johnny Bravo, and the owner's own God Molecule bible.
- [C] §4's headline is a *negative* finding — classic bibles contain no modern voice sheet; voice is specified by six indirect mechanisms. PROSODY-SYSTEM's method (§1) is built from those mechanisms (trait→delivery, exemplar fields, form-as-audition, per-channel casting, tempo-as-function, dedicated voice section); it does not claim any network bible contains a prosody system like this one.

**In the synthesis itself:**
- §5's operational consequences and §3's register-through-identity tables are **derivations** (marked as such above and in the doc), not quotations. They are the task's requested synthesis work: applying the three inputs to Mochiichao's pipeline and sheets.
- VOICE-DESIGN.md was read from a local staging copy (`repo-add/`), not from live GitHub (API rate-limited at time of writing). If the repo's current VOICE-DESIGN.md has diverged from that copy, §3's [V] attributions should be re-checked at landing (see LANDING-STEPS.md).

*End of source map.*
