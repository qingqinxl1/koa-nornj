koa-engine
=========
koa服务器端渲染中间件
使用[nornj](https://github.com/joe-sky/nornj)进行模版渲染

### Example

```js
const Koa = require('koa');
const render = require('koa-engine');
const path = require('path');

const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  layout: 'template',
  extname: 'html',
  cache: true,
  debug: false,
});

app.use(async function (ctx) {
  const users = [{ name: 'Dead Horse' }, { name: 'Jack' }, { name: 'Tom' }];
  await ctx.render('content', {
    users
  });
});

app.listen(8080);
```

### [例子](https://github.com/qingqinxl1/koa-engine/tree/master/example).
```
cd example
node app.js
```

### settings

* root: 模版文件根路径.
* layout: global layout file, default is `layout`, set `false` to disable layout.
* extname: 模版文件后缀名 (默认 `html`).
* cache: 缓存编译文件 (默认 `true`).
* debug: 是否启动debug (默认 `false`).
* delimiter: 模板语法规则.
```js
{
  start: '{{',      //插值变量开始字符，默认为"{{"
  end: '}}',        //插值变量结束字符，默认为"}}"
  extension: '#',   //扩展标签前置字符，默认为"#"
  prop: '@',       //参数标签前置字符，默认为"@"
  comment: '#'     //模板注释，默认为<!--#...#-->语法中的"#"
}
```

### Layouts

`koa-engine` 支持layouts. 默认文件`layout`. 如果想要修改默认，使用配置 `settings.layout`.
若不使用layout，设置`settings.layout:false`

#### layout文件举例
```
<html>
  <head>
    <title>koa ejs</title>
  </head>
  <body>
    <h3>koa ejs</h3>
    {{{body}}
  </body>
</html>
```

### Include

支持include

```html
<div>
  <# include src="./user.html" name="user"/>
</div>
```
