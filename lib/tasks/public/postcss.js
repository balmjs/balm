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
var PostcssTask = /** @class */ (function (_super) {
    __extends(PostcssTask, _super);
    function PostcssTask() {
        return _super.call(this, 'postcss') || this;
    }
    PostcssTask.prototype.recipe = function (input, output) {
        var _this = this;
        return function () {
            _this.init(input, output);
            return _this.handleStyle(_this.name, _this.output);
        };
    };
    Object.defineProperty(PostcssTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return PostcssTask;
}(BalmJS.BalmStyleTask));
exports.default = PostcssTask;
