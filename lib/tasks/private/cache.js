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
var constants_1 = require("../../config/constants");
var CacheTask = /** @class */ (function (_super) {
    __extends(CacheTask, _super);
    function CacheTask() {
        var _this = _super.call(this, 'cache') || this;
        _this.fn = function () {
            _this.init();
            return _this.src
                .pipe($.revAll.revision(BalmJS.config.assets.options))
                .pipe($.if(/\.html$/, BalmJS.file.setPublicPath()))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)))
                .pipe($.revDeleteOriginal())
                .pipe($.revAll.manifestFile())
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
        var defaultIncludes = BalmJS.config.scripts.inject
            ? constants_1.ASSETS_KEYS.filter(function (assetKey) { return assetKey !== 'js'; }).map(function (assetKey) {
                return BalmJS.file.matchAllFiles(BalmJS.config.dest[assetKey]);
            })
            : constants_1.ASSETS_KEYS.map(function (assetKey) {
                return BalmJS.file.matchAllFiles(BalmJS.config.dest[assetKey]);
            });
        var defaultExcludes = [
            path.join("!" + BalmJS.config.dest.base, BalmJS.config.pwa.manifest),
            path.join("!" + BalmJS.config.dest.js, constants_1.ASYNC_SCRIPTS, '*'),
            path.join("!" + BalmJS.config.dest.js, constants_1.STATIC_ASSETS, '*')
        ];
        var customIncludes = BalmJS.config.assets.includes;
        var customExcludes = BalmJS.config.assets.excludes.map(function (filename) {
            return "!" + filename;
        });
        _this.defaultInput = __spreadArrays(defaultIncludes, defaultExcludes, (BalmJS.config.inFrontend
            ? [path.join(BalmJS.config.dest.base, '*.html')]
            : []), customIncludes, customExcludes);
        _this.defaultOutput = BalmJS.config.inFrontend
            ? BalmJS.config.dest.base
            : BalmJS.config.dest.static;
        return _this;
    }
    return CacheTask;
}(BalmJS.BalmTask));
exports.default = CacheTask;
