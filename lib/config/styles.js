const STYLE_CONFIG = {
  /**
   * Main style extension: 'css|scss|less'
   * @type {String}
   */
  ext: 'css',
  /**
   * Parse CSS and add vendor prefixes to rules by Can I Use
   * @type {Array}
   *
   * https://github.com/ai/browserslist#queries
   */
  autoprefixer: ['last 1 version'],
  /**
   * Optimisations
   * @type {Object}
   *
   * http://cssnano.co/optimisations/
   */
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

export default STYLE_CONFIG;
