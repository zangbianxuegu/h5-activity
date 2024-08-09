export default {
  plugins: {
    // 必须放置在 tailwindcss 之前
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: (file) => {
        let designWidth = 2560
        if (file.indexOf('van') > 0) {
          designWidth = 1500
        }
        return designWidth
      },
      unitPrecision: 5, // 单位转换后保留的精度
      viewportUnit: 'vw',
      mediaQuery: true,
    },
  },
}
