const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

const UGLIFY_OPTIMIZE = new webpack.optimize.UglifyJsPlugin({
  compress: {
    // supresses warnings, usually from module minification
    warnings: false,
  },
});
const plugins = [
  UGLIFY_OPTIMIZE,
];

module.exports = merge.smart(baseConfig, {
  plugins,
});
