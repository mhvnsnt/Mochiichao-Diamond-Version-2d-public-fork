#!/usr/bin/env python3
"""Build Mochiichao UI cut-out pieces as transparent-background SVGs.

Style lock (Mars, 2026-10-25): stick to the game's own art style and
character likenesses — Pokemon/Digimon-style: bold outlines, rounded,
saturated, anime eyes, deep navy + teal + gold. NOT generic flat UI art,
NOT terminal mono, NOT emoji. No background rect: every file is transparent
outside its own shape, so it can be cut out / overlaid in PixiJS or CSS.

Open-source method used: Kenney UI Pack (CC0, kenney.nl/assets/ui-pack)
9-slice panel/button/bar structure as the structural reference — panels,
buttons and bars are built as 9-slice-ready rounded shapes. The art itself
is original Mochiichao work, recoloured/restyled to the style guide, not
Kenney's raw sprites dropped in (that would drift the style).
Tools: SVG (open standard), Python stdlib only, no proprietary tool.
Output: assets/svg/*.svg + assets/manifest.json + assets/mochiichao-ui.css
"""
import json, os
OUT = os.path.expanduser("~/workspace/mochiichao-work/ui-art/assets/svg")
os.makedirs(OUT, exist_ok=True)

def svg(w, h, inner, view=None):
    vb = view or f"0 0 {w} {h}"
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{vb}">{inner}</svg>\n'

def panel(w, h, r=16, fill="#16233a", stroke="#22d3ee", sw=3, opacity=0.92):
    return (f'<rect x="{sw/2}" y="{sw/2}" width="{w-sw}" height="{h-sw}" rx="{r}" '
            f'fill="{fill}" fill-opacity="{opacity}" stroke="{stroke}" stroke-width="{sw}"/>')

def button(w, h, fill, label=None, textfill="#f1f5f9"):
    s = (f'<rect x="2" y="2" width="{w-4}" height="{h-4}" rx="14" fill="{fill}" '
         f'stroke="#0b1220" stroke-width="2"/>'
         f'<rect x="6" y="6" width="{w-12}" height="14" rx="7" fill="#ffffff" opacity="0.18"/>')
    if label:
        s += (f'<text x="{w/2}" y="{h/2+7}" text-anchor="middle" font-family="Arial, sans-serif" '
              f'font-size="20" font-weight="bold" fill="{textfill}">{label}</text>')
    return s

def icon_circle(fill, symbol):
    return (f'<circle cx="32" cy="32" r="28" fill="{fill}" stroke="#0b1220" stroke-width="3"/>'
            f'<text x="32" y="42" text-anchor="middle" font-family="Arial, sans-serif" '
            f'font-size="28" font-weight="bold" fill="#ffffff">{symbol}</text>')

files = {}

def write(name, content):
    p = os.path.join(OUT, name)
    with open(p, "w") as f: f.write(content)
    files[name] = os.path.getsize(p)

# Panels / dialogue / HUD — 9-slice-ready, transparent outside
write("panel-main.svg", svg(400, 300, panel(400, 300)))
write("panel-small.svg", svg(240, 160, panel(240, 160)))
write("panel-title.svg", svg(600, 200, panel(600, 200, r=20)))
write("dialogue-box.svg", svg(800, 160, panel(800, 160) +
    '<circle cx="80" cy="80" r="52" fill="#0b1220" stroke="#22d3ee" stroke-width="3"/>'))
write("hud-top.svg", svg(800, 64, panel(800, 64, r=12)))
write("hud-party-slot.svg", svg(64, 64, panel(64, 64, r=12)))

# Buttons — primary teal, gold, danger, small
write("button-primary.svg", svg(240, 64, button(240, 64, "#0ea5b7")))
write("button-gold.svg", svg(240, 64, button(240, 64, "#f59e0b", textfill="#0b1220")))
write("button-danger.svg", svg(240, 64, button(240, 64, "#ef4444")))
write("button-small.svg", svg(120, 48, button(120, 48, "#0ea5b7")))

# HP / XP bars — frame (transparent inside track) + fills as separate cut-outs
write("bar-frame.svg", svg(300, 24,
    '<rect x="2" y="2" width="296" height="20" rx="10" fill="#0b1220" stroke="#f1f5f9" stroke-width="2"/>'))
for name, col in [("bar-hp-green", "#22c55e"), ("bar-hp-yellow", "#facc15"),
                  ("bar-hp-red", "#ef4444"), ("bar-xp-blue", "#22d3ee")]:
    write(f"{name}.svg", svg(296, 20,
        f'<rect x="0" y="0" width="296" height="20" rx="10" fill="{col}"/>'))
write("bar-track.svg", svg(296, 20,
    '<rect x="0" y="0" width="296" height="20" rx="10" fill="#1e293b"/>'))

# Controls — D-pad, A, B, START (transparent outside)
write("dpad.svg", svg(160, 160,
    '<path d="M64 8 h32 v32 h32 v32 h-32 v32 h-32 v-32 h-32 v-32 h32 z" '
    'fill="#16233a" stroke="#22d3ee" stroke-width="3"/>'
    '<circle cx="80" cy="80" r="14" fill="#0b1220" stroke="#22d3ee" stroke-width="2"/>'))
for name, col, lab in [("button-a", "#f59e0b", "A"), ("button-b", "#22d3ee", "B")]:
    write(f"{name}.svg", svg(72, 72,
        f'<circle cx="36" cy="36" r="32" fill="{col}" stroke="#0b1220" stroke-width="3"/>'
        f'<text x="36" y="47" text-anchor="middle" font-family="Arial, sans-serif" '
        f'font-size="30" font-weight="bold" fill="#0b1220">{lab}</text>'))
write("button-start.svg", svg(160, 48, button(160, 48, "#16233a")))

# 12 True Elements — one icon each, colour + symbol, transparent outside
elements = {
    "water": ("#38bdf8", "~"), "chrome": ("#94a3b8", "#"), "earth": ("#a16207", "^"),
    "bug": ("#84cc16", "*"), "umbral": ("#7c3aed", "U"), "aero": ("#67e8f9", ">"),
    "core": ("#f97316", "O"), "strike": ("#eab308", "!"), "deep": ("#1d4ed8", "D"),
    "flame": ("#ef4444", "F"), "mythic": ("#fbbf24", "M"), "normal": ("#9ca3af", "N"),
}
for name, (col, sym) in elements.items():
    write(f"icon-element-{name}.svg", svg(64, 64, icon_circle(col, sym)))

# Item / menu icons
for name, sym, col in [
    ("icon-luigi-cube", "▣", "#22d3ee"), ("icon-mend-patch", "+", "#22c55e"),
    ("icon-coin-cr", "C", "#fbbf24"), ("icon-roster", "≡", "#22d3ee"),
    ("icon-bag", "▤", "#f59e0b"), ("icon-save", "▼", "#22c55e"),
    ("icon-settings", "⚙", "#94a3b8"), ("icon-map", "◎", "#38bdf8"),
    ("icon-garden", "✿", "#84cc16"), ("icon-arena", "◆", "#f97316"),
    ("icon-cheat", "?", "#7c3aed"),
]:
    # gear/flower glyphs render as text in SVG; keep them as simple symbols
    write(f"{name}.svg", svg(64, 64, icon_circle(col, sym)))

manifest = {
    "style": "Mochiichao digital world: deep navy #0b1220, panel #16233a, teal #22d3ee, gold #fbbf24, rounded bold Pokemon/Digimon-style UI. Transparent background on every file (no background rect).",
    "method": "Kenney UI Pack (CC0) 9-slice panel/button/bar structure as structural reference; art is original Mochiichao work, not Kenney raw sprites (style lock). SVG open standard, Python stdlib build.",
    "wiring": {
        "title": ["panel-title.svg"],
        "main_menu": ["panel-main.svg", "button-primary.svg", "button-gold.svg"],
        "pause_menu": ["panel-main.svg", "button-primary.svg"],
        "hud": ["hud-top.svg", "hud-party-slot.svg", "icon-coin-cr.svg"],
        "battle": ["bar-frame.svg", "bar-track.svg", "bar-hp-green.svg", "bar-hp-yellow.svg", "bar-hp-red.svg", "dialogue-box.svg", "button-primary.svg", "button-gold.svg", "button-danger.svg"],
        "roster": ["panel-main.svg", "panel-small.svg"] + [f"icon-element-{e}.svg" for e in elements],
        "shop": ["panel-main.svg", "icon-luigi-cube.svg", "icon-mend-patch.svg", "icon-coin-cr.svg"],
        "pc_storage": ["panel-main.svg", "panel-small.svg"],
        "garden": ["panel-main.svg", "icon-garden.svg"],
        "arena": ["panel-main.svg", "icon-arena.svg"],
        "creature_mode": ["hud-top.svg", "bar-hp-green.svg"],
        "ring_capture": ["panel-small.svg", "dialogue-box.svg"],
        "cheat_console": ["panel-main.svg", "icon-cheat.svg"],
        "controls": ["dpad.svg", "button-a.svg", "button-b.svg", "button-start.svg"],
    },
    "files": files,
    "note": "PNG exports: SVG is the cut-out master (transparent, scalable). Raster PNGs at 1x/2x/4x are produced on import by the game build (PixiJS/CSS can rasterise SVG, or main chat runs an SVG→PNG export) — do not hand-draw PNGs that drift from the SVG master. If a PNG is needed for a specific screen, export it from the SVG in this folder, never from the AI mock images.",
}
with open(os.path.expanduser("~/workspace/mochiichao-work/ui-art/assets/manifest.json"), "w") as f:
    json.dump(manifest, f, indent=2)

css = """/* Mochiichao UI — wired to assets/svg/*.svg (transparent cut-outs) */
:root{--ui-bg:#0b1220;--ui-panel:#16233a;--ui-teal:#22d3ee;--ui-gold:#fbbf24;--ui-text:#f1f5f9}
.mochi-panel{background:url('svg/panel-main.svg') no-repeat center/100% 100%;color:var(--ui-text)}
.mochi-button{background:url('svg/button-primary.svg') no-repeat center/100% 100%;min-height:48px}
.mochi-button-gold{background:url('svg/button-gold.svg') no-repeat center/100% 100%;min-height:48px}
.mochi-hud{background:url('svg/hud-top.svg') no-repeat center/100% 100%}
.mochi-dialogue{background:url('svg/dialogue-box.svg') no-repeat center/100% 100%}
"""
with open(os.path.expanduser("~/workspace/mochiichao-work/ui-art/assets/mochiichao-ui.css"), "w") as f:
    f.write(css)
print(f"{len(files)} SVG files, total {sum(files.values())} bytes")
print("wiring screens:", len(manifest["wiring"]))
