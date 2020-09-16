const Koa = require('koa');
const Router = require('koa-router');

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

app.listen(port);
console.log(`Listening on port: ${port}`);
