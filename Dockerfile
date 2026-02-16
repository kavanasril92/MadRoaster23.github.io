FROM python:3.11-slim

WORKDIR /app

# Install CA certificates and OpenSSL
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && update-ca-certificates

COPY backend/requirements.txt .

# Install requirements and explicitly update certifi (Python's CA bundle)
RUN pip install --no-cache-dir --upgrade pip certifi && \
    pip install --no-cache-dir -r requirements.txt

COPY backend /app
COPY frontend /app/frontend

ENV PYTHONUNBUFFERED=1
# Ensure Python uses system certificates
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

CMD ["sh", "-c", "PORT=$PORT && export BUILD_ID=$(date +%s) && uvicorn app:app --host 0.0.0.0 --port $PORT --proxy-headers"]
