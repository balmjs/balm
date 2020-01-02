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
var LintTask = /** @class */ (function (_super) {
    __extends(LintTask, _super);
    function LintTask() {
        var _this = _super.call(this, 'lint') || this;
        _this.fn = function () {
            _this.init();
            return _this.src
                .pipe($.eslint({ fix: true }))
                .pipe(server.reload({ stream: true, once: true }))
                .pipe($.eslint.format())
                .pipe($.if(!server.active, $.eslint.failAfterError()))
                .pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
        _this.defaultOutput = BalmJS.config.src.js;
        _this.defaultInput = BalmJS.file.matchAllFiles(_this.defaultOutput, '*.js');
        return _this;
    }
    return LintTask;
}(BalmJS.BalmTask));
exports.default = LintTask;
