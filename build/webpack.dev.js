/**
 * @author charlie
 * @Description:
 * webpack打包环境基础构建
 */
"use strict";
const path = require("path");
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base');
const config = require('./config.js');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const devConfig = merge(
    baseConfig,

    {
        stats: 'errors-only',   // 不展示打包信息
        cache: {
            type: 'filesystem',
        },
        mode: "development",
        output: {
            filename: "[name].js",
        },
        devServer:{
            hot: false,
            client: {
                logging: 'none',
                progress: true,
            },
            liveReload: true,// 当监听到文件变化时 dev-server 将会重新加载或刷新页面  hot 必须配置为false
            // static: {
            //     directory:  path.resolve(__dirname,'..', 'dist'),
            //     watch: true,
            // },
            open: false,
            compress: true, // gzip
            port: config.dev.port,
        },
        module: {
            rules: [
                {
                    test: /\.less$$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                            },
                        },
                        'postcss-loader',
                         'less-loader'
                    ]
                },
            ]
        }
    }
)
module.exports = new Promise((reslove, reject) => {
    portfinder.basePort = config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
        } else {
            devConfig.plugins.push(
                new FriendlyErrorsPlugin({
                    compilationSuccessInfo: {
                        messages: [
                            `success: http://${config.dev.host}:${config.dev.port}`,
                        ],
                    },
                    clearConsole: true
                })
            );
        }

        reslove(devConfig);
    });
});
