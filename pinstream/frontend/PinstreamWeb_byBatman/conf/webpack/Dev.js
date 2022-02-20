'use strict';

/**
 * Default dev server configuration.
 */
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBaseConfig = require('./Base');

const DashboardPlugin = require('webpack-dashboard/plugin');

class WebpackDevConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      devtool: 'cheap-module-source-map',
      entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://0.0.0.0:3000/',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './app.js'
      ],
      devServer: {
        publicPath: '/',
        historyApiFallback: true,
        hot: true,
        inline: true,
        port: 3000,
        overlay: {
          errors: true,
          warnings: false,
        },
      },
      plugins: [
        new DashboardPlugin({ port: 3001 }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
          template: 'index.html',
        })
      ]
    };
    this.config.output.publicPath = './';
  }
}

module.exports = WebpackDevConfig;
