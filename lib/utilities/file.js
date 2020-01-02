"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var File = /** @class */ (function () {
    function File() {
    }
    Object.defineProperty(File.prototype, "stylePaths", {
        get: function () {
            return __spreadArrays([
                path.join(BalmJS.config.workspace, '.')
            ], BalmJS.config.styles.atImportPaths);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "publicPath", {
        get: function () {
            return BalmJS.config.env.isProd || BalmJS.config.assets.publicUrl === '/'
                ? BalmJS.config.assets.publicUrl
                : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "assetsSuffixPath", {
        get: function () {
            return !BalmJS.config.inFrontend &&
                BalmJS.config.env.isProd &&
                BalmJS.config.assets.cache // Back-end project in production with cache
                ? path.join(BalmJS.config.assets.subDir, BalmJS.config.assets.buildDir)
                : BalmJS.config.assets.subDir;
        },
        enumerable: true,
        configurable: true
    });
    File.prototype.absPath = function (_path) {
        return path.join(BalmJS.config.workspace, _path);
    };
    File.prototype.absPaths = function (_paths) {
        var paths;
        if (BalmJS.utils.isArray(_paths)) {
            paths = [];
            for (var _i = 0, _paths_1 = _paths; _i < _paths_1.length; _i++) {
                var _path = _paths_1[_i];
                var result = /^!(.+)$/.exec(_path);
                if (result) {
                    paths.push('!' + this.absPath(result[1]));
                }
                else {
                    paths.push(this.absPath(_path));
                }
            }
        }
        else {
            paths = this.absPath(_paths);
        }
        return paths;
    };
    File.prototype.matchAllFiles = function (_path, _file) {
        return path.join(_path, '**', _file || '*');
    };
    File.prototype.assetsPath = function (_path) {
        return BalmJS.config.env.isProd || !BalmJS.config.inFrontend
            ? path.posix.join(BalmJS.config.assets.virtualDir, this.assetsSuffixPath, _path)
            : _path;
    };
    File.prototype.setPublicPath = function () {
        var publicPath = /.*\/$/.test(this.publicPath)
            ? this.publicPath
            : this.publicPath + "/";
        var publicPathSrc = BalmJS.config.assets.publicUrlPlaceholder + "/";
        var publicPathDest = this.publicPath ? publicPath : '';
        BalmJS.logger.debug("set public path", {
            regex: publicPathSrc,
            replacement: publicPathDest
        }, {
            pre: true
        });
        return $.replace(publicPathSrc, publicPathDest);
    };
    return File;
}());
exports.default = new File();
