'use strict';

import { User, Uploads } from '../db.mjs';
import multer from 'multer';
import Sequelize from 'sequelize';
let { Op } = Sequelize;
import { hash, genSalt, compare } from 'bcrypt';
import UAParser from 'ua-parser-js';
import { randomInt } from 'crypto';
import Token from '../Token.mjs';
const upload = multer();
import { unlink } from 'fs/promises';

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default [
  {
    method: 'get',
    path: '/api/user/',
    preHandlers: [],
    async handler(req, res) {
      if (!req.user) {
        res
          .status(401)
          .json(
            req.headers.authorization
              ? { error: 'Invalid Token' }
              : { error: 'No Token Provided' }
          );
        return;
      }
      let us = { ...req.user.toJSON() };
      delete us.password;
      delete us.sessions;
      res.status(200).json(us);
    }
  },
  {
    method: 'get',
    path: '/api/user/:id/',
    preHandlers: [],
    async handler(req, res) {
      if (!req.user) {
        res
          .status(401)
          .json(
            req.headers.authorization
              ? { error: 'Invalid Token' }
              : { error: 'No Token Provided' }
          );
        return;
      }

      if (
        !(req.user.staff === '' && req.user.id === req.params.id) &&
        req.user.staff === ''
      ) {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let usr = await User.findOne({
        where: {
          id: req.params.id
        }
      });
      if (!usr) {
        res.status(404).json({
          error: 'Not found'
        });
        return;
      }
      res.status(200).json({
        id: usr.id,
        username: usr.username,
        displayName: usr.displayName,
        email: usr.email,
        domain: usr.domain,
        subdomain: usr.subdomain,
        staff: usr.staff,
        createdAt: usr.createdAt,
        updatedAt: usr.updatedAt,
        bannedAt: usr.bannedAt
      });
    }
  },
  {
    method: 'post',
    path: '/api/user/',
    preHandlers: [upload.none()],
    async handler(req, res) {
      let { name, email, password } = req.body;
      let vars = { name, email, password };
      let undefinedVars = Object.keys(vars)
        .map(e => (vars[e] !== undefined ? null : e))
        .filter(e => e !== null);
      if (undefinedVars.length > 0) {
        res.status(400).json({ error: 'Bad Request', missing: undefinedVars });
        return;
      }

      let username = name.toLowerCase();
      let usr = await User.findOne({
        where: {
          [Op.or]: [
            {
              username
            },
            {
              email
            }
          ]
        }
      });
      if (usr) {
        let lolData = { name, email };
        let alreadyExists = Object.keys(lolData)
          .map(e =>
            usr[e === 'name' ? 'username' : e] === lolData[e] ? e : null
          )
          .filter(e => e !== null);
        res
          .status(401)
          .json({ error: 'User already exists', with: alreadyExists });
        return;
      }
      let now = new Date(),
        time = now.getTime();
      let hashedPass = await hash(password, await genSalt(randomInt(0, 15)));
      let newSession = {
        ...new UAParser(req.headers['user-agent']).getResult(),
        sessionID: Date.now().toString(),
        ip: req.headers['x-forwarded-for'] || req.ip,
        token: new Token(time.toString())
      };
      await User.create({
        id: time.toString(),
        username,
        domain: 'alekeagle.me',
        subdomain: '',
        displayName: name,
        email,
        createdAt: now,
        updatedAt: now,
        password: hashedPass,
        staff: '',
        sessions: [newSession]
      });
      res.status(201).json({
        ...newSession,
        token: newSession.token.toString()
      });
      console.log('New user created');
    }
  },
  {
    method: 'delete',
    path: '/api/user/',
    preHandlers: [upload.none()],
    async handler(req, res) {
      if (!req.user) {
        res
          .status(401)
          .json(
            req.headers.authorization
              ? { error: 'Invalid Token' }
              : { error: 'No Token Provided' }
          );
        return;
      }
      let { password } = req.body;
      if (!password) {
        res.status(400).json({ error: 'Bad Request', missing: ['password'] });
        return;
      }
      let match = await compare(password, req.user.password);
      if (!match) {
        res.status(401).json({ error: 'Invalid password.' });
        return;
      }
      let files = await Uploads.findAll({
        where: {
          userid: req.user.id
        }
      });
      if (files.length < 1) {
        await req.user.destroy();
        res.status(204).send();
        console.log('User Deleted');
      }
      files.forEach(async (file, index, self) => {
        try {
          await unlink(`uploads/${file.filename}`);
          await file.destroy();
        } catch (err) {
          console.error(err);
        }
        if (index === self.length - 1) {
          await req.user.destroy();
          res.status(204).send();
          console.log('User Deleted');
        }
      });
    }
  },

  {
    method: 'get',
    path: '/api/brew-coffee/',
    preHandlers: [],
    async handler(req, res) {
      let ran = random(10000, 30000);
      setTimeout(() => {
        res.status(418).json({
          error: "I'm a teapot.",
          body: 'The requested entity body is short and stout.',
          addInfo: 'Tip me over and pour me out.'
        });
      }, ran);
    }
  },
  {
    method: 'post',
    path: '/api/login/',
    preHandlers: [upload.none()],
    async handler(req, res) {
      let { name, password } = req.body;
      let vars = { name, password };
      let undefinedVars = Object.keys(vars)
        .map(e => (vars[e] !== undefined ? null : e))
        .filter(e => e !== null);
      if (undefinedVars.length < 0) {
        res.status(400).json({ error: 'Bad Request', missing: undefinedVars });
        return;
      } else {
        name = name.toLowerCase();
        let usr = await User.findOne({
          where: {
            [Op.or]: [
              {
                username: name
              },
              {
                email: name
              }
            ]
          }
        });
        if (usr !== null) {
          if (usr.bannedAt === null) {
            let match = await compare(password, usr.password);
            if (match) {
              console.log('User login');
              let newSession = {
                ...new UAParser(req.headers['user-agent']).getResult(),
                sessionID: Date.now().toString(),
                ip: req.headers['x-forwarded-for'] || req.ip,
                token: new Token(usr.id)
              };
              await usr.update({
                sessions: [...(usr.sessions ? usr.sessions : []), newSession]
              });
              res.status(200).json({
                ...newSession,
                token: newSession.token.toString()
              });
            } else {
              res.status(401).json({ error: 'Invalid password.' });
            }
          } else {
            res.status(401).json({ error: 'Banned.' });
            return;
          }
        } else {
          res.status(404).json({ error: 'No account.' });
          return;
        }
      }
    }
  },
  {
    method: 'patch',
    path: '/api/user/token/',
    preHandlers: [upload.none()],
    async handler(req, res) {
      let { password } = req.body;
      if (!password) {
        res.status(400).json({ error: 'Bad Request', missing: ['password'] });
        return;
      }
      let match = await compare(password, req.user.password);
      if (!match) {
        res.status(401).json({ error: 'Invalid password.' });
        return;
      }
      let newSession = {
        sessionID: Date.now().toString(),
        ip: req.headers['x-forwarded-for'] || req.ip,
        token: new Token(req.user.id),
        os: {},
        ua: 'API Authorization',
        cpu: {},
        engine: {},
        browser: {}
      };
      await req.user.update({
        sessions: [
          ...req.user.sessions.filter(s => {
            return s.ua !== 'API Authorization';
          }),
          newSession
        ]
      });
      res.status(201).json({
        ...newSession,
        token: newSession.token.toString()
      });
    }
  },

  {
    method: 'patch',
    path: '/api/user/',
    preHandlers: [upload.none()],
    async handler(req, res) {
      if (!req.user) {
        res
          .status(401)
          .json(
            req.headers.authorization
              ? { error: 'Invalid Token' }
              : { error: 'No Token Provided' }
          );
        return;
      }
      let { email, name, password, newPassword } = req.body;
      let vars = { name, email, password };
      let undefinedVars = Object.keys(vars)
        .map(e => (vars[e] !== undefined ? null : e))
        .filter(e => e !== null);
      if (undefinedVars > 0) {
        res.status(400).json({ error: 'Bad Request', missing: undefinedVars });
        return;
      }
      let username = name ? name.toLowerCase() : null;
      let now = new Date(Date.now());
      let match = await compare(password, req.user.password);
      if (!match) {
        res.status(401).json({ error: 'Invalid Password' });
        return;
      }
      let hashedPass = await hash(
        newPassword ? newPassword : password,
        await genSalt(randomInt(0, 15))
      );
      let updated = await req.user.update({
        email: email || req.user.email,
        displayName: name || req.user.displayName,
        username: username || req.user.username,
        updatedAt: now,
        password: hashedPass
      });
      console.log('User updated');
      let noPass = {
        ...updated.toJSON()
      };
      delete noPass.password;
      delete noPass.sessions;
      res.status(200).json(noPass);
    }
  }
];
