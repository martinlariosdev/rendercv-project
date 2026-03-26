FROM python:3.12-slim

WORKDIR /app

# Install system dependencies for Typst
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Typst binary (detect architecture)
RUN ARCH=$(dpkg --print-architecture) && \
    if [ "$ARCH" = "arm64" ]; then \
      TYPST_ARCH="aarch64-unknown-linux-musl"; \
    else \
      TYPST_ARCH="x86_64-unknown-linux-musl"; \
    fi && \
    curl -fsSL "https://github.com/typst/typst/releases/latest/download/typst-${TYPST_ARCH}.tar.xz" \
    | tar -xJ --strip-components=1 -C /usr/local/bin/ && \
    typst --version

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

EXPOSE 8000

# Railway sets PORT env var; fall back to 8000 for local dev
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
