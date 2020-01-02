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
var UrlTask = /** @class */ (function (_super) {
    __extends(UrlTask, _super);
    function UrlTask() {
        var _this = _super.call(this, 'url') || this;
        _this.defaultOutput = BalmJS.config.dest.css;
        _this.defaultInput = BalmJS.file.matchAllFiles(_this.defaultOutput, '*.css');
        return _this;
    }
    UrlTask.prototype._urlProcessing = function (type) {
        var pattern = BalmJS.config.paths.source[type]
            .split('/')
            .pop();
        var pathSrc = new RegExp("\\.{2}/" + pattern + "/", 'g');
        var pathDest = "../" + BalmJS.config.paths.target[type] + "/";
        BalmJS.logger.debug(this.name + " task", {
            regex: pathSrc,
            replacement: pathDest
        }, {
            pre: true
        });
        return $.replace(pathSrc, pathDest);
    };
    UrlTask.prototype.recipe = function (input, output) {
        var _this = this;
        return function () {
            _this.init(input, output);
            return _this.src
                .pipe(_this._urlProcessing('img'))
                .pipe(_this._urlProcessing('font'))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    Object.defineProperty(UrlTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return UrlTask;
}(BalmJS.BalmTask));
exports.default = UrlTask;
