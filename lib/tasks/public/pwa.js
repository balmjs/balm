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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var workbox_build_1 = __importDefault(require("workbox-build"));
var PwaTask = /** @class */ (function (_super) {
    __extends(PwaTask, _super);
    function PwaTask() {
        return _super.call(this, 'pwa') || this;
    }
    PwaTask.prototype.recipe = function (customMode, customOptions) {
        var _this = this;
        if (customOptions === void 0) { customOptions = {}; }
        return function (cb) { return __awaiter(_this, void 0, void 0, function () {
            var mode, globDirectory, swSrc, swDest, options, valid;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        mode = customMode || BalmJS.config.pwa.mode;
                        globDirectory = BalmJS.config.dest.base;
                        swSrc = BalmJS.file.absPath(BalmJS.config.roots.source + "/" + BalmJS.config.pwa.swSrcFilename);
                        swDest = BalmJS.file.absPath(globDirectory + "/" + BalmJS.config.pwa.swDestFilename);
                        options = {};
                        valid = true;
                        switch (mode) {
                            // For basic
                            case 'generateSW':
                                options = Object.assign({
                                    swDest: swDest,
                                    importWorkboxFrom: 'disabled',
                                    importScripts: ['workbox-sw.js'],
                                    globDirectory: globDirectory
                                }, BalmJS.config.pwa.options, customOptions);
                                break;
                            // For advanced
                            case 'injectManifest':
                                options = Object.assign({
                                    swSrc: swSrc,
                                    swDest: swDest,
                                    globDirectory: globDirectory
                                }, BalmJS.config.pwa.options, customOptions);
                                break;
                            default:
                                valid = false;
                        }
                        if (!valid) return [3 /*break*/, 2];
                        BalmJS.logger.debug("pwa - " + mode, options);
                        return [4 /*yield*/, workbox_build_1.default[mode](options)
                                .then(function (result) {
                                BalmJS.logger.info("pwa - " + mode, "Generated '" + swDest + "', which will precache " + result.count + " files, totaling " + result.size + " bytes");
                            })
                                .catch(function (error) {
                                BalmJS.logger.warn("pwa - " + mode, "Service worker generation failed: " + error);
                            })];
                    case 1:
                        _a.sent();
                        cb();
                        return [3 /*break*/, 3];
                    case 2:
                        BalmJS.logger.warn('pwa task', 'Invalid PWA mode');
                        cb();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
    };
    Object.defineProperty(PwaTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return PwaTask;
}(BalmJS.BalmTask));
exports.default = PwaTask;
