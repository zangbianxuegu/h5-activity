// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "file:///D:/work/sky-activity/node_modules/.pnpm/vite@4.4.9_@types+node@20.6.2_sass@1.68.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/work/sky-activity/node_modules/.pnpm/@vitejs+plugin-vue@4.3.4_vite@4.4.9_vue@3.3.4/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/work/sky-activity/node_modules/.pnpm/unplugin-auto-import@0.16.6/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/work/sky-activity/node_modules/.pnpm/unplugin-vue-components@0.25.2_vue@3.3.4/node_modules/unplugin-vue-components/dist/vite.mjs";
import { VantResolver } from "file:///D:/work/sky-activity/node_modules/.pnpm/@vant+auto-import-resolver@1.0.1/node_modules/@vant/auto-import-resolver/dist/index.esm.mjs";
import { visualizer } from "file:///D:/work/sky-activity/node_modules/.pnpm/rollup-plugin-visualizer@5.9.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import compression from "file:///D:/work/sky-activity/node_modules/.pnpm/vite-plugin-compression@0.5.1_vite@4.4.9/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\work\\sky-activity";
var vite_config_default = defineConfig({
  root: "./src/",
  base: "./",
  envDir: resolve(__vite_injected_original_dirname),
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
      dts: true
    }),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: resolve(__vite_injected_original_dirname, "./auto-import.d.ts"),
      eslintrc: {
        enabled: true
      }
    }),
    visualizer(),
    compression({
      threshold: 1024 * 500,
      ext: ".gz",
      deleteOriginFile: false
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    hmr: true
  },
  build: {
    target: "es2015",
    outDir: resolve(__vite_injected_original_dirname, "build"),
    minify: "esbuild",
    assetsInlineLimit: 4096,
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        entry: resolve(__vite_injected_original_dirname, "src/index.html"),
        signin: resolve(__vite_injected_original_dirname, "src/pages/signin/index.html"),
        about: resolve(__vite_injected_original_dirname, "src/pages/about/index.html")
      },
      output: {
        assetFileNames: "assets/[name]-[hash].[ext]",
        // 静态资源
        chunkFileNames: "js/[name]-[hash].js",
        // 代码分割中产生的 chunk
        entryFileNames: "js/[name]-[hash].js",
        // 指定 chunks 的入口文件
        compact: true,
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrXFxcXHNreS1hY3Rpdml0eVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcd29ya1xcXFxza3ktYWN0aXZpdHlcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L3dvcmsvc2t5LWFjdGl2aXR5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBWYW50UmVzb2x2ZXIgfSBmcm9tICdAdmFudC9hdXRvLWltcG9ydC1yZXNvbHZlcidcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcidcclxuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ3ZpdGUtcGx1Z2luLWNvbXByZXNzaW9uJ1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByb290OiAnLi9zcmMvJyxcclxuICBiYXNlOiAnLi8nLFxyXG4gIGVudkRpcjogcmVzb2x2ZShfX2Rpcm5hbWUpLFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgQ29tcG9uZW50cyh7XHJcbiAgICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXSxcclxuICAgICAgZHRzOiB0cnVlLFxyXG4gICAgfSksXHJcbiAgICBBdXRvSW1wb3J0KHtcclxuICAgICAgaW1wb3J0czogWyd2dWUnLCAndnVlLXJvdXRlciddLFxyXG4gICAgICBkdHM6IHJlc29sdmUoX19kaXJuYW1lLCAnLi9hdXRvLWltcG9ydC5kLnRzJyksXHJcbiAgICAgIGVzbGludHJjOiB7XHJcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgdmlzdWFsaXplcigpLFxyXG4gICAgY29tcHJlc3Npb24oe1xyXG4gICAgICB0aHJlc2hvbGQ6IDEwMjQgKiA1MDAsXHJcbiAgICAgIGV4dDogJy5neicsXHJcbiAgICAgIGRlbGV0ZU9yaWdpbkZpbGU6IGZhbHNlLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgc2VydmVyOiB7XHJcbiAgICBobXI6IHRydWUsXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXMyMDE1JyxcclxuICAgIG91dERpcjogcmVzb2x2ZShfX2Rpcm5hbWUsICdidWlsZCcpLFxyXG4gICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICBhc3NldHNJbmxpbmVMaW1pdDogNDA5NixcclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXguaHRtbCcpLFxyXG4gICAgICAgIHNpZ25pbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcGFnZXMvc2lnbmluL2luZGV4Lmh0bWwnKSxcclxuICAgICAgICBhYm91dDogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvcGFnZXMvYWJvdXQvaW5kZXguaHRtbCcpLFxyXG4gICAgICB9LFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLltleHRdJywgLy8gXHU5NzU5XHU2MDAxXHU4RDQ0XHU2RTkwXHJcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJywgLy8gXHU0RUUzXHU3ODAxXHU1MjA2XHU1MjcyXHU0RTJEXHU0RUE3XHU3NTFGXHU3Njg0IGNodW5rXHJcbiAgICAgICAgZW50cnlGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJywgLy8gXHU2MzA3XHU1QjlBIGNodW5rcyBcdTc2ODRcdTUxNjVcdTUzRTNcdTY1ODdcdTRFRjZcclxuICAgICAgICBjb21wYWN0OiB0cnVlLFxyXG4gICAgICAgIG1hbnVhbENodW5rczogKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlkXHJcbiAgICAgICAgICAgICAgLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgICAuc3BsaXQoJ25vZGVfbW9kdWxlcy8nKVsxXVxyXG4gICAgICAgICAgICAgIC5zcGxpdCgnLycpWzBdXHJcbiAgICAgICAgICAgICAgLnRvU3RyaW5nKCkgLy8gXHU2MkM2XHU1MjA2XHU1OTFBXHU0RTJBIHZlbmRvcnNcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsZUFBZTtBQUM1USxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFDN0IsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxpQkFBaUI7QUFQeEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBLEVBQ04sTUFBTTtBQUFBLEVBQ04sUUFBUSxRQUFRLGdDQUFTO0FBQUEsRUFDekIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osV0FBVztBQUFBLE1BQ1QsV0FBVyxDQUFDLGFBQWEsQ0FBQztBQUFBLE1BQzFCLEtBQUs7QUFBQSxJQUNQLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxNQUNULFNBQVMsQ0FBQyxPQUFPLFlBQVk7QUFBQSxNQUM3QixLQUFLLFFBQVEsa0NBQVcsb0JBQW9CO0FBQUEsTUFDNUMsVUFBVTtBQUFBLFFBQ1IsU0FBUztBQUFBLE1BQ1g7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELFdBQVc7QUFBQSxJQUNYLFlBQVk7QUFBQSxNQUNWLFdBQVcsT0FBTztBQUFBLE1BQ2xCLEtBQUs7QUFBQSxNQUNMLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQy9CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sS0FBSztBQUFBLEVBQ1A7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVEsUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDbEMsUUFBUTtBQUFBLElBQ1IsbUJBQW1CO0FBQUEsSUFDbkIsV0FBVztBQUFBLElBQ1gsYUFBYTtBQUFBLElBQ2IsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsT0FBTyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLFFBQzFDLFFBQVEsUUFBUSxrQ0FBVyw2QkFBNkI7QUFBQSxRQUN4RCxPQUFPLFFBQVEsa0NBQVcsNEJBQTRCO0FBQUEsTUFDeEQ7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQTtBQUFBLFFBQ2hCLFNBQVM7QUFBQSxRQUNULGNBQWMsQ0FBQyxPQUFlO0FBQzVCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTyxHQUNKLFNBQVMsRUFDVCxNQUFNLGVBQWUsRUFBRSxDQUFDLEVBQ3hCLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFDWixTQUFTO0FBQUEsVUFDZDtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
