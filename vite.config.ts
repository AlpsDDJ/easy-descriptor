import {defineConfig} from 'vite'
import {resolve} from 'path'
import dts from 'vite-plugin-dts';

const entryFileName = 'index'

export default defineConfig({
    build: {
        // emptyOutDir: false, // 默认为true，这将导致拷贝过来的文件被删除
        lib: {
            entry: resolve(__dirname, `src/${entryFileName}.ts`),
            name: 'EzDescriptor',
            formats: ['es', 'umd'],
            fileName: (format, entryName) => `${entryName}.${format}.js`,
        },
        rollupOptions: {
            external: ['lodash', 'lodash-es', 'axios'],
            output: {
                globals: {
                    'axios': 'axios',
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
            include: ['./src'],
        })
    ],
})
