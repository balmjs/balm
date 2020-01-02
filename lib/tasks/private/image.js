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
var ImageTask = /** @class */ (function (_super) {
    __extends(ImageTask, _super);
    function ImageTask() {
        var _this = _super.call(this, 'image') || this;
        _this.fn = function () {
            _this.init();
            return (gulp
                .src(BalmJS.file.absPaths(_this.input), {
                since: gulp.lastRun(BalmJS.toNamespace('image'))
            })
                // .pipe(
                //   BalmJS.plugins.plumber((error: any): void => {
                //     BalmJS.logger.error(`${this.name} task`, error.message);
                //   })
                // )
                .pipe($.imagemin())
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output))));
        };
        var excludeGlobs = [];
        for (var _i = 0, _a = BalmJS.config.styles.sprites; _i < _a.length; _i++) {
            var imageFolder = _a[_i];
            excludeGlobs.push(path.join("!" + BalmJS.config.src.img, imageFolder));
            excludeGlobs.push(path.join("!" + BalmJS.config.src.img, imageFolder, '*.png'));
        }
        _this.defaultInput = __spreadArrays([
            BalmJS.file.matchAllFiles(BalmJS.config.src.img)
        ], excludeGlobs);
        _this.defaultOutput = BalmJS.config.dest.img;
        return _this;
    }
    return ImageTask;
}(BalmJS.BalmTask));
exports.default = ImageTask;
