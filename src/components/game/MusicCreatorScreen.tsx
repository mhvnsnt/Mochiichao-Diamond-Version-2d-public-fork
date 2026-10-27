import React, { useRef, useState } from "react";
import {
  DEFAULT_MUSIC_SPEC, musicStepCount, validateMusic, playMusicStep, NOTE_FREQ,
  type MusicSpec, type MusicInstrument,
} from "../../lib/creator/soundCreator";

/**
 * Music Creator — a dedicated full screen under Settings > DigiCore Audio.
 * Structure mirrors how the game's own music was made (title: G major,
 * 112 BPM, 16 bars, stems) and Black 2's sequenced-music shape
 * (tracks, channels, tempo, steps). Instruments: 8-bit synth (the
 * Pokemon way), piano, guitar, drums, organ, bass — plus vocal, which
 * is the user's own mic recording, never a commercial bank (AVANNA
 * is not shipped; its open-source transform parameters are in docs).
 */
const SCALE = ["C4", "E4", "G4", "C5", "E5", "G5"];

export default function MusicCreatorScreen({ onBack }: { onBack: () => void }) {
  const [spec, setSpec] = useState<MusicSpec>(() => JSON.parse(JSON.stringify(DEFAULT_MUSIC_SPEC)) as MusicSpec);
  const [bar, setBar] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const [note, setNote] = useState("Default project is the title shape: G major, 112 BPM, 16 bars. Tap a step to cycle a note, then Play.");

  const steps = musicStepCount(spec);
  const barSteps = spec.stepsPerBar;

  const cycleStep = (trackIdx: number, stepIdx: number) => {
    const next = JSON.parse(JSON.stringify(spec)) as MusicSpec;
    const cur = next.tracks[trackIdx].steps[stepIdx];
    const idx = cur ? SCALE.indexOf(cur) : -1;
    next.tracks[trackIdx].steps[stepIdx] = idx < 0 ? SCALE[0] : idx + 1 >= SCALE.length ? null : SCALE[idx + 1];
    setSpec(next);
  };

  const play = () => {
    const errs = validateMusic(spec);
    if (errs.length) { setNote(errs.join(" ")); return; }
    if (playing) {
      if (timer.current) clearInterval(timer.current);
      setPlaying(false);
      return;
    }
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    let step = 0;
    const ms = (60 / spec.bpm / 2) * 1000;
    timer.current = setInterval(() => {
      playMusicStep(spec, step, ctx);
      step = (step + 1) % steps;
    }, ms);
    setPlaying(true);
    setNote("Playing… tap Stop to stop. Game music pauses while you work here, like the Mixer.");
  };

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    setPlaying(false);
    void ctxRef.current?.close();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${spec.name.replace(/\s+/g, "-")}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const instrumentNote = (inst: MusicInstrument) => {
    if (inst === "vocal") return "Vocal track: use your mic in the Sound Creator (Chatter). This sequencer plays the note as a synth stand-in until a vocal take is assigned.";
    if (inst === "8bit") return "8-bit synth: square wave, the Pokemon way.";
    return `${inst} voice (Web Audio synth, no new deps).`;
  };

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center p-4" style={{ overflowY: "auto" }}>
      <h1 style={{ color: "#fff", fontSize: 22 }}>MUSIC CREATOR — DigiCore Audio</h1>
      <p style={{ color: "#aaa", maxWidth: 640, textAlign: "center" }}>
        Make literal soundtracks and background music, the way the game's title music was made.
        Real instruments are Web Audio synth voices (piano, guitar, drums, organ, bass) plus your own vocal takes.
        No commercial sample bank is shipped.
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 640 }}>
        <input value={spec.name} onChange={(e) => setSpec({ ...spec, name: e.target.value })} style={{ flex: 2 }} />
        <label style={{ color: "#fff" }}>BPM <input type="number" value={spec.bpm} onChange={(e) => setSpec({ ...spec, bpm: Number(e.target.value) })} style={{ width: 70 }} /></label>
        <label style={{ color: "#fff" }}>Key <input value={spec.key} onChange={(e) => setSpec({ ...spec, key: e.target.value })} style={{ width: 90 }} /></label>
        <label style={{ color: "#fff" }}>Bars <input type="number" value={spec.bars} onChange={(e) => {
          const bars = Number(e.target.value) || 1;
          const total = bars * spec.stepsPerBar;
          setSpec({ ...spec, bars, tracks: spec.tracks.map((t) => ({ ...t, steps: Array.from({ length: total }, (_, i) => t.steps[i] ?? null) })) });
        }} style={{ width: 60 }} /></label>
        <button onClick={playing ? stop : play}>{playing ? "■ Stop" : "▶ Play"}</button>
        <button onClick={exportJson}>Export JSON</button>
        <button onClick={() => setSpec(JSON.parse(JSON.stringify(DEFAULT_MUSIC_SPEC)) as MusicSpec)}>Load default</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <span style={{ color: "#fff" }}>Bar:</span>
        {Array.from({ length: spec.bars }, (_, i) => (
          <button key={i} onClick={() => setBar(i)} style={{ fontWeight: bar === i ? "bold" : "normal" }}>{i + 1}</button>
        )).slice(0, 16)}
      </div>
      <p style={{ color: "#888" }}>Showing bar {bar + 1} of {spec.bars} ({barSteps} steps). Tap a step to cycle: empty → C4 → E4 → G4 → C5 → E5 → G5 → empty.</p>
      {spec.tracks.map((track, ti) => (
        <div key={track.instrument} style={{ width: "100%", maxWidth: 640, margin: "6px 0" }}>
          <div style={{ color: "#fff" }}>{track.instrument.toUpperCase()} — {instrumentNote(track.instrument)}</div>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: barSteps }, (_, s) => {
              const idx = bar * barSteps + s;
              const val = track.steps[idx];
              return (
                <button key={s} onClick={() => cycleStep(ti, idx)} style={{ flex: 1, background: val ? "#2a6a2a" : "#222", color: "#fff", padding: "8px 0" }}>
                  {val ?? "·"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p style={{ color: "#888", maxWidth: 640 }}>{note}</p>
      <p style={{ color: "#888", maxWidth: 640 }}>Scale notes available: {Object.keys(NOTE_FREQ).join(", ")} (full list in the creator logic).</p>
      <button onClick={() => { stop(); onBack(); }} style={{ marginTop: 16, padding: "8px 24px" }}>◄ BACK TO SETTINGS</button>
    </div>
  );
}
