'use strict';

import { User, Uploads } from '../db.mjs';
import multer from 'multer';
const upload = multer();
import bcrypt from 'bcrypt';
import { unlink } from 'fs/promises';
import { genSalt } from 'bcrypt';
import { randomInt } from 'crypto';

export default [
  {
    method: 'get',
    path: '/api/users/',
    preHandlers: [],
    async handler(req, res) {
      let limit = parseInt(req.query.count) || 50,
        offset = parseInt(req.query.offset) || 0;
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

      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }

      let users = await User.findAndCountAll({
        offset,
        limit,
        order: [['createdAt', 'DESC']]
      });

      if (users) {
        res.status(200).json({
          count: users.count,
          users: users.rows.map(user => {
            return {
              id: user.id,
              username: user.username,
              displayName: user.displayName,
              email: user.email,
              domain: user.domain,
              subdomain: user.subdomain,
              staff: user.staff,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              bannedAt: user.bannedAt
            };
          })
        });
      } else res.status(200).json({ count: 0, users: [] });
    }
  },
  {
    method: 'delete',
    path: '/api/user/:id(\\d+)/',
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
      let { id } = req.params;
      if (!id) {
        res.status(400).json({ error: 'Bad Request', missing: ['id'] });
        return;
      }
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let usr = await User.findOne({
        where: {
          id
        }
      });
      if (!usr) {
        res.status(404).json({ error: 'No account.' });
        return;
      }
      let files = await Uploads.findAll({
        where: {
          userid: usr.id
        }
      });
      if (files.length > 0) {
        files.forEach(async (file, index, self) => {
          try {
            await unlink(`uploads/${file.filename}`);
            await file.destroy();
          } catch (err) {
            console.error(err);
          }
          if (index === self.length - 1) {
            await usr.destroy();
            res.status(204).send();
            console.log('User Deleted');
          }
        });
      }else {
        await usr.destroy();
        res.status(204).send();
        console.log('User Deleted');
      }
    }
  },
  {
    method: 'patch',
    path: '/api/user/:id(\\d+)/token/',
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
      let { id } = req.params;
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let usr = await User.findOne({
        where: {
          id
        }
      });
      if (!usr) {
        res.status(404).json({ error: 'Not Found' });
      }
    }
  },
  {
    method: 'patch',
    path: '/api/user/:id(\\d+)/ban/',
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
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let { banned } = req.body,
        { id } = req.params;
      if (banned === undefined) {
        res.status(400).json({ error: 'Bad Request', missing: ['banned'] });
      }
      let usr = await User.findOne({
        where: {
          id
        }
      });
      if (!usr) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      if ((usr.bannedAt && banned) || (!usr.bannedAt && !banned)) {
        res.status(304).json({
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
        return;
      }
      let user = await usr.update({
        bannedAt: banned ? new Date(Date.now()).toISOString() : null
      });
      res.status(200).json({
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        domain: user.domain,
        subdomain: user.subdomain,
        staff: user.staff,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        bannedAt: user.bannedAt
      });
    }
  },
  {
    method: 'patch',
    path: '/api/user/:id(\\d+)/',
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
      let { email, name, newPassword } = req.body,
        { id } = req.params;
      let vars = { name, email, newPassword };
      let undefinedVars = Object.keys(vars)
        .map(e => (vars[e] !== undefined ? null : e))
        .filter(e => e !== null);
      if (undefinedVars.length > 0 || !req.params.id) {
        res.status(400).json({ error: 'Bad Request', missing: undefinedVars });
        return;
      }
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let username = name.toLowerCase(),
        usr = await User.findOne({
          where: {
            id
          }
        });
      if (!usr) {
        res.status(404).json({
          error: 'Not Found'
        });
        return;
      }
      let now = new Date(Date.now()),
        hashedPass = newPassword
          ? await bcrypt.hash(newPassword, await genSalt(randomInt(0, 15)))
          : null;

      await usr.update({
        email: email || usr.email,
        displayName: name || usr.displayName,
        username: username || usr.username,
        updatedAt: now,
        password: hashedPass || usr.password
      });
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
  }
];
