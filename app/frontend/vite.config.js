import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/components'),
      },
      { find: '@constant', replacement: resolve(__dirname, 'src/constant') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@images', replacement: resolve(__dirname, 'src/images') },
      {
        find: '@styleLayouts',
        replacement: resolve(__dirname, 'src/styles/layouts'),
      },
      {
        find: '@styleViews',
        replacement: resolve(__dirname, 'src/styles/views'),
      },
      { find: '@redux', replacement: resolve(__dirname, 'src/redux') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  preprocessorOptions: {
    scss: {
      quietDeps: true,
      api: 'modern-compiler',
    },
  },
  server: {
    host: '0.0.0.0',
    https: false,
    port: process.env.VITE_FE_PORT,
  },
  define: {
    __PAGE_TITLE__: JSON.stringify('METIS'),
  },
  build: {
    outDir: 'build',
    commonjsOptions: {
      include: ['node_modules/**'],
      exclude: ['node_modules/process-es6/**'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'staticFrontend/js/[name].[hash].js',
      },
    },
  },
});
