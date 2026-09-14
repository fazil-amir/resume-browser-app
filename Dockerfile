# Build the React client.
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Run the production Express server.
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4040
ENV RESUME_ROOT=/app/resumes

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && mkdir -p /app/resumes /app/data
COPY --from=builder /app/dist ./dist
COPY src ./src

EXPOSE 4040
CMD ["npm", "start"]
