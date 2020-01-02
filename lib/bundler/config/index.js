"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dev_1 = __importDefault(require("./dev"));
var prod_1 = __importDefault(require("./prod"));
function getDefaultConfig(scripts) {
    return BalmJS.config.env.isProd || BalmJS.config.scripts.ie8
        ? prod_1.default(scripts)
        : dev_1.default(scripts);
}
exports.default = getDefaultConfig;
