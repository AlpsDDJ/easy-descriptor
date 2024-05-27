import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
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
    copy({
      verbose: true,
      targets: [
        {
          src: './lib/main.ts',
          dest: './dist',
        }
      ]
    }),
  ]
})
