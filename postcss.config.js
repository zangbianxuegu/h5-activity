export default {
  plugins: {
    // 必须放置在 tailwindcss 之前
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': {
    //   rootValue: 37.5,
    //   propList: ['*'],
    // },
    'postcss-px-to-viewport-8-plugin': {
      // viewportWidth: 2560,
      // viewportHeight: 1200,
      viewportWidth: (file) => {
        let designWidth = 2560
        //van是375
        if (file.indexOf('van') > 0) {
          designWidth = 1500
        }
        return designWidth
      },
      // exclude: [/node_modules/],
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*'], // 能转化为vw的属性列表
      // vmax
      viewportUnit: 'vw',
      mediaQuery: true,
    },
  },
}
