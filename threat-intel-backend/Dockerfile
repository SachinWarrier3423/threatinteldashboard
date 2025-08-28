# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci --omit=dev

# App code
COPY . .

ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
