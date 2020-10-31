import babel from '@rollup/plugin-babel';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
            // exports: 'named',
        },
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        }
    ],
    external: [
        'react'
    ],
    plugins: [
        typescript({
            typescript: require('typescript'),
            include: ['*.js+(|x)', '**/*.js+(|x)'],
            exclude: [
                'node_modules/**'
            ]
        }),
        babel({
            extensions: [
                ...DEFAULT_EXTENSIONS,
                '.ts',
                '.tsx'
            ],
            exclude: 'node_modules/**',
            babelHelpers: 'runtime'
        }),
        resolve(),
        commonjs(),
    ]
}
