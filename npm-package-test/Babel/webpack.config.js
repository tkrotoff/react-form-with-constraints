const path = require('path');
const optimize = require('webpack').optimize;

module.exports = {
  entry: {
    'App': './App.jsx',

    'react-form-with-constraints': 'react-form-with-constraints',
    react: ['react', 'prop-types', 'react-dom']
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  plugins: [
    new optimize.CommonsChunkPlugin({names: ['react-form-with-constraints', 'react']})
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader', options: {presets: ['react']} },
      { test: /\.html$/, loader: 'file-loader', options: {name: '[path][name].[ext]'} }
    ]
  }
};
