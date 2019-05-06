// 错误处理中间件
const Koa = require('koa');
const app = new Koa();

// 错误捕获
const handle = async function(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    }
  }
}
const main = (ctx, next) => {
  console.log('into main');
  ctx.throw(404);
  // ctx.response.status = 404;
  // ctx.response.body = 'Page Not Found';
}
const index = (ctx, next) => {
  console.log('into index');
  ctx.response.body = 'Index';
  next();
}
app.use(handle);
// app.use(index);
app.use(main);
app.listen(3000);