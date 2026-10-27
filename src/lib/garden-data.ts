/**
 * Mochi Garden data — PROPOSED, show-first, Mars can change one line.
 * Original Mochiichao critters and fruit only. No other game's
 * critter, fruit, character, or item names are used here.
 */
import type { GardenStats } from './mochiichao-systems';

/** Fruit -> Garden Stat map, proposed. Change one line to change it. */
export const FRUIT_MAP: Record<string, Partial<GardenStats> & { care?: number }> = {
  'Aqua Fruit': { dive: 10 },
  'Aero Fruit': { glide: 10 },
  'Swift Fruit': { sprint: 10 },
  'Chrome Fruit': { might: 10 },
  'Earth Fruit': { endurance: 10 },
  'Garden Fruit': { endurance: 5 },
  'Strong Nut': { endurance: 20 },
  'Smart Berry': { dive: 2, glide: 2, sprint: 2, might: 2, endurance: 2 },
  'Bright Berry': { care: 10 },
  'Umbral Berry': { care: -10 },
  'Heart Berry': {},
};

/** 21 original Garden Critter types, one per Mythic gate slot. */
export interface GardenCritterType {
  id: string; name: string; stat: keyof GardenStats; part: string; behaviour: string;
}
export const GARDEN_CRITTERS: GardenCritterType[] = [
  { id: 'tide-pup', name: 'Tide-Pup', stat: 'dive', part: 'Tail', behaviour: 'backstroke' },
  { id: 'glider-moth', name: 'Glider-Moth', stat: 'glide', part: 'Back', behaviour: 'flutter' },
  { id: 'sprint-hare', name: 'Sprint-Hare', stat: 'sprint', part: 'Feet', behaviour: 'hop' },
  { id: 'forge-bear', name: 'Forge-Bear', stat: 'might', part: 'Head', behaviour: 'chest-pound' },
  { id: 'stone-tortoise', name: 'Stone-Tortoise', stat: 'endurance', part: 'Back', behaviour: 'steady-walk' },
  { id: 'bubble-otter', name: 'Bubble-Otter', stat: 'dive', part: 'Ears', behaviour: 'dive-loop' },
  { id: 'paper-kite', name: 'Paper-Kite', stat: 'glide', part: 'Back', behaviour: 'drift' },
  { id: 'dash-fox', name: 'Dash-Fox', stat: 'sprint', part: 'Tail', behaviour: 'dash' },
  { id: 'anvil-mole', name: 'Anvil-Mole', stat: 'might', part: 'Feet', behaviour: 'dig-pound' },
  { id: 'root-turtle', name: 'Root-Turtle', stat: 'endurance', part: 'Head', behaviour: 'root-stand' },
  { id: 'mist-jelly', name: 'Mist-Jelly', stat: 'dive', part: 'Head', behaviour: 'float' },
  { id: 'wind-sparrow', name: 'Wind-Sparrow', stat: 'glide', part: 'Ears', behaviour: 'soar' },
  { id: 'spark-hare', name: 'Spark-Hare', stat: 'sprint', part: 'Ears', behaviour: 'spark-hop' },
  { id: 'iron-beetle', name: 'Iron-Beetle', stat: 'might', part: 'Back', behaviour: 'charge' },
  { id: 'moss-badger', name: 'Moss-Badger', stat: 'endurance', part: 'Tail', behaviour: 'graze' },
  { id: 'coral-crab', name: 'Coral-Crab', stat: 'dive', part: 'Feet', behaviour: 'sidestep' },
  { id: 'cloud-moth', name: 'Cloud-Moth', stat: 'glide', part: 'Head', behaviour: 'cloud-drift' },
  { id: 'bolt-cheetah', name: 'Bolt-Cheetah', stat: 'sprint', part: 'Head', behaviour: 'bolt-run' },
  { id: 'granite-golem-pup', name: 'Granite-Pup', stat: 'might', part: 'Tail', behaviour: 'roll-pound' },
  { id: 'ember-salamander', name: 'Ember-Salamander', stat: 'endurance', part: 'Feet', behaviour: 'ember-walk' },
  { id: 'lumen-wisp', name: 'Lumen-Wisp', stat: 'endurance', part: 'Ears', behaviour: 'glow-drift' },
];

/** Race tiers, Mochiichao names, structure only from public race tiers. */
export const RACE_TIERS = ['Garden Cup', 'Circuit Cup', 'Grand Circuit', 'Bright Cup', 'Umbral Cup'];

/** Other raising games — RULE mappings only, no names/art/sound copied. */
export const OTHER_GAMES_RULES: { game: string; rule: string; mochiichao: string }[] = [
  { game: 'Tamagotchi', rule: 'care lifecycle, hunger/happiness/sleep need icons', mochiichao: 'need icons (! hungry, Z sleepy, flower ring)' },
  { game: 'Digimon World', rule: 'care mistakes + branching evolution by care/stats', mochiichao: 'careMistakes + dominant-stat Garden Form' },
  { game: 'Monster Rancher', rule: 'tournament breeding + training schedules', mochiichao: 'MochiiPlex Circuit + Academy lessons' },
  { game: 'Viva Piñata', rule: 'garden ecosystem, romance requirements to breed', mochiichao: 'farm ecosystem + Bonding Season requirements' },
  { game: 'Creatures (Norns)', rule: 'genetics + DNA inheritance + behaviour learning', mochiichao: 'grades/DNA inheritance, 50/50 + higher wins 70%' },
  { game: 'Wobbledogs', rule: 'genetics sandbox + diet effects on stats', mochiichao: 'fruit map + diet nudges, no new species' },
  { game: 'Dragon Quest Monsters', rule: 'fusion, offspring inherits powers, parents consumed', mochiichao: 'NOT default — no hybrid, no parent loss; fusion is a contrast only' },
  { game: 'Jade Cocoon', rule: 'merging: body parent 1, colour parent 2, attacks both', mochiichao: 'Two-tone palette: primary parent 1, accent parent 2' },
  { game: 'Nintendogs', rule: 'petting, toys, tricks, contests raise bond', mochiichao: 'pet +Bond, toys, Data Lessons, races' },
  { game: 'Animal Crossing Animal Island', rule: 'visiting gardens, gifting, friendship by visits', mochiichao: 'visiting a garden shifts alignment slightly toward it' },
];
