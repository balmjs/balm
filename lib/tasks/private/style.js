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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StyleTask = /** @class */ (function (_super) {
    __extends(StyleTask, _super);
    function StyleTask() {
        return _super.call(this, 'style') || this;
    }
    Object.defineProperty(StyleTask.prototype, "deps", {
        get: function () {
            return __spreadArrays([
                this.styleName
            ], (BalmJS.config.env.isProd || !BalmJS.config.inFrontend ? ['url'] : []));
        },
        enumerable: true,
        configurable: true
    });
    return StyleTask;
}(BalmJS.BalmTask));
exports.default = StyleTask;
