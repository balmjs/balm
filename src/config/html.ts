/**
 * HTMLMinifier options
 * @type {Object}
 *
 * https://github.com/kangax/html-minifier#options-quick-reference
 */
const options: object = {
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
};

export default {
  options
};
