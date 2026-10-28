#!/usr/bin/env python3
"""05_character_bank.py - character bank + scene chaining for scene-job v2.

Clean-room implementation of the two orchestration patterns OpenX-Inc/flow
(MIT, verified 2026-10-28) adds on top of a plain segment list:

  1. CHARACTER BANK (flow: src/flow/characters.py - CharacterRef{name,
     description, reference_image} + a manifest.json on disk; a reference
     image is captured on first appearance and reused as I2V/S2V
     conditioning on later appearances). Ours extends the record with the
     fields our lane actually needs: the canon cutout path, the CURRENT
     version mark for that cutout (current-version law), an optional
     per-character LoRA id, and the mouth/voice scope (human dialogue vs
     creature cries-only).
  2. SCENE CHAINING (flow: Scene/GeneratedClip schemas carry
     last_frame_path; generation conditions scene N+1 on scene N's last
     frame). Our freedom lane ALREADY does this inside one character's
     segment list (chain_segments.py extracts last frames). What flow
     adds and ours lacked is the same chaining ACROSS scene jobs and a
     persistent bank keyed by character id - that is what the
     `chain_plan` function below emits: an ordered job list where each
     scene's first segment for a character starts from that character's
     bank reference (or the previous scene's last frame when chaining).

This module is original code written for the Mochiichao formats
(scene-job v2); it copies no flow code. Stdlib only.

Usage:
  05_character_bank.py BANK_DIR register --id wispkin \
      --description "..." --cutout path.png [--reference ref.png] \
      [--current-version "canon cutout v1"] [--scope creature]
  05_character_bank.py BANK_DIR list
  05_character_bank.py BANK_DIR chain-plan SCENE_JOB.json [--previous-last-frames prev.json]
"""
import argparse, json, os, shutil, sys

SCHEMA = "mochiichao-show/character-bank/v1"


class Bank:
    def __init__(self, bank_dir):
        self.dir = bank_dir
        os.makedirs(bank_dir, exist_ok=True)
        self.manifest_path = os.path.join(bank_dir, "manifest.json")
        self.records = {}
        if os.path.exists(self.manifest_path):
            with open(self.manifest_path, encoding="utf-8") as f:
                doc = json.load(f)
            self.records = doc.get("characters", {})

    def save(self):
        doc = {"schema": SCHEMA, "characters": self.records}
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(doc, f, indent=2, ensure_ascii=False)

    def register(self, cid, description, cutout, reference=None,
                 current_version="", lora=None, scope="creature"):
        if scope not in ("human", "creature"):
            raise ValueError("scope must be 'human' or 'creature'")
        rec = self.records.get(cid, {})
        rec.update({"character": cid, "description": description,
                    "cutout": cutout, "current_version": current_version,
                    "lora": lora, "scope": scope})
        if reference:
            dst = os.path.join(self.dir, f"{cid}_ref{os.path.splitext(reference)[1]}")
            shutil.copyfile(reference, dst)
            rec["reference_image"] = dst
        rec.setdefault("reference_image", None)
        self.records[cid] = rec
        self.save()
        return rec

    def get(self, cid):
        return self.records.get(cid)

    def has_reference(self, cid):
        rec = self.records.get(cid)
        return bool(rec and rec.get("reference_image")
                    and os.path.exists(rec["reference_image"]))


def chain_plan(bank, scene_job, previous_last_frames=None):
    """Ordered generation plan for one scene-job v2 document.

    For each character, segment 1's start frame is the previous scene's
    last frame for that character when chaining was requested, else the
    bank reference image, else the canon cutout. Segments 2+ are marked
    'chain_from_previous_segment' - chain_segments.py fills the concrete
    PNG after each segment renders (the freedom lane's existing rule).
    """
    prev = previous_last_frames or {}
    plan = []
    for char in scene_job.get("characters", []):
        cid = char["character"]
        rec = bank.get(cid) or {}
        if cid in prev:
            first_start, why = prev[cid], "previous scene last frame (chained)"
        elif rec.get("reference_image"):
            first_start, why = rec["reference_image"], "character-bank reference"
        else:
            first_start, why = char.get("cutout", ""), "canon cutout (no bank reference yet)"
        for i, seg in enumerate(char.get("segments", [])):
            plan.append({
                "scene_id": scene_job.get("scene_id"),
                "character": cid,
                "segment_index": i,
                "action": seg.get("action", ""),
                "duration_s": seg.get("duration_s"),
                "seed": seg.get("seed"),
                "backend": seg.get("backend", "kaggle-wan22-ti2v-5b"),
                "start_frame": first_start if i == 0 else "chain_from_previous_segment",
                "start_frame_source": why if i == 0 else "chain_segments.py last-frame extraction",
                "capture_reference_on_first_appearance": i == 0 and not rec.get("reference_image"),
            })
    return {"schema": "mochiichao-show/chain-plan/v1",
            "scene_id": scene_job.get("scene_id"), "jobs": plan}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("bank_dir")
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("register")
    r.add_argument("--id", required=True)
    r.add_argument("--description", required=True)
    r.add_argument("--cutout", required=True)
    r.add_argument("--reference", default=None)
    r.add_argument("--current-version", default="")
    r.add_argument("--lora", default=None)
    r.add_argument("--scope", default="creature")
    sub.add_parser("list")
    c = sub.add_parser("chain-plan")
    c.add_argument("scene_job")
    c.add_argument("--previous-last-frames", default=None,
                   help="JSON map character -> last-frame PNG from the previous scene")
    a = ap.parse_args()
    bank = Bank(a.bank_dir)
    if a.cmd == "register":
        rec = bank.register(a.id, a.description, a.cutout, a.reference,
                            a.current_version, a.lora, a.scope)
        print(json.dumps(rec, indent=2))
    elif a.cmd == "list":
        print(json.dumps(bank.records, indent=2))
    elif a.cmd == "chain-plan":
        with open(a.scene_job, encoding="utf-8") as f:
            job = json.load(f)
        prev = {}
        if a.previous_last_frames:
            with open(a.previous_last_frames, encoding="utf-8") as f:
                prev = json.load(f)
        print(json.dumps(chain_plan(bank, job, prev), indent=2))


if __name__ == "__main__":
    main()
