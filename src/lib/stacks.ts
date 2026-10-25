/**
 * Stacks manifest — List 5 (50 items).
 * Full descriptions: goals/mochiichao-fresh-start-repo/files/stacks-50.md
 * Licence-check items must be verified before wiring. Official art/code/
 * ROMs and purchased game files are NOT in this manifest.
 */
export type StackLayer = "vertical" | "horizontal" | "makers" | "academic" | "public";

export interface StackItem {
  id: string;
  layer: StackLayer;
  name: string;
  status: "SPEC" | "WIRE";
  licenceCheck: boolean;
}

export const STACKS: StackItem[] = [
  { id: "web-stack", layer: "vertical", name: "Web stack", status: "WIRE", licenceCheck: false },
  { id: "godot-stack", layer: "vertical", name: "Godot stack", status: "SPEC", licenceCheck: false },
  { id: "phaser-stack", layer: "vertical", name: "Phaser stack", status: "SPEC", licenceCheck: false },
  { id: "threejs-stack", layer: "vertical", name: "Three.js / WebGL stack", status: "SPEC", licenceCheck: false },
  { id: "bevy-stack", layer: "vertical", name: "Bevy stack", status: "SPEC", licenceCheck: false },
  { id: "desktop-stack", layer: "vertical", name: "Electron / desktop stack", status: "SPEC", licenceCheck: false },
  { id: "mobile-stack", layer: "vertical", name: "Mobile web stack", status: "SPEC", licenceCheck: false },
  { id: "server-stack", layer: "vertical", name: "Server stack", status: "SPEC", licenceCheck: false },
  { id: "data-stack", layer: "vertical", name: "Data stack", status: "WIRE", licenceCheck: false },
  { id: "test-stack", layer: "vertical", name: "Test stack", status: "SPEC", licenceCheck: false },
  { id: "data-layer", layer: "horizontal", name: "Data layer", status: "WIRE", licenceCheck: false },
  { id: "battle-layer", layer: "horizontal", name: "Battle layer", status: "SPEC", licenceCheck: false },
  { id: "garden-layer", layer: "horizontal", name: "Garden layer", status: "SPEC", licenceCheck: false },
  { id: "capture-layer", layer: "horizontal", name: "Capture layer", status: "SPEC", licenceCheck: false },
  { id: "trade-layer", layer: "horizontal", name: "Trade layer", status: "SPEC", licenceCheck: false },
  { id: "worldgen-layer", layer: "horizontal", name: "World-gen layer", status: "WIRE", licenceCheck: false },
  { id: "audio-layer", layer: "horizontal", name: "Audio layer", status: "SPEC", licenceCheck: false },
  { id: "ui-layer", layer: "horizontal", name: "UI layer", status: "SPEC", licenceCheck: false },
  { id: "save-layer", layer: "horizontal", name: "Save layer", status: "SPEC", licenceCheck: false },
  { id: "net-layer", layer: "horizontal", name: "Net layer", status: "SPEC", licenceCheck: false },
  { id: "blender-creature", layer: "makers", name: "Blender creature maker", status: "SPEC", licenceCheck: false },
  { id: "blender-human", layer: "makers", name: "Blender human maker", status: "SPEC", licenceCheck: true },
  { id: "makehuman", layer: "makers", name: "MakeHuman human maker", status: "SPEC", licenceCheck: true },
  { id: "sprite-parts", layer: "makers", name: "Modular sprite-part maker", status: "WIRE", licenceCheck: false },
  { id: "palette-maker", layer: "makers", name: "Palette maker", status: "SPEC", licenceCheck: false },
  { id: "pixel-art", layer: "makers", name: "Pixel art maker", status: "SPEC", licenceCheck: false },
  { id: "3d-to-25d", layer: "makers", name: "3D-to-2.5D render maker", status: "SPEC", licenceCheck: false },
  { id: "animation-maker", layer: "makers", name: "Animation maker", status: "SPEC", licenceCheck: false },
  { id: "variation-maker", layer: "makers", name: "Creature variation maker", status: "SPEC", licenceCheck: false },
  { id: "human-variation", layer: "makers", name: "Human variation maker", status: "SPEC", licenceCheck: false },
  { id: "alife-stack", layer: "academic", name: "A-Life stack", status: "SPEC", licenceCheck: false },
  { id: "boids-stack", layer: "academic", name: "Boids / flock stack", status: "SPEC", licenceCheck: false },
  { id: "lenia-stack", layer: "academic", name: "Lenia stack", status: "SPEC", licenceCheck: false },
  { id: "alien-stack", layer: "academic", name: "ALIEN artificial-life stack", status: "SPEC", licenceCheck: false },
  { id: "neat-stack", layer: "academic", name: "NEAT / neuroevolution stack", status: "SPEC", licenceCheck: false },
  { id: "proc-animation", layer: "academic", name: "Procedural animation stack", status: "SPEC", licenceCheck: false },
  { id: "proc-quest", layer: "academic", name: "Procedural quest stack", status: "SPEC", licenceCheck: false },
  { id: "balance-data", layer: "academic", name: "Balance-data stack", status: "SPEC", licenceCheck: false },
  { id: "silent-playtest", layer: "academic", name: "Silent playtest stack", status: "SPEC", licenceCheck: false },
  { id: "canon-bible", layer: "academic", name: "Canon-bible stack", status: "SPEC", licenceCheck: false },
  { id: "pret-stack", layer: "public", name: "pret decomp stack", status: "WIRE", licenceCheck: false },
  { id: "mod-tools", layer: "public", name: "Mod-community tool stack, open source only", status: "SPEC", licenceCheck: true },
  { id: "opengameart", layer: "public", name: "OpenGameArt stack", status: "SPEC", licenceCheck: true },
  { id: "kenney", layer: "public", name: "Kenney assets stack", status: "SPEC", licenceCheck: false },
  { id: "itch-open", layer: "public", name: "itch.io open assets stack", status: "SPEC", licenceCheck: true },
  { id: "pokeapi-shapes", layer: "public", name: "PokeAPI data-shape stack", status: "SPEC", licenceCheck: false },
  { id: "public-audio", layer: "public", name: "Public-domain music / SFX stack", status: "SPEC", licenceCheck: true },
  { id: "ofl-fonts", layer: "public", name: "Font stack", status: "SPEC", licenceCheck: false },
  { id: "docs-wiki", layer: "public", name: "Docs / wiki stack", status: "SPEC", licenceCheck: false },
  { id: "steam-open", layer: "public", name: "Steam open stack", status: "SPEC", licenceCheck: true },
];

export function stackById(id: string): StackItem | undefined {
  return STACKS.find((s) => s.id === id);
}
