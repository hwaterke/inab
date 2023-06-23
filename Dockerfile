FROM node:18 as build
WORKDIR /app
# Install backend node_modules
COPY backend-nestjs/package*.json ./backend-nestjs/
RUN cd backend-nestjs && npm ci
# Install frontend node_modules
COPY web-vite/package*.json ./web-vite/
RUN cd web-vite && npm ci
# Build backend
COPY backend-nestjs ./backend-nestjs
RUN cd backend-nestjs && npm run build
# Generate backend GQL schema
RUN cd backend-nestjs && node dist/schema-app.js
# Build frontend
COPY web-vite ./web-vite
RUN cd web-vite && ls src
RUN cd web-vite && npm run codegen
RUN cd web-vite && ls src
RUN cd web-vite && npm run build

FROM node:18 as prod-deps-server
WORKDIR /app
COPY backend-nestjs/package*.json ./
ENV NODE_ENV=production
RUN npm ci

FROM node:18
ARG server_version
WORKDIR /app
COPY --from=prod-deps-server /app/node_modules ./node_modules
COPY --from=build /app/backend-nestjs/dist ./dist
COPY --from=build /app/web-vite/dist ./static
ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/inab.sqlite
ENV VERSION=$server_version
EXPOSE 3000
CMD ["node", "dist/main.js"]
