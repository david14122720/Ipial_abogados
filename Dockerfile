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

# Copy built site
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
