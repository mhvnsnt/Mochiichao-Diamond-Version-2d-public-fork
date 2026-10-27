/**
 * Phase 4 art pipeline — background removal, masked edits, sprite
 * validation, and the Garden-lane model/level/texture pipeline spec.
 * Pokemon's own order, non-combat side: art pipeline is last because it
 * serves every system above it (world tiles, Garden art, sprites) and
 * must never invent a new UI pattern or a new sprite on its own.
 *
 * Provenance (specs only — NO vendored code or scripts copied here):
 * - venv-rembg (workspace tools/venv-rembg): a Python venv for rembg
 *   background removal. This file holds the JOB SPEC (input → mask →
 *   cutout → feather → output) that an offline job runner executes;
 *   the game itself never runs rembg at runtime.
 * - image-editing (workspace tools/image-editing): masked pixel-edit
 *   scripts (edit one region, leave other pixels untouched) + a mask
 *   image workflow. This file holds the masked-edit JOB SPEC with the
 *   same preserve-rest guarantee, as data — the scripts stay in tools/.
 * - sa_tools (workspace tools/sa_tools): Sonic Adventure toolset
 *   (SALVL levels, SAMDL models, TextureEditor). Garden lane ONLY:
 *   this file lists the pipeline STAGES (model → level → texture →
 *   in-game import check) as a checklist. No SA assets, models, or
 *   character data are referenced or shipped.
 *
 * Pure types + validators, no imports, no battle code, no species/
 * character names, no dialogue, no cries, no logos, no art files.
 * Local CPU only. Every job below is an offline authoring job, not a
 * runtime game feature — the game ships finished art, not the tools.
 */

export type ArtJobKind = "background-remove" | "masked-edit" | "sprite-validate" | "garden-model-pipeline";

export interface BackgroundRemoveJob {
  kind: "background-remove";
  inputPath: string;
  outputPath: string;
  /** 0..1 — mask threshold; higher = tighter cutout. Mochiichao default 0.5. */
  threshold: number;
  /** Feather radius in px for the cutout edge. Mochiichao default 1. */
  featherPx: number;
  /** The original must be kept untouched (checkpoint rule). */
  keepOriginal: true;
}

export interface MaskedEditJob {
  kind: "masked-edit";
  inputPath: string;
  maskPath: string;
  outputPath: string;
  editDescription: string;
  /** Guarantee: pixels outside the mask are byte-identical to input. */
  preserveOutsideMask: true;
  keepOriginal: true;
}

export interface SpriteSheetCheck {
  sheetPath: string;
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  /** Frames the sheet claims to hold (front/back/side/attack/hurt/idle). */
  claimedFrames: string[];
  /** True when this sheet is a locked version Mars has approved. */
  locked: boolean;
}

export function validateSpriteSheet(check: SpriteSheetCheck): { ok: boolean; problems: string[] } {
  const problems: string[] = [];
  if (check.cellWidth <= 0 || check.cellHeight <= 0) problems.push("cell size must be positive");
  if (check.columns <= 0 || check.rows <= 0) problems.push("columns and rows must be positive");
  if (check.claimedFrames.length === 0) problems.push("no frames claimed");
  const seen = new Set<string>();
  for (const f of check.claimedFrames) {
    if (seen.has(f)) problems.push("duplicate frame: " + f);
    seen.add(f);
  }
  if (!check.locked) problems.push("not locked: staging only until Mars approves (checkpoint rule)");
  return { ok: problems.length === 0, problems };
}

/** Garden-lane pipeline stages (sa_tools shape, Garden only). Each stage
 *  must pass before the next starts; a failed stage never overwrites a
 *  locked asset — it produces a new dated checkpoint instead. */
export const GARDEN_PIPELINE_STAGES: string[] = [
  "model-import",
  "level-layout",
  "texture-apply",
  "in-game-import-check",
  "locked-version-register",
];

export function gardenPipelineCheck(completedStages: string[]): { complete: boolean; missing: string[] } {
  const missing = GARDEN_PIPELINE_STAGES.filter((s) => completedStages.indexOf(s) === -1);
  return { complete: missing.length === 0, missing };
}

export function backgroundRemoveJob(inputPath: string, outputPath: string, threshold = 0.5, featherPx = 1): BackgroundRemoveJob {
  return { kind: "background-remove", inputPath, outputPath, threshold, featherPx, keepOriginal: true };
}

export function maskedEditJob(inputPath: string, maskPath: string, outputPath: string, editDescription: string): MaskedEditJob {
  return { kind: "masked-edit", inputPath, maskPath, outputPath, editDescription, preserveOutsideMask: true, keepOriginal: true };
}

export function phase4ArtSelfCheck(): { spriteLockedOk: boolean; spriteStagingFlagged: boolean; pipelineMissing: boolean } {
  const locked = validateSpriteSheet({ sheetPath: "x", cellWidth: 64, cellHeight: 64, columns: 4, rows: 2, claimedFrames: ["front", "back"], locked: true });
  const staging = validateSpriteSheet({ sheetPath: "x", cellWidth: 64, cellHeight: 64, columns: 4, rows: 2, claimedFrames: ["front"], locked: false });
  const pipe = gardenPipelineCheck(["model-import", "level-layout"]);
  return { spriteLockedOk: locked.ok, spriteStagingFlagged: !staging.ok, pipelineMissing: pipe.missing.length === 3 };
}
