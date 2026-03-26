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


# ---------------------------------------------------------------------------
# Health endpoint — registered first so it is always reachable
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    logger.info("Health check requested")
    return JSONResponse(status_code=200, content={"status": "ok"})


# ---------------------------------------------------------------------------
# CORS middleware
# ---------------------------------------------------------------------------

try:
    raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    logger.info("Configuring CORS for origins: %s", allowed_origins)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_methods=["POST", "GET", "OPTIONS"],
        allow_headers=["Content-Type"],
    )
    logger.info("CORS middleware configured successfully")
except Exception:
    logger.exception("Failed to configure CORS middleware — continuing without it")


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

try:
    app.include_router(generate_router)
    logger.info("generate_router registered successfully")
except Exception:
    logger.exception("Failed to register generate_router")


# ---------------------------------------------------------------------------
# Startup / shutdown lifecycle events
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup():
    logger.info("Application startup complete — ready to receive requests")
