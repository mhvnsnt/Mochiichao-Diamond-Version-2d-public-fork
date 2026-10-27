import { describe, it, expect } from 'vitest';
import { FULL_WORLD } from '../src/world/FullWorldMaps';
import region1 from '../src/lib/wiring/dialogue/region1-dialogue.json';
import {
  REGION1_DIALOGUE_ATTRIBUTION,
  attributionForSpeaker,
} from '../src/lib/dialogueAttribution';

function allNpcs(): any[] {
  return Object.values(FULL_WORLD as any).flatMap((m: any) => m.npcs || []);
}

function allSignTexts(): string[] {
  return Object.values(FULL_WORLD as any).flatMap((m: any) => (m.signs || []).map((s: any) => s.text || ''));
}

describe('dialogue attribution region 1', () => {
  it('covers every Region 1 speaker exactly once', () => {
    const speakers = (region1 as any).entries.flatMap((e: any) => e.npcs.map((n: any) => n.speaker));
    expect(speakers.length).toBe(13);
    expect(REGION1_DIALOGUE_ATTRIBUTION.map((a) => a.speaker).sort()).toEqual([...speakers].sort());
    expect(new Set(REGION1_DIALOGUE_ATTRIBUTION.map((a) => a.speaker)).size).toBe(13);
  });

  it('counts: exact 8, sign 1, divergent 2, missing 2', () => {
    const count = (s: string) => REGION1_DIALOGUE_ATTRIBUTION.filter((a) => a.status === s).length;
    expect(count('exact')).toBe(8);
    expect(count('sign')).toBe(1);
    expect(count('divergent')).toBe(2);
    expect(count('missing')).toBe(2);
  });

  it('exact entries really are byte-identical lines in that NPC dialog', () => {
    const npcs = allNpcs();
    for (const a of REGION1_DIALOGUE_ATTRIBUTION.filter((x) => x.status === 'exact')) {
      const npc = npcs.find((n: any) => n.id === a.npcId);
      expect(npc, `missing NPC ${a.npcId}`).toBeDefined();
      const entry = (region1 as any).entries.find((e: any) => e.id === a.entryId);
      const speaker = entry.npcs.find((n: any) => n.speaker === a.speaker);
      for (const line of speaker.lines) {
        expect(npc.dialog).toContain(line);
      }
      const map: any = (FULL_WORLD as any)[a.mapKey!];
      expect(map.npcs.some((n: any) => n.id === a.npcId)).toBe(true);
    }
  });

  it('sign entry is present as an Ember Island sign', () => {
    const texts = allSignTexts().join('\n');
    expect(texts).toContain('The Mythic data is not a weapon');
    expect(attributionForSpeaker('Mansion log (readable, not spoken)')?.mapKey).toBe('ember_island');
  });

  it('divergent NPCs exist but do not carry the JSON lines', () => {
    const npcs = allNpcs();
    for (const a of REGION1_DIALOGUE_ATTRIBUTION.filter((x) => x.status === 'divergent')) {
      const npc = npcs.find((n: any) => n.id === a.npcId);
      expect(npc).toBeDefined();
      const entry = (region1 as any).entries.find((e: any) => e.id === a.entryId);
      const speaker = entry.npcs.find((n: any) => n.speaker === a.speaker);
      expect(speaker.lines.some((l: string) => (npc.dialog || []).includes(l))).toBe(false);
    }
  });

  it('missing entries have no NPC id and no map key', () => {
    for (const a of REGION1_DIALOGUE_ATTRIBUTION.filter((x) => x.status === 'missing')) {
      expect(a.npcId).toBeNull();
      expect(a.mapKey).toBeNull();
    }
  });
});
