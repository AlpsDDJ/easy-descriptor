import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts';
// import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    emptyOutDir: false, // 默认为true，这将导致拷贝过来的文件被删除
    lib: {
      entry: './lib/main.ts',
      name: 'EzDescriptor',
      fileName: 'easy-descriptor'
    }
  },
  plugins: [
    dts({
      outDir: './dist',
      include: ['./lib'],
    }),
    // copy({
    //   verbose: true,
    //   targets: [
    //     {
    //       src: './lib/**/*.ts',
    //       dest: './dist',
    //     }
    //   ]
    // }),
  ]
})
