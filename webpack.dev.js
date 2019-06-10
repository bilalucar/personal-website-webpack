const path = require('path');
const merge = require('webpack-merge');
const config = require('./webpack.common.js');

module.exports = merge(config, {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        port: 9000,
        host: '0.0.0.0'
    }
});
