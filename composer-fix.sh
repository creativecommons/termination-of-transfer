if [ -d /var/www/html/wp-content/plugins/termination-of-transfer ]; then
  
   # change directory
   cd /var/www/html/wp-content/plugins/termination-of-transfer

   # ensure dependencies are installed
   composer update

fi