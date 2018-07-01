// @ts-check

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    App: './index.js'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  plugins: [
    new MiniCssExtractPlugin({filename: '[name].css'})
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.js$/, loader: 'source-map-loader' },
      { test: /\.(html|css|png)$/, loader: 'file-loader', options: {name: '[path][name].[ext]'} },
      {
        // FIXME Don't know how to make source maps work
        // See SourceMap not working with Webpack 4.8.1 https://github.com/webpack-contrib/mini-css-extract-plugin/issues/141
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: {sourceMap: true} },
          { loader: 'sass-loader', options: {sourceMap: true} }
        ]
      }
    ]
  }
};
