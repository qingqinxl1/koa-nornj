/**
 * koa-nornj示例
 */
'use strict';

/**
 * 依赖模块.
 */

const Koa = require('koa');
const render = require('..');
const path = require('path');

const app = new Koa();

render(app, {
  root: path.join(__dirname, 'view'),
  // layout: 'template',
  extname: 'html',
  cache: true
});

app.use(function (ctx, next) {
  ctx.state = ctx.state || {};
  ctx.state.now = new Date().toLocaleString();
  ctx.state.ip = ctx.ip;
  ctx.state.version = '1.0.0';
  return next();
});

app.use(async function (ctx) {
  const users = [{ name: 'Dead Horse' }, { name: 'Jack' }, { name: 'Tom' }];
  await ctx.render('content', {
    users
  });
});

if (process.env.NODE_ENV === 'test') {
  module.exports = app.callback();
} else {
  app.listen(8080);
  console.log('open http://localhost:8080');
}

app.on('error', function (err) {
  console.log(err.stack);
});
