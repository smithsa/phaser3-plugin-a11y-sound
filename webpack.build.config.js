'use strict';
const TerserPlugin = require('terser-webpack-plugin');
const path = require("path");

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
        rules: [
          {
            test: /\.js$/,
            include: path.resolve(__dirname, 'dist/'),
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
    },
    optimization: {
      usedExports: true,
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            output: {
              comments: false,
            }
          },
        }),
      ]
    },
    devtool: 'source-map',
    target: ['web', 'es5']
};
