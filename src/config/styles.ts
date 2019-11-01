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
const minified = false;
const atImportPaths: string[] = [];
/**
 * Cssnano optimisations
 *
 * @reference https://cssnano.co/guides/optimisations/
 */
const options: object = {
  safe: true,
  autoprefixer: false,
  discardComments: {
    removeAll: true
  }
};
/**
 * LibSass options
 *
 * @reference https://github.com/sass/node-sass#options
 */
const sassOptions: object = {};
/**
 * Less plugin for Gulp
 *
 * @reference https://github.com/gulp-community/gulp-less#options
 */
const lessOptions: object = {};
/**
 * PostCSS Preset Env
 *
 * @reference https://github.com/csstools/postcss-preset-env#options
 */
const postcssEnvOptions: object = {
  stage: 0,
  autoprefixer: {
    flexbox: 'no-2009'
  }
};
/**
 * PostCSS plugins
 *
 * @reference https://www.postcss.parts/
 */
const postcssPlugins: object[] = [];
/**
 * PostCSS loader for webpack
 *
 * @reference https://github.com/postcss/postcss-loader#options
 */
const postcssLoaderOptions: PostcssLoaderOptions = {
  sourceMap: false
};
// CSS Sprites
const imageBasePath = '../'; // Relative to css file
const sprites: string[] = []; // Image folders
const spriteParams: object = {};
const spriteRetina = false;

export default {
  extname,
  minified,
  atImportPaths,
  options,
  sassOptions,
  lessOptions,
  postcssEnvOptions,
  postcssPlugins,
  postcssLoaderOptions,
  imageBasePath,
  sprites,
  spriteParams,
  spriteRetina
};
