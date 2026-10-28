"""WIELDER dashboard — read-only status surface over the run ledger.
Title and surface are Wielder's; it renders ledger facts, nothing else.
Run: uvicorn wielder.dashboard:app --host 127.0.0.1 --port 8898
"""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.responses import HTMLResponse

from .ledger import Ledger

app = FastAPI(title="WIELDER")


@app.get("/runs")
def runs():
    return Ledger().list_runs()


@app.get("/runs/{run_id}")
def run(run_id: str):
    return Ledger().get_run(run_id)


@app.get("/", response_class=HTMLResponse)
def index():
    rows = "".join(
        f"<tr><td>{r['run_id']}</td><td>{r['state']}</td><td>#{r['card_id']}</td>"
        f"<td>{r['card_title']}</td><td>{r['blocker'] or ''}</td></tr>"
        for r in Ledger().list_runs())
    return ("<html><head><title>WIELDER</title></head><body>"
            "<h1>WIELDER — production Agentic AI system for the Mochiichao show</h1>"
            "<p>Read-only view of the run ledger. Done is issued only by the "
            "finish-gate verifier; this page reports ledger state.</p>"
            f"<table border='1' cellspacing='0' cellpadding='4'>{rows}</table>"
            "</body></html>")
