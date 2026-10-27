import { describe, it, expect } from 'vitest';
import { FULL_WORLD } from '../src/world/FullWorldMaps';
import { TRACK_SLOTS } from '../src/lib/audio-system';
import { MAP_SCENE, sceneForMap } from '../src/lib/sceneMap';

describe('scene map', () => {
  it('covers every FULL_WORLD map key exactly once', () => {
    const keys = Object.keys(FULL_WORLD);
    expect(keys.length).toBe(45);
    expect(Object.keys(MAP_SCENE).sort()).toEqual([...keys].sort());
  });

  it('every mapped scene is a real TRACK_SLOTS scene', () => {
    for (const scene of Object.values(MAP_SCENE)) {
      expect(TRACK_SLOTS).toHaveProperty(scene);
    }
  });

  it('dojo maps map to dojo, routes to route, isles to island', () => {
    for (const key of Object.keys(FULL_WORLD)) {
      if (key.startsWith('dojo_')) expect(MAP_SCENE[key]).toBe('dojo');
      if (key.startsWith('route_')) expect(MAP_SCENE[key]).toBe('route');
      if (key.startsWith('data_isle_')) expect(MAP_SCENE[key]).toBe('island');
    }
    expect(sceneForMap('neon_city')).toBe('neon');
    expect(sceneForMap('cave_of_echoes')).toBe('cave');
    expect(sceneForMap('victory_route')).toBe('victory_route');
    expect(sceneForMap('mainframe_plateau')).toBe('plateau');
    expect(sceneForMap('region2_arrival')).toBe('r2_town');
    expect(sceneForMap('no_such_map')).toBeNull();
  });
});
