'use strict';

import { Domains, User } from '../db.mjs';
import multer from 'multer';
const upload = multer();

export default [
  {
    method: 'get',
    path: '/api/domains/',
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
      let domains = await Domains.findAndCountAll();
      res.status(200).json({ count: domains.count, domains: domains.rows });
    }
  },
  {
    method: 'patch',
    path: '/api/user/domain/',
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
      let { domain, subdomain } = req.body;
      subdomain =
        subdomain !== undefined
          ? subdomain
              .trim()
              .split(/\W+/g)
              .join('-')
          : '';
      if (!domain) {
        res.status(400).json({ error: 'Bad Request', missing: ['domain'] });
      }
      let d = await Domains.findOne({
        where: {
          domain
        }
      });
      if (!d) {
        res.status(404).json({
          error: 'Not Found'
        });
        return;
      }
      if (d.allowsSubdomains ? false : subdomain !== '') {
        res
          .status(400)
          .json({ error: 'Domain provided does not support subdomains' });
        return;
      }
      await req.user.update({
        domain,
        subdomain
      });
      res.status(200).json({
        domain,
        subdomain
      });
    }
  },
  {
    method: 'patch',
    path: '/api/user/:id(\\d+)/domain/',
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
      let { domain, subdomain } = req.body,
        { id } = req.params;
      subdomain =
        subdomain !== undefined
          ? subdomain
              .trim()
              .split(/\W+/g)
              .join('-')
          : '';
      if (req.user.staff === '') {
        res.status(403).json({ error: 'Missing Permissions' });
        return;
      }
      if (!domain) {
        res.status(400).json({ error: 'Bad Request', missing: ['domain'] });
      }
      let d = await Domains.findOne({
        where: {
          domain
        }
      });
      if (!d) {
        res.status(404).json({
          error: 'Not Found'
        });
        return;
      }
      if (d.allowsSubdomains ? false : subdomain !== '') {
        res
          .status(400)
          .json({ error: 'Domain provided does not support subdomains' });
        return;
      }
      let usr = await User.findOne({
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
      await usr.update({ domain, subdomain });
      res.status(200).json({ domain, subdomain });
    }
  }
];
