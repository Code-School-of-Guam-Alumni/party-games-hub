# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api/v1
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM caddy:2.10-alpine

COPY --chown=1000:1000 Caddyfile /etc/caddy/Caddyfile
COPY --chown=1000:1000 --from=build /app/dist /srv

RUN caddy fmt --overwrite /etc/caddy/Caddyfile && \
    caddy validate --config /etc/caddy/Caddyfile

USER 1000:1000

EXPOSE 8080
