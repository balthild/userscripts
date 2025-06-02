import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import svgr from '@svgr/rollup';
import { defineConfig } from 'citlali';

export default defineConfig({
    entrypoints: [
        'src/**/*.user.ts',
        'src/**/*.user.tsx',
        // 'bili*.user.scss',
    ],

    rollup: {
        plugins: [
            resolve(),
            svgr({
                babel: false,
                jsxRuntime: 'automatic',
            }),
            babel({
                presets: ['solid'],
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
                babelHelpers: 'bundled',
                generatorOpts: {
                    importAttributesKeyword: 'with',
                },
            }),
        ],
    },
});
