/**
 * Open-source asset packs, licence-clean only — data listing for creators.
 *
 * Read by the Menu Creator, UI Creator and Panel Frame Editor, and —
 * since Creator Phase 2 — by CREATE INTRO VIDEO and CREATE START
 * SCREEN through src/components/game/OpenSourceAssetPicker.tsx
 * (picks are stored on the preset, shown in the creator preview,
 * and drawn into the exported video where the kind fits).
 * Every file listed here was fetched through the GitHub Contents API and its
 * licence verified at download time; see src/assets/open-source/ATTRIBUTION.md
 * and src/assets/open-source/README.md for sources, licences and GAPs.
 *
 * Shipped packs: Kenney UI Pack + particle shapes (CC0-1.0, 60 files),
 * game-icons (CC BY 3.0, attribution required, 25 files), 0x72 DungeonTileset II
 * v1.2 (CC0, 2 files). GAP (not shipped, not claimed): OpenGameArt (no named pack
 * fetchable via the GitHub API in this session), Free Pixel Loops fire/smoke/auras
 * (earlier itch.io download failed; needs a parent browser takeover or a Mars upload).
 * No Pokemon sprites, dialogue, music, cries or art are in this listing, ever.
 *
 * Asset URLs resolve through Vite's import.meta.glob, so the bundled files are
 * the ones actually shipped in this repo — no remote fetch at runtime.
 */

export type OpenSourceAssetKind =
  | 'panel' | 'button' | 'bar' | 'cursor' | 'icon' | 'slider' | 'dropdown'
  | 'particle' | 'tileset' | 'tiles-list';

export type OpenSourceCreatorUse = 'menu-creator' | 'panel-frame-editor' | 'ui-creator' | 'intro-video-creator' | 'start-screen-creator';

export interface OpenSourceAsset {
  /** Stable option id, e.g. 'kenney-blue-panel'. */
  id: string;
  /** Pack folder under src/assets/open-source/. */
  pack: 'kenney' | 'game-icons' | 'dungeon-tileset-ii';
  licence: 'CC0-1.0' | 'CC-BY-3.0';
  attributionRequired: boolean;
  /** Repo-relative file under src/assets/open-source/. */
  file: string;
  kind: OpenSourceAssetKind;
  creatorUse: OpenSourceCreatorUse[];
  /** game-icons author (from the pack's license.txt); null for CC0 packs. */
  author: string | null;
  /** Public source repo the file was fetched from. */
  source: string;
}

const assetUrls = import.meta.glob(
  '../assets/open-source/**/*.{png,svg,txt}',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>;

export const OPEN_SOURCE_ASSETS: OpenSourceAsset[] = [
  { id: 'dungeon-tileset-ii-tiles-list', pack: 'dungeon-tileset-ii', licence: 'CC0-1.0', attributionRequired: false, file: 'dungeon-tileset-ii/tiles-list-v1.txt', kind: 'tiles-list', creatorUse: ['ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/cjdaly/CircuitDungeon' },
  { id: 'dungeon-tileset-ii', pack: 'dungeon-tileset-ii', licence: 'CC0-1.0', attributionRequired: false, file: 'dungeon-tileset-ii/0x72_DungeonTilesetII_v1.2.png', kind: 'tileset', creatorUse: ['ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/cjdaly/CircuitDungeon' },
  { id: 'game-icons-carl-olsen-flame', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/carl-olsen-flame.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Carl Olsen', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-berry-bush', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-berry-bush.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-coins', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-coins.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-health-potion', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-health-potion.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-magic-potion', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-magic-potion.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-scroll-quill', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-scroll-quill.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-sparkles', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-sparkles.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-two-coins', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-two-coins.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-delapouite-watch', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/delapouite-watch.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Delapouite', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-broadsword', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-broadsword.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-campfire', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-campfire.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-compass', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-compass.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-crown', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-crown.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-feather', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-feather.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-gems', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-gems.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-key', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-key.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-magic-swirl', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-magic-swirl.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-moon', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-moon.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-paw', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-paw.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-sun', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-sun.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-treasure-map', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-treasure-map.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-lorc-trophy', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/lorc-trophy.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Lorc', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-sbed-fire', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/sbed-fire.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Sbed', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-sbed-shield', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/sbed-shield.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Sbed', source: 'https://github.com/game-icons/icons' },
  { id: 'game-icons-skoll-pocket-watch', pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, file: 'game-icons/skoll-pocket-watch.svg', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: 'Skoll', source: 'https://github.com/game-icons/icons' },
  { id: 'kenney-barBack_horizontalLeft', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBack_horizontalLeft.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barBack_horizontalMid', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBack_horizontalMid.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barBack_horizontalRight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBack_horizontalRight.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barBlue_horizontalBlue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBlue_horizontalBlue.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barBlue_horizontalLeft', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBlue_horizontalLeft.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barBlue_horizontalRight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barBlue_horizontalRight.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barGreen_horizontalLeft', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barGreen_horizontalLeft.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barGreen_horizontalMid', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barGreen_horizontalMid.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barGreen_horizontalRight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barGreen_horizontalRight.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barRed_horizontalLeft', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barRed_horizontalLeft.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barRed_horizontalMid', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barRed_horizontalMid.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barRed_horizontalRight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barRed_horizontalRight.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barYellow_horizontalLeft', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barYellow_horizontalLeft.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barYellow_horizontalMid', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barYellow_horizontalMid.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-barYellow_horizontalRight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/barYellow_horizontalRight.png', kind: 'bar', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-blue_button00', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/blue_button00.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonLong_beige', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonLong_beige.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonLong_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonLong_blue.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonLong_blue_pressed', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonLong_blue_pressed.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonLong_brown', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonLong_brown.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonLong_grey', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonLong_grey.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonRound_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonRound_blue.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-buttonSquare_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/buttonSquare_blue.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-green_button00', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/green_button00.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_button00', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_button00.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-red_button00', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/red_button00.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-yellow_button00', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/yellow_button00.png', kind: 'button', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-cursorGauntlet_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/cursorGauntlet_blue.png', kind: 'cursor', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-cursorHand_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/cursorHand_blue.png', kind: 'cursor', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-cursorSword_gold', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/cursorSword_gold.png', kind: 'cursor', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-dropdownBottom', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/dropdownBottom.png', kind: 'dropdown', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-dropdownMid', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/dropdownMid.png', kind: 'dropdown', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-dropdownTop', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/dropdownTop.png', kind: 'dropdown', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_arrowDownGrey', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_arrowDownGrey.png', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_arrowUpGrey', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_arrowUpGrey.png', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-iconCheck_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/iconCheck_blue.png', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-iconCircle_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/iconCircle_blue.png', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-iconCross_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/iconCross_blue.png', kind: 'icon', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-blue_panel', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/blue_panel.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-green_panel', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/green_panel.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_panel', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_panel.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panelInset_beige', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panelInset_beige.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panelInset_beigeLight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panelInset_beigeLight.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panelInset_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panelInset_blue.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panelInset_brown', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panelInset_brown.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panel_beige', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panel_beige.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panel_beigeLight', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panel_beigeLight.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panel_blue', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panel_blue.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-panel_brown', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/panel_brown.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-red_panel', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/red_panel.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-yellow_panel', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/yellow_panel.png', kind: 'panel', creatorUse: ['panel-frame-editor', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleBrick1a', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleBrick1a.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleBrick1b', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleBrick1b.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleBrick2a', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleBrick2a.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleBrick2b', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleBrick2b.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleCartoonStar', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleCartoonStar.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleSmallStar', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleSmallStar.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-particleStar', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/particleStar.png', kind: 'particle', creatorUse: ['ui-creator', 'menu-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_sliderHorizontal', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_sliderHorizontal.png', kind: 'slider', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
  { id: 'kenney-grey_sliderVertical', pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, file: 'kenney/grey_sliderVertical.png', kind: 'slider', creatorUse: ['panel-frame-editor', 'menu-creator', 'ui-creator', 'intro-video-creator', 'start-screen-creator'], author: null, source: 'https://github.com/iwenzhou/kenney' },
];

/** Bundled URL for an asset, or null if its file is missing from the build. */
export function openSourceAssetUrl(asset: OpenSourceAsset): string | null {
  return assetUrls[`../assets/open-source/${asset.file}`] ?? null;
}

export function openSourceAssetsByKind(kind: OpenSourceAssetKind): OpenSourceAsset[] {
  return OPEN_SOURCE_ASSETS.filter((a) => a.kind === kind);
}

export function openSourceAssetsByCreatorUse(use: OpenSourceCreatorUse): OpenSourceAsset[] {
  return OPEN_SOURCE_ASSETS.filter((a) => a.creatorUse.includes(use));
}

/** One-line attribution for an asset, shown wherever it is picked. */
export function openSourceAttribution(asset: OpenSourceAsset): string {
  const base = `${asset.pack} · ${asset.licence}`;
  if (asset.attributionRequired) {
    return asset.author ? `${base} · by ${asset.author} · attribution required` : `${base} · attribution required`;
  }
  return `${base} · no attribution required`;
}

/** Assets for a list of ids, in listing order, unknown ids dropped. */
export function openSourceAssetsByIds(ids: string[]): OpenSourceAsset[] {
  const wanted = new Set(ids);
  return OPEN_SOURCE_ASSETS.filter(a => wanted.has(a.id));
}

export interface OpenSourcePackSummary {
  pack: OpenSourceAsset['pack'];
  licence: OpenSourceAsset['licence'];
  attributionRequired: boolean;
  count: number;
}

export const OPEN_SOURCE_PACKS: OpenSourcePackSummary[] = [
  { pack: 'kenney', licence: 'CC0-1.0', attributionRequired: false, count: 60 },
  { pack: 'game-icons', licence: 'CC-BY-3.0', attributionRequired: true, count: 25 },
  { pack: 'dungeon-tileset-ii', licence: 'CC0-1.0', attributionRequired: false, count: 2 },
];

