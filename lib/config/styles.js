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
   * https://cssnano.co/optimisations/
   */
  options: {
    safe: true,
    autoprefixer: false,
    discardComments: {
      removeAll: true
    }
  },
  includePaths: [],
  postcssPlugins: [],
  postcssEnvOptions: {
    stage: 0,
    autoprefixer: {
      flexbox: 'no-2009'
    }
  },
  // For `gulp-postcss` options
  postcssOptions: {},
  // For `postcss-loader` options
  postcssLoaderOptions: {
    exec: undefined,
    parser: undefined,
    syntax: undefined,
    stringifier: undefined,
    config: undefined,
    // NOTE: The same to `styles.postcssPlugins`. plugins: [],
    sourceMap: false
  }
};

export default STYLE_CONFIG;
