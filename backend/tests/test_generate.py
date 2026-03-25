from __future__ import annotations

import yaml
import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app
from app.models.resume import ResumeData, CvData
from app.routes.generate import resume_to_yaml


# --- Fixtures ---

@pytest.fixture
def minimal_resume_data() -> dict:
    """Minimal valid resume payload."""
    return {
        "cv": {
            "name": "John Doe",
            "sections": {
                "welcome to my resume": [
                    "This is a text entry.",
                ],
            },
        },
    }


@pytest.fixture
def full_resume_data() -> dict:
    """A more complete resume payload for testing YAML serialization."""
    return {
        "cv": {
            "name": "Jane Smith",
            "headline": "Software Engineer",
            "location": "San Francisco, CA",
            "email": "jane@example.com",
            "phone": "+1-555-0100",
            "website": "https://janesmith.dev",
            "social_networks": [
                {"network": "GitHub", "username": "janesmith"},
                {"network": "LinkedIn", "username": "janesmith"},
            ],
            "sections": {
                "education": [
                    {
                        "institution": "MIT",
                        "area": "Computer Science",
                        "degree": "BS",
                        "start_date": "2016-09",
                        "end_date": "2020-05",
                        "highlights": [
                            "GPA: 3.9/4.0",
                        ],
                    },
                ],
                "experience": [
                    {
                        "company": "Acme Corp",
                        "position": "Senior Engineer",
                        "start_date": "2020-06",
                        "end_date": "present",
                        "location": "San Francisco, CA",
                        "highlights": [
                            "Led a team of 5 engineers.",
                            "Built a microservices platform.",
                        ],
                    },
                ],
                "skills": [
                    {"label": "Languages", "details": "Python, Go, TypeScript"},
                    {"label": "Tools", "details": "Docker, Kubernetes, Terraform"},
                ],
            },
        },
        "design": {
            "theme": "classic",
        },
    }


# --- YAML Serialization Tests ---

def test_yaml_serialization_minimal(minimal_resume_data: dict):
    """YAML serialization from a minimal ResumeData produces valid YAML."""
    data = ResumeData(**minimal_resume_data)
    yaml_str = resume_to_yaml(data)

    # Should be parseable YAML
    parsed = yaml.safe_load(yaml_str)
    assert isinstance(parsed, dict)
    assert "cv" in parsed
    assert parsed["cv"]["name"] == "John Doe"


def test_yaml_serialization_omits_none(full_resume_data: dict):
    """YAML serialization omits None values and empty collections."""
    data = ResumeData(**full_resume_data)
    yaml_str = resume_to_yaml(data)

    # None values should not appear
    assert "null" not in yaml_str.lower()
    # Parse and verify structure
    parsed = yaml.safe_load(yaml_str)
    assert parsed["cv"]["name"] == "Jane Smith"
    assert len(parsed["cv"]["social_networks"]) == 2
    assert "education" in parsed["cv"]["sections"]
    assert "experience" in parsed["cv"]["sections"]


def test_yaml_serialization_full_roundtrip(full_resume_data: dict):
    """Verify key data survives the model -> YAML roundtrip."""
    data = ResumeData(**full_resume_data)
    yaml_str = resume_to_yaml(data)
    parsed = yaml.safe_load(yaml_str)

    edu = parsed["cv"]["sections"]["education"][0]
    assert edu["institution"] == "MIT"
    assert edu["area"] == "Computer Science"

    exp = parsed["cv"]["sections"]["experience"][0]
    assert exp["company"] == "Acme Corp"
    assert len(exp["highlights"]) == 2

    assert parsed["design"]["theme"] == "classic"


# --- API Tests ---

@pytest.fixture
def async_client():
    transport = ASGITransport(app=app)
    return AsyncClient(transport=transport, base_url="http://test")


@pytest.mark.asyncio
async def test_health_endpoint(async_client: AsyncClient):
    async with async_client as client:
        resp = await client.get("/health")
    assert resp.status_code == 200
    body = resp.json()
    assert body["status"] == "ok"
    assert "rendercv_version" in body


@pytest.mark.asyncio
async def test_themes_endpoint(async_client: AsyncClient):
    async with async_client as client:
        resp = await client.get("/themes")
    assert resp.status_code == 200
    body = resp.json()
    themes = body["themes"]
    assert isinstance(themes, list)
    assert "classic" in themes
    assert "sb2nov" in themes
    assert "moderncv" in themes
    assert "engineeringresumes" in themes
    assert len(themes) >= 9


@pytest.mark.asyncio
@pytest.mark.integration
async def test_generate_pdf_minimal(async_client: AsyncClient, minimal_resume_data: dict):
    """Integration test: actually calls rendercv to produce a PDF.
    Mark with @pytest.mark.integration so it can be skipped in CI without rendercv installed.
    Run with: pytest -m integration
    """
    async with async_client as client:
        resp = await client.post("/generate", json=minimal_resume_data, timeout=120.0)
    assert resp.status_code == 200
    assert resp.headers["content-type"] == "application/pdf"
    # PDF magic bytes
    assert resp.content[:5] == b"%PDF-"


@pytest.mark.asyncio
@pytest.mark.integration
async def test_generate_pdf_full(async_client: AsyncClient, full_resume_data: dict):
    """Integration test with a more complete resume."""
    async with async_client as client:
        resp = await client.post("/generate", json=full_resume_data, timeout=120.0)
    assert resp.status_code == 200
    assert resp.content[:5] == b"%PDF-"


@pytest.mark.asyncio
async def test_generate_invalid_payload(async_client: AsyncClient):
    """Sending an invalid payload should return a 422."""
    async with async_client as client:
        resp = await client.post("/generate", json={"bad": "data"})
    assert resp.status_code == 422
