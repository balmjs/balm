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
var ZipTask = /** @class */ (function (_super) {
    __extends(ZipTask, _super);
    function ZipTask() {
        var _this = _super.call(this, 'zip') || this;
        _this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.dest.base);
        _this.defaultOutput = '.';
        return _this;
    }
    ZipTask.prototype.recipe = function (input, output, filename) {
        var _this = this;
        if (filename === void 0) { filename = 'archive.zip'; }
        return function () {
            _this.init(input, output);
            return _this.src
                .pipe($.zip(filename))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    ZipTask.prototype.fn = function (cb) {
        cb();
    };
    return ZipTask;
}(BalmJS.BalmTask));
exports.default = ZipTask;
