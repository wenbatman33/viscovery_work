const webpack = require('webpack');
const path = require('path');

const NODE_ENV = process.env.NODE_ENV || 'development';
const VERSION_NUMBER = process.env.VERSION_NUMBER;
const VDS_HOST = process.env.VDS_HOST || 'http://localhost:1337';
const SIO_HOST = process.env.VDS_HOST || 'http://localhost:5000';
const STATIC_HOST = process.env.STATIC_HOST || VDS_HOST;


const app = [
  './src/js/app/index.js',
];

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(NODE_ENV),
      VERSION_NUMBER: JSON.stringify(VERSION_NUMBER),
      VDS_HOST: JSON.stringify(VDS_HOST),
      SIO_HOST: JSON.stringify(SIO_HOST),
      STATIC_HOST: JSON.stringify(STATIC_HOST),
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.bundle.js',
  }),
];

module.exports = {
  entry: {
    app,
    vendor: [
      'react',
      'video.js',
      'jquery',
      'react-dom',
      'react-css-modules',
      'react-router',
      'react-router-redux',
      'react-select-plus',
      'react-redux',
      'react-i18next',
      'redux-thunk',
      'whatwg-fetch',
      'socket.io-client',
      'ramda',
      'rxjs',
      'lodash',
      'moment',
      'qhistory',
      'qs',
    ],
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static'),
    publicPath: '/static/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            'es2015',
            'react',
            'stage-0',
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve(__dirname, 'src/js/core/styles'),
              ],
            },
          },
        ],
      },
      {
        test: /\.eot$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|ico|svg|gif)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
      vidya: `${__dirname}/src/js/core/components`,
      utils: `${__dirname}/src/js/utils`,
      shared: `${__dirname}/src/js/shared`,
    },
    extensions: ['.js', '.scss', '.css'],
  },
};
