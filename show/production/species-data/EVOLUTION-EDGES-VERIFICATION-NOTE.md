# VERIFICATION NOTE — evolution edges vs evolution schema (landing wave, 2026-10-27)

Found by the retroactive real-code check, recorded openly:

- `show/production/species-data/evolution-edges.wave1.json` (package 25, PR #405) holds 64
  evolution edges written in the design lane's snake_case keys.
- `src/data/core/schemas/evolution.schema.json` requires camelCase keys and
  `additionalProperties: false`.

So the edges as landed DO NOT VALIDATE against the schema as landed. Both files are
preserved as they are — the mismatch is a data-lane normalisation job (re-key the edges to
the schema, or amend the schema with the design lane's vocabulary), and it is registered
here so nobody downstream treats the edges as schema-valid until that job runs. The spawn
instances from the same package DO validate (verified separately, 0 errors, all 4 areas).
