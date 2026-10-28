# #25 — PLUSH / MERCH PATTERN DERIVATION → plush spec as a design-gate output

**Teardown (published merch-production practice).** A plush pattern
is a *derivation* of the model sheet, not a new design: the sheet's
front/side views are flattened into seam panels; features are sorted
into **structural** (built from panels — ears, tails, shells),
**appliqué** (flat shapes sewn on — markings, bellies) and
**embroidered** (eyes, mouths, fine lines); proportions are
deliberately re-headed (plush reads at a larger head ratio than the
show model, a documented, bounded shift); and the whole derivation
is constrained by a minimum seam/feature size below which detail is
dropped, never shrunk. The failure mode the process exists to
prevent is a plush that reads as a *different character* — which is
a likeness problem, governed by the same law as animation.

**Native spec — `mochiichao/plush/v1`** — a **design-gate output**:
every species that passes the design gate can emit a plush sheet;
no species gets a plush sheet by hand-redrawing.

- Inputs (all existing artefacts): the locked design + model sheet,
  the species' palette record (garden-form palettes), and the three
  gate tests this spec formalises as *plush-read proofs*: the
  **32px test** (design reads at 32 px), the **one-colour test**
  (silhouette alone identifies), the **plush test** (the derivation
  below still identifies) — the trio the design theory already
  names; this spec gives the third one a procedure.
- Derivation sheet (per species, one page): panel map (front/side
  flattened, seam lines), feature sort table (structural / appliqué
  / embroidered, each feature assigned once), proportion note (head
  ratio shift recorded as a number, bounded — the shift is data,
  so it can't creep), minimum-feature rule (features under the
  threshold are dropped and the drop is *listed*), palette mapping
  to fabric-safe colours (palette record ids, not eyeballed hex).
- Identity locks (cannot be derived away): silhouette-defining
  anatomy from the sheet's `distinguishing_anatomy`, protected
  colours per the lustre law's identity locks (outline/eye/protected
  set), and per-species canon features (Kittember's flame is
  tail-tip structural, never a separate appliqué orb; Wispkin's mask
  is a structural panel with the crack embroidered, pre-mask form
  excluded — flashback only, no merch of it without an owner ruling).
- Gate: a plush sheet passes when the 32px and one-colour proofs of
  the *derived* artwork still identify the species — the likeness
  gate's silhouette discipline, applied to merch.

**Wiring.** Design gate emits it (DESIGN-PRINCIPLES/Theory gate
checklist gains the plush output slot); species sheet gains one
field, `plush_sheet` (path or null), in the show block. No factory,
licence or manufacturing claim is made — this is a design artefact
spec; any production use is a separate owner decision.

**Coverage.** Derivation process: standard published practice.
Bounds (head-ratio range, minimum feature size) are PROPOSED house
numbers pending a first physical proof — none has been made, and
the spec says so.
