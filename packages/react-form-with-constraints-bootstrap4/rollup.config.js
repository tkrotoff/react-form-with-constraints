// @ts-check

import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';

const isProd = process.env.NODE_ENV === 'production';

function outputFileName() {
  let fileName = `react-form-with-constraints-bootstrap4.${process.env.NODE_ENV}`;
  fileName += isProd ? '.min.js' : '.js';
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
      clean: true,
      tsconfig: 'tsconfig.lib-es5.json',
      tsconfigOverride: { compilerOptions: { module: 'esnext' } }
    }),

    isProd && uglify(),

    filesize()
  ]
};
