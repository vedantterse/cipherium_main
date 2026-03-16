# ─── Stage 1: Install dependencies ─────────────────────────────────
FROM oven/bun:1.1 AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
RUN bun install

# ─── Stage 2: Build application ────────────────────────────────────
FROM oven/bun:1.1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# ─── Stage 3: Production image ─────────────────────────────────────
FROM oven/bun:1.1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Create directories for persistent data
RUN mkdir -p /app/data /app/uploads/audio /app/uploads/images && \
    chown -R nextjs:nodejs /app/data /app/uploads

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
