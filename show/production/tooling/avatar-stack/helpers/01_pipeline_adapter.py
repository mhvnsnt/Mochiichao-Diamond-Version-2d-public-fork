#!/usr/bin/env python3
"""01_pipeline_adapter.py - AIComicBuilder pipeline shape -> Mochiichao scene-job v2.

Clean-room adapter. It takes an AIComicBuilder-STYLE project export (the
data model documented in that repo's README: Project / Character / Shot /
Dialogue / Task) and emits OUR wired formats:

  * a scene-job v2 JSON (schema "mochiichao-show/scene-job/v2", the format
    consumed by the freedom lane: run_backend.py per segment,
    chain_segments.py, scene_composite.py), and
  * a subtitles .srt built from each shot's dialogue start/end ratios
    (AIComicBuilder's own schema carries dialogue_start_ratio /
    dialogue_end_ratio per shot - drizzle migrations 0018/0019).

PAID-SLOT RULE (owner free rule): AIComicBuilder's named generators are
hosted paid APIs (text: OpenAI/Gemini; image: DALL-E/Imagen/Kling;
video: Seedance/Kling/Veo). None of them is wired here. Every generator
slot in the input is REWRITTEN to a local backend id:

    text  -> local-qwen-text          (script assistance, local Qwen)
    image -> local-wan-keyframe       (Wan/ComfyUI keyframe on our seat)
    video -> kaggle-wan22-ti2v-5b     (our wired Wan 2.2 backend)
    tts   -> local-tts-chatterbox / local-tts-kokoro (staged voice weights)

If the input names a paid provider for a slot, the adapter records it in
the output's "blocked_paid_slots" list and still substitutes the local
backend. It never emits a job that calls a paid API.

Stdlib only. Usage:
  01_pipeline_adapter.py INPUT.json --out-dir DIR [--scene-id ID]
Writes <scene-id>.scene-job.json and <scene-id>.srt into DIR.
"""
import argparse, json, os, sys

PAID_PROVIDERS = {
    "openai", "gpt", "dall-e", "dalle", "gemini", "imagen", "kling",
    "seedance", "veo", "runway", "elevenlabs", "anthropic", "claude",
}
LOCAL_SLOTS = {
    "text": "local-qwen-text",
    "image": "local-wan-keyframe",
    "video": "kaggle-wan22-ti2v-5b",
    "tts": "local-tts-chatterbox",
}


def is_paid(name):
    if not name:
        return False
    low = str(name).lower()
    return any(p in low for p in PAID_PROVIDERS)


def srt_time(seconds):
    ms = int(round(seconds * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def convert(project):
    blocked = []
    providers = project.get("providers", {}) or {}
    slots = {}
    for slot, local in LOCAL_SLOTS.items():
        named = providers.get(slot)
        if is_paid(named):
            blocked.append({"slot": slot, "named_paid_provider": named,
                            "replaced_with": local})
        slots[slot] = local

    characters = {}
    for c in project.get("characters", []):
        cid = c.get("id") or c.get("name", "").strip().lower().replace(" ", "_")
        characters[cid] = {
            "character": cid,
            "cutout": c.get("reference_image") or c.get("four_view") or "",
            "description": c.get("description", ""),
            "segments": [],
        }

    srt_blocks, cursor = [], 0.0
    shots = sorted(project.get("shots", []),
                   key=lambda s: s.get("shot_number", 0))
    for i, shot in enumerate(shots):
        duration = float(shot.get("duration_s", 5.0))
        prompt = shot.get("video_prompt") or shot.get("description", "")
        cids = shot.get("characters") or list(characters)[:1]
        for cid in cids:
            if cid not in characters:
                characters[cid] = {"character": cid, "cutout": "",
                                   "description": "", "segments": []}
            characters[cid]["segments"].append({
                "action": prompt,
                "duration_s": duration,
                "seed": 1000 + i * 10 + len(characters[cid]["segments"]),
                "backend": slots["video"],
                "first_frame": shot.get("first_frame"),
                "last_frame": shot.get("last_frame"),
            })
        dlg = shot.get("dialogue") or {}
        if dlg.get("text"):
            start = cursor + duration * float(dlg.get("start_ratio", 0.0))
            end = cursor + duration * float(dlg.get("end_ratio", 1.0))
            speaker = dlg.get("character", "")
            text = f"{speaker}: {dlg['text']}" if speaker else dlg["text"]
            srt_blocks.append(
                f"{len(srt_blocks) + 1}\n{srt_time(start)} --> {srt_time(end)}\n{text}\n")
        cursor += duration

    scene_id = project.get("scene_id") or project.get("title", "scene")
    scene_id = str(scene_id).strip().lower().replace(" ", "-")
    job = {
        "schema": "mochiichao-show/scene-job/v2",
        "scene_id": scene_id,
        "canvas": project.get("canvas", {"width": 1280, "height": 720}),
        "fps": project.get("fps", 24),
        "background": project.get("background", {"clip": "", "note": "set the CURRENT living background for this scene before running"}),
        "characters": [c for c in characters.values() if c["segments"]],
        "backend_slots": slots,
        "blocked_paid_slots": blocked,
        "source_format": "aicomicbuilder-style project export (adapter 01)",
    }
    return job, "\n".join(srt_blocks)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--out-dir", required=True)
    ap.add_argument("--scene-id", default=None)
    a = ap.parse_args()
    with open(a.input, encoding="utf-8") as f:
        project = json.load(f)
    if a.scene_id:
        project["scene_id"] = a.scene_id
    job, srt = convert(project)
    os.makedirs(a.out_dir, exist_ok=True)
    job_path = os.path.join(a.out_dir, job["scene_id"] + ".scene-job.json")
    srt_path = os.path.join(a.out_dir, job["scene_id"] + ".srt")
    with open(job_path, "w", encoding="utf-8") as f:
        json.dump(job, f, indent=2, ensure_ascii=False)
    with open(srt_path, "w", encoding="utf-8") as f:
        f.write(srt)
    print(f"scene job: {job_path} ({len(job['characters'])} characters, "
          f"{sum(len(c['segments']) for c in job['characters'])} segments)")
    print(f"subtitles: {srt_path} ({srt.count('-->')} cues)")
    if job["blocked_paid_slots"]:
        print("paid slots replaced with local backends:",
              json.dumps(job["blocked_paid_slots"]), file=sys.stderr)


if __name__ == "__main__":
    main()
