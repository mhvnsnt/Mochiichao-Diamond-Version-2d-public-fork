# EPISODE 2 — "CHOOSE, AND BE CHOSEN" — SHOOTING SCRIPT v2

**Status: REVISED v2 — rebuilt on the game's locked opening
per the season canon reconciliation (SEASON-CANON-MAP.md,
"EP02 reconciliation — canon wins"; SEASON-ARC-NOTE Note A).
Title OWNER-APPROVED (Jamar, 2026-10-27). v1's three-candidate
Garden ceremony is SUPERSEDED by this version — see
REVISION-NOTE.md for every change and its canon source.
Nothing from v1 was dropped silently.**

- Series: Mochiichao — Episode: 02
- Format: shooting script in the owner's house format —
  rules, canon sources, scene blocks (VISUAL / ACTION /
  DIALOGUE / SUBTITLES / SFX / MUSIC), open items. Timings
  are planning estimates — runtime locks at animatic.
  Planning shape: ~6:00, 28 cuts, matching v1's format class.

## 0. THE RULES THIS SCRIPT OBEYS
1. **Creatures make pure cries and sounds only.** No words, no
   name-saying (owner-decided 2026-10-27). Word-dialogue
   belongs to the humans only: Mochiko, Mom, the Mover, Hex's
   Mom, Prof. Aeon, Hex. This is the first episode with real
   human dialogue; the voice track is a separate production
   track (prosody system) and does not gate this script.
2. **Subtitles are silent-film intertitles** — only at earned
   moments. This episode has exactly **two**: cuts 16, 26.
   Both are Mochii's, and both fall **after** the switch —
   creature meaning becomes legible on screen only once the
   show is the creature's. The third slot is held, unspent.
3. **Rule 12 is not quoted in this episode.** Its wording is
   locked (bible §5) and it is not small change.
4. **THE SWITCH (owner design):** until the choosing, the
   episode is staged from Mochiko — her eye height, her
   attention, humans framed whole. At the choosing (cut 14),
   a title-level marker (§3, Scene 4) hands the episode to
   Mochii. After it: camera at Mochii height, attention is
   Mochii's attention, PRESENT poses belong to creatures, and
   Mochiko is staged as Mochii's person. There is no switch
   back within the episode.
5. **The choosing is a RESCUE-choosing (game canon).** Nobody
   is presented, auditioned, or picked from a line at leisure.
   Aeon is cornered; a hand reaches into his bag because
   reaching is the only move there is; and the creature
   answers the reach. She chooses by reaching. It chooses
   back. That mutuality is the episode's title and its thesis.
6. **The unchosen are not jokes.** All five starters are
   staged with full dignity in the seconds the pressure
   allows, and the four who stay with Aeon are honoured in
   the lab scene. The choosing is about the one who answered,
   never about four wrong answers.
7. **The wild creature is never named.** The game's locked
   opening names no species for it ("this wild creature"),
   and Sector 0's map data carries no wild table. On screen
   it is a shape, a sound, and a problem. Naming it is an
   open item (§6), not a script decision.
8. **THE SECRET is not touched.** No slip is spent — Aeon's
   slip-and-correct is rationed and this is not its episode.
   Nothing in dialogue, signage, or staging betrays it.
9. **Size law.** Characters are staged full-size throughout.
   Chibi appears nowhere in the story picture; the card
   system governs the title / eyecatch / preview furniture
   only (production CHIBI-CARD-SYSTEM.md).
10. **The Dark Forest does not appear.** This episode's ground
    is Boot Harbor and Sector 0. EP01's Forest thread stays
    exactly where EP01 left it — untouched, undeveloped
    (bible §9, open item 1).
11. **Every beat traces to canon** (§1) or is marked TBD (§6).

## 1. CANON SOURCES
| Source | Grounds |
|---|---|
| `src/lib/wiring/dialogue/region1-truck-start.ink` (LOCKED) | The episode's spine, in its order: truck arrival → house / clock → rival house → route rescue → lab → Mom's Sprint Boots. Aeon's and Mom's key lines are the ink's own words |
| `src/lib/wiring/maps/aeon_lab.json` | The lab's layout and population: Prof. Aeon, **Assistant Mochiko**, the five starter stands in a row, Dorowani and Gabu on display, the door labelled Boot Harbor |
| `src/lib/wiring/maps/sector0.json` | Boot Harbor: the town sign ("Sector 0 — Boot Harbor"), Mom, Aeon at the lab gate, the shopkeeper's "You're Aeon's new one, by the bag" — the town already knows what Mochiko is here to be |
| `show/production/SEASON-CANON-MAP.md` | EP02 reconciliation: five starters, rescue-choosing, Mochiioteca handover, Mochiko = Aeon's assistant; the POV switch stands (owner design) |
| `show/production/SEASON-ARC-NOTE-EP01-EP10.md` | EP02 = game Beats 0–1; Note A supersedes v1; Champion Hex arc: neighbour / rival (EP02 button) |
| `show/bible/SHOW-BIBLE.md` §3–§6, §9 | Laws, episode engine, open items |
| `docs/human-characters/` (owner v2 designs) | Mochiko, Prof. Aeon, Hex, Mom likenesses — bible §5.7 Likeness Law applies to all builds |
| `src/data/core/species.json` + model sheets | The five starters: Mochii (001), Razorgater line (004), Tyrage line, Kittember, Sproutle |
| `show/production/tooling/avatar-stack/` canon signatures | Mochii = HYDRO RUSH (AQUA_JET) — the rescue's flare; display names per the rename law |
| `show/episodes/EP01/*` (locked) | Continuity of register: Mochiko, the Manual's care-loop grammar, intertitle discipline |
| `show/bible/IDENTITY-KIT.md` | Title card + palette law |
| `show/production/ENVIRONMENT-AND-CAMERA.md` | Camera vocabulary: ESTAB-PAN, HOLD-TENSION, PUNCH-IN |
| `show/production/POSING-SYSTEM.md` | PRESENT poses (Reveal/Tension/Joy/Menace) |
| `show/bible/COLOR-SYSTEM.md` | One dominant colour per sequence |
| `show/bible/LIGHTING-SYSTEM.md` | One hard shift allowed — the Scene 4 takeover, water-sourced |

## 2. CAST (episode 2)
| Character | Sound | Notes |
|---|---|---|
| MOCHIKO | Human voice — casting on the prosody track (§6.1) | Apparent protagonist until cut 14. New arrival at Boot Harbor; Aeon's assistant (`asst_mochiko`); the chooser |
| MOM | Human voice — casting TBD (§6.1) | First appearance. The ink's lines; gives the Sprint Boots |
| THE MOVER | Human voice — one line | The ink's `house_1f` line; unnamed, unexpanded |
| HEX'S MOM | Human voice — one line | First appearance, at the rival house (ink, verbatim) |
| HEX | Human voice — casting TBD (§6.1) | First appearance (Scene 2 + button). Next-door neighbour and rival; black hair, purple streak, amber eyes, black/purple high-collar jacket (v2 design) |
| PROF. AEON | Human voice — casting TBD (§6.1) | First full appearance. Grey afro + beard, round glasses, lab coat over teal tech suit (v2 design) |
| MOCHII | Cry file: mochii-cry.wav (performed variants TBD) | Species 001. The actual protagonist — from cut 14 |
| RAZORGATER | Cry file: razorgater-cry.wav | Starter, line 004. Not chosen; honoured, never a joke |
| TYRAGE | Cry file: tyrage-cry.wav | Starter. Not chosen; honoured |
| KITTEMBER | Cry file: kittember-cry.wav | Starter. Tail-tip flame reacts first, as always |
| SPROUTLE | Cry file: sproutle-cry.wav | Starter. The small one that digs in |
| THE WILD CREATURE | Sound: TBD (§6.2) | **Species never named — canon names none.** Shape and sound only; driven off, unharmed |
| DOROWANI | Cry file: dorowani-cry.wav | Lab display (aeon_lab.json); carries the Manual; greets the chosen one |
| GABU | Cry file: gabu-cry.wav | Lab display (aeon_lab.json); greeting beat, Scene 5 |

*Not appearing: WISPKIN and the Garden cast of EP01. The
Garden has not opened yet in this beat of the story
(R1-BEAT3); EP01's keeper framing is that beat, anticipated
(season canon map). EP01's threads are untouched, not
forgotten.*

## 3. THE SCRIPT
### SCENE 1 — EXT. BOOT HARBOR / INT. THE NEW HOUSE — MORNING (cuts 01–05)
*Staged from MOCHIKO. Dominant colour: brand blue, sea-lit.*
**VISUAL:** ESTAB-PAN across Boot Harbor in morning brand-
blue: working harbour, gulls, the town sign — **Sector 0 —
Boot Harbor** (sector0.json, verbatim) — and a moving truck
nosing up the road past it, a half-second too fast for the
town's pace. The harbour water is everywhere light lives
this morning.
**ACTION:** The truck settles outside the new house. MOM is
already on the step — she beat the furniture here and is
pleased about it. MOCHIKO comes down the truck's step with
her own pack squared on her back and stops, once, to look
at the town she has moved to: harbour, lab roof, a road
leaving. A twelve-year-old doing arrival properly. Inside
(cuts 03–04): boxes, posters under a mover's arm, stairs —
and upstairs, alone with the quiet room, she sets the
CLOCK on the wall. It ticks, once, and keeps going. She
looks at the ticking room the way you look at a contract.
**DIALOGUE:** MOM: "There you are! The truck beat us here."
/ "Our new house is just up the road. Go on in and set the
clock upstairs — movers hate waiting." / MOVER: "Careful
with that box! It's got your posters in it." / MOCHIKO:
(before the ticking clock) "Home. For real this time."
*(Mom's and the Mover's lines and Mochiko's clock line are
the ink's own words — `mom_truck`, `house_1f`,
`house_2f_clock`.)*
**SUBTITLES:** None. **SFX:** truck brake sigh, gulls,
house-hollow room tone, one clock finding its tick.
**MUSIC:** Cue T2 (title track, CUE-SHEET.md), warm entry —
harbour register.

### SCENE 2 — EXT. THE RIVAL HOUSE, BACK GARDEN — MORNING (cuts 06–09)
*Staged from MOCHIKO. Dominant colour: brand blue, sharpening.*
**VISUAL:** The house next door — same harbour light, a
different temperature. A back garden squared off like an
argument: neat rows, a fence on the property line, the sky
doing nothing to help anyone relax.
**ACTION:** HEX'S MOM at the back door, delighted in the
way of people who collect neighbours. She waves Mochiko
through toward the back of the garden, where HEX is. First
appearance, staged plain: black hair with the purple
streak, amber eyes, the high collar up despite the morning
— a boy built out of straight lines, standing in his own
garden like it owes him an explanation. He looks at the
new arrival the way the episode's wild creature will look
at Mochii: measuring. Nothing about him is warm, and
nothing about him is careless either.
**DIALOGUE:** HEX'S MOM: "Oh! You're the new neighbours!
Hex is out back — go say hello, you two will be thick as
thieves." *(the ink's line, verbatim — `rival_house`.)* /
HEX: "You're Aeon's new one." / MOCHIKO: "Assistant
Mochiko. I start today." / HEX: "Then start." (beat)
"We'll see what the road thinks of you."
**ACTION (cut 09):** From the harbour road, small with
distance and wrong with urgency: a man's voice, shouting.
Both of them turn. Hex recognises the voice a half-second
before Mochiko does — and does not move, because what is
happening on that road is not, yet, his business. Mochiko
runs.
**SUBTITLES:** None. **SFX:** back-garden quiet, a gate,
the shout (Aeon, off — first heard as pure alarm, words
not yet readable). **MUSIC:** T2 stems thin to two.

### SCENE 3 — EXT. HARBOUR ROAD — CONTINUOUS (cuts 10–13)
*Staged from MOCHIKO. Dominant colour: harbour grey-blue,
hardening.*
**VISUAL:** The road out of Boot Harbor where the town gives
out. Aeon's back to the harbour rocks; between him and the
road, **THE WILD CREATURE** — staged as mass, motion and
sound: low, fast, between the camera and its subject,
species never resolved on screen (rule 7). His travelling
bag is down in the road, open, the five capsules spilled
bright in the dirt.
**ACTION:** Aeon is not performing bravery; he is a man with
his back to a wall doing sums. The creature feints; stones
scatter. Mochiko arrives at a run and stops the way people
stop at cliff edges. Aeon's relief and terror arrive in the
same expression: the one person who came is twelve.
**DIALOGUE:** AEON: "Help! This wild creature has me
cornered!" / "Quick — take one from my bag and drive it
off!" *(the ink's lines, verbatim.)*
**SUBTITLES:** None. **SFX:** harbour wind up, stone
scatter, the creature's sound (TBD — §6.5; never a stock
roar). **MUSIC:** T2 stems out to a single held line.

**VISUAL (cut 11):** The five, in dirt and emergency light,
each given one true image and one cry — PRESENT grammar at
emergency tempo: RAZORGATER plants itself between the bag
and the creature without being asked (Tension, guardian
weight). TYRAGE is already facing it, bright and furious
(Joy inverted to challenge). KITTEMBER's tail-tip flame
flares before Kittember turns — the sensor greets first,
even here. SPROUTLE digs in small and does not run.
MOCHII bounces — off a stone, off the bag's strap, off
nothing — and every bounce lands a half-step closer to
Mochiko's side of the road.
**ACTION:** Mochiko's hand hovers over the spilled five.
Not choosing weather: reaching, the way you reach for a
railing. Her eyes do not compare. They keep landing,
involuntarily, on the one that keeps landing nearer.
**DIALOGUE:** AEON: "Reach, Mochiko. Whichever one reaches
back." **SUBTITLES:** None. **SFX:** five cries, distinct,
unmixed — the episode's whole creature cast introduced by
ear; capsule clicks. **MUSIC:** one stem, thinning.

**ACTION (cuts 12–13):** Her hand closes on MOCHII's
capsule — not the nearest; the one her eyes kept choosing.
The capsule opens in her palm. Mochii comes out at bounce
height, reads the whole road in one turn of its head —
creature, professor, girl — and its cry is short and
certain. The wild creature turns toward the new sound.
HOLD-TENSION: nobody on the road breathes. Mochii bounces
once — small, deliberate — toward it.
**DIALOGUE:** MOCHIKO: "Okay — okay. You and me."
**SUBTITLES:** None. **SFX:** the one bounce; harbour
noise dropped out under it. **MUSIC:** none.

### SCENE 4 — EXT. HARBOUR ROAD — CONTINUOUS (cuts 14–16)
*The Choosing. Dominant colour: harbour teal in spray-light.
This scene contains the episode's ONE allowed lighting
moment.*
**VISUAL:** The road, the rocks, the sea light coming off
the harbour water in moving sheets — the takeover source is
the water itself (LIGHTING-SYSTEM, TK-class), as it was the
Pond's in v1.
**ACTION (cut 14):** **THE RESCUE.** Mochii goes — not at
the creature: past it, a bounce off the harbour wall at an
angle no one on the road predicted, and **HYDRO RUSH**
flares out of the bounce — Mochii's signature, first flare,
instinctive and unsteady: a rush of harbour water dragged
up off the wet stones and across the road in one white
arc. It does not defeat the wild creature; it **drives it
off** — the ink's words and the ink's outcome: the creature
breaks, scrambles over the rocks, and is gone into the
harbour scrub, unharmed and unnamed. The LIGHTING TAKEOVER
lands inside the arc: light through spray rises across
Mochii and Mochiko for one beat, no more — the episode's
one hard moment, spent here. In the scramble Mochiko has
gone down to one knee in the road — fallen, not knelt:
ceremony's height reached by accident. Mochii lands in
front of her. She holds out one hand, flat (the Manual's
keeper's hand, carried from v1 — the care-loop grammar
exists in her before anyone teaches it). Mochii looks at
the hand. Mochii looks at her. It steps into the hand and
stays. PUNCH-IN lands on the two of them at the same
height.

> ## — THE SWITCH —
> **From this cut, the protagonist of this show is MOCHII.**
> Camera height: Mochii's. Attention: Mochii's. PRESENT
> poses: the creatures'. Mochiko is its person. There is
> no switch back.

**DIALOGUE:** MOCHIKO: (quietly, from the road) "Okay. You."
— the last line of the episode spoken from her perspective;
after the switch her lines are heard the way Mochii hears
them: warm, above, and not the point.
**SUBTITLES:** Cut 16 — MOCHII: *"...I choose back."*
(earned moment 1 — the first creature meaning the show has
ever subtitled from inside the creature's own episode. The
choosing was mutual; the subtitle says so.)
**SFX:** the rush, spray on stone, one small bounce, gulls
returning. **MUSIC:** all stems out for the cry; one stem
back under the hand.

### SCENE 5 — INT. AEON'S LAB — LATER (cuts 17–22)
*Staged from MOCHII. Dominant colour: warm amber — the lab
as it looks to someone it has just decided about.*
**VISUAL:** The lab at Mochii height (aeon_lab.json's
room): benches are cliffs with lit undersides; instruments
hum at creature ear-level. Along the wall, **the five
stands in a row** — four capsules home and gleaming, one
stand empty, and the room keeps looking at the empty one.
On their display shelves: DOROWANI and GABU (the lab's
display pair), watching the new arrival the way senior
residents watch weather change.
**ACTION:** The lab receives the chosen one in chain, each
greeting in its own grammar, no words anywhere: Dorowani
taps the Manual's cover twice, like a gavel, at Mochii's
height (v1's beat, at home here — the Manual lives with
Dorowani). Gabu attempts a formal bow and converts it,
mid-fall, into a chest-beat — played straight. From their
stands, the four who stayed: Razorgater's steady regard,
held a full beat (the guardian does not sulk; it keeps
watch — the unchosen are not jokes, rule 6). Tyrage,
bright even in a capsule's rest-light. Kittember's tail-tip
flame leans toward Mochii before Kittember does. Sproutle,
small nod, total ceremony. Aeon crosses above them all,
enormous and relieved, and sets the travelling bag down
where it belongs.
**DIALOGUE:** AEON: "Phew. Thank you. That bag is yours to
keep, and so is the creature inside it." *(the ink's line,
verbatim — heard now from Mochii's height, where "the
creature inside it" is the protagonist.)*
**SUBTITLES:** None. **SFX:** lab hum, gavel tap, capsule
rest-chimes, garden-of-glass small sounds at low height
(GAP — cue sheet). **MUSIC:** T2 melody stem, re-registered
low and warm.

**VISUAL (cuts 19–20):** AEON brings the MOCHIIOTECA down
to their height — the device is shown as light and icons
only (its design is an open item; EP03's convention: a
glow, a row of glyphs, a chime — never an invented product
shot). First check-in: the glyph-row blooms with a single
entry — Mochii, meeting itself on the record. Assistance,
formalised in one gesture: Aeon sets Mochiko's things at
the assistant's bench, beside his own (the lab's two posts,
aeon_lab.json).
**DIALOGUE:** AEON: "This is your Mochiioteca. It records
every Mochiichao you meet." *(the ink's line, verbatim.)* /
"Well. Assistant — that's your first entry."
**ACTION (cuts 21–22):** Mochii's first run of the lab at
its own height (ACTION BEAT B): bench-to-bench at bounce
speed, the display pair reacting in chain, the four stands
passing like harbour lights. Mochiko follows behind,
carrying things, content — demoted to luggage in a place
she chose to work, and visibly fine with the trade.
**DIALOGUE:** MOCHIKO: (from above, half-heard by design)
"Does it know it chose—" / AEON: "It knows." / AEON:
"Now go — Route Topaz is waiting, and Silicon Town is
just past it." *(the ink's line, verbatim, with the
sweep's display name.)*
**SUBTITLES:** None. **SFX:** bounce cycle on lab floors,
glass chimes, the device chime (GAP — cue sheet).
**MUSIC:** T2 stems, lab register — warm, unhurried.

### SCENE 6 — EXT. THE NEW HOUSE — EVENING (cuts 23–26)
*Staged from MOCHII. Dominant colour: evening teal-blue.*
**VISUAL:** The new house at last light, enormous and
homely from creature height. Through the front-room wall,
felt more than seen: the CLOCK, set that morning, ticking —
the day's first small machine, still keeping its promise.
Down the harbour road, the first stones of ROUTE TOPAZ
catch the last of the light (the road EP03 walks).
**ACTION:** Homecoming, the long way round the house —
Mochii learning its own address at bounce height: step,
door, window-light, Mom's shape in the doorway. Mom comes
out with the SPRINT BOOTS — at Mochii height they are
monuments: two red promises bigger than the protagonist.
Mochiko takes them with both arms and the expression of
someone handed weather.
**DIALOGUE:** MOM: "Off already? Here — Sprint Boots.
They'll get you there twice as fast." / "Come back and
talk to me any time — I'll patch your partner right up."
*(the ink's lines, verbatim.)*
**ACTION (cuts 25–26):** The doorstep. Mochiko sits on the
step — down at creature height by choice this time, the
day's rhyme with the road — and Mochii beside her, both of
them looking down the harbour road at the light going.
The town behind them settling: a shop shutter, a gull,
the lab's far window lit (Aeon, still working — or the
four, resting; the script does not say, and the picture
doesn't either). One bounce, small, deliberate — the
rescue bounce, now a punctuation mark.
**DIALOGUE:** None. **SUBTITLES:** Cut 26 — MOCHII:
*"...ours."* (earned moment 2 — v1's word, kept; its
anchor moves from the keeper board to the house, the
pair, and the road out: the belonging is the same size,
the address is new.) **SFX:** the clock through the wall,
evening harbour, one bounce. **MUSIC:** T2 melody stem
solo, out before the button.

### BUTTON — EXT. THE FENCE BETWEEN THE HOUSES — LAST LIGHT (cuts 27–28)
*Staged from MOCHII. Dominant colour: dusk violet — the
first new colour of the episode arrives with the rival.*
**VISUAL:** The fence between the new house and Hex's
house, at creature height: a slatted wall of weathered
wood, and through its gaps, the last light cut into bars.
On the other side — HEX: black hair with the purple
streak, amber eyes catching what light is left, black-and-
purple high-collar jacket, still the way Tyrage is never
still. He has been there a while. Neighbours know things
before they're told.
**ACTION:** Hex looks past the human entirely and
addresses the garden's — the town's — new chosen one
directly, over a fence, at its own height: the first human
besides Mochiko to treat Mochii as the one you talk to.
The challenge is issued politely, precisely, and entirely
for TOMORROW. Mochii, at the foot of a fence it has just
learned is a border, completes a PRESENT pose (Tension —
its first, held properly this time; the pose it never got
to wreck at a ceremony, earned on a road instead) and
answers with a cry that is not small.
**DIALOGUE:** HEX: "So you're the one who answered." /
"Tomorrow, then. The route." — (beat) — "Bring your
assistant. I'll bring mine."
**SUBTITLES:** None — the third slot stays unspent; a
rival's words are words, and words don't get intertitles.
**SFX:** fence-wood cooling, one steady cry. **MUSIC:**
None. Cut on the pose. (Season note: the challenge is a
Route Topaz meeting first — EP03 walks the road; the
sparring payoff lives at EP04, per the season arc. The
button plants; it does not skip the queue.)

## 6. OPEN ITEMS (never filled in silently)
1. Voice casting — Mochiko / Aeon / Hex (carried; EP02 is
   the first human-dialogue episode; casting and recording
   run on the prosody track and do not gate this script).
   Mom, Hex's Mom and the Mover need voices too — same
   track, smaller weight.
2. **The wild creature's species.** Game canon names none —
   the ink says "this wild creature," Sector 0's data has
   no wild table. Its staged sound and silhouette stay
   unresolved until the owner or game data names it. TBD.
3. The capsule/bag system on screen: how a capsule opens,
   what a starter at rest inside one looks like — staging
   held to silhouettes and light until design canon exists.
   TBD.
4. The Mochiioteca's physical design (bible §9.5) — shown
   as light + icons only; Aeon's separate tablet (swept
   display name: "tablet") is a different prop and is not
   designed here either.
5. What the choosing is called in-world, if it has a name.
   The script says "the choosing" descriptively only —
   and this episode's choosing was a rescue; whether the
   world has one word for both shapes is TBD.
6. The unchosen four's keeping: staged as returning to
   their stands in Aeon's lab (aeon_lab.json's layout);
   their longer-term keeping is not stated in the opening
   canon. TBD.
7. Hex's partner ("mine") — unnamed in this episode by
   design. Game data stages a Hex lab battle
   (aeon_lab.json: `hex_lab_battle`) and the season arc
   carries EP09's "Tell Hex his Dorowani is well kept";
   who stands with Hex in EP02 is deliberately not
   decided here. TBD.
8. Starter rig + PRESENT pose build status (Razorgater /
   Tyrage / Kittember / Sproutle presentation under
   pressure; Mochii Reveal + Tension) — staging intent
   until the rigs pass the ROM battery.
9. What stopped moving in the Forest (bible §9.1) —
   untouched by this episode, by design.
10. Runtime confirmation at board pitch (planning total
    ≈ 6:00).
