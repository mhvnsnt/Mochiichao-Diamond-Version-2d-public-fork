# ROUTING — how work flows through WIELDER

Standing rule (owner, 2026-10-28): once Wielder's first live run is
verified, production work routes through Wielder. Doro commands and
manages; Wielder executes; the finish-gate verifier judges; the packet
is what gets relayed to the owner.

## The loop

1. **A task enters as a queue card.** The manager (Doro) puts a card on
   the finish queue's Ready column (or names an existing one). A card
   that Wielder can execute names its finish-gate target in its
   description ("Governed unit: finish-gate target <id>") — the same
   convention the board was seeded with.
2. **Wielder pulls one card (WIP=1)** and runs the full loop under the
   opposite-defaults constitution (`wielder.config`): scrub → discovery
   log → method binding (one Accepted method; superseded hard-fails) →
   input provenance lock → pre-flight (read receipts, payload schemas,
   scorer-path cleanliness) → execute through schema'd tools →
   evaluate on exit codes + the verifier's manifest only.
3. **The verifier issues the manifest.** Wielder submits artifacts; it
   cannot declare done. Machine clauses PASS + owner gate PENDING parks
   the run at the owner-gate interrupt and moves the card to
   Owner review; a clause failure parks it back at Ready with the
   measured defect named, and files a WIELDER-UPGRADE card (the upgrade
   loop: failures become work, rejections become pin requests).
4. **The packet is the relay.** `wielder packet <run>` produces the
   evidence packet — headline core result, provenance lock, transitions,
   tool exit codes, the manifest's clause table, the self-judgment
   section. The manager relays the packet and the verified result to
   the owner; nothing is relayed from a worker's prose.
5. **The owner's verdict resumes the run.** When the owner rules
   (finish-gate `review/record_verdict.py`), the manager runs
   `wielder resume <run>`; resume **re-runs the verifier** and routes
   on the FRESH manifest — the recorded approval by itself never
   advances the graph. APPROVED + clauses PASS on the fresh manifest
   moves the card to Done with the manifest name + sha256 in its
   description (the board's own Done rule).

## Manager commands

| Need | Command |
|---|---|
| See the queue | `wielder queue` |
| Dispatch one card | `wielder run-once [--card ID]` |
| Drain Ready (no-idle) | `wielder run-queue` |
| Run state | `wielder status <run>` / `wielder runs` |
| Evidence for the owner | `wielder packet <run>` |
| Owner ruled | `wielder resume <run>` |
| Inspect checkpoints | `wielder rewind <run>` |
| Rejection → regression pin | `wielder pin-request <run> <defect-class> "<owner words>"` |
| Brain seats | `wielder seats` |
| Board health | `wielder board-check` |

## What the manager never does

- Never edits Wielder's code, gates, or constitution to get a run
  through — a blocker is cleared by fixing the real thing or filing
  the upgrade card.
- Never relays a status that did not come from a manifest + packet.
- Never lets one parked card idle the queue: `run-queue` moves on.
