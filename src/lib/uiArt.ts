/**
 * UI art manifest — the UI Art lane swaps art in here, the same
 * file-swap way as creature/human sheets. Every UI piece the game
 * draws has a slot in this manifest; until art arrives, assetUrl is
 * null and the game renders the clean placeholder UI system (coloured
 * panels, game-style buttons, non-mono font) — never the old terminal
 * frame, never bracket text links, never mono teal.
 *
 * Slots: title art, main/pause menu panels, HUD, battle panels,
 * roster/shop/PC panels, Garden/Arena/Creature/Ring panels, D-pad,
 * A/B/START buttons, type icons for the 12 True Elements, item icons,
 * status icons.
 */


import panelMain from '../assets/ui/svg/panel-main.svg';
import panelSmall from '../assets/ui/svg/panel-small.svg';
import hudTop from '../assets/ui/svg/hud-top.svg';
import dialogueBox from '../assets/ui/svg/dialogue-box.svg';
import dpadArt from '../assets/ui/svg/dpad.svg';
import buttonA from '../assets/ui/svg/button-a.svg';
import buttonB from '../assets/ui/svg/button-b.svg';
import buttonStart from '../assets/ui/svg/button-start.svg';
import buttonPrimary from '../assets/ui/svg/button-primary.svg';
import iconWater from '../assets/ui/svg/icon-element-water.svg';
import iconChrome from '../assets/ui/svg/icon-element-chrome.svg';
import iconEarth from '../assets/ui/svg/icon-element-earth.svg';
import iconBug from '../assets/ui/svg/icon-element-bug.svg';
import iconUmbral from '../assets/ui/svg/icon-element-umbral.svg';
import iconAero from '../assets/ui/svg/icon-element-aero.svg';
import iconCore from '../assets/ui/svg/icon-element-core.svg';
import iconStrike from '../assets/ui/svg/icon-element-strike.svg';
import iconDeep from '../assets/ui/svg/icon-element-deep.svg';
import iconFlame from '../assets/ui/svg/icon-element-flame.svg';
import iconMythic from '../assets/ui/svg/icon-element-mythic.svg';
import iconNormal from '../assets/ui/svg/icon-element-normal.svg';
import iconLuigiCube from '../assets/ui/svg/icon-luigi-cube.svg';
import iconMendPatch from '../assets/ui/svg/icon-mend-patch.svg';
import iconReviveCore from '../assets/ui/svg/icon-item-revive-core.svg';
import iconBurn from '../assets/ui/svg/icon-status-burn.svg';
import iconPoison from '../assets/ui/svg/icon-status-poison.svg';
import iconParalysis from '../assets/ui/svg/icon-status-paralysis.svg';
import iconFaint from '../assets/ui/svg/icon-status-faint.svg';

export interface UiArtSlot {
  slotId: string;
  label: string;
  /** Null until the UI Art lane delivers this asset. */
  assetUrl: string | null;
  /** CSS fallback used while assetUrl is null (the placeholder UI system). */
  fallback: string;
}

function slot(slotId: string, label: string, fallback: string, assetUrl: string | null = null): UiArtSlot {
  return { slotId, label, assetUrl, fallback };
}

export const UI_ART: Record<string, UiArtSlot> = {
  title_art: slot('title_art', 'Title art', 'gradient + game-title text'),
  main_menu_panel: slot('main_menu_panel', 'Main menu panel', 'game-panel', panelMain),
  // Batch 3 — Pause menu Y2K skin: Pause no longer uses the shared generic
  // panel-main.svg. Its skin is the .pause-y2k-panel CSS in index.css
  // (glossy cyan→blue→violet gradient, white border, glow, pink star
  // accents). If the UI Art lane later delivers a dedicated Pause panel
  // asset, re-attach it here and remove that CSS block. No other slot
  // is changed by this batch.
  pause_menu_panel: slot('pause_menu_panel', 'Pause menu panel', 'pause-y2k-panel CSS skin'),
  // Bag menu Y2K skin (per-menu skins 2/8): BagView is a full-screen
  // view, not a UiPanel, so this slot documents the skin rather than
  // rendering an asset — its skin is the .bag-y2k CSS in index.css
  // (glossy green gradient, white border, glow, star/heart accents).
  // If the UI Art lane later delivers a dedicated Bag panel asset,
  // re-attach it here. No other slot is changed by this batch.
  bag_menu_panel: slot('bag_menu_panel', 'Bag menu panel', 'bag-y2k CSS skin'),
  // Shop menu Y2K skin (per-menu skins 3/8): ShopView is a full-screen
  // view, not a UiPanel, so this slot documents the skin rather than
  // rendering an asset — its skin is the .shop-y2k CSS in index.css
  // (glossy yellow gradient, white border, glow, star/heart accents).
  // The existing shop_panel slot above is unchanged. If the UI Art
  // lane later delivers a dedicated Shop panel asset, re-attach it
  // here. No other slot is changed by this batch.
  shop_menu_panel: slot('shop_menu_panel', 'Shop menu panel', 'shop-y2k CSS skin'),
  hud_panel: slot('hud_panel', 'HUD panel', 'game-panel', hudTop),
  battle_panel: slot('battle_panel', 'Battle panels (HP + move menu)', 'game-panel', dialogueBox),
  roster_panel: slot('roster_panel', 'Roster panel', 'game-panel', panelMain),
  shop_panel: slot('shop_panel', 'Shop panel', 'game-panel', panelMain),
  pc_panel: slot('pc_panel', 'PC panel', 'game-panel', panelMain),
  garden_panel: slot('garden_panel', 'Garden panel', 'game-panel', panelMain),
  arena_panel: slot('arena_panel', 'Arena panel', 'game-panel', panelMain),
  creature_panel: slot('creature_panel', 'Creature Mode panel', 'game-panel', panelMain),
  ring_panel: slot('ring_panel', 'Ring Capture panel', 'game-panel', panelSmall),
  dpad: slot('dpad', 'D-pad', 'game-button circles', dpadArt),
  button_a: slot('button_a', 'A button', 'game-button teal', buttonA),
  button_b: slot('button_b', 'B button', 'game-button red', buttonB),
  button_start: slot('button_start', 'START button', 'game-button', buttonStart),
  game_button: slot('game_button', 'Generic game button', 'game-button', buttonPrimary),
};

const TYPE_ICON_URLS: Record<string, string> = { Water: iconWater, Chrome: iconChrome, Earth: iconEarth, Bug: iconBug, Umbral: iconUmbral, Aero: iconAero, Core: iconCore, Strike: iconStrike, Deep: iconDeep, Flame: iconFlame, Mythic: iconMythic, Normal: iconNormal };

export const TRUE_ELEMENT_ICONS: Record<string, UiArtSlot> = Object.fromEntries(
  ['Water', 'Chrome', 'Earth', 'Bug', 'Umbral', 'Aero', 'Core', 'Strike', 'Deep', 'Flame', 'Mythic', 'Normal'].map(
    (el) => [el, slot(`type_icon_${el.toLowerCase()}`, `${el} type icon`, 'coloured type badge', TYPE_ICON_URLS[el])],
  ),
);

const ITEM_ICON_URLS: Record<string, string> = { luigi_cube: iconLuigiCube, mend_patch: iconMendPatch, revive_core: iconReviveCore };

export const ITEM_ICONS: Record<string, UiArtSlot> = Object.fromEntries(
  ['luigi_cube', 'mend_patch', 'revive_core'].map(
    (id) => [id, slot(`item_icon_${id}`, `${id} icon`, 'text label', ITEM_ICON_URLS[id])],
  ),
);

const STATUS_ICON_URLS: Record<string, string> = { burn: iconBurn, poison: iconPoison, paralysis: iconParalysis, faint: iconFaint };

export const STATUS_ICONS: Record<string, UiArtSlot> = Object.fromEntries(
  ['burn', 'poison', 'paralysis', 'faint'].map(
    (id) => [id, slot(`status_icon_${id}`, `${id} icon`, 'text badge', STATUS_ICON_URLS[id])],
  ),
);

/** Count of UI slots still on the placeholder system (0 once all 36 wired slots have art). */
export function uiPlaceholderCount(): number {
  return Object.values(UI_ART).filter(s => !s.assetUrl).length
    + Object.values(TRUE_ELEMENT_ICONS).filter(s => !s.assetUrl).length
    + Object.values(ITEM_ICONS).filter(s => !s.assetUrl).length
    + Object.values(STATUS_ICONS).filter(s => !s.assetUrl).length;
}
