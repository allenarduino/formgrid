# ============================================
# Frontend Dockerfile (Dashboard) - pnpm
# ============================================

# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# ============================================
# Dependencies Stage
# ============================================
FROM base AS dependencies

# Copy workspace root files for pnpm workspace support
# pnpm workspaces require the root package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy the dashboard package.json
COPY apps/dashboard/package.json ./apps/dashboard/

# Install dependencies using the workspace lockfile
# --frozen-lockfile ensures reproducible builds
# --filter specifies which workspace package to install
RUN pnpm install --frozen-lockfile --filter @formgrid/dashboard

# ============================================
# Development Stage
# ============================================
FROM base AS development

# Copy installed dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps/dashboard/node_modules ./apps/dashboard/node_modules

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/dashboard/package.json ./apps/dashboard/

# Copy all dashboard source code
COPY apps/dashboard ./apps/dashboard

# Set working directory to dashboard
WORKDIR /app/apps/dashboard

# Expose Vite development server port
EXPOSE 5173

# Start development server with host binding
# --host allows access from outside the container
CMD ["pnpm", "run", "dev", "--", "--host"]

# ============================================
# Production Build Stage (Optional)
# ============================================
# FROM base AS builder
# 
# # Copy dependencies from dependencies stage
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY --from=dependencies /app/apps/dashboard/node_modules ./apps/dashboard/node_modules
# 
# # Copy source files
# COPY apps/dashboard ./apps/dashboard
# 
# # Build the application
# WORKDIR /app/apps/dashboard
# RUN pnpm run build
# 
# # ============================================
# # Production Stage (Optional)
# # ============================================
# FROM nginx:alpine AS production
# 
# # Copy built files from builder stage
# COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
# 
# # Copy nginx configuration (if you have one)
# # COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf
# 
# # Expose port 80
# EXPOSE 80
# 
# # Start nginx
# CMD ["nginx", "-g", "daemon off;"]
