#!/usr/bin/env python3
"""Staged-only synthesis for the two missing title-pool cries.

Dorowani (#147) and Gabu (#148) were missing from the 47-file roster
set (001-046 + 331 Mythar = 8/10 title-pool creatures). This script
creates ONLY these two new files, and touches no other WAV.

Method: same 60/40 method as synth-all-47-20261026.py — 60% Mochiichao
original procedural synthesis, 40% Pokemon SYSTEM (species-indexed cry
table, title-press 90-frame / 1.5s timing reference, reuse across
title/battle/lab) — system only, zero copied Pokemon audio, no samples,
no recorded sounds.

Mars's final word, applied here:
- Dorowani: NON-VERBAL water sweep only. No speech, no Japanese word
  barks, no bark burst. Western Heart backstory (multiverse origin)
  does NOT change this cry; a future speaking Dorowani is a gated
  Meowth-like special case, not this file.
- Gabu: mid bright spiky chirp with faint crown ping only. Western
  Heart Gabu was Dorowani's alternate attire/ladder character, not a
  standalone character — that explains the missing standalone canon,
  it does not change Gabu's Mochiichao cry, and no chomp layer is added.

Output: 16-bit PCM stereo WAV, 44100 Hz.
Deterministic: seeds from zlib.crc32(name), NOT Python's hash(), so
reruns reproduce byte-identical audio.
"""
import os, wave, zlib
import numpy as np

SR = 44100
OUT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/cries/audio"
os.makedirs(OUT, exist_ok=True)


def lowpass(x, alpha=0.08):
    y = np.zeros_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc)
        y[i] = acc
    return y


def synth(f0a, f0b, dur, texture, vib_hz, vib_depth, seed, ping=False):
    rng = np.random.default_rng(seed)
    n = int(SR * dur)
    t = np.arange(n) / SR
    glide = f0a + (f0b - f0a) * (t / dur) ** 1.2
    phase = 2 * np.pi * np.cumsum(
        glide * (1 + vib_depth * np.sin(2 * np.pi * vib_hz * t))) / SR
    atk = int(0.08 * SR)
    env = np.ones(n)
    env[:atk] = np.linspace(0, 1, atk)
    env = env * np.exp(-1.2 * t / dur)
    env[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR))
    voice = np.sin(phase) * 0.55 + np.sin(2 * phase) * 0.22 + np.sin(3 * phase) * 0.10
    noise = rng.standard_normal(n)
    if texture == "sweep":
        # Dorowani: mid clear watery rising sweep. Filtered-noise water
        # bed swelling under a rising fundamental, no words, no barks.
        tex = lowpass(noise, 0.2) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * t))
        voice = voice * 0.6 + tex * 0.5
    elif texture == "chirp":
        # Gabu: mid bright spiky chirp. Fast amplitude modulation for
        # the spiky character, plus (if ping=True) a faint high crown
        # ping decaying over the first 0.3s — a tone, not a word.
        am = 1 + 0.35 * np.sin(2 * np.pi * 8 * t)
        voice = voice * am * 0.8
        if ping:
            pn = int(0.3 * SR)
            tt = np.arange(pn) / SR
            voice[:pn] += np.sin(2 * np.pi * 1760 * tt) * np.exp(-8.0 * tt) * 0.18
    sig = voice * env
    left = sig
    right = np.roll(sig, 220) * 0.92
    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo)) + 1e-9
    return stereo / peak * 0.89


def write_wav(name, stereo):
    path = os.path.join(OUT, f"{name}-cry.wav")
    assert not os.path.exists(path), f"refusing to overwrite existing {path}"
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    rms = float(np.sqrt(np.mean(stereo ** 2)))
    print(f"{name} {path} {stereo.shape[0] / SR:.2f}s rms={rms:.4f}")
    return path


# Dorowani #147: mid clear watery rising sweep, 1.5s, non-verbal.
dor = synth(520, 880, 1.5, "sweep", 4, 0.02, zlib.crc32(b"Dorowani"))
write_wav("dorowani", dor)

# Gabu #148: mid bright spiky chirp with faint crown ping, 1.2s.
gab = synth(820, 620, 1.2, "chirp", 9, 0.04, zlib.crc32(b"Gabu"), ping=True)
write_wav("gabu", gab)

print("done: 2 new files, no other WAV touched")
