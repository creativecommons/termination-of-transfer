# syntax=docker/dockerfile:experimental

FROM wordpress:php7.4-fpm-alpine

WORKDIR /app

RUN apk update && apk add curl

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /var/www/html/wp-content/plugins/termination-of-transfer

RUN cd /var/www/html/wp-content/plugins/termination-of-transfer && composer install
