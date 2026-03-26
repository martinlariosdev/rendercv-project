from __future__ import annotations

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.generate import router as generate_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RenderCV API", version="1.0.0")

allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)

app.include_router(generate_router)


@app.get("/health")
async def health():
    try:
        import rendercv

        version = rendercv.__version__
        logger.info("Health check passed. rendercv version: %s", version)
        return JSONResponse(
            status_code=200,
            content={"status": "ok", "rendercv_version": version},
        )
    except ImportError as exc:
        logger.error("Health check failed: rendercv could not be imported. %s", exc)
        return JSONResponse(
            status_code=503,
            content={"status": "error", "message": f"rendercv import failed: {exc}"},
        )
    except AttributeError as exc:
        logger.error("Health check failed: rendercv missing __version__. %s", exc)
        return JSONResponse(
            status_code=503,
            content={"status": "error", "message": f"rendercv attribute error: {exc}"},
        )
    except Exception as exc:
        logger.error("Health check failed with unexpected error. %s", exc)
        return JSONResponse(
            status_code=503,
            content={"status": "error", "message": f"Unexpected error: {exc}"},
        )
