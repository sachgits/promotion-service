const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  bail: true,
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: '@transferwise/promotion-service',
    libraryTarget: 'umd',
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
      },
    ],
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
      },
    }),
  ],
  externals: [
    {
      angular: 'angular',
      'angular-cookies': {
        var: "'ngCookies'",
        commonjs: 'angular-cookies',
        commonjs2: 'angular-cookies',
      },
      'angular-sanitize': {
        var: "'ngSanitize'",
        commonjs: 'angular-sanitize',
        commonjs2: 'angular-sanitize',
      },
      'angular-translate': {
        var: "'pascalprecht.translate'",
        commonjs: 'angular-translate',
        commonjs2: 'angular-translate',
      },
      'angular-translate-interpolation-messageformat': {
        var: "''",
        commonjs: 'angular-translate-interpolation-messageformat',
        commonjs2: 'angular-translate-interpolation-messageformat',
      },

      underscore: '_',
      jquery: '$',

      unorm: {
        var: "''",
        commonjs: 'unorm',
        commonjs2: 'unorm',
      },

      '@transferwise/styleguide-components/js/styleguide-components': {
        var: "''",
        commonjs: '@transferwise/styleguide-components',
        commonjs2: '@transferwise/styleguide-components',
      },
      '@transferwise/frontend-common/dist/tw-common': {
        var: "''",
        commonjs: '@transferwise/frontend-common',
        commonjs2: '@transferwise/frontend-common',
      },
    },
  ],
};
