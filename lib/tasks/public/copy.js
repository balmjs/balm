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
var CopyTask = /** @class */ (function (_super) {
    __extends(CopyTask, _super);
    function CopyTask() {
        return _super.call(this, 'copy') || this;
    }
    CopyTask.prototype.recipe = function (input, output, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function () {
            _this.init(input, output, options);
            return _this.src
                .pipe(BalmJS.plugins.rename(_this.customOptions))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    CopyTask.prototype.fn = function (cb) {
        cb();
    };
    return CopyTask;
}(BalmJS.BalmTask));
exports.default = CopyTask;
