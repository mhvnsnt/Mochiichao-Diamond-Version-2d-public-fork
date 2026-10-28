# Mochiichao — CORRECTIVE locked run (2026-10-28).
# Runs parity/workflow-i2v-locked.json (native Wan 2.1 VACE-1.3B, reference
# control ENGAGED) and parity/workflow-turbo-fixed.json (Wan 2.2 TI2V-5B +
# Turbo LoRA + non-scaled UMT5) for ONE character: Dorowani, Water Orb charge
# (a non-avatar-slot action). Every output is gated by frame1_gate.py; a clip
# without its packet is not a result.
#
# Order of operations is the countermeasure set, not a suggestion:
#   1. stage weights from the attached datasets (byte sizes asserted);
#   2. PREFLIGHT both workflows + the hash-logged tight reference
#      (preflight.py; ABORT before server boot / GPU work on any failure);
#   3. run the locked graph; AUDIT the submitted graph via /history
#      (reference_image wire, VACE unet, trim wire must be in the graph
#      that actually ran);
#   4. negative control: same locked graph, reference swapped to Wispkin —
#      frame 1 must follow the swapped reference, or the lock claim dies;
#   5. stage the non-scaled UMT5 from HF, verify size + preflight --t5-file
#      (header must contain no scaled_fp8 key), run the turbo-fixed graph;
#   6. frame1_gate every clip; write run-report.json with hashes + timings.
import subprocess, sys, os, json, time, shutil, glob, hashlib, traceback
import urllib.request

WORK = '/kaggle/working'
OUT = f'{WORK}/out'
os.makedirs(OUT, exist_ok=True)
REPORT = {'kernel': 'marsfmmg/mochiichao-locked-run', 'phases': {}}

def log(*a): print(' '.join(str(x) for x in a), flush=True)
def sh(cmd, **kw):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, **kw)
    if r.stdout: log(r.stdout[-800:])
    if r.returncode != 0 and r.stderr: log('STDERR', r.stderr[-800:])
    return r
def sha(p):
    h = hashlib.sha256()
    with open(p, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''): h.update(chunk)
    return h.hexdigest()
def find_input(name):
    hits = glob.glob(f'/kaggle/input/**/{name}', recursive=True)
    assert hits, f'job/dataset file missing under /kaggle/input: {name}'
    return hits[0]

try:
    log(sh('nvidia-smi').stdout[:400])

    # ---------- stage job files ----------
    JOB = f'{WORK}/job'; os.makedirs(JOB, exist_ok=True)
    for name in ('workflow-i2v-locked.json', 'workflow-turbo-fixed.json', 'preflight.py',
                 'frame1_gate.py', 'likeness_gate.py', 'dorowani_start_tight.png',
                 'wispkin_start_tight.png', 'reference-manifest.json'):
        shutil.copy(find_input(name), f'{JOB}/{name}')
    MANIFEST = json.load(open(f'{JOB}/reference-manifest.json'))
    DORO_SHA = MANIFEST['dorowani_start_tight.png']
    WISP_SHA = MANIFEST['wispkin_start_tight.png']
    assert sha(f'{JOB}/dorowani_start_tight.png') == DORO_SHA, 'dorowani tight reference hash mismatch vs manifest'
    assert sha(f'{JOB}/wispkin_start_tight.png') == WISP_SHA, 'wispkin tight reference hash mismatch vs manifest'
    log('job staged; reference hashes match manifest')

    # ---------- ComfyUI ----------
    if not os.path.exists(f'{WORK}/ComfyUI'):
        assert sh(f'cd {WORK} && git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git').returncode == 0
    sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/requirements.txt scipy')
    models = f'{WORK}/ComfyUI/models'
    def stage_model(name, sub, expect_size=None):
        src = find_input(name); dst = f'{models}/{sub}/{name}'
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.exists(dst) or os.path.islink(dst): os.unlink(dst)
        os.symlink(src, dst)
        size = os.path.getsize(dst)
        log('staged', name, size)
        if expect_size: assert size == expect_size, f'{name} size {size} != expected {expect_size}'
        return dst
    # Native VACE seat (consistency-kit dataset).
    stage_model('wan2.1_vace_1.3B_fp16.safetensors', 'diffusion_models', 4309519800)
    stage_model('wan_2.1_vae.safetensors', 'vae')
    stage_model('umt5_xxl_fp8_e4m3fn_scaled.safetensors', 'text_encoders')  # native loader only

    # ---------- PREFLIGHT (before any GPU work) ----------
    pf = sh(f'{sys.executable} {JOB}/preflight.py --workflow {JOB}/workflow-i2v-locked.json --strict-vace '
            f'--reference {JOB}/dorowani_start_tight.png --expected-sha256 {DORO_SHA} '
            f'--out {OUT}/preflight-locked.json')
    assert pf.returncode == 0, 'PREFLIGHT ABORT (locked workflow) — see preflight-locked.json'
    pf2 = sh(f'{sys.executable} {JOB}/preflight.py --workflow {JOB}/workflow-turbo-fixed.json '
             f'--reference {JOB}/dorowani_start_tight.png --expected-sha256 {DORO_SHA} '
             f'--out {OUT}/preflight-turbo.json')
    assert pf2.returncode == 0, 'PREFLIGHT ABORT (turbo workflow) — see preflight-turbo.json'
    REPORT['phases']['preflight'] = 'PASS (locked strict-vace + turbo)'
    log('PREFLIGHT PASS')

    # ---------- boot server ----------
    shutil.copy(f'{JOB}/dorowani_start_tight.png', f'{WORK}/ComfyUI/input/dorowani_start_tight.png')
    shutil.copy(f'{JOB}/wispkin_start_tight.png', f'{WORK}/ComfyUI/input/wispkin_start_tight.png')
    srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188', '--disable-auto-launch'],
                           cwd=f'{WORK}/ComfyUI', stdout=open(f'{WORK}/comfy.log', 'w'), stderr=subprocess.STDOUT)
    def get(path):
        with urllib.request.urlopen(f'http://127.0.0.1:8188{path}', timeout=30) as r: return json.loads(r.read())
    for _ in range(120):
        try: get('/system_stats'); log('COMFYUI_UP'); break
        except Exception: time.sleep(5)
    else: raise RuntimeError('ComfyUI did not come up')

    def run_graph(wf, label):
        body = json.dumps({'prompt': wf, 'client_id': f'locked-run-{label}'}).encode()
        req = urllib.request.Request('http://127.0.0.1:8188/prompt', data=body, headers={'Content-Type': 'application/json'})
        pid = json.loads(urllib.request.urlopen(req).read())['prompt_id']
        t0 = time.time()
        while time.time() - t0 < 2400:
            hist = get(f'/history/{pid}')
            entry = hist.get(pid)
            if entry and entry.get('status', {}).get('completed'):
                return pid, time.time() - t0, entry
            if entry and entry.get('status', {}).get('status_str') == 'error':
                raise RuntimeError(f'{label}: execution error: {json.dumps(entry.get("status"))[:600]}')
            time.sleep(5)
        raise RuntimeError(f'{label}: timed out')

    def find_output(prefix):
        hits = sorted(glob.glob(f'{WORK}/ComfyUI/output/{prefix}*.mp4'))
        assert hits, f'no output for {prefix}'
        return hits[-1]

    def gate(clip, reference, species, tag):
        pkt = f'{OUT}/{tag}_frame1_gate.json'
        r = sh(f'{sys.executable} {JOB}/frame1_gate.py --clip {clip} --reference {reference} '
               f'--species {species} --likeness-gate {JOB}/likeness_gate.py '
               f'--scratch {WORK}/gate-scratch-{tag} --out {pkt}')
        d = json.load(open(pkt))
        log('GATE', tag, d['verdict'], d['fail_class'])
        return d

    # ---------- phase 1: LOCKED run ----------
    wf = json.load(open(f'{JOB}/workflow-i2v-locked.json'))
    pid, secs, hist = run_graph(wf, 'locked')
    submitted = hist.get('prompt', [None, None, {}])[2] or {}
    audit = {
        'node7_reference_image': submitted.get('7', {}).get('inputs', {}).get('reference_image'),
        'node1_unet': submitted.get('1', {}).get('inputs', {}).get('unet_name'),
        'node10_trim_amount': submitted.get('10', {}).get('inputs', {}).get('trim_amount'),
    }
    audit_ok = (audit['node7_reference_image'] == ['6', 0]
                and audit['node1_unet'] == 'wan2.1_vace_1.3B_fp16.safetensors'
                and audit['node10_trim_amount'] == ['7', 3])
    json.dump(hist, open(f'{OUT}/history-locked.json', 'w'), indent=1)
    clip = find_output('locked_i2v_dorowani')
    dst = f'{OUT}/locked_i2v_dorowani.mp4'; shutil.copy(clip, dst)
    g = gate(dst, f'{JOB}/dorowani_start_tight.png', 'dorowani', 'locked')
    REPORT['phases']['locked'] = {'seconds': round(secs, 1), 'history_audit': audit, 'audit_ok': audit_ok,
                                  'clip': os.path.basename(dst), 'bytes': os.path.getsize(dst), 'sha256': sha(dst),
                                  'gate_verdict': g['verdict'], 'fail_class': g['fail_class'],
                                  'frame0_canon': g.get('canon_cutout_results', {}).get('0')}
    log('LOCKED DONE', REPORT['phases']['locked'])
    assert audit_ok, 'HISTORY AUDIT FAILED — the lock was not in the graph that ran'

    # ---------- phase 2: negative control (reference swapped to Wispkin) ----------
    wf_c = json.load(open(f'{JOB}/workflow-i2v-locked.json'))
    wf_c['6']['inputs']['image'] = 'wispkin_start_tight.png'
    wf_c['13']['inputs']['filename_prefix'] = 'locked_control_wispkin'
    pid, secs, hist = run_graph(wf_c, 'control')
    json.dump(hist, open(f'{OUT}/history-control.json', 'w'), indent=1)
    clip = find_output('locked_control_wispkin')
    dst = f'{OUT}/locked_control_wispkin.mp4'; shutil.copy(clip, dst)
    g_w = gate(dst, f'{JOB}/wispkin_start_tight.png', 'wispkin', 'control_vs_wispkin')
    g_d = gate(dst, f'{JOB}/dorowani_start_tight.png', 'dorowani', 'control_vs_dorowani')
    # Control works iff frame 1 follows Wispkin (its fed reference) better
    # than Dorowani on the fed-reference SSIM.
    s_w = g_w.get('fed_reference_results', {}).get('0', {}).get('measurements', {}).get('ssim_union')
    s_d = g_d.get('fed_reference_results', {}).get('0', {}).get('measurements', {}).get('ssim_union')
    REPORT['phases']['negative_control'] = {'seconds': round(secs, 1), 'clip': os.path.basename(dst),
                                            'sha256': sha(dst), 'frame0_ssim_vs_wispkin_ref': s_w,
                                            'frame0_ssim_vs_dorowani_ref': s_d,
                                            'control_follows_reference': (s_w is not None and s_d is not None and s_w > s_d)}
    log('CONTROL DONE', REPORT['phases']['negative_control'])

    # ---------- phase 3: TURBO-FIXED run (wrapper seat) ----------
    try:
        if not os.path.exists(f'{WORK}/ComfyUI/custom_nodes/ComfyUI-WanVideoWrapper'):
            assert sh(f'cd {WORK}/ComfyUI/custom_nodes && git clone --depth 1 https://github.com/kijai/ComfyUI-WanVideoWrapper.git').returncode == 0
            sh(f'{sys.executable} -m pip install -q -r {WORK}/ComfyUI/custom_nodes/ComfyUI-WanVideoWrapper/requirements.txt')
        stage_model('wan2.2_ti2v_5B_fp16.safetensors', 'diffusion_models')
        stage_model('wan2.2_vae.safetensors', 'vae')
        # Turbo LoRA filename differs across datasets; find by pattern.
        lora_hits = glob.glob('/kaggle/input/**/Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors', recursive=True)
        assert lora_hits, 'Turbo LoRA not found in attached datasets'
        dst = f'{models}/loras/Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors'
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        if os.path.exists(dst) or os.path.islink(dst): os.unlink(dst)
        os.symlink(lora_hits[0], dst); log('staged Turbo LoRA', os.path.getsize(dst))
        # Non-scaled UMT5: the fix file. Size-verify, then header-verify via preflight.
        from huggingface_hub import hf_hub_download
        p = hf_hub_download(repo_id='Kijai/WanVideo_comfy', filename='umt5-xxl-enc-fp8_e4m3fn.safetensors')
        t5_dst = f'{models}/text_encoders/umt5-xxl-enc-fp8_e4m3fn.safetensors'
        shutil.copy(p, t5_dst)
        size = os.path.getsize(t5_dst)
        assert size == 6731333792, f'non-scaled UMT5 size {size} != 6731333792'
        REPORT['phases']['umt5_stage'] = {'bytes': size, 'sha256': sha(t5_dst)}
        pf3 = sh(f'{sys.executable} {JOB}/preflight.py --workflow {JOB}/workflow-turbo-fixed.json '
                 f'--reference {JOB}/dorowani_start_tight.png --expected-sha256 {DORO_SHA} '
                 f'--t5-file {t5_dst} --out {OUT}/preflight-turbo-t5file.json')
        assert pf3.returncode == 0, 'PREFLIGHT ABORT (turbo + actual T5 file)'
        # Server restart so the wrapper nodes load.
        srv.terminate()
        try: srv.wait(timeout=60)
        except Exception: srv.kill()
        srv = subprocess.Popen([sys.executable, 'main.py', '--listen', '127.0.0.1', '--port', '8188', '--disable-auto-launch'],
                               cwd=f'{WORK}/ComfyUI', stdout=open(f'{WORK}/comfy2.log', 'w'), stderr=subprocess.STDOUT)
        for _ in range(120):
            try: get('/system_stats'); log('COMFYUI_UP_2'); break
            except Exception: time.sleep(5)
        else: raise RuntimeError('ComfyUI did not come up (phase 3)')
        wf_t = json.load(open(f'{JOB}/workflow-turbo-fixed.json'))
        pid, secs, hist = run_graph(wf_t, 'turbo')
        json.dump(hist, open(f'{OUT}/history-turbo.json', 'w'), indent=1)
        submitted = hist.get('prompt', [None, None, {}])[2] or {}
        lora_wire = submitted.get('3', {}).get('inputs', {}).get('lora')
        clip = find_output('turbo_fixed_dorowani')
        dst = f'{OUT}/turbo_fixed_dorowani.mp4'; shutil.copy(clip, dst)
        g = gate(dst, f'{JOB}/dorowani_start_tight.png', 'dorowani', 'turbo')
        REPORT['phases']['turbo'] = {'seconds': round(secs, 1), 'lora_wire_in_history': lora_wire,
                                     'clip': os.path.basename(dst), 'bytes': os.path.getsize(dst), 'sha256': sha(dst),
                                     'gate_verdict': g['verdict'], 'fail_class': g['fail_class'],
                                     'frame0_canon': g.get('canon_cutout_results', {}).get('0')}
        log('TURBO DONE', REPORT['phases']['turbo'])
    except Exception as e:
        REPORT['phases']['turbo'] = {'error': f'{type(e).__name__}: {e}'}
        log('TURBO PHASE FAILED (recorded, locked phase stands):', e)

    REPORT['status'] = 'DONE'
except Exception:
    REPORT['status'] = 'FAILED'
    REPORT['exception'] = traceback.format_exc()
    log('KERNEL_EXCEPTION\n', REPORT['exception'])
finally:
    json.dump(REPORT, open(f'{OUT}/run-report.json', 'w'), indent=1)
    log('REPORT', json.dumps(REPORT)[:1500])
    log('LOCKED_RUN_KERNEL_DONE')
