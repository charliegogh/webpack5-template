const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const path = require('path');

function getEntry(globPath) {
  let files = glob.sync(globPath);
  if (process.env.CUSTOM) {
    files = filterEntry(files);
  }
  const entries = {};
  files.forEach(entry => {
    const entryName = path.dirname(entry).split('/').pop();
    entries[entryName] = [entry]
  });
  return entries;
}

/**
 * 多页面html模板
 [new HtmlWebpackPlugin(
    {
      template: './src/pages/trade-index/index.html',
      filename: 'trade-index.html',
      chunks: ['trade-index', 'common', 'vendor'],
    }
  )]
 */
function getHtmlWebpackPlugin(globPath) {
  let files = glob.sync(globPath);
  const htmlArr = [];
  files.forEach(entry => {
    const entryName = path.dirname(entry).split('/').pop();
    htmlArr.push(new HtmlWebpackPlugin(
      {
        template: entry,
        filename: entryName + '.html',
        chunks: [entryName,'common'], // common和vendor是splitChunks抽取的公共文件 manifest是运行时代码
        minify: {
          removeComments: false,
          collapseWhitespace: false,
          removeAttributeQuotes: false,
          //压缩html中的js
          minifyJS: false,
          //压缩html中的css
          minifyCSS: false,
        },
      }
    ));
  });
  return htmlArr;
}

module.exports = {
  getEntry,
  getHtmlWebpackPlugin
}
