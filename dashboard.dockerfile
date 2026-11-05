# Stage 1: Build environment
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Serve environment using Nginx
FROM nginx:alpine AS runner

# Copy built static files from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]