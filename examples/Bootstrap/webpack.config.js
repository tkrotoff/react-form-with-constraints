// @ts-check

const path = require('node:path');

/** @type import('webpack').Configuration */
const config = {
  entry: './App.jsx',

  output: {
    path: path.resolve('build')
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // [Babel should not transpile core-js](https://github.com/zloirock/core-js/issues/514#issuecomment-476533317)
        exclude: /\/core-js/,
        loader: 'babel-loader'
      },
      { test: /\.html$/, type: 'asset/resource', generator: { filename: '[name][ext]' } },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: { postcssOptions: { plugins: [['postcss-preset-env']] } }
          },
          'sass-loader'
        ]
      }
    ]
  }
};

module.exports = config;
