FROM node:20-alpine AS admin-build

WORKDIR /app/admin

COPY admin/package*.json ./
RUN npm install

COPY admin ./
RUN npm run build

FROM node:20-alpine AS backend-runtime

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/src ./src
COPY backend/database ./database
COPY --from=admin-build /app/admin/build ../admin/build
COPY admin/src/scripts ../admin/src/scripts

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "src/server.js"]
