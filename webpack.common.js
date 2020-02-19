const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

let FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

// define webpack plugins
const cleanDist = new CleanWebpackPlugin(['dist']);

const extractCss = new MiniCssExtractPlugin({
    filename: devMode ? '[name].css' : '[name].[contenthash].css',
    chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css'
});

const PUBLIC_PATH = 'https://bilalucar.com';
const themeColor = '#4a90e2';
const bgColor = '#ffffff';

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
    title: 'Bilal Uçar - Front End Developer | JavaScript | Angular',
    meta: {
        description: "Angular, React, JavaScript, SCSS, Ionic, Firebase gibi teknolojileri kullanıyorum. Front End alanında kendimi geliştirmeye çalışıyorum.",
        author: "Bilal Uçar"
    },
    themeColor,
    PUBLIC_PATH,
    preCache: {
        cacheId: 'website-cache-id',
        dontCacheBustUrlsMatching: /\.\w{8}\./,
        filename: 'service-worker.js',
        minify: true,
        navigateFallback: `${PUBLIC_PATH}index.html`,
        staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    },
    manifest: {
        name: "Bilal Uçar - Fron End Developer",
        short_name: "Bilal Uçar",
        description: 'Give us a description',
        background_color: bgColor,
        theme_color: themeColor,
        'theme-color': themeColor,
        start_url: PUBLIC_PATH,
        icons: [
            {
                src: path.resolve('src/images/icons/icon-512x512.png'),
                sizes: [72, 96, 128, 144, 152, 192, 384, 512],
                destination: path.join('assets', 'icons'),
            },
        ],
    },
};

const templateConfig = {
    index: {
        filename: 'index.html',
        template: './src/view/index.html',
    },
    portfolyo: {
        filename: 'portfolyo/index.html',
        template: './src/view/portfolyo/index.html',
    },
    testinium: {
        filename: 'portfolyo/testinium.html',
        template: './src/view/portfolyo/testinium.html',
    },
    teknovol: {
        filename: 'portfolyo/teknovol.html',
        template: './src/view/portfolyo/teknovol.html',
    },
    sdu: {
        filename: 'portfolyo/sdu.html',
        template: './src/view/portfolyo/sdu.html',
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
        },{
            from: './src/.htaccess',
            to: '.htaccess',
            toType: 'file'
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
        }),
        new SWPrecacheWebpackPlugin(defaultHtmlWebPackOptions.preCache),
        new WebpackPwaManifest(defaultHtmlWebPackOptions.manifest),
        new WorkboxWebpackPlugin.InjectManifest({
            swSrc: "./src/src-sw.js",
            swDest: "service-worker.js"
        }),
        new FaviconsWebpackPlugin('./src/images/logo.jpg')
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
