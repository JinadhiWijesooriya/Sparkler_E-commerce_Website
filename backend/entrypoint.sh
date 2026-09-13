#!/bin/sh
set -e

echo "Waiting for PostgreSQL to become available..."

python << 'EOF'
import socket
import time
import os

host = os.environ.get("DB_HOST", "db")
port = int(os.environ.get("DB_PORT", 5432))

while True:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(2)
        s.connect((host, port))
        s.close()
        break
    except Exception:
        time.sleep(1)
EOF

echo "PostgreSQL is up and running!"

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear || true

exec "$@"
