from __future__ import annotations

import glob
import re
import subprocess
import tempfile
from pathlib import Path
from typing import Any

import yaml
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.models.resume import ResumeData

router = APIRouter()

AVAILABLE_THEMES = [
    "classic",
    "ember",
    "engineeringclassic",
    "engineeringresumes",
    "harvard",
    "ink",
    "moderncv",
    "opal",
    "sb2nov",
]


def _clean_dict(obj: Any) -> Any:
    """Recursively remove None values and empty lists/dicts from a nested dict,
    so that the YAML output is clean for RenderCV."""
    if isinstance(obj, dict):
        cleaned = {}
        for k, v in obj.items():
            v = _clean_dict(v)
            if v is None:
                continue
            if isinstance(v, (list, dict)) and len(v) == 0:
                continue
            cleaned[k] = v
        return cleaned
    if isinstance(obj, list):
        cleaned_list = [_clean_dict(item) for item in obj]
        # Remove None items from lists but keep empty strings
        return [item for item in cleaned_list if item is not None]
    return obj


def _parse_validation_errors(output: str) -> list[dict[str, str]]:
    """Parse RenderCV's rich-table validation output into structured errors.

    Each row in the table has: Location | Input Value | Explanation
    """
    errors: list[dict[str, str]] = []
    # Match rows between ├─ and ─┤ or │ and │ separators.
    # The table uses box-drawing characters. Each data row looks like:
    # │ │ cv.phone                     │ +1 (555) 123-4567 │ This is not a valid   │ │
    row_pattern = re.compile(
        r"│\s+│\s+(?P<location>\S+)\s+│\s+(?P<value>.+?)\s+│\s+(?P<explanation>.+?)\s+│\s+│"
    )
    # RenderCV wraps long explanations across multiple lines. The continuation
    # lines have an empty location cell.
    continuation_pattern = re.compile(
        r"│\s+│\s+│\s+│\s+(?P<explanation>.+?)\s+│\s+│"
    )

    for line in output.splitlines():
        m = row_pattern.match(line)
        if m:
            loc = m.group("location").strip()
            # Skip the table header row
            if loc == "Location":
                continue
            errors.append({
                "location": loc,
                "message": m.group("explanation").strip(),
            })
            continue
        # Continuation of a multi-line explanation
        c = continuation_pattern.match(line)
        if c and errors:
            errors[-1]["message"] += " " + c.group("explanation").strip()

    return errors


def resume_to_yaml(data: ResumeData) -> str:
    """Convert a ResumeData model to a YAML string suitable for RenderCV."""
    raw = data.model_dump(exclude_none=True, by_alias=True, mode="json")
    cleaned = _clean_dict(raw)
    return yaml.dump(cleaned, default_flow_style=False, sort_keys=False, allow_unicode=True)


@router.post("/generate")
async def generate(data: ResumeData):
    """Generate a PDF resume using RenderCV from the provided resume data."""
    tmp_dir = None
    try:
        tmp_dir = tempfile.TemporaryDirectory()
        tmp_path = Path(tmp_dir.name)

        # Write YAML input file
        yaml_content = resume_to_yaml(data)
        input_file = tmp_path / "resume.yaml"
        input_file.write_text(yaml_content, encoding="utf-8")

        # Run rendercv
        result = subprocess.run(
            ["rendercv", "render", str(input_file)],
            capture_output=True,
            text=True,
            cwd=tmp_dir.name,
            timeout=120,
        )

        if result.returncode != 0:
            validation_errors = _parse_validation_errors(result.stdout)
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "RenderCV failed to generate the PDF.",
                    "validation_errors": validation_errors,
                    "stderr": result.stderr,
                    "stdout": result.stdout,
                },
            )

        # Find the generated PDF
        pdf_files = glob.glob(str(tmp_path / "rendercv_output" / "*.pdf"))
        if not pdf_files:
            raise HTTPException(
                status_code=500,
                detail={
                    "message": "RenderCV succeeded but no PDF was found in output.",
                    "stderr": result.stderr,
                    "stdout": result.stdout,
                },
            )

        pdf_path = Path(pdf_files[0])
        pdf_bytes = pdf_path.read_bytes()

        # Build filename from the CV name if available
        filename = "resume.pdf"
        if data.cv.name:
            safe_name = data.cv.name.replace(" ", "_")
            filename = f"{safe_name}_CV.pdf"

        # We read the bytes before cleanup so we can stream them after
        # the temp directory is removed.
        def iter_pdf():
            yield pdf_bytes

        return StreamingResponse(
            iter_pdf(),
            media_type="application/pdf",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    except HTTPException:
        raise
    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=504,
            detail={"message": "RenderCV timed out after 120 seconds."},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"message": f"Unexpected error: {str(e)}"},
        )
    finally:
        if tmp_dir is not None:
            try:
                tmp_dir.cleanup()
            except Exception:
                pass


@router.get("/themes")
async def themes():
    """Return the list of available RenderCV themes."""
    return {"themes": AVAILABLE_THEMES}
