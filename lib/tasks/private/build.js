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
var BuildTask = /** @class */ (function (_super) {
    __extends(BuildTask, _super);
    function BuildTask() {
        var _this = _super.call(this, 'build') || this;
        _this.fn = function () {
            _this.init();
            return _this.src.pipe($.size({
                title: _this.name,
                gzip: true
            }));
        };
        _this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.dest.base);
        return _this;
    }
    return BuildTask;
}(BalmJS.BalmTask));
exports.default = BuildTask;
