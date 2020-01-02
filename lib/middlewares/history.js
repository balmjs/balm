"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connect_history_api_fallback_1 = __importDefault(require("connect-history-api-fallback"));
function historyMiddleware() {
    var historyOptions = BalmJS.config.server.historyOptions;
    return historyOptions
        ? [
            BalmJS.utils.isObject(historyOptions)
                ? connect_history_api_fallback_1.default(historyOptions)
                : connect_history_api_fallback_1.default()
        ]
        : [];
}
exports.default = historyMiddleware;
