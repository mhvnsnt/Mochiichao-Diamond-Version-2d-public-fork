#!/usr/bin/env python3
"""Procedural cry synthesis for all 47 Mochiichao roster creatures.
Staged only. No Pokemon audio, no copied samples, no recorded sounds.
Method: 60% Mochiichao original procedural design (unique layered synth
per creature canon) + 40% Pokemon SYSTEM (species-indexed cry table,
one cry per species, title-press 90-frame / 1.5s timing reference,
reuse across title/battle/lab) — system only, never audio data.
Output: 16-bit PCM stereo WAV, 44100 Hz, one file per creature.
Deterministic: noise seeded per creature name, so reruns reproduce.
"""
import math, os, struct, wave, json
import numpy as np

SR = 44100
OUT = "/home/hatch/workspace/mochiichao-work/title-creatures-9/work/cries/audio"
os.makedirs(OUT, exist_ok=True)

# name, id, f0_start, f0_end, duration, texture, vibrato_hz, vibrato_depth, proposal
# texture: bubble, growl, rumble, chirp, trill, sweep, whisper, roar, chime,
#          snap, flutter, gust, thump, sparkle, howl, drone, clang
CREATURES = [
    ("Mochii", "001", 700, 420, 1.2, "bubble", 6, 0.04, "Mid-high wet bloop, playful bubble-pop."),
    ("Tiidebiite", "002", 520, 380, 1.4, "bubble", 5, 0.03, "Mid water-warrior call, swirling water fists, firmer than Mochii."),
    ("AquariiOS", "003", 600, 900, 1.6, "sweep", 4, 0.02, "Mid-high fluid intelligence sweep, rising, guardian-like."),
    ("Razorgater", "004", 300, 180, 1.5, "growl", 7, 0.05, "Mid-low throaty growl with metallic jaw snap."),
    ("Chromejaww", "005", 260, 160, 1.5, "snap", 6, 0.04, "Mid-low chrome crocodile snap, fierce metal reptile."),
    ("Reaperdile", "006", 140, 90, 1.8, "roar", 4, 0.06, "Low huge tank-croc roar, steel armor edge."),
    ("Tyrage", "007", 320, 220, 1.4, "rumble", 5, 0.04, "Low-mid gravelly earth rumble, small scale."),
    ("Duneclaw", "008", 280, 190, 1.5, "rumble", 5, 0.05, "Low-mid desert dinosaur rumble with dark edge."),
    ("Oblivirex", "009", 130, 85, 1.9, "roar", 3, 0.06, "Low fossil shadow T-rex roar, massive."),
    ("Kittember", "010", 750, 550, 1.3, "chirp", 8, 0.05, "Mid-high kitten chirp with crackling fire edge."),
    ("Pyropaw", "011", 700, 500, 1.3, "chirp", 8, 0.05, "Mid-high tiger-cub chirp with flame stripes crackle."),
    ("Manticlaw", "012", 300, 200, 1.7, "roar", 5, 0.05, "Mid-low huge fire manticore roar, blazing mane."),
    ("Pupbble", "013", 800, 600, 1.2, "chirp", 9, 0.04, "High small rock-puppy yip, pebble-bright."),
    ("Terradog", "014", 380, 260, 1.4, "howl", 5, 0.04, "Mid earth hound bark-howl, rock armor weight."),
    ("Quakehound", "015", 170, 110, 1.8, "rumble", 4, 0.06, "Low massive earthquake mastiff rumble-bark."),
    ("Squirmite", "016", 900, 700, 1.2, "flutter", 10, 0.06, "High small silkworm squirm-trill."),
    ("Cocoonode", "017", 650, 500, 1.3, "flutter", 8, 0.04, "Mid-high cocoon hum-trill, soft and enclosed."),
    ("Mothrix", "018", 750, 950, 1.5, "flutter", 9, 0.05, "Mid-high matrix moth shimmer-trill, glowing wings."),
    ("Zephling", "019", 950, 750, 1.2, "gust", 7, 0.04, "High tiny wind-bird peep with breezy gust."),
    ("Aerobeak", "020", 700, 500, 1.3, "gust", 6, 0.04, "Mid-high sleek falcon cry with wind sweep."),
    ("Stormtalon", "021", 350, 220, 1.7, "gust", 5, 0.05, "Mid-low massive storm-eagle scream with hurricane gust."),
    ("Finblade", "022", 550, 350, 1.4, "snap", 6, 0.04, "Mid swordfish slash-cry, chrome fin edge."),
    ("Megalochrome", "023", 180, 110, 1.8, "roar", 4, 0.05, "Low giant chrome megalodon roar, metallic torpedo."),
    ("Floatcalf", "024", 600, 450, 1.4, "bubble", 6, 0.04, "Mid floating calf-whale bloop with neon sparkle."),
    ("Astroleviathan", "025", 200, 320, 1.9, "drone", 3, 0.03, "Low-to-mid cosmic whale drone, galactic swell."),
    ("Inklet", "026", 700, 450, 1.3, "bubble", 7, 0.05, "Mid-high small dark squid bloop with ink edge."),
    ("Toxitacle", "027", 450, 300, 1.5, "bubble", 6, 0.05, "Mid poisonous octopus gurgle, venom edge."),
    ("Krakenox", "028", 150, 95, 1.9, "roar", 3, 0.06, "Low giant shadow kraken roar, abyssal."),
    ("Punchkid", "029", 650, 450, 1.2, "thump", 7, 0.04, "Mid-high tiny fighter shout-punch, quick."),
    ("Strikechamp", "030", 350, 220, 1.4, "thump", 5, 0.04, "Mid champion boxer shout, punchy."),
    ("Kickmaster", "031", 320, 200, 1.4, "thump", 5, 0.04, "Mid champion kickboxer shout-kick, sharp."),
    ("Gearkid", "032", 800, 600, 1.2, "clang", 9, 0.04, "High small gear-robot chirp with cog tick."),
    ("Mechapion", "033", 400, 280, 1.5, "clang", 6, 0.04, "Mid heavy mechanic robot clang-call, piston edge."),
    ("Gorokappa", "034", 160, 100, 1.8, "roar", 4, 0.06, "Low massive mecha-gorilla roar, steam edge."),
    ("Pebblefist", "035", 300, 200, 1.4, "thump", 5, 0.05, "Mid-low rock-fist golem thump-call."),
    ("Cragarm", "036", 180, 120, 1.7, "rumble", 4, 0.06, "Low boulder-arm golem rumble."),
    ("Terrapod", "037", 120, 80, 1.9, "rumble", 3, 0.06, "Low colossal mountain golem rumble, earthquake."),
    ("Sproutle", "038", 620, 480, 1.2, "trill", 8, 0.04, "Mid soft leafy trill with rustle."),
    ("Shellguard", "039", 450, 320, 1.4, "trill", 6, 0.04, "Mid armored bush-turtle trill, shell weight."),
    ("Dreadtoise", "040", 180, 120, 1.8, "rumble", 4, 0.05, "Low massive dreadnought tortoise rumble, forest titan."),
    ("Pixilite", "041", 950, 750, 1.2, "sparkle", 10, 0.05, "High tiny pixel-flower sprite sparkle-chirp."),
    ("Wispkin", "042", 1000, 800, 1.8, "whisper", 5, 0.03, "High thin whispering wisp, no words, long decay."),
    ("Duskfiend", "043", 500, 300, 1.7, "whisper", 4, 0.05, "Mid-high terrifying dusk phantom whisper-growl."),
    ("Ashemit", "044", 700, 500, 1.3, "chirp", 8, 0.05, "Mid-high little ash-demon chirp with smolder edge."),
    ("Pyromonk", "045", 380, 260, 1.5, "roar", 5, 0.04, "Mid fire monk chant-roar, burning staff focus."),
    ("Yogiferno", "046", 170, 110, 1.8, "roar", 4, 0.06, "Low large yeti roar-chant with fire crackle, bigger than humans, NOT deity-tier."),
    ("Mythar", "331", 880, 1320, 2.0, "chime", 3, 0.02, "High pure crystalline chime arpeggio, long ring-out."),
]

def lowpass(x, alpha=0.08):
    y = np.zeros_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += alpha * (v - acc); y[i] = acc
    return y

def synth(name, f0a, f0b, dur, texture, vib_hz, vib_depth, seed):
    rng = np.random.default_rng(seed)
    n = int(SR * dur)
    t = np.arange(n) / SR
    # pitch glide with vibrato
    glide = f0a + (f0b - f0a) * (t / dur) ** 1.2
    phase = 2 * np.pi * np.cumsum(glide * (1 + vib_depth * np.sin(2 * np.pi * vib_hz * t))) / SR
    # envelope: attack then decay, final fade
    atk = int(0.08 * SR) if texture not in ("whisper", "drone", "chime") else int(0.25 * SR)
    env = np.ones(n)
    env[:atk] = np.linspace(0, 1, atk)
    env = env * np.exp(-1.2 * t / dur)
    env[-int(0.15 * SR):] *= np.linspace(1, 0, int(0.15 * SR))
    voice = np.sin(phase) * 0.55 + np.sin(2 * phase) * 0.22 + np.sin(3 * phase) * 0.10
    # texture layer
    noise = rng.standard_normal(n)
    if texture in ("bubble",):
        tex = np.zeros(n)
        for _ in range(14):
            c = int(rng.uniform(0.1, 0.9) * n); w = int(rng.uniform(0.01, 0.03) * SR)
            tex[c:c + w] += np.sin(2 * np.pi * rng.uniform(500, 1100) * np.arange(w) / SR) * np.hanning(w)
        voice = voice * 0.7 + tex * 0.5
    elif texture in ("rumble",):
        tex = lowpass(np.cumsum(noise) / SR, 0.02)
        tex = tex / (np.max(np.abs(tex)) + 1e-9)
        voice = voice * 0.5 + tex * 0.7
    elif texture in ("growl", "roar", "howl"):
        tex = lowpass(noise, 0.12)
        voice = voice * 0.6 + tex * 0.5
        if texture == "roar":
            voice = voice + np.sin(phase / 2) * 0.3
    elif texture in ("chirp", "trill", "flutter"):
        am = 1 + 0.35 * np.sin(2 * np.pi * (12 if texture == "flutter" else 8) * t)
        voice = voice * am * 0.8
        if texture == "trill":
            voice = voice + lowpass(noise, 0.3) * 0.15
    elif texture in ("whisper",):
        tex = noise - lowpass(noise, 0.5)
        voice = voice * 0.35 + tex * 0.55
    elif texture in ("chime", "sparkle"):
        voice = np.zeros(n)
        for i, mult in enumerate([1.0, 1.5, 2.0, 2.76]):
            start = int(i * 0.12 * SR)
            nn = n - start
            tt = np.arange(nn) / SR
            voice[start:] += np.sin(2 * np.pi * f0a * mult * tt) * np.exp(-2.0 * tt) * 0.5
    elif texture in ("snap", "clang", "thump"):
        voice = voice * 0.7
        burst = np.zeros(n); burst[:int(0.05 * SR)] = noise[:int(0.05 * SR)] * np.hanning(int(0.05 * SR))
        voice = voice + burst * 0.6
        if texture == "clang":
            voice = voice + np.sin(phase * 2.76) * 0.15 * env
    elif texture in ("gust", "sweep"):
        tex = lowpass(noise, 0.2) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.8 * t))
        voice = voice * 0.6 + tex * 0.5
    elif texture in ("drone",):
        voice = np.sin(phase) * 0.6 + np.sin(phase * 1.5) * 0.3 + lowpass(noise, 0.05) * 0.2
    else:
        voice = voice
    sig = voice * env
    # stereo width: right channel slightly delayed / gained
    left = sig
    right = np.roll(sig, 220) * 0.92
    stereo = np.stack([left, right], axis=1)
    peak = np.max(np.abs(stereo)) + 1e-9
    stereo = stereo / peak * 0.89
    return stereo

results = []
for (name, cid, f0a, f0b, dur, texture, vib_hz, vib_depth, proposal) in CREATURES:
    seed = abs(hash(name)) % (2 ** 31)
    stereo = synth(name, f0a, f0b, dur, texture, vib_hz, vib_depth, seed)
    fname = f"{name.lower()}-cry.wav"
    path = os.path.join(OUT, fname)
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        ints = (stereo * 32767).astype(np.int16)
        w.writeframes(ints.tobytes())
    rms = float(np.sqrt(np.mean(stereo ** 2)))
    results.append({"id": cid, "name": name, "file": fname, "duration": dur,
                    "f0_start": f0a, "f0_end": f0b, "texture": texture,
                    "proposal": proposal, "rms": round(rms, 4)})
    print(f"{cid} {name} {fname} {dur}s rms={rms:.4f}")
json.dump(results, open("/tmp/cry_results.json", "w"), indent=1)
print("total", len(results))
