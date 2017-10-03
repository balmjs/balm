const HTML_CONFIG = {
  /**
   * HTMLMinifier options
   * @type {Object}
   *
   * https://github.com/kangax/html-minifier#options-quick-reference
   */
  options: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: {
      compress: {
        drop_console: true
      }
    },
    processConditionalComments: true,
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true
  }
};

export default HTML_CONFIG;
