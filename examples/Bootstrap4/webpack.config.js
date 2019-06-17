// @ts-check

const path = require('path');
const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  entry: {
    App: './App.jsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader' },
      { test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.html$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [postcssPresetEnv],
              sourceMap: true
            }
          },
          { loader: 'sass-loader', options: { sourceMap: true } }
        ]
      }
    ]
  }
};
