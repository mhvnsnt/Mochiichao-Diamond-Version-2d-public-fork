#!/usr/bin/env python3
"""Title/Intro v3: LAYER ON TOP of v2, do not replace v2.
v2 MIDI tracks are loaded and kept exactly; new tracks are appended.
Pokemon-GBA method applied (structure, not samples):
 - Score = MIDI tracks, one voice per track (mid2agb .s model).
 - Fixed voicegroup = GM program list below (GBA voicegroup = instrument per track).
 - Loop point at a bar boundary; no reverb wash (GBA default reverb 0; render -R 0).
 - Per-track balance set in MIDI velocities before render (Anvil-style balancing).
Golden ratio: phi bar = ceil(0.618 * total_bars) -> title 24 bars -> bar 15, intro 12 bars -> bar 8.
Mix targets from v2 waveform analysis: title A RMS ~0.08, B ~0.11, climax ~0.14, peak 0.74.
v3 adds layers from bar 9 onward, fullest at phi bar 15, master target peak 0.89 (-1 dB).
"""
import mido, os, copy
BASE="/home/hatch/workspace/mochiichao-work/title-music"
TPB=480
def make_track(ch, prog, notes):
    """notes: (midi, start_beat, dur, vel) -> MidiTrack with program_change (unless drums ch9)"""
    tr=mido.MidiTrack()
    if prog is not None and ch!=9:
        tr.append(mido.Message('program_change', channel=ch, program=prog, time=0))
    ev=[]
    for midi,start,dur,vel in notes:
        ev.append((int(start*TPB),'on',midi,vel)); ev.append((int((start+dur)*TPB),'off',midi,0))
    ev.sort(key=lambda e:(e[0],0 if e[1]=='off' else 1))
    last=0
    for tick,kind,midi,vel in ev:
        d=tick-last; last=tick
        tr.append(mido.Message('note_on' if kind=='on' else 'note_off', channel=ch, note=midi, velocity=vel if kind=='on' else 0, time=d))
    tr.append(mido.MetaMessage('end_of_track', time=0))
    return tr
def save_midi(path, bpm, tracks):
    mid=mido.MidiFile(type=1, ticks_per_beat=TPB)
    meta=mido.MidiTrack(); meta.append(mido.MetaMessage('set_tempo', tempo=mido.bpm2tempo(bpm), time=0)); meta.append(mido.MetaMessage('end_of_track', time=0))
    mid.tracks.append(meta)
    for tr in tracks: mid.tracks.append(tr)
    mid.save(path)
def load_tracks(path):
    mid=mido.MidiFile(path)
    return mid, list(mid.tracks[1:])  # skip meta

# ---------- TITLE V3 ----------
title_chords=[(38,'maj'),(47,'min'),(43,'maj'),(45,'maj'),(38,'maj'),(47,'min'),(43,'maj'),(45,'maj'),
              (40,'min'),(43,'maj'),(38,'maj'),(45,'maj'),(47,'min'),(43,'maj'),(45,'maj'),(38,'maj'),
              (47,'min'),(43,'maj'),(38,'maj'),(45,'maj'),(38,'maj'),(47,'min'),(45,'maj'),(38,'maj')]
def chord_tones(root,qual):
    return (root, root+4, root+7) if qual=='maj' else (root, root+3, root+7)
title_mid, v2_tracks = load_tracks(f"{BASE}/mochiichao-title-v2.mid")
# v2 track order: 0 lead,1 counter,2 pad,3 strings,4 brass,5 bass,6 harp,7 drums
guitar=[]; synth=[]; synthbrass=[]; organ=[]; subbass=[]; drums_new=[]
for bar,(root,qual) in enumerate(title_chords):
    base=bar*4; tones=chord_tones(root,qual)
    grot=root+12  # guitar root, octave 3
    if bar>=8:  # B section onward
        vel=112 if bar<14 else (122 if bar<20 else 104)
        # distortion guitar: eighth-note power chords, chugging
        for e in range(8):
            guitar.append((grot, base+e*0.5, 0.5, vel))
            guitar.append((grot+7, base+e*0.5, 0.5, vel-10))
        # synth brass: sustained chord, B onward
        for t in tones:
            synthbrass.append((t+24, base, 4, vel-25))
        # sub-bass: long root notes, 2 beats each
        subbass.append((root, base, 2, 120)); subbass.append((root, base+2, 2, 120))
        # hip-hop drums extra: syncopated kick + ghost snare + sixteenth hats in climax
        drums_new.append((36, base+0.75, 0.25, vel))   # syncopated kick
        drums_new.append((36, base+2.75, 0.25, vel))
        drums_new.append((38, base+1.75, 0.25, vel-30)) # ghost snare
        drums_new.append((38, base+3.75, 0.25, vel-30))
        if bar>=16:
            for e in range(16):
                drums_new.append((42, base+e*0.25, 0.25, vel-25))  # sixteenth hats in climax
    if bar==14:  # PHI BAR 15 (0-indexed 14): crash + all layers at fullest
        drums_new.append((49, base, 1, 125))
    if bar>=14:  # organ enters at phi bar, stays through resolve (Nosferatu dark)
        for t in tones:
            organ.append((t+12, base, 4, 88))
    if bar==14 or 16<=bar<20:  # synth saw doubles lead melody at phi + climax
        # lead melody for this bar, from v2 compose (re-declared here, same notes, not copied from Pokemon)
        pass
# synth lead doubling: re-use v2 lead notes by parsing v2 lead track (channel 0) note-ons with times
# Simpler: copy lead track notes, shift +0 octaves, keep only bars 15 and 17-20, as a new track with prog 81.
# Parse v2 lead track:
lead_events=[]; tick=0
for msg in v2_tracks[0]:
    tick+=msg.time
    if msg.type=='note_on' and msg.velocity>0:
        lead_events.append((tick/TPB, msg.note))
# group by bar
from collections import defaultdict
by_bar=defaultdict(list)
for start,note in lead_events:
    by_bar[int(start//4)].append((start,note))
# durations: next start in same bar, or bar end
for bar in [14,16,17,18,19]:
    notes=sorted(by_bar[bar])
    for i,(start,note) in enumerate(notes):
        end=notes[i+1][0] if i+1<len(notes) else (bar+1)*4
        synth.append((note, start, end-start, 100))

guitar_tr=make_track(7,30,guitar); synth_tr=make_track(8,81,synth); sbrass_tr=make_track(10,62,synthbrass)
organ_tr=make_track(11,19,organ); sub_tr=make_track(12,39,subbass); dnew_tr=make_track(9,None,drums_new)
save_midi(f"{BASE}/mochiichao-title-v3.mid",140, v2_tracks+[guitar_tr,synth_tr,sbrass_tr,organ_tr,sub_tr,dnew_tr])
print(f"TITLE v3 new: guitar={len(guitar)} synth={len(synth)} synthbrass={len(synthbrass)} organ={len(organ)} subbass={len(subbass)} drums_new={len(drums_new)}")
# stems: melody_core = v2 lead,counter,pad,strings,brass,harp (tracks 0-4,6); bass_all = v2 bass + sub; drums_all = v2 drums + drums_new; guitar; synth_all = synth + synthbrass; organ
melody_core=[v2_tracks[i] for i in [0,1,2,3,4,6]]
save_midi(f"{BASE}/stem-title-melody.mid",140,melody_core)
save_midi(f"{BASE}/stem-title-bass.mid",140,[v2_tracks[5],sub_tr])
save_midi(f"{BASE}/stem-title-drums.mid",140,[v2_tracks[7],dnew_tr])
save_midi(f"{BASE}/stem-title-guitar.mid",140,[guitar_tr])
save_midi(f"{BASE}/stem-title-synth.mid",140,[synth_tr,sbrass_tr])
save_midi(f"{BASE}/stem-title-organ.mid",140,[organ_tr])

# ---------- INTRO V3 ----------
intro_chords=[(38,'maj'),(43,'maj'),(47,'min'),(45,'maj'),(43,'maj'),(38,'maj'),
              (40,'min'),(43,'maj'),(47,'min'),(43,'maj'),(38,'maj'),(45,'maj')]
intro_mid, iv2 = load_tracks(f"{BASE}/mochiichao-intro-v2.mid")
# iv2 order: 0 lead,1 pad,2 strings,3 bass,4 harp,5 drums
iguitar=[]; isub=[]; idrums=[]
for bar,(root,qual) in enumerate(intro_chords):
    base=bar*4; tones=chord_tones(root,qual); grot=root+12
    if bar>=6:  # phrase 2: rap beat + guitar, less than title (no organ, no synth)
        # guitar: half-note power chords
        iguitar.append((grot, base, 2, 110)); iguitar.append((grot+7, base, 2, 100))
        iguitar.append((grot, base+2, 2, 110)); iguitar.append((grot+7, base+2, 2, 100))
        # sub-bass syncopated: root long, octave up on beat 3 (offset 2.5)
        isub.append((root, base, 2, 120)); isub.append((root+12, base+2.5, 0.5, 115)); isub.append((root, base+3, 1, 120))
        # hip-hop drums: kick 1 + 3.5, snare 2 + 4, hats eighth
        idrums.append((36, base, 0.5, 115)); idrums.append((36, base+2.5, 0.5, 115))
        idrums.append((38, base+1, 0.5, 115)); idrums.append((38, base+3, 0.5, 115))
        for e in range(8):
            idrums.append((42, base+e*0.5, 0.25, 95))
    if bar==7:  # PHI BAR 8: crash + guitar chugging instead of half notes (add eighths, keep halves too? replace by adding chug notes)
        idrums.append((49, base, 1, 125))
        for e in range(8):
            iguitar.append((grot, base+e*0.5, 0.5, 118))
ig_tr=make_track(7,30,iguitar); isub_tr=make_track(12,39,isub); idr_tr=make_track(9,None,idrums)
save_midi(f"{BASE}/mochiichao-intro-v3.mid",120, iv2+[ig_tr,isub_tr,idr_tr])
print(f"INTRO v3 new: guitar={len(iguitar)} subbass={len(isub)} drums={len(idrums)}")
save_midi(f"{BASE}/stem-intro-melody.mid",120,[iv2[i] for i in [0,1,2,4]])
save_midi(f"{BASE}/stem-intro-bass.mid",120,[iv2[3],isub_tr])
save_midi(f"{BASE}/stem-intro-drums.mid",120,[iv2[5],idr_tr])
save_midi(f"{BASE}/stem-intro-guitar.mid",120,[ig_tr])
print("v3 MIDIs + stems written")
