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
Object.defineProperty(exports, "__esModule", { value: true });
var JsminTask = /** @class */ (function (_super) {
    __extends(JsminTask, _super);
    function JsminTask() {
        return _super.call(this, 'jsmin') || this;
    }
    Object.defineProperty(JsminTask.prototype, "options", {
        get: function () {
            return Object.assign({}, BalmJS.config.scripts.options, this.customOptions);
        },
        enumerable: true,
        configurable: true
    });
    JsminTask.prototype.recipe = function (input, output, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function () {
            _this.init(input, output, options);
            var renameOptions = options.rename || { suffix: '.min' };
            return _this.src
                .pipe(BalmJS.plugins.jsmin(_this.options))
                .pipe(BalmJS.plugins.rename(renameOptions))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    JsminTask.prototype.fn = function (cb) {
        cb();
    };
    return JsminTask;
}(BalmJS.BalmTask));
exports.default = JsminTask;
