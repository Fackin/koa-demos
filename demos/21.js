// 文件上传
const Koa = require('koa');
const app = new Koa();
const os  = require('os');
const path = require('path');
const koaBody = require('koa-body');
const fs = require('fs');

const main = async function(ctx, next) {
  const tmpdir = os.tmpdir();
  const filePaths = [];
  const files = ctx.request.files || {};

  for (let key in files) {
    const file = files[key];
    // const filePath = path.join(tmpdir, file.name);
    const filePath = path.join('./', file.name);
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    reader.pipe(writer);
    console.log('file',key, filePath);
    filePaths.push(filePath);
  }

  ctx.body = filePaths;
}

app.use(koaBody({ multipart: true }));
app.use(main);
app.listen(3000);