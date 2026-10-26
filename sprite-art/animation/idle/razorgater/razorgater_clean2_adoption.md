# Razorgater _clean2 idle adoption — ADOPTED via PR (2026-10-26)

- Gate C (OpenCV) cut exactly 111px/frame from the idle_a/b/c_clean files:
  the soft-shadow ellipse outline loop enclosing the between-feet gap.
  Verified: idle_a nontransparent px orig 2281 -> clean 2142 -> clean2 2031.
- These `_clean2` files ship alongside the originals; originals are NOT
  overwritten and NOT deleted (cache rule: never overwrite a file already
  shown to Mars).
- Ashemit `_clean2` files are NOT in this adoption (rembg pass still owed).
