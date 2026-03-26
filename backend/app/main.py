from __future__ import annotations

import logging
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.generate import router as generate_router
from app.routes.downloads import router as downloads_router

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="RenderCV API", version="1.0.0")


# ---------------------------------------------------------------------------
# CORS middleware — must be added before routes
# ---------------------------------------------------------------------------

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
logger.info("Configuring CORS for origins: %s", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Health endpoint
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    logger.info("Health check requested")
    return JSONResponse(status_code=200, content={"status": "ok"})


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

app.include_router(generate_router)
logger.info("generate_router registered successfully")

app.include_router(downloads_router)
logger.info("downloads_router registered successfully")


# ---------------------------------------------------------------------------
# Startup lifecycle event
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def on_startup():
    logger.info("Application startup complete — ready to receive requests")
