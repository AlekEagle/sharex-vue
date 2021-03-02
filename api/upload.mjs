'use strict';

import { Uploads } from '../db.mjs';
import multer from 'multer';
import { createWriteStream } from 'fs';
import fT from 'file-type';
let { fromBuffer, minimumBytes } = fT;
const upload = multer();
import { randomInt } from 'crypto';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function newString(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(randomInt(possible.length)));

  return text;
}

export default [
  {
    method: 'post',
    path: '/upload/',
    preHandlers: [],
    async handler(req, res) {
      res.redirect(308, '/api/upload/');
    }
  },
  {
    method: 'post',
    path: '/api/upload/',
    preHandlers: [upload.single('file')],
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
      if (!req.file) {
        if (!req.body.file) {
          res.status(400).json({ error: 'Bad Request', missing: ['file'] });
          return;
        }
        let filename = newString(10),
          writeStream = createWriteStream(
            `${__dirname}/../uploads/${filename}.txt`
          );
        writeStream.write(new Buffer.from(req.body.file), error => {
          if (error) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          } else {
            Uploads.create({
              filename: `${filename}.txt`,
              userid: req.user.id,
              size: req.body.file.length
            }).then(() => {
              res
                .status(201)
                .end(
                  `https://${
                    req.user.subdomain ? `${req.user.subdomain}.` : ''
                  }${req.user.domain}/${filename}.txt`
                );
            });
          }
          writeStream.end();
          writeStream.destroy();
        });
      } else {
        fromBuffer(req.file.buffer.slice(0, minimumBytes)).then(ft => {
          let filename = newString(10),
            writeStream = createWriteStream(
              `${__dirname}/../uploads/${filename}.${
                ft
                  ? ft.ext
                  : map[req.file.mimetype] !== undefined
                  ? map[req.file.mimetype]
                  : 'txt'
              }`
            );
          writeStream.write(req.file.buffer, error => {
            if (error) {
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            } else {
              Uploads.create({
                filename: `${filename}.${
                  ft
                    ? ft.ext
                    : map[req.file.mimetype] !== undefined
                    ? map[req.file.mimetype]
                    : 'txt'
                }`,
                userid: req.user.id,
                size: req.file.size
              }).then(() => {
                res
                  .status(201)
                  .end(
                    `https://${
                      req.user.subdomain ? `${req.user.subdomain}.` : ''
                    }${req.user.domain}/${filename}.${
                      ft
                        ? ft.ext
                        : map[req.file.mimetype] !== undefined
                        ? map[req.file.mimetype]
                        : 'txt'
                    }`
                  );
              });
            }
            writeStream.end();
            writeStream.destroy();
          });
        });
      }
    }
  }
];
