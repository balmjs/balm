"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var extname = 'css';
var minified = false;
var atImportPaths = [];
/**
 * Cssnano optimisations
 *
 * @reference https://cssnano.co/guides/optimisations/
 */
var options = {
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
var sassOptions = {};
/**
 * Less plugin for Gulp
 *
 * @reference https://github.com/gulp-community/gulp-less#options
 */
var lessOptions = {};
/**
 * PostCSS Preset Env
 *
 * @reference https://github.com/csstools/postcss-preset-env#options
 */
var postcssEnvOptions = {
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
var postcssPlugins = [];
/**
 * PostCSS loader for webpack
 *
 * @reference https://github.com/postcss/postcss-loader#options
 */
var postcssLoaderOptions = {
    sourceMap: false
};
// CSS Sprites
var imageBasePath = '../'; // Relative to css file
var sprites = []; // Image folders
var spriteRetina = false;
/**
 * Spritesmith parameters
 * @reference https://github.com/twolfson/gulp.spritesmith#spritesmithparams
 */
var spriteParams = {};
exports.default = {
    extname: extname,
    minified: minified,
    atImportPaths: atImportPaths,
    options: options,
    sassOptions: sassOptions,
    lessOptions: lessOptions,
    postcssEnvOptions: postcssEnvOptions,
    postcssPlugins: postcssPlugins,
    postcssLoaderOptions: postcssLoaderOptions,
    imageBasePath: imageBasePath,
    sprites: sprites,
    spriteRetina: spriteRetina,
    spriteParams: spriteParams
};
