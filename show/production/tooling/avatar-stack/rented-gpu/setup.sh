#!/usr/bin/env bash
# Mochiichao avatar-stack — rented-GPU bootstrap.
#
# Run this ON a fresh rented Ubuntu instance (RunPod pod or Vast.ai
# instance) with an NVIDIA GPU. It builds the exact seat our Kaggle
# notebooks use — same ComfyUI, same workflows, same weights, same
# gates — with no queue in front of it.
#
# What it does, in order:
#   0. Loud preflight (GPU, disk, tools). Stops on any missing piece.
#   1. System packages.
#   2. This repo, cloned (the workflows + gate scripts live here).
#   3. ComfyUI + the one custom node pack the turbo graph needs.
#   4. Python venv with ComfyUI's own requirements (mirrors the
#      proven Kaggle seat: locked_run_kernel.py installs exactly
#      these, plus scipy).
#   5. Weights from our EXISTING staging — the private Kaggle
#      datasets we already own. Nothing is re-uploaded anywhere.
#      Needs your Kaggle API token at ~/.kaggle/kaggle.json
#      (owner-placed; this script never creates, prints, or commits
#      it — if it is absent the script stops and tells you).
#   6. The non-scaled UMT5 fix file from Hugging Face, size-asserted.
#   7. Weights symlinked into ComfyUI's models/ layout, byte sizes
#      asserted where the locked-run kernel asserts them.
#   8. Smoke check + the exact commands the RUNBOOK starts with.
#
# Idempotent: re-running skips what is already in place.
# Env overrides: STACK_ROOT (default /workspace/mochiichao-stack),
# MIN_FREE_GB (default 100), REPO_URL, SKIP_APT=1.
set -euo pipefail

STACK_ROOT="${STACK_ROOT:-/workspace/mochiichao-stack}"
MIN_FREE_GB="${MIN_FREE_GB:-100}"
REPO_URL="${REPO_URL:-https://github.com/mhvnsnt/Mochiichao-Diamond-Version-2d-fresh-start.git}"
REPO_DIR="$STACK_ROOT/repo"
COMFY_DIR="$STACK_ROOT/ComfyUI"
WEIGHTS_DIR="$STACK_ROOT/weights"
VENV_DIR="$STACK_ROOT/venv"
AVATAR_STACK_REL="show/production/tooling/avatar-stack"

log() { printf '\n== %s ==\n' "$*"; }
die() { printf '\nSETUP STOPPED: %s\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

# ---------- 0. Preflight ----------
log "Preflight"
have nvidia-smi || die "nvidia-smi not found — this box has no usable NVIDIA driver. Pick an instance/image with NVIDIA drivers installed."
nvidia-smi --query-gpu=name,memory.total --format=csv || die "nvidia-smi failed."
GPU_MEM_MB="$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1 | tr -d ' ')"
[ "${GPU_MEM_MB:-0}" -ge 16000 ] || die "GPU has ${GPU_MEM_MB} MB VRAM — the stack needs at least 16 GB (it runs T4-marginal) and wants 24 GB (RTX 4090)."
mkdir -p "$STACK_ROOT" "$WEIGHTS_DIR"
FREE_GB="$(df -Pk "$STACK_ROOT" | awk 'NR==2 {printf "%d", $4/1024/1024}')"
[ "${FREE_GB:-0}" -ge "$MIN_FREE_GB" ] || die "Only ${FREE_GB} GB free on the filesystem holding $STACK_ROOT — need >= ${MIN_FREE_GB} GB (weights alone are ~57 GB). On Vast.ai the disk size is fixed at instance creation: destroy and re-create with a bigger disk. On RunPod, attach a >= 150 GB network volume and point STACK_ROOT at it."
log "GPU + disk OK (${GPU_MEM_MB} MB VRAM, ${FREE_GB} GB free)"

# ---------- 1. System packages ----------
if [ "${SKIP_APT:-0}" != "1" ]; then
  log "System packages"
  SUDO=""
  if [ "$(id -u)" -ne 0 ]; then
    have sudo && SUDO="sudo" || die "Not root and no sudo — cannot install system packages. Re-run as root or set SKIP_APT=1 and install them yourself: git git-lfs python3 python3-venv python3-pip ffmpeg aria2 unzip rsync curl jq build-essential"
  fi
  if have apt-get; then
    $SUDO apt-get update -qq
    $SUDO apt-get install -y -qq git git-lfs python3 python3-venv python3-pip ffmpeg aria2 unzip rsync curl jq build-essential
  else
    log "No apt-get on this image — checking the tools are already present"
    for t in git python3 ffmpeg unzip rsync curl jq; do have "$t" || die "Missing tool: $t (and no apt-get to install it). Use an Ubuntu image."; done
  fi
fi
have git || die "git missing after package step."
have python3 || die "python3 missing after package step."
have ffmpeg || die "ffmpeg missing after package step."

# ---------- 2. This repo ----------
log "Repo (workflows + gates)"
if [ -d "$REPO_DIR/.git" ]; then
  git -C "$REPO_DIR" fetch --depth 1 origin main && git -C "$REPO_DIR" checkout -q main && git -C "$REPO_DIR" pull -q --ff-only || die "Repo exists at $REPO_DIR but could not be updated."
else
  git clone --depth 1 "$REPO_URL" "$REPO_DIR" || die "Repo clone failed: $REPO_URL"
fi
STACK_DIR="$REPO_DIR/$AVATAR_STACK_REL"
for f in parity/workflow-i2v-locked.json parity/workflow-turbo-fixed.json parity/preflight.py parity/frame1_gate.py likeness_gate.py; do
  [ -f "$STACK_DIR/$f" ] || die "Expected stack file missing from repo clone: $AVATAR_STACK_REL/$f"
done

# ---------- 3. ComfyUI + WanVideoWrapper ----------
log "ComfyUI"
if [ -d "$COMFY_DIR/.git" ]; then
  log "ComfyUI already cloned — leaving as-is"
else
  git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git "$COMFY_DIR" || die "ComfyUI clone failed."
fi
# The locked graph is 100% ComfyUI core nodes. The turbo-fixed graph is
# 100% kijai WanVideoWrapper nodes — that one pack is the only custom
# node the stack needs.
WRAPPER_DIR="$COMFY_DIR/custom_nodes/ComfyUI-WanVideoWrapper"
if [ -d "$WRAPPER_DIR/.git" ]; then
  log "WanVideoWrapper already cloned — leaving as-is"
else
  git clone --depth 1 https://github.com/kijai/ComfyUI-WanVideoWrapper.git "$WRAPPER_DIR" || die "WanVideoWrapper clone failed."
fi

# ---------- 4. Python venv ----------
log "Python environment"
[ -d "$VENV_DIR" ] || python3 -m venv "$VENV_DIR" || die "venv creation failed (python3-venv installed?)"
PY="$VENV_DIR/bin/python"
"$PY" -m pip install -q --upgrade pip
"$PY" -m pip install -q -r "$COMFY_DIR/requirements.txt" scipy || die "ComfyUI requirements install failed."
"$PY" -m pip install -q -r "$WRAPPER_DIR/requirements.txt" || die "WanVideoWrapper requirements install failed."
"$PY" -m pip install -q kaggle huggingface_hub || die "kaggle / huggingface_hub install failed."
"$PY" -c "import torch; assert torch.cuda.is_available(), 'torch cannot see the GPU'; print('torch', torch.__version__, 'on', torch.cuda.get_device_name(0))" || die "torch CUDA check failed — the box's driver and the installed torch build disagree. This mirrors the Kaggle seat's unpinned requirements; if it fails, fix the image/driver first, do not improvise pins here."

# ---------- 5. Weights from our Kaggle staging ----------
log "Weights — Kaggle datasets (existing staging, nothing re-uploaded)"
KAGGLE_JSON="${KAGGLE_CONFIG_DIR:-$HOME/.kaggle}/kaggle.json"
if [ ! -f "$KAGGLE_JSON" ]; then
  cat >&2 <<'EOF'
SETUP STOPPED: no Kaggle API token at ~/.kaggle/kaggle.json.

The weights live in our private Kaggle datasets. The token is the
owner's credential and only the owner places it:
  1. kaggle.com -> Settings -> API -> Create New Token (downloads
     kaggle.json). (The programme already has one in use on the
     owner's VM — the same file works here.)
  2. Copy that file onto this box at ~/.kaggle/kaggle.json
     (scp / the pod's file browser), then chmod 600 it.
  3. Re-run this script — everything before this step is already done.
Never commit kaggle.json to the repo or paste it into chat.
EOF
  exit 2
fi
chmod 600 "$KAGGLE_JSON" || true
KG="$VENV_DIR/bin/kaggle"

ensure_dataset() { # slug dest anchor_glob
  local slug="$1" dest="$2" anchor="$3"
  mkdir -p "$dest"
  if [ -f "$dest/.download-ok" ] && find "$dest" -name "$anchor" -print -quit | grep -q .; then
    log "Dataset $slug already present — skipping"
    return 0
  fi
  "$KG" datasets download -d "$slug" -p "$dest" --unzip || die "Kaggle download failed for dataset $slug (check the token's account owns it: marsfmmg)."
  find "$dest" -name "$anchor" -print -quit | grep -q . || die "Dataset $slug downloaded but anchor file '$anchor' not found inside — the dataset's contents changed; stop and reconcile with parity/ + the staging table before running anything."
  touch "$dest/.download-ok"
}

ensure_dataset "marsfmmg/mochiichao-wan22-core"            "$WEIGHTS_DIR/wan22-core"        "wan2.2_ti2v_5B_fp16.safetensors"
ensure_dataset "marsfmmg/mochiichao-wan22-consistency-kit" "$WEIGHTS_DIR/consistency-kit"   "wan2.1_vace_1.3B_fp16.safetensors"
ensure_dataset "marsfmmg/mochiichao-wan22-accel"           "$WEIGHTS_DIR/accel"             "*.safetensors"
ensure_dataset "marsfmmg/mochiichao-character-loras"       "$WEIGHTS_DIR/character-loras"   "*.safetensors"
ensure_dataset "marsfmmg/mochiichao-locked-job"            "$WEIGHTS_DIR/locked-job"        "reference-manifest.json"

# Qwen2.5-VL-7B was staged as a private cache KERNEL's output, not a
# dataset (see parity/QWEN-WIRING.md) — pull the kernel output.
QWEN_DIR="$WEIGHTS_DIR/qwen25vl7b-cache"
mkdir -p "$QWEN_DIR"
if [ -f "$QWEN_DIR/.download-ok" ] && find "$QWEN_DIR" -name "*.safetensors" -print -quit | grep -q .; then
  log "Qwen cache already present — skipping"
else
  "$KG" kernels output "marsfmmg/mochiichao-qwen25vl7b-cache" -p "$QWEN_DIR" || die "Qwen cache kernel output download failed (marsfmmg/mochiichao-qwen25vl7b-cache)."
  find "$QWEN_DIR" -name "*.safetensors" -print -quit | grep -q . || die "Qwen cache downloaded but holds no safetensors — stop and check parity/QWEN-WIRING.md."
  touch "$QWEN_DIR/.download-ok"
fi

# ---------- 6. Non-scaled UMT5 (the turbo fix file) ----------
log "Non-scaled UMT5 fix file (Kijai build — see parity/TURBO-T5-FIX.md)"
FIX_DIR="$WEIGHTS_DIR/fix"
mkdir -p "$FIX_DIR"
"$PY" - "$FIX_DIR" <<'EOF'
import os, sys
from huggingface_hub import hf_hub_download
dest = sys.argv[1]
p = hf_hub_download(repo_id="Kijai/WanVideo_comfy",
                    filename="umt5-xxl-enc-fp8_e4m3fn.safetensors",
                    local_dir=dest)
size = os.path.getsize(p)
assert size == 6731333792, f"non-scaled UMT5 size {size} != 6731333792 — wrong file, stopping"
print("UMT5 fix file OK:", p, size)
EOF

# ---------- 7. Stage into ComfyUI models/ (symlinks, like the kernel) ----------
log "Staging weights into ComfyUI/models"
MODELS_DIR="$COMFY_DIR/models"
find_one() { # name -> path, loud on missing/ambiguous
  local hits
  hits="$(find "$WEIGHTS_DIR" -name "$1" -not -path "*/fix/*" | sort)"
  [ -n "$hits" ] || die "Weight file not found anywhere under $WEIGHTS_DIR: $1 — a dataset's contents changed; reconcile before running."
  [ "$(printf '%s\n' "$hits" | wc -l)" -eq 1 ] || die "Weight file is ambiguous (multiple copies): $1\n$hits"
  printf '%s' "$hits"
}
link_model() { # name subdir [expected_size]
  local src dst
  src="$(find_one "$1")"
  dst="$MODELS_DIR/$2/$1"
  mkdir -p "$(dirname "$dst")"
  [ ! -e "$dst" ] && [ ! -L "$dst" ] || rm -f "$dst"
  ln -s "$src" "$dst"
  if [ -n "${3:-}" ]; then
    local size
    size="$(stat -c %s "$dst")"
    [ "$size" = "$3" ] || die "Size assert failed for $1: got $size, expected $3."
  fi
  log "staged $1 -> models/$2/"
}
# Native VACE seat (locked graph). The SCALED umt5 belongs ONLY here —
# the wrapper loader rejects it on sight (parity/TURBO-T5-FIX.md).
link_model "wan2.1_vace_1.3B_fp16.safetensors"        "diffusion_models" 4309519800
link_model "wan_2.1_vae.safetensors"                  "vae"
link_model "umt5_xxl_fp8_e4m3fn_scaled.safetensors"   "text_encoders"
# Turbo seat (wrapper graph).
link_model "wan2.2_ti2v_5B_fp16.safetensors"          "diffusion_models"
link_model "wan2.2_vae.safetensors"                   "vae"
link_model "Wan22_TI2V_5B_Turbo_lora_rank_64_fp16.safetensors" "loras"
# The fix file keeps its HF name (hyphens) — the turbo graph asks for
# exactly this name. NEVER point a wrapper text node at the scaled file.
FIX_LINK="$MODELS_DIR/text_encoders/umt5-xxl-enc-fp8_e4m3fn.safetensors"
mkdir -p "$(dirname "$FIX_LINK")"
[ ! -e "$FIX_LINK" ] && [ ! -L "$FIX_LINK" ] || rm -f "$FIX_LINK"
ln -s "$FIX_DIR/umt5-xxl-enc-fp8_e4m3fn.safetensors" "$FIX_LINK"
log "staged umt5-xxl-enc-fp8_e4m3fn.safetensors -> models/text_encoders/ (wrapper fix)"
# Optional post tools, linked only if the kit carries them.
for opt in "RealESRGAN_x4plus_anime_6B.pth:upscale_models"; do
  name="${opt%%:*}"; sub="${opt##*:}"
  if find "$WEIGHTS_DIR" -name "$name" -print -quit | grep -q .; then link_model "$name" "$sub"; else log "optional file not in staging, skipped: $name"; fi
done

# Job kit: reference stills for the locked proof pattern come from the
# locked-job dataset (hash-logged in its reference-manifest.json).
JOB_DIR="$STACK_ROOT/job"
mkdir -p "$JOB_DIR" "$STACK_ROOT/out"
cp "$STACK_DIR/parity/workflow-i2v-locked.json" "$STACK_DIR/parity/workflow-turbo-fixed.json" \
   "$STACK_DIR/parity/preflight.py" "$STACK_DIR/parity/frame1_gate.py" "$STACK_DIR/likeness_gate.py" "$JOB_DIR/"
find "$WEIGHTS_DIR/locked-job" -type f \( -name "*_start_tight.png" -o -name "reference-manifest.json" \) -exec cp {} "$JOB_DIR/" \; || true
ls "$JOB_DIR"/*_start_tight.png >/dev/null 2>&1 || die "No *_start_tight.png reference stills found in the locked-job dataset — the locked proof pattern needs them; reconcile with parity/LOCK-ENGAGEMENT.md."

# ---------- 8. Smoke check ----------
log "Smoke check"
"$PY" -m py_compile "$JOB_DIR/preflight.py" "$JOB_DIR/frame1_gate.py" "$JOB_DIR/likeness_gate.py" || die "Gate scripts do not compile."
"$PY" -c "import json; [json.load(open(f)) for f in ['$JOB_DIR/workflow-i2v-locked.json', '$JOB_DIR/workflow-turbo-fixed.json']]; print('workflows parse OK')"
du -sh "$WEIGHTS_DIR" | awk '{print "weights on disk: " $1}'
cat <<EOF

SETUP COMPLETE.
  Stack root : $STACK_ROOT
  ComfyUI    : $COMFY_DIR
  Job kit    : $JOB_DIR (workflows + preflight.py + frame1_gate.py + likeness_gate.py + references)
  Outputs go : $STACK_ROOT/out/<job-name>/

Start the server (from RUNBOOK.md):
  cd "$COMFY_DIR" && "$PY" main.py --listen 127.0.0.1 --port 8188 --disable-auto-launch

Then run the gates BEFORE any generation, exactly as the locked-run
kernel does (see RUNBOOK.md for the full sequence):
  "$PY" "$JOB_DIR/preflight.py" --workflow "$JOB_DIR/workflow-i2v-locked.json" --strict-vace \\
      --reference "$JOB_DIR/dorowani_start_tight.png" --expected-sha256 <sha from reference-manifest.json> \\
      --out "$STACK_ROOT/out/preflight-locked.json"
EOF
