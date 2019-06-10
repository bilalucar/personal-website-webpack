const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const devMode = process.env.NODE_ENV !== 'production';

// define webpack plugins
const cleanDist = new CleanWebpackPlugin(['dist']);

const extractCss = new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
});

const defaultHtmlWebPackOptions = {
    inject: false,
    minify: !devMode ? {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true,
        removeComments: true,
        preserveLineBreaks: false,
        processScripts: ['application/ld+json'],
        minifyJS: true
    } : false,
    title: 'Bilal Uçar - Front End Developer.',
    meta: {
        'description': ''
    }
};

const templateConfig = {
    index: {
        filename: 'index.html',
        template: './src/view/index.html',
    }
};

const htmlFilesToProcess = Object.values(templateConfig).map(value => new HtmlWebpackPlugin(Object.assign(defaultHtmlWebPackOptions, value)));

const config = {
    entry: {
        main: './src/index.js'
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        cleanDist,
        extractCss,
        ...htmlFilesToProcess,
        new CopyWebpackPlugin([{
            from: './src/images/',
            to: 'images',
            toType: 'dir'
        },{
            from: './src/assets/',
            to: 'assets',
            toType: 'dir'
        }]),
        new ImageminPlugin({
            disable: devMode,
            pngquant: {
                quality: '90-95'
            }
        }),
        new ImageminPlugin({
            disable: devMode,
            minFileSize: 100000, // Only apply this one to files over 10kb
            jpegtran: { progressive: true },
            optimizationLevel: 6
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
        })
    ],
    resolve: {
        extensions: ['.js'],
        alias: {
            // due to animations full version of jquery should be used
            // 'jquery': 'jquery/dist/jquery.slim.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/transform-runtime']
                    }
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    // postcss is here for compiling bootstrap from sass files, no other purposes for now
                    {
                        loader: 'postcss-loader', // Run post css actions
                        options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }
            }
        ]
    },
    output: {
        filename: '[name].[contenthash:12].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        library: 'Personal'
    },
    target: 'web'
};

module.exports = config;
