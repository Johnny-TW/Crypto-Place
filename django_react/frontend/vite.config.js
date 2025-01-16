import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    // viteCommonjs(),
    // html-webpack-plugin -> vite-plugin-html
    // 在 CRA 中使用 html-webpack-plugin 調整 HTML 文件，
    // vite 可以透過 vite-plugin-html 調整 HTML 文件
    // injectHtml({
    //     data: {
    //         htmlWebpackPlugin: {
    //             options: {
    //                 mayVar: 'variable',
    //             },
    //         },
    //     },
    // }),
  ],
  //  webpack.alias -> resolve.alias
  // CRA 中 alias 在 webpack 下，vite 在 resolve 下
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
      { find: '@components', replacement: resolve(__dirname, 'src/components') },
      { find: '@constant', replacement: resolve(__dirname, 'src/constant') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@images', replacement: resolve(__dirname, 'src/images') },
      { find: '@styleLaouts', replacement: resolve(__dirname, 'src/styles/layouts') },
      { find: '@styleViews', replacement: resolve(__dirname, 'src/styles/views') },
      { find: '@redux', replacement: resolve(__dirname, 'src/redux') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
    ],
  },
  // webpack.DefinePlugin -> define
  // 有時候會透過 webpack.DefinePlugin 去設定一些全域的 replacement，vite 也可以設定。
  server: {
    host: '0.0.0.0',
    https: false,
    port: process.env.VITE_FE_PORT,
    // http-proxy-middleware -> proxy
    // Cra 可以透過另外安裝套件 http-proxy-middleware
    // 來設置 proxy，vite 則是直接支援 proxy。
    // proxy: {
    //     '^/(api|cas|storage)/.*': {
    //         target: process.env.VITE_API_URL,
    //         changeOrigin: true,
    //     },
    // },
  },
  proxy: {
    '/api': {
      target: 'https://api.coingecko.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
  define: {
    __PAGE_TITLE__: JSON.stringify('METIS'),
  },
  build: {
    // 把輸出路徑設定成跟 CRA 相同的 `build/`
    outDir: 'build',
    // 在 vite 中，dev server 是不用額外配置多入口設定的，
    // 但 production build 還是 rollup 來完成，
    // 所以要另外設置 rollupOptions。
    commonjsOptions: {
      include: [
        'node_modules/**',
      ],
      exclude: [
        'node_modules/process-es6/**',
      ],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'staticFrontend/js/[name].[hash].js',
      },
    },
  },
});
