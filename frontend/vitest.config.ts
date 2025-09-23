/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
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
});