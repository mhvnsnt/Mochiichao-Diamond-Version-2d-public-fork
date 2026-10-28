#!/usr/bin/env python3
"""Tests for preflight.py — every known silent failure class must ABORT,
and the two corrected workflows must PASS. Run: python3 -m unittest
test_preflight -v (from this folder). Fixtures are generated in a temp dir;
no GPU, no network."""
import copy
import hashlib
import json
import struct
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
PREFLIGHT = HERE / "preflight.py"
LOCKED = HERE / "workflow-i2v-locked.json"
TURBO = HERE / "workflow-turbo-fixed.json"


def make_png(path: Path) -> str:
    from PIL import Image
    Image.new("RGB", (64, 96), (30, 90, 200)).save(path)
    return hashlib.sha256(path.read_bytes()).hexdigest()


def make_safetensors(path: Path, keys: list[str]) -> None:
    header = {k: {"dtype": "F32", "shape": [1], "data_offsets": [0, 4]} for k in keys}
    raw = json.dumps(header).encode()
    path.write_bytes(struct.pack("<Q", len(raw)) + raw + b"\x00" * 4 * len(keys))


def run_preflight(*args: str) -> tuple[int, dict]:
    out = Path(tempfile.mkdtemp()) / "packet.json"
    r = subprocess.run([sys.executable, str(PREFLIGHT), *args, "--out", str(out)],
                       capture_output=True, text=True)
    return r.returncode, json.loads(out.read_text())


class PreflightTests(unittest.TestCase):
    def setUp(self):
        self.td = Path(tempfile.mkdtemp())
        self.ref = self.td / "dorowani_start_tight.png"
        self.digest = make_png(self.ref)

    def base_args(self, workflow: Path) -> list[str]:
        return ["--workflow", str(workflow), "--reference", str(self.ref),
                "--expected-sha256", self.digest]

    def test_locked_workflow_passes(self):
        code, pkt = run_preflight(*self.base_args(LOCKED), "--strict-vace")
        self.assertEqual(code, 0, pkt["failures"])
        self.assertEqual(pkt["verdict"], "PASS")

    def test_turbo_workflow_passes(self):
        code, pkt = run_preflight(*self.base_args(TURBO))
        self.assertEqual(code, 0, pkt["failures"])

    def test_missing_reference_aborts(self):
        code, pkt = run_preflight("--workflow", str(LOCKED),
                                  "--reference", str(self.td / "nope.png"),
                                  "--expected-sha256", self.digest)
        self.assertEqual(code, 2)
        self.assertTrue(any("missing" in f for f in pkt["failures"]))

    def test_unlogged_reference_hash_aborts(self):
        code, pkt = run_preflight("--workflow", str(LOCKED), "--reference", str(self.ref))
        self.assertEqual(code, 2)
        self.assertTrue(any("not logged" in f for f in pkt["failures"]))

    def test_hash_mismatch_aborts(self):
        code, pkt = run_preflight(*self.base_args(LOCKED)[:-1], "0" * 64)
        self.assertEqual(code, 2)
        self.assertTrue(any("mismatch" in f for f in pkt["failures"]))

    def test_disconnected_vace_reference_aborts(self):
        wf = json.loads(LOCKED.read_text())
        del wf["7"]["inputs"]["reference_image"]
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p), "--strict-vace")
        self.assertEqual(code, 2)
        self.assertTrue(any("reference_image" in f for f in pkt["failures"]))

    def test_missing_trim_wire_aborts(self):
        wf = json.loads(LOCKED.read_text())
        del wf["10"]
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p), "--strict-vace")
        self.assertEqual(code, 2)
        self.assertTrue(any("TrimVideoLatent" in f for f in pkt["failures"]))

    def test_stale_lora_args_aborts(self):
        wf = json.loads(TURBO.read_text())
        wf["3"]["inputs"]["lora_args"] = wf["3"]["inputs"].pop("lora")
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p))
        self.assertEqual(code, 2)
        self.assertTrue(any("lora_args" in f for f in pkt["failures"]))

    def test_zero_strength_lora_aborts(self):
        wf = json.loads(TURBO.read_text())
        wf["2"]["inputs"]["strength"] = 0
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p))
        self.assertEqual(code, 2)
        self.assertTrue(any("strength" in f for f in pkt["failures"]))

    def test_unconsumed_lora_aborts(self):
        wf = json.loads(TURBO.read_text())
        del wf["3"]["inputs"]["lora"]
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p))
        self.assertEqual(code, 2)
        self.assertTrue(any("not consumed" in f for f in pkt["failures"]))

    def test_scaled_t5_name_aborts_for_wrapper_loader(self):
        wf = json.loads(TURBO.read_text())
        wf["5"]["inputs"]["model_name"] = "umt5_xxl_fp8_e4m3fn_scaled.safetensors"
        p = self.td / "wf.json"; p.write_text(json.dumps(wf))
        code, pkt = run_preflight(*self.base_args(p))
        self.assertEqual(code, 2)
        self.assertTrue(any("scaled" in f for f in pkt["failures"]))

    def test_scaled_t5_file_header_aborts(self):
        t5 = self.td / "t5.safetensors"
        make_safetensors(t5, ["shared.weight", "scaled_fp8"])
        code, pkt = run_preflight(*self.base_args(TURBO), "--t5-file", str(t5))
        self.assertEqual(code, 2)
        self.assertTrue(any("scaled_fp8" in f for f in pkt["failures"]))

    def test_nonscaled_t5_file_header_passes(self):
        t5 = self.td / "t5.safetensors"
        make_safetensors(t5, ["shared.weight", "encoder.block.0.layer.0.weight"])
        code, pkt = run_preflight(*self.base_args(TURBO), "--t5-file", str(t5))
        self.assertEqual(code, 0, pkt["failures"])

    def test_native_scaled_t5_is_allowed(self):
        # The native CLIPLoader (locked workflow) legitimately uses the
        # scaled file; only wrapper T5 nodes are blocked.
        code, pkt = run_preflight(*self.base_args(LOCKED), "--strict-vace")
        self.assertEqual(code, 0, pkt["failures"])


if __name__ == "__main__":
    unittest.main()
