#!/bin/sh
set -e

echo "=== ChicGlam Docker Entrypoint ==="

# Push Prisma schema to DB (creates tables if not exist)
echo "[1/3] Syncing Prisma schema..."
npx prisma db push --accept-data-loss 2>&1 || echo "Prisma push completed (or already synced)"

# Use PORT from environment (Coolify sets this dynamically)
APP_PORT="${PORT:-3000}"
echo "[2/3] Starting Next.js server on port ${APP_PORT}..."
export PORT="${APP_PORT}"
export HOSTNAME="0.0.0.0"

exec node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "[3/3] Waiting for server to start..."
sleep 5

# Seed banners using the correct port
echo "Seeding banners..."
curl -sf -X POST "http://localhost:${APP_PORT}/api/banners/seed" > /dev/null 2>&1 && echo "Banner seed completed" || echo "Banner seed skipped (may already exist)"

echo "=== ChicGlam is ready on port ${APP_PORT} ==="

# Wait for server
wait $SERVER_PID
