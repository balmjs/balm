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
var DefaultTask = /** @class */ (function (_super) {
    __extends(DefaultTask, _super);
    function DefaultTask() {
        return _super.call(this, 'default') || this;
    }
    Object.defineProperty(DefaultTask.prototype, "startTask", {
        get: function () {
            var tasks = BalmJS.toNamespace(['start']);
            if (BalmJS.utils.isString(BalmJS.beforeTask)) {
                tasks.unshift(BalmJS.beforeTask);
            }
            return tasks;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultTask.prototype, "mainTasks", {
        get: function () {
            var tasks = __spreadArrays([
                'clean'
            ], (BalmJS.config.styles.sprites.length ? ['sprite'] : []), [
                'style'
            ], (BalmJS.config.scripts.lint ? ['lint'] : []), [
                'script',
                'html'
            ], (BalmJS.config.env.isProd || !BalmJS.config.inFrontend
                ? ['image', 'font', 'media']
                : []));
            if (BalmJS.config.env.isProd) {
                tasks = __spreadArrays(tasks, [
                    'extra',
                    'build'
                ], (BalmJS.config.assets.cache ? ['cache'] : []), (BalmJS.config.pwa.enabled ? ['workbox-sw', 'pwa'] : []));
            }
            else {
                tasks = __spreadArrays(tasks, ['modernizr', 'serve']);
            }
            return BalmJS.config.useDefaults
                ? BalmJS.toNamespace(tasks)
                : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultTask.prototype, "subTasks", {
        get: function () {
            return BalmJS.recipes.length
                ? BalmJS.toNamespace(BalmJS.recipes)
                : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultTask.prototype, "endTask", {
        get: function () {
            var tasks = BalmJS.toNamespace(['end']);
            if (BalmJS.utils.isString(BalmJS.afterTask)) {
                tasks.push(BalmJS.afterTask);
            }
            return tasks;
        },
        enumerable: true,
        configurable: true
    });
    return DefaultTask;
}(BalmJS.BalmTask));
exports.default = DefaultTask;
