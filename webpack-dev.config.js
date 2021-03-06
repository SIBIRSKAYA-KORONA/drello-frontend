const webpack = require('webpack');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const address = require('ip').address;

const IP_ADDRESS = address();
const {LABEL_COLORS} = require('./public/js/config');

module.exports = {
    mode: 'development',
    entry: ['@babel/polyfill', path.resolve(__dirname, 'public/js/index.js')],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/dist'),
    },
    resolve: {
        extensions: ['.js'],
    },

    devServer: {
        port: 5555,
        https: true,
        host: IP_ADDRESS,
        key: fs.readFileSync(path.resolve(__dirname, 'server/credentials/test.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'server/credentials/test.crt')),
        setup: (app) => {
            app.use(morgan('dev'));
        },

        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        contentBase: [path.resolve(__dirname, 'public')],

    },
    devtool: 'source-map',

    module: {
        rules: [{
            test: /\.tmpl\.xml$/,
            use: [{loader: 'fest-webpack-loader'}],
        }, {
            test: /\.sass$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: true,
                        reloadAll: true,
                    },
                },
                'css-loader',
                'sass-loader',
            ],
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                },
            },
        }],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new webpack.DefinePlugin({
            'IP_ADDRESS': JSON.stringify(IP_ADDRESS + ':8080'),
            'LABEL_COLORS': JSON.stringify(LABEL_COLORS),
        }),
        // new CleanWebpackPlugin(),
        new ServiceWorkerWebpackPlugin({
            entry: path.join(__dirname, 'public/js/sw.js'),
        }),
    ],
}
;
