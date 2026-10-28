/**
 * Art sets + datasets manifest — List 4 (50 items).
 * Full descriptions: goals/mochiichao-fresh-start-repo/files/art-datasets-50.md
 * Status is SPEC unless noted. Game code references art by id, never by a
 * copied asset path or a PokeAPI URL. All art is Mochiichao-original.
 */
export type ArtCategory = "menu-ui" | "sprites" | "world" | "seeded" | "dataset";

export interface ArtSet {
  id: string;
  category: ArtCategory;
  name: string;
  status: "SPEC" | "GEN" | "WIRE";
  gpu: boolean;
}

export const ART_SETS: ArtSet[] = [
  { id: "title-screen", category: "menu-ui", name: "Title screen art set", status: "SPEC", gpu: false },
  { id: "main-menu-ui", category: "menu-ui", name: "Main menu UI set", status: "SPEC", gpu: false },
  { id: "battle-ui", category: "menu-ui", name: "Battle UI set", status: "SPEC", gpu: false },
  { id: "roster-ui", category: "menu-ui", name: "Roster / party UI set", status: "SPEC", gpu: false },
  { id: "garden-ui", category: "menu-ui", name: "Garden UI set", status: "SPEC", gpu: false },
  { id: "map-ui", category: "menu-ui", name: "Map / town UI set", status: "SPEC", gpu: false },
  { id: "market-ui", category: "menu-ui", name: "Shop / Market UI set", status: "SPEC", gpu: false },
  { id: "dialogue-ui", category: "menu-ui", name: "Dialogue UI set", status: "SPEC", gpu: false },
  { id: "settings-ui", category: "menu-ui", name: "Settings / accessibility UI set", status: "SPEC", gpu: false },
  { id: "icon-set", category: "menu-ui", name: "Icon set", status: "SPEC", gpu: false },
  { id: "starter-sprites", category: "sprites", name: "Starter sprite set", status: "SPEC", gpu: true },
  { id: "roster-sprites", category: "sprites", name: "Full roster sprite set", status: "SPEC", gpu: true },
  { id: "garden-form-overlays", category: "sprites", name: "Garden Form sprite overlays", status: "SPEC", gpu: false },
  { id: "colorway-sprites", category: "sprites", name: "Colorway sprite set", status: "SPEC", gpu: true },
  { id: "parts-sprites", category: "sprites", name: "Parts sprite set", status: "SPEC", gpu: true },
  { id: "npc-sprites", category: "sprites", name: "Trainer / NPC sprite set", status: "SPEC", gpu: true },
  { id: "wild-sprites", category: "sprites", name: "Wild creature 2D sprite set", status: "SPEC", gpu: true },
  { id: "3d-style-models", category: "sprites", name: "3D-style model set", status: "SPEC", gpu: true },
  { id: "battle-effects", category: "sprites", name: "Battle effect sprite set", status: "SPEC", gpu: false },
  { id: "egg-cocoon-sprites", category: "sprites", name: "Egg / Cocoon sprite set", status: "SPEC", gpu: false },
  { id: "sector0-world", category: "world", name: "Sector 0 world set", status: "SPEC", gpu: false },
  { id: "route-world", category: "world", name: "Route world set", status: "SPEC", gpu: false },
  { id: "binary-woods", category: "world", name: "The Dark Forest set", status: "SPEC", gpu: false },
  { id: "silicon-town", category: "world", name: "Silicon Town set", status: "SPEC", gpu: false },
  { id: "castagnoli-island", category: "world", name: "Castagnoli Island set", status: "SPEC", gpu: false },
  { id: "garden-world", category: "world", name: "Mochi Garden world set", status: "SPEC", gpu: false },
  { id: "dojo-world", category: "world", name: "Dojo world set", status: "SPEC", gpu: false },
  { id: "weather-time", category: "world", name: "Weather / time set", status: "SPEC", gpu: false },
  { id: "interiors", category: "world", name: "Interior set", status: "SPEC", gpu: false },
  { id: "boss-arenas", category: "world", name: "Boss arena set", status: "SPEC", gpu: false },
  { id: "seed-world", category: "seeded", name: "Seed world generator", status: "SPEC", gpu: false },
  { id: "voxel-world", category: "seeded", name: "Minecraft-style voxel / block world set", status: "SPEC", gpu: false },
  { id: "open-world", category: "seeded", name: "Genshin-style open world set", status: "SPEC", gpu: false },
  { id: "colour-terrain", category: "seeded", name: "Splatoon-style colour terrain set", status: "SPEC", gpu: false },
  { id: "wfc-tiles", category: "seeded", name: "WFC tile set", status: "SPEC", gpu: false },
  { id: "trail-world", category: "seeded", name: "Trailblazers-style seed/trail world set", status: "SPEC", gpu: false },
  { id: "procedural-dungeons", category: "seeded", name: "Procedural dungeon set", status: "SPEC", gpu: false },
  { id: "procedural-variation", category: "seeded", name: "Procedural creature variation set", status: "SPEC", gpu: false },
  { id: "procedural-encounters", category: "seeded", name: "Procedural quest / encounter set", status: "SPEC", gpu: false },
  { id: "seeded-weather", category: "seeded", name: "Seeded weather / season set", status: "SPEC", gpu: false },
  { id: "sprite-dataset", category: "dataset", name: "Original sprite dataset", status: "SPEC", gpu: true },
  { id: "colorway-dataset", category: "dataset", name: "Colorway dataset", status: "SPEC", gpu: true },
  { id: "parts-dataset", category: "dataset", name: "Parts dataset", status: "SPEC", gpu: true },
  { id: "tile-dataset", category: "dataset", name: "World tile dataset", status: "SPEC", gpu: false },
  { id: "battle-dataset", category: "dataset", name: "Move / battle dataset (decomp reference)", status: "WIRE", gpu: false },
  { id: "garden-dataset", category: "dataset", name: "Garden growth dataset", status: "SPEC", gpu: false },
  { id: "capture-dataset", category: "dataset", name: "Capture dataset", status: "SPEC", gpu: false },
  { id: "trade-dataset", category: "dataset", name: "Trade dataset", status: "SPEC", gpu: false },
  { id: "playtest-dataset", category: "dataset", name: "Playtest dataset", status: "SPEC", gpu: false },
  { id: "ui-dataset", category: "dataset", name: "UI / menu dataset", status: "SPEC", gpu: true },
];

export function artSetById(id: string): ArtSet | undefined {
  return ART_SETS.find((s) => s.id === id);
}
