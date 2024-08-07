export default {
  plugins: {
    // 必须放置在 tailwindcss 之前
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 2560,
      exclude: [/node_modules/],
      unitPrecision: 5, // 单位转换后保留的精度
      viewportUnit: 'vw',
      mediaQuery: true,
      selectorBlackList: [/^\.van-/], // 添加.van-前缀的类名
    },
  },
}
