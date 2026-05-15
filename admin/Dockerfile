FROM node:20-alpine AS build

WORKDIR /app

COPY admin/package*.json ./
RUN npm install

COPY admin ./
RUN npm run build

FROM nginx:1.27-alpine

COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000
