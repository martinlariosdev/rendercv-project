# RenderCV Resume Builder

A web-based resume builder powered by [RenderCV](https://github.com/rendercv/rendercv). Build, preview, and download professional PDF resumes directly in your browser.

## Architecture

```
+-----------------------------------+         +------------------------------------+
|   Next.js (App Router + TS)       |  HTTP   |   FastAPI (Python 3.12)            |
|   Deployed on Vercel              | ------> |   Deployed on Railway (Docker)     |
|                                   |         |                                    |
|  - Form UI (resume editor)        |         |  - POST /generate                  |
|  - YAML preview panel             |         |  - Runs: rendercv render           |
|  - PDF preview (react-pdf)        | <------ |  - Returns: PDF binary             |
|  - Download button                |   PDF   |                                    |
+-----------------------------------+         +------------------------------------+
```

**Stack:**
- **Frontend:** Next.js 16 + TypeScript + Tailwind CSS v4 (Vercel)
- **Backend:** FastAPI + RenderCV + Typst (Railway, Docker)
- **PDF viewer:** react-pdf (PDF.js wrapper)
- **State:** Zustand with sessionStorage persistence
- **No auth, no database** -- session only

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.12+
- Docker (optional, for running the backend in a container)

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

### Backend

#### Option A: Docker (recommended)

```bash
cd backend
docker build -t rendercv-api .
docker run -p 8000:8000 -e ALLOWED_ORIGINS=http://localhost:3000 rendercv-api
```

#### Option B: Local Python

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> Note: RenderCV requires Typst to be installed. Install it from [typst.app](https://github.com/typst/typst/releases).

The API runs at `http://localhost:8000`. Check health: `http://localhost:8000/health`.

### Running Backend Tests

```bash
cd backend
pip install -r requirements.txt
pytest                        # unit tests only
pytest -m integration         # integration tests (requires rendercv + typst)
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/generate` | Accepts resume JSON, returns PDF binary |
| GET | `/themes` | Returns list of available RenderCV themes |
| GET | `/health` | Health check with RenderCV version |

## Available Themes

All themes use Typst (no LaTeX required):

| Theme | Description |
|-------|-------------|
| `classic` | Clean, traditional layout (default) |
| `ember` | Modern, warm design |
| `engineeringclassic` | Engineering-focused classic |
| `engineeringresumes` | Optimized for engineering roles |
| `harvard` | Harvard-style resume |
| `ink` | Minimal ink design |
| `moderncv` | ModernCV-inspired |
| `opal` | Elegant opal theme |
| `sb2nov` | Popular SB2Nov style |

## Deployment

### Deploy Frontend to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL (e.g., `https://your-app.up.railway.app`)
4. Click **Deploy**

### Deploy Backend to Railway

1. Go to [railway.com/new](https://railway.com/new) and connect the GitHub repo
2. Set **Root Directory** to `backend`
3. Railway will auto-detect the Dockerfile
4. Add environment variable:
   - `ALLOWED_ORIGINS` = your Vercel production URL (e.g., `https://your-app.vercel.app`)
5. Click **Deploy**
6. After deployment, verify the health endpoint: `https://your-app.up.railway.app/health`

### Post-Deployment Checklist

- [ ] Backend `/health` endpoint returns `{"status": "ok"}`
- [ ] Frontend can reach the backend (no CORS errors in browser console)
- [ ] Generate Preview produces a PDF
- [ ] Download PDF works correctly

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |

## License

MIT -- see [LICENSE](./LICENSE).
