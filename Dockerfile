FROM python:3.11-slim

WORKDIR /app

# Install CA certificates and update them
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app
COPY frontend /app/frontend

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "PORT=$PORT && export BUILD_ID=$(date +%s) && uvicorn app:app --host 0.0.0.0 --port $PORT --proxy-headers"]