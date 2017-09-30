import * as path from 'path';
import { Configuration, optimize } from 'webpack';
const ZopfliPlugin = require('zopfli-webpack-plugin');

const __PROD__ = process.env.NODE_ENV === 'production';

function outputFileName() {
  let fileName = `react-form-with-constraints.${process.env.NODE_ENV}`;
  fileName += __PROD__ ? '.min.js' : '.js';
  return fileName;
}

const config: Configuration = {
  entry: './src/index.ts',

  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFileName(),
    library: 'ReactFormWithConstraints',
    libraryTarget: 'umd'
  },

  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes'
  },

  devtool: 'source-map',

  // See https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172
  plugins: (() => {
    const plugins = [
      // "webpack -p" already uses DefinePlugin and UglifyJsPlugin

      // See What is flat bundling and why is Rollup better at this than Webpack? https://stackoverflow.com/q/43219030
      //
      // Results for react-form-with-constraints.js (no minification and no compression):
      // - Rollup v0.50.0: 31 299 bytes
      // - Webpack v3.6.0: 42 740 bytes
      //
      // Results for react-form-with-constraints.production.min.js (UglifyJS):
      // - Rollup v0.50.0: 13 385 bytes
      // - Webpack v3.6.0: 18 827 bytes
      //
      // Results for react-form-with-constraints.production.min.js.gz (UglifyJS + Zopfli):
      // - Rollup v0.50.0: 3 408 bytes
      // - Webpack v3.6.0: 3 729 bytes
      new optimize.ModuleConcatenationPlugin()
    ];

    // See https://github.com/webpack-contrib/compression-webpack-plugin/issues/76
    if (__PROD__) plugins.push(new ZopfliPlugin());

    return plugins;
  })(),

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
