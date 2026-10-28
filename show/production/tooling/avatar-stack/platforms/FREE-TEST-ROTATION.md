# Free-Test Rotation — measuring platform quality with OUR cast, daily

Status: STANDING PROGRAMME, 2026-10-28. Purpose: the commercial
platforms' quality gets measured with real footage of the Mochiichao
cast — generated on their free routes, graded by our gates — instead of
vendor demos. This rotation is how the stack-narrowing decision earns
its evidence.

## The rights label (applies to EVERYTHING this rotation produces)

**SCRATCH ONLY.** Every output of every route below is watermarked
and/or non-commercial and/or rights-unclear. None of it ships, none of
it enters an episode composite, none of it is staged as production
material. What transfers is the LEARNING (which engine holds our
characters, at what settings); the footage itself does not. Shipping
routes remain: our own backend (open source) and any paid tier the
owner explicitly chooses.

## The standard test batch (identical on every route)

Per the OWNER-LOCKED method (PRODUCTION-PATTERN.md): per-character
layers, same scene prompt, likeness lock from the reference packs,
plain solid field behind the character (cutout insurance).

1. **Wispkin layer** — pack `wispkin`, Dark Wave action, spine prompt
   from PROMPT-PATTERNS.md, 5–8s.
2. **Dorowani layer** — pack `dorowani`, Water Orb action, same scene
   prompt + timing map, 5–8s.
3. **Composite (ours, never the platform's)** — cutouts via
   white_matte.py over the CURRENT living Gate background (Garden Gate
   v2-living), shadows at composite, per the locked method.
4. **Gates on every output** — frame-1 gate + likeness gate
   (`parity/frame1_gate.py`), pass/fail + SSIM recorded. A wrong
   character FAILS regardless of platform reputation.

## The routes (budgets verified at source, 2026-10-28)

| # | Route | Verified free budget | What the batch costs | Rights | Hands-on |
|---|---|---|---|---|---|
| 1 | **Google Flow** (Veo 3.1 Lite / Omni Flash) | 50 credits/day, every account, no rollover (Google Flow docs; corroborated by Dreamina's own comparison page) | Lite 8s clip = 10cr → both layers = 20cr; Omni Flash 8s = 12cr → 24cr. Leaves room for 1–2 retries | rights UNVERIFIED at source (SynthID invisible mark on all outputs) → scratch only | PENDING-PARENT (running in the owner's browser session) |
| 2 | **Dreamina** (ByteDance) | **120 credits/day for US accounts** (Dreamina's own page; UK 105, AU/ID/JP 225) | Per-generation cost varies by model/duration/resolution and is shown in-app before generating — log the actual charge per clip; do not budget from the paid table | terms reported private/non-commercial on free (secondary claims conflict) → scratch only | PENDING-PARENT (being started the same way) |
| 3 | **Kling** (Elements) | ~66 credits/day reported by multiple Oct-2026 sources; Kling no longer guarantees the figure publicly — log the actual grant at run time | ≈ one short clip/day class at 720p; the Elements consistency method is what is under test here | watermarked + non-commercial (Kling membership pages) → scratch only | PENDING-PARENT (running in the owner's browser session) |
| 4 | **PixVerse** | 30–60 credits/day — Oct-2026 sources CONFLICT (60 signup + 30/day vs 90 signup + 60/day); the in-app number at run time wins | ~25–45cr per clip (third-party measurement) → 1–2 clips/day | watermarked + non-commercial (free-tier terms: outputs "limited to non-commercial purposes") → scratch only | PLANNED (no browser test started) |

Not in the rotation, with reasons:

- **Higgsfield free = 0 credits** (verified in PR #491) — there is
  nothing to rotate. Its free account generates no video.
- **ElevenLabs free tier** — hosts Seedance in ElevenCreative, but the
  video side is paid-gated and the free pool (10,000cr, non-commercial)
  is an audio-scale budget; NOT a Seedance test route (see
  OPEN-STUDIOS-AND-PROMPT-ENGINES.md §7).
- **The Dreamina $0.29 first-month promo** — REAL (Dreamina's own sale
  pages: sale from 2026-10-21, eligible US users, Basic first month
  $0.29, 1,575 shared credits, renews at $15/month, advertised deadline
  Oct 30; at 720p the allowance prices Seedance 2.5 at 37cr/s, 2.0 at
  17cr/s, Fast 8cr/s, Mini 5cr/s). It is a PURCHASE — recorded here as
  an owner decision only; the rotation itself never buys it.

## Dreamina free tier — what it actually serves (verified)

Dreamina's own page documents the free-reliable workflow as **Seedance
2.0** (image-led clips with sound, 4–15s, image + audio references).
Seedance 2.5 "adds reference-led production controls… **where
available**" and Dreamina explicitly warns this "should not be read as
a promise that every free account receives every 2.5 mode." Practical
reading, agreeing with the owner's pasted note: **on the free tier,
plan around Seedance 2.0; treat any 2.5 access as a bonus when it
appears**, and log which model actually served each generation.

## Spend order and daily caps

1. **Flow first** — known cost per clip, fastest feedback, zero dollars.
   Watch the peak window: free generation may be unavailable roughly
   14:00–17:00 UTC; schedule Flow runs outside it.
2. **Dreamina second** — the only free Seedance route and the largest
   daily pool (120cr US).
3. **Kling third** — one clip a day is enough to grade the Elements
   method over a week.
4. **PixVerse fourth** — smallest reliable pool; spend on whichever
   character layer the other routes haven't covered that day.
- **Caps are absolute:** never exceed a route's free grant for the day;
  no card on file, no top-ups, no promo purchases inside the rotation.
  A route that runs dry is DONE for the day, and the log says so.

## Weekly rhythm + logging

- **Mon–Fri:** run the standard batch down the spend order as budgets
  allow (a full four-route day is the ceiling, not the requirement).
- **Weekend:** gate review + composite assembly of the week's layers;
  one summary row per platform (attempts, gate keepers, median SSIM).
- **Log** (append rows here or in a sibling log file; never edit old
  rows): `date | route | model served | layer | credits in/out |
  gate verdict | SSIM | file path | note`.

## One-time bonuses (survey — no accounts created by this pass)

- **Runway** — 125 one-time signup credits (multiple Oct-2026
  roundups); its roster includes Seedance and Kling 3.0, so one signup
  grant ≈ one short third-party-model test batch. One-time, not a
  rotation route. Amounts are third-party-reported; verify in-app.
- **Jimeng** (Dreamina's China twin) — 260 initial credits for new
  accounts + a ~$0.14 7-day trial (third-party guide). Survey only.

## Agreement + corrections vs the pasted note (dated 2026-10-28)

The note's bottom line AGREES with PR #491's verified record:
Higgsfield free = 0 credits, and real production volume on the
commercial list = paid. Where the note's numbers differ from what the
providers' own pages say, the provider wins:

- Dreamina free credits: note said ~120/day → **CONFIRMED exactly for
  US accounts** by Dreamina's own page (a third-party table's "150,
  varies by region" is superseded).
- PixVerse "~60/day": that is the TOP of a conflicting 30–60 range;
  recorded as a range, in-app number wins at run time.
- Dreamina paid renewal after the promo: Dreamina's own sale page
  lists **$15/month** (some third parties list Basic from $18 —
  provider wins).
