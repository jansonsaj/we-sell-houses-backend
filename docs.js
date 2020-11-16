import Koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';

const port = process.env.DOCS_PORT || 3030;
const app = new Koa();

app.use(mount('/openapi', serve('./docs/openapi')));
app.use(mount('/schemas', serve('./schemas')));

app.listen(port);
console.log(`Docs server running on port ${port}.`);
