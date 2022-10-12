# syntax=docker/dockerfile:experimental

# use wordpress image as the base image
FROM wordpress

# install unzip for composer
RUN apt-get update && apt-get install apt-utils zip unzip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# copy all the files in this folder to plugins directory
COPY . /var/www/html/wp-content/plugins/termination-of-transfer

# cd to plugin directory AND install plugin dependencies
RUN cd /var/www/html/wp-content/plugins/termination-of-transfer && composer install
