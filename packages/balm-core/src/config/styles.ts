const extname = 'css';
const minify = false;
const atImportPaths: string[] = [];
const entry: string | string[] = '';
/**
 * Cssnano optimisations
 *
 * @reference https://cssnano.co/docs/optimisations/
 */
const options: object = {
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
  autoprefixer: {
    flexbox: 'no-2009'
  },
  stage: 3
};
/**
 * PostCSS plugins
 *
 * @reference https://www.postcss.parts/
 */
const postcssPlugins: object[] = [];
// CSS Sprites
const imageBasePath = '../'; // Relative to css file
const sprites: string[] = []; // Image folders
const spriteRetina = false;
/**
 * Spritesmith parameters
 * @reference https://github.com/twolfson/gulp.spritesmith#spritesmithparams
 */
const spriteParams: object = {};

export default {
  extname,
  minify,
  atImportPaths,
  entry,
  options,
  sassOptions,
  lessOptions,
  postcssEnvOptions,
  postcssPlugins,
  imageBasePath,
  sprites,
  spriteRetina,
  spriteParams
};
