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
var VersionTask = /** @class */ (function (_super) {
    __extends(VersionTask, _super);
    function VersionTask() {
        var _this = _super.call(this, 'version') || this;
        _this.defaultOutput = BalmJS.config.dest.base;
        return _this;
    }
    Object.defineProperty(VersionTask.prototype, "options", {
        get: function () {
            return Object.assign({}, BalmJS.config.assets.options, this.customOptions);
        },
        enumerable: true,
        configurable: true
    });
    VersionTask.prototype.recipe = function (input, output, assetsOptions) {
        var _this = this;
        return function () {
            _this.init(input, output, {
                version: assetsOptions
            });
            return _this.src
                .pipe($.revAll.revision(_this.options))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)))
                .pipe($.revAll.versionFile())
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    VersionTask.prototype.fn = function (cb) {
        cb();
    };
    return VersionTask;
}(BalmJS.BalmTask));
exports.default = VersionTask;
