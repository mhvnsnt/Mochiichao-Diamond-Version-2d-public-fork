"""Brain seats. The load-bearing seat is deterministic: a registered
method names its steps and the graph executes them — no model call is
required for the loop to run end-to-end. LLM seats are optional,
advisory/planning only, and their availability is MEASURED, never
assumed (seat_status below). Labels follow the honesty law.
"""
from __future__ import annotations

import os
import shutil
import urllib.request


def seat_status() -> list[dict]:
    seats = []
    # Ollama local seat (MIT runner; per-model licences apply to weights)
    binary = shutil.which("ollama")
    serving = False
    if binary:
        try:
            with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=2) as r:
                serving = r.status == 200
        except Exception:
            serving = False
    seats.append({"seat": "ollama-local", "bucket": "open source (runner, MIT)",
                  "installed": bool(binary), "serving": serving,
                  "blocker": None if serving else "ollama binary not installed on this VM"})
    # OpenRouter free tier (free proprietary, capped: 20 req/min;
    # 50 req/day without any credit purchase, 1,000/day after a one-time
    # $10 lifetime purchase — verified 2026-10-28, STACK.md §3)
    seats.append({"seat": "openrouter-free", "bucket": "free proprietary, capped",
                  "installed": bool(os.environ.get("OPENROUTER_API_KEY")), "serving": False,
                  "blocker": None if os.environ.get("OPENROUTER_API_KEY")
                  else "no OPENROUTER_API_KEY held — key creation is the owner's account action"})
    seats.append({"seat": "deterministic-method-executor", "bucket": "owner system",
                  "installed": True, "serving": True, "blocker": None})
    # Free-tier API seats (Addendum 9B): free proprietary, caps labelled.
    # A seat counts as wired only after a real smoke-test call (smoke_test
    # below); configured-but-untested = not wired.
    seats.append({"seat": "gemini-free", "bucket": "free proprietary, capped",
                  "installed": bool(os.environ.get("GEMINI_API_KEY")), "serving": False,
                  "blocker": None if os.environ.get("GEMINI_API_KEY")
                  else "no GEMINI_API_KEY held — one-step ask: owner creates a key in "
                       "Google AI Studio (aistudio.google.com/apikey) and stores it via "
                       "the Secure Vault flow; the key never transits chat"})
    seats.append({"seat": "groq-free", "bucket": "free proprietary, capped",
                  "installed": bool(os.environ.get("GROQ_API_KEY")), "serving": False,
                  "blocker": None if os.environ.get("GROQ_API_KEY")
                  else "no GROQ_API_KEY held — one-step ask: owner creates a key at "
                       "console.groq.com/keys and stores it via the Secure Vault flow"})
    return seats


def smoke_test(seat: str) -> dict:
    """One real call per seat, or an honest not-configured result. The
    manifest records THAT a key is configured + this result — never the
    key value."""
    import json as _json
    import urllib.request as _u
    tests = {
        "openrouter-free": ("OPENROUTER_API_KEY", "https://openrouter.ai/api/v1/auth/key"),
        "groq-free": ("GROQ_API_KEY", "https://api.groq.com/openai/v1/models"),
        "gemini-free": ("GEMINI_API_KEY", "https://generativelanguage.googleapis.com/v1beta/models"),
    }
    if seat not in tests:
        return {"seat": seat, "result": "no remote smoke test for this seat"}
    env, url = tests[seat]
    key = os.environ.get(env)
    if not key:
        return {"seat": seat, "result": "NOT CONFIGURED — no key held; seat not wired"}
    req = _u.Request(url, headers={"Authorization": f"Bearer {key}"} if seat != "gemini-free"
                     else {"x-goog-api-key": key})
    try:
        with _u.urlopen(req, timeout=15) as r:
            return {"seat": seat, "result": f"SMOKE OK — provider answered HTTP {r.status}"}
    except Exception as e:
        return {"seat": seat, "result": f"SMOKE FAILED — {type(e).__name__}: {e}"}
