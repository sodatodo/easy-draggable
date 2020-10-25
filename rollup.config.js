import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const input = 'src/index.ts';
const output = {
    dir: 'dist/',
    name: '[name].[ext]',
    format: 'esm'
};
const plugins = [
    typescript(),
    resolve(),
    commonjs(),
];

export default {
    input,
    output,
    plugins,
}
