import * as path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './src/index.ts',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-form-with-constraints.js',
    library: 'ReactFormWithConstraints',
    libraryTarget: 'umd'
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes'
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', options: {compilerOptions: {module: 'esnext', declaration: false}} }
    ]
  }
};

export = config;
