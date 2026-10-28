"""WIELDER tool layer — the execution layer accepts validated JSON
payloads only (Constitution #6). No raw text-to-shell: the only process
execution surfaces are (1) the finish-gate verifier, (2) scripts named
in a registered method record's `implementing` list. Writes under
scorer-owned paths are denied structurally (Constitution #3).
"""
from __future__ import annotations

import hashlib
import json
import subprocess
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field

from . import authz
from . import constitution as C
from . import methods as M
from .schemas import ToolResult


class GuardError(RuntimeError):
    pass


def assert_not_scorer_owned(path: str) -> None:
    p = str(Path(path).resolve())
    for prefix in C.SCORER_OWNED_PREFIXES:
        if p == prefix or p.startswith(prefix + "/"):
            raise GuardError(f"write denied: {p} is scorer-owned (scorer separation)")


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ---------- payload schemas ----------

class HashFile(BaseModel):
    path: str


class CheckArtifact(BaseModel):
    path: str


class RunVerifier(BaseModel):
    target_id: str
    skip_gate_run: bool = False


class ReadManifest(BaseModel):
    target_id: str


class RunRegisteredScript(BaseModel):
    method_id: str
    script_index: int = 0
    args: list[str] = Field(default_factory=list)


class Retrieve(BaseModel):
    query: str
    k: int = C.RETRIEVAL_TOP_K


class WriteRunFile(BaseModel):
    run_id: str
    relpath: str
    content: str


class RequestBrowserJob(BaseModel):
    """Browser execution, routed — never faked. Wielder has no signed-in
    browser of its own; a browser job is written as a job packet for the
    manager's browser lane (the platform pattern: a browser task carries
    an outcome + constraints; results return as handoffs; a receipt is
    not completion)."""
    intent: str
    steps: list[str] = Field(default_factory=list)
    start_url: str = ""


# ---------- implementations ----------

def _hash_file(p: HashFile) -> ToolResult:
    path = Path(p.path)
    if not path.exists():
        return ToolResult(tool="hash_file", ok=False, result={"exists": False, "path": p.path})
    return ToolResult(tool="hash_file", ok=True, result={
        "exists": True, "path": p.path, "bytes": path.stat().st_size, "sha256": sha256_of(path)})


def _check_artifact(p: CheckArtifact) -> ToolResult:
    path = Path(p.path)
    exists = path.exists() and path.stat().st_size > 0
    return ToolResult(tool="check_artifact", ok=True, result={
        "path": p.path, "exists_nonempty": exists,
        "bytes": path.stat().st_size if path.exists() else 0})


def _run_verifier(p: RunVerifier) -> ToolResult:
    authz.require("local-builds-renders", f"finish-gate verify {p.target_id}")
    cmd = [str(C.FINISH_GATE / "verify"), p.target_id]
    if p.skip_gate_run:
        cmd.append("--skip-gate-run")
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=900, cwd=str(C.FINISH_GATE))
    target = M.load_target(p.target_id)
    manifest = C.FINISH_GATE / "evidence" / f"{target['deliverable']}.json"
    return ToolResult(tool="run_verifier", ok=proc.returncode == 0, exit_code=proc.returncode,
                      result={"manifest_path": str(manifest), "manifest_exists": manifest.exists()},
                      raw_output=(proc.stdout or "") + (proc.stderr or ""))


def _read_manifest(p: ReadManifest) -> ToolResult:
    target = M.load_target(p.target_id)
    manifest = C.FINISH_GATE / "evidence" / f"{target['deliverable']}.json"
    if not manifest.exists():
        return ToolResult(tool="read_manifest", ok=False,
                          result={"manifest_path": str(manifest), "exists": False})
    data = json.loads(manifest.read_text())
    return ToolResult(tool="read_manifest", ok=True, result={
        "manifest_path": str(manifest), "exists": True, "sha256": sha256_of(manifest),
        "verdict": data.get("verdict"), "owner_gate": data.get("owner_gate"),
        "clauses": [{"id": c.get("id"), "status": c.get("status"),
                     "measured": str(c.get("measured"))[:200]} for c in data.get("clauses", [])]})


def _run_registered_script(p: RunRegisteredScript) -> ToolResult:
    authz.require("local-builds-renders", f"registered script of {p.method_id}")
    method = M.assert_accepted(p.method_id)  # Superseded/unregistered raise here
    scripts = method.get("implementing", [])
    if p.script_index >= len(scripts):
        return ToolResult(tool="run_registered_script", ok=False,
                          result={"error": "script_index out of range", "implementing": scripts})
    script = scripts[p.script_index]
    proc = subprocess.run(["python3", script, *p.args], capture_output=True, text=True, timeout=900)
    return ToolResult(tool="run_registered_script", ok=proc.returncode == 0, exit_code=proc.returncode,
                      result={"script": script}, raw_output=(proc.stdout or "") + (proc.stderr or ""))


def _retrieve(p: Retrieve) -> ToolResult:
    from .memory import Memory
    hits = Memory().retrieve(p.query, k=min(p.k, C.RETRIEVAL_TOP_K))
    return ToolResult(tool="retrieve", ok=True, result={"hits": hits})


def _write_run_file(p: WriteRunFile) -> ToolResult:
    dest = (C.DATA / "runs" / p.run_id / p.relpath).resolve()
    assert_not_scorer_owned(str(dest))
    if not str(dest).startswith(str((C.DATA / "runs").resolve()) + "/"):
        raise GuardError("write denied: outside the run workdir")
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(p.content)
    return ToolResult(tool="write_run_file", ok=True,
                      result={"path": str(dest), "bytes": dest.stat().st_size, "sha256": sha256_of(dest)})


def _request_browser_job(p: RequestBrowserJob) -> ToolResult:
    authz.require("browser-actions", f"browser job: {p.intent[:80]}")
    import time as _t
    job_id = "BJ-" + str(int(_t.time()))
    out = C.DATA / "browser-jobs" / f"{job_id}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"job_id": job_id, "intent": p.intent, "steps": p.steps,
                               "start_url": p.start_url,
                               "status": "QUEUED_FOR_BROWSER_LANE"}, indent=1))
    return ToolResult(tool="request_browser_job", ok=True,
                      result={"job_id": job_id, "job_path": str(out),
                              "status": "QUEUED_FOR_BROWSER_LANE",
                              "note": "routing receipt only — not execution, not completion"})


REGISTRY: dict[str, tuple[type[BaseModel], Any]] = {
    "hash_file": (HashFile, _hash_file),
    "check_artifact": (CheckArtifact, _check_artifact),
    "run_verifier": (RunVerifier, _run_verifier),
    "read_manifest": (ReadManifest, _read_manifest),
    "run_registered_script": (RunRegisteredScript, _run_registered_script),
    "retrieve": (Retrieve, _retrieve),
    "write_run_file": (WriteRunFile, _write_run_file),
    "request_browser_job": (RequestBrowserJob, _request_browser_job),
}


def call_tool(name: str, payload: dict) -> ToolResult:
    """The single execution entry point. Payload is validated against the
    tool's Pydantic schema before anything runs."""
    if name not in REGISTRY:
        return ToolResult(tool=name, ok=False, result={"error": f"unregistered tool {name}"})
    model, fn = REGISTRY[name]
    validated = model(**payload)  # raises on invalid payload — by design
    return fn(validated)
