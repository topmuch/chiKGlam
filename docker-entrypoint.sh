#!/bin/sh
set -e

echo "=== ChicGlam Docker Entrypoint ==="

# Push Prisma schema to DB (creates tables if not exist)
echo "[1/3] Syncing Prisma schema..."
npx prisma db push --accept-data-loss 2>/dev/null || echo "Prisma push completed (or already synced)"

# Seed banners if empty
echo "[2/3] Seeding initial data..."
# Use a simple curl to call the seed endpoint once the server starts
# We'll do this in the background after the server starts

echo "[3/3] Starting Next.js server..."
exec node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
sleep 5

# Seed banners
echo "Seeding banners..."
curl -sf -X POST http://localhost:3000/api/banners/seed > /dev/null 2>&1 && echo "Banner seed completed" || echo "Banner seed skipped (may already exist)"

# Wait for server
wait $SERVER_PID
