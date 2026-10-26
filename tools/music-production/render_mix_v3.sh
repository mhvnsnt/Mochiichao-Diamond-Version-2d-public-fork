#!/bin/bash
set -e
cd ~/workspace/mochiichao-work/title-music
SF=/usr/share/sounds/sf2/FluidR3_GM.sf2
for s in title-melody title-bass title-drums title-guitar title-synth title-organ intro-melody intro-bass intro-drums intro-guitar; do
  echo "render stem-$s"
  fluidsynth -ni -g 0.8 -R 0 -C 0 -r 44100 -F "stem-$s.wav" "$SF" "stem-$s.mid" 2>&1 | tail -n 2
done
echo "mix title v3"
ffmpeg -y -v error -i stem-title-melody.wav -i stem-title-bass.wav -i stem-title-drums.wav -i stem-title-guitar.wav -i stem-title-synth.wav -i stem-title-organ.wav -filter_complex "[0:a]highpass=f=80,volume=1.0[m];[1:a]lowpass=f=250,volume=1.1[b];[2:a]highpass=f=40,equalizer=f=5000:width_type=o:width=1:gain=2,volume=1.0[d];[3:a]highpass=f=150,equalizer=f=3000:width_type=o:width=1:gain=3,volume=0.9[g];[4:a]highpass=f=200,volume=0.8[s];[5:a]lowpass=f=5000,volume=0.7[o];[m][b][d][g][s][o]amix=inputs=6:duration=first:normalize=0,atrim=0:41.142857,afade=t=out:st=40.942857:d=0.2,acompressor=threshold=-18dB:ratio=2:attack=10:release=100,alimiter=limit=0.89[a]" -map "[a]" -c:a pcm_s16le mochiichao-title-v3.wav
echo "mix intro v3"
ffmpeg -y -v error -i stem-intro-melody.wav -i stem-intro-bass.wav -i stem-intro-drums.wav -i stem-intro-guitar.wav -filter_complex "[0:a]highpass=f=80,volume=1.0[m];[1:a]lowpass=f=250,volume=1.1[b];[2:a]highpass=f=40,equalizer=f=5000:width_type=o:width=1:gain=2,volume=1.0[d];[3:a]highpass=f=150,equalizer=f=3000:width_type=o:width=1:gain=3,volume=0.9[g];[m][b][d][g]amix=inputs=4:duration=first:normalize=0,atrim=0:24.0,afade=t=out:st=23.8:d=0.2,acompressor=threshold=-18dB:ratio=2:attack=10:release=100,alimiter=limit=0.89[a]" -map "[a]" -c:a pcm_s16le mochiichao-intro-v3.wav
python3 - << 'PY'
import wave, struct, math
for fn in ["mochiichao-title-v3.wav","mochiichao-intro-v3.wav"]:
    with wave.open(f"/home/hatch/workspace/mochiichao-work/title-music/{fn}") as w:
        n=w.getnframes(); fr=w.getframerate(); ch=w.getnchannels()
        vals=struct.unpack(f"<{n*ch}h", w.readframes(n))
        mono=[(vals[i]+vals[i+1])/2 for i in range(0,len(vals),2)] if ch==2 else list(vals)
        peak=max(abs(v) for v in vals); rms=math.sqrt(sum(v*v for v in mono)/len(mono))
        print(fn, f"{n/fr:.3f}s {fr}Hz {ch}ch peak={peak}/32767 ({peak/32767:.2f}) rms={rms:.0f} ({rms/32767:.2f}) first={vals[0]} last={vals[-1]}")
PY
ls -lh mochiichao-*-v3.wav stem-*.wav
