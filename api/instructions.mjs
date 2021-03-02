'use strict';

import { Instructions } from '../db.mjs';
import multer from 'multer';
const upload = multer();

export default [
  {
    method: 'get',
    path: '/api/setup/',
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
      let instructions = await Instructions.findAll();
      res.status(200).json(
        instructions.map(i => {
          return {
            name: i.name,
            description: i.description,
            displayName: i.displayName,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt
          };
        })
      );
    }
  },
  {
    method: 'get',
    path: '/api/setup/:name/',
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
      let { name } = req.params;
      let instruction = await Instructions.findOne({
        where: {
          name
        }
      });
      if (!instruction) {
        res.status(404).json({
          error: 'Not Found'
        });
        return;
      }

      let instruct = { ...instruction.toJSON() };
      delete instruct.fileContent;
      res.status(200).json(instruct);
    }
  },
  {
    method: 'get',
    path: '/api/setup/:name/save/',
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
      let { name } = req.params;
      let instruction = await Instructions.findOne({
        where: {
          name
        }
      });
      if (!instruction) {
        res.status(404).json({
          error: 'Not Found'
        });
        return;
      }
      res.set(
        'Content-Disposition',
        `attachment; filename="${instruction.filename}"`
      );
      res
        .status(200)
        .send(
          instruction.fileContent.replace(
            /(\{\{apiToken\}\})/g,
            `${req.headers.authorization}`
          )
        );
    }
  }
];
