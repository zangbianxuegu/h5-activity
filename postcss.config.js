export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // 'postcss-pxtorem': {
    //   rootValue: 37.5,
    //   propList: ['*'],
    // },
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 1624,
      viewportHeight: 761,
      exclude: [/node_modules/],
      viewportUnit: 'vmax',
    },
  },
}
