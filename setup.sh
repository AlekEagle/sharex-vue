#!/bin/bash
#This bash script is an automatic setup script that will automatically configure your server for Cumulonimbus.

if [[ $EUID > 0 ]]
  then echo "Sorry! This script needs to be ran as root in order to fully setup Cumulonimbus!"
  exit
fi

#Check for nginx
echo "Checking for nginx..."
dpkg -s nginx &> /dev/null
if [[ $? != 0 ]]; then 
  echo "nginx is not installed, installing it now..."
  apt install nginx -y &> /dev/null
fi

echo "nginx installed."

echo "Checking for postgresql..."
dpkg -s postgresql &> /dev/null
if [[ $? != 0 ]]; then
  echo "postgresql is not installed, adding repository, repository key, and installing..."
  sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' &> /dev/null
  echo "Repository added, now adding repository key..."
  wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - &> /dev/null
  echo "Key added, proceeding to install postgresql..."
  apt update &> /dev/null
  apt install postgresql -y &> /dev/null
fi

echo "postgresql installed."

echo "Checking for pm2..."
which pm2
if [[ $? != 0 ]]; then
  echo "pm2 is not installed, installing..."
  npm i -g pm2 &> /npm/null
fi

echo "pm2 installed."

echo "Removing default site from nginx and symlinking cumulonimbus.conf to /etc/nginx/sites-enabled/"
rm /etc/nginx/sites-enabled/default &> /dev/null
rm /etc/nginx/sites-enabled/cumulonimbus.conf &> /dev/null
ln -s $(pwd)/nginx.conf /etc/nginx/sites-enabled/cumulonimbus.conf &> /dev/null

echo "Added, now adding symlink for data for cumulonimbus website data."
rm /var/www-data &> /dev/null
ln -s $(pwd) /var/www-data &> /dev/null

echo "Finally, reloading nginx..."
nginx -s reload

echo "Done! All you have to do is run 'npm run build', setup the database, and you're ready to host!"