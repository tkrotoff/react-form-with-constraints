import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: {
    App: './App.tsx'
  },

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

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
      { test: /\.html$/, loader: 'file-loader', options: { name: '[name].[ext]' } }
    ]
  }
};

export = config;
