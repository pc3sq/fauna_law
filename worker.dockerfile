# ==========================================
# Stage 1: Build & Dependency Isolation
# ==========================================
FROM python:3.11-slim AS builder

WORKDIR /app

# Install system dependencies needed to compile certain Python wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Create isolated virtual environment
RUN python -m venv /opt/venv

# CRITICAL FIX: Upgrade pip inside the venv and force-install requirements 
# using the exact absolute path to the virtual environment's pip binary.
RUN /opt/venv/bin/pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN /opt/venv/bin/pip install --no-cache-dir -r requirements.txt


# ==========================================
# Stage 2: Final Secure Runtime Environment
# ==========================================
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install ONLY the necessary production system binaries (Tesseract OCR Engine)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire virtual environment cleanly (now containing spaCy + model)
COPY --from=builder /opt/venv /opt/venv
COPY . .

# Set environment paths to use the virtual environment transparently
ENV PATH="/opt/venv/bin:$PATH"

# Use spaCy to download English language model
RUN python -m spacy download en_core_web_sm

# SOC 2 SECURITY BEST PRACTICE: Create and switch to a non-root user.
RUN useradd -u 8888 appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

# CMD ["python", "main.py"]