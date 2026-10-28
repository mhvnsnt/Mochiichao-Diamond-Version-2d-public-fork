"""WIELDER memory — LanceDB (embedded, zero-infra) over the measured
corpus; top-3 retrieval hydration only (lost-in-the-middle
countermeasure). Embeddings: sentence-transformers BAAI/bge-small-en-v1.5
(MIT) when installed; otherwise a deterministic hash embedder whose use
is RECORDED in the run log and the provenance manifest — never a silent
swap.
"""
from __future__ import annotations

import hashlib
import math
from pathlib import Path
from typing import Optional

from . import constitution as C

DIM = 384  # bge-small-en-v1.5 dimension; the hash embedder matches it


def _hash_embed(text: str) -> list[float]:
    vec = [0.0] * DIM
    for tok in text.lower().split():
        h = int(hashlib.sha256(tok.encode()).hexdigest(), 16)
        vec[h % DIM] += 1.0
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


class _BgeEmbedder:
    name = "BAAI/bge-small-en-v1.5 via sentence-transformers"

    def __init__(self):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer("BAAI/bge-small-en-v1.5")

    def __call__(self, text: str) -> list[float]:
        return self.model.encode(text, normalize_embeddings=True).tolist()


class Memory:
    _embedder = None
    embedder_name = "uninitialised"

    def __init__(self, db_path: Optional[Path] = None):
        import lancedb
        self.db = lancedb.connect(str(db_path or (C.DATA / "lancedb")))
        if Memory._embedder is None:
            try:
                Memory._embedder = _BgeEmbedder()
                Memory.embedder_name = Memory._embedder.name
            except Exception:
                Memory._embedder = _hash_embed
                Memory.embedder_name = "hash-embedder (fallback — bge not installed)"

    def _table(self):
        names = self.db.table_names()
        if "docs" in names:
            return self.db.open_table("docs")
        return self.db.create_table("docs", data=[{
            "path": "seed", "chunk": 0, "text": "wielder memory store",
            "vector": Memory._embedder("wielder memory store")}])

    def index_files(self, paths: list[str], chunk_chars: int = 800) -> int:
        tbl = self._table()
        rows = []
        for p in paths:
            text = Path(p).read_text(errors="replace")
            for i in range(0, max(len(text), 1), chunk_chars):
                chunk = text[i:i + chunk_chars]
                if chunk.strip():
                    rows.append({"path": p, "chunk": i // chunk_chars, "text": chunk,
                                 "vector": Memory._embedder(chunk)})
        if rows:
            tbl.add(rows)
        return len(rows)

    def retrieve(self, query: str, k: int = C.RETRIEVAL_TOP_K) -> list[dict]:
        tbl = self._table()
        hits = tbl.search(Memory._embedder(query)).limit(k).to_list()
        return [{"path": h["path"], "chunk": h["chunk"], "text": h["text"][:400]} for h in hits]
