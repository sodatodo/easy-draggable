// import json from '@rollup/plugin-json';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const input = 'src/index.ts';
const output = {
  dir: 'dist/',
  name: '[name].[ext]',
  format: 'esm',
};

const extensions = ['.ts', '.tsx'];
const plugins = [
//   json(),
  resolve(),
  commonjs(),
  typescript({
    // babelHelpers: 'runtime',
  }),
  babel({
    extensions,
    exclude: 'node_modules/**',
    babelHelpers: 'runtime',
  }),
];

export default {
  input,
  output,
  plugins,
};
