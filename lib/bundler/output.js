"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../config/constants");
function getOutput(output, scripts, isHook) {
    if (isHook === void 0) { isHook = false; }
    var outputPath = output || BalmJS.config.dest.base; // Absolute path
    var jsFolder = BalmJS.config.paths.target.js;
    var jsFilename = scripts.inject
        ? "[name]." + constants_1.INJECT_HASHNAME + ".js"
        : '[name].js';
    var chunkFilename = '[id]';
    if (BalmJS.config.env.isProd) {
        if (scripts.inject) {
            chunkFilename = "[name]." + constants_1.INJECT_HASHNAME;
        }
        else if (BalmJS.config.assets.cache) {
            chunkFilename = '[name].[chunkhash:8]';
        }
        else {
            chunkFilename = '[name].chunk';
        }
    }
    var jsChunkFilename = chunkFilename + ".js";
    BalmJS.logger.debug('webpack output', "Path: " + BalmJS.file.absPath(outputPath));
    return {
        path: BalmJS.file.absPath(outputPath),
        filename: isHook
            ? jsFilename
            : BalmJS.file.assetsPath(jsFolder + "/" + jsFilename),
        publicPath: BalmJS.file.publicPath,
        library: scripts.library,
        libraryTarget: scripts.libraryTarget,
        chunkFilename: isHook
            ? jsChunkFilename
            : BalmJS.file.assetsPath(jsFolder + "/" + constants_1.ASYNC_SCRIPTS + "/" + jsChunkFilename)
    };
}
exports.default = getOutput;
