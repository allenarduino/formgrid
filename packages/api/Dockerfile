# ============================================
# Backend Dockerfile (API) - pnpm
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

# Copy the API package.json
COPY packages/api/package.json ./packages/api/

# Install dependencies using the workspace lockfile
# --frozen-lockfile ensures reproducible builds
# --filter specifies which workspace package to install
RUN pnpm install --frozen-lockfile --filter @formgrid/api

# ============================================
# Development Stage
# ============================================
FROM base AS development

# Copy installed dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/packages/api/node_modules ./packages/api/node_modules

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/api/package.json ./packages/api/

# Copy all API source code including Prisma schema
COPY packages/api ./packages/api

# Set working directory to API
WORKDIR /app/packages/api

# Generate Prisma Client based on schema.prisma
# This creates the type-safe Prisma Client for database operations
RUN npx prisma generate

# Expose backend API port
EXPOSE 4000

# Start development server with hot reload (ts-node-dev)
CMD ["pnpm", "run", "dev"]

# ============================================
# Production Builder Stage (Optional)
# ============================================
# FROM base AS builder
# 
# # Copy dependencies from dependencies stage
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY --from=dependencies /app/packages/api/node_modules ./packages/api/node_modules
# 
# # Copy source files
# COPY packages/api ./packages/api
# 
# WORKDIR /app/packages/api
# 
# # Generate Prisma Client
# RUN npx prisma generate
# 
# # Build TypeScript to JavaScript
# RUN pnpm run build
# 
# # ============================================
# # Production Stage (Optional)
# # ============================================
# FROM node:20-alpine AS production
# 
# # Install pnpm
# RUN npm install -g pnpm
# 
# WORKDIR /app/packages/api
# 
# # Copy package files
# COPY packages/api/package.json ./
# 
# # Install only production dependencies
# RUN pnpm install --prod --frozen-lockfile
# 
# # Copy built application from builder
# COPY --from=builder /app/packages/api/dist ./dist
# COPY --from=builder /app/packages/api/prisma ./prisma
# 
# # Generate Prisma Client in production
# RUN npx prisma generate
# 
# # Set environment to production
# ENV NODE_ENV=production
# 
# # Expose port
# EXPOSE 4000
# 
# # Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
#   CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
# 
# # Start production server
# CMD ["pnpm", "run", "start"]
