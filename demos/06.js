// koa-route
const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

const index = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = "<a href='/'>Index Page</a>";
}
const main = ctx => {
  ctx.response.body = 'Hello World';
}

app.use(route.get('/', main));
app.use(route.get('/index', index));

app.listen(3000);