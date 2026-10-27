#!/usr/bin/env python3
"""Neon v2 cry synthesis — Floatcalf + Astroleviathan ONLY, staged only.
Mars correction 2026-10-26 ~14:06 CDT: Neon = Electric (Pokemon-first).
This REPLACES the earlier cosmic-glow proposal timbre for Neon creatures
with an Electric buzz/crackle texture. Base parameters are reused
exactly from synth-all-47-20261026.py (f0 glide, duration, vibrato,
base texture); an Electric layer is added on top. No other creature
is regenerated here, no v1 WAV is overwritten, no repo file is touched.
Output: audio/floatcalf-cry-v2.wav, audio/astroleviathan-cry-v2.wav,
16-bit PCM stereo WAV, 44100 Hz, one-shot.
Note on seeds: the v1 script seeded noise with Python hash(name),
which is salted per process, so v2 uses a stable md5-based seed
instead. Base parameters are identical; only the Electric layer and
the noise seed method differ from v1, and v2 files are new files.
"""
import hashlib
import math
import os
import struct
import wave

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


def synth(name, f0a, f0b, dur, texture, vib_hz, vib_depth, seed, buzz_freq):
    rng = np.random.default_rng(seed)
    n = int(SR * dur)
    t = np.arange(n) / SR
    glide = f0a + (f0b - f0a) * (t / dur) ** 1.2
    phase = 2 * np.pi * np.cumsum(glide * (1 + vib_depth * np.sin(2 * np.pi * vib_hz * t))) / SR
    atk = int(0.08 * SR) if texture not in ("whisper", "drone", "chime") else int(0.25 * SR)
    env = np.ones(n)
    env[:atk] = np.linspace(0, 1, atk)
    env = env * np.exp(-1.2 * t / dur)
    env[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR))
    voice = np.sin(phase) * 0.55 + np.sin(2 * phase) * 0.22 + np.sin(3 * phase) * 0.10
    noise = rng.standard_normal(n)
    if texture in ("bubble",):
        tex = np.zeros(n)
        for _ in range(14):
            c = int(rng.uniform(0.1, 0.9) * n)
            w = int(rng.uniform(0.01, 0.03) * SR)
            tex[c:c + w] += np.sin(2 * np.pi * rng.uniform(500, 1100) * np.arange(w) / SR) * np.hanning(w)
        voice = voice * 0.7 + tex * 0.5
    elif texture in ("drone",):
        voice = np.sin(phase) * 0.6 + np.sin(phase * 1.5) * 0.3 + lowpass(noise, 0.05) * 0.2
    else:
        voice = voice
    sig = voice * env
    # Electric layer (NEW for v2, Mars Neon = Electric): buzz + crackle,
    # gated by a slow envelope so it reads as discharge, not a drone.
    # Buzz is a square-ish tone at buzz_freq; crackle is sparse short
    # high-frequency bursts. Both ride the same cry envelope, so the
    # Electric texture fades in and out with the cry itself.
    buzz = np.sign(np.sin(2 * np.pi * buzz_freq * t)) * 0.12
    gate = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * t)
    crack = np.zeros(n)
    for _ in range(40):
        c = int(rng.uniform(0.05, 0.95) * n)
        w = int(0.004 * SR)
        crack[c:c + w] += rng.standard_normal(w) * np.hanning(w)
    electric = (buzz * gate + crack * 0.35) * 0.30
    sig = sig + electric * env
    left = sig
    right = np.roll(sig, 220) * 0.92
    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo)) + 1e-9
    stereo = stereo / peak * 0.89
    return stereo


# name, id, f0_start, f0_end, duration, base_texture, vibrato_hz,
# vibrato_depth, buzz_freq, proposal (v2)
CREATURES = [
    ("Floatcalf", "024", 600, 450, 1.4, "bubble", 6, 0.04, 1500,
     "Mid floating calf-whale bloop with Electric buzz/crackle (Neon = Electric, Mars 2026-10-26)."),
    ("Astroleviathan", "025", 200, 320, 1.9, "drone", 3, 0.03, 900,
     "Low-to-mid cosmic whale drone with Electric buzz/crackle swell (Neon = Electric, Mars 2026-10-26)."),
]

for (name, cid, f0a, f0b, dur, texture, vib_hz, vib_depth, buzz_freq, proposal) in CREATURES:
    seed = int(hashlib.md5(name.encode()).hexdigest()[:8], 16)
    stereo = synth(name, f0a, f0b, dur, texture, vib_hz, vib_depth, seed, buzz_freq)
    fname = f"{name.lower()}-cry-v2.wav"
    path = os.path.join(OUT, fname)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        ints = (stereo * 32767).astype(np.int16)
        w.writeframes(ints.tobytes())
    rms = float(np.sqrt(np.mean(stereo ** 2)))
    print(f"{cid} {name} {fname} {dur}s rms={rms:.4f} buzz={buzz_freq}Hz")
print("total", len(CREATURES))
