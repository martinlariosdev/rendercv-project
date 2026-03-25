from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes.generate import router as generate_router

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
    import rendercv

    return {"status": "ok", "rendercv_version": rendercv.__version__}
