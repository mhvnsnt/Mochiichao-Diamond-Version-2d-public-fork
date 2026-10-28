#!/usr/bin/env python3
import json, pathlib
OUT = pathlib.Path.home()/"workspace/ep01-rebuild/full-stack/kernel"
OUT.mkdir(parents=True, exist_ok=True)

def md(s): return {"cell_type":"markdown","metadata":{},"source":s}
def code(s): return {"cell_type":"code","execution_count":None,"metadata":{},"outputs":[],"source":s}

cells = [
md("# Mochiichao — VACE-1.3B sparse-keyframe FLF proof (one-pass full-stack wiring)\n"
   "Native ComfyUI VACE graph (kit template, placeholders resolved). Models attach from the staged consistency-kit dataset — zero in-session downloads of weights. Inputs attach from the vace-flf-job dataset."),
code("""import subprocess, sys, os, json, time, shutil, glob
print(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout[:800])
WORK = '/kaggle/working'
"""),
code("""# --- clone ComfyUI + the only custom pack the graph needs (VideoHelperSuite) ---
def sh(cmd, **kw):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, **kw)
    print(r.stdout[-1500:]); print(r.stderr[-800:])
    return r
if not os.path.exists(f'{WORK}/ComfyUI'):
    sh(f'cd {WORK} && git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git')
    sh(f'cd {WORK} && git clone --depth 1 https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git ComfyUI/custom_nodes/ComfyUI-VideoHelperSuite')
sh(f'cd {WORK}/ComfyUI && git rev-parse HEAD')
sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/requirements.txt -r {WORK}/ComfyUI/custom_nodes/ComfyUI-VideoHelperSuite/requirements.txt')
print('SETUP_DONE')
"""),
code("""# --- stage models from the consistency-kit dataset + inputs from the job dataset ---
import pathlib
inp = pathlib.Path('/kaggle/input')
def find(name):
    hits = list(inp.rglob(name))
    assert hits, f'MISSING staged file: {name}'
    return hits[0]
models = f'{WORK}/ComfyUI/models'
for sub, name in [('diffusion_models','wan2.1_vace_1.3B_fp16.safetensors'),
                  ('vae','wan_2.1_vae.safetensors'),
                  ('text_encoders','umt5_xxl_fp8_e4m3fn_scaled.safetensors')]:
    src = find(name); dst = pathlib.Path(models)/sub/name
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() or dst.is_symlink(): dst.unlink()
    os.symlink(src, dst)
    print('staged', name, src.stat().st_size)
for name in ['flf_control.mp4','flf_mask.mp4','dorowani_cutout.png']:
    shutil.copy(find(name), f'{WORK}/ComfyUI/input/{name}')
    print('input staged', name)
WF = json.loads(find('workflow.json').read_text())
print('workflow nodes:', {k: v['class_type'] for k, v in WF.items()})
"""),
code("""# --- audit before queueing (test-1 defect rule: output size must equal request) ---
import subprocess as sp
probe = sp.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames','-of','csv=p=0', f'{WORK}/ComfyUI/input/flf_control.mp4'], capture_output=True, text=True).stdout.strip()
print('control video (w,h,frames):', probe)
w, h, n = [int(x) for x in probe.split(',')[:3]]
assert (WF['9']['inputs']['width'], WF['9']['inputs']['height'], WF['9']['inputs']['length']) == (w, h, n), 'graph/control size mismatch'
assert os.path.getsize(f'{models}/diffusion_models/wan2.1_vace_1.3B_fp16.safetensors') == 4309519800, 'VACE size drift'
print('AUDIT_PASS')
"""),
code("""# --- launch server, queue the graph, wait ---
srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188', '--disable-auto-launch'],
                       cwd=f'{WORK}/ComfyUI', stdout=open(f'{WORK}/comfy.log','w'), stderr=subprocess.STDOUT)
import urllib.request
def get(path):
    with urllib.request.urlopen(f'http://127.0.0.1:8188{path}', timeout=30) as r: return json.loads(r.read())
for _ in range(120):
    try: get('/system_stats'); print('SERVER_UP'); break
    except Exception: time.sleep(5)
body = json.dumps({'prompt': WF, 'client_id': 'vace-flf-proof'}).encode()
req = urllib.request.Request('http://127.0.0.1:8188/prompt', data=body, headers={'Content-Type': 'application/json'})
with urllib.request.urlopen(req, timeout=60) as r: resp = json.loads(r.read())
print('QUEUED', resp)
pid = resp['prompt_id']
deadline = time.time() + 3300
hist = None
while time.time() < deadline:
    time.sleep(20)
    h = get(f'/history/{pid}')
    if pid in h:
        hist = h[pid]; print('STATUS', hist['status']); break
print(json.dumps(hist.get('status', {}), indent=1)[:2000] if hist else 'TIMEOUT_NO_HISTORY')
"""),
code("""# --- collect outputs + gate frames ---
outdir = pathlib.Path(f'{WORK}/out'); outdir.mkdir(exist_ok=True)
for f in glob.glob(f'{WORK}/ComfyUI/output/**/*.mp4', recursive=True):
    shutil.copy(f, outdir/pathlib.Path(f).name); print('OUTPUT', f)
mp4s = sorted(outdir.glob('*.mp4'))
assert mp4s, 'no mp4 produced'
clip = str(mp4s[-1])
for n, tag in [(0,'f000'), (24,'f024'), (48,'f048')]:
    sh(f"ffmpeg -v error -y -i {clip} -vf \"select='eq(n\\\\,{n})'\" -vsync vfr {outdir}/{tag}.png")
probe = sp.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height,nb_frames','-of','csv=p=0', clip], capture_output=True, text=True).stdout.strip()
print('PROOF CLIP (w,h,frames):', probe)
print('GATE_FRAMES_WRITTEN')
"""),
]
nb = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
      "language_info": {"name": "python", "version": "3.11"}}, "nbformat": 4, "nbformat_minor": 5}
(OUT/"mochiichao-vace-flf.ipynb").write_text(json.dumps(nb, indent=1))
meta = {"id": "marsfmmg/mochiichao-vace-flf", "title": "mochiichao-vace-flf",
  "code_file": "mochiichao-vace-flf.ipynb", "language": "python", "kernel_type": "notebook",
  "is_private": True, "enable_gpu": True, "enable_tpu": False, "enable_internet": True,
  "dataset_sources": ["marsfmmg/mochiichao-wan22-consistency-kit", "marsfmmg/mochiichao-vace-flf-job"],
  "competition_sources": [], "kernel_sources": []}
(OUT/"kernel-metadata.json").write_text(json.dumps(meta, indent=2))
print('kernel written to', OUT)
