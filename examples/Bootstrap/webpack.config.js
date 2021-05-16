// @ts-check

const path = require('path');

/** @type import('webpack').Configuration */
const config = {
  entry: './App.jsx',

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
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
      { test: /\.html$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: { plugins: [['postcss-preset-env']] },
              sourceMap: true
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  }
};

module.exports = config;
