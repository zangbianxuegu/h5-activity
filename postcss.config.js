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
      viewportWidth: 2560,
      // viewportHeight: 1200,
      exclude: [/node_modules/],
      // vmax
      viewportUnit: 'vw',
      mediaQuery: true,
      selectorBlackList: ['.ps_ignore-'],
    },
  },
}
