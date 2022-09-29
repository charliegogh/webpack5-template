const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base');
const {WebpackManifestPlugin} = require('webpack-manifest-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const prodConfig = {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[contenthash].bundle.js',
        publicPath: './',
    },
    module: {
        rules: [
            {
                test: /\.(less)$/,
                use: [MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 2
                        }
                    },
                    'postcss-loader',
                    'less-loader',
                ],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ // 单独提取css文件
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].css', // splitChunks提取公共css时的命名规则
        }),
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin(), // 生成manifest.json
        // new CompressionWebpackPlugin(),
    ],
    optimization: {
        minimize: true, // 默认最优配置：生产环境，压缩 true。开发环境，不压缩 false
        // js 压缩 webpack5自带
        minimizer: [
            '...'
            // new TerserPlugin({
            //     parallel: true, // 可省略，默认开启并行
            //     terserOptions: {
            //         toplevel: true, // 最高级别，删除无用代码
            //         ie8: true,
            //         safari10: true,
            //     }
            // })
        ],
        runtimeChunk: {name: 'runtime'} // 运行时代码
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
};

module.exports = merge(baseConfig, prodConfig);
