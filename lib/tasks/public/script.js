"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_1 = __importDefault(require("../../bundler"));
var ScriptTask = /** @class */ (function (_super) {
    __extends(ScriptTask, _super);
    function ScriptTask() {
        return _super.call(this, 'script') || this;
    }
    ScriptTask.prototype.recipe = function (input, output, customOptions) {
        var _this = this;
        if (customOptions === void 0) { customOptions = {}; }
        return function (cb) {
            var isHook = !!input;
            _this.init(input || BalmJS.config.scripts.entry, output);
            BalmJS.webpackCompiler = webpack(bundler_1.default(_this.input, _this.output, customOptions, isHook), function (err, stats) {
                // Handle errors here
                // if (err) {
                //   BalmJS.logger.error(`${this.name} task`, err.stack || err);
                //   if (err.details) {
                //     BalmJS.logger.error(`${this.name} task`, err.details);
                //   }
                //   return;
                // }
                if (BalmJS.config.logs.level <= BalmJS.LogLevel.Info) {
                    console.log(stats.toString(BalmJS.config.scripts.stats));
                }
                // Done processing
                cb();
            });
        };
    };
    Object.defineProperty(ScriptTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return ScriptTask;
}(BalmJS.BalmTask));
exports.default = ScriptTask;
