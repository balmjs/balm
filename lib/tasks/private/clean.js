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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var del_1 = __importDefault(require("del"));
var constants_1 = require("../../config/constants");
function unique(arr) {
    var obj = {};
    var result = [];
    for (var i = 0, len = arr.length; i < len; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true;
            result.push(arr[i].replace(/\\/g, '/')); // NOTE: compatible with windows for `del@5.x`
        }
    }
    return result;
}
var CleanTask = /** @class */ (function (_super) {
    __extends(CleanTask, _super);
    function CleanTask() {
        var _this = _super.call(this, 'clean') || this;
        _this.fn = function (cb) { return __awaiter(_this, void 0, void 0, function () {
            var taskName, directories, deletedPaths;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        taskName = this.name + " task";
                        directories = BalmJS.config.inFrontend
                            ? this.dirInFrontend
                            : this.dirInBackend;
                        if (BalmJS.config.env.isProd && !BalmJS.config.assets.root) {
                            BalmJS.logger.warn(taskName, 'remote root path is empty');
                        }
                        BalmJS.logger.debug(taskName, {
                            directories: directories
                        }, {
                            pre: true
                        });
                        return [4 /*yield*/, del_1.default(directories, { force: true })];
                    case 1:
                        deletedPaths = _a.sent();
                        BalmJS.logger.warn(taskName, {
                            deletedPaths: deletedPaths
                        }, {
                            pre: true
                        });
                        cb();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    CleanTask.prototype._getAssetsDir = function (rootKey) {
        if (rootKey === void 0) { rootKey = 'assets'; }
        return unique(constants_1.ASSETS_KEYS.map(function (assetKey) { return BalmJS.config[rootKey][assetKey]; }));
    };
    Object.defineProperty(CleanTask.prototype, "remoteRootDir", {
        get: function () {
            return BalmJS.config.assets.root.trim().length
                ? [BalmJS.config.assets.root]
                : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CleanTask.prototype, "remoteAppDir", {
        get: function () {
            return BalmJS.config.assets.subDir
                ? [BalmJS.config.assets.static]
                : this._getAssetsDir();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CleanTask.prototype, "dirInFrontend", {
        get: function () {
            var isLocal = !path.isAbsolute(BalmJS.config.assets.root);
            BalmJS.logger.info(this.name + " task", "'" + BalmJS.config.assets.root + "' is local directory: " + isLocal);
            return BalmJS.config.env.isProd
                ? __spreadArrays([
                    BalmJS.file.absPath(BalmJS.config.roots.target)
                ], (isLocal ? this.remoteRootDir : this.remoteAppDir)) : [BalmJS.file.absPath(BalmJS.config.roots.tmp)];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CleanTask.prototype, "dirInBackend", {
        get: function () {
            var hasBuildDir = BalmJS.config.assets.cache &&
                !!(BalmJS.config.assets.buildDir || BalmJS.config.assets.subDir);
            var buildDirInProd = hasBuildDir
                ? [BalmJS.config.dest.static]
                : [];
            var buildDirInDev = hasBuildDir
                ? [path.join(BalmJS.config.dest.static, BalmJS.config.assets.buildDir)] // NOTE: fix for `BalmJS.file.assetsSuffixPath` in development
                : [];
            return __spreadArrays((BalmJS.config.env.isProd && hasBuildDir
                ? buildDirInProd
                : __spreadArrays(buildDirInDev, this._getAssetsDir('dest'))));
        },
        enumerable: true,
        configurable: true
    });
    return CleanTask;
}(BalmJS.BalmTask));
exports.default = CleanTask;
