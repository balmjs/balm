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
var StartTask = /** @class */ (function (_super) {
    __extends(StartTask, _super);
    function StartTask() {
        return _super.call(this, 'start') || this;
    }
    StartTask.prototype.fn = function (cb) {
        console.time(BalmJS.TIME_FLAG);
        if (BalmJS.utils.isFunction(BalmJS.beforeTask)) {
            BalmJS.beforeTask();
        }
        cb();
    };
    return StartTask;
}(BalmJS.BalmTask));
exports.default = StartTask;
