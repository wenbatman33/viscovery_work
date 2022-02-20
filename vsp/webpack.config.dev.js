const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.base');

const DashboardPlugin = require('webpack-dashboard/plugin');

const app = [
  'react-hot-loader/patch',
  'webpack/hot/only-dev-server',
];

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new DashboardPlugin(),
];

module.exports = merge.smart(
  {
    entry: {
      app,
    },
  },
  baseConfig,
  {
    plugins,
    devServer: {
      hot: true,
      contentBase: './',
    },
  }
);
