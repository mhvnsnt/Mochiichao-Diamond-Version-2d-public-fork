# Mochiichao - ToonCrafter inbetweening proof (likeness-stack Lane B, step 1)
# ToonCrafter (Apache-2.0) interpolates BETWEEN two canon keyframes instead
# of inventing a character. Proof design: take frame 0 and frame 92 of the
# canon TextRig idle_breathe clip (from the likeness-datasets tarball),
# prep both onto 512x320 white canvases, let ToonCrafter generate the 16
# inbetween frames, and package the REAL middle frame beside the generated
# middle frame so the gate can compare like for like.
# Pre-flight: the embedded workflow is validated against the server's LIVE
# /object_info before queueing (the attempt-2 VACE lesson).
import subprocess, sys, os, json, glob, shutil, hashlib, traceback
import urllib.request, urllib.error

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

WF = json.loads(r'''{"1":{"class_type":"LoadImage","inputs":{"image":"keyframe_start.png"}},"10":{"class_type":"CLIPTextEncode","inputs":{"clip":["7",0],"text":"flat 2d cartoon animation still, cel shading, clean black outlines, plain solid white background"}},"10b":{"class_type":"CLIPTextEncode","inputs":{"clip":["7",0],"text":"photorealistic, 3d render, cgi, blurry, deformed, extra limbs, changing character design"}},"11":{"class_type":"ToonCrafterInterpolation","inputs":{"cfg":7.0,"clip_vision":["8",0],"eta":1.0,"frames":16,"fs":10,"images":["5",0],"model":["6",0],"negative":["10b",0],"positive":["10",0],"seed":42,"steps":50,"vae_dtype":"fp16"}},"12":{"class_type":"ToonCrafterDecode","inputs":{"latent":["11",0],"model":["6",0],"vae_dtype":"fp16"}},"13":{"class_type":"VHS_VideoCombine","inputs":{"filename_prefix":"tooncrafter_inbetween","format":"video/h264-mp4","frame_rate":8,"images":["12",0],"loop_count":0,"pingpong":false,"save_output":true}},"2":{"class_type":"LoadImage","inputs":{"image":"keyframe_end.png"}},"3":{"class_type":"ImageScale","inputs":{"crop":"center","height":320,"image":["1",0],"upscale_method":"lanczos","width":512}},"4":{"class_type":"ImageScale","inputs":{"crop":"center","height":320,"image":["2",0],"upscale_method":"lanczos","width":512}},"5":{"class_type":"ImageBatch","inputs":{"image1":["3",0],"image2":["4",0]}},"6":{"class_type":"DownloadAndLoadDynamiCrafterModel","inputs":{"dtype":"fp16","fp8_unet":false,"model":"tooncrafter_512_interp-pruned-fp16.safetensors"}},"7":{"class_type":"DownloadAndLoadCLIPModel","inputs":{"model":"stable-diffusion-2-1-clip-fp16.safetensors"}},"8":{"class_type":"DownloadAndLoadCLIPVisionModel","inputs":{"model":"CLIP-ViT-H-fp16.safetensors"}},"_comment":"Lane B step 1 - ToonCrafter inbetweening between two locked canon keyframes. Adapted from ComfyUI-DynamiCrafterWrapper examples/tooncrafter_example_low_vram_01.json (author's own graph) with KJNodes helpers replaced by ComfyUI core nodes (ImageScale/ImageBatch) to cut kernel dependencies. Model: pruned FP16 checkpoint (Kijai/DynamiCrafter_pruned, sha256 in STAGING-MANIFEST). steps=50 = the official repo's DDIM setting (the wrapper example uses 20 for speed). Output 16 frames @ 512x320, 8fps; double to 16fps with Practical-RIFE downstream. Keyframes must be prepped to 512x320 white-field canvases by tools/prep_keyframes.py; the ImageScale nodes are a guard, not the composition step. Node signatures verified against the cloned wrapper source (nodes.py) 2026-10-28."}''')
def type_set(t):
    """object_info serialises union types comma-joined ('IMAGE,LATENT')."""
    if isinstance(t, list):  # combo input: list of choices, not a link type
        return None
    return {x.strip() for x in str(t).split(",")}


def normalize_workflow(wf):
    """Split a parsed workflow into (nodes, metadata) at parse time.

    A workflow file is a graph of node objects, but authors also park
    documentation at the top level — e.g. "_comment": "..." (a plain
    string) in workflows/tooncrafter_inbetween_api.json. A non-dict
    top-level entry is metadata, not a node: it must never reach
    validate() or the /prompt POST, both of which treat every entry as
    a node. The 2026-10-28 ToonCrafter run died on exactly that:
    validate() reached the "_comment" string and crashed with
    AttributeError: 'str' object has no attribute 'get' — after setup,
    before any generation. Normalising here keeps validate() strict:
    after this split, every remaining entry must be a real node.
    """
    if isinstance(wf.get("nodes"), dict):
        wf = wf["nodes"]  # UI-format wrapper: {"nodes": {...}, "links": [...]}
    nodes, meta = {}, {}
    for key, val in wf.items():
        (nodes if isinstance(val, dict) else meta)[key] = val
    return nodes, meta


def validate(wf, oi):
    errors = []
    for nid, node in wf.items():
        if not isinstance(node, dict):
            # Strict, but legible: metadata that survived to validation
            # is a defect to report, not a crash to die on (see
            # normalize_workflow — parse-time stripping is the fix).
            errors.append(f"entry {nid}: not a node object (got {type(node).__name__}); "
                          "metadata must be stripped by normalize_workflow() before validation")
            continue
        ct = node.get("class_type")
        if ct not in oi:
            errors.append(f"node {nid} ({ct}): unknown node class (not in object_info)")
            continue
        spec = oi[ct]
        inputs_spec = {}
        for section in ("required", "optional"):
            for name, tspec in spec.get("input", {}).get(section, {}).items():
                inputs_spec[name] = (tspec[0], section)
        present = node.get("inputs", {})
        for name, (t, section) in inputs_spec.items():
            if section == "required" and name not in present:
                errors.append(f"node {nid} ({ct}): Required input is missing: {name}")
        out_types_cache = {}
        for name, val in present.items():
            if not (isinstance(val, list) and len(val) == 2 and isinstance(val[0], (str, int))):
                continue  # widget value, not a link
            src_id, slot = str(val[0]), int(val[1])
            if name not in inputs_spec:
                continue  # extra input the class doesn't declare; ComfyUI ignores/warns
            expected = type_set(inputs_spec[name][0])
            if expected is None:
                errors.append(f"node {nid} ({ct}): input {name} is a combo, cannot be linked")
                continue
            if src_id not in wf:
                errors.append(f"node {nid} ({ct}): input {name} links from missing node {src_id}")
                continue
            src_node = wf[src_id]
            if not isinstance(src_node, dict):
                continue  # already reported above as a non-node entry
            src_ct = src_node.get("class_type")
            if src_ct not in oi:
                continue  # already reported above
            if src_id not in out_types_cache:
                out_types_cache[src_id] = oi[src_ct].get("output", [])
            outs = out_types_cache[src_id]
            if slot >= len(outs):
                errors.append(f"node {nid} ({ct}): input {name} links slot {slot} but {src_ct} has {len(outs)} outputs")
                continue
            actual = outs[slot]
            if "*" not in expected and "*" != actual and actual not in expected:
                errors.append(
                    f"node {nid} ({ct}): Return type mismatch: {name}, "
                    f"received_type({actual}) mismatch input_type({','.join(sorted(expected))})")
    return errors

# Parse-time normalisation (2026-10-28 fix): split the workflow's
# non-node metadata ("_comment") out of WF before validation and before
# the graph is POSTed to /prompt — both treat every entry as a node.
WF, WF_META = normalize_workflow(WF)

COMMITS = {'ComfyUI-DynamiCrafterWrapper': 'd312c62982e9',
           'ComfyUI-VideoHelperSuite': '4d907bee61c3'}
CKPT_SHA = '7a60eefa72b85b98400fe12c6cc66ea1af84d51b8bd4472cc7764dce499f8891'
TAR_SHA256 = 'd0611c21a0840f8a0cc750267b557648e25e34207d0ead417ce692b137adb61c'

try:
    log(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout[:500])

    # ---- setup: ComfyUI + wrapper + VHS at pinned commits ----
    if not os.path.exists(f'{WORK}/ComfyUI'):
        sh(f'cd {WORK} && git clone -q --depth 1 https://github.com/comfyanonymous/ComfyUI.git')
        for repo, commit in COMMITS.items():
            sh(f'cd {WORK} && git clone -q https://github.com/{"kijai" if "DynamiCrafter" in repo else "Kosinkadink"}/{repo}.git ComfyUI/custom_nodes/{repo}')
            sh(f'cd {WORK}/ComfyUI/custom_nodes/{repo} && git checkout -q {commit}')
    sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/requirements.txt')
    log('SETUP_DONE')

    # ---- ToonCrafter pruned FP16 checkpoint, hash-verified ----
    from huggingface_hub import hf_hub_download
    dcdir = f'{WORK}/ComfyUI/models/checkpoints/dynamicrafter'
    os.makedirs(dcdir, exist_ok=True)
    ck = hf_hub_download(repo_id='Kijai/DynamiCrafter_pruned',
                         filename='tooncrafter_512_interp-pruned-fp16.safetensors',
                         local_dir=dcdir)
    assert sha(ck) == CKPT_SHA, f'pruned ckpt sha mismatch: {sha(ck)}'
    log('TOONCRAFTER_CKPT_VERIFIED', os.path.getsize(ck))
    # sketch encoder staged alongside (wrapper downloads only the main file)
    hf_hub_download(repo_id='Kijai/DynamiCrafter_pruned',
                    filename='sketch_encoder-fp16.safetensors', local_dir=dcdir)

    # ---- job inputs: canon clip endpoints from the datasets tarball ----
    os.makedirs(f'{WORK}/data', exist_ok=True)
    inp = glob.glob('/kaggle/input/**/likeness-datasets.tar', recursive=True)
    if inp:
        assert sha(inp[0]) == TAR_SHA256, 'datasets tar missing/hash mismatch'
        sh(f'tar -xf {inp[0]} -C {WORK}/data')
    else:
        man_hits = glob.glob('/kaggle/input/**/datasets.json', recursive=True)
        assert man_hits, 'likeness dataset not mounted (neither tar nor extracted layout)'
        src_root = os.path.dirname(man_hits[0])
        sh(f'cp -r {src_root}/. {WORK}/data/')
        log('DATASET_LAYOUT_EXTRACTED', src_root)
    man = json.load(open(f'{WORK}/data/datasets.json'))
    bad = [f['path'] for f in man['files'] if sha(f"{WORK}/data/{f['path']}") != f['sha256']]
    assert not bad, f'per-file hash mismatches: {bad}'
    log('DATASET_VERIFIED', len(man['files']))
    clip = f'{WORK}/data/dorowani/musubi/clips_49/idle_breathe.mp4'
    cin = f'{WORK}/ComfyUI/input'; os.makedirs(cin, exist_ok=True)
    sh(f"ffmpeg -v error -y -i {clip} -vf \"select='eq(n\\,0)'\" -vsync vfr {WORK}/f_first.png")
    sh(f"ffmpeg -v error -y -i {clip} -vf \"select='eq(n\\,92)'\" -vsync vfr {WORK}/f_last.png")
    sh(f"ffmpeg -v error -y -i {clip} -vf \"select='eq(n\\,46)'\" -vsync vfr {WORK}/f_mid_real.png")
    from PIL import Image
    def prep(src, dst, w=512, h=320):
        im = Image.open(src).convert('RGBA')
        bb = im.getchannel('A').getbbox() or (0, 0, im.width, im.height)
        # clip frames are already white-field RGB; bbox on non-white instead
        rgb = im.convert('RGB')
        mask = rgb.convert('L').point(lambda v: 0 if v > 250 else 255)
        bb = mask.getbbox() or (0, 0, w, h)
        im = rgb.crop(bb); im.thumbnail((int(w * 0.94), int(h * 0.94)), Image.LANCZOS)
        c = Image.new('RGB', (w, h), (255, 255, 255))
        c.paste(im, ((w - im.width) // 2, (h - im.height) // 2)); c.save(dst)
        log('prepped', dst, 'sha256', sha(dst))
    prep(f'{WORK}/f_first.png', f'{cin}/keyframe_start.png')
    prep(f'{WORK}/f_last.png', f'{cin}/keyframe_end.png')
    shutil.copy(f'{WORK}/f_mid_real.png', f'{WORK}/real_mid_frame.png')

    # ---- run with pre-flight validation ----
    srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188',
                            '--disable-auto-launch'], cwd=f'{WORK}/ComfyUI',
                           stdout=open(f'{WORK}/comfy.log', 'w'), stderr=subprocess.STDOUT)
    def get(path):
        with urllib.request.urlopen(f'http://127.0.0.1:8188{path}', timeout=60) as r:
            return json.loads(r.read())
    for _ in range(120):
        try: get('/system_stats'); log('SERVER_UP'); break
        except Exception: import time; time.sleep(5)
    oi = get('/object_info')
    errs = validate(WF, oi)
    if errs:
        for e in errs: log('VALIDATION', e)
        raise RuntimeError('PREFLIGHT_VALIDATION_FAILED: ' + ' | '.join(errs))
    log('PREFLIGHT_VALIDATION_PASS', len(WF), 'nodes vs live object_info')
    body = json.dumps({'prompt': WF, 'client_id': 'tooncrafter-proof'}).encode()
    req = urllib.request.Request('http://127.0.0.1:8188/prompt', data=body,
                                 headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req, timeout=60) as r: resp = json.loads(r.read())
    except urllib.error.HTTPError as he:
        detail = he.read().decode('utf-8', 'replace')[:3000]
        log('PROMPT_HTTP_ERROR', he.code, detail)
        raise RuntimeError(f'/prompt HTTP {he.code}: {detail}')
    log('QUEUED', resp)
    if resp.get('node_errors'): raise RuntimeError(f"node_errors: {resp['node_errors']}")
    pid = resp['prompt_id']
    import time; deadline = time.time() + 2400; hist = None
    while time.time() < deadline:
        time.sleep(20)
        h = get(f'/history/{pid}')
        if pid in h: hist = h[pid]; break
    assert hist, 'TIMEOUT_NO_HISTORY'
    log('STATUS', json.dumps(hist['status'])[:500])

    outdir = f'{WORK}/out'; os.makedirs(outdir, exist_ok=True)
    mp4s = sorted(glob.glob(f'{WORK}/ComfyUI/output/**/*.mp4', recursive=True))
    assert mp4s, 'no mp4 produced'
    clipout = mp4s[-1]; shutil.copy(clipout, f'{outdir}/tooncrafter_inbetween.mp4')
    log('OUTPUT', clipout, 'sha256', sha(clipout))
    sh(f"ffmpeg -v error -y -i {clipout} -vf \"select='eq(n\\,8)'\" -vsync vfr {outdir}/gen_mid_frame.png")
    shutil.copy(f'{WORK}/real_mid_frame.png', f'{outdir}/real_mid_frame.png')
    shutil.copy(f'{cin}/keyframe_start.png', f'{outdir}/keyframe_start.png')
    shutil.copy(f'{cin}/keyframe_end.png', f'{outdir}/keyframe_end.png')
    log('GATE_PACKET_WRITTEN (gen clip + generated mid frame + REAL mid frame + both input keyframes)')
except Exception:
    log('KERNEL_EXCEPTION\n', traceback.format_exc())
finally:
    os.makedirs(f'{WORK}/out', exist_ok=True)
    open(f'{WORK}/out/RUN-LOG.txt', 'w').write('\n'.join(LOG))
    print('SCRIPT_DONE')
