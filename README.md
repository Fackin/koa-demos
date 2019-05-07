

# Koa框架学习

2019年5月6日

搬运自阮一峰老师博客 [http://www.ruanyifeng.com/blog/2017/08/koa.html](http://www.ruanyifeng.com/blog/2017/08/koa.html)

## 0、准备

使用node版本7.6以上

```shell
$ node -v

$ npm init
```

## 1、基本用法

### 1.1 架设HTTP服务

```javascript
// 简单的HTTP服务架设
const Koa = require('koa');
const app = new Koa();

app.listen(3000);
```



```shell
npm install koa --save

node demos/01.js
```



![image-20190506142922072](https://ws4.sinaimg.cn/large/006tNc79ly1g2rkzja4a9j30eo05w0sx.jpg)

因为服务没有内容

### 1.2 Context 对象

Koa提供一个Context 对象表示一个回话的上下文（包括HTTP请求和HTTP回复），通过加工这个对象，给用户返回内容。

`Context.response.body `属性就是发送给用户的内容

 main函数用来设置`ctx.response.body `属性，app.use用来加载main函数

```javascript
// Context对象
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.response.body = "Hello world!";
}

app.use(main);
app.listen(3000);
```



![image-20190506144240212](https://ws1.sinaimg.cn/large/006tNc79ly1g2rld4qyl0j30fm04yt8w.jpg)

### 1.3 HTTP Response类型

Koa默认返回的类型是text/plain 

使用`cox.request.accepts`判断一下客户端希望接受什么数据`（根据HTTP Request 的Accept字段）使用`ctx.response.type 指定返回类型

```javascript
// HTTP Response 类型
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  if (ctx.request.accepts('xml')) {
    ctx.response.type = 'xml';
    ctx.response.body = '<data>Hello World</data>';
  } else if (ctx.request.accepts('html')) {
    ctx.response.type = 'html';
    ctx.response.body = '<p>Hello World</p>';
  } else if (ctx.request.accepts('json')) {
    ctx.response.type = 'json';
    ctx.response.body = { data: 'Hello World' };
  } else {
    ctx.response.type = 'text';
    ctx.response.body = 'Hello World';
  }
}

app.use(main);
app.listen(3000);
```



![image-20190506145459816](https://ws3.sinaimg.cn/large/006tNc79ly1g2rlpyd3m0j30zs070aaw.jpg)



### 1.4网页模版

实际开发中，返回给用户的网页是网页模版，先读取模版再返回

```javascript
// 网页模版
const Koa = require('koa');
const fs = require('fs'); // 
const app = new Koa();

const main = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = fs.createReadStream('./demos/template.html');
}

app.use(main);
app.listen(3000);
```



## 2、路由

### 2.1 原生路由

`ctx.request.path `获取用户请求路径`

```javascript
// 原生路由
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  if (ctx.request.path !== '/') {
    ctx.response.type = 'html';
    ctx.response.body = "<a href='/'>Index Page</a>";
  } else {
    ctx.response.type = 'text';
    ctx.response.body = 'Hello World';
  }
}

app.use(main);
app.listen(3000);
```



![image-20190506150832120](https://ws4.sinaimg.cn/large/006tNc79ly1g2rm40u3jgj30gu05mjro.jpg)



### 2.2 koa-route模块

Koa 提供封装好的koa-route模块

```javascript
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
```



```shell
npm install koa-route --save
node demos/06.js
```

###2.3 静态资源

网站提供的静态资源（图片，字体，样式。。。）的路由，koa-static模块封装了

```javascript
// koa-static
const Koa = require('koa');
const app = new Koa();
const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname));

app.use(main);

app.listen(3000);
```



```shell
npm install koa-static --save
node demos/07.js
```



### 2.4 重定向

`ctx.response.redirect()` 方法重定向

```javascript
// 重定向
const Koa = require('koa');
const route = require('koa-route');
const app = new Koa();

const redirect = ctx => {
  ctx.response.redirect('/');
  ctx.response.body = "<a href='/'>Index Page</a>"; // 显示不到
}
const main = ctx => {
  ctx.response.body = 'Hello World';
}

app.use(route.get('/', main));
app.use(route.get('/redirect', redirect));

app.listen(3000);
```



## 3、 中间件(middleware)

### 3.1 Logger

简单的日志功能

```javascript
// Logger
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  console.log(`${ Date.now() } - ${ctx.request.method} - ${ctx.request.url}`)
  ctx.response.body = "Hello world!";
}

app.use(main);
app.listen(3000);
```



![image-20190506160330531](https://ws3.sinaimg.cn/large/006tNc79ly1g2rnp88ak0j309w01h749.jpg)

###3.2中间件的概念

上面日志功能可以拆分出来独立的函数

```javascript
// 中间件的概念
const Koa = require('koa');
const app = new Koa();

const logger = (ctx, next) => {
  console.log(`${ Date.now() } - ${ctx.request.method} - ${ctx.request.url}`)
  next();
}
const main = ctx => {
  ctx.response.body = "Hello world!";
}

app.use(logger);
app.use(main);
app.listen(3000);
```

上面logger函数就是中间件（middleware），因为它处在HTTP request 和HTTP response 中间，用来实现某种中间功能，`app.use()`用来加载中间件。

基本上，Koa所以功能都是通过中间件实现，，每个中间件默认接受两个参数，第一个是Context， 第二个是next函数，调用next 函数，把执行权转交到下一个中间件。

### 3.3 中间件栈

多个中间件形成中间件栈（middle stack），以"先进后出"（first-in-last-out）顺序执行。

```
1.最外层中间件执行，
2.调用next 转交给下个中间件
3....
4.最内层中间件执行
5.执行next 转交给上层中间件，执行后面代码
6....
7.最外层中间件执行next后面代码
```

```javascript
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
  next();
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
```

**如果中间件内不执行next，执行权将不转交下去。**



### 3.4异步中间件

如果有异步操作，中间件需要写为async函数

```javascript
// 异步中间件
const Koa = require('koa');
const fs = require('fs.promised'); // 
const app = new Koa();

const main = async function (ctx, next) {
  ctx.response.type = 'html';
  ctx.response.body = await fs.readFile('./demos/template.html', 'utf8');
}

app.use(main);
app.listen(3000);
```

`fs.readFile()`是异步函数

```shell
npm install fs.promised --save
node demos/12.js
```



### 3.5中间件的合成

`Koa-compose`模块可以将多个中间件合并成一个

```javascript
// 中间件的合成
const Koa = require('koa');
const app = new Koa();
const compose = require('koa-compose');

const logger = (ctx, next) => {
  console.log(`${ Date.now() } - ${ctx.request.method} - ${ctx.request.url}`)
  next();
}
const main = ctx => {
  ctx.response.body = "Hello world!";
}

const middlewares = compose([logger, main]);
app.use(middlewares);
app.listen(3000);
```



## 4、错误处理

### 4.1 500错误

如果代码运行过程中发生错误，需要把错误信息返回给用户，HTTP协议约定要返回500状态码，Koa提供`cxt.throw()`方法用来抛出错误，`ctx.throw(500)`就是抛出500错误。

```javascript
// 错误处理
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.throw(500);
}

app.use(main);
app.listen(3000);
```

500错误页 "Internal Server Error"



### 4.2 404错误

如果将`ctx.response.status`设置成404，相当于`ctx.throw(404)`，返回404错误。

```javascript
// 错误处理 404
const Koa = require('koa');
const app = new Koa();

const main = ctx => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
}

app.use(main);
app.listen(3000);
```



### 4.3 处理错误的中间件

为了方便处理错误，最好使用`try...catch`将其捕获，但是每个中间件都写`try…catch`太麻烦，可以让最外层的中间件负责所有中间件的错误处理。

```javascript
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
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
}
const index = (ctx, next) => {
  console.log('into index');
  ctx.response.body = 'Index';
  next();
}
app.use(handle);
app.use(index);
app.use(main);
app.listen(3000);
```



###4.4 error事件的监听

运行过程中一旦出错，Koa会触发一个error事件，监听这个事件，也可以处理错误。	

```javascript
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
```



### 4.5 释放error事件

如果错误被`try…catch`捕获，就不会触发error事件，这时，必须调用`ctx.app.emit()`，手动释放error事件，才能监听函数生效。

```javascript
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
}

app.on('error', (err, ctx) => {
  console.log('server error', err.message);
  console.log(err);
});

app.use(handle);
app.use(main);
app.listen(3000);
```



## 5、Web App功能

### 5.1 Cookies

`ctx.cookies`用来读取Cookie.

```javascript
// cookies
const Koa = require('koa');
const app = new Koa();

const main = (ctx, next) => {
  const n = Number(ctx.cookies.get('view') || 0) + 1;
  ctx.cookies.set('view', n);
  ctx.response.body = n + 'views';
}

app.use(main);
app.listen(3000);
```



###5.2 表单

Web应用离不开处理表单，本质上，表单就是POST方法发送到服务器的键值对。`koa-body`模块可以用来从POST请求的数据体里提取键值对。

```javascript
// 表单处理
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');

const main = async function(ctx, next) {
  const body = ctx.request.body;
  if(!body.name)ctx.throw(400, '.name required');
  ctx.response.body = { name: body.name };
}

app.use(koaBody());
app.use(main);
app.listen(3000);
```



```shell
npm install koa-body --save
```

打开另一个命令行窗口，运行以下命令。使用POST方法向服务器发送一个键值对，如果数据不正确，会收到错误提示。

```shell
$ curl -X POST --data "name=Jack" 127.0.0.1:3000
{"name":"Jack"}

$ curl -X POST --data "name" 127.0.0.1:3000
name required
```

### 2.3 文件上传

`Koa-body`还可以处理文件上传。

```javascript
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
    const filePath = path.join(tmpdir, file.name);
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
```

打开另一个命令行窗口，执行以下命令，上传一个文件。`/path/to/file`填写真实路径。

```shell
curl --form upload=@/path/to/file http://127.0.0.1:3000
```



（完）