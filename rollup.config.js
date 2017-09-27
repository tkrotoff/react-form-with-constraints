import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import gzip from 'rollup-plugin-gzip';

export default {
  input: './src/index.ts',
  output: {
    file: 'dist/react-form-with-constraints.production.min.js',
    name: 'ReactFormWithConstraints',
    format: 'umd',
    sourcemap: true
  },

  external: ['react', 'react-dom', 'prop-types'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    'prop-types': 'PropTypes'
  },

  plugins: [
    typescript({
      abortOnError: false,
      clean: true
    }),
    uglify(),
    gzip({
      algorithm: 'zopfli'
    })
  ]
};
