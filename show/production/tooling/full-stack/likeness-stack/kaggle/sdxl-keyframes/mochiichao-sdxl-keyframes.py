# Mochiichao - SDXL locked-keyframe generation (likeness-stack Lane A, step 2)
# Illustrious XL v2.0 (CreativeML Open RAIL-M) + per-character SDXL LoRA
# (from marsfmmg/mochiichao-sdxl-lora-train) + IP-Adapter PLUS (CLIP ViT-H,
# NOT FaceID) anchored on the canon cutout + ControlNet lineart from the
# drawn control source. Output: candidate keyframes for the owner's
# likeness gate - nothing here auto-passes; frames go to the gate packet.
# Pre-flight: workflow validated against LIVE /object_info before queueing.
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

def type_set(t):
    """object_info serialises union types comma-joined ('IMAGE,LATENT')."""
    if isinstance(t, list):  # combo input: list of choices, not a link type
        return None
    return {x.strip() for x in str(t).split(",")}


def normalize_workflow(wf):
    """Split a parsed workflow into (nodes, metadata) at parse time.

    A workflow file is a graph of node objects, but authors also park
    documentation at the top level — e.g. "_comment": "..." (a plain
    string) in workflows/sdxl_keyframe_api.json. A non-dict top-level
    entry is metadata, not a node: it must never reach validate() or
    the /prompt POST, both of which treat every entry as a node. The
    2026-10-28 ToonCrafter run died on exactly that: validate()
    reached the "_comment" string and crashed with AttributeError:
    'str' object has no attribute 'get' — after setup, before any
    generation. Normalising here keeps validate() strict: after this
    split, every remaining entry must be a real node.
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

COMMITS = {'ComfyUI_IPAdapter_plus': ('cubiq', 'a0f451a511c6'),
           'comfyui_controlnet_aux': ('Fannovel16', 'a587a4c159c6'),
           'ComfyUI-VideoHelperSuite': ('Kosinkadink', '4d907bee61c3')}
SHA = {
 'Illustrious-XL-v2.0.safetensors': 'c2a1a3eaa13d4c107dc7e00c3fe830cab427aa026362740ea094745b3422a331',
 'controlnet-canny-sdxl.safetensors': 'bf47cd757ceaf2572c53321329ef819ea38c09a6e3783588387913cd94dff47c',
 'controlnet-openpose-sdxl.safetensors': 'b8524e557a7df60d081f5d4a0eb109967d107df217943bf88c2d99b9ebcc06c5',
 'ip-adapter-plus_sdxl_vit-h.safetensors': '3f5062b8400c94b7159665b21ba5c62acdcd7682262743d7f2aefedef00e6581',
 'CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors': '6ca9667da1ca9e0b0f75e46bb030f7e011f44f86cbfb8d5a36590fcd7507b030',
}
# one job per run in this proof package: Dorowani, standing pose locked
# from his own canon line art, trigger prompt per the dataset captions.
JOB = {'char': 'dorowani', 'trigger': 'dorowani_mochii',
       'lora': 'dorowani_illustrious_lora.safetensors',
       'prompt': 'dorowani_mochii, full body, standing, arms slightly raised, flat 2d cartoon illustration, clean black outlines, cel shading, plain solid white background',
       'seed': 42}

try:
    log(subprocess.run(['nvidia-smi'], capture_output=True, text=True).stdout[:500])
    if not os.path.exists(f'{WORK}/ComfyUI'):
        sh(f'cd {WORK} && git clone -q --depth 1 https://github.com/comfyanonymous/ComfyUI.git')
        for repo, (org, commit) in COMMITS.items():
            sh(f'cd {WORK} && git clone -q https://github.com/{org}/{repo}.git ComfyUI/custom_nodes/{repo}')
            sh(f'cd {WORK}/ComfyUI/custom_nodes/{repo} && git checkout -q {commit}')
    sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/requirements.txt')
    log('SETUP_DONE')

    from huggingface_hub import hf_hub_download
    M = f'{WORK}/ComfyUI/models'
    def stage(repo, fn, sub, name):
        p = hf_hub_download(repo_id=repo, filename=fn)
        dst = f'{M}/{sub}/{name}'; os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy(p, dst)
        assert sha(dst) == SHA[name], f'{name} sha mismatch: {sha(dst)}'
        log('staged+verified', name, os.path.getsize(dst))
    stage('OnomaAIResearch/Illustrious-XL-v2.0', 'Illustrious-XL-v2.0.safetensors',
          'checkpoints', 'Illustrious-XL-v2.0.safetensors')
    stage('xinsir/controlnet-canny-sdxl-1.0', 'diffusion_pytorch_model.safetensors',
          'controlnet', 'controlnet-canny-sdxl.safetensors')
    stage('xinsir/controlnet-openpose-sdxl-1.0', 'diffusion_pytorch_model.safetensors',
          'controlnet', 'controlnet-openpose-sdxl.safetensors')
    stage('h94/IP-Adapter', 'sdxl_models/ip-adapter-plus_sdxl_vit-h.safetensors',
          'ipadapter', 'ip-adapter-plus_sdxl_vit-h.safetensors')
    stage('h94/IP-Adapter', 'models/image_encoder/model.safetensors',
          'clip_vision', 'CLIP-ViT-H-14-laion2B-s32B-b79K.safetensors')
    # character LoRA from the training dataset (dependency: sdxl-lora-train first)
    loras = glob.glob('/kaggle/input/**/dorowani_illustrious_lora.safetensors', recursive=True)
    assert loras, 'SDXL character LoRA not mounted - run mochiichao-sdxl-lora-train first and stage its output as a dataset'
    os.makedirs(f'{M}/loras', exist_ok=True)
    shutil.copy(loras[0], f"{M}/loras/{JOB['lora']}")
    log('lora staged', sha(f"{M}/loras/{JOB['lora']}"))

    # job inputs from the repo (canon cutout = anchor + lineart source)
    RAW = 'https://raw.githubusercontent.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start/main/'
    cin = f'{WORK}/ComfyUI/input'; os.makedirs(cin, exist_ok=True)
    for name, url in [('anchor_canon.png', RAW + 'show/production/canon-cutouts/dorowani.png'),
                      ('control_source.png', RAW + 'show/production/canon-cutouts/dorowani.png')]:
        urllib.request.urlretrieve(url, f'{cin}/{name}')
        log('input', name, 'sha256', sha(f'{cin}/{name}'))

    WF = json.loads(r'''{"1":{"class_type":"CheckpointLoaderSimple","inputs":{"ckpt_name":"Illustrious-XL-v2.0.safetensors"}},"10":{"class_type":"CLIPTextEncode","inputs":{"clip":["2",1],"text":"negative prompt placeholder - blurry, photorealistic, 3d render, cgi, deformed, extra limbs, bad anatomy, changing design, off-model"}},"11":{"class_type":"ControlNetApplyAdvanced","inputs":{"control_net":["5",0],"end_percent":1.0,"image":["4",0],"negative":["10",0],"positive":["9",0],"start_percent":0.0,"strength":0.85}},"12":{"class_type":"EmptyLatentImage","inputs":{"batch_size":1,"height":1216,"width":832}},"13":{"class_type":"KSampler","inputs":{"cfg":6.0,"denoise":1.0,"latent_image":["12",0],"model":["8",0],"negative":["11",1],"positive":["11",0],"sampler_name":"euler_ancestral","scheduler":"normal","seed":42,"steps":28}},"14":{"class_type":"VAEDecode","inputs":{"samples":["13",0],"vae":["1",2]}},"15":{"class_type":"SaveImage","inputs":{"filename_prefix":"keyframe","images":["14",0]}},"2":{"class_type":"LoraLoader","inputs":{"clip":["1",1],"lora_name":"CHARACTER_LORA_PLACEHOLDER.safetensors","model":["1",0],"strength_clip":1.0,"strength_model":1.0}},"3":{"class_type":"LoadImage","inputs":{"image":"control_source.png"}},"4":{"class_type":"AnimeLineArtPreprocessor","inputs":{"image":["3",0],"resolution":1024}},"5":{"class_type":"ControlNetLoader","inputs":{"control_net_name":"controlnet-canny-sdxl.safetensors"}},"6":{"class_type":"LoadImage","inputs":{"image":"anchor_canon.png"}},"7":{"class_type":"IPAdapterUnifiedLoader","inputs":{"model":["2",0],"preset":"PLUS (high strength)"}},"8":{"class_type":"IPAdapterAdvanced","inputs":{"combine_embeds":"concat","embeds_scaling":"V only","end_at":1.0,"image":["6",0],"ipadapter":["7",1],"model":["7",0],"start_at":0.0,"weight":0.6,"weight_type":"linear"}},"9":{"class_type":"CLIPTextEncode","inputs":{"clip":["2",1],"text":"TRIGGER_PLACEHOLDER, full body, standing pose, flat 2d cartoon illustration, clean black outlines, cel shading, plain solid white background"}},"_comment":"Lane A - locked keyframe generation. Illustrious XL v2.0 (CreativeML Open RAIL-M - commercial use of model + outputs permitted, Attachment A restrictions; see research/weights-and-licences.md) + per-character SDXL LoRA (node 2, trained by kaggle/sdxl-lora-train) + IP-Adapter PLUS (CLIP ViT-H variant - NOT FaceID; node 7 preset 'PLUS (high strength)', node 8 IPAdapterAdvanced, signatures verified in the cloned ComfyUI_IPAdapter_plus source) + ControlNet: AnimeLineArtPreprocessor (comfyui_controlnet_aux) extracting lineart from the drawn cue/pose source, applied through the xinsir Canny SDXL ControlNet (an edge-map model - lineart IS an edge map; this pairing is deliberate and documented in the WIRING-REPORT). Pose variant: swap node 4 to DWPreprocessor and node 5 to controlnet-openpose-sdxl.safetensors. Placeholders the kernel/runner fills per job: node 2 lora_name, node 9 text (trigger + pose caption), node 3 control source, node 6 canon anchor."}''')
    WF, WF_META = normalize_workflow(WF)
    WF['2']['inputs']['lora_name'] = JOB['lora']
    WF['9']['inputs']['text'] = JOB['prompt']
    WF['13']['inputs']['seed'] = JOB['seed']
    pathlib_workflow = f'{WORK}/workflow.json'
    open(pathlib_workflow, 'w').write(json.dumps(WF))
    log('workflow sha256', sha(pathlib_workflow))

    srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188',
                            '--disable-auto-launch'], cwd=f'{WORK}/ComfyUI',
                           stdout=open(f'{WORK}/comfy.log', 'w'), stderr=subprocess.STDOUT)
    def get(path):
        with urllib.request.urlopen(f'http://127.0.0.1:8188{path}', timeout=60) as r:
            return json.loads(r.read())
    import time
    for _ in range(120):
        try: get('/system_stats'); log('SERVER_UP'); break
        except Exception: time.sleep(5)
    oi = get('/object_info')
    errs = validate(WF, oi)
    if errs:
        for e in errs: log('VALIDATION', e)
        raise RuntimeError('PREFLIGHT_VALIDATION_FAILED: ' + ' | '.join(errs))
    log('PREFLIGHT_VALIDATION_PASS', len(WF), 'nodes vs live object_info')
    body = json.dumps({'prompt': WF, 'client_id': 'sdxl-keyframes-proof'}).encode()
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
    pid = resp['prompt_id']; deadline = time.time() + 1800; hist = None
    while time.time() < deadline:
        time.sleep(15)
        h = get(f'/history/{pid}')
        if pid in h: hist = h[pid]; break
    assert hist, 'TIMEOUT_NO_HISTORY'
    log('STATUS', json.dumps(hist['status'])[:500])
    outdir = f'{WORK}/out'; os.makedirs(outdir, exist_ok=True)
    for f in glob.glob(f'{WORK}/ComfyUI/output/**/*.png', recursive=True):
        shutil.copy(f, f'{outdir}/{os.path.basename(f)}'); log('OUTPUT', f, 'sha256', sha(f))
    shutil.copy(f'{cin}/anchor_canon.png', f'{outdir}/anchor_canon.png')
    log('GATE_PACKET_WRITTEN (candidate keyframes + canon anchor for the likeness gate)')
except Exception:
    log('KERNEL_EXCEPTION\n', traceback.format_exc())
finally:
    os.makedirs(f'{WORK}/out', exist_ok=True)
    open(f'{WORK}/out/RUN-LOG.txt', 'w').write('\n'.join(LOG))
    print('SCRIPT_DONE')
