var webpack = require('webpack');
var path = require('path');

const demoFileName = 'demo';

module.exports = {
  entry: {
    [demoFileName]: './demo/index.js'
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        enforce: 'pre',
        use: 'eslint-loader'
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: 'babel-loader'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    publicPath: '/dist/',
    port: 1666
  }
};
