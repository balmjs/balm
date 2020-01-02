"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_merge_1 = __importDefault(require("webpack-merge"));
var common_1 = __importDefault(require("./common"));
function getDevConfig(scripts) {
    return webpack_merge_1.default(common_1.default(scripts), {
        mode: 'development',
        plugins: [
            // This is necessary to emit hot updates
            new webpack.HotModuleReplacementPlugin()
        ],
        devtool: 'cheap-module-eval-source-map'
    });
}
exports.default = getDevConfig;
