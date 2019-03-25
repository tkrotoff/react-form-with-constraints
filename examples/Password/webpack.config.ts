import path from 'path';
import { Configuration } from 'webpack';

// FIXME See Type definitions for TypeScript https://github.com/aackerman/circular-dependency-plugin/issues/17
// @ts-ignore
import CircularDependencyPlugin from 'circular-dependency-plugin';

const config: Configuration = {
  entry: {
    App: './App.tsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  plugins: [
    new CircularDependencyPlugin({
      failOnError: true
    })
  ],

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          onlyCompileBundledFiles: true,
          compilerOptions: { noEmit: false, module: 'esnext', sourceMap: true }
        }
      },
      { test: /\.js$/, loader: 'source-map-loader' },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader', options: { sourceMap: true } },
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      },
      { test: /\.html$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } }
    ]
  }
};

export = config;
