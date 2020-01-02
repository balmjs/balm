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
var LessTask = /** @class */ (function (_super) {
    __extends(LessTask, _super);
    function LessTask() {
        return _super.call(this, 'less') || this;
    }
    Object.defineProperty(LessTask.prototype, "options", {
        get: function () {
            return Object.assign({
                paths: BalmJS.file.stylePaths
            }, BalmJS.config.styles.lessOptions, this.customOptions);
        },
        enumerable: true,
        configurable: true
    });
    LessTask.prototype.recipe = function (input, output, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return function () {
            _this.init(input, output, options);
            return _this.handleStyle(_this.name, _this.output, _this.options);
        };
    };
    Object.defineProperty(LessTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return LessTask;
}(BalmJS.BalmStyleTask));
exports.default = LessTask;
