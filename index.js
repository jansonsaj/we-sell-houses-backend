/**
 * A module that is the entrypoint in the application.
 * Serves all API routes
 * @module index
 * @author Andris Jansons
 */

import './helpers/setup.js';
import './docs.js';
import Koa from 'koa';
import koaBody from 'koa-body';
import serve from 'koa-static';
import mount from 'koa-mount';
import cors from '@koa/cors';
import {connect} from './models/db.js';
import users from './routes/users.js';
import properties from './routes/properties.js';
import messages from './routes/messages.js';
import files from './routes/files.js';
import fs from 'fs/promises';

const port = process.env.PORT || 3000;
const publicDir = './public';

const app = new Koa();
app.use(koaBody({multipart: true}));
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(users.routes());
app.use(properties.routes());
app.use(messages.routes());
app.use(files.routes());

app.use(mount('/public', serve(publicDir)));

/**
 * Create public directory for serving static files
 */
async function createPublicDir() {
  try {
    await fs.mkdir(publicDir);
    console.log('Created public directory');
  } catch (err) {
    if (err.code === 'EEXIST') {
      console.log('Public directory already exists');
    } else {
      console.log(err);
      console.log('Unable to create public directory.');
      console.log('Consider running application with sudo.');
    }
  }
}

/**
 * Connect to the database and start the server.
 */
async function start() {
  await createPublicDir();
  await connect();
  app.listen(port);
  console.log(`Listening on port: ${port}`);
}

start();
