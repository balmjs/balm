const extname = 'css';
const includePaths: string[] = [];
/**
 * Optimisations
 * @type {Object}
 *
 * https://cssnano.co/guides/optimisations/
 */
const options: object = {
  safe: true,
  autoprefixer: false,
  discardComments: {
    removeAll: true
  }
};
const sassOptions: object = {};
const lessOptions: object = {};
const postcssEnvOptions: object = {
  stage: 0,
  autoprefixer: {
    flexbox: 'no-2009'
  }
};
const postcssPlugins: any[] = [];
// CSS Sprites
const basePath = '../'; // Relative to css file
const sprites: string[] = []; // Image folders
const spritePadding = 1;

export default {
  extname,
  options,
  includePaths,
  sassOptions,
  lessOptions,
  postcssEnvOptions,
  postcssPlugins,
  basePath,
  sprites,
  spritePadding
};
