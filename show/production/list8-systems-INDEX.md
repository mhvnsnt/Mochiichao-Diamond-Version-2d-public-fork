# LIST 8 TEARDOWNS (items 67–76) — native systems package

Auto-dispatched under Jamar's AUTO-WIRE RULE (2026-10-27): the list is
the order. Method identical to Lists 1–2: each system studied from
public documentation / open sources, re-expressed as a **native
Mochiichao spec or format** — the construction kit (architectures,
state machines, data shapes), never copied content, data tables,
names, or assets. Every file is staged repo-ready with its wiring
points named; `STAGING.md` gives the landing paths. Nothing here
invents canon: where canon has not ruled, the slot is marked OPEN.

| # | System | File(s) | One-line yield |
|---|---|---|---|
| 67 | Weather-reactive creature behaviour | `67-WEATHER-BEHAVIOUR.md`, `behaviour-table-fragment.json` | Behaviour tables keyed to the #19 world-state (phase/weather/dread) + WIND-STATE, per area |
| 68 | Player trading / gift protocols | `68-TRADE-PROTOCOL.md`, `trade-record-fragment.json` | Design-only trade record + fairness/link rules; no live service exists or is implied |
| 69 | Achievement architectures | `69-ACHIEVEMENTS.md`, `achievements-fragment.json` | Mochiioteca achievement layer derived from the #14 completion states — derived, never stored |
| 70 | Dynamic difficulty curves | `70-DIFFICULTY.md` | Difficulty spec: fixed canon spine, adaptive *presentation* only — outcome math never bends silently |
| 71 | Tutorial flow grammar | `71-ONBOARDING.md` | First-five-minutes teaching format shared by game onboarding and show EP01's opening beats |
| 72 | Sample-instrument construction | `72-INSTRUMENT-BANK.md`, `instrument-bank-fragment.json` | Instrument-bank spec feeding the MUS stem layers (#13): sampled sources, loop points, layer assignment |
| 73 | 2D anime weather FX | `73-WEATHER-FX.md` | Weather-FX library spec: particle/cycle grammar banked as LIVING-WORLD ambient cycles |
| 74 | Licensing style-guide structure | `74-BRAND-GUIDE.md` | Mochiichao brand-guide format; the MOCHIICHAO STYLE SPEC is one chapter input, not the whole guide |
| 75 | Broadcast delivery standards | `75-DELIVERY-SPEC.md` | Show delivery spec; the −14 LUFS / −1 dBTP finish is the audio chapter of a full delivery sheet |
| 76 | Wiki data architecture | `76-WEB-EXPORT.md`, `web-export-fragment.json` | Public Mochiioteca web-export format derived field-by-field from the species-sheet schema (export only) |

**Cross-package wiring spine.** #19 world-state is the single producer
of phase/weather/dread → #67 behaviour tables and #73 weather FX read
it. #14 completion states are the single source of progress truth →
#69 achievements derive from them, and #76's export never publishes
per-player state at all. #13 MUS/SCORE-STATE consumes #72's bank.
#74's guide governs how #76's public export and all licensed uses
present the art. #75 is the last gate every episode passes before it
leaves the studio.
