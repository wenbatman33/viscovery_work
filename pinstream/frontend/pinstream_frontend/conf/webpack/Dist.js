'use strict';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBaseConfig = require('./Base');

class WebpackDistConfig extends WebpackBaseConfig {

  constructor() {
    super();
    this.config = {
      cache: false,
      entry: [
        './app.js'
      ],
      plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new HtmlWebpackPlugin({
          template: 'index.html',
          filename: '../templates/reactindex.html',
          minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeRedundantAttributes: true,
            useShortDoctype: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            keepClosingSlash: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
          },
        }),
        //new webpack.NoErrorsPlugin()
      ]
    };
    this.config.output.publicPath = '../static/';
    // Deactivate hot-reloading if we run dist build on the dev server
    // this.config.devServer.hot = false;
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'production';
  }
}

module.exports = WebpackDistConfig;
