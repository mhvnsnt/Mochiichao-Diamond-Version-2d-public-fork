#!/usr/bin/env python3
"""cry_synth.py — Mochiichao CRY SYNTH reference renderer (stdlib only).

Renders a species cry (.wav, mono 16-bit PCM) from a per-species
parameter block, following the classic creature-collector design found
by the Sideline D teardown: a small set of base waveform "voices" is
made species-unique by a pitch envelope, an amplitude envelope,
vibrato, a noise/breath mix, and an optional echo — the same trick the
Game Boy-era games used (37 base cries differentiated into 151 species
by pitch/length/echo/channel parameters), modernised into a JSON
parameter block that lives on the species sheet.

See CRY-SYNTH.md in this package for the full spec. The parameter
block schema is defined by species-sheet-schema-patch-cry.md /
cry-schema-fragment.json in this package.

Usage:
    python3 cry_synth.py params.json -o out_dir
        params.json maps species slug -> cry parameter block (the
        "synth" object of the sheet's cry block). One <slug>-cry.wav
        is written per species.
    python3 cry_synth.py --demo
        Renders the built-in pilot-six parameter set to ./cries-out/.

Stdlib only: math, random, struct, wave, json, sys.
"""

import json
import math
import random
import struct
import sys
import wave

SAMPLE_RATE = 22050  # Hz; plenty for cries, keeps files repo-sized


# ----------------------------------------------------------------------
# Waveform families ("base cries"). Each takes a phase in cycles
# (0..1 repeating) plus a duty value and returns amplitude in [-1, 1].
# These are OUR OWN base voices, named for the role they play; no
# sampled or copied game audio is used anywhere in this pipeline.
# ----------------------------------------------------------------------

def _w_sine(phase, duty):
    return math.sin(2.0 * math.pi * phase)


def _w_triangle(phase, duty):
    # clean triangle: rises -1..1 over first half, falls over second
    p = phase % 1.0
    if p < 0.5:
        return -1.0 + 4.0 * p
    return 3.0 - 4.0 * p


def _w_saw_soft(phase, duty):
    p = phase % 1.0
    x = 2.0 * p - 1.0
    return x - (x ** 3) / 6.0  # gentle soft-clip, less buzzy than raw saw


def _w_pulse(phase, duty):
    p = phase % 1.0
    return 1.0 if p < duty else -1.0


def _w_square_soft(phase, duty):
    p = phase % 1.0
    x = 1.0 if p < duty else -1.0
    return x * 0.85


WAVEFORMS = {
    "sine": _w_sine,
    "triangle": _w_triangle,
    "saw_soft": _w_saw_soft,
    "pulse12": lambda ph, d: _w_pulse(ph, 0.125),
    "pulse25": lambda ph, d: _w_pulse(ph, 0.25),
    "pulse50": lambda ph, d: _w_square_soft(ph, 0.5),
    "pulse_pwm": lambda ph, d: _w_pulse(ph, d),  # duty swept by pwm params
}


def _interp(points, t):
    """Piecewise-linear interpolation over [[t, v], ...] keyframes.

    t is normalised 0..1. Values clamp outside the keyframe range.
    """
    if not points:
        return 0.0
    if t <= points[0][0]:
        return points[0][1]
    if t >= points[-1][0]:
        return points[-1][1]
    for i in range(len(points) - 1):
        t0, v0 = points[i]
        t1, v1 = points[i + 1]
        if t0 <= t <= t1:
            if t1 == t0:
                return v1
            f = (t - t0) / (t1 - t0)
            return v0 + (v1 - v0) * f
    return points[-1][1]


def render_cry(params, sample_rate=SAMPLE_RATE):
    """Render one cry. Returns a list of floats in [-1, 1].

    params is the "synth" object of a species-sheet cry block
    (see species-sheet-schema-patch-cry.md).
    """
    length_s = float(params.get("length_s", 0.6))
    n = max(1, int(round(length_s * sample_rate)))
    base_hz = float(params.get("base_hz", 440.0))
    pitch_env = params.get("pitch_env", [[0.0, 0.0], [1.0, 0.0]])
    amp_env = params.get("amp_env", [[0.0, 0.0], [0.08, 1.0], [0.85, 1.0], [1.0, 0.0]])
    wave_a = WAVEFORMS[params.get("wave_a", "sine")]
    wave_b = WAVEFORMS[params.get("wave_b", params.get("wave_a", "sine"))]
    morph = float(params.get("morph", 0.0))  # 0 = all wave_a, 1 = all wave_b by end

    vib = params.get("vibrato", {}) or {}
    vib_rate = float(vib.get("rate_hz", 0.0))
    vib_depth = float(vib.get("depth_st", 0.0))
    vib_delay = float(vib.get("delay_s", 0.0))

    pwm = params.get("pwm", {}) or {}
    pwm_rate = float(pwm.get("rate_hz", 0.0))
    pwm_lo = float(pwm.get("duty_lo", 0.2))
    pwm_hi = float(pwm.get("duty_hi", 0.5))

    trem = params.get("tremolo", {}) or {}
    trem_rate = float(trem.get("rate_hz", 0.0))
    trem_depth = float(trem.get("depth", 0.0))

    noise_mix = float(params.get("noise_mix", 0.0))
    noise_tone = float(params.get("noise_tone", 0.5))  # 0 = dark rumble, 1 = bright hiss
    crackle = float(params.get("crackle", 0.0))  # 0..1 density of tiny pops
    seed = int(params.get("seed", 1))
    rng = random.Random(seed)

    out = [0.0] * n
    phase = 0.0
    noise_lp = 0.0
    lp_coeff = 0.02 + 0.6 * noise_tone  # one-pole lowpass smoothing for breath noise
    # pre-roll crackle pop positions (sparse impulses with fast decay)
    pops = {}
    if crackle > 0.0:
        expected = int(crackle * length_s * 90)
        for _ in range(expected):
            pops[rng.randrange(n)] = rng.uniform(0.3, 1.0) * (1 if rng.random() < 0.5 else -1)
    pop_tail = 0.0

    for i in range(n):
        t = i / sample_rate
        tn = i / max(1, n - 1)
        # pitch: envelope (semitones) + vibrato
        st = _interp(pitch_env, tn)
        if vib_rate > 0.0 and t > vib_delay:
            st += vib_depth * math.sin(2.0 * math.pi * vib_rate * (t - vib_delay))
        freq = base_hz * (2.0 ** (st / 12.0))
        phase += freq / sample_rate
        duty = 0.5
        if pwm_rate > 0.0:
            duty = pwm_lo + (pwm_hi - pwm_lo) * (0.5 + 0.5 * math.sin(2.0 * math.pi * pwm_rate * t))
        va = wave_a(phase, duty)
        vb = wave_b(phase, duty)
        voice = va * (1.0 - morph * tn) + vb * (morph * tn)
        amp = _interp(amp_env, tn)
        if trem_rate > 0.0:
            amp *= (1.0 - trem_depth) + trem_depth * (0.5 + 0.5 * math.sin(2.0 * math.pi * trem_rate * t))
        # breath noise (lowpassed white noise)
        white = rng.uniform(-1.0, 1.0)
        noise_lp += lp_coeff * (white - noise_lp)
        noise = noise_lp * 2.2
        # crackle pops
        if i in pops:
            pop_tail = pops[i]
        pop = pop_tail
        pop_tail *= 0.55
        sample = (voice * (1.0 - noise_mix) + noise * noise_mix) * amp
        sample += pop * amp * 0.6
        out[i] = sample

    # echo (the Gen I differentiator: repeats of the same base cry)
    echo = params.get("echo", {}) or {}
    e_delay = float(echo.get("delay_s", 0.0))
    e_decay = float(echo.get("decay", 0.5))
    e_repeats = int(echo.get("repeats", 0))
    if e_delay > 0.0 and e_repeats > 0:
        d = int(round(e_delay * sample_rate))
        base = list(out)
        for k in range(1, e_repeats + 1):
            g = e_decay ** k
            off = d * k
            for i in range(off, n):
                out[i] += g * base[i - off]

    # normalise + anti-click fade
    peak = max(1e-6, max(abs(x) for x in out))
    gain = 0.85 / peak
    fade = max(1, int(0.005 * sample_rate))
    for i in range(n):
        out[i] *= gain
        if i >= n - fade:
            out[i] *= (n - i) / fade
    return out


def write_wav(path, samples, sample_rate=SAMPLE_RATE):
    frames = b"".join(
        struct.pack("<h", int(max(-1.0, min(1.0, x)) * 32767)) for x in samples
    )
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sample_rate)
        w.writeframes(frames)


def render_set(param_map, out_dir):
    import os
    os.makedirs(out_dir, exist_ok=True)
    report = {}
    for slug, block in sorted(param_map.items()):
        if slug.startswith("_") or not isinstance(block, dict):
            continue  # tolerate annotation keys (e.g. "_about") in param files
        synth = block.get("synth", block)
        samples = render_cry(synth)
        path = os.path.join(out_dir, f"{slug}-cry.wav")
        write_wav(path, samples)
        peak = max(abs(x) for x in samples)
        rms = math.sqrt(sum(x * x for x in samples) / len(samples))
        report[slug] = {
            "file": path,
            "duration_s": round(len(samples) / SAMPLE_RATE, 3),
            "peak": round(peak, 3),
            "rms": round(rms, 3),
            "bytes": 44 + 2 * len(samples),
        }
    return report


# Pilot-six parameter set lives beside this file as pilot_six_cries.json
# (kept as data, not code, so the design lane can edit it directly).

def main(argv):
    import os
    here = os.path.dirname(os.path.abspath(__file__))
    if len(argv) >= 2 and argv[1] == "--demo":
        src = os.path.join(here, "pilot_six_cries.json")
        out_dir = os.path.join(here, "cries-out")
    elif len(argv) >= 2:
        src = argv[1]
        out_dir = "cries-out"
        if "-o" in argv:
            out_dir = argv[argv.index("-o") + 1]
    else:
        print(__doc__)
        return 2
    with open(src, "r", encoding="utf-8") as f:
        param_map = json.load(f)
    report = render_set(param_map, out_dir)
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
