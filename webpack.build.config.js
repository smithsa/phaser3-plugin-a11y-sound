'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const SoundA11yPlugin = require("./src/plugin/main");

module.exports = {
    mode: 'production',
    watch: false,
    context: `${__dirname}/src/plugin/`,
    entry: {
      SoundA11yPlugin: './main.js',
      'SoundA11yPlugin.min': './main.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'SoundA11yPlugin',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.js$/, // Check for all js files
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }]
        }]
    },
    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ]
    },
    devtool: 'source-map',
    target: ['web', 'es5']
};
