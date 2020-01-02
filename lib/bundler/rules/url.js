"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../../config/constants");
var imageInlineSizeLimit = parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT || '10000');
function urlLoader() {
    var PATHNAME = BalmJS.config.paths.target.js + "/" + constants_1.STATIC_ASSETS + "/";
    var FILENAME = '[name].[hash:8].[ext]';
    var options = Object.assign({
        limit: imageInlineSizeLimit,
        name: BalmJS.file.assetsPath("" + PATHNAME + FILENAME)
    }, BalmJS.config.scripts.urlLoaderOptions);
    return [
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
            test: /\.(bmp|gif|jpe?g|png|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: options
        },
        {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: options
        },
        {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: options
        }
    ];
}
exports.default = urlLoader;
