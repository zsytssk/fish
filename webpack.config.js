'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { ENV, CheckError } = process.env;

const common_config = mode => ({
    entry: ['./test/test.ts', './src/main.ts'],
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
        alias: { crypto: 'crypto-browserify' },
        fallback: {
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify/'),
            util: false,
        },
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

if (CheckError) {
    common_config.module.rules[0].use = {
        loader: 'ts-loader',
    };
}

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
        port: 3000,
        open: true,
        openPage: 'http://localhost:3000',
    },
};

const prod_config = {
    entry: {
        bundle: './src/main.ts',
    },
    target: ['web', 'es5'],
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
    if (argv.mode === 'development') {
        result = { ...common, ...dev_config };
    } else {
        common.module.rules[0].use.splice(0, 0, {
            loader: 'babel-loader',
        });
        result = { ...common, ...prod_config };
    }
    return result;
};
