#!/usr/bin/env python3
"""Mochiichao title/intro v2 — ORIGINAL MIDI, rendered with FluidSynth + FluidR3_GM.
Structure only from FireRed decomp MIDI analysis (aggregate counts, no melodies copied):
 - mus_title.mid: 140 BPM, 10 layers, 1249 notes, vel 52-127, steady bars then climax bars 22-25 at 74-89 notes/bar, tail bar 5 notes.
 - mus_new_game_intro.mid: 120 BPM, 6 bars, sparse held notes (3 notes on several tracks) + low pulse.
V2 applies those STRUCTURES with new notes in D major, written for this task.
Channels: 0 lead, 1 counter, 2 pad, 3 strings, 4 brass, 5 bass, 6 harp, 9 drums.
GM programs (0-indexed): lead 80, counter 73 (flute), pad 88, strings 48, brass 61, bass 38, harp 46.
"""
import mido, os
OUT="/home/hatch/workspace/mochiichao-work/title-music"
TPB=480
NAMES=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]
def nm(m): return f"{NAMES[m%12]}{m//12-1}"

def build_midi(path, bpm, tracks):
    """tracks: list of (channel, program_or_None, [(midi, start_beat, dur_beats, velocity), ...])"""
    mid=mido.MidiFile(type=1, ticks_per_beat=TPB)
    meta=mido.MidiTrack(); mid.tracks.append(meta)
    meta.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(bpm), time=0))
    meta.append(mido.MetaMessage('end_of_track', time=0))
    for ch, prog, notes in tracks:
        tr=mido.MidiTrack(); mid.tracks.append(tr)
        last=0
        if prog is not None and ch!=9:
            tr.append(mido.Message('program_change', channel=ch, program=prog, time=0))
        events=[]
        for midi, start, dur, vel in notes:
            events.append((int(start*TPB), 'on', midi, vel))
            events.append((int((start+dur)*TPB), 'off', midi, 0))
        events.sort(key=lambda e:(e[0], 0 if e[1]=='off' else 1))
        for tick, kind, midi, vel in events:
            delta=tick-last; last=tick
            if kind=='on':
                tr.append(mido.Message('note_on', channel=ch, note=midi, velocity=vel, time=delta))
            else:
                tr.append(mido.Message('note_off', channel=ch, note=midi, velocity=0, time=delta))
        tr.append(mido.MetaMessage('end_of_track', time=0))
    mid.save(path)
    return path

def chord(root, qual):
    # root midi in octave 2/3 for bass, returns (root, third, fifth)
    if qual=='maj': return (root, root+4, root+7)
    if qual=='min': return (root, root+3, root+7)
    return (root, root+4, root+7)

# ---------- TITLE V2 ----------
# D major, 140 BPM, 24 bars. Chords: (bass_root, qual)
title_chords=[(38,'maj'),(47,'min'),(43,'maj'),(45,'maj'),
              (38,'maj'),(47,'min'),(43,'maj'),(45,'maj'),
              (40,'min'),(43,'maj'),(38,'maj'),(45,'maj'),
              (47,'min'),(43,'maj'),(45,'maj'),(38,'maj'),
              (47,'min'),(43,'maj'),(38,'maj'),(45,'maj'),
              (38,'maj'),(47,'min'),(45,'maj'),(38,'maj')]
# bass roots: D2=38, B2=47, G2=43, A2=45, E2=40
title_melody=[
 [(69,0,1),(74,1,1),(78,2,1),(76,3,1)],
 [(74,0,1.5),(71,1.5,0.5),(69,2,1),(71,3,1)],
 [(79,0,1),(78,1,1),(76,2,1),(74,3,1)],
 [(76,0,1),(73,1,1),(74,2,2)],
 [(78,0,0.5),(79,0.5,0.5),(81,1,1),(79,2,1),(78,3,1)],
 [(76,0,1),(74,1,1),(71,2,1),(74,3,1)],
 [(79,0,2),(76,2,1),(74,3,1)],
 [(69,0,1),(73,1,1),(76,2,1),(69,3,1)],
 [(71,0,1),(74,1,1),(76,2,1),(79,3,1)],
 [(79,0,1.5),(76,1.5,0.5),(74,2,1),(71,3,1)],
 [(74,0,1),(78,1,1),(81,2,1),(79,3,1)],
 [(81,0,2),(78,2,1),(76,3,1)],
 [(71,0,2),(74,2,1),(78,3,1)],
 [(79,0,1),(81,1,1),(83,2,1),(81,3,1)],
 [(69,0,1),(76,1,1),(73,2,1),(74,3,1)],
 [(74,0,2),(69,2,1),(71,3,1)],
 [(74,0,0.5),(78,0.5,0.5),(81,1,0.5),(83,1.5,0.5),(81,2,1),(79,3,1)],
 [(83,0,1),(81,1,1),(79,2,1),(76,3,1)],
 [(78,0,1),(81,1,1),(74,2,2)],
 [(76,0,0.5),(78,0.5,0.5),(79,1,1),(81,2,2)],
 [(74,0,2),(71,2,1),(69,3,1)],
 [(71,0,1),(69,1,1),(67,2,1),(66,3,1)],
 [(76,0,1),(69,1,1),(73,2,2)],
 [(74,0,4)],
]
def section_vel(bar):
    if bar<8: return 100
    if bar<16: return 112
    if bar<20: return 122
    return 104

lead=[]; counter=[]; pad=[]; strings=[]; brass=[]; bass=[]; harp=[]; drums=[]
for bar,(root,qual) in enumerate(title_chords):
    base=bar*4; vel=section_vel(bar)
    tones=chord(root,qual)
    # pad: whole-note chord, +24 (octave 4/5)
    for t in tones:
        pad.append((t+24, base, 4, vel-20))
    # strings: beats 1 and 3, chord tones
    strings.append((tones[0]+24, base, 2, vel-15))
    strings.append((tones[2]+24, base+2, 2, vel-15))
    # bass: eighth pulse root/fifth
    for e in range(8):
        bass.append((root if e%2==0 else root+7, base+e*0.5, 0.5, vel-5))
    # harp arp: eighth notes, chord tones +24, quiet
    arp_tones=[t+24 for t in tones]
    for e in range(8):
        harp.append((arp_tones[e%3], base+e*0.5, 0.5, vel-35))
    # lead
    for midi,off,dur in title_melody[bar]:
        lead.append((midi, base+off, dur, min(127, vel+8)))
    # counter: enters bar 9, half notes on chord tones, a third below lead-ish (use chord tones)
    if bar>=8:
        counter.append((tones[1]+12, base, 2, vel-12))
        counter.append((tones[2]+12, base+2, 2, vel-12))
    # brass: climax only bars 17-20, plus final bar
    if 16<=bar<20 or bar==23:
        brass.append((tones[0]+12, base, 1, vel))
        brass.append((tones[2]+12, base+1, 1, vel))
        brass.append((tones[1]+12, base+2, 2, vel))
    # drums: B section hat+kick+snare soft, climax full, resolve hat only
    if 8<=bar<16:
        for e in range(8):
            drums.append((42, base+e*0.5, 0.25, vel-30))  # closed hat
        drums.append((36, base, 0.5, vel-10))  # kick
        drums.append((36, base+2, 0.5, vel-10))
        drums.append((38, base+1, 0.5, vel-10))  # snare
        drums.append((38, base+3, 0.5, vel-10))
    elif 16<=bar<20:
        if bar==16: drums.append((49, base, 1, 120))  # crash
        for e in range(8):
            drums.append((42, base+e*0.5, 0.25, vel-15))
        drums.append((36, base, 0.5, vel))
        drums.append((36, base+2, 0.5, vel))
        drums.append((38, base+1, 0.5, vel))
        drums.append((38, base+3, 0.5, vel))
    elif bar>=20 and bar<23:
        for e in range(8):
            drums.append((42, base+e*0.5, 0.25, vel-35))

build_midi(f"{OUT}/mochiichao-title-v2.mid", 140, [
 (0,80,lead),(1,73,counter),(2,88,pad),(3,48,strings),(4,61,brass),(5,38,bass),(6,46,harp),(9,None,drums)])
print("title v2 melody:", " | ".join(" ".join(nm(m) for m,_,_ in b) for b in title_melody))
print(f"title v2 tracks notes: lead={len(lead)} counter={len(counter)} pad={len(pad)} strings={len(strings)} brass={len(brass)} bass={len(bass)} harp={len(harp)} drums={len(drums)} total={len(lead)+len(counter)+len(pad)+len(strings)+len(brass)+len(bass)+len(harp)+len(drums)} bars=24 bpm=140 dur={24*4*60/140:.2f}s")

# ---------- INTRO V2 ----------
# D major, 120 BPM, 12 bars (2x 6-bar phrases). Ends on A dominant -> title D.
intro_chords=[(38,'maj'),(43,'maj'),(47,'min'),(45,'maj'),(43,'maj'),(38,'maj'),
              (40,'min'),(43,'maj'),(47,'min'),(43,'maj'),(38,'maj'),(45,'maj')]
intro_lead=[(74,0,4),(78,8,4),(79,16,4),(81,24,2),(79,26,2),(83,32,2),(81,34,2),(74,40,2),(76,42,2),(81,44,4)]
# intro_lead is (midi, start_beat, dur) absolute, not per bar — handle separately below
lead2=[]; pad2=[]; strings2=[]; bass2=[]; harp2=[]; drums2=[]
for bar,(root,qual) in enumerate(intro_chords):
    base=bar*4; tones=chord(root,qual)
    vel=95 if bar<6 else 108
    for t in tones:
        pad2.append((t+24, base, 4, vel-25))
    # low pulse bass: eighth notes, root only in phrase 1, root/fifth in phrase 2
    for e in range(8):
        bass2.append((root if (bar<6 or e%2==0) else root+7, base+e*0.5, 0.5, vel-10))
    if bar>=6:
        strings2.append((tones[0]+24, base, 2, vel-15))
        strings2.append((tones[2]+24, base+2, 2, vel-15))
        for e in range(8):
            harp2.append(([t+24 for t in tones][e%3], base+e*0.5, 0.5, vel-35))
    if bar>=8:
        for e in range(8):
            drums2.append((42, base+e*0.5, 0.25, vel-35))
for midi,start,dur in intro_lead:
    lead2.append((midi, start, dur, 112))
build_midi(f"{OUT}/mochiichao-intro-v2.mid", 120, [
 (0,80,lead2),(2,88,pad2),(3,48,strings2),(5,38,bass2),(6,46,harp2),(9,None,drums2)])
print(f"intro v2: lead={len(lead2)} pad={len(pad2)} strings={len(strings2)} bass={len(bass2)} harp={len(harp2)} drums={len(drums2)} bars=12 bpm=120 dur={12*4*60/120:.2f}s")
print("intro v2 lead:", " ".join(nm(m) for m,_,_ in intro_lead))
