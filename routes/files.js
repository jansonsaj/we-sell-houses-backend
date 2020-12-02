/**
 * A module that specifies all routes on /files path
 * @module routes/files
 * @author Andris Jansons
 */

import Router from 'koa-router';
import mime from 'mime-types';
import {v1 as uuidv1} from 'uuid';
import fs from 'fs/promises';
import {auth} from '../middlewares/auth.js';

const publicDir = 'public';
const router = new Router({prefix: '/files'});

router.post('/', auth, uploadFile);

/**
 * Uploads a file to public directory with a unique name
 * and returns the uploaded file's location
 * @param {Context} ctx Koa Context
 */
async function uploadFile(ctx) {
  try {
    const {path, type} = ctx.request.files.file;
    const fileExtension = mime.extension(type);
    const uniqueName = `${uuidv1()}.${fileExtension}`;
    const fileLocation = `${publicDir}/${uniqueName}`;

    await fs.copyFile(path, fileLocation);

    ctx.status = 200;
    ctx.body = {
      fileLocation,
      type,
    };
  } catch (err) {
    ctx.body = err;
    ctx.status = 500;
  }
}

export default router;
