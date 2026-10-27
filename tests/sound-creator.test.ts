import { describe, it, expect } from "vitest";
import {
  SLOT_DEFAULTS, BUILTIN_SOUNDS, validateChirp, jingleDurationSeconds,
  sealEffectsForSendOut, musicStepCount, validateMusic, DEFAULT_MUSIC_SPEC,
  type ChirpSpec, type JingleSpec,
} from "../src/lib/creator/soundCreator";

describe("sound creator defaults", () => {
  it("boot defaults to B (live bootAudio role), not M2", () => {
    expect(SLOT_DEFAULTS.boot).toBe("B");
    expect(BUILTIN_SOUNDS.map((b) => b.id)).toContain("M2");
  });
  it("press-start and select default to M3 chirp", () => {
    expect(SLOT_DEFAULTS.pressStart).toBe("M3");
    expect(SLOT_DEFAULTS.menuSelect).toBe("M3");
  });
});

describe("chirp validation", () => {
  it("rejects out-of-range freq and duration", () => {
    const bad: ChirpSpec = { name: "x", wave: "sine", freqStart: 5, freqEnd: 9000, durationMs: 10, volume: 2 };
    expect(validateChirp(bad).length).toBeGreaterThan(0);
  });
  it("accepts a normal chirp", () => {
    const ok: ChirpSpec = { name: "chirp", wave: "square", freqStart: 600, freqEnd: 1200, durationMs: 300, volume: 0.5 };
    expect(validateChirp(ok)).toEqual([]);
  });
});

describe("jingle duration", () => {
  it("computes from bpm and beats", () => {
    const j: JingleSpec = { name: "j", bpm: 120, wave: "square", notes: [{ note: "C4", beats: 1 }, { note: "G4", beats: 1 }] };
    expect(jingleDurationSeconds(j)).toBeCloseTo(1);
  });
});

describe("ball seals", () => {
  it("renders letters and glyphs in capsule order", () => {
    expect(sealEffectsForSendOut({ seals: [{ kind: "letter", letter: "m" }, { kind: "star" }] }))
      .toEqual(["Letter M", "Star seal ★"]);
  });
});

describe("music creator", () => {
  it("default is title shape: 112 BPM, 16 bars, 64 steps", () => {
    expect(DEFAULT_MUSIC_SPEC.bpm).toBe(112);
    expect(DEFAULT_MUSIC_SPEC.bars).toBe(16);
    expect(musicStepCount(DEFAULT_MUSIC_SPEC)).toBe(64);
    expect(validateMusic(DEFAULT_MUSIC_SPEC)).toEqual([]);
  });
});
