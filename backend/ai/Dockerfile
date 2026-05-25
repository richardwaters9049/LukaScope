# AI Training Dockerfile for LukaScope
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy AI training files
COPY hooks/ ./hooks/
COPY functions/ ./functions/
COPY tests/ ./tests/
COPY pytest.ini ./

# Test stage
RUN pytest tests/ -v --cov=. --cov-report=term-missing --cov-report=html

# Create non-root user for security
RUN useradd -m -u 1001 aiuser && \
    chown -R aiuser:aiuser /app

USER aiuser

# Default command - can be overridden
CMD ["python", "functions/train_model.py"]
