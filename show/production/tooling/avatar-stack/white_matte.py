#!/usr/bin/env python3
"""White-field matting for the Dorowani avatar-stack clips.

Why not RVM: Robust Video Matting (ResNet50 + MobileNetV3, pulled in
2026-10-27) was measured on the REAL avatar clips and fails on this
material - it is trained on human video; on the flat cartoon body the
alpha collapses over time (belly alpha 0.000, whole-frame coverage
0.208 -> 0.024 across 60 frames). The avatar clips sit on a pure-white
field and the character is enclosed by dark ink outlines, so a
white-distance key with enclosed-region rescue is the correct,
deterministic tool here:

  alpha from distance-to-white (soft ramp, noise floor),
  near-white components NOT connected to the frame border are
  character whites (belly highlight, jaw, teeth) -> alpha 1,
  border-connected near-white is background -> alpha from ramp,
  foreground colour un-premultiplied from white in the soft band.

Usage: white_matte.py INPUT.mp4 OUTPUT.webm
Output: VP9 WebM with alpha, same fps/resolution as input.
"""
import subprocess, sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

def probe(path):
    out = subprocess.run(['ffprobe','-v','error','-select_streams','v:0',
        '-show_entries','stream=width,height,avg_frame_rate,nb_frames',
        '-of','csv=p=0', path], capture_output=True, text=True).stdout.strip().split(',')
    w, h = int(out[0]), int(out[1])
    num, den = out[2].split('/'); fps = float(num)/float(den)
    return w, h, fps, int(out[3])

def matte_frame(img):
    img = img.astype(np.float32)
    d = np.sqrt(((255.0 - img) ** 2).sum(axis=2) / 3.0)
    alpha = np.clip((d - 6.0) / 20.0, 0, 1)
    low = alpha < 0.5
    lab, n = ndimage.label(low)
    if n:
        border = np.unique(np.concatenate([lab[0,:], lab[-1,:], lab[:,0], lab[:,-1]]))
        enclosed_ids = np.setdiff1d(np.arange(1, n + 1), border)
        if len(enclosed_ids):
            alpha[np.isin(lab, enclosed_ids)] = 1.0   # enclosed character whites
    a8 = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(a8).astype(np.float32) / 255.0
    alpha = np.where(alpha < 0.04, 0.0, alpha)   # kill background speckle
    fgr = np.clip((img - (1 - alpha[..., None]) * 255.0) / np.maximum(alpha[..., None], 1e-4), 0, 255)
    fgr = np.where(alpha[..., None] > 0.98, img, fgr)
    return fgr, alpha

def main(inp, outp):
    w, h, fps, nframes = probe(inp)
    dec = subprocess.Popen(['ffmpeg','-v','error','-i', inp, '-f','rawvideo','-pix_fmt','rgb24','-'],
                           stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgba',
        '-s', f'{w}x{h}', '-r', str(fps), '-i', '-',
        '-c:v','libvpx-vp9','-pix_fmt','yuva420p','-b:v','0','-crf','32',
        '-metadata','alpha_mode=1', outp], stdin=subprocess.PIPE)
    fsize = w * h * 3
    prev_alpha = None; flick = []
    for i in range(nframes):
        buf = dec.stdout.read(fsize)
        if len(buf) < fsize: break
        frame = np.frombuffer(buf, dtype=np.uint8).reshape(h, w, 3)
        fgr, alpha = matte_frame(frame)
        if prev_alpha is not None:
            flick.append(float(np.abs(alpha - prev_alpha)[(slice(0,60), slice(0,720))].mean()))
        prev_alpha = alpha
        rgba = np.dstack([fgr, alpha * 255]).astype(np.uint8)
        enc.stdin.write(rgba.tobytes())
        if i % 48 == 0: print(f'  frame {i}/{nframes}', flush=True)
    dec.stdout.close(); enc.stdin.close(); enc.wait()
    print(f'done {outp} | bg flicker mean|dAlpha| top band: {np.mean(flick):.4f}' if flick else 'done')

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
