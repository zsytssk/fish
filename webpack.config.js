/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.env.ENV;
console.log(`test:>`, ENV);
const common_config = (mode) => ({
    entry: {
        bundle: ['./test/test.ts', './src/main.ts'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.join(__dirname, 'bin'),
        environment: {
            arrowFunction: false,
            bigIntLiteral: false,
            const: false,
            destructuring: false,
            dynamicImport: false,
            forOf: false,
            module: false,
        },
    },
    resolve: {
        modules: [
            path.resolve('./node_modules'),
            path.resolve('./library'),
            path.resolve('./libs'),
        ],
        alias: {
            '@app': path.resolve(__dirname, './src'),
        },
        extensions: ['.ts', '.js', '.cjs', '.json'],
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.js|\.cjs)$/,
                exclude: [/\bcore-js\b/],
                use:
                    mode === 'development'
                        ? [
                              {
                                  loader: 'thread-loader',
                              },
                              {
                                  loader: 'ts-loader',
                                  options: {
                                      happyPackMode: true,
                                  },
                              },
                          ]
                        : [
                              {
                                  loader: 'thread-loader',
                              },

                              {
                                  loader: 'babel-loader',
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
        new HtmlWebpackPlugin({
            hash: true,
            // inject: mode === 'development',
            inject: false,
            title: 'HonorMe',
            template: 'public/index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: __dirname + '/public',
                    to: __dirname + '/bin',
                    globOptions: {
                        ignore: ['**/index.html'],
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
        allowedHosts: 'all',
        host: '0.0.0.0',
        static: {
            directory: path.join(__dirname, 'bin'),
        },
        port: 5001,
        https: false,
        open: 'http://localhost:5001',
    },
};

const prod_config = {
    entry: {
        bundle: './src/main.ts',
    },

    optimization: {
        minimizer: [
            // 去除 LICENSE.txt files
            new TerserPlugin({
                extractComments: false,
            }),
        ],
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
                    //laya里的代码
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

    if (argv.mode === 'development') {
        result = { ...common, ...dev_config };
    } else {
        result = { ...common, ...prod_config };
    }
    return result;
};
