const webpack = require('webpack'); // eslint-disable-line
const {ImageminWebpackPlugin} = require('imagemin-webpack'); // eslint-disable-line
const imageminGifsicle = require('imagemin-gifsicle'); // eslint-disable-line
const imageminMozjpeg = require('imagemin-mozjpeg'); // eslint-disable-line
const imageminPngquant = require('imagemin-pngquant'); // eslint-disable-line
const imageminSvgo = require('imagemin-svgo'); // eslint-disable-line
const projectConfig = require('./project.conf.js')

let BASE_URL = projectConfig.baseUrl; // 部署路径
// let BASE_URL = '/custom-page/'; // 部署路径

const PAGE_PATH = 'src/projects'; // 页面目录路径

const PAGE_ENTRY = projectConfig.fileName;

if (PAGE_ENTRY) BASE_URL = `${BASE_URL}${PAGE_ENTRY}/`;

if (process.env.VUE_APP_ENV === 'prod') BASE_URL = `//static.ali.szqk-tech.com/pages${BASE_URL}`;

const multiPageConf = buildMultiPagesConf();

module.exports = {
  baseUrl: `${BASE_URL}`, //新版publicPath
  lintOnSave: false,
  pages: multiPageConf.pagesConf,
  productionSourceMap:false,
  devServer: {
    historyApiFallback: {
      rewrites: multiPageConf.rewritesConf,
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          '/api': '',
        },
      },
    },
  },
  configureWebpack(config) {
    // 优化 moment 依赖所有语言包，导致尺寸过大
    config.plugins.splice(config.plugins.length - 2, 0, new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    // 增加图片压缩支持
    config.plugins.splice(config.plugins.length - 2, 0, new ImageminWebpackPlugin({
      cache: false,
      bail: false,
      imageminOptions: {
        plugins: [
          imageminGifsicle(),
          imageminSvgo(),
          imageminMozjpeg({
            quality: 90,
            progressive: true,
          }),
          imageminPngquant({
            quality: '85-95',
            speed: 5,
          }),
        ],
      },
    }));
  },
  transpileDependencies: ['webpack-dev-server/client'],
  chainWebpack(config) {
    // 配置自定义模块路径
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@component', resolve('src/components'))
      .set('@projects', resolve('src/projects'))
      .set('@config', resolve('project.conf.js'));
      config.entry.app = ['babel-polyfill', './src/main.js'];
  },
};

// 构建多工程配置
function buildMultiPagesConf() {
  const fs = require('fs');

  // 解析页面列表,并过滤空文件夹
  let pageEntryList = fs.readdirSync(PAGE_PATH);
  if (PAGE_ENTRY) {
    pageEntryList = pageEntryList.filter(path => fs.statSync(`${PAGE_PATH}/${path}`).isDirectory() && path === PAGE_ENTRY);
  } else {
    pageEntryList = pageEntryList.filter(path => fs.statSync(`${PAGE_PATH}/${path}`).isDirectory());
  }
  // 生成 `channel-pages` 配置
  const pagesConf = pageEntryList.reduce((prevObj, pageEntry) => {
    prevObj[pageEntry] = {
      entry: `${PAGE_PATH}/${pageEntry}`,
      template: 'public/index.html',
      filename: PAGE_ENTRY ? 'index.html' : `${pageEntry}.html`,
    };
    return prevObj;
  }, {});

  // 生成 `rewrites` 配置
  const rewritesConf = pageEntryList.map(pageEntry => ({
    from: new RegExp(`^/${BASE_URL}/${pageEntry}(/|$)`),
    to: PAGE_ENTRY ? `/${BASE_URL}/index.html` : `/${BASE_URL}/${pageEntry}.html`,
  }));

  return {pagesConf, rewritesConf};
}


function resolve(dir) {
  const path = require('path');
  return path.join(__dirname, dir);
}
