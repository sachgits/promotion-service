const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  bail: true,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        enforce: 'pre',
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: 'babel-loader',
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new UglifyJsPlugin({
      uglifyOptions: {
        ie8: false,
        ecma: 6,
        output: {
          comments: false,
          beautify: false,
        },
      }
    })
  ],
  externals: [
    {
      angular: 'angular',
      'tw-styleguide-components/dist/js/styleguide-components': {
        var: "''",
        commonjs: 'tw-styleguide-components/dist/js/styleguide-components',
        commonjs2: 'tw-styleguide-components/dist/js/styleguide-components'
      }
    }
  ]
};
