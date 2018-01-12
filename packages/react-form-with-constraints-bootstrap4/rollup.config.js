// @ts-check

import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import gzip from 'rollup-plugin-gzip';
import filesize from 'rollup-plugin-filesize';

const __PROD__ = process.env.NODE_ENV === 'production';

function outputFileName() {
  let fileName = `react-form-with-constraints-bootstrap4.${process.env.NODE_ENV}`;
  fileName += __PROD__ ? '.min.js' : '.js';
  return fileName;
}

export default {
  input: './src/index.ts',
  output: {
    file: `dist/${outputFileName()}`,
    name: 'ReactFormWithConstraintsBootstrap4',
    format: 'umd',
    sourcemap: true,
    globals: {
      'react-form-with-constraints': 'ReactFormWithConstraints',
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },

  external: ['react-form-with-constraints', 'react', 'prop-types'],

  plugins: [
    typescript({
      abortOnError: false,
      clean: true,
      tsconfigOverride: {compilerOptions: {noEmit: false, module: 'esnext', declaration: false}}
    }),
    __PROD__ && uglify(),
    gzip({algorithm: 'zopfli'}),
    filesize()
  ]
};
