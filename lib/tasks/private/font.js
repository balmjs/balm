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
var FontTask = /** @class */ (function (_super) {
    __extends(FontTask, _super);
    function FontTask() {
        var _this = _super.call(this, 'font') || this;
        _this.fn = function () {
            _this.init();
            return _this.src.pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
        _this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.src.font, '*.{eot,svg,ttf,woff,woff2}');
        _this.defaultOutput = BalmJS.config.dest.font;
        return _this;
    }
    return FontTask;
}(BalmJS.BalmTask));
exports.default = FontTask;
