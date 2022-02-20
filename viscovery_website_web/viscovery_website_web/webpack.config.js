"use strict"

const path                      = require("path")
const autoprefixer              = require("autoprefixer")
const webpack                   = require("webpack")
const ExtractTextPlugin         = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin         = require("html-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const fs                        = require("fs")

const base = '/'

module.exports = (env) => {
  try {
    env.production = env.production || false
  } catch(e) {
    env = { production: false }
  }
  process.env.NODE_ENV = env.production ? "production" : "development"

  let config = {
    entry: {
      "index"   : ["./src/index.js"],
      "news"    : ["./src/news.js"],
      "article" : ["./src/article.js"],
      "about"   : ["./src/about.js"],
      "core"    : ["./src/core.js"],
      "solution": ["./src/components/solution/SolutionSubMenu.js", "./src/components/solution/VisualBanner.js", "./src/components/solution/SlickArea.js"],
      "commons" : ["./src/device.js", "./src/assets/sass/styles", "slick-carousel/slick/slick.scss", "pixi.js", "./src/components/commons/Header.js", "fetch-polyfill"]
    },
    output: {
      // libraryTarget: "umd",
      path: path.join(__dirname, "dist"),
      filename: "scripts/[name].js",
      publicPath: "",
      chunkFilename: "scripts/[name].chunk.js"
      // chunkFilename: "[name].[hash].js"
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        // filename: "vender.js",
        minChunks: Infinity,
        // chunks: ["index", "news", "about", "core", "commons"]
      }),
      new webpack.DefinePlugin({
        // 將 Environment Variables - 環境變數傳入
        "process.env.NODE_ENV": JSON.stringify(env.production ? "production" : "development")
      }),
      new ExtractTextPlugin({
        filename: "css/styles.css",
        allChunks: true,
        disable: false
      }),
      new webpack.LoaderOptionsPlugin({
        debug: env.production ? false : true,
        options: {
          context: __dirname,
          postcss: [
            autoprefixer({ browsers: ["last 2 versions", "iOS 7", "ie 6-9", "> 0%"], remove: false })
          ],
          sassLoader: {
            includePaths: [
              path.resolve(__dirname, "./src/assets/sass")
            ]
          }
        }
      }),
      ////////////// index
      new HtmlWebpackPlugin({
        chunks: ["commons", "index"],
        filename: 'index.zh-hans.html',
        template: "./src/ejs/zh-hans/view/index.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "index"],
        filename: 'index.zh-hant.html',
        template: "./src/ejs/zh-hant/view/index.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "index"],
        filename: 'index.en.html',
        template: "./src/ejs/en/view/index.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Core Technology
      new HtmlWebpackPlugin({
        chunks: ["commons", "core"],
        filename: 'core.zh-hans.html',
        template: "./src/ejs/zh-hans/view/core.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "core"],
        filename: 'core.zh-hant.html',
        template: "./src/ejs/zh-hant/view/core.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "core"],
        filename: 'core.en.html',
        template: "./src/ejs/en/view/core.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Solution
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution.zh-hans.html',
        template: "./src/ejs/zh-hans/view/solution.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution.zh-hant.html',
        template: "./src/ejs/zh-hant/view/solution.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution.en.html',
        template: "./src/ejs/en/view/solution.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Solution02
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution02.zh-hans.html',
        template: "./src/ejs/zh-hans/view/solution02.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution02.zh-hant.html',
        template: "./src/ejs/zh-hant/view/solution02.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution02.en.html',
        template: "./src/ejs/en/view/solution02.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Solution03
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution03.zh-hans.html',
        template: "./src/ejs/zh-hans/view/solution03.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution03.zh-hant.html',
        template: "./src/ejs/zh-hant/view/solution03.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution03.en.html',
        template: "./src/ejs/en/view/solution03.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Solution04
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution04.zh-hans.html',
        template: "./src/ejs/zh-hans/view/solution04.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution04.zh-hant.html',
        template: "./src/ejs/zh-hant/view/solution04.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution04.en.html',
        template: "./src/ejs/en/view/solution04.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// Solution05
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution05.zh-hans.html',
        template: "./src/ejs/zh-hans/view/solution05.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution05.zh-hant.html',
        template: "./src/ejs/zh-hant/view/solution05.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "solution"],
        filename: 'solution05.en.html',
        template: "./src/ejs/en/view/solution05.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// News
      new HtmlWebpackPlugin({
        chunks: ["commons", "news"],
        filename: 'news.zh-hans.html',
        template: "./src/ejs/zh-hans/view/news.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "news"],
        filename: 'news.zh-hant.html',
        template: "./src/ejs/zh-hant/view/news.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "news"],
        filename: 'news.en.html',
        template: "./src/ejs/en/view/news.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// News Article
      new HtmlWebpackPlugin({
        chunks: ["commons", "article"],
        filename: 'news-article.zh-hans.html',
        template: "./src/ejs/zh-hans/view/news-article.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "article"],
        filename: 'news-article.zh-hant.html',
        template: "./src/ejs/zh-hant/view/news-article.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "article"],
        filename: 'news-article.en.html',
        template: "./src/ejs/en/view/news-article.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      ////////////// About Us
      new HtmlWebpackPlugin({
        chunks: ["commons", "about"],
        filename: 'about.zh-hans.html',
        template: "./src/ejs/zh-hans/view/about.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "about"],
        filename: 'about.zh-hant.html',
        template: "./src/ejs/zh-hant/view/about.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "about"],
        filename: 'about.en.html',
        template: "./src/ejs/en/view/about.ejs",
        inject: "body",
        hash: true,
        alwaysWriteToDisk: true,
        base: base
      }),

      new HtmlWebpackHarddiskPlugin(
        env.production ? null : { outputPath: path.resolve(__dirname, 'src/tmp') }
      )
    ],
    module: {
      rules: [
        { test: /\.ejs$/, loader: 'ejs-loader' },
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [["es2015", {"modules": false}], "stage-0", "react"],
                plugins: ["babel-plugin-transform-decorators-legacy", "react-hot-loader/babel"],
                env: {
                  development: {
                    presets: []
                  }
                }
              }
            }
          ],
          exclude: /(node_modules|bower_components)/,
          include: [ path.join(__dirname, "src"), path.join(__dirname, "lib") ]
        }, {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: 'css-loader',
                options: { url: false, minimize: true }
              },
              "postcss-loader",
              "sass-loader",
            ]
          })
        }, {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
                name: "[path][name].[ext]",
                context: "./src/assets",
              }
            }, {
              loader: "img-loader",
              options: {
                minimize: true,
                optimizationLevel: 5,
                progressive: true
              }
            }
          ]
        }, {
          test: /\.json$/,
          use: [
            "json-loader"
          ]
        }
      ]
    },
    resolve: {
      modules: [
        "node_modules",
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "lib")
      ],
      extensions: [".js", "json", ".jsx", ".css", ".scss", ".ts", ".tsx"]
    }
  }


  if(env.production) {
    config.plugins.unshift(
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          warnings    : false,
          dead_code   : true,
          drop_console: true
        }
      })
    )
  } else {
    config.plugins.unshift(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  return config
}
