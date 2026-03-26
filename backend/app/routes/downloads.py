from __future__ import annotations

import json
from pathlib import Path

from fastapi import APIRouter

router = APIRouter()

COUNTER_FILE = Path("/tmp/rendercv_download_count.json")


def _read_count() -> int:
    try:
        data = json.loads(COUNTER_FILE.read_text())
        return data.get("count", 0)
    except (FileNotFoundError, json.JSONDecodeError):
        return 0


def _write_count(count: int) -> None:
    COUNTER_FILE.write_text(json.dumps({"count": count}))


@router.post("/downloads/increment")
async def increment_downloads():
    count = _read_count() + 1
    _write_count(count)
    return {"count": count}


@router.get("/downloads/count")
async def get_downloads():
    return {"count": _read_count()}
