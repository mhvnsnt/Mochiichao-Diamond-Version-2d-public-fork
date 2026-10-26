#!/usr/bin/env python3
"""Main Menu v1 — pop / hyperpop / Y2K J-pop / rap influence, looping.
A major, 144 BPM, 16 bars, loop 26.667 s.
Chords (Komuro vi-IV-V-I, with pop I-V-vi-IV variation in bars 9-12):
 1 F#m, 2 D, 3 E, 4 A, 5 F#m, 6 D, 7 E, 8 A, 9 F#m, 10 D, 11 A, 12 E, 13 F#m, 14 D, 15 E, 16 A
Wait: bar 16 must be E (V) to loop to A (I) cleanly — see chords list below (bar 16 = E).
Phi bar: ceil(0.618*16)=10 -> D bar, fullest hit (crash, hat roll, hook peak).
Layers: hook synth (81 saw, short catchy notes), pop piano (0, eighth chords),
pad (88, add9 shimmer: Aadd9 = A+C#+E+B, Dadd9 = D+F#+A+E), 808 bass (39, syncopated),
drums ch9: four-on-floor kick, snare+clap on 2/4, hats sixteenth in B, glitch roll at phi.
"""
import mido
BASE="/home/hatch/workspace/mochiichao-work/title-music"; TPB=480
def make_track(ch, prog, notes):
    tr=mido.MidiTrack()
    if prog is not None and ch!=9: tr.append(mido.Message('program_change', channel=ch, program=prog, time=0))
    ev=[]
    for midi,start,dur,vel in notes:
        ev.append((int(start*TPB),'on',midi,vel)); ev.append((int((start+dur)*TPB),'off',midi,0))
    ev.sort(key=lambda e:(e[0],0 if e[1]=='off' else 1)); last=0
    for tick,kind,midi,vel in ev:
        d=tick-last; last=tick
        tr.append(mido.Message('note_on' if kind=='on' else 'note_off', channel=ch, note=midi, velocity=vel if kind=='on' else 0, time=d))
    tr.append(mido.MetaMessage('end_of_track', time=0)); return tr
def save(path,bpm,tracks):
    mid=mido.MidiFile(type=1,ticks_per_beat=TPB); meta=mido.MidiTrack(); meta.append(mido.MetaMessage('set_tempo',tempo=mido.bpm2tempo(bpm),time=0)); meta.append(mido.MetaMessage('end_of_track',time=0)); mid.tracks.append(meta)
    for tr in tracks: mid.tracks.append(tr)
    mid.save(path)
# bass roots: F#2=42, D2=38, E2=40, A2=45 ; chord tones (root, third, fifth, add9)
CHORDS=[(42,'min'),(38,'maj'),(40,'maj'),(45,'maj'),(42,'min'),(38,'maj'),(40,'maj'),(45,'maj'),
        (42,'min'),(38,'maj'),(45,'maj'),(40,'maj'),(42,'min'),(38,'maj'),(40,'maj'),(40,'maj')]
def tones(root,qual):
    base=(root,root+3,root+7) if qual=='min' else (root,root+4,root+7)
    # add9: +14 semitones from root (octave+2nd)
    return base+(root+14,)
# hook melody: A major, catchy, repetitive. Notes: A4=69, B4=71, C#5=73, D5=74, E5=76, F#5=78, A5=81, B5=83, C#6=85
HOOK=[
 [(76,0,0.5),(73,0.5,0.5),(69,1,1),(76,2,0.5),(78,2.5,0.5),(76,3,1)],
 [(74,0,1),(76,1,1),(81,2,1),(78,3,1)],
 [(76,0,0.5),(78,0.5,0.5),(81,1,1),(78,2,1),(76,3,1)],
 [(73,0,1),(76,1,1),(81,2,2)],
 [(76,0,0.5),(73,0.5,0.5),(69,1,1),(76,2,0.5),(78,2.5,0.5),(76,3,1)],
 [(74,0,1),(76,1,1),(81,2,1),(78,3,1)],
 [(76,0,0.5),(78,0.5,0.5),(81,1,1),(83,2,1),(81,3,1)],
 [(81,0,2),(78,2,1),(76,3,1)],
 [(76,0,0.5),(73,0.5,0.5),(69,1,1),(76,2,0.5),(78,2.5,0.5),(76,3,1)],
 [(81,0,1),(83,1,1),(85,2,1),(83,3,1)],  # phi bar 10: highest hook note C#6
 [(81,0,1),(78,1,1),(76,2,1),(73,3,1)],
 [(76,0,0.5),(78,0.5,0.5),(81,1,1),(78,2,1),(76,3,1)],
 [(76,0,0.5),(73,0.5,0.5),(69,1,1),(76,2,0.5),(78,2.5,0.5),(76,3,1)],
 [(74,0,1),(76,1,1),(81,2,1),(78,3,1)],
 [(76,0,0.5),(78,0.5,0.5),(81,1,1),(78,2,1),(76,3,1)],
 [(76,0,0.25),(76,0.25,0.25),(76,0.5,0.25),(76,0.75,0.25),(81,1,1),(78,2,1),(76,3,1)],  # glitch stutter into loop
]
hook=[]; piano=[]; pad=[]; bass=[]; drums=[]
for bar,(root,qual) in enumerate(CHORDS):
    base=bar*4; vel=110 if bar<8 else 118
    t=tones(root,qual)
    for midi,off,dur in HOOK[bar]:
        hook.append((midi, base+off, dur, vel+5))
    # piano: eighth-note chord stabs (root+third+fifth, +24)
    for e in range(8):
        for ct in t[:3]:
            piano.append((ct+24, base+e*0.5, 0.5, vel-25))
    # pad: whole-note chord with add9, quiet
    for ct in t:
        pad.append((ct+12, base, 4, vel-35))
    # 808 bass: syncopated — root on 1, octave pop on 2.5, root on 3
    bass.append((root, base, 2, 122)); bass.append((root+12, base+2.5, 0.5, 118)); bass.append((root, base+3, 1, 122))
    # drums: four-on-floor kick, snare+clap on 2/4, hats
    for b in range(4):
        drums.append((36, base+b, 0.25, 120))
    drums.append((38, base+1, 0.5, 118)); drums.append((39, base+1, 0.5, 110))  # snare+clap beat 2
    drums.append((38, base+3, 0.5, 118)); drums.append((39, base+3, 0.5, 110))  # beat 4
    hat_steps=8 if bar<8 else 16
    for e in range(hat_steps):
        drums.append((42, base+e*(4/hat_steps), 0.25, 95 if bar<8 else 100))
    if bar==9:  # phi bar 10: crash + hat roll (32nd-ish, 32 steps)
        drums.append((49, base, 1, 125))
        for e in range(32):
            drums.append((42, base+e*0.125, 0.125, 105))
hook_tr=make_track(0,81,hook); piano_tr=make_track(1,0,piano); pad_tr=make_track(2,88,pad)
bass_tr=make_track(3,39,bass); drums_tr=make_track(9,None,drums)
save(f"{BASE}/mochiichao-main-menu-v1.mid",144,[hook_tr,piano_tr,pad_tr,bass_tr,drums_tr])
save(f"{BASE}/stem-menu-melody.mid",144,[hook_tr,piano_tr,pad_tr])
save(f"{BASE}/stem-menu-bass.mid",144,[bass_tr])
save(f"{BASE}/stem-menu-drums.mid",144,[drums_tr])
print(f"main menu v1: hook={len(hook)} piano={len(piano)} pad={len(pad)} bass={len(bass)} drums={len(drums)} total={len(hook)+len(piano)+len(pad)+len(bass)+len(drums)} bars=16 bpm=144 dur={16*4*60/144:.3f}s")
