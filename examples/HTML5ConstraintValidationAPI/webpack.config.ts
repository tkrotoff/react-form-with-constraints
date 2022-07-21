import * as path from 'node:path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './App.tsx',

  output: {
    path: path.resolve('build')
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.html$/, type: 'asset/resource', generator: { filename: '[name][ext]' } }
    ]
  }
};

export default config;
