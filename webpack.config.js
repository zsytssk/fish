'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const findParam = require('./script/findEnv');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ENV = findParam('ENV');
const CheckError = findParam('CheckError');
const common_config = mode => ({
    entry: {
        bundle: ['./test/test.ts', './src/main.ts'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, 'bin'),
    },
    resolve: {
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./library'),
            path.resolve('./libs'),
            path.resolve('./src'),
        ],
        extensions: ['.ts', '.js', '.json'],
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.js)$/,
                use: [
                    {
                        loader: 'thread-loader',
                    },
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true,
                        },
                    },
                ],
            },
            {
                test: /(\.glsl|.fs|.vs)$/,
                loader: 'webpack-glsl-loader',
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({ ENV: JSON.stringify(ENV) }),
        new WebpackBar({ color: 'green' }),
        new HtmlWebpackPlugin({
            hash: true,
            inject: mode === 'development',
            title: 'HonorMe',
            template: 'public/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: __dirname + '/public',
                    to: __dirname + '/bin',
                    globOptions: {
                        ignore: ['/public/index.html'],
                    },
                },
            ],
        }),
    ],
});

const dev_config = {
    devtool: ENV === 'DEV' ? 'eval-source-map' : 'source-map',
    stats: {
        warnings: false,
    },
    watch: ENV === 'DEV' ? true : false,
    devServer: {
        clientLogLevel: 'silent',
        host: '0.0.0.0',
        contentBase: path.join(__dirname, 'bin'),
        disableHostCheck: true,
        port: 5001,
        open: true,
        openPage: 'http://localhost:5001',
    },
};

const prod_config = {
    entry: {
        bundle: './src/main.ts',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                libs: {
                    //node_modules里的代码
                    test: /[\\/](node_modules)[\\/]/,
                    chunks: 'initial',
                    name: 'libs', //chunks name
                    priority: 10, //优先级
                    enforce: true,
                },
                laya: {
                    //node_modules里的代码
                    test: /[\\/](libs)[\\/]/,
                    chunks: 'initial',
                    name: 'laya', //chunks name
                    priority: 10, //优先级
                    enforce: true,
                },
            },
        },
    },
};

module.exports = (env, argv) => {
    let result;
    let common = common_config(argv.mode);

    if (CheckError) {
        common.module.rules[0].use = {
            loader: 'ts-loader',
        };
    }
    if (argv.mode === 'development') {
        result = { ...common, ...dev_config };
    } else {
        common.module.rules[0].use.splice(1, 0, {
            loader: 'babel-loader',
        });
        result = { ...common, ...prod_config };
    }
    return result;
};
