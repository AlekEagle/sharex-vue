# AlekEagle ShareX Server

## Project setup

```
npm install
```

## Requirements

-   Latest Version of PostgreSQL
-   Node.JS v14.13.1
-   A machine to host on

## .env File Configuration

The .env file stores the spooky scary sensitive data that you don't want people to see. The layout for the .env file is shown below

```
SERVERIP={{database server ip}}
SERVERUSERNAME={{database username}}
SERVERPASSWORD={{database user password}}
SERVERDB={{the database to store the data in}}
```

## Debugging

If you want to debug the server, you can add `DEBUG=true` to the .env, or set the environment variable `DEBUG` to true.

## Quick Start Guide

1. Clone this repository.
2. Run `npm install` and allow npm to install all packages.
3. Run `npm run build` and allow vue to build and compile the project to the `dist/` folder.
4. You can run `npm run serve-with-api` or run `node . 443`, keep in mind that both need permission to bind to ports below 1024, which usually means root/administrator permissions.

## Online Demonstration

There is a already a fully working version of this service running [here at alekeagle.me](https://alekeagle.me) if you want to check it out.
