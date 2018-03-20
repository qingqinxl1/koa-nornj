/*!
 * koaengine - index.js
 */

'use strict';
/**
 * 依赖模块
 */
const debug = require('debug')('koa-engine');
const fs = require('fs');
const util = require('util');
const path = require('path');
const nj = require('nornj');
const includeParser = require('nornj/tools/includeParser');
const readFile = util.promisify(fs.readFile);

console.log('nj:', nj);

/**
 * 处理include
 */
nj.default.config({
  includeParser
})

/**
 * 默认设置
 * @type {Object}
 */
const defaultSettings = {
  extname: '.html',
  layoutsDir: 'layouts/',
  bodyPlaceholder: 'body',
  delimiters: null,
  cache: true,
  layout: 'layout',
  writeResp: true
};

/**
 * 设置app.context.render
 *
 * 调用方式:
 * ```
 * await ctx.render('user', {name: 'dead_horse'});
 * ```
 * @param {Application} app koa application instance
 * @param {Object} settings user settings
 */
exports = module.exports = function (app, settings) {
  if (app.context.render) {
    return;
  }

  if (!settings || !settings.root) {
    throw new Error('settings.root required');
  }

  // 处理模版根路径
  settings.root = path.resolve(process.cwd(), settings.root);

  // 缓存渲染数据对象
  const cache = Object.create(null);

  settings = Object.assign({}, defaultSettings, settings);

  // 处理扩展名
  settings.extname = settings.extname
    ? '.' + settings.extname.replace(/^\./, '')
    : '';

  /**
   * generate html with view name and options
   * @param {String} view
   * @param {Object} options
   * @return {String} html
   */
  async function render(view, options) {
    view += settings.extname;
    const viewPath = path.join(settings.root, view);
    debug(`render: ${viewPath}`);

    // 若已经缓存，直接从缓存中获取
    if (settings.cache && cache[viewPath]) {
      return cache[viewPath].call(options.scope, options);
    }

    const tpl = await readFile(viewPath, 'utf8');
    const tmplRule = settings.delimiters ? nj.createTmplRule(settings.delimiters) : nj.tmplRule;

    const fn = nj.compile(tpl, {
      fileName: viewPath,
      tmplKey: cache ? viewPath : null,
      tmplRule,
      debug: settings.debug
    });

    // 缓存当前文件的compile函数
    if (settings.cache) {
      cache[viewPath] = fn;
    }

    console.log('compile options', options);
    return fn.call(options.scope, options);
  }

  app.context.render = async function (view, _context) {
    const ctx = this;
    const context = Object.assign({}, ctx.state, _context);

    // console.log('koa context:', context);
    let html = await render(view, context);
    // console.log('after render context:', html);

    const layout = context.layout === false ? false : (context.layout || settings.layout);
    // 使用指定排版,将渲染后的内容放到制定排版中
    if (layout) {
      context.body = html;
      html = await render(layout, context);
    }

    // 根据设置不同返回不同形式的编译内容
    const writeResp = context.writeResp === false ? false : (context.writeResp || settings.writeResp);
    if (writeResp) {
      // 一般操作，直接替换body的内容
      ctx.type = 'html';
      ctx.body = html;
    } else {
      // 返回html字符串
      return html;
    }
  };
};
