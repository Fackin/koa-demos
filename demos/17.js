// 监听错误
const Koa = require('koa');
const app = new Koa();

const main = (ctx, next) => {
  console.log('into main');
  ctx.throw(404);
}
app.on('error', (err, ctx) => {
  console.error('server error', err);
});

app.use(main);
app.listen(3000);