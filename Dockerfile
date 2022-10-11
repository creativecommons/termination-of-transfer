# syntax=docker/dockerfile:experimental

FROM wordpress:php7.4-fpm-alpine

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . /var/www/html/wp-content/plugins/termination-of-transfer

RUN composer install
