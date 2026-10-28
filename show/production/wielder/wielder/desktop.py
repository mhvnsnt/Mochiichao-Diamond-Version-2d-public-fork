"""The desktop layer (Addendum 13) — "headless" is a solved condition
in Wielder, never a reported limitation.

Components, all built on this VM's proven recipes:
- DISPLAY: the persistent Xvfb virtual display :99, started by the
  standing launcher ~/opt/bin/start-virtual-display.sh (idempotent).
- SESSION BUS: the recipe that unblocked the OpenToonz-class tools —
  a manual dbus-daemon on a workspace XDG_RUNTIME_DIR (dbus-run-session
  fails in this shell; the manual daemon works).
- ENV PRESETS: env_for(tool) hands any GUI tool a display, a bus, a
  runtime dir, and its Qt/platform preset automatically.
- HEADFUL BROWSER SEAT: a persistent-profile Chrome under :99
  (profile in Wielder's data dir; signed-in state persists across
  runs). GUI automation via xdotool for GUI-only applications.
- OWNER VIEW/TAKEOVER SEAT: x11vnc on the :99 display (started on
  demand) — the owner sees Wielder's desktop and can take over.
- SELF-PROVISIONING PREFLIGHT: self_provision() checks display, bus,
  scratch routing (workspace paths, never the 512MB /tmp), disk, and
  package state — and FIXES what is fixable itself, returning evidence
  for everything it did. Heavy work beyond this box's capacity routes
  to the Kaggle seat via the multi-door router (doors.py); capacity()
  reports the local GPU fact instead of a run discovering it by dying.

REJECTED-BLOCKER RULE: "headless", "no session bus", "needs a
desktop/display", "GUI only" are not blocker statements in any
Wielder report (the claim linter enforces this) unless the desktop
layer was actually attempted and the failed attempt's evidence is
attached.
"""
from __future__ import annotations

import os
import shutil
import socket
import subprocess
import time
from pathlib import Path

from . import constitution as C

DISPLAY = ":99"
LAUNCHER = Path.home() / "opt" / "bin" / "start-virtual-display.sh"
RUNTIME_DIR = C.DATA / "xdg-runtime"
BUS_ADDR_FILE = RUNTIME_DIR / "bus-address"
BROWSER_PROFILE = C.DATA / "browser-profile"
CHROME = "/usr/bin/google-chrome"
VNC_PORT = 5999


def _run(cmd: list[str], timeout: int = 60, env: dict | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout,
                          env=env)


def display_up() -> bool:
    return Path("/tmp/.X11-unix/X99").exists()


def ensure_display() -> dict:
    """Bring the virtual display up if it is down; return evidence."""
    was = display_up()
    if was:
        return {"display": DISPLAY, "was_up": True, "action": "none"}
    p = _run(["sh", str(LAUNCHER)], timeout=30)
    return {"display": DISPLAY, "was_up": False, "action": "started via start-virtual-display.sh",
            "launcher_exit": p.returncode, "up_now": display_up(),
            "launcher_tail": (p.stdout + p.stderr).strip().splitlines()[-1:]}


def bus_address() -> str | None:
    if BUS_ADDR_FILE.exists():
        addr = BUS_ADDR_FILE.read_text().strip()
        # a stale address file is worse than none: verify the socket lives
        path = addr.split("=", 1)[-1].split(",")[0] if "unix:path=" in addr else None
        if path and Path(path).exists():
            return addr
    return None


def ensure_bus() -> dict:
    """The manual-daemon recipe: dbus-daemon --session on a workspace
    XDG_RUNTIME_DIR. (dbus-run-session fails in this shell.)"""
    addr = bus_address()
    if addr:
        return {"bus": addr, "action": "none"}
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)
    os.chmod(RUNTIME_DIR, 0o700)
    p = _run(["dbus-daemon", "--session", "--fork", "--print-address=1",
              f"--address=unix:path={RUNTIME_DIR}/bus"], timeout=30)
    addr = (p.stdout or "").strip().splitlines()
    addr = addr[0] if addr else None
    if addr:
        BUS_ADDR_FILE.write_text(addr)
    return {"bus": addr, "action": "manual dbus-daemon started on workspace XDG_RUNTIME_DIR",
            "daemon_exit": p.returncode}


def env_for(tool: str = "") -> dict:
    """The environment any GUI tool runs with under Wielder."""
    env = dict(os.environ)
    env["DISPLAY"] = DISPLAY
    env["XDG_RUNTIME_DIR"] = str(RUNTIME_DIR)
    addr = bus_address()
    if addr:
        env["DBUS_SESSION_BUS_ADDRESS"] = addr
    env.setdefault("QT_QPA_PLATFORM", "xcb")
    tmp = C.DATA / "tmp"
    tmp.mkdir(parents=True, exist_ok=True)
    env["TMPDIR"] = str(tmp)
    return env


def scratch_check() -> dict:
    """Scratch routing: Wielder's scratch lives on workspace paths.
    /tmp is a 512MB tmpfs on this VM — the pinch rule."""
    import shutil as _sh
    ws = _sh.disk_usage(Path.home() / "workspace")
    return {"workspace_free_gb": round(ws.free / 1e9, 1),
            "tmp_note": "/tmp is a 512MB tmpfs; Wielder scratch is routed to workspace paths by env_for() and constitution paths"}


def capacity() -> dict:
    """Local capacity, measured: GPU presence decides whether heavy
    generation runs locally or routes to the Kaggle seat (doors.py)."""
    smi = shutil.which("nvidia-smi")
    gpu = None
    if smi:
        p = _run([smi, "--query-gpu=name,memory.total", "--format=csv,noheader"], timeout=20)
        gpu = (p.stdout or "").strip() or None
    return {"gpu": gpu,
            "heavy_work_route": "local GPU" if gpu else
            "no local GPU — heavy work routes to the Kaggle seat via the multi-door router (doors.py), never fails locally by surprise"}


def start_vnc_seat() -> dict:
    """Owner view/takeover seat: x11vnc attached to :99 on demand."""
    ensure_display()
    if shutil.which("x11vnc") is None:
        return {"vnc": None, "blocker": "x11vnc not installed (see deploy/STASH-MANIFEST.md)"}
    sock = socket.socket()
    try:
        sock.bind(("127.0.0.1", VNC_PORT))
        sock.close()
    except OSError:
        return {"vnc": f"127.0.0.1:{VNC_PORT}", "action": "already listening"}
    (C.DATA / "logs").mkdir(parents=True, exist_ok=True)
    log = open(C.DATA / "logs" / "x11vnc.log", "ab")
    subprocess.Popen(["x11vnc", "-display", DISPLAY, "-rfbport", str(VNC_PORT),
                      "-localhost", "-forever", "-shared", "-nopw"],
                     stdout=log, stderr=log, start_new_session=True)
    time.sleep(1)
    return {"vnc": f"127.0.0.1:{VNC_PORT}", "action": "x11vnc started on :99 (localhost only, shared, owner takeover = connect any VNC client; noVNC can proxy this port)"}


def browser_seat() -> dict:
    """Headful browser seat facts: persistent profile under the display."""
    return {"chrome": CHROME if Path(CHROME).exists() else None,
            "profile": str(BROWSER_PROFILE),
            "display": DISPLAY,
            "note": "persistent-profile Chrome under :99; signed-in state persists in the profile dir. "
                    "Wielder's unattended browser EXECUTION still routes through the manager's "
                    "browser lane (tools.request_browser_job); this seat is the local desktop surface."}


def self_provision() -> dict:
    """Preflight's environment pass: check, fix what's fixable, and
    return the evidence either way. Called by the graph's preflight
    node before any run's expensive steps."""
    evidence = {"display": ensure_display(), "bus": ensure_bus(),
                "scratch": scratch_check(), "capacity": capacity(),
                "browser_seat": browser_seat()}
    evidence["ok"] = bool(evidence["display"].get("up_now", True)) and bool(evidence["bus"].get("bus"))
    return evidence
