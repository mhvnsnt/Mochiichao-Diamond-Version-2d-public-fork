"""WIELDER chat launcher — Chainlit entry point at the package root.

Run from the package root (show/production/wielder/ once landed):
    chainlit run chat_app.py --host 127.0.0.1 --port 8897
The handlers live in wielder/chat.py; importing that module registers
them with Chainlit. This file exists so the app launches as a plain
file while the package keeps its relative imports.
"""
from wielder.chat import *  # noqa: F401,F403 — registers the Chainlit callbacks
from wielder import chat as _chat  # noqa: F401 — explicit module handle
