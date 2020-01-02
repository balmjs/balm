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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var maker_1 = __importDefault(require("./maker"));
var BaseHooks = /** @class */ (function () {
    function BaseHooks() {
    }
    Object.defineProperty(BaseHooks.prototype, "env", {
        get: function () {
            return BalmJS.config.env;
        },
        enumerable: true,
        configurable: true
    });
    // HTML
    BaseHooks.prototype.html = function (input, output) {
        maker_1.default.generate('html', [input, output]);
    };
    // Stylesheets
    BaseHooks.prototype.css = function (input, output) {
        maker_1.default.generate('postcss', [input, output]);
    };
    BaseHooks.prototype.sass = function (input, output, options) {
        maker_1.default.generate('sass', [input, output, options]);
    };
    BaseHooks.prototype.less = function (input, output, options) {
        maker_1.default.generate('less', [input, output, options]);
    };
    BaseHooks.prototype.url = function (input, output) {
        maker_1.default.generate('url', [input, output]);
    };
    // JavaScript
    BaseHooks.prototype.js = function (input, output, webpackOptions) {
        maker_1.default.generate('script', [input, output, webpackOptions]);
    };
    BaseHooks.prototype.jsmin = function (input, output, options) {
        maker_1.default.generate('jsmin', [input, output, options]);
    };
    // Files & Directories
    BaseHooks.prototype.copy = function (input, output, options) {
        maker_1.default.generate('copy', [input, output, options]);
    };
    BaseHooks.prototype.remove = function (paths) {
        maker_1.default.generate('remove', [paths]);
    };
    // Cache
    BaseHooks.prototype.version = function (input, output, assetsOptions) {
        maker_1.default.generate('version', [input, output, assetsOptions]);
    };
    // Server
    BaseHooks.prototype.serve = function (handler) {
        maker_1.default.generate('serve', [handler]);
    };
    return BaseHooks;
}());
var Hooks = /** @class */ (function (_super) {
    __extends(Hooks, _super);
    function Hooks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // Stylesheets
    Hooks.prototype.sprite = function (input, output, spriteOptions) {
        maker_1.default.generate('sprite', [input, output, spriteOptions]);
    };
    // Assets
    Hooks.prototype.publish = function (input, output, renameOptions) {
        maker_1.default.generate('publish', [input, output, renameOptions]);
    };
    Hooks.prototype.zip = function (input, output, filename) {
        if (input === void 0) { input = ''; }
        if (output === void 0) { output = ''; }
        if (filename === void 0) { filename = 'archive.zip'; }
        maker_1.default.generate('zip', [input, output, filename]);
    };
    Hooks.prototype.ftp = function (localFiles, options) {
        maker_1.default.generate('ftp', [localFiles, options]);
    };
    // PWA
    Hooks.prototype.generateSW = function (pwaOptions) {
        maker_1.default.generate('pwa', ['generateSW', pwaOptions]);
    };
    Hooks.prototype.injectManifest = function (pwaOptions) {
        maker_1.default.generate('pwa', ['injectManifest', pwaOptions]);
    };
    // Others
    Hooks.prototype.modernizr = function () {
        maker_1.default.generate('modernizr');
    };
    return Hooks;
}(BaseHooks));
exports.default = Hooks;
