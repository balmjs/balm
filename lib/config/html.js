"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * HTMLMinifier options
 *
 * @reference https://github.com/kangax/html-minifier#options-quick-reference
 */
var options = {
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
exports.default = {
    options: options
};
