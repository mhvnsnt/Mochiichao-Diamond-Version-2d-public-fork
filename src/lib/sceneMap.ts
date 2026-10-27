/**
 * Scene map — FULL_WORLD map key -> audio-system SceneId, 2026-10-27.
 *
 * This is the mapping step from the audio-system wiring checklist
 * ("on map change, call audio.playScene(map.musicScene)"), NOT the
 * call-site: nothing here changes WorldEngine or music.ts, and no
 * audio file is claimed. The live music system (src/lib/music.ts,
 * world/battle, null-src) and the audio-system synth fallbacks are
 * two different systems; this table maps to audio-system SceneIds
 * so that when the Music lane wires a playScene call, it has a
 * complete, tested table instead of a per-map guess.
 *
 * Coverage: 45/45 FULL_WORLD keys at this writing (the "48 keys"
 * figure in the PR #279 summary does not match the file: the
 * FULL_WORLD record in src/world/FullWorldMaps.ts holds 45 keys).
 * Every value is
 * a SceneId present in TRACK_SLOTS (verified by test). Scene
 * choice is a mood mapping (town = towns, route = routes,
 * dojo = dojos, cave = cave/tunnel, harbour = ports, island =
 * isles, etc.), not a value read from a decomp — Pokemon maps do
 * not carry a Mochiichao scene id. Judgement calls, labelled:
 * scrap_junkyard -> market (scrap trading), coral_approach ->
 * sea (coastal approach), luigi_mansion -> house (interior
 * building), sector0_truck -> house (calm start area).
 * A region can swap its loop later by changing one row here.
 */

import type { SceneId } from './audio-system';

export const MAP_SCENE: Record<string, SceneId> = {
  aeon_lab: 'lab',
  sector0: 'town',
  route_1: 'route',
  mochiiplex_1: 'town',
  binary_fields: 'route',
  dojo_1: 'dojo',
  binary_woods: 'forest',
  cave_of_echoes: 'cave',
  neon_city: 'neon',
  scrap_junkyard: 'market',
  coral_approach: 'sea',
  castagnoli_island: 'island',
  mauveville_arena: 'arena',
  boot_bay: 'harbour',
  luigi_mansion: 'house',
  dojo_2: 'dojo',
  sector0_truck: 'house',
  sector0_house_1f: 'house',
  sector0_house_2f: 'house',
  sector0_rival_house: 'house',
  route_2: 'route',
  stoneport_city: 'harbour',
  dojo_3: 'dojo',
  route_3: 'route',
  signal_tunnel: 'cave',
  pale_town: 'town',
  market_city: 'market',
  dojo_4: 'dojo',
  central_city: 'town',
  dojo_5: 'dojo',
  harbor_city: 'harbour',
  dojo_6: 'dojo',
  ember_island: 'island',
  dojo_7: 'dojo',
  dojo_8: 'dojo',
  victory_route: 'victory_route',
  mainframe_plateau: 'plateau',
  data_isle_1: 'island',
  data_isle_2: 'island',
  data_isle_3: 'island',
  data_isle_4: 'island',
  data_isle_5: 'island',
  data_isle_6: 'island',
  data_isle_7: 'island',
  region2_arrival: 'r2_town',
};

export function sceneForMap(mapKey: string): SceneId | null {
  return MAP_SCENE[mapKey] ?? null;
}
