const path = require('path')
const { getEntry, getHtmlWebpackPlugin } = require('./util')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src') // 别名
    }
  },
  entry: getEntry('./src/pages/**/app.js'), // js入口
  module: {
    rules: [
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: { minimize: true }
      },
      // JavaScript: Use Babel to transpile JavaScript files
      { test: /\.js$/, use: ['babel-loader'] },
      // Images: Copy image files to build folder
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource',
      },
      // Fonts and SVGs: Inline files
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024
          }
        }
      }

    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 打包业务中公共代码  priority低，后提取
        // 只提取common和styles目录下的文件，打包成common.js和common.css
        // 否则会把任意目录下的文件也打包进common里，造成污染
        common: {
          name: 'common',
          chunks: 'initial', // 分开优化打包异步和非异步引入
          test: /[\\/]src[\\/](common|styles)/, // 控制哪些模块被缓存
          minSize: 1, // 压缩前最小模块大小
          priority: 0, // 缓存组打包的先后优先级
          minChunks: 1 // 被引用次数
        }
      }
    },
    runtimeChunk: { name: 'manifest' } // 运行时代码
  },
  plugins: [
    ...getHtmlWebpackPlugin('./src/pages/**/*.html'),
    new CleanWebpackPlugin()
    // 进度条
    // new ProgressBarPlugin(),
    // 处理静态文件夹  static之类
    // ~~~
    // eslint
    // new ESLintPlugin({
    //   fix: false, /* 自动帮助修复 */
    //   extensions: ['js', 'json', 'coffee', 'vue'],
    //   exclude: 'node_modules'
    // })
  ]
}
