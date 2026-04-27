# ---- Build Stage ----
FROM node:20-alpine AS builder

RUN apk add --no-cache git libc6-compat sqlite

# Install bun globally
RUN npm install -g bun

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./
RUN bun install

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
ENV DATABASE_URL="file:/app/data/custom.db"
RUN bun run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

RUN apk add --no-cache sqlite

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/data/custom.db"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built standalone assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy Prisma schema (needed for db push at runtime)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Create data directory for SQLite
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
