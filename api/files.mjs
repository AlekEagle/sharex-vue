'use strict';

import { Uploads } from '../db.mjs';
import { unlink } from 'fs/promises';

export default [
  {
    method: 'get',
    path: '/api/files/',
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
      let limit = parseInt(req.query.count) || 50,
        offset = parseInt(req.query.offset) || 0;

      let files = await Uploads.findAndCountAll({
        limit,
        offset,
        order: [['createdAt', 'DESC']],
        where: {
          userid: req.user.id
        }
      });
      if (files === null || files.length === 0) {
        res.status(200).json({ count: 0, files: [] });
        return;
      }
      res.status(200).json({
        count: files.count,
        files: files.rows
      });
    }
  },
  {
    method: 'get',
    path: '/api/files/all/',
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
      let limit = parseInt(req.query.limit) || 50,
        offset = parseInt(req.query.offset) || 0;
      let files = await Uploads.findAndCountAll({
        limit,
        offset,
        order: [['updatedAt', 'DESC']]
      });
      if (!files || files.length === 0) {
        res.status(200).json({ count: 0, files: [] });
      }
      res.status(200).json({ count: files.count, files: files.rows });
    }
  },
  {
    method: 'get',
    path: '/api/files/:id/',
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
      let { id } = req.params,
        limit = parseInt(req.query.limit) || 50,
        offset = parseInt(req.query.offset) || 0;
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      let files = await Uploads.findAndCountAll({
        limit,
        offset,
        order: [['updatedAt', 'DESC']],
        where: {
          userid: id
        }
      });
      if (!files || files.length === 0) {
        res.status(200).json({ count: 0, files: [] });
        return;
      }
      res.status(200).json({ count: files.count, files: files.rows });
    }
  },
  {
    method: 'get',
    path: '/api/file/:filename/',
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
      let { filename } = req.params;
      let file = await Uploads.findOne({
        where: {
          filename
        }
      });
      if (!file) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      if (file.userid === req.user.id) {
        res.status(200).json(file);
        return;
      }
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      res.status(200).json(file);
    }
  },
  {
    method: 'delete',
    path: '/api/file/:filename/',
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
      let { filename } = req.params;
      let file = await Uploads.findOne({
        where: {
          filename
        }
      });
      if (!file) {
        res.status(404).json({ error: 'Not Found' });
        return;
      }
      if (file.ownerid !== req.user.id && req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      await unlink(`uploads/${file.filename}`);
      await file.destroy();
      res.status(204).send();
    }
  }
];
