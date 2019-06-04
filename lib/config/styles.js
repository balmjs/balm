const STYLE_CONFIG = {
  /**
   * Main style extension: 'css|scss|less'
   * @type {String}
   */
  ext: 'css',
  /**
   * Optimisations
   * @type {Object}
   *
   * https://cssnano.co/optimisations/
   */
  options: {
    safe: true,
    discardComments: {
      removeAll: true
    }
  },
  includePaths: [],
  postcssEnvOptions: {
    stage: 0,
    autoprefixer: {
      flexbox: 'no-2009'
    }
  },
  postcssPlugins: [],
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
