import {defineConfig} from 'vite'
import {resolve} from 'path'
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';

export default defineConfig({
    build: {
        emptyOutDir: false, // 默认为true，这将导致拷贝过来的文件被删除
        lib: {
            entry: resolve(__dirname, 'lib/main.ts'),
            name: 'EzDescriptor',
            fileName: 'easy-descriptor'
        },
        rollupOptions: {
            external: ['lodash', 'lodash-es'],
            output: {
                globals: {
                    'lodash': 'lodash',
                    'lodash-es': 'lodash-es'
                }
            }
        },
        outDir: "dist", // 打包后存放的目录文件
    },
    plugins: [
        dts({
            outDir: './dist',
            include: ['./lib/src/types/EasyDescriptorTypes.ts'],
        }),
        copy({
            verbose: true,
            targets: [
                // {
                //     src: './package.json',
                //     dest: './dist',
                // },
                // {
                //     src: './lib/types/index.d.ts',
                //     dest: './dist/types',
                // }
            ]
        }),
    ],
})
