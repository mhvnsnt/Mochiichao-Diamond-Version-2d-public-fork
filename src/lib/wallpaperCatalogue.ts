/**
 * PC wallpaper catalogue — STAGED ONLY, imported nowhere yet.
 * No PR, no merge, no game-tree edits.
 *
 * Mars decision 2026-10-27 ~07:46 CDT: wallpaper types from ALL
 * games + modding communities, AND user-uploadable original art
 * from phone storage for wallpapers/backgrounds — fully
 * customizable, upload path included, not just preset patterns.
 *
 * Counting rule used here: a preset is counted only when its
 * selectable id is fixed by an enum/define count read from a
 * decomp source in this pass. Theme names are given in plain
 * generic words (environment / pattern words) where the source
 * name is such a word; where a source name is derived from a
 * creature, faction, or other game-specific proper name, the
 * theme field is `null` and the id is still counted — the count
 * is honest and no protected name is reproduced. Pattern tables
 * that list extra decorative variants beyond the selectable
 * enum (see the Emerald note below) are NOT counted as presets,
 * because their selectable status was not verified.
 *
 * CORRECTION to current main: playableWiring.ts on main says
 * `wallpapersFireRed: 17`. The FireRed enum read in this pass
 * has 16 ids (see gen3-firered below). 17 is NOT repeated here
 * as a verified count; the PR worker should correct the main
 * constant when it wires this catalogue, and must not present
 * 17 as the FireRed preset count.
 */

export type WallpaperSource =
  | 'gen3-firered'
  | 'gen3-emerald'
  | 'gen4-diamond'
  | 'gen4-platinum'
  | 'gen4-heartgold'
  | 'gen5-black2'
  | 'community'
  | 'upload';

export interface WallpaperPreset {
  /** Stable id, e.g. `gen3-firered-00`. Never a source label. */
  id: string;
  source: WallpaperSource;
  /** Generic theme word, or null where the source name is withheld. */
  theme: string | null;
  /** How the preset is obtained in source (default / unlockable). */
  availability: 'default' | 'unlockable' | 'count-only';
  /** Decomp file(s) read for this preset's source count. */
  sourceFiles: string[];
  notes: string;
}

/**
 * Preset lists per source. Theme words are listed only where
 * they are generic environment/pattern words in the source enum.
 * For unlockable sets whose individual names were not all
 * verified as generic, entries carry theme: null and the count
 * is what is claimed, not the names.
 */
export const WALLPAPER_PRESETS: readonly WallpaperPreset[] = [
  // Gen 3 FireRed: 16 enum ids, 0-15. Source enum order is
  // environment/pattern words throughout, so themes are listed.
  ...(['forest', 'city', 'desert', 'savanna', 'crag', 'volcano', 'snow', 'cave', 'beach', 'seafloor', 'river', 'sky', 'stars', 'center', 'tiles', 'simple'] as const).map(
    (theme, i): WallpaperPreset => ({
      id: `gen3-firered-${String(i).padStart(2, '0')}`,
      source: 'gen3-firered',
      theme,
      availability: i <= 3 ? 'default' : 'unlockable',
      sourceFiles: ['pokefirered-leafgreen/include/pokemon_storage_system.h'],
      notes:
        i <= 3
          ? 'Within the source default range (max default id is the 4th enum entry).'
          : 'Beyond the source default range; unlockable in source.',
    }),
  ),
  // Gen 3 Emerald: 17 enum ids, 0-16. The enum's first 12 are
  // generic environment/pattern words; the remaining 5 include
  // names that are not generic, so they are counted with
  // theme: null. Emerald also has a separate decorative pattern
  // table (16 further named variants) that is NOT counted here:
  // its selectable status as box wallpapers was not verified.
  ...(['forest', 'city', 'desert', 'savanna', 'crag', 'volcano', 'snow', 'cave', 'beach', 'seafloor', 'river', 'sky'] as const).map(
    (theme, i): WallpaperPreset => ({
      id: `gen3-emerald-${String(i).padStart(2, '0')}`,
      source: 'gen3-emerald',
      theme,
      availability: i <= 3 ? 'default' : 'unlockable',
      sourceFiles: ['pokeemerald/src/data/wallpapers.h'],
      notes: 'Selectable enum id. Decorative pattern table variants are excluded from this count (see file header).',
    }),
  ),
  ...([12, 13, 14, 15, 16] as const).map(
    (i): WallpaperPreset => ({
      id: `gen3-emerald-${String(i).padStart(2, '0')}`,
      source: 'gen3-emerald',
      theme: null,
      availability: 'unlockable',
      sourceFiles: ['pokeemerald/src/data/wallpapers.h'],
      notes: 'Selectable enum id; theme word withheld (source name is not a generic environment/pattern word). Counted, not named.',
    }),
  ),
  // Gen 4 Diamond: 16 default + 8 unlockable = 24, from header
  // defines. Individual unlockable names are not catalogued.
  ...Array.from({ length: 16 }, (_, i): WallpaperPreset => ({
    id: `gen4-diamond-${String(i).padStart(2, '0')}`,
    source: 'gen4-diamond',
    theme: null,
    availability: 'default',
    sourceFiles: ['pokediamond/include/pokemon_storage_system.h'],
    notes: 'Default set (16). Theme words not catalogued for this source in this pass; count is the verified define.',
  })),
  ...Array.from({ length: 8 }, (_, k): WallpaperPreset => ({
    id: `gen4-diamond-bonus-${String(k).padStart(2, '0')}`,
    source: 'gen4-diamond',
    theme: null,
    availability: 'unlockable',
    sourceFiles: ['pokediamond/include/pokemon_storage_system.h'],
    notes: 'Unlockable set (8). Theme words not catalogued for this source in this pass; count is the verified define.',
  })),
  // Gen 4 Platinum: 18 boxes, same 16 + 8 structure as Diamond
  // in the box header pattern; grid fixed at 5 rows x columns
  // totalling 30. Wallpaper count is carried as 24 by the same
  // default/bonus structure, but the Platinum header read in
  // this pass fixes boxes/rows, not the wallpaper defines, so
  // Platinum presets are marked count-only and NOT added to
  // the distinct-preset total below — counting them would
  // double-count the same 24 designs across two gen4 titles.
  // Gen 4 HeartGold: 16 default + 8 bonus = 24, from the
  // wallpaper constants header. Default themes are generic
  // environment/pattern words; bonus themes include names
  // that are not generic, so bonus themes are withheld.
  ...(['forest', 'city', 'desert', 'savanna', 'crag', 'volcano', 'snow', 'cave', 'beach', 'seafloor', 'river', 'sky', 'center', 'machine', 'checks', 'simple'] as const).map(
    (theme, i): WallpaperPreset => ({
      id: `gen4-heartgold-${String(i).padStart(2, '0')}`,
      source: 'gen4-heartgold',
      theme,
      availability: 'default',
      sourceFiles: ['pokeheartgold/include/constants/box_wallpaper.h'],
      notes: 'Default set (16), ids 0-15.',
    }),
  ),
  ...Array.from({ length: 8 }, (_, k): WallpaperPreset => ({
    id: `gen4-heartgold-bonus-${String(k).padStart(2, '0')}`,
    source: 'gen4-heartgold',
    theme: null,
    availability: 'unlockable',
    sourceFiles: ['pokeheartgold/include/constants/box_wallpaper.h'],
    notes: 'Bonus set (8), ids 32-39; unlocked by flag bits in source. Theme words withheld (source names are not all generic).',
  })),
  // Gen 5 Black 2: 16 normal wallpapers, cycled across boxes at
  // init, plus 2 extra flag sets (SetFlags/CheckFlags, sets 1
  // and 2). The extra sets' distinct design count was NOT
  // verified from the menu tables read (message-id tables, not
  // wallpaper-id tables), so only the 16 normal presets are
  // counted here; the 2 extra sets are recorded, not counted.
  ...Array.from({ length: 16 }, (_, i): WallpaperPreset => ({
    id: `gen5-black2-${String(i).padStart(2, '0')}`,
    source: 'gen5-black2',
    theme: null,
    availability: 'default',
    sourceFiles: ['pokebw2/src/system/box_savedata.c', 'pokebw2/include/save/box.h'],
    notes: 'Normal set (16). Theme words not catalogued for this source in this pass; count is the verified define.',
  })),
];

export const WALLPAPER_COUNTS = {
  perSource: {
    'gen3-firered': WALLPAPER_PRESETS.filter((p) => p.source === 'gen3-firered').length,
    'gen3-emerald': WALLPAPER_PRESETS.filter((p) => p.source === 'gen3-emerald').length,
    'gen4-diamond': WALLPAPER_PRESETS.filter((p) => p.source === 'gen4-diamond').length,
    'gen4-heartgold': WALLPAPER_PRESETS.filter((p) => p.source === 'gen4-heartgold').length,
    'gen5-black2': WALLPAPER_PRESETS.filter((p) => p.source === 'gen5-black2').length,
    community: 0,
  },
  /** Distinct presets actually listed above. */
  distinctPresetsListed: WALLPAPER_PRESETS.length,
  /** Recorded but NOT counted: see notes per source. */
  notCounted: {
    'gen4-platinum': 'same 16+8 structure as Diamond; not added to avoid double-counting gen4 designs (header read fixed boxes/rows, not wallpaper defines)',
    'gen5-black2-extra-sets': '2 extra flag sets recorded; distinct design count unverified from message-id menu tables',
    'gen3-emerald-pattern-table': '16 decorative pattern-table variants; selectable status as box wallpapers unverified',
    'gen3-ruby': 'wallpaper enum not verified in this pass (only a wallpaper-menu text id was seen); not assumed equal to Emerald',
    'gen1-gen2': 'no wallpaper system in list-based storage; 0 presets, correctly',
    community: '0 verified: workspace modding files searched (chao-modding-docs, fan-reference, menu-editor-tree) contain no box-wallpaper preset catalogue — only an unrelated research mention and icon-library files. Community presets are therefore an upload/pattern slot, not a claimed count.',
  },
} as const;

/**
 * Upload path spec (full spec in README.md §4; the staged
 * PcViewWallpaper.patch implements this shape as a skeleton).
 *
 * - Input: a phone file picker (`<input type="file"
 *   accept="image/*">`) in the PC view's wallpaper row. No camera
 *   capture, no cloud import in this spec.
 * - Validation (client-side, before anything is stored):
 *   type must start with `image/`; size at most 5 MB; image
 *   must decode (naturalWidth > 0). Anything else is rejected
 *   with a plain message and nothing is stored.
 * - Storage key: `mochiichao_pc_wallpaper_uploads_v1` — a
 *   localStorage record mapping upload id -> { name, mime,
 *   dataUrl, width, height, createdAt }. The data URL is
 *   stored OUTSIDE the save JSON and outside settings.
 *   Fallback if the device/storage quota refuses: keep the
 *   upload in session memory only for this session and show
 *   that it will not survive a reload; never silently drop
 *   back to a preset without telling the user.
 * - Per-box assignment: `pcWallpapers: Record<number, string>`
 *   in the save-adjacent record (see uncappedStorage.ts save
 *   notes), where the value is a preset id OR an upload id
 *   prefixed `upload:`. Fallback if no upload exists for a
 *   box: the box's preset default (gen5-black2 cycling order,
 *   i.e. box index mod 16, matching source init behaviour),
 *   and if the stored id is unknown: the same default.
 * - No original art is shipped in this folder: uploads are
 *   user-supplied at runtime, so this catalogue contains no
 *   image bytes and no copied artwork.
 */
export const PC_WALLPAPER_UPLOAD_SPEC = {
  input: 'file-input-accept-image',
  maxBytes: 5_000_000,
  storageKey: 'mochiichao_pc_wallpaper_uploads_v1',
  assignmentKey: 'pcWallpapers',
  uploadIdPrefix: 'upload:',
  fallbackPreset: 'gen5-black2-cycled-by-box-index-mod-16',
  quotaFallback: 'session-memory-only-with-visible-warning',
} as const;

/** Resolve a stored wallpaper id to a preset or an upload marker. */
export function resolveWallpaper(
  storedId: string | undefined,
  boxIndex: number,
): { kind: 'preset' | 'upload' | 'default'; id: string } {
  if (!storedId) {
    return { kind: 'default', id: `gen5-black2-${String(boxIndex % 16).padStart(2, '0')}` };
  }
  if (storedId.startsWith('upload:')) {
    return { kind: 'upload', id: storedId };
  }
  const preset = WALLPAPER_PRESETS.find((p) => p.id === storedId);
  if (!preset) {
    return { kind: 'default', id: `gen5-black2-${String(boxIndex % 16).padStart(2, '0')}` };
  }
  return { kind: 'preset', id: preset.id };
}
