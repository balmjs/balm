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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ExtraTask = /** @class */ (function (_super) {
    __extends(ExtraTask, _super);
    function ExtraTask() {
        var _this = _super.call(this, 'extra') || this;
        _this.fn = function () {
            _this.init();
            _this.gulpSrcOptions = {
                dot: true
            };
            return _this.src.pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
        var includeGlobs = [];
        if (BalmJS.config.extras.includes.length) {
            for (var _i = 0, _a = BalmJS.config.extras.includes; _i < _a.length; _i++) {
                var filename = _a[_i];
                includeGlobs.push(path.join(BalmJS.config.src.base, filename));
            }
        }
        var excludeGlobs = [];
        if (BalmJS.config.extras.excludes.length) {
            for (var _b = 0, _c = BalmJS.config.extras.excludes; _b < _c.length; _b++) {
                var filename = _c[_b];
                excludeGlobs.push(path.join("!" + BalmJS.config.src.base, filename));
            }
        }
        var defaultGlobs = __spreadArrays([
            path.join(BalmJS.config.src.base, '*.*'),
            path.join("!" + BalmJS.config.src.base, '*.html'),
            path.join("!" + BalmJS.config.src.base, BalmJS.config.pwa.manifest)
        ], includeGlobs, excludeGlobs);
        _this.defaultInput = defaultGlobs;
        _this.defaultOutput = BalmJS.config.dest.base;
        return _this;
    }
    return ExtraTask;
}(BalmJS.BalmTask));
exports.default = ExtraTask;
