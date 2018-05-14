module.exports = {
  entry: {
    'vendor-a': ['jquery'],
    'vendor-b': ['lodash'],
    'vendor-c': ['moment'],
    main: './src/scripts/vendor-main.js'
  },
  optimization: {
    splitChunks: {
      maxInitialRequests: 4
    }
  }
};
