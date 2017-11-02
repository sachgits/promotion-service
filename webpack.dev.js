const path = require('path');
const webpack = require('webpack');

const demoFileName = 'demo';

module.exports = {
  entry: {
    [demoFileName]: './demo/index.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    publicPath: '/dist/',
    port: 1666,
  },
};
