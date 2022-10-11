# syntax=docker/dockerfile:experimental

FROM nginx:alpine

ENV NODE_ENV=production
ENV PORT=3003

WORKDIR /app

COPY ["composer.json", "composer.lock", "./"]

RUN composer install

COPY . .
