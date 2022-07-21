// @ts-check

import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

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
    globals: {
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },

  external: ['react', 'prop-types'],

  plugins: [
    typescript({
      clean: true,
      tsconfig: 'tsconfig.dist.json',
      tsconfigOverride: { compilerOptions: { removeComments: true } }
    }),

    isProd && terser()
  ]
};
