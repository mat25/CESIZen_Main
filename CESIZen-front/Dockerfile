
# --- Build stage ---
FROM node:18-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# --- Runtime stage: Nginx ---
FROM nginx:1.27-alpine
# Copy Nginx conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy built assets from Vite/Vue (dist folder)
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz || exit 1
