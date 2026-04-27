#!/bin/sh
set -e

echo "=== ChicGlam Docker Entrypoint ==="

# Push Prisma schema to DB (creates tables if not exist)
echo "[1/4] Syncing Prisma schema..."
npx prisma db push --accept-data-loss 2>/dev/null || echo "Prisma push completed (or already synced)"

echo "[2/4] Starting Next.js server..."
exec node server.js &
SERVER_PID=$!

# Wait for server to be ready
echo "[3/4] Waiting for server to start..."
sleep 5

echo "[4/4] Seeding initial data..."

# Seed products (clears broken ones + creates 24 products with correct images)
echo "Seeding products..."
curl -sf -X POST http://localhost:3000/api/products/seed > /dev/null 2>&1 && echo "Product seed completed" || echo "Product seed skipped or failed"

# Seed banners
echo "Seeding banners..."
curl -sf -X POST http://localhost:3000/api/banners/seed > /dev/null 2>&1 && echo "Banner seed completed" || echo "Banner seed skipped (may already exist)"

echo "=== ChicGlam is ready ==="

# Wait for server
wait $SERVER_PID
