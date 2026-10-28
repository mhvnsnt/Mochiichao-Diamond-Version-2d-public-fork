# Reference Packs — our character-locking system (engine-agnostic)

One pack per character. A pack is the single source every animation engine —
our own Kaggle/Wan backend, or any commercial platform used for scratch
evaluation — reads a character from. This is the "lock characters once" step,
under our name, in our repo, independent of any vendor's library format
(Kling calls theirs Elements, Higgsfield calls theirs Elements/Soul ID; the
pack format carries the same fields: named character, view set, palette
notes, do-not-change traits).

## Rules

- **Canon only.** A view enters a pack only from canon art. Where a view does
  not exist in canon it is recorded as a `GAP` in `pack.json` — never filled
  by a silently generated image labelled canon. Producing the missing sheets
  is a separate, owner-visible step.
- **No baked shadows.** Reference art never carries a painted ground/contact
  shadow (standing rule). Sproutle's pack uses the cleaned cutout only; the
  v1 shadowed file is marked not usable in its pack notes.
- **Current-version law.** `PACK-MANIFEST.md` names the current pack version
  per character; engines take the marked-current pack.
- **Creatures don't speak words.** Canon: creatures make cries/sounds only.
  Any platform feature that binds a *voice* to a character (Kling voice-bound
  Elements, Soul ID personas) maps to cry/sound design in our voice lane, not
  dialogue.

## Layout

```
reference-packs/
  PACK-MANIFEST.md      index + view-gap table (the sheet work still owed)
  <character>/
    pack.json           views (CANON/GAP), palette, do-not-change traits, platform mapping
    front.png           the canon cutout of record (front/hero view)
```
