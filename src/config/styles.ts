interface PostcssLoaderOptions {
  exec?: boolean;
  parser?: string | object;
  syntax?: string | object;
  stringifier?: string | object;
  config?: object;
  plugins?: object[] | Function; // NOTE: The same to `styles.postcssPlugins`
  sourceMap: string | boolean;
}

const extname = 'css';
const atImportPaths: string[] = [];
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
const postcssPlugins: object[] = [];
// For `postcss-loader` options
const postcssLoaderOptions: PostcssLoaderOptions = {
  sourceMap: false
};
// CSS Sprites
const imageBasePath = '../'; // Relative to css file
const sprites: string[] = []; // Image folders
const spritePadding = 1;

export default {
  extname,
  atImportPaths,
  options,
  sassOptions,
  lessOptions,
  postcssEnvOptions,
  postcssPlugins,
  postcssLoaderOptions,
  imageBasePath,
  sprites,
  spritePadding
};
