import './helpers/setup.js';
import './docs.js';
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import {connect} from './models/db.js';
import users from './routes/users.js';

const port = process.env.PORT || 3000;

const app = new Koa();
app.use(bodyParser());
const router = new Router();

router.get('/api/v1', welcomeAPI);
app.use(router.routes());
app.use(users.routes());

/**
 * The default route for testing purposes.
 * @param {Context} ctx Koa context
 */
function welcomeAPI(ctx) {
  ctx.body = {
    message: 'Welcome to the API!',
  };
}

/**
 * Connect to the database and start the server.
 */
async function start() {
  await connect();
  app.listen(port);
  console.log(`Listening on port: ${port}`);
}

start();
