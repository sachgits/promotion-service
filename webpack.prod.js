import webpack from 'webpack';
import path from 'path';

export default {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'promotion.service.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()],
};
