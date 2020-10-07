import Koa from 'koa';
import Router from 'koa-router';
import db from './models/db.js';

const port = process.env.PORT || 3000;

const app = new Koa();
const router = new Router();

router.get('/api/v1', welcomeAPI);
app.use(router.routes());

function welcomeAPI(ctx) {
	ctx.body = {
		message: "Welcome to the API!"
	}
}

async function start() {
	await db.connect();
	app.listen(port);
	console.log(`Listening on port: ${port}`);
}

start();
