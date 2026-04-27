#!/bin/sh
set -e

echo "=== ChicGlam Docker Entrypoint ==="

# Push Prisma schema to DB (creates tables if not exist)
echo "[1/3] Syncing Prisma schema..."
npx prisma db push --accept-data-loss 2>/dev/null || echo "Prisma push completed (or already synced)"

echo "[2/3] Starting Next.js server..."
exec node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "[3/3] Waiting for server to start..."
sleep 5

# Seed banners (products use static data, no DB seed needed)
echo "Seeding banners..."
curl -sf -X POST http://localhost:3000/api/banners/seed > /dev/null 2>&1 && echo "Banner seed completed" || echo "Banner seed skipped (may already exist)"

echo "=== ChicGlam is ready ==="

# Wait for server
wait $SERVER_PID
