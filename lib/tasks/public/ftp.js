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
var FtpTask = /** @class */ (function (_super) {
    __extends(FtpTask, _super);
    function FtpTask() {
        return _super.call(this, 'ftp') || this;
    }
    Object.defineProperty(FtpTask.prototype, "options", {
        get: function () {
            return Object.assign({}, BalmJS.config.ftp.options, this.customOptions);
        },
        enumerable: true,
        configurable: true
    });
    FtpTask.prototype.recipe = function (localFiles, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function () {
            var taskName = _this.name + " task";
            _this.init(localFiles || BalmJS.watchFtpFile, null, options);
            if (_this.input) {
                if (!options.src) {
                    _this.gulpSrcOptions = {
                        base: '.'
                    };
                }
                var stream = _this.src;
                try {
                    stream = stream.pipe(BalmJS.plugins.sftp(_this.options));
                }
                catch (error) {
                    // Catch "throw"
                    BalmJS.logger.error(taskName, error.message);
                }
                return stream;
            }
            else {
                BalmJS.logger.warn(taskName, 'Invalid local files');
            }
        };
    };
    Object.defineProperty(FtpTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return FtpTask;
}(BalmJS.BalmTask));
exports.default = FtpTask;
