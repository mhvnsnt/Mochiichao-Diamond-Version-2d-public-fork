# Y2K Anime Game Main Menu — Color, Neurochemistry & Negative Space Research

**Date read:** 2026-10-25. **Confidence note:** The color and neurochemistry mappings below are well-attested as *design heuristics and popular gamification summaries*, not as laboratory proof that a pink star on a menu directly releases a named chemical. The strongest peer-reviewed anchor is dopamine-as-prediction-error, not dopamine-as-pleasure. Treat §4 as a synthesis / recommendation, not a sourced prescription, and A/B-test it.

## Summary

- **Best palette for this menu is pastel, not neon:** white as the dominant field, baby-blue + mint-green as the calm secondary field, bubblegum pink as the bonding/cute accent, soft yellow as the small reward/curiosity accent, lavender-purple for mystery/curiosity. Keep saturated red and orange to ≤2% combined, and never as a large field or for CONTINUE.
- **Best bottom-area treatment is mostly empty:** keep ~75–85% of the white bottom area truly blank, scatter only 12–18 small symbols at low opacity on a golden-ratio / Fibonacci lattice, and let a long, soft fade — not a hard edge — carry the artwork above into white just above CONTINUE.
- **Best feedback is small, fast and variable, not loud:** hover = scale + sparkle + soft chime; one symbol twinkles/changes occasionally; buttons stagger in; idle motion is slow (4–6 s float). That targets anticipation/novelty (dopamine), remembered achievement (serotonin) and cute/belonging (oxytocin) without the overstimulation that red, full saturation, and everything moving at once creates.

---

## Findings

### 1. Color theory for game UI — pink, yellow, blue, green, purple, red, orange → energy, calm, reward, curiosity

Color meaning is **context- and culture-dependent**, not universal. Blue Flamingo warns charts saying “blue = trust, red = urgency” are only tendencies; shade, culture and surrounding elements shift meaning, e.g. red = luck/celebration in much of East Asia vs danger/sale in the UK.
— https://www.blueflamingo.co.uk/the-psychology-of-colour-in-web-design-how-to-choose-the-right-colours/ (index)

Convergent practitioner tables agree on the following tendencies:

| Color | Tendency in published tables | Best menu job | Source |
|---|---|---|---|
| **Pink** | Playfulness, warmth, love, femininity, youth, sweetness, romance | Cute mascot / hearts / stars — oxytocin/belonging accent | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://eight.ictzen.org/blog/article-6.html (index) |
| **Yellow** | Optimism, joy, warmth, attention, cheerfulness; also caution; can feel aggressive at high saturation; poor as a background / white text on yellow is hard to read | Small reward sparkle, “NEW!” / curiosity highlight — never large field, never text on white | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://www.blueflamingo.co.uk/the-psychology-of-colour-in-web-design-how-to-choose-the-right-colours/ (index) |
| **Blue** | Trust, authority, calmness, stability, clarity, technology; world's most universally liked | Calm secondary field, SETTINGS / BACK, sky in the fade | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://eight.ictzen.org/blog/article-6.html (index) |
| **Green** | Growth, nature, health, calmness, success, “go” | Calm + success: CONTINUE sublabel, check/progress tint | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://eight.ictzen.org/blog/color-psychology-in-web-design/ (index) |
| **Purple** | Luxury, creativity, wisdom, mystery, fantasy | Curiosity/mystery accent: one or two lavender symbols, title shimmer | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://eight.ictzen.org/blog/article-6.html (index) |
| **Red** | Energy, urgency, passion, danger, attention, raised pulse; large areas feel aggressive / read as error | **Avoid as field.** At most a tiny warning/error dot. See §1.1 | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://www.blueflamingo.co.uk/the-psychology-of-colour-in-web-design-how-to-choose-the-right-colours/ (index) |
| **Orange** | Enthusiasm, warmth, creativity, high energy; good for click-through, cheap if overused | Tiny CTA warmth on hover only, not a competing button color | https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ ; https://eight.ictzen.org/blog/article-6.html (index) |
| **White** | Cleanliness, clarity, minimalism, openness, breathing room | Dominant field — this menu's bottom area | https://eight.ictzen.org/blog/article-6.html (index) |

**Mapping to the four requested states (synthesis, not a one-to-one lab finding):**
- **Energy:** red/orange/yellow — warm, advancing colors. Use in *tiny* doses; pastel pink + yellow give Y2K energy without red's arousal cost.
- **Calm:** blue/green (and lavender-purple in its soothing reading). Cooler colors recede visually, warmer colors advance — a standard visual-weight rule.
  — https://d.edurev.in/t/504288/Color-Harmony (index)
- **Reward:** yellow + green in UI convention (yellow = highlight/discount, green = success/go), amplified by sparkle/animation, not by hue alone (§2).
- **Curiosity:** purple (mystery/fantasy) + yellow (attention) + novelty/variation (§2). No single hue “causes” curiosity; it is purple/yellow + an unexpected, partially hidden element.

#### 1.1 Red, arousal and anxiety — the peer-reviewed caution

Elliot & Maier's Color-in-Context theory (Annu. Rev. Psychol. 2014, 65:95–120), as summarised in peer-reviewed work, posits red in achievement contexts is associated with failure and danger and evokes avoidance motivation, undermining performance on challenging tasks requiring mental manipulation/flexibility; blue is associated with openness/peace and approach motivation, and blue/green may benefit creative performance. A Frontiers study of red vs blue vs grey similarly reports red enhanced only simple detail-oriented performance, while blue improved difficult detail-oriented and creative tasks, consistent with high arousal (red) helping simple tasks and harming difficult ones under Yerkes–Dodson.
— https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00784/pdf (index, peer-reviewed journal PDF)

**Implication:** a main menu is a low-stakes choice, not an exam, so red will not “fail” the player — but a large saturated red field, red button, or red pulsing animation is the highest-arousal, highest-risk choice for anxiety, error-reading, and hostility/dominance appraisal in the Elliot literature. Reserve red for genuine danger/delete, and use pink (red desaturated + white) for warmth instead.

#### 1.2 Y2K-specific palette

Y2K is defined by chrome/metallic + candy brights + soft pastels: bubblegum pink, baby/cyber blue, aqua, tangerine, glitter, hearts, butterflies, multichrome gradients flowing like an oil spill.
— https://webflow.com/blog/y2k-aesthetic (index); https://mycleverai.com/y2k-color-palette (index)

Webflow's modern correction matters for this menu: early-2000s designers used candy brights “often without neutral buffers”; today, “when the layout is clear, the color can be loud” and candy-bright work should be given *more room to breathe than designers did in 2000* and balanced with clean type. That is exactly the white bottom area's job: it is the neutral buffer Y2K originally lacked.

**Proportion rule:** 60-30-10 — 60% dominant (here: white/off-white), 30% secondary (baby-blue/mint panels, text), 10% accent (pink/yellow/purple highlights, CTAs). It is a composition heuristic, not an accessibility standard, and accent works *because* it is rare; overuse kills its power.
— https://mockitt.com/ui-ux-design/60-30-10-color-rule.html (index); https://d.edurev.in/t/504288/Color-Harmony (index)

For this menu, translate 60-30-10 as: ~60% white, ~30% pastel blue/green/pink artwork + button surfaces, ~10% saturated accent (yellow sparkles, pink hearts, one purple star). Saturated hues should be <10% of the *bottom* area specifically — see §4.

---

### 2. Neurochemistry in game design — dopamine, serotonin, endorphins, oxytocin via visual design, color, animation, UI feedback

**Framing caveat (important):** The DOSE framework below comes from gamification writing, not from measuring a player's blood/hormones while looking at a menu. Game Developer itself says the author is “not even going to pretend to be an expert” and the functions listed are only those relevant to gamification.
— https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live, 2026-10-25)

#### 2.1 Dopamine — reward *anticipation*, variable rewards, novelty

- **Not pleasure after reward; motivation before it.** Dopamine is released in anticipation of a reward (incentive salience), drives action, and supports associative learning. Novel activity triggers dopamine, creating a higher motivational state that fuels engagement.
  — https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live)
- **Peer-reviewed mechanism — reward prediction error (Schultz et al.).** Dopamine neurons initially fire to an unexpected reward, then, once learned, fire to the *predictive cue* instead and fall silent for a fully predicted reward; if a predicted reward is omitted, firing pauses below baseline. Formally: response ≈ reward occurred − reward predicted.
  — https://pmc.ncbi.nlm.nih.gov/articles/PMC4092011/ (index, PMC review of Schultz/Dayan/Montague work)
- **Design translation:** variable (intermittent) outcomes produce stronger spikes than fixed ones; small, frequent rewards shorten the feedback loop; flashing animations, sounds and progress indicators amplify emotional tagging.
  — https://outof.games/news/8781-how-micro-rewards-drive-the-dopamine-cycle-in-mobile-apps/ (index)
- **Early feedback matters:** early interactions must give short-term hits — a satisfying click, a quick win, an immediate rewarding animation — not only long-term rewards, or players leave before investing.
  — https://www.moxuprojects.com/post/how-to-understand-game-design-a-behavioral-perspective (index)
- **Variable-ratio caution:** Skinner's variable-ratio schedule is the most persistent because prediction error never stabilises — the brain keeps trying to crack a pattern that isn't there. That is powerful and ethically loaded: use *mild* variability (which symbol twinkles, which sparkle color) on a menu, not loot-box-style withholding.
  — https://theartofbehavior.substack.com/p/montessori-skinner-and-dopamine (index, popular synthesis)

**Visual/UI triggers for a menu:** a hover that *promises* something (glow + lift + preview shimmer), a NEW GAME button that hints at unseen content, a symbol that occasionally changes, a progress bar / “Continue” that previews the next chapter — all cues, not payouts. A fully predictable, static menu gives no prediction error and feels dead; a menu that promises a different surprise every second feels like a slot machine.

#### 2.2 Serotonin — achievement, status, calm

- Triggered when you feel wanted, important and proud, e.g. thanked or having achieved something requiring true effort; low when feeling unappreciated/worthless. In gamification: record achievement (badges/trophies) so remembering past success re-triggers the feeling, and let users thank/kudos each other.
  — https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live)
- Same point in other gamification summaries: “the badge cabinet lets learners get a serotonin rush on demand whenever they look at rewards they have earned,” because serotonin is triggered by remembering past successes.
  — https://elearningindustry.com/gamification-in-online-learning-neuroscience (index)
- **Calm link is indirect:** serotonin is described as a mood regulator contributing to well-being/calmness, and consistent, positive, stress-relieving play is said to support it, whereas stressful/frustrating play disrupts it.
  — https://achivx.com/do-video-games-increase-serotonin-2/ (index, low-authority summary — treat as heuristic only)

**Visual/UI triggers for a menu:** CONTINUE is the serotonin button — it *is* the remembered achievement. Show, in small calm type, what continuing means (chapter, playtime, last badge) rather than a bare label; use blue/green, generous spacing, and a steady (not flashing) selected state. Status should be quiet pride, not a leaderboard shouting on the title screen.

#### 2.3 Endorphins — play, movement, humour

- Natural opioids: euphoria / “second wind,” reduced pain/fatigue under stress. In games, overcoming challenges stimulates endorphins and a sense of achievement; gamification advice is to create challenges requiring skill/effort, not rewards for merely clicking buttons, to earn *fiero* (triumph).
  — https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live)
- Play/laughter summaries add: the thrill/excitement of play releases endorphins, which lower stress/anxiety and can create euphoria.
  — https://elearningindustry.com/gamification-in-online-learning-neuroscience (index)

**Honest limit for a menu:** a menu cannot deliver endorphins by itself — there is no challenge overcome yet. What it *can* do is (a) promise a challenge worth overcoming (CONTINUE preview), (b) use playful micro-motion — squash-and-stretch button press, a mascot hop, a witty hover line — and (c) avoid frustrating the player before play starts (clear labels, no dead clicks). Do not claim a bouncing star “releases endorphins”; claim it sets up playful affect and a satisfying press.

#### 2.4 Oxytocin — social bonding, cute characters, belonging

- Key to bonding (mother–baby, lovers, friends), contentment, trust in groups and altruism; released when engaged with a strong narrative/empathy, and by social/altruistic systems (giving, thanking, sharing).
  — https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live)
- In games specifically: character-driven / narrative-led games release oxytocin as players form affinity/kinship with characters; multiplayer cooperation/shared accomplishment adds bonding.
  — https://www.growthengineering.co.uk/the-science-behind-game-based-learning/ (index)
- **Cute as a bonding trigger — baby schema (Lorenz, Kindchenschema):** large head relative to body, high protruding forehead, large eyes below the skull midline, chubby cheeks, small nose/mouth, short thick limbs, plump soft body are perceived as cute/cuddly and elicit caretaking / pro-social affiliative behaviour.
  — https://pmc.ncbi.nlm.nih.gov/articles/PMC11285920/ (index, Proc. R. Soc. B review)
- Kawaii summaries extend this: those features (oversized head, tiny limbs, exaggerated proportions) activate reward/bonding responses and improve careful, attentive behaviour in classic cute-image experiments (Nittono et al. puppy/kitten → better fine-motor performance).
  — https://www.alibaba.com/product-insights/why-do-people-love-kawaii-aesthetics-psychology-behind-cute-culture-obsession.html (index, popular summary — the Nittono finding itself is peer-reviewed, the oxytocin claim is popularisation)

**Visual/UI triggers for a menu:** one (not ten) cute mascot/face in the artwork or as a scattered symbol with baby-schema proportions, looking toward the buttons; paired symbols (two hearts, a mascot + small companion) rather than isolated icons; a warm welcome-back line (“Welcome back!”) under CONTINUE. Belonging is cued by *relationship* (face, pair, name, return), not by scattering many cute things.

#### 2.5 How animation / UI feedback (“juice”) ties it together

“Juice” = getting as much output as possible out of every input: a coin doesn't just disappear, it pops, bursts into sparks, makes the character hop and bumps the score; particles confirm something happened and make the world react; small, fast, short-lived usually works best.
— https://www.manuelsanchezdev.com/blog/game-feel-principles-animated-godot (index); https://garden.bradwoods.io/notes/design/juice (index)

In UI terms: a press that flashes and throws a handful of sparks confirms the tap instantly; reward bursts (coins/stars popping) *are* the visible reward loop; silent buttons read as broken.
— https://nixiefx.com/pixijs-particle-effects/ (index)

**Timing rules distilled from juice + dopamine literature:** feedback <~200 ms after hover/press; burst duration 300–600 ms; squash/stretch 100–150 ms; idle motion slow and continuous; celebration only on real actions (press/confirm), not on idle. Everything celebratory all the time habituates and stops being a prediction error.

---

### 3. Negative space / white space in UI — filling bottom negative space without clutter, fade gradients, scattered elements, golden ratio

#### 3.1 White space is active, not empty

White space (negative space) is the empty area around and between elements — text, images, buttons, logos. It does not have to be white or solid: “a gradient background behind a headline is white space,” as is the gap between logo and navigation.
— https://www.manypixels.co/blog/web-design/white-space (verified live, 2026-10-25)

It buys readability, attention on the CTA (“give a CTA room and it stops competing”), visual hierarchy, and a premium feel. Nielsen Norman Group is cited for users leaving in 10–20 s and reading ~20% of words, so spacing buys the seconds you get. The test for any gap: it should improve readability *or* direct attention; if it does neither, tighten it. The fastest fix for a cluttered page is usually to *remove* elements and add space, not add more.
— https://www.manypixels.co/blog/web-design/white-space (verified live)

Other guides agree: resist filling every inch; ask “what is essential?”; use space to guide the eye; backgrounds/gradients used as negative space “should not compete with your main subjects — they should complement and enhance, not distract.”
— https://playbook-at.ghost.io/p/blog/the-ultimate-guide-to-using-space-as-an-element-of-design/ (index)

**For this menu:** the large white bottom is not a problem to solve by filling it. It is the macro white space that makes CONTINUE readable and premium. The design goal is to *activate* 15–25% of it, not fill it.

#### 3.2 Fade gradients — how to dissolve an edge without a line

A fade works because it *is* white space: a gradient from artwork color to white, with no hard border, lets the eye travel down without a stopping point. Practical rules from the sources + standard CSS practice (presented as technique, not a cited study):
- Make the fade **long and eased**, not a 20 px blur: a hard or short fade reads as a mistake / a cut-off image.
- Fade **to the exact background white** (not to transparent over a different color, which bands/greys), and dither / use a multi-stop gradient to avoid banding on large flat areas.
- Put the **fully-white point above the interactive zone** (here: just above CONTINUE), so buttons sit on 100% white with full contrast — never put button text on a mid-fade tint.
- Keep the fade's top fully opaque behind the logo, so the logo keeps its contrast and the fade reads as “artwork dissolving into air,” not “artwork cropped.”

This matches the mission's described direction (fade starts just above CONTINUE, rises behind the logo, fades into white going down) — implemented as a vertical mask/gradient whose opacity is 100% at the logo and 0% just above CONTINUE.

#### 3.3 Scattered decorative elements — density, size, opacity rules

No source gives a lab-tested “symbols per square inch” for a game menu. The defensible rules are from clutter/cognitive-load and visual-weight literature:
- If users can't identify the main action in ~3 seconds, or you count more than ~5–6 colors on a home screen, you've gone too far; the 5-second test (show, hide, ask what to do) is the check.
  — https://weareaffective.com/learning-centre/how-do-i-know-when-my-design-has-too-much-going-on (index)
- Too many vying colors = visual clutter; when every button/background demands attention, the message is lost; use a minimal palette, complementary colors, contrast not chaos.
  — https://618media.com/en/blog/overstimulation-balancing-complexity-in-web/ (index)
- Cognitive overload in digital spaces is triggered by lots of different colors, many things moving at once, lots of similar buttons/links, and cluttered/busy backgrounds; mitigation is clear large text, strong contrast, plenty of white space, simple layouts, and avoiding multiple moving graphics without a pause option.
  — https://www.kirklees.gov.uk/beta/website-standards/cognitive-overload.aspx (index)
- Low-saturation colors reduce cognitive load vs highly saturated hues; soft blues/greens/neutrals create calm; cooler colors recede, warmer advance; 60-30-10 balances interest without overwhelming.
  — https://www.freshkit.co.uk/visual-overstimulation-prevention-vacuum-storage-that-reduces-visual-clutter/ (index, general design summary)

**Translated density rule (§4 gives numbers):** scattered symbols should be *background*, not content: small, low-opacity, non-interactive, never under/over button text, never in a grid (grids read as UI), and never all the same size/opacity (uniform scatter reads as wallpaper/confetti and raises chromatic density).

#### 3.4 Golden ratio placement — useful guide, not a law

φ ≈ 1.618. A layout 1,000 px wide × 618 px tall is a golden rectangle; splitting 960 px gives 593 px + 367 px; splitting by 61.8% / 38.2% gives the same. Type scales multiply by 1.618 (16 px → 26 px → 42 px). The golden spiral's focal point is a natural place for a key element.
— https://www.elegantthemes.com/blog/design/the-golden-ratio-the-ultimate-guide-to-understanding-and-using-it (index); https://copyprogramming.com/howto/what-is-the-numeric-golden-ratio (index)

For *scattered* symbols, the useful golden-ratio tools are not a single spiral endpoint but:
1. **Fibonacci sizes:** 8, 13, 21, 34 px (or scaled equivalents) — sizes that feel related without being identical.
2. **Fibonacci / φ-lattice scatter:** place symbols by stepping around a center by the golden angle (~137.5°) with radius growing by √n — the sunflower pattern. It looks “random” but evenly distributed, with no clumps or empty corners, and no grid.
3. **61.8 / 38.2 anchors:** put the largest/densest cluster at a φ point (e.g. 61.8% across, 38.2% down the bottom area) and let density fall off from there, rather than centering everything.
4. **Caveat:** treat φ as a guiding proportion toolkit, not a strict law; a fixed ratio does not survive narrow screens, and resemblance to φ is not proof of beauty.
   — https://copyprogramming.com/howto/what-is-the-numeric-golden-ratio (index); https://bluebeaconcreative.com/blog/how-to-bring-balance-in-your-designs-using-the-golden-ratio-a-beginners-guide (index)

---

### 4. Practical application — concrete design recommendation for THIS menu

**Given layout (from mission):** title logo at top, artwork behind it, a vertical fade that starts just above CONTINUE and rises behind the logo fading into white going down, then CONTINUE / NEW GAME / SETTINGS / BACK stacked, then a large white bottom area to be filled with random golden-ratio scattered symbols.

#### 4.1 Layer stack (top → bottom)

1. **Logo + artwork (top ~40%):** full-color Y2K artwork, chrome/bubblegum pink + baby-blue multichrome. Logo in high-contrast white/dark outline so it survives the fade.
2. **Fade zone (next ~20–25% of screen height):** vertical gradient/mask, 100% opaque at logo → 0% (pure white) at a line ~16–24 px *above* CONTINUE. Use an eased (ease-out) multi-stop gradient, not linear, so the last 30% of the fade is almost white — no visible band where buttons begin.
3. **Button zone:** CONTINUE / NEW GAME / SETTINGS / BACK on 100% white, generous vertical gaps (at least 1× button height between groups, 0.5× between buttons), left- or center-aligned consistently. No symbols behind or overlapping button text.
4. **Bottom white zone (remaining ~35–45%):** scattered symbols only, at the density in §4.3. No new text, no new buttons, no footer clutter here.

Do **not** reverse the fade (white at top, color at bottom) — it would pull the eye away from the logo/buttons toward the bottom, and put the highest-contrast edge under the buttons where the hand needs calm.

#### 4.2 Color spec (recommendation — hexes are designer choices illustrating the sourced palette, not sourced facts)

| Role | Color (illustrative) | Proportion | Job |
|---|---|---|---|
| Dominant field | Off-white `#FFF9FC`–`#FFFFFF` (warm-white, not blue-grey) | ~60% of screen | Calm, premium, button contrast |
| Secondary | Baby blue `#A8D8F0`, mint `#B8E6C8`, blush pink `#FFD6E8` | ~30% combined | Fade + button surfaces + soft symbols |
| Accent — reward/curiosity | Butter yellow `#FFE066` (sparkles only), lavender `#C9B6FF` (1–2 stars) | ~5% | Dopamine/curiosity highlight |
| Accent — bonding | Bubblegum pink `#FF7AB8` (hearts, mascot cheeks) | ~5% | Oxytocin/cute accent |
| Avoid / reserve | Saturated red `#E53935`, saturated orange `#FF6B00` | 0% field, <2% total, only for error/delete or a single hover glow | High arousal, error-reading |

**Button colors:** CONTINUE = pink gradient or blue with white text (primary, highest contrast); NEW GAME = white with pink/blue outline (secondary); SETTINGS / BACK = quiet grey-blue text buttons, no fill. Never make all four buttons different saturated colors — that is the “every button highlighted” clutter pattern.
— https://618media.com/en/blog/overstimulation-balancing-complexity-in-web/ (index)

**Serotonin detail on CONTINUE:** add a tiny sublabel in muted blue-grey, e.g. “Ch. 3 · 6h 12m · ★ Last badge: Star Collector” — small, calm, non-flashing. This is the remembered-achievement cue (§2.2). If there is no save, CONTINUE should be dimmed/disabled, not removed, so returning players still see their status.

**Oxytocin detail:** one small cute mascot face (baby-schema: big eyes, round cheeks) peeking from the artwork edge *or* as the single largest bottom symbol, looking toward CONTINUE. Add a paired element (mascot + tiny companion star/heart) — belonging reads as relationship. Do not add a second mascot in the bottom scatter; one face is a character, many faces are wallpaper.

#### 4.3 Bottom scatter — density, sizes, opacity, placement (recommendation)

- **Count:** 12–18 symbols total on a 1080p-class menu (scale down to 8–12 on small/mobile screens). Fewer, larger symbols beat many tiny ones: each symbol must be individually noticeable on a 5-second glance, or it is noise.
- **Coverage:** symbols cover **~10–15% of the bottom area's pixels**; **75–85% stays pure white**. If you screenshot, blur your eyes, and see a pattern rather than white, you have too many.
- **Sizes (Fibonacci, scaled to screen):** 2 large (32–40 px), 4–5 medium (20–26 px), 6–11 small (10–16 px). Large = hero star/heart/mascot; medium = moons, butterflies, music notes; small = dots, 4-point sparkles, tiny hearts.
- **Opacity by distance from buttons:** nearest the buttons: 15–25% opacity, smallest sizes only (a “breathing halo” of ~40–60 px with *no* symbols directly under BACK). Mid/bottom: 30–50% opacity. The 2 large symbols: 60–80% opacity, placed at φ points (see below), never within button column width.
- **Placement — golden-ratio scatter, not random, not grid:** use a φ-lattice (golden-angle ~137.5° steps, radius ∝ √n) centred at 61.8% across / 38.2% down the bottom zone, jittered ±10–15% so it feels hand-scattered. Enforce a minimum gap of ~1.5× the larger symbol's size between any two symbols, and a clear vertical “button corridor” (the full width of the button stack, extended down) with only the faintest small sparkles in it.
- **Palette of symbols:** pink hearts/stars (bonding), yellow sparkles (reward), lavender stars/moons (curiosity), baby-blue butterflies/notes (calm). **No red symbols, no orange symbols** in the scatter — warm accent is already carried by yellow; red/orange in the periphery reads as alerts.
- **Rotation:** vary rotation in Fibonacci-like steps (e.g. 0°, 21°, 34°, 55°) — enough to feel organic, not enough to feel chaotic.

#### 4.4 Animation — what moves, how fast, what never moves (recommendation)

| Element | Motion | Why / neuro link |
|---|---|---|
| Buttons on hover/focus | Scale 1.03–1.05, soft glow, 120–180 ms ease-out; on press, squash 0.97 + 4–6 sparkles bursting 300–500 ms + soft chime | Juice + dopamine cue: immediate, short-lived feedback that the input registered |
| Buttons on load | Stagger in: CONTINUE first, then others at 60–90 ms intervals, rising 8 px + fading in | Anticipation building, hierarchy (CONTINUE is the predicted reward) |
| Bottom symbols (idle) | Only 3–4 symbols drift/float slowly (4–6 s cycle, 4–8 px amplitude, sine ease); all others static | Novelty without overload; slow motion = calm, not alarm |
| Variable twinkle | Every 3–7 s (randomised, not metronomic), *one* small symbol twinkles (opacity/scale pulse 400 ms) or briefly changes (star → heart → star, once per menu visit at most) | Variable-ratio novelty / prediction error in miniature — the only “surprise” on the menu |
| Mascot | Blink every 4–6 s, tiny hop on CONTINUE hover only | Baby-schema + play; tied to the player's action, not autonomous noise |
| **Never** | All symbols bouncing, any symbol flashing >2 Hz, red pulsing, autoplay sound, parallax that moves buttons | Overstimulation, cognitive overload, photosensitivity risk, and habituation — see §4.5 |

Respect `prefers-reduced-motion`: with it on, all idle/twinkle motion off, hover = color change only, no sparkle burst.

#### 4.5 What to avoid — checklist

1. **Filling the white.** More symbols, a patterned background, or a second artwork panel in the bottom area will make the menu feel cramped and hide CONTINUE. White space is the premium signal.
2. **Saturated red / orange fields, red buttons, red pulsing.** Highest arousal, error/danger reading, avoidance motivation (§1.1). Use pink/yellow instead.
3. **High-saturation everything.** Y2K candy brights need a neutral buffer; without white, they read as cheap/cluttered, not nostalgic.
4. **Yellow text on white, light-grey text on white, red-on-green.** All fail contrast/readability; yellow is for filled sparkles, not text.
5. **Uniform, grid, or edge-to-edge scatter.** Reads as wallpaper, raises chromatic density, and competes with buttons.
6. **Symbols overlapping buttons, or a hard fade edge through button text.** Buttons must sit on 100% white; the fade must finish above them.
7. **Constant celebration.** If every hover is fireworks and every symbol sparkles, nothing is a reward signal anymore — dopamine habituates to predicted rewards (§2.1). Save the big burst for actually pressing CONTINUE/NEW GAME.
8. **Promising what the game doesn't deliver.** A menu that teases a cute companion, a trophy, or a “new” badge that isn't in the game creates a negative prediction error (predicted reward omitted → disappointment) on first play.
9. **Loot-box mechanics on a menu.** Do not make the twinkle a randomised *reward* the player must chase/click; keep it decorative and non-interactive so variability stays playful, not compulsive.
10. **Ignoring culture/accessibility.** Red = luck in China, mourning-white in parts of East Asia; test the pink/blue/white reading with the actual audience, check WCAG contrast (4.5:1 body, 3:1 large/UI), and never use color alone to signal state (pair with icon/text).

#### 4.6 Quick test before shipping

- **5-second test:** show the menu 5 s, hide it, ask: what game is this, and what should you press first? If the answer isn't logo + CONTINUE, remove symbols until it is.
  — https://weareaffective.com/learning-centre/how-do-i-know-when-my-design-has-too-much-going-on (index)
- **Squint test:** blur/squint — you should see logo → buttons → one hero symbol, in that order. If bottom symbols win, lower opacity/count.
- **Motion test:** watch 30 s idle — you should notice at most 1–2 twinkles. If you count more, slow the interval.
- **Contrast test:** button text on white ≥4.5:1; decorative symbols exempt, but any symbol that looks clickable must not be clickable-looking (no button shape/shadow).

---

## Could not verify

- **No lab study was found that measures dopamine/serotonin/oxytocin/endorphin release from a specific menu color, symbol density, or fade length.** The DOSE-to-visual mapping in §2/§4 is a design synthesis from gamification literature + reward-prediction neuroscience, not a dose–response finding. Any claim stronger than that would be overclaiming.
- **No source gives a validated “ideal” symbol count or opacity % for a game menu bottom area.** §4.3 numbers are recommendations derived from clutter/60-30-10/white-space principles, not cited thresholds — validate with the 5-second/squint tests above.
- **No peer-reviewed source was found specifically on golden-ratio scatter for decorative UI elements** (vs layout/type). The φ-lattice in §4.3 is a standard generative technique applied by analogy to the layout/type φ literature.
- **GDC-talk specifics** on this exact topic were not retrieved as primary transcripts; juice principles are cited via Jonasson & Purho (“Juice It or Lose It”) as summarised in secondary sources. Schell's *Art of Game Design* and similar books were not directly quoted here — do not cite them as verified for this report without re-checking.

## Sources

*Verified live = opened and read in full via browser on 2026-10-25. Index = search-result text only.*

- Color tables — https://www.designstudiouiux.com/blog/color-psychology-in-web-design/ (index)
- Color tendencies/caveats — https://www.blueflamingo.co.uk/the-psychology-of-colour-in-web-design-how-to-choose-the-right-colours/ (index)
- Color table — https://eight.ictzen.org/blog/article-6.html (index)
- DOSE gamification — https://www.gamedeveloper.com/business/4-important-neurotransmitters-in-gamification (verified live)
- Dopamine prediction error — https://pmc.ncbi.nlm.nih.gov/articles/PMC4092011/ (index)
- Micro-rewards / variable rewards — https://outof.games/news/8781-how-micro-rewards-drive-the-dopamine-cycle-in-mobile-apps/ (index)
- Early dopamine feedback — https://www.moxuprojects.com/post/how-to-understand-game-design-a-behavioral-perspective (index)
- Serotonin/badge cabinet — https://elearningindustry.com/gamification-in-online-learning-neuroscience (index)
- Serotonin/calm summary — https://achivx.com/do-video-games-increase-serotonin-2/ (index, low authority)
- Oxytocin/character bonding — https://www.growthengineering.co.uk/the-science-behind-game-based-learning/ (index)
- Baby schema — https://pmc.ncbi.nlm.nih.gov/articles/PMC11285920/ (index, peer-reviewed review)
- Kawaii/baby-schema popular summary — https://www.alibaba.com/product-insights/why-do-people-love-kawaii-aesthetics-psychology-behind-cute-culture-obsession.html (index)
- Red/blue cognition — https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00784/pdf (index, peer-reviewed)
- Juice / game feel — https://www.manuelsanchezdev.com/blog/game-feel-principles-animated-godot (index); https://garden.bradwoods.io/notes/design/juice (index); https://nixiefx.com/pixijs-particle-effects/ (index)
- White space — https://www.manypixels.co/blog/web-design/white-space (verified live)
- Negative-space guidance — https://playbook-at.ghost.io/p/blog/the-ultimate-guide-to-using-space-as-an-element-of-design/ (index)
- Golden ratio — https://www.elegantthemes.com/blog/design/the-golden-ratio-the-ultimate-guide-to-understanding-and-using-it (index); https://copyprogramming.com/howto/what-is-the-numeric-golden-ratio (index); https://bluebeaconcreative.com/blog/how-to-bring-balance-in-your-designs-using-the-golden-ratio-a-beginners-guide (index)
- 60-30-10 — https://mockitt.com/ui-ux-design/60-30-10-color-rule.html (index); https://d.edurev.in/t/504288/Color-Harmony (index)
- Overstimulation/clutter — https://618media.com/en/blog/overstimulation-balancing-complexity-in-web/ (index); https://weareaffective.com/learning-centre/how-do-i-know-when-my-design-has-too-much-going-on (index); https://www.kirklees.gov.uk/beta/website-standards/cognitive-overload.aspx (index); https://www.freshkit.co.uk/visual-overstimulation-prevention-vacuum-storage-that-reduces-visual-clutter/ (index)
- Y2K aesthetic — https://webflow.com/blog/y2k-aesthetic (index); https://mycleverai.com/y2k-color-palette (index)
- Variable-ratio synthesis — https://theartofbehavior.substack.com/p/montessori-skinner-and-dopamine (index)

## Page instructions not followed

None encountered. No page content instructed a change of mission; all pages were treated as source material only.


---

## Lab studies added 2026-10-26 (UI lane research finish)

The five closest lab studies, added as a complete edit on 2026-10-26. This section only appends; it changes no existing recommendation, number, or threshold above.

## Standing caveat (keep verbatim, at the top of the added section)

> No lab study measures neurotransmitter release from a specific menu colour,
> menu density, or fade. The studies below measure neurotransmitter-related
> signals during gameplay, rewarded play, animal interaction, or group singing
> — not during menu use. Every design recommendation drawn from them is
> principled, not validated: it is a hypothesis to A/B-test (for example,
> menu variant A vs. variant B on time-to-first-action, return rate, and
> self-reported calm / excitement), not a proven threshold. Do not quote any
> number below as "the amount of dopamine / oxytocin / serotonin / endorphin
> a menu colour produces."

## Study 1/5 — Dopamine during gameplay (Koepp et al., 1998)

What was actually done: 8 male volunteers played a goal-directed video game
(steering a tank around an arena to collect flags for a monetary incentive)
during a [11C]raclopride PET scan, and looked at an empty screen during a
second scan (order randomised). Reduced raclopride binding in the striatum
during play, versus baseline, was read as increased endogenous dopamine
release; the reduction correlated with performance level and was greatest
in the ventral striatum.

What it does NOT show: anything about a colour, a menu, a symbol count, or
a fade. The task was goal-directed play with a monetary incentive, not
looking at a title screen.

Design bridge (principled, to A/B-test): dopamine tracks anticipation and
performance during goal-directed play, so the menu's job is to set up the
next goal cleanly (a visible next step, a reward cue such as yellow sparkles
before play) rather than to deliver the reward itself. Test: does a menu
with one clear next-step cue shorten time-to-first-action versus a menu
with several competing cues?

Full citation: Koepp, M. J., Gunn, R. N., Lawrence, A. D., Cunningham, V. J.,
Dagher, A., Jones, T., Brooks, D. J., Bench, C. J., & Grasby, P. M. (1998).
Evidence for striatal dopamine release during a video game. Nature, 393(6682),
266–268. https://doi.org/10.1038/30498 (PMID 9607763).

## Study 2/5 — Dopamine during rewarded Tetris, and its return to baseline (Kim et al.)

What was actually done: 7 healthy, right-handed, non-smoking volunteers were
scanned with [11C]raclopride PET for 120 minutes (50 minutes resting, 40
minutes playing Tetris, 30 minutes resting), receiving a bolus plus constant
infusion of the radioligand. During play they were periodically rewarded
with unpredictable monetary amounts for improved performance. Striatal
binding (V3′) fell during play versus baseline — caudate −15 ± 6%,
putamen −30 ± 10% — indicating increased dopamine release, and it rose
gradually back toward baseline during the 30 minutes after play ended.
The size of the fall correlated with task performance.

Accuracy note: this record is a conference-abstract record, not a
peer-reviewed journal article as retrieved (OSTI / IAEA records for the
2002 Asia-Oceania Congress of Nuclear Medicine and Biology abstract, with
a 2004 re-listing). Cite it as such; do not invent a journal, volume, or
page range for it. Its numbers are the most-cited Tetris figures in the
existing report, and they survive here only with that provenance flag.

What it does NOT show: anything about a colour or a menu. The reward was
unpredictable money for performance in an active game, and the signal
returned toward baseline after play stopped.

Design bridge (principled, to A/B-test): unpredictable, performance-linked
rewards during play — not static menu decoration — are what the dopamine
record actually tracks, and the signal decays after play. So a menu should
not be asked to "hold" a dopamine state; it should hand off to play quickly
and let play carry the reward. Test: does a shorter menu-to-play path
change session length versus a menu that lingers on reward art?

Full citation: Kim, S. E., Cho, S. S., Choe, Y. S., Lee, S. Y., Kang, E., &
Kim, B. T. Temporal changes of striatal dopamine release during and after
a video game with a monetary reward: A PET study with [11C]raclopride
continuous infusion. Conference abstract, 8th Asia-Oceania Congress of
Nuclear Medicine and Biology (2002); OSTI record 20400383.
https://www.osti.gov/etdeweb/biblio/20400383

## Study 3/5 — Oxytocin and serotonin during dog interaction (Santaniello et al., 2025)

What was actually done: 30 dialysis patients with chronic kidney disease
(15 men, 15 women) were divided into two experimental groups and one
control group. The experimental groups received weekly animal-assisted
activity sessions with a dog–zootherapist–vet pair for 3 months (12
sessions); each session lasted about an hour, with about 40 minutes of
interaction with the dog. Blood samples taken at the start and end of
each session showed that both oxytocin and serotonin increased during
sessions versus the control group, with a progressively increasing effect
between consecutive weeks.

What it does NOT show: that a picture of a creature, a mascot on a menu,
or a colour raises blood oxytocin or serotonin. The intervention was
40 minutes of live interaction with a real dog, in person, repeated
weekly for 3 months, in patients on dialysis — a specific, high-contact,
clinical setting.

Design bridge (principled, to A/B-test): bonding cues in the game should
mimic interaction, not just appearance — a mascot that reacts, is petted /
fed / played with in the Garden, and remembers the player across sessions
is closer to the studied intervention than a static cute image. Test:
does an interactive mascot greeting on return (versus a static mascot
image) change return rate over 2 weeks?

Full citation: Santaniello, A., Perruolo, G., Amato, A., Garzillo, S.,
Mormone, F., Morelli, C., Formisano, P., Sansone, M., Fioretti, A., &
Oriente, F. (2025). Animal assisted activities (AAAs) with dogs in a
dialysis center in Southern Italy: Evaluation of serotonin and oxytocin
values in involved patients. Biomedicines, 13(12), 2944.
https://doi.org/10.3390/biomedicines13122944 (PMID 41462956).

## Study 4/5 — Cat–owner oxytocin correlation and proximity (Takagi et al., 2026)

What was actually done: 19 owners and 29 pet cats were followed for one
month. Cats wore Bluetooth beacons that estimated physical proximity to
the owner's phone; urine samples from both cats and owners were assayed
for oxytocin and cortisol, and owners completed mood questionnaires.
Owners' and cats' urinary oxytocin concentrations were positively
correlated; higher oxytocin in cats was associated with lower cortisol
and fewer negative feelings in owners, and owners whose cats stayed
closer scored higher on vigour/activity. Hormone comparisons rested on
24 cats whose urine could be collected and their 17 owners.

Accuracy notes, kept with the citation: the authors report associations,
not cause and effect — the study does not establish whether happier
owners make cats happier or vice versa, and the household-level analysis
kept only the links between cat oxytocin and owner confusion/anxiety.
Closeness was measured by beacon signal strength, not by minutes together,
and the "positive mood" link was specifically vigour/activity, not every
positive-mood measure. Years of ownership did not reliably predict mood
once multi-cat households were accounted for.

What it does NOT show: that a game creature, a colour, or a menu raises
oxytocin in either party. The bond studied is a live, physical,
petting-and-proximity relationship over a month.

Design bridge (principled, to A/B-test): proximity and repeated contact
beat ownership duration — so the game should reward daily return and
close interaction (Garden visits, petting/feeding loops) rather than
collection size alone. Test: does a daily-proximity streak (versus a
collection-count display) change 7-day return rate?

Full citation: Takagi, S., Tsubomura, T., Nagasawa, M., & Kikusui, T.
(2026). Cats and humans show correlated affiliative physiological states.
iScience. Published online 13 October 2026.
https://doi.org/10.1016/j.isci.2026.117934

## Study 5/5 — Group singing, pain threshold as an endorphin proxy (Weinstein et al., 2016)

What was actually done: members of a community choir were tested before
and after 90 minutes of singing, in small groups (n = 20–80) and in a
combined "megachoir" (n = 232). Self-reported social bonding and pain
threshold — used as a proxy assay for central endorphin release, not a
direct endorphin measurement — both increased across rehearsals, and the
pain-threshold effect was comparable in the large and small groups,
while social closeness rose more in the large group (from a lower start).

Accuracy notes, kept with the citation: the paper is Weinstein, Launay,
Pearce, Dunbar, & Stewart (2016) — "Dunbar 2016" in shorthand is Dunbar
as a co-author, not sole author. Pain threshold is a proxy, not a blood
or brain endorphin level, and the activity was 90 minutes of active
group singing, not listening to music (earlier work in the same line
found listening alone did not raise pain threshold).

What it does NOT show: that menu music, a boot chime, or a colour raises
endorphins. The effect tracked active, synchronous group performance.

Design bridge (principled, to A/B-test): endorphin-adjacent design in a
game is about real, effortful, synchronous activity — a hard-won battle,
a co-op / group Garden event, a race — not about a menu sound. Test:
does a synchronous group event (versus the same rewards delivered solo)
change self-reported energy / closeness after play?

Full citation: Weinstein, D., Launay, J., Pearce, E., Dunbar, R. I. M., &
Stewart, L. (2016). Singing and social bonding: Changes in connectivity
and pain threshold as a function of group size. Evolution and Human
Behavior, 37(2), 152–158. https://doi.org/10.1016/j.evolhumbehav.2015.10.002

## What stays unchanged by this edit

- The existing recommendations (75–85% blank bottom area, 12–18 symbols,
  fade to pure white 16–24 px above CONTINUE, pastel Y2K palette, saturated
  red/orange 0% field / <2% total) are NOT validated by any study above and
  are NOT upgraded by this edit. They remain principled design choices to
  A/B-test.
- No study above was run on a menu, a title screen, or a colour. Any
  sentence that implies otherwise is a misreading of this edit.
- Counts after this edit: lab studies added 5/5 = 100% (Koepp 1998, Kim
  Tetris, Santaniello 2025, Takagi 2026, Weinstein/Dunbar 2016).
