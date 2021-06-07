# Cumulonimbus

## Project setup

```sh
npm install
```

## Requirements

- Latest Version of PostgreSQL
- Node.JS v14.13.1 or later
- A machine to host on
- Nginx
- Write access to /etc/nginx/
- Write access to /var/

## .env File Configuration

The .env file stores the spooky scary sensitive data that you don't want people to see. The layout for the .env file is shown below

```env
SERVERIP={{database server ip}}
SERVERUSERNAME={{database username}}
SERVERPASSWORD={{database user password}}
SERVERDB={{the database to store the data in}}
```

## Debugging

Run the project in your debugger of choice, or start node with an inspection port open.

## Quick Start Guide

1. Clone this repository.
2. Run `npm install` and allow npm to install all packages.
3. Run `npm run build` and allow vue to build and compile the project to the `dist/` folder.
4. Run setup.sh in the root directory of the project to install and symlink everything in one command.
5. Setup database, create user and database specifically for cumulonimbus.
6. Start preview and API servers using `pm2 . --name api -i 2` and `pm2 ./thumbnailServer.js --name thumbnail -i 6`

## Online Demonstration

There is a already a fully working version of this service running [here at alekeagle.me](https://alekeagle.me) if you want to check it out.
