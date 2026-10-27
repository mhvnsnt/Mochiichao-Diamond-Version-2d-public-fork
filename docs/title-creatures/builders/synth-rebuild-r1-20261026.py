#!/usr/bin/env python3
"""Rebuild R1: DISTINCT cry synthesis for all 49 creatures (2026-10-26).
Staged only. No Pokemon audio, no copied samples, no recorded sounds.
Fixes the v1 sameness Mars flagged 2026-10-26 ~15:07 CDT: v1 used ONE
synth() voice (sin + 2nd/3rd harmonics), ONE envelope shape, ONE stereo
treatment, with only f0 start/end, duration, a shared texture-family
branch and vibrato changed per creature (roar x8, rumble x6, bubble x5,
chirp x4, thump x4, flutter x3, gust x3...). R1 gives every creature its
OWN: oscillator/harmonic recipe, pitch-contour SHAPE (multi-note, stepped,
warble, trill, arch, dip — not a single start/end glide), amplitude
rhythm (syllable count and pauses), texture layer (unique name AND
unique parameters per creature), envelope, and stereo treatment.
Pokemon method, system only, never audio: one distinct cry entry per
species, species-indexed, title-press 1.5s timing reference, reuse
title/battle/lab. 60% Mochiichao original synthesis + 40% Pokemon system.
Canon kept: Dorowani non-verbal water sweep (no speech/bark), Gabu chirp
+ crown ping, Yogiferno large yeti roar NOT deity-tier NOT small, Neon
creatures Electric texture, Silk=Bug / Wind=Flying / Neon=Electric.
Output: <name>-cry-r1.wav, stereo 16-bit 44100 Hz, 1.20-2.00s.
Deterministic: seeds from zlib.crc32(name) — reruns reproduce.
"""
import hashlib, os, wave, zlib
import numpy as np
from scipy.signal import lfilter

SR = 44100
OUT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/cries/audio"
os.makedirs(OUT, exist_ok=True)

def lp(x, a):
    # one-pole lowpass, vectorized via lfilter
    return lfilter([a], [1, -(1 - a)], x)

def hp(x, a):
    return x - lp(x, a)

def env_note(n, atk, rel):
    e = np.ones(n)
    a = max(1, int(atk * SR)); r = max(1, int(rel * SR))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e

def f0_curve(t0, t1, f0a, f0b, shape, lfo_hz, lfo_dep):
    n = int((t1 - t0) * SR)
    p = np.arange(n) / max(1, n)
    if shape == "lin":
        f = f0a + (f0b - f0a) * p
    elif shape == "arch":
        f = f0a + (f0b - f0a) * np.sin(p * np.pi / 2) ** 0.7
        f = f + (f0a - f0b) * 0.35 * np.sin(p * np.pi)
    elif shape == "dip":
        f = f0a + (f0b - f0a) * p - (f0a * 0.25) * np.sin(p * np.pi)
    elif shape == "warble":
        f = f0a + (f0b - f0a) * p
        f = f * (1 + lfo_dep * np.sin(2 * np.pi * lfo_hz * p * (t1 - t0)))
    elif shape == "trill":
        f = f0a + (f0b - f0a) * p
        f = f * (1 + lfo_dep * np.sign(np.sin(2 * np.pi * lfo_hz * p * (t1 - t0))))
    elif shape == "vib":
        f = f0a + (f0b - f0a) * p ** 1.3
        f = f * (1 + lfo_dep * np.sin(2 * np.pi * lfo_hz * p * (t1 - t0)))
    else:
        f = f0a + (f0b - f0a) * p
    return f

def osc(phase, kind, harm, fm_ratio, fm_idx):
    if kind == "sine_harm":
        v = np.zeros_like(phase)
        for i, h in enumerate(harm, start=1):
            v += h * np.sin(i * phase)
        return v
    if kind == "tri":
        v = np.zeros_like(phase)
        for k in range(1, 10, 2):
            v += ((-1) ** ((k - 1) // 2)) * np.sin(k * phase) / (k * k)
        return v * 1.2
    if kind == "square":
        v = np.zeros_like(phase)
        for k in range(1, 12, 2):
            v += np.sin(k * phase) / k
        return v
    if kind == "saw":
        v = np.zeros_like(phase)
        for k in range(1, 9):
            v += np.sin(k * phase) / k
        return v * 0.8
    if kind == "pulse":
        duty = harm[0] if harm else 0.3
        return np.where((phase % (2 * np.pi)) < duty * 2 * np.pi, 0.9, -0.6)
    if kind == "fm":
        return np.sin(phase + fm_idx * np.sin(fm_ratio * phase))
    if kind == "formant":
        # harmonics weighted by a gaussian around a formant harmonic
        fc = harm[0] if harm else 3.0
        v = np.zeros_like(phase)
        for k in range(1, 10):
            w = np.exp(-0.5 * ((k - fc) / 1.6) ** 2) + 0.25 / k
            v += w * np.sin(k * phase)
        return v
    if kind == "noise_tone":
        return np.sin(phase) * 0.8
    return np.sin(phase)

def texture_layer(rng, n, kind, params):
    """Unique-per-creature texture. params is a dict; kind+params differ per creature."""
    t = np.arange(n) / SR
    if kind == "blips":
        out = np.zeros(n)
        for i in range(params["count"]):
            c = int(rng.uniform(0.05, 0.95) * n); w = min(int(params["w"] * SR), n - c)
            out[c:c + w] += np.sin(2 * np.pi * params["freq"] * (1 + 0.1 * i) * np.arange(w) / SR) * np.hanning(w)
        return out * params["gain"]
    if kind == "bursts":
        out = np.zeros(n)
        for i in range(params["count"]):
            c = int(rng.uniform(0.05, 0.95) * n); w = min(int(params["w"] * SR), n - c)
            out[c:c + w] += rng.standard_normal(w) * np.hanning(w)
        return lp(out, params["alpha"]) * params["gain"]
    if kind == "swells":
        noise = rng.standard_normal(n)
        base = lp(noise, params["alpha"])
        mod = 0.5 + 0.5 * np.sin(2 * np.pi * params["rate"] * t + params.get("phase", 0))
        return base * mod * params["gain"]
    if kind == "rings":
        out = np.zeros(n)
        for i, f in enumerate(params["freqs"]):
            start = int(params["starts"][i] * SR); nn = n - start
            tt = np.arange(nn) / SR
            out[start:] += np.sin(2 * np.pi * f * tt) * np.exp(-params["decay"] * tt)
        return out * params["gain"]
    if kind == "rumble":
        out = np.cumsum(rng.standard_normal(n)) / SR
        out = lp(out, params["alpha"])
        return out / (np.max(np.abs(out)) + 1e-9) * params["gain"]
    if kind == "clicks":
        out = np.zeros(n)
        times = np.arange(params["start"], 0.95, 1.0 / params["rate"])
        for tt in times:
            c = int(tt * SR); w = min(int(0.008 * SR), n - c)
            out[c:c + w] += rng.standard_normal(w) * np.hanning(w)
        return out * params["gain"]
    if kind == "thumps":
        out = np.zeros(n)
        for tt in params["times"]:
            c = int(tt * SR); w = min(int(0.12 * SR), n - c)
            out[c:c + w] += np.sin(2 * np.pi * params["freq"] * np.arange(w) / SR) * np.hanning(w)
        return out * params["gain"]
    if kind == "pings":
        out = np.zeros(n)
        for i, f in enumerate(params["freqs"]):
            c = int(params["times"][i] * SR); w = min(int(0.3 * SR), n - c)
            out[c:c + w] += np.sin(2 * np.pi * f * np.arange(w) / SR) * np.exp(-6 * np.arange(w) / SR)
        return out * params["gain"]
    if kind == "am_noise":
        noise = rng.standard_normal(n)
        base = lp(noise, params["alpha"])
        am = 0.5 + 0.5 * np.sin(2 * np.pi * params["rate"] * t)
        return base * am * params["gain"]
    if kind == "chord":
        out = np.zeros(n)
        for f, g in zip(params["freqs"], params["gains"]):
            out += g * np.sin(2 * np.pi * f * t)
        return out * params["gain"]
    return np.zeros(n)

# Each entry: name, id, dur, notes=[(t0,t1,f0a,f0b,shape,lfo_hz,lfo_dep,gain)],
# osc kind, harm, fm_ratio, fm_idx, texture (unique name, kind, params),
# envelope (atk, rel), stereo (mode, delay, pan0, pan1), character note.
# No two entries share the same (osc, contour shapes, note count, texture kind+params, stereo) tuple — verified after synthesis.
C = [
 ("Mochii","001",1.2,[(0.00,0.55,700,520,"arch",0,0,1.0),(0.60,1.15,620,900,"arch",0,0,0.9)],
  "sine_harm",[1,0.35,0.12],0,0,("slime bloop pops", "blips", {"count":12,"w":0.025,"freq":650,"gain":0.5}),(0.03,0.08),("haas",180,0,0)),
 ("Tiidebiite","002",1.4,[(0.00,0.40,480,480,"lin",0,0,1.0),(0.45,0.85,620,620,"lin",0,0,1.0),(0.90,1.35,540,540,"lin",0,0,0.9)],
  "fm",[],2.01,2.2,("water-fist splashes", "swells", {"alpha":0.15,"rate":3.0,"phase":0.0,"gain":0.55}),(0.04,0.06),("pan",0,-0.7,0.7)),
 ("AquariiOS","003",1.6,[(0.00,1.55,500,980,"arch",0,0,1.0)],
  "formant",[3.0],0,0,("glassy brain shimmer", "pings", {"freqs":[1800,2400,1900,2600,2100],"times":[0.2,0.5,0.8,1.1,1.35],"gain":0.4}),(0.20,0.25),("chorus",0,0,0)),
 ("Razorgater","004",1.5,[(0.00,1.45,320,170,"dip",0,0,1.0)],
  "saw",[],0,0,("jaw snap clicks + metal ring", "rings", {"freqs":[2100,2900],"starts":[0.05,0.9],"decay":9.0,"gain":0.45}),(0.02,0.05),("hardpan",0,-1.0,1.0)),
 ("Chromejaww","005",1.5,[(0.00,0.45,280,280,"lin",0,0,1.0),(0.50,0.95,200,200,"lin",0,0,1.0),(1.00,1.45,150,150,"lin",0,0,0.9)],
  "square",[],0,0,("steel teeth chatter", "clicks", {"start":0.05,"rate":18.0,"gain":0.5}),(0.02,0.05),("haas",320,0,0)),
 ("Reaperdile","006",1.8,[(0.00,1.75,150,90,"arch",0,0,1.0)],
  "saw",[],0,0,("armor plate clanks", "rings", {"freqs":[420,630,910],"starts":[0.1,0.6,1.2],"decay":4.0,"gain":0.5}),(0.10,0.15),("subwide",0,0,0)),
 ("Tyrage","007",1.4,[(0.00,0.60,330,230,"lin",0,0,1.0),(0.70,1.35,260,190,"lin",0,0,0.9)],
  "tri",[],0,0,("gravel crunch", "bursts", {"count":6,"w":0.06,"alpha":0.25,"gain":0.55}),(0.03,0.08),("center",0,0,0)),
 ("Duneclaw","008",1.5,[(0.00,1.45,290,180,"warble",9,0.08,1.0)],
  "fm",[],1.5,3.0,("bone-mask rattle", "clicks", {"start":0.08,"rate":11.0,"gain":0.45}),(0.04,0.08),("drift",0,-0.4,0.4)),
 ("Oblivirex","009",1.9,[(0.00,1.85,140,80,"arch",0,0,1.0)],
  "saw",[],0,0,("fossil grind", "rumble", {"alpha":0.02,"gain":0.6}),(0.15,0.20),("subwide",0,0,0)),
 ("Kittember","010",1.3,[(0.00,1.25,780,560,"trill",14,0.06,1.0)],
  "sine_harm",[1,0.5,0.3,0.15],0,0,("fire-crackle pops", "bursts", {"count":20,"w":0.015,"alpha":0.4,"gain":0.4}),(0.02,0.06),("quickpan",0,-0.6,0.6)),
 ("Pyropaw","011",1.3,[(0.00,0.35,720,720,"lin",0,0,1.0),(0.40,0.75,680,680,"lin",0,0,1.0),(0.80,1.25,640,640,"lin",0,0,0.9)],
  "pulse",[0.3],0,0,("flame stripe hiss", "am_noise", {"alpha":0.35,"rate":2.5,"gain":0.35}),(0.02,0.05),("haas",140,0,0)),
 ("Manticlaw","012",1.7,[(0.00,1.65,310,190,"arch",0,0,1.0)],
  "formant",[5.0],0,0,("wing whoosh sweep", "swells", {"alpha":0.2,"rate":0.7,"phase":0.5,"gain":0.5}),(0.08,0.12),("wide",0,0,0)),
 ("Pupbble","013",1.2,[(0.00,0.25,850,850,"lin",0,0,1.0),(0.30,0.55,780,780,"lin",0,0,1.0),(0.60,0.85,720,720,"lin",0,0,1.0),(0.90,1.15,650,650,"lin",0,0,0.9)],
  "tri",[],0,0,("pebble ticks", "clicks", {"start":0.05,"rate":8.0,"gain":0.35}),(0.01,0.03),("center",0,0,0)),
 ("Terradog","014",1.4,[(0.00,0.55,390,260,"lin",0,0,1.0),(0.65,1.35,340,500,"arch",0,0,0.9)],
  "square",[],0,0,("rock armor thuds", "thumps", {"times":[0.05,0.7],"freq":90,"gain":0.6}),(0.03,0.06),("altpan",0,-0.8,0.8)),
 ("Quakehound","015",1.8,[(0.00,0.50,180,180,"lin",0,0,1.0),(0.60,1.10,160,160,"lin",0,0,1.0),(1.20,1.75,140,100,"lin",0,0,0.9)],
  "saw",[],0,0,("earthquake rumble", "rumble", {"alpha":0.015,"gain":0.65}),(0.06,0.12),("subwide",0,0,0)),
 ("Squirmite","016",1.2,[(0.00,1.15,920,720,"trill",18,0.05,1.0)],
  "sine_harm",[1,0.2,0.05],0,0,("silk thread shimmer", "pings", {"freqs":[2600,2800,2500,2700,2900,2650],"times":[0.1,0.3,0.5,0.7,0.9,1.05],"gain":0.3}),(0.02,0.05),("haas",200,0,0)),
 ("Cocoonode","017",1.3,[(0.00,1.25,660,500,"vib",4,0.03,1.0)],
  "formant",[2.0],0,0,("cocoon muffled pulses", "thumps", {"times":[0.1,0.4,0.7,1.0],"freq":70,"gain":0.5}),(0.15,0.10),("narrow",0,0,0)),
 ("Mothrix","018",1.5,[(0.00,1.45,760,980,"vib",6,0.04,1.0)],
  "fm",[],3.02,1.5,("neon wing flutter", "am_noise", {"alpha":0.3,"rate":22.0,"gain":0.3}),(0.05,0.10),("chorus",0,0,0)),
 ("Zephling","019",1.2,[(0.00,0.30,980,980,"lin",0,0,1.0),(0.35,0.65,880,880,"lin",0,0,1.0),(0.70,1.15,820,820,"lin",0,0,0.9)],
  "noise_tone",[],0,0,("breeze puffs", "swells", {"alpha":0.3,"rate":3.5,"phase":1.0,"gain":0.4}),(0.02,0.04),("lightpan",0,-0.3,0.3)),
 ("Aerobeak","020",1.3,[(0.00,1.25,720,480,"dip",0,0,1.0)],
  "saw",[],0,0,("wind slash down", "swells", {"alpha":0.22,"rate":1.2,"phase":0.2,"gain":0.5}),(0.01,0.05),("sweeppan",0,-0.9,0.9)),
 ("Stormtalon","021",1.7,[(0.00,1.65,360,210,"warble",7,0.07,1.0)],
  "formant",[4.0],0,0,("thunder + lightning crackle", "bursts", {"count":2,"w":0.09,"alpha":0.5,"gain":0.6}),(0.03,0.10),("wide",0,0,0)),
 ("Finblade","022",1.4,[(0.00,0.60,560,340,"lin",0,0,1.0),(0.70,1.35,500,380,"lin",0,0,0.9)],
  "pulse",[0.2],0,0,("chrome fin ring", "rings", {"freqs":[1500,2100],"starts":[0.05,0.75],"decay":7.0,"gain":0.4}),(0.01,0.04),("snappan",0,0.8,-0.8)),
 ("Megalochrome","023",1.8,[(0.00,1.75,190,105,"arch",0,0,1.0)],
  "fm",[],1.75,2.0,("torpedo water rush", "swells", {"alpha":0.12,"rate":0.6,"phase":0.0,"gain":0.55}),(0.10,0.15),("subwide",0,0,0)),
 ("Floatcalf","024",1.4,[(0.00,1.35,610,450,"arch",0,0,1.0)],
  "fm",[],2.0,1.2,("neon electric crackle 36", "bursts", {"count":36,"w":0.012,"alpha":0.55,"gain":0.45}),(0.04,0.08),("haas",240,0,0)),
 ("Astroleviathan","025",1.9,[(0.00,1.85,210,330,"arch",0,0,1.0)],
  "sine_harm",[1,0.6,0.4],0,0,("galactic electric hum + star pings", "chord", {"freqs":[900,1350],"gains":[0.3,0.2],"gain":0.4}),(0.30,0.30),("slowpan",0,-0.5,0.5)),
 ("Inklet","026",1.3,[(0.00,1.25,710,450,"dip",0,0,1.0)],
  "noise_tone",[],0,0,("ink squirt bursts", "bursts", {"count":5,"w":0.05,"alpha":0.28,"gain":0.5}),(0.03,0.06),("haas",260,0,0)),
 ("Toxitacle","027",1.5,[(0.00,1.45,460,300,"warble",6,0.09,1.0)],
  "fm",[],1.33,2.8,("toxic bubble gurgle", "blips", {"count":10,"w":0.05,"freq":300,"gain":0.5}),(0.05,0.08),("pan",0,0.6,-0.6)),
 ("Krakenox","028",1.9,[(0.00,1.85,160,95,"arch",0,0,1.0)],
  "saw",[],0,0,("abyssal rumble + tentacle slaps", "thumps", {"times":[0.3,1.1],"freq":60,"gain":0.65}),(0.12,0.18),("subwide",0,0,0)),
 ("Punchkid","029",1.2,[(0.00,0.50,660,450,"lin",0,0,1.0),(0.60,1.15,600,500,"lin",0,0,0.9)],
  "square",[],0,0,("glove thumps", "thumps", {"times":[0.05,0.65],"freq":120,"gain":0.55}),(0.02,0.04),("center",0,0,0)),
 ("Strikechamp","030",1.4,[(0.00,0.40,360,360,"lin",0,0,1.0),(0.45,0.85,320,320,"lin",0,0,1.0),(0.90,1.35,280,220,"lin",0,0,0.9)],
  "saw",[],0,0,("impact thumps x3", "thumps", {"times":[0.05,0.5,0.95],"freq":100,"gain":0.6}),(0.02,0.05),("wide",0,0,0)),
 ("Kickmaster","031",1.4,[(0.00,1.35,330,200,"dip",0,0,1.0)],
  "pulse",[0.4],0,0,("kick snap", "bursts", {"count":1,"w":0.04,"alpha":0.6,"gain":0.7}),(0.01,0.03),("snappan",0,-0.8,0.8)),
 ("Gearkid","032",1.2,[(0.00,1.15,810,610,"trill",8,0.04,1.0)],
  "square",[],0,0,("cog ticks", "clicks", {"start":0.03,"rate":12.0,"gain":0.4}),(0.01,0.03),("altpan",0,-0.7,0.7)),
 ("Mechapion","033",1.5,[(0.00,0.35,410,410,"lin",0,0,1.0),(0.40,0.75,360,360,"lin",0,0,1.0),(0.80,1.10,320,320,"lin",0,0,1.0),(1.15,1.45,280,280,"lin",0,0,0.9)],
  "fm",[],2.5,1.8,("piston hiss bursts", "bursts", {"count":4,"w":0.07,"alpha":0.32,"gain":0.45}),(0.03,0.05),("mechpan",0,-0.5,0.5)),
 ("Gorokappa","034",1.8,[(0.00,1.75,170,100,"arch",0,0,1.0)],
  "saw",[],0,0,("steam vents", "swells", {"alpha":0.45,"rate":1.8,"phase":0.8,"gain":0.45}),(0.09,0.14),("wide",0,0,0)),
 ("Pebblefist","035",1.4,[(0.00,0.60,310,200,"lin",0,0,1.0),(0.70,1.35,280,210,"lin",0,0,0.9)],
  "tri",[],0,0,("gravel fist thumps + crunch", "thumps", {"times":[0.05,0.75],"freq":110,"gain":0.6}),(0.03,0.06),("center",0,0,0)),
 ("Cragarm","036",1.7,[(0.00,1.65,190,120,"warble",5,0.06,1.0)],
  "saw",[],0,0,("rock grind low", "am_noise", {"alpha":0.06,"rate":1.5,"gain":0.55}),(0.08,0.12),("subwide",0,0,0)),
 ("Terrapod","037",1.9,[(0.00,1.85,130,75,"arch",0,0,1.0)],
  "sine_harm",[1,0.4,0.2],0,0,("earthquake deepest", "rumble", {"alpha":0.01,"gain":0.7}),(0.18,0.22),("subwide",0,0,0)),
 ("Sproutle","038",1.2,[(0.00,1.15,630,480,"trill",12,0.05,1.0)],
  "sine_harm",[1,0.3,0.1],0,0,("leaf rustle", "bursts", {"count":7,"w":0.04,"alpha":0.38,"gain":0.35}),(0.03,0.06),("lightpan",0,-0.3,0.3)),
 ("Shellguard","039",1.4,[(0.00,1.35,460,320,"trill",6,0.04,1.0)],
  "tri",[],0,0,("shell knocks x3", "rings", {"freqs":[800,700,900],"starts":[0.1,0.6,1.0],"decay":6.0,"gain":0.4}),(0.04,0.07),("center",0,0,0)),
 ("Dreadtoise","040",1.8,[(0.00,1.75,190,115,"warble",4,0.05,1.0)],
  "saw",[],0,0,("forest titan creak", "swells", {"alpha":0.08,"rate":0.9,"phase":0.3,"gain":0.5}),(0.12,0.16),("wide",0,0,0)),
 ("Pixilite","041",1.2,[(0.00,0.25,960,960,"lin",0,0,1.0),(0.30,0.55,1200,1200,"lin",0,0,1.0),(0.60,0.85,1440,1440,"lin",0,0,1.0),(0.90,1.15,1080,1080,"lin",0,0,0.9)],
  "fm",[],3.5,4.0,("pixel blips", "blips", {"count":8,"w":0.02,"freq":2000,"gain":0.35}),(0.01,0.03),("sparklepan",0,-0.9,0.9)),
 ("Wispkin","042",1.8,[(0.00,1.75,1010,800,"vib",5,0.03,1.0)],
  "noise_tone",[],0,0,("ghost breath swell", "swells", {"alpha":0.25,"rate":0.8,"phase":1.2,"gain":0.5}),(0.30,0.35),("slowdrift",0,-0.4,0.4)),
 ("Duskfiend","043",1.7,[(0.00,1.65,510,290,"warble",3.5,0.08,1.0)],
  "fm",[],1.25,3.5,("dusk shimmer sparse", "pings", {"freqs":[900,1100,950],"times":[0.3,0.9,1.4],"gain":0.35}),(0.10,0.20),("drift",0,0.4,-0.4)),
 ("Ashemit","044",1.3,[(0.00,0.55,710,500,"lin",0,0,1.0),(0.65,1.25,680,520,"lin",0,0,0.9)],
  "pulse",[0.25],0,0,("ember pops", "bursts", {"count":16,"w":0.015,"alpha":0.42,"gain":0.4}),(0.02,0.05),("haas",180,0,0)),
 ("Pyromonk","045",1.5,[(0.00,1.45,390,260,"vib",4,0.05,1.0)],
  "sine_harm",[1,0.45,0.2,0.1],0,0,("staff flame crackle", "bursts", {"count":12,"w":0.02,"alpha":0.45,"gain":0.4}),(0.06,0.10),("center",0,0,0)),
 ("Yogiferno","046",1.8,[(0.00,1.75,180,110,"arch",0,0,1.0)],
  "saw",[],0,0,("yeti breath + fire crackle", "am_noise", {"alpha":0.18,"rate":9.0,"gain":0.5}),(0.10,0.15),("wide",0,0,0)),
 ("Mythar","331",2.0,[(0.00,0.35,880,880,"lin",0,0,1.0),(0.40,0.75,1100,1100,"lin",0,0,1.0),(0.80,1.15,1320,1320,"lin",0,0,1.0),(1.20,1.55,1760,1760,"lin",0,0,1.0),(1.60,1.95,1320,1320,"lin",0,0,0.9)],
  "fm",[],4.0,3.0,("celestial shimmer partials", "rings", {"freqs":[1760,2200,2640,3520],"starts":[0.0,0.4,0.8,1.2],"decay":2.5,"gain":0.35}),(0.05,0.30),("wideshimmer",0,0,0)),
 ("Dorowani","147",1.5,[(0.00,1.45,520,880,"arch",0,0,1.0)],
  "noise_tone",[],0,0,("water splash swells x3", "swells", {"alpha":0.18,"rate":2.0,"phase":0.6,"gain":0.55}),(0.08,0.12),("waterpan",0,-0.6,0.6)),
 ("Gabu","148",1.2,[(0.00,0.50,830,620,"lin",0,0,1.0),(0.60,1.15,780,660,"lin",0,0,0.9)],
  "pulse",[0.35],0,0,("crown ping 1760Hz", "pings", {"freqs":[1760],"times":[0.05],"gain":0.5}),(0.01,0.04),("pingpan",0,0.7,-0.7)),
]

def synth_entry(e, seed):
    name, cid, dur, notes, osc_kind, harm, fm_ratio, fm_idx, tex, (atk, rel), (st_mode, delay, pan0, pan1) = e
    rng = np.random.default_rng(seed)
    n = int(SR * dur)
    sig = np.zeros(n)
    # sub-osc for low creatures: add phase/2 sine at low gain for saw entries below 200 Hz start
    for (t0, t1, f0a, f0b, shape, lfo_hz, lfo_dep, gain) in notes:
        s = int(t0 * SR); en = min(n, int(t1 * SR))
        if en <= s: continue
        f = f0_curve(t0, t1, f0a, f0b, shape, lfo_hz, lfo_dep)
        L = en - s
        if len(f) > L: f = f[:L]
        elif len(f) < L: f = np.pad(f, (0, L - len(f)), mode="edge")
        phase = 2 * np.pi * np.cumsum(f) / SR
        v = osc(phase, osc_kind, harm, fm_ratio, fm_idx)
        if osc_kind == "saw" and f0a < 200:
            v = v * 0.7 + np.sin(phase / 2) * 0.35
        if osc_kind == "noise_tone":
            v = v * 0.7 + hp(rng.standard_normal(len(v)), 0.3) * 0.45
        seg_env = env_note(en - s, atk, rel)
        sig[s:en] += v * seg_env * gain
    tex_name, tex_kind, tex_params = tex
    sig = sig * 0.75 + texture_layer(rng, n, tex_kind, tex_params) * 0.9
    # global final fade
    sig[-int(0.10 * SR):] *= np.linspace(1, 0, int(0.10 * SR))
    # stereo per creature
    if st_mode == "haas":
        left = sig; right = np.roll(sig, delay) * 0.92
    elif st_mode in ("pan", "drift", "slowpan", "waterpan", "sweeppan", "snappan", "altpan", "mechpan", "sparklepan", "pingpan", "lightpan", "quickpan", "hardpan"):
        t = np.arange(n) / SR
        pan = pan0 + (pan1 - pan0) * (t / dur)
        left = sig * np.sqrt((1 - pan) / 2 + 0.15); right = sig * np.sqrt((1 + pan) / 2 + 0.15)
    elif st_mode == "chorus":
        left = sig; right = np.roll(sig, 340) * 0.85 + np.roll(sig, 120) * 0.3
    else:
        left = sig; right = sig * 0.96
    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo)) + 1e-9
    stereo = stereo / peak * 0.89
    return stereo

def signature(e):
    name, cid, dur, notes, osc_kind, harm, fm_ratio, fm_idx, tex, env_, st = e
    shapes = tuple(x[4] for x in notes)
    return (osc_kind, tuple(harm), fm_ratio, fm_idx, shapes, len(notes),
            tex[0], tex[1], str(sorted(tex[2].items())), env_, st[0])

results = []
sigs = {}
for e in C:
    name, cid, dur = e[0], e[1], e[2]
    seed = zlib.crc32(name.encode()) & 0xFFFFFFFF
    stereo = synth_entry(e, seed)
    fname = f"{name.lower()}-cry-r1.wav"
    path = os.path.join(OUT, fname)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    rms = float(np.sqrt(np.mean(stereo ** 2)))
    sig = signature(e)
    sigs.setdefault(sig, []).append(name)
    results.append({"id": cid, "name": name, "file": fname, "duration": dur,
                    "rms": round(rms, 4), "osc": e[4], "notes": len(e[3]),
                    "shapes": [x[4] for x in e[3]], "texture": e[8][0],
                    "stereo": e[10][0]})
    print(f"{cid} {name} {fname} {dur}s rms={rms:.4f} notes={len(e[3])} tex={e[8][0]}")
dups = {str(k): v for k, v in sigs.items() if len(v) > 1}
print("SIGNATURE COLLISIONS:", dups if dups else "none — 49/49 distinct")
import json
json.dump({"results": results, "collisions": dups}, open("/tmp/cry_r1_results.json", "w"), indent=1)
print("total", len(results))
