import * as path from 'path';

module.exports = {
  entry: {
    // Examples
    'examples/MDN_Form_validation/App': './examples/MDN_Form_validation/App.tsx',
    'examples/moduscreate/App': './examples/moduscreate/App.jsx',
    'examples/NativeFormWidgets/App': './examples/NativeFormWidgets/App.tsx',
    'examples/password/App': './examples/password/App.tsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

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
