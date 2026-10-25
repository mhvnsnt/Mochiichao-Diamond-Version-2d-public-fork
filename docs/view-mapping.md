# MochiBake view mapping — CANONICAL, use this for every bake

A view is named by what the creature is doing, not by a camera angle number.
Verify by eye before shipping a sheet; angle numbers alone caused this bug.

- front: creature faces the camera, face + belly visible, arms out to the sides.
  Local sprites-bake: angle90. Kaggle notebook mislabeled this as "side".
- back: creature faces away, shell/back facing the camera, face NOT visible.
  Local sprites-bake: angle270. Kaggle notebook had NO true back render.
- side_right: profile, creature faces right, shell visible from the side.
  Local sprites-bake: angle0. Kaggle notebook mislabeled this as "front".
- side_left: profile, creature faces left, mirror of side_right until a second side is baked.
  Local sprites-bake: mirror side frame. Kaggle notebook mislabeled this as "back".

Kaggle correction (2026-10-25, verified by eye):
  Kaggle front -> side_right
  Kaggle back  -> side_left
  Kaggle side  -> front
  Kaggle back (true) -> MISSING, use local sprites-bake back

Corrected Kaggle renders live in blender-bakes/kaggle-corrected/<creature>/
as <creature>_<true_view>_256.png + _64.png + manifest.json.
Never trust a bake's filename until you have looked at the image.
