'use strict';

import './env.mjs';

import logger from './logger.mjs';
logger('INFO');

import { User } from './db.mjs';

import { readdir } from 'fs/promises';
import express, { json, urlencoded } from 'express';
import rL from 'express-rate-limit';
import ms from 'ms';
import compression, { filter as _filter } from 'compression';
import UAParser from 'ua-parser-js';
const instance = process.env.NODE_APP_INSTANCE || 0;
const port = parseInt(`800${instance}`);
const app = express();
import Token from './Token.mjs';

Array.prototype.equals = function(array) {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });

const shouldCompress = (req, res) => {
  // don't compress responses asking explicitly not
  if (req.headers['x-no-compression']) {
    return false;
  }

  // use compression filter function
  return _filter(req, res);
};

app.use(async (req, res, next) => {
  req.ua = new UAParser(req.headers['user-agent']).getResult();
  next();
});

app.use(json());
//enable compression
app.use(compression({ filter: shouldCompress }));
//enable automatic urlencoded parsing of request body
app.use(urlencoded({ extended: true }));

async function auth(req) {
  if (!req.headers.authorization) throw null;
  let tokenData = new Token(req.headers.authorization);
  let usr = await User.findOne({
    where: {
      id: tokenData.id
    }
  });
  if (!usr) throw null;
  if (usr.bannedAt !== null) throw null;
  if (
    !usr.sessions ||
    !usr.sessions.some(
      session =>
        tokenData.bytes.toJSON().data.equals(session.token.bytes.data) &&
        tokenData.time === session.token.time &&
        tokenData.id === session.token.id
    )
  )
    throw null;
  return usr;
}
//use auth function and append user to Request Object
app.use(async (req, res, next) => {
  let user,
    errored = false,
    error;
  try {
    user = await auth(req);
  } catch (err) {
    if (err) {
      errored = true;
      error = err;
    }
    user = null;
  }
  req.user = user;
  if (errored) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error(error);
  } else {
    next();
  }
});
//Enable default ratelimits
app.use(
  '/api/',
  rL({
    windowMs: ms('5mins'),
    max: 100,
    keyGenerator: (req, res) => {
      return req.user ? req.user.id : req.headers['x-forwarded-for'] || req.ip;
    }
  })
);

app.all('/api/', (req, res) => {
  res.status(200).json({
    hello: 'world',
    version: '2.0.0'
  });
});

(async function() {
  let endpoints = await readdir('./api/');
  endpoints.forEach(async file => {
    endpoints = (await import(`./api/${file}`)).default;
    console.info(`Loading endpoints from ${file}`);
    endpoints.forEach(endpoint => {
      console.info(
        `Loading endpoint ${endpoint.method.toUpperCase()} ${endpoint.path}`
      );
      app[endpoint.method](
        endpoint.path,
        ...endpoint.preHandlers,
        async (req, res) => {
          try {
            await endpoint.handler(req, res);
          } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            console.error(error);
          }
        }
      );
    });
  });
})();
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
