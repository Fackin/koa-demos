// 释放error事件
const Koa = require('koa');
const app = new Koa();

// 错误捕获
const handle = async function(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
    ctx.app.emit('error', err, ctx);
  }
}
const main = (ctx, next) => {
  console.log('into main');
  ctx.throw(404);
  // ctx.response.status = 404;
  // ctx.response.body = 'Page Not Found';
}


app.on('error', (err, ctx) => {
  console.log('server error', err.message);
  console.log(err);
});

app.use(handle);
app.use(main);
app.listen(3000);