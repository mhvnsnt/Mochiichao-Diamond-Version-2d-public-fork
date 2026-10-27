import React, { useState } from "react";
import {
  BUILTIN_SOUNDS, SOUND_SLOTS, loadCreatorSave, persistCreatorSave,
  playChirp, playJingle, chirpToWav, validateChirp,
  SEAL_KINDS, sealEffectsForSendOut,
  type ChirpSpec, type JingleSpec, type CreatorSave, type SoundSlot, type SealKind,
} from "../../lib/creator/soundCreator";

/**
 * Sound Creator — a dedicated full screen under Settings > DigiCore Audio.
 * Layout follows FireRed option_menu.c: header, list, help bar,
 * label left / value right. Never a popup.
 * Slots, chirps, jingles, mic Chatter (Chatot, DPPT structure) and
 * Ball Seals (DPPT structure, Mochiichao-original seals) all live here.
 */
export default function SoundCreatorScreen({ onBack }: { onBack: () => void }) {
  const [save, setSave] = useState<CreatorSave>(() => loadCreatorSave());
  const [chirp, setChirp] = useState<ChirpSpec>({ name: "My chirp", wave: "sine", freqStart: 600, freqEnd: 1200, durationMs: 300, volume: 0.5 });
  const [jingleText, setJingleText] = useState("C4:1 G4:1 A4:1 G4:2");
  const [jingleBpm, setJingleBpm] = useState(120);
  const [creatureId, setCreatureId] = useState("001");
  const [recording, setRecording] = useState<MediaRecorder | null>(null);
  const [recNote, setRecNote] = useState("");
  const [sealKind, setSealKind] = useState<SealKind>("star");
  const [sealLetter, setSealLetter] = useState("M");
  const [note, setNote] = useState("Saved sounds live in this browser (localStorage). Export a chirp as WAV to keep it outside the game.");

  const update = (next: CreatorSave) => { setSave(next); persistCreatorSave(next); };

  const playFile = (file: string) => {
    try { const a = new Audio(file); void a.play(); } catch { /* blocked before gesture: ignore */ }
  };

  const soundLabel = (id: string) => {
    const b = BUILTIN_SOUNDS.find((x) => x.id === id);
    if (b) return b.label;
    const c = save.customs.find((x) => x.id === id);
    return c ? `${c.spec.name} (custom ${c.kind})` : id;
  };

  const previewSlot = (slot: SoundSlot) => {
    const id = save.slots[slot];
    const b = BUILTIN_SOUNDS.find((x) => x.id === id);
    if (b) { playFile(b.file); return; }
    const c = save.customs.find((x) => x.id === id);
    if (c) {
      if (c.kind === "chirp") playChirp(c.spec as ChirpSpec);
      else playJingle(c.spec as JingleSpec);
    }
  };

  const saveChirp = () => {
    const errs = validateChirp(chirp);
    if (errs.length) { setNote(errs.join(" ")); return; }
    const id = `custom-${Date.now()}`;
    update({ ...save, customs: [...save.customs, { id, kind: "chirp", spec: { ...chirp } }] });
    setNote(`Saved chirp "${chirp.name}". Assign it to a slot above.`);
  };

  const saveJingle = () => {
    const notes: JingleSpec["notes"] = jingleText.split(/\s+/).filter(Boolean).map((p) => {
      const [n, b] = p.split(":");
      return { note: n, beats: Number(b) || 1 };
    });
    const spec: JingleSpec = { name: "My jingle", bpm: jingleBpm, wave: "square", notes };
    playJingle(spec);
    update({ ...save, customs: [...save.customs, { id: `custom-${Date.now()}`, kind: "jingle", spec }] });
    setNote(`Jingle previewed and saved with ${notes.length} notes at ${jingleBpm} BPM. Assign it to a slot above.`);
  };

  const exportChirpWav = async () => {
    const blob = await chirpToWav(chirp);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${chirp.name.replace(/\s+/g, "-")}.wav`; a.click();
    URL.revokeObjectURL(url);
  };

  const startRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          const url = String(reader.result);
          update({ ...save, chatter: { ...save.chatter, [creatureId]: url } });
          setRecNote(`Chatter saved for creature ${creatureId}. It plays as that creature's cry, like Chatot's Chatter in Diamond/Pearl/Platinum.`);
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      setRecording(rec);
      setRecNote("Recording… speak or make a sound, then tap Stop.");
    } catch {
      setRecNote("Microphone not available or permission denied. Chatter needs mic permission, like the DS mic in Diamond/Pearl/Platinum.");
    }
  };

  const stopRecord = () => { recording?.stop(); setRecording(null); };

  return (
    <div className="game-screen bg-[#050810] flex flex-col items-center p-4" style={{ overflowY: "auto" }}>
      <h1 style={{ color: "#fff", fontSize: 22 }}>SOUND CREATOR — DigiCore Audio</h1>
      <p style={{ color: "#aaa", maxWidth: 640, textAlign: "center" }}>
        Make boot sounds, chirps and little jingles, and set which sound plays for each menu.
        Default boot is B (rising arpeggio, live bootAudio role); M2 harbour bell is one tap away in any slot.
        Press-start / select default is M3 (Mochii chirp). AVANNA itself is commercial and is never shipped —
        vocal sounds here are your own mic recording.
      </p>

      <h2 style={{ color: "#fff" }}>1. Sound slots</h2>
      {SOUND_SLOTS.map((row) => (
        <div key={row.slot} style={{ display: "flex", gap: 12, alignItems: "center", margin: "4px 0", width: "100%", maxWidth: 640 }}>
          <span style={{ color: "#fff", flex: 1 }}>{row.label}</span>
          <select
            value={save.slots[row.slot]}
            onChange={(e) => update({ ...save, slots: { ...save.slots, [row.slot]: e.target.value } })}
            style={{ flex: 2 }}
          >
            {BUILTIN_SOUNDS.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}
            {save.customs.map((c) => <option key={c.id} value={c.id}>{c.spec.name} (custom)</option>)}
          </select>
          <button onClick={() => previewSlot(row.slot)}>▶ Preview</button>
        </div>
      ))}
      <p style={{ color: "#888", maxWidth: 640 }}>Current: {SOUND_SLOTS.map((r) => `${r.label}=${soundLabel(save.slots[r.slot])}`).join(" · ")}</p>

      <h2 style={{ color: "#fff" }}>2. Chirp creator</h2>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", maxWidth: 640 }}>
        <input value={chirp.name} onChange={(e) => setChirp({ ...chirp, name: e.target.value })} placeholder="Chirp name" />
        <select value={chirp.wave} onChange={(e) => setChirp({ ...chirp, wave: e.target.value as ChirpSpec["wave"] })}>
          <option value="sine">Sine (smooth)</option><option value="square">Square (8-bit)</option>
          <option value="triangle">Triangle (soft 8-bit)</option><option value="sawtooth">Sawtooth (buzzy)</option>
        </select>
        <label style={{ color: "#fff" }}>Start Hz <input type="number" value={chirp.freqStart} onChange={(e) => setChirp({ ...chirp, freqStart: Number(e.target.value) })} style={{ width: 90 }} /></label>
        <label style={{ color: "#fff" }}>End Hz <input type="number" value={chirp.freqEnd} onChange={(e) => setChirp({ ...chirp, freqEnd: Number(e.target.value) })} style={{ width: 90 }} /></label>
        <label style={{ color: "#fff" }}>Ms <input type="number" value={chirp.durationMs} onChange={(e) => setChirp({ ...chirp, durationMs: Number(e.target.value) })} style={{ width: 80 }} /></label>
        <button onClick={() => playChirp(chirp)}>▶ Preview chirp</button>
        <button onClick={saveChirp}>Save chirp</button>
        <button onClick={() => void exportChirpWav()}>Export WAV</button>
      </div>

      <h2 style={{ color: "#fff" }}>3. Jingle creator</h2>
      <p style={{ color: "#aaa", maxWidth: 640 }}>Notes as NOTE:BEATS, e.g. C4:1 G4:1 A4:1 G4:2. Wave is square (8-bit) by default; synth, piano and guitar voices live in the Music Creator.</p>
      <div style={{ display: "flex", gap: 8, maxWidth: 640 }}>
        <input value={jingleText} onChange={(e) => setJingleText(e.target.value)} style={{ flex: 3 }} />
        <label style={{ color: "#fff" }}>BPM <input type="number" value={jingleBpm} onChange={(e) => setJingleBpm(Number(e.target.value))} style={{ width: 70 }} /></label>
        <button onClick={saveJingle}>▶ Preview + save</button>
      </div>

      <h2 style={{ color: "#fff" }}>4. Mic Chatter — Chatot style (Diamond/Pearl/Platinum)</h2>
      <p style={{ color: "#aaa", maxWidth: 640 }}>Record with your mic and that recording becomes the creature's cry. This is the Chatter structure: mic → recorded cry → plays on send-out and as the Chatter move. Nothing is sent anywhere; it stays in this browser.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={creatureId} onChange={(e) => setCreatureId(e.target.value)} placeholder="Creature id, e.g. 001" />
        {!recording ? <button onClick={() => void startRecord()}>● Record</button> : <button onClick={stopRecord}>■ Stop</button>}
        {save.chatter[creatureId] && <button onClick={() => playFile(save.chatter[creatureId])}>▶ Play saved cry</button>}
      </div>
      <p style={{ color: "#888" }}>{recNote}</p>

      <h2 style={{ color: "#fff" }}>5. Ball Seals — send-out designs (Diamond/Pearl/Platinum)</h2>
      <p style={{ color: "#aaa", maxWidth: 640 }}>Seals attach to the Ball Capsule, not the creature, and show when the creature is sent out — letters and designs over the release, exactly where Pokemon puts them.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <select value={sealKind} onChange={(e) => setSealKind(e.target.value as SealKind)}>
          {SEAL_KINDS.map((k) => <option key={k.kind} value={k.kind}>{k.label} {k.glyph}</option>)}
        </select>
        {sealKind === "letter" && <input value={sealLetter} onChange={(e) => setSealLetter(e.target.value.slice(0, 1))} style={{ width: 50 }} />}
        <button onClick={() => update({ ...save, capsule: { seals: [...save.capsule.seals, { kind: sealKind, letter: sealKind === "letter" ? sealLetter : undefined }] } })}>Add seal</button>
        <button onClick={() => update({ ...save, capsule: { seals: [] } })}>Clear capsule</button>
      </div>
      <p style={{ color: "#fff" }}>Send-out effects: {sealEffectsForSendOut(save.capsule).join(" · ") || "none"}</p>

      <p style={{ color: "#888", maxWidth: 640 }}>{note}</p>
      <button onClick={onBack} style={{ marginTop: 16, padding: "8px 24px" }}>◄ BACK TO SETTINGS</button>
    </div>
  );
}
