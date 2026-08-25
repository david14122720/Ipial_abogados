# syntax=docker/dockerfile:1

# --- Stage 1: build Astro static site ---
FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm via corepack (pnpm 11.23 pinned in packageManager field if present)
RUN corepack enable

# Install deps first for better layer caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack prepare pnpm@11.23.0 --activate && pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# --- Stage 2: serve with nginx ---
FROM nginx:alpine AS runtime
LABEL maintainer="Ipial Abogados" \
      description="Static Astro build served via nginx"

# Harden base: upgrade packages to pick up security patches
RUN apk upgrade --no-cache

# Copy built site
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config (replaces default server)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx welcome page remnants if any and ensure correct perms
RUN chmod -R 755 /usr/share/nginx/html && \
    rm -f /etc/nginx/conf.d/default.conf.bak

EXPOSE 80

# Healthcheck for Dokploy / orchestrator liveness (127.0.0.1 avoids ::1 resolution issues)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
