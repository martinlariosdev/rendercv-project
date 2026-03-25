from fastapi import APIRouter

router = APIRouter()


@router.post("/generate")
async def generate():
    return {"message": "placeholder"}


@router.get("/themes")
async def themes():
    return {
        "themes": [
            "classic",
            "engineeringresumes",
            "sb2nov",
            "moderncv",
            "engineeringclassic",
        ]
    }
