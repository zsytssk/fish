'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const findParam = require('./script/findEnv');

const ENV = findParam('ENV');
const CheckError = findParam('CheckError');
const common_config = {
    entry: ['./test/test.ts', './src/main.ts'],
    output: {
        filename: 'js/bundle.js',
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
    ],
};

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
    entry: ['./src/main.ts'],
};

module.exports = (env, argv) => {
    let result;
    if (argv.mode === 'development') {
        result = { ...common_config, ...dev_config };
    } else {
        common_config.module.rules[0].use.splice(1, 0, {
            loader: 'babel-loader',
        });
        result = { ...common_config, ...prod_config };
    }
    return result;
};
