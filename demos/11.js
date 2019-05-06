// 中间件栈
const Koa = require('koa');
const app = new Koa();

const one = (ctx, next) => {
  console.log('>>> one');
  next();
  console.log('<<< one');
}
const two = (ctx, next) => {
  console.log('>>> two');
  // next();
  console.log('<<< two');
}
const three = (ctx, next) => {
  console.log('>>> three');
  next();
  console.log('<<< three');
}
const main = ctx => {
  ctx.response.body = "Hello world!";
}

app.use(one);
app.use(two);
app.use(three);
app.use(main);
app.listen(3000);