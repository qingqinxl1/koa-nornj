Koa-Nornj
=========
koa服务器端渲染中间件

使用[nornj](https://github.com/joe-sky/nornj)进行渲染

### 使用示例

```js
const Koa = require('koa');
const render = require('koa-nornj');
const path = require('path');

const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
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

* 项目目录下运行例子
```
npm run example
```

### 设置

* root: 模版文件根路径.
* layout: 全局母版文件, 默认为 `layout`, 若不需要设置为`false`.
* extname: 模版文件后缀名 (默认 `html`).
* cache: 是否缓存编译文件 (默认 `true`).
* delimiter: 模板语法规则,描述如下:
```js
{
  start: '{{',      //插值变量开始字符，默认为"{{"
  end: '}}',        //插值变量结束字符，默认为"}}"
  extension: '#',   //扩展标签前置字符，默认为"#"
  prop: '@',        //参数标签前置字符，默认为"@"
  comment: '#'      //模板注释，默认为<!--#...#-->语法中的"#"
}
```

### Layouts

`koa-nornj` 支持layouts. 默认文件`layout.html`. 如果想要修改默认,使用配置 `settings.layout`.

#### layout文件举例
```
<html>
  <head>
    <title>koa ejs</title>
  </head>
  <body>
    <h3>koa ejs</h3>
    {{{body}}}
  </body>
</html>
```

### Include

支持include

```html
<div>
  <#include src="./user.html"/>
</div>
```
