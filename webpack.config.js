var webpack = require('webpack');
var path = require('path');
let FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public/js');
var APP_DIR = path.resolve(__dirname, 'src/client/app');
process.traceDeprecation = true;

var config = {
  entry: APP_DIR + '/index.jsx', // Your appʼs entry point
  plugins: [
    new NpmInstallPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(),
    new FaviconsWebpackPlugin(path.resolve(APP_DIR, '../public/img/favicon.png'))
  ],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [APP_DIR],
        exclude: '/node_modules/',
        loader: `babel-loader`,
        options: {
          presets: ['es2015', 'react']
        }
      }, {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      }, {
        test: /\.css/,
        loaders: ['style-loader', 'css-loader']
      }
    ]
  }
};

module.exports = config;
