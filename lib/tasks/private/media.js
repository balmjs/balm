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
var MediaTask = /** @class */ (function (_super) {
    __extends(MediaTask, _super);
    function MediaTask() {
        var _this = _super.call(this, 'media') || this;
        _this.fn = function () {
            _this.init();
            return _this.src.pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
        _this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.src.media);
        _this.defaultOutput = BalmJS.config.dest.media;
        return _this;
    }
    return MediaTask;
}(BalmJS.BalmTask));
exports.default = MediaTask;
