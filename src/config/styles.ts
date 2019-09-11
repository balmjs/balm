const ext = 'css';
/**
 * Optimisations
 * @type {Object}
 *
 * https://cssnano.co/guides/optimisations/
 */
const options: object = {
  safe: true,
  discardComments: {
    removeAll: true
  }
};
const includePaths: string[] = [];
const sassOptions: object = {};
const lessOptions: object = {};
const postcssEnvOptions: object = {
  stage: 0,
  autoprefixer: {
    flexbox: 'no-2009'
  }
};
const postcssPlugins: any[] = [];
// For `gulp-postcss` options
const postcssOptions: object = {};

export default {
  ext,
  options,
  includePaths,
  sassOptions,
  lessOptions,
  postcssEnvOptions,
  postcssPlugins,
  postcssOptions
};
