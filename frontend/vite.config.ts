import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    server: {
      deps: {
        inline: [
          '@mui/x-charts',
          '@mui/material',
          '@emotion/react',
          '@emotion/styled',
        ],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
  },

  // __dirname 這是 Node.js 的全域變數，代表目前檔案所在的目錄
  // 在 ESM 模式下使用 import.meta.url 來獲取當前文件目錄

  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('./src', import.meta.url))),
      '@components': resolve(
        fileURLToPath(new URL('./src/components', import.meta.url))
      ),
      '@constant': resolve(
        fileURLToPath(new URL('./src/constant', import.meta.url))
      ),
      '@hooks': resolve(fileURLToPath(new URL('./src/hooks', import.meta.url))),
      '@images': resolve(
        fileURLToPath(new URL('./src/images', import.meta.url))
      ),
      '@styleLayouts': resolve(
        fileURLToPath(new URL('./src/styles/layouts', import.meta.url))
      ),
      '@styleViews': resolve(
        fileURLToPath(new URL('./src/styles/views', import.meta.url))
      ),
      '@redux': resolve(fileURLToPath(new URL('./src/redux', import.meta.url))),
      '@utils': resolve(fileURLToPath(new URL('./src/utils', import.meta.url))),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // 修復 Sass 棄用警告
        silenceDeprecations: ['legacy-js-api'],
        quietDeps: true,
      },
    },
    devSourcemap: true, // 開發模式下啟用 CSS source map
  },

  server: {
    host: '0.0.0.0',
    port: Number(process.env.VITE_FE_PORT) || 5173,
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
    port: Number(process.env.VITE_PREVIEW_PORT) || 4173,
    host: '0.0.0.0',
  },
});
