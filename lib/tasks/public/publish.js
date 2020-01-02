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
var PublishTask = /** @class */ (function (_super) {
    __extends(PublishTask, _super);
    function PublishTask() {
        var _this = _super.call(this, 'publish') || this;
        _this.defaultInput = [
            BalmJS.file.matchAllFiles(BalmJS.config.dest.static),
            path.join("!" + BalmJS.config.dest.base, '*.*') // HTML
        ];
        _this.defaultOutput = BalmJS.config.assets.static; // Remote dir
        return _this;
    }
    PublishTask.prototype._release = function (input, output, renameOptions) {
        if (renameOptions === void 0) { renameOptions = {}; }
        if (input && output) {
            this.init(path.join(BalmJS.config.dest.base, input), path.join(BalmJS.config.assets.root, output) // Remote dir
            );
        }
        else {
            this.init();
        }
        this.src
            .pipe($.if(!BalmJS.utils.isArray(this.input), BalmJS.plugins.rename(renameOptions)))
            .pipe(gulp.dest(this.output)); // Absolute path
    };
    PublishTask.prototype.recipe = function (input, output, renameOptions) {
        var _this = this;
        return function (cb) {
            if (BalmJS.config.env.isProd) {
                if (BalmJS.utils.isArray(input)) {
                    input.forEach(function (template) {
                        _this._release(template.input, template.output, template.renameOptions);
                    });
                }
                else {
                    _this._release(input, output, renameOptions);
                }
            }
            else {
                BalmJS.logger.warn(_this.name + " task", '`mix.publish()` is only supported for production');
            }
            cb();
        };
    };
    PublishTask.prototype.fn = function (cb) {
        cb();
    };
    return PublishTask;
}(BalmJS.BalmTask));
exports.default = PublishTask;
