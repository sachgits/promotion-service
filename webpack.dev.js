import path from 'path';
import webpack from 'webpack';

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
        exclude: /node_modules/,
        use: 'babel-loader'
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'demo'),
    publicPath: '/dist/',
    port: 1666,
  },
};
