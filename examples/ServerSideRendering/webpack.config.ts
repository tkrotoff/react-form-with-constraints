import * as path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

const output = {
  path: path.join(__dirname, 'build'),
  filename: '[name].js'
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const tsLoaderRule = { test: /\.tsx?$/, loader: 'ts-loader', options: {onlyCompileBundledFiles: true, compilerOptions: {noEmit: false, module: 'esnext', declaration: false}} };

const config: Configuration[] = [
  {
    entry: {
      server: './server.tsx'
    },

    // See How can I use webpack with express? https://stackoverflow.com/a/31655760/990356
    target: 'node',

    // See https://youtu.be/duhudXkHRf4?t=1062
    externals: [nodeExternals()],

    output,
    resolve: {extensions},
    module: {
      rules: [
        tsLoaderRule,
        { test: /\.(html|css|png)$/, loader: 'file-loader', options: {name: '[name].[ext]'} }
      ]
    }
  },

  {
    entry: {
      browser: './browser.tsx'
    },
    output,
    resolve: {extensions},
    module: {
      rules: [
        tsLoaderRule
      ]
    }
  }
];

export = config;
