# Build stage
FROM node:22-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Copy source and build
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Script to wait for DB and migrate (simplified in CMD here)
CMD npx prisma migrate deploy && npm run start