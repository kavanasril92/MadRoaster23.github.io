FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app
COPY frontend /app/frontend

ENV PYTHONUNBUFFERED=1

CMD ["sh", "-c", "export BUILD_ID=$(date +%s) && uvicorn app:app --host 0.0.0.0 --port", "8000"]
