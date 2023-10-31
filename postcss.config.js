export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': {
    //   rootValue: 37.5,
    //   propList: ['*'],
    // },
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 2560,
      viewportHeight: 1200,
      exclude: [/node_modules/],
      viewportUnit: 'vmax',
    },
  },
}
