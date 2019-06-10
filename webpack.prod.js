const path = require('path');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require('./webpack.common.js');
const HtmlCriticalWebpackPlugin = require("html-critical-webpack-plugin");

const critical = new HtmlCriticalWebpackPlugin({
    base: path.resolve(__dirname, 'dist'),
    src: 'index.html',
    dest: 'index.html',
    inline: true,
    minify: false,
    extract: false,
    width: 450,
    height: 900,
    penthouse: {
        blockJSRequests: false,
    }
});

const optimiseCssAssets = new OptimizeCssAssetsPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano'),
    cssProcessorOptions: {
        parser: require("postcss-safe-parser"),
        discardComments: { removeAll: true }
    },
    canPrint: true
});

const optimizeJs = new UglifyJSPlugin({
    uglifyOptions: {
        output: {
            comments: false
        }
    }
});

module.exports = merge(config, {
    mode: 'production',
    plugins: [
        optimiseCssAssets,
        optimizeJs,
        critical
    ]
});
