import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'
import mkcert from 'vite-plugin-mkcert'
import legacy from '@vitejs/plugin-legacy'
import babel from '@rollup/plugin-babel'

export default defineConfig({
  root: './src/',
  base: './',
  envDir: resolve(__dirname),
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: true,
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: resolve(__dirname, './auto-import.d.ts'),
      eslintrc: {
        enabled: true,
      },
    }),
    visualizer(),
    compression({
      threshold: 1024 * 500,
      ext: '.gz',
      deleteOriginFile: false,
    }),
    mkcert(),
    legacy({
      targets: ['ios >= 9', 'android >= 4.2', 'chrome > 30', '> 1%'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    hmr: true,
    port: 5173,
  },
  build: {
    target: 'es2015',
    outDir: resolve(__dirname, 'build'),
    assetsInlineLimit: 4096,
    sourcemap: false,
    emptyOutDir: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      input: {
        entry: resolve(__dirname, 'src/index.html'),
        signin: resolve(__dirname, 'src/pages/signin/index.html'),
        debug: resolve(__dirname, 'src/pages/debug/index.html'),
      },
      output: {
        assetFileNames: 'assets/[name]-[hash].[ext]', // 静态资源
        chunkFileNames: 'js/[name]-[hash].js', // 代码分割中产生的 chunk
        entryFileNames: 'js/[name]-[hash].js', // 指定 chunks 的入口文件
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return id
              .toString()
              .split('node_modules/')[1]
              .split('/')[0]
              .toString() // 拆分多个 vendors
          }
        },
      },
      plugins: [
        babel({
          presets: [['@babel/preset-env', { targets: '> 0.01%, not dead' }]],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
          include: ['src/**/*'],
          exclude: [
            '**/node_modules/**',
            'src/assets/**',
            '**/*.scss',
            '**/*.css',
          ],
        }),
      ],
    },
  },
})
