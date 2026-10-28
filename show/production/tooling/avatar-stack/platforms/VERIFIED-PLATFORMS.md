# Verified Platforms — commercial AI video tools checked at source (2026-10-28)

Every claim below was checked against the provider's own pages (pricing,
help centre, official model guides, terms) on 2026-10-28 — not review blogs.
Where the only source was third-party, the row says so. Buckets follow the
licence-honesty law: **paid** / **free proprietary** / **free-but-restricted**
(scratch only, outputs cannot ship) / **open source**.

## 1. Higgsfield + Seedance 2.5

| Claim in the note | Verified fact (source) | Bucket |
|---|---|---|
| "Seedance 2.5" is the model | REAL. ByteDance Seed released Seedance 2.5 on 2026-07-31. Higgsfield help centre: "Seedance 2.5 generates clips up to 30 seconds long… with synchronized audio produced in the same pass. It accepts up to 50 references per generation: 30 images, 10 video clips, and 10 audio files." | model itself: paid hosted |
| Up to 30s clips | TRUE on Higgsfield (help centre table: Seedance 2.5 "4s to 30s", "up to 1080p on Pro and Plus plans and above"). Note: 2.5 tops out at 1080p — 4K belongs to Seedance 2.0, not 2.5. | — |
| Multi-shot in one generation | TRUE at model level (Runway Dev's Seedance 2.5 docs: "One generation can hold several connected shots"). ByteDance's own launch post flags the limit: "still room for improvement… regarding the physical plausibility of complex motions and the stability of scenes involving interactions among multiple subjects." | — |
| Native audio | TRUE — synchronized audio in the same pass, "the sound toggle doesn't change the cost of a generation" (Higgsfield help centre). | — |
| "Elements" | REAL on Higgsfield: saved reference assets callable with @ in Seedance/Cinema Studio prompts; Soul ID characters appear in Elements automatically (Higgsfield's own Soul ID guide). | — |
| "Soul ID" | REAL: trained identity from reference photos. Higgsfield: "Upload roughly 20+ well-lit images… the system builds a digital double"; creation costs 25 credits; works across Seedance 2.0, Veo 3.1, Kling 3.0 on the platform. It is built and marketed for photoreal faces ("Soul ID is built for high realism… fashion-grade visuals") — flat-2D cartoon performance is NOT evidenced on their pages. Training needs 20+ images per character: our canon has 1 view per character today (see reference-packs gaps). | — |
| Pricing + commercial rights | Higgsfield's own pricing explainer (Oct 2026): Free $0 / 0 credits / commercial use ✗; Starter $15/mo / 200 credits / commercial ✓; Plus $49/mo / 1,000 / ✓; Ultra $129/mo / 3,000 / ✓. **Seedance 2.5 is Plus-and-above only** ("isn't included in Starter and Basic"). Credit costs from the same page: Seedance 2.5 5s@720p = 35 credits; 30s@720p = 210. "If a generation finishes, the credits aren't returned, even if you don't like the result." Third-party reads of the pricing page show different numbers ($19/270, $59/1,200) — Higgsfield appears to vary price by region/promo; their own explainer is the operative source here. | **paid**. Free tier = **free-but-restricted** (0 video credits, images only, no commercial use) |
| Speed "seconds–few minutes" | No generation-time figure is published on Higgsfield's own pages. UNVERIFIED at source. | — |

## 2. Kling AI (Kuaishou)

| Claim | Verified fact (source) | Bucket |
|---|---|---|
| "Kling 3.0/4.0" | BOTH real. The official kling.ai model guide documents VIDEO 3.0 (15s max). Kling 4.0 had a global launch 2026-10-16 (Kling press release): native 3–30s, up to 10 keyframes, up to 15 combined references. Plans were restructured around the 4.0 launch in October 2026 — prices are mid-change. | paid hosted |
| Elements library | REAL, official Element Library guide (kling.ai): Elements are reusable characters/animals/props/costumes/scenes; created from a character video OR 2–4 reference images; character Elements can bind a voice tone. Library caps: 30 (non-member), 50 (Standard), 150 (Pro/Premier), 500 (Ultra). Creating an Element is free. | — |
| Multi-shot | TRUE — official VIDEO 3.0 guide: "Multi-Shot" (model plans transitions) and "Custom Multi-Shot" (per-shot description + duration), native audio, multi-character coreference (3+), 5 dialogue languages. | — |
| Clip length | 3.0: 3–15s (official guide). 4.0: 3–30s (press release). | — |
| "~1–3 min per clip" | NOT published by Kling. Queue-dependent; no source figure. UNVERIFIED at source. | — |
| Pricing + rights | Membership page (Oct 2026 reads): Standard $10 list / 660 credits; Pro $37 / 3,000; higher tiers restructured Oct 2026 (Premier/Ultra+ up to $544.99 / 57,000). Every paid tier: 1080p/4K, watermark removal, **commercial use of generated content**. Credit burn example (third-party, from the membership page): a 10s 1080p Kling 3.0 clip with sound = 120 credits per attempt. | **paid** |
| Free tier | **The note's "66 credits/day" is OUTDATED for free accounts.** Kling's current membership FAQ: free (Basic) accounts get "Monthly Free Credits" (amount varies, valid 31 days); the 66/day figure survives only as *subscribers'* daily bonus credits. Free = 720p, watermarked, **no commercial-use rights** (official Credits Policy as quoted in guides). | free tier = **free-but-restricted** |

## 3. Wan 3.0 (Alibaba)

| Claim | Verified fact (source) | Bucket |
|---|---|---|
| Wan 3.0 exists | REAL. Alibaba Cloud's own blog: "Wan3.0 is the new generation of Alibaba's Wan video generation model family, now available on Alibaba Cloud Model Studio." Public beta Aug 2026. It is a HOSTED API model — unlike Wan 2.2, there are no open weights for 3.0. | **paid** (proprietary hosted) |
| 30s clips | TRUE: "generates up to 30 seconds of video in a single pass" + video extension (Alibaba Cloud blog). Third-party platforms may cap lower (one reseller runs 2–15s). | — |
| Reference fidelity | Alibaba's claim, their words: reference-to-video mode holds "characters — facial features, hairstyle and hair color, body shape, clothing, and accessories stay consistent at fine granularity". This is vendor claim, not an independent cartoon test. | — |
| Pricing | Official: API $0.05/s (480P), $0.10/s (720P), $0.20/s (1080P) on Model Studio. "A full 30-second 1080P generation costs $6.00." | **paid** |

## 4. Google Flow (Veo 3.1 / Gemini Omni Flash)

| Claim | Verified fact (source) | Bucket |
|---|---|---|
| Flow + Veo 3.1 | REAL. Veo 3.1 is in Flow with Ingredients to Video (up to 3 reference images), Frames to Video, Extend (chains past 60s). Base clip: 4/6/8 seconds ONLY — Flow is an 8-second engine plus chaining, the opposite end from Seedance/Wan 30s. | — |
| "Omni Flash" | REAL but the full name is **Gemini Omni Flash** (Google I/O, 2026-05-19): conversational video model, 4–10s clips at 720p, in Flow at 12 credits per 8s clip. Keeps characters consistent across edits per Google. | — |
| Multi-character | Flow has a Characters feature + Ingredients references; Google positions Omni Flash as handling multi-character edits well. No per-model guarantee published. PARTLY VERIFIED (feature exists; "handles well" is the note's gloss). | — |
| Pricing | Flow credits (Google's Flow pages/help, Oct 2026): every account 50 credits/day free; Google AI Plus $4.99/mo (+200/mo), Pro $19.99 (+1,000), Ultra $99.99 (+10,000), Ultra top $199.99 (+25,000). Per generation: Veo 3.1 Lite 10 credits, Fast 20, Quality 100 (Ultra halves Lite/Fast). | **paid** for usable volume; free daily credits = **free proprietary** |
| Commercial rights | **UNCLEAR AT SOURCE — the honest gap in the note.** Google's Terms disclaim ownership ("Google won't claim ownership over that content"), but no Flow page states a commercial-use licence for outputs. All outputs carry invisible SynthID. Visible-watermark rules vary by tier/region per conflicting third-party reads — UNVERIFIED at source. API route is cleaner: Gemini API *paid* tier = standard paid terms; *unpaid* tier content "is used to provide, improve, and develop Google products" with human review (Google's own Additional Terms) — unpaid API output is not a shipping input for us. | free tier/API-unpaid = **free-but-restricted**; paid = **paid**, Flow-output commercial licence **not stated by Google** |

## 5. Dedicated series tools

| Tool | Verified fact (source) | Bucket |
|---|---|---|
| StudioRam (studioram.app) | REAL, its own site: script→episode, "Save this character and they are ready for every scene", scenes chain from last frame. One scene = one shot, up to 8s, 1 credit. "A single scene renders in two to five minutes." Output 720p/24fps with voice+sound+music. Pricing on its own page: first scene free (watermarked); Creator $29/mo = 15 scenes first month then 12/month, "No watermark · commercial use"; one-time pack $59.99 = up to 2 minutes of video, never expires. Terms per its FAQ: outputs "licensed to you for personal and commercial use". | **paid**; first scene = **free-but-restricted** (watermarked) |
| Anijam (anijam.ai) | REAL, its own pages: "Anijam stores your characters as persistent project assets… When you create Episode 2, Episode 3, or Episode 10, your characters look identical." Commercial rights: "available on Anijam's Beginner plan and above ($16/month billed annually)… The free plan is for personal exploration." Paid exports watermark-free; free exports watermarked + non-commercial (its pricing page). Beginner = 3,000 credits/mo, 720p. Per-scene credit cost not published on the pages checked — cost-per-episode UNVERIFIED. | **paid**; free = **free-but-restricted** |
| Atlabs (atlabs.ai) | REAL, its own blog/site: Cast library locks characters across scenes/episodes; cartoon agent makes episodes up to 20 min; it orchestrates Kling/Seedance/Veo/Wan models under one subscription. Its blog: "Pricing starts free, with paid plans from $19 per month… every plan includes commercial use." Free plan = one 25-second video, no card. The "every plan includes commercial use" line is from Atlabs' own marketing blog, not a terms page — treat free-tier commercial scope as UNVERIFIED in their terms. | **paid**; free = **free-but-restricted** pending terms check |

## 6. The note's criticisms of OUR pipeline — checked against our own measurements

| Note's claim | Our record | Verdict |
|---|---|---|
| "Slow (hours per scene)" | Scene kernel ≈3h56m for ~10.1s/character on Kaggle free GPUs (native fallback path) | TRUE for the native path |
| "Rate-limited" | Kaggle API 429 on multiple harvest attempts across two rounds | TRUE |
| "Needs custom weights/training for likeness" | LoRAs trained (Wan2.1-1.3B); they do not load in the 5B scene; round 2 needs model sheets | TRUE |
| "Manual gating and chaining" | Yes — by design (frame-1 gate + likeness gate + segment chaining are ours) | TRUE (and deliberate: the gates are how a wrong character gets caught) |
| Implied: commercial tools make review unnecessary | Higgsfield's own explainer charges every completed generation ("credits aren't returned, even if you don't like the result") and prices examples at 1/2/3 tries — iteration cost is real on their side too | EXAGGERATED |
| "Match or exceed quality for cartoons" | All vendor consistency claims found are aimed at photoreal humans (Soul ID: "high realism… fashion-grade"). No provider page evidences flat-2D cartoon series production. ByteDance itself flags multi-subject stability limits. | UNVERIFIED for our use |
| (omitted by the note) Speed of OUR accelerated path | Wrapper A/B measured 2026-10-27: 78.5s total for a short test clip vs 1,787.6s native (22.8×) — real, but UNPROVEN at scene scale; the Turbo path also carried two bugs (fixed in `../parity/workflow-turbo-fixed.json`, not yet run) | The honest middle: neither "hours" nor "minutes" is proven at scene scale yet |
| (omitted) Likeness on our side | Currently UNPROVEN: harvested scene graded FAIL (reference-never-anchored, both characters); locked VACE run pending (Kaggle 429) | TRUE gap — the locked run is the deciding test |

## 7. What a 107-cut episode costs on the commercial stacks (estimate)

Assumptions, stated: average cut 8s at 720p; **3 attempts per keeper** (the
retry rate in Higgsfield's own pricing examples); generation spend only —
editing/finishing labour excluded; subscription months counted where credits
are monthly-capped.

| Stack | Per-attempt cost basis | Episode estimate (107 cuts × 3 tries) |
|---|---|---|
| Higgsfield / Seedance 2.5 (Plus $49/mo, 1,000 cr/mo) | ~56 cr per 8s@720p (35 cr per 5s, their table) | ~18,000 credits ≈ **$880** at Plus credit value; ≈18 months of Plus allowance or ~6 months of Ultra — schedule, not just money, is the constraint |
| Kling direct (Pro) | 120 cr per 10s 1080p w/ audio per attempt (membership-page read) | ~38,500 credits ≈ **$335–$600** depending on tier/credit value |
| Kling via fal API | $0.168/s standard | 8s × 3 × 107 × $0.168 ≈ **$431** |
| Wan 3.0 API (Model Studio) | $0.10/s @720p | 8 × 3 × 107 × $0.10 ≈ **$257** (1080p ≈ $514) |
| Google Flow (Veo 3.1 Fast, 20 cr) | 60 cr per keeper | 6,420 cr ≈ **$100–$130** (one Ultra month or ~6 Pro months) — cheapest, but 8s clips + commercial licence unstated |
| Google Flow (Veo 3.1 Quality, 100 cr) | 300 cr per keeper | 32,100 cr ≈ **$260+** (Ultra-tier months) |
| StudioRam | 1 credit = 1 scene (≤8s) | 107 scenes: ~$261 as 9 Creator months (12/mo cap = schedule problem) or ≈ **$420** in never-expire packs (~14 min of video) |
| Anijam | per-scene credit cost not published | plan cost $16–$25/mo (Beginner); episode total UNVERIFIED |

**Honest range: roughly $150–$900 of generation spend per episode** at a
3-tries-per-keeper rate, plus the calendar time imposed by monthly credit
caps. At 1 try per keeper (unrealistic for a gated pipeline) divide by ~3.

## 8. Free-only rule — what survives

Nothing on the commercial list ships free. Every shippable route on those
platforms is a paid tier. Free tiers are evaluation-only for us:

- Higgsfield free: no video at all (0 credits, images only, no commercial use).
- Kling free: watermarked, 720p, no commercial rights → scratch/previs only.
- Flow free (50 cr/day): commercial licence for outputs not stated by Google → scratch only.
- StudioRam first scene: watermarked → scratch only.
- Anijam free: watermarked, non-commercial → scratch only.
- Atlabs free: one 25s video; commercial scope unverified in terms → scratch only.

The only **shippable free** generation route remains our own: Wan 2.2 open
weights (Apache-2.0) on Kaggle free GPUs, in the avatar-stack. That is why
the production pattern (`PRODUCTION-PATTERN.md`) treats engines as swappable
slots under one pattern, with the Kaggle backend as the free/shipping slot.

## 9. Addendum 4 (2026-10-28) — the legitimate free routes, claim by claim

A second owner note listed free routes only. Each claim checked; sourcing
honesty: where a provider publishes no public pricing page (PixVerse prices
are in-app), the entry says so and the evidence is the provider's own terms
as read by dated trackers, marked [terms-read].

### Google Flow free
- "~50 credits/day, no card" — **TRUE.** Google's own Flow credits page:
  every account gets 50 credits/day with or without a subscription
  (verified in the main pass). No payment method is involved in the free
  route. Caveat: some Google eligibility pages still describe Flow as
  requiring a Plus/Pro/Ultra plan — the pages conflict; the parent's
  hands-on test (separate lane) settles what the owner's account gets.
- "Veo 3.1 Lite and Omni Flash on free" — **PARTLY CONFLICTED.** Lite on
  free: YES (10 cr → 5 clips/day, matches the note's "~5×8s Lite clips").
  Omni Flash on free: sources conflict — one dated tracker says free users
  cannot use Gemini Omni Flash at all, another prices free Omni clips at
  7–15 credits. Marked CONFLICTED pending the hands-on test.
- "Daily reset, no rollover" — **TRUE** per Google's credits page as
  reported consistently: refresh triggers on the first generation of the
  day; unused daily (and monthly) credits never roll over.
- "Peak-hour restrictions" — **TRUE.** Google states non-subscribers may
  be unable to generate video during peak hours, roughly 2–5 PM UTC;
  image generation still works. Plan free Flow tests outside that window
  (morning US time is safe).
- Ingredients (reference images): available on Veo 3.1 Lite/Fast per
  Google's docs (not on Quality via API reference mode). Commercial
  licence for outputs: still NOT stated by Google → free Flow output is
  scratch-only for us, whatever the hands-on quality turns out to be.

### Kling free (Basic)
- "Monthly/login credits + welcome grants" — **CONFLICTED in the sources.**
  Kling's own current FAQ frames free credits as variable "Monthly Free
  Credits"; multiple October-2026 trackers that read the live interface
  still observe login-based grants (the old "66/day" figure). Both cannot
  be the whole story; the parent's hands-on Kling test settles the actual
  grant on the owner's account. Either way the amount is small.
- "Elements available but limited" — **TRUE.** The Element Library cap on
  the free tier is 30 elements (vs 50 Standard / 150 Pro-Premier / 500
  Ultra), and Elements can be built on free — but outputs stay 720p,
  watermarked, non-commercial: scratch only.
- Watermarked / non-commercial / 720p on free — **TRUE** (main pass).

### Higgsfield free
- "0 monthly credits" — **TRUE** (Higgsfield's own pricing explainer:
  Free = 0 credits, images only, no commercial use).
- "Occasional card-required trials" — **UNVERIFIED at source**; plausible
  promotional behaviour, no help-centre statement found. Changes nothing:
  a trial that needs a card is an owner decision, never an agent action.

### Wan 3.0 trial
- "Official trial ~1 short clip / ~30s total, region-restricted" —
  **NOT CONFIRMED at Alibaba's own pages.** No Alibaba source found in
  this pass states that trial shape. What is confirmed: Wan 3.0 is
  API-only (no weights), priced per second ($0.05/$0.10/$0.20 by
  resolution — fal's Wan 3 page mirrors the same rates), and fal offers
  signed-in accounts 5 free Wan 3 text-to-video generations per 24h in
  its sandbox (fal's own page) — a platform trial, not Alibaba's, and it
  needs a fal account (not created; owner decision). Third-party "Wan 3.0"
  sites (wan-3.run etc.) are NOT Alibaba and their free-credit claims are
  not evidence about Alibaba.
- The note is corrected accordingly: no verified official free trial of
  Wan 3.0 exists on the record; the fal sandbox is the only concrete free
  look, T2V only.

### PixVerse (new entry)
- Real platform; current model line V5.x with multi-shot and native audio
  per its own material; reference-to-video (multi-image blend) exists.
- Free: 90 signup credits + ~60 daily credits [terms-read — PixVerse
  publishes pricing in-app, not on a public page]. Free output is
  **watermarked and non-commercial** under its terms ("Your use of the
  Outputs is limited to non-commercial purposes unless you obtain
  separate authorization or a commercial-use license", terms read
  2026-10-12) → free-but-restricted, scratch only.
- Paid entry: Standard ~$8/mo billed annually removes the watermark and
  grants commercial use (720p; 1080p from Pro ~$24/mo). Bucket: **paid**
  (cheap end). Not added as a job profile: no series/character-library
  system verified; revisit only if the owner wants a B-roll-style test.

### Dreamina (new entry — ByteDance/CapCut, runs Seedance)
- Real: dreamina.capcut.com, Seedance-powered, sign-in via existing
  CapCut/TikTok account, daily free credits.
- Free rights: **SOURCES CONFLICT, terms win.** Marketing-style roundups
  claim "no watermark, commercial use allowed" on free; a dated read of
  Dreamina's own pricing modal + Terms of Service (2026-10-12) says free
  downloads carry the watermark ("Remove the Dreamina watermark" starts
  at the Basic plan, ~$15/mo) and the ToS frames the service as private,
  non-commercial use, with commercial rights behind a paid plan. Bucket:
  free = **free-but-restricted** (scratch only); paid from ~$15/mo.
- Note also: third-party "watermark remover" downloaders for Dreamina
  exist. Using one would circumvent the platform's paid term — REFUSED,
  same class as any other paywall bypass.

### Hands-on status (Addendum 4 instruction)
Flow and Kling free-tier hands-on tests are being run separately through
the parent's browser lane — NOT duplicated here. Until those results are
forwarded, all hands-on outcomes in this pack are marked
**PENDING-PARENT**: (a) does the owner's Google account get the 50/day
free Flow balance in practice, (b) is Omni Flash usable on free, (c) what
does Kling free actually grant and does an Element build succeed on free,
(d) flat-2D likeness quality on either.
