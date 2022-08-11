openssl req -x509 -newkey rsa:4096 -keyout hollyfilms.key -out hollyfilms.crt -sha256 -days 365 -subj "/C=FR/L=Paris/O=HollyFilms/OU=HollyFilms/CN=www.hollyfilms.fr"
