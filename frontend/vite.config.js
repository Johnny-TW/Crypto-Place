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

  // __dirname 這是 Node.js 的全域變數，代表目前檔案所在的目錄

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@constant': resolve(__dirname, 'src/constant'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@images': resolve(__dirname, 'src/images'),
      '@styleLayouts': resolve(__dirname, 'src/styles/layouts'),
      '@styleViews': resolve(__dirname, 'src/styles/views'),
      '@redux': resolve(__dirname, 'src/redux'),
      '@utils': resolve(__dirname, 'src/utils'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // 修復 Sass 棄用警告 - 使用現代編譯器 API
        silenceDeprecations: ['legacy-js-api'],
        quietDeps: true,
        api: 'modern-compiler',
      },
    },
    devSourcemap: true, // 開發模式下啟用 CSS source map
  },

  server: {
    host: '0.0.0.0',
    port: process.env.VITE_FE_PORT || 5173,
  },

  define: {
    __PAGE_TITLE__: JSON.stringify('METIS'),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },

  build: {
    outDir: 'build',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        entryFileNames: 'staticFrontend/js/[name].[hash].js',
        chunkFileNames: 'staticFrontend/js/[name].[hash].js',
        assetFileNames: 'staticFrontend/assets/[name].[hash].[ext]',
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['react-redux', 'redux', 'redux-saga', '@reduxjs/toolkit'],
          ui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
            '@mui/x-charts',
          ],
          utils: ['axios', 'lodash', 'js-cookie'],
        },
      },
    },
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lodash',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/x-charts',
    ],
  },

  preview: {
    port: process.env.VITE_PREVIEW_PORT || 4173,
    host: '0.0.0.0',
  },
});
