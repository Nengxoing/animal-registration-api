# ---- Build Stage ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build tools for native dependencies
RUN apk add --no-cache python3 make g++ build-base

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code and configuration files
COPY . .

# Generate Prisma client and build the application
RUN npx prisma generate
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Install necessary build tools for native dependencies
RUN apk add --no-cache python3 make g++ build-base

# Copy necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/prisma ./prisma
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Copy environment files
COPY .env .env

# Copy additional scripts or assets needed for production
COPY src/swaggers ./swaggers

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Expose application port
EXPOSE 8000

# Rebuild native modules for the production environment
RUN npm rebuild bcrypt --update-binary

# Start the application using PM2
CMD ["pm2-runtime", "dist/index.js"]
