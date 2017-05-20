import * as path from 'path';
import { optimize } from 'webpack';

module.exports = {
  entry: {
    'examples/MDN_Form_validation/App': './examples/MDN_Form_validation/App.tsx',
    'examples/moduscreate/App': './examples/moduscreate/App.jsx',
    'examples/NativeFormWidgets/App': './examples/NativeFormWidgets/App.tsx',
    'examples/password/App': './examples/password/App.tsx',

    'react-form-with-constraints': ['./src/FormWithConstraints.tsx', './src/Bootstrap4Helpers.tsx'],

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
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', options: {compilerOptions: {declaration: false}} },
      { test: /\.jsx?$/, loader: 'babel-loader', options: {presets: ['react']} }
    ]
  }
};
