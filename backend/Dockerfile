FROM python:3.11-slim AS base

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/ai ./ai
COPY backend/pytest.ini ./pytest.ini
COPY backend/tests ./tests

FROM base AS dev
EXPOSE 3001
CMD ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "3001"]

FROM base AS test
ENV NODE_ENV=test
ENV RUN_JOBS_INLINE=true
CMD ["pytest"]

FROM base AS runner
RUN useradd -m -u 1001 backend && mkdir -p /app/data && chown -R backend:backend /app
USER backend
EXPOSE 3001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "3001"]
