module.exports = {
    presets: ['@babel/preset-env'],
    plugins: [
        [
            '@babel/plugin-transform-runtime',
            {
                corejs: 3,
                helpers: true,
                regenerator: true,
                useESModules: false,
            },
        ],
        ['@babel/plugin-transform-modules-commonjs'],
    ],
};
