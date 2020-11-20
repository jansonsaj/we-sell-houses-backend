/**
 * A module that is the entrypoint in the application.
 * Serves all API routes
 * @module index
 * @author Andris Jansons
 */

import './helpers/setup.js';
import './docs.js';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {connect} from './models/db.js';
import users from './routes/users.js';
import properties from './routes/properties.js';

const port = process.env.PORT || 3000;

const app = new Koa();
app.use(bodyParser());
const router = new Router();

app.use(router.routes());
app.use(users.routes());
app.use(properties.routes());

/**
 * Connect to the database and start the server.
 */
async function start() {
  await connect();
  app.listen(port);
  console.log(`Listening on port: ${port}`);
}

start();
