export default {
  ext: 'css', // Main style extension: 'css|scss|less'
  autoprefixer: ['last 1 version'],
  options: {
    safe: true,
    autoprefixer: false,
    sourcemap: false,
    discardComments: {
      removeAll: true
    }
  },
  includePaths: [],
  postcss: {
    plugins: [],
    // For `gulp-postcss` options
    options: {},
    // For `postcss-loader` options
    loaderOptions: {
      exec: undefined,
      parser: undefined,
      syntax: undefined,
      stringifier: undefined,
      config: undefined,
      // PostCSS Plugin: plugins: [], // The same to `styles.postcss.plugins`
      sourceMap: false
    }
  }
};
