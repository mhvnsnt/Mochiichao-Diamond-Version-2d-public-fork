#!/usr/bin/env python3
"""Phone-size renders for the evidence gate (staging -> repo tools/).
A landscape title scene on a portrait phone: background scaled to fit
390px width, centred vertically on a dark field, NO text added (the
no-text rule for backgrounds applies to these previews too).
Usage: title_phone.py <bg_png> <out_png>
"""
import sys
from PIL import Image
def main():
    src, out = sys.argv[1], sys.argv[2]
    bg = Image.open(src).convert("RGBA")
    w = 390; h = int(bg.height * w / bg.width)
    bg = bg.resize((w, h), Image.LANCZOS)
    phone = Image.new("RGBA", (390, 844), (5, 8, 16, 255))
    phone.paste(bg, (0, (844 - h) // 2))
    phone.save(out); print(f"{out} 390x844 from {src}")
if __name__ == "__main__": main()
