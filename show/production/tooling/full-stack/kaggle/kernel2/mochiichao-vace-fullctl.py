# Mochiichao - VACE-1.3B FULL-CONTROL proof (attempt 2, one-pass full-stack)
# Attempt 1 (sparse first/last-frame) is recorded in full-stack/run-records.
# Attempt 2 changes ONE variable: the control. Instead of two anchors with
# a gray span, the control is Dorowani's actual performed Water Orb clip
# (49 frames sampled from the shipped avatar bundle), mask all-white
# (generate everywhere, following the control), reference = canon cutout.
# Inputs are fetched from the repo in-session and hash-logged, so the run
# does not depend on this VM's filesystem or on a job dataset.
import subprocess, sys, os, json, time, shutil, glob, hashlib, traceback
import urllib.request

WORK = '/kaggle/working'
LOG = []
def log(*a):
    s = ' '.join(str(x) for x in a); print(s, flush=True); LOG.append(s)
def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    log('$', cmd, '\n', (r.stdout or '')[-1200:], (r.stderr or '')[-500:])
    return r
def sha(p):
    return hashlib.sha256(open(p, 'rb').read()).hexdigest()

try:
    log(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout[:500])

    # ---- setup: ComfyUI + VideoHelperSuite (fresh clones, code only) ----
    if not os.path.exists(f'{WORK}/ComfyUI'):
        sh(f'cd {WORK} && git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git')
        sh(f'cd {WORK} && git clone --depth 1 https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite.git ComfyUI/custom_nodes/ComfyUI-VideoHelperSuite')
    sh(f'cd {WORK}/ComfyUI && git rev-parse HEAD')
    sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/requirements.txt -r {WORK}/ComfyUI/custom_nodes/ComfyUI-VideoHelperSuite/requirements.txt')
    log('SETUP_DONE')

    # ---- stage weights from the staged consistency-kit dataset ----
    import pathlib
    inp = pathlib.Path('/kaggle/input')
    def find(name):
        hits = list(inp.rglob(name)); assert hits, f'MISSING {name}'; return hits[0]
    models = f'{WORK}/ComfyUI/models'
    for sub, name in [('diffusion_models', 'wan2.1_vace_1.3B_fp16.safetensors'),
                      ('vae', 'wan_2.1_vae.safetensors'),
                      ('text_encoders', 'umt5_xxl_fp8_e4m3fn_scaled.safetensors')]:
        src = find(name); dst = pathlib.Path(models)/sub/name
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists() or dst.is_symlink(): dst.unlink()
        os.symlink(src, dst); log('staged', name, src.stat().st_size)
    assert os.path.getsize(f'{models}/diffusion_models/wan2.1_vace_1.3B_fp16.safetensors') == 4309519800

    # ---- fetch canon inputs from the repo (owner's own art + kit graph) ----
    RAW = 'https://raw.githubusercontent.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/main/'
    srcdir = pathlib.Path(f'{WORK}/ins'); srcdir.mkdir(exist_ok=True)
    FETCH = {
        'perf.mp4':  RAW + 'show/assets/animations/dorowani-avatar-stack/dorowani-making_something.mp4',
        'cutout.png': RAW + 'show/production/canon-cutouts/dorowani.png',
        'wf_template.json': RAW + 'show/production/tooling/avatar-stack/wan21_vace_first_last_frame.json',
    }
    for name, url in FETCH.items():
        urllib.request.urlretrieve(url, srcdir/name)
        log('fetched', name, os.path.getsize(srcdir/name), 'sha256', sha(srcdir/name))

    # ---- build inputs in-session ----
    from PIL import Image
    import io
    cin = f'{WORK}/ComfyUI/input'; pathlib.Path(cin).mkdir(parents=True, exist_ok=True)
    # start frame: exact prep of the backend lane (alpha-bbox crop, 446x675 at (17,63) on white 480x768)
    rgba = Image.open(srcdir/'cutout.png').convert('RGBA')
    bbox = rgba.getchannel('A').getbbox(); rgba = rgba.crop(bbox)
    rgba.thumbnail((446, 675))
    start = Image.new('RGBA', (480, 768), (255, 255, 255, 255)); start.alpha_composite(rgba, (17, 63))
    start.convert('RGB').save(f'{WORK}/start.png'); log('start.png sha256', sha(f'{WORK}/start.png'))
    # performed control: 49 frames sampled from frames 24..168, composited on white 480x768
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', str(srcdir/'perf.mp4'), '-vf',
                          "select='between(n\\,24\\,168)'", '-vsync', 'vfr', '-f', 'image2pipe', '-vcodec', 'png', '-'],
                         stdout=subprocess.PIPE)
    buf = p.stdout.read(); p.wait()
    SIG = b'\x89PNG\r\n\x1a\n'; frames, i = [], 0
    while True:
        j = buf.find(SIG, i)
        if j < 0: break
        k = buf.find(SIG, j + 8); frames.append(buf[j:(k if k > 0 else len(buf))]); i = (k if k > 0 else len(buf))
    log('decoded performed frames:', len(frames))
    cdir = pathlib.Path(f'{WORK}/ctrl'); cdir.mkdir(exist_ok=True)
    idx = [round(t * (len(frames) - 1) / 48) for t in range(49)]
    for j, i2 in enumerate(idx):
        im = Image.open(io.BytesIO(frames[i2])).convert('RGB').resize((480, 480), Image.LANCZOS)
        canvas = Image.new('RGB', (480, 768), (255, 255, 255)); canvas.paste(im, (0, 144))
        canvas.save(cdir/f'c-{j:03d}.png')
        if j == 0: canvas.save(f'{WORK}/anchor-first.png')
        if j == 48: canvas.save(f'{WORK}/anchor-last.png')
    sh(f"ffmpeg -v error -y -framerate 16 -i {WORK}/ctrl/c-%03d.png -c:v libx264 -pix_fmt yuv420p {cin}/flf_control.mp4")
    sh(f"ffmpeg -v error -y -f lavfi -i color=white:size=480x768:rate=16:duration=3.07 -frames:v 49 -c:v libx264 -pix_fmt yuv420p {cin}/flf_mask.mp4")
    shutil.copy(srcdir/'cutout.png', f'{cin}/dorowani_cutout.png')
    for f in ('flf_control.mp4', 'flf_mask.mp4', 'anchor-first.png', 'anchor-last.png'):
        srcp = f'{cin}/{f}' if f.endswith('.mp4') else f'{WORK}/{f}'
        log('input', f, os.path.getsize(srcp), 'sha256', sha(srcp))

    # ---- patch the kit workflow (same deltas as attempt 1, new prefix) ----
    WF = json.loads((srcdir/'wf_template.json').read_text())['nodes']
    WF['1']['inputs']['unet_name'] = 'wan2.1_vace_1.3B_fp16.safetensors'
    for n in ('6', '7'): WF[n]['inputs']['frame_load_cap'] = 49
    WF['6']['inputs']['video'] = 'flf_control.mp4'; WF['7']['inputs']['video'] = 'flf_mask.mp4'
    WF['8']['inputs']['image'] = 'dorowani_cutout.png'
    WF['4']['inputs']['text'] = ("flat 2D cartoon animation, preserve the exact character design of the reference: "
        "a blue bipedal creature with red fin-like cheeks, red eyes, a light cream belly, a small dorsal fin and a tan shell on its back. "
        "The creature raises its arms and forms a glowing blue orb of water swirling in its right hand, its left hand coming up to its chest, "
        "holding the charged orb up toward the viewer. Plain solid white background, locked-off camera, no camera movement.")
    WF['5']['inputs']['text'] = ("photorealistic, 3d render, cgi, realistic, changing character design, morphing, deformed, "
        "extra limbs, extra characters, blurry, text, watermark, logo, colored background, camera movement, zoom")
    WF['9']['inputs']['width'] = 480; WF['9']['inputs']['height'] = 768; WF['9']['inputs']['length'] = 49
    WF['13']['inputs']['filename_prefix'] = 'dorowani_vace_fullctl_proof'
    pathlib.Path(f'{WORK}/workflow.json').write_text(json.dumps(WF))
    log('workflow sha256', sha(f'{WORK}/workflow.json'))

    # ---- audit (graph size == control size) ----
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                            'stream=width,height,nb_frames', '-of', 'csv=p=0', f'{cin}/flf_control.mp4'],
                           capture_output=True, text=True).stdout.strip()
    w, h, n = [int(x) for x in probe.split(',')[:3]]
    assert (WF['9']['inputs']['width'], WF['9']['inputs']['height'], WF['9']['inputs']['length']) == (w, h, n), probe
    log('AUDIT_PASS', probe)

    # ---- run ----
    srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188', '--disable-auto-launch'],
                           cwd=f'{WORK}/ComfyUI', stdout=open(f'{WORK}/comfy.log', 'w'), stderr=subprocess.STDOUT)
    def get(path):
        with urllib.request.urlopen(f'http://127.0.0.1:8188{path}', timeout=30) as r: return json.loads(r.read())
    for _ in range(120):
        try: get('/system_stats'); log('SERVER_UP'); break
        except Exception: time.sleep(5)
    body = json.dumps({'prompt': WF, 'client_id': 'vace-fullctl-proof'}).encode()
    req = urllib.request.Request('http://127.0.0.1:8188/prompt', data=body, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as r: resp = json.loads(r.read())
    log('QUEUED', resp)
    if resp.get('node_errors'): raise RuntimeError(f"node_errors: {resp['node_errors']}")
    pid = resp['prompt_id']; deadline = time.time() + 3300; hist = None
    while time.time() < deadline:
        time.sleep(20)
        hst = get(f'/history/{pid}')
        if pid in hst: hist = hst[pid]; break
    assert hist, 'TIMEOUT_NO_HISTORY'
    log('STATUS', json.dumps(hist['status'])[:800])

    # ---- collect outputs + gate frames + anchors ----
    outdir = pathlib.Path(f'{WORK}/out'); outdir.mkdir(exist_ok=True)
    for f in glob.glob(f'{WORK}/ComfyUI/output/**/*.mp4', recursive=True):
        shutil.copy(f, outdir/pathlib.Path(f).name); log('OUTPUT', f)
    mp4s = sorted(outdir.glob('*.mp4')); assert mp4s, 'no mp4 produced'
    clip = str(mp4s[-1])
    for nn, tag in [(0, 'f000'), (24, 'f024'), (48, 'f048')]:
        sh(f"ffmpeg -v error -y -i {clip} -vf \"select='eq(n\\,{nn})'\" -vsync vfr {outdir}/{tag}.png")
    for extra in ('start.png', 'anchor-first.png', 'anchor-last.png', 'workflow.json'):
        shutil.copy(f'{WORK}/{extra}', outdir/extra)
    probe = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
                            'stream=width,height,nb_frames', '-of', 'csv=p=0', clip], capture_output=True, text=True).stdout.strip()
    log('PROOF CLIP (w,h,frames):', probe, 'sha256', sha(clip))
    log('GATE_FRAMES_WRITTEN')
except Exception:
    log('KERNEL_EXCEPTION\n', traceback.format_exc())
finally:
    pathlib.Path(f'{WORK}/out').mkdir(exist_ok=True)
    pathlib.Path(f'{WORK}/out/RUN-LOG.txt').write_text('\n'.join(LOG))
    print('SCRIPT_DONE')
