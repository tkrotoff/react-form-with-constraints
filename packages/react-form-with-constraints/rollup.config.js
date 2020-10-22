// @ts-check

import filesize from 'rollup-plugin-filesize';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';

const isProd = process.env.NODE_ENV === 'production';

function outputFileName() {
  let fileName = `react-form-with-constraints.${process.env.NODE_ENV}`;
  fileName += isProd ? '.min.js' : '.js';
  return fileName;
}

export default {
  input: './src/index.ts',
  output: {
    file: `dist/${outputFileName()}`,
    name: 'ReactFormWithConstraints',
    format: 'umd',
    sourcemap: true,
    globals: {
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },

  external: ['react', 'prop-types'],

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
