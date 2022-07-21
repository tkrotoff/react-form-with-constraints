import * as path from 'node:path';
import { Configuration } from 'webpack';

const output = {
  path: path.resolve('build')
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const babelLoaderRule = { test: /\.tsx?$/, loader: 'babel-loader' };

const config: Configuration[] = [
  {
    entry: { server: './server.tsx' },

    // [How can I use webpack with express?](https://stackoverflow.com/a/31655760/990356)
    target: 'node',

    output,
    resolve: { extensions },
    module: {
      rules: [
        babelLoaderRule,
        { test: /\.(html|css)$/, type: 'asset/resource', generator: { filename: '[name][ext]' } }
      ]
    }
  },

  {
    entry: { browser: './browser.tsx' },
    output,
    resolve: { extensions },
    module: {
      rules: [babelLoaderRule]
    }
  }
];

export default config;
