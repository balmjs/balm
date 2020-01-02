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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var gulp_1 = require("gulp");
var middlewares_1 = __importDefault(require("../../middlewares"));
function reload(done) {
    server.reload();
    done();
}
var ServerTask = /** @class */ (function (_super) {
    __extends(ServerTask, _super);
    function ServerTask() {
        var _this = _super.call(this, 'serve') || this;
        if (BalmJS.config.scripts.ie8) {
            BalmJS.config.scripts.hot = false;
        }
        return _this;
    }
    ServerTask.prototype._onWatch = function () {
        var _this = this;
        // NOTE: bugfix for windows - chokidar.cwd has not default
        var watchOptions = {
            cwd: BalmJS.config.workspace
        };
        gulp_1.watch(__spreadArrays([
            BalmJS.config.src.img + "/**/*",
            BalmJS.config.dest.font + "/**/*"
        ], BalmJS.config.server.extraWatchFiles), watchOptions).on('change', server.reload);
        gulp_1.watch(BalmJS.config.src.base + "/*.html", watchOptions, gulp_1.parallel(BalmJS.toNamespace('html'))).on('change', server.reload);
        gulp_1.watch(BalmJS.config.src.css + "/**/*." + BalmJS.config.styles.extname, watchOptions, gulp_1.parallel(BalmJS.toNamespace(BalmJS.config.inFrontend ? this.styleName : 'style')));
        if (BalmJS.config.scripts.entry && !BalmJS.config.scripts.hot) {
            gulp_1.watch(BalmJS.config.src.js + "/**/*", watchOptions, gulp_1.series(BalmJS.toNamespace('script'), reload));
        }
        gulp_1.watch(BalmJS.config.src.base + "/modernizr.json", watchOptions, gulp_1.parallel(BalmJS.toNamespace('modernizr')));
        gulp_1.watch(BalmJS.config.src.font + "/**/*", watchOptions, gulp_1.parallel(BalmJS.toNamespace('font')));
        // For FTP
        if (BalmJS.config.ftp.watchFiles.length) {
            gulp_1.watch(BalmJS.config.ftp.watchFiles, watchOptions).on('change', function (path) {
                BalmJS.logger.debug(_this.name + " task", "File " + path + " was changed");
                BalmJS.watchFtpFile = path;
                gulp_1.series(BalmJS.toNamespace('ftp'), reload)();
            });
        }
    };
    ServerTask.prototype.recipe = function (customHandler) {
        var _this = this;
        return function (cb) {
            if (BalmJS.server) {
                BalmJS.logger.warn('server task', 'The server has started');
            }
            else {
                var bsOptions = {
                    logPrefix: 'BalmJS',
                    notify: false,
                    port: BalmJS.config.server.port,
                    host: BalmJS.config.server.host,
                    https: BalmJS.config.server.https,
                    open: BalmJS.config.server.open,
                    localOnly: BalmJS.config.server.localOnly,
                    scriptPath: BalmJS.config.scripts.ie8 ? function () { return ''; } : undefined
                };
                if (BalmJS.config.server.proxy) {
                    if (BalmJS.utils.isString(BalmJS.config.server.proxy)) {
                        bsOptions.proxy = {
                            target: BalmJS.config.server.proxy
                        };
                    }
                    else if (BalmJS.utils.isObject(BalmJS.config.server.proxy)) {
                        bsOptions.proxy = BalmJS.config.server.proxy;
                    }
                    else {
                        BalmJS.logger.error(_this.name + " task", '`server.proxy` must be a string or object');
                    }
                    bsOptions.serveStatic = BalmJS.config.server.serveStatic;
                }
                else {
                    bsOptions.server = {
                        baseDir: [BalmJS.config.dest.base, BalmJS.config.src.base],
                        routes: {
                            '/bower_components': BalmJS.file.absPath('bower_components'),
                            '/node_modules': BalmJS.file.absPath('node_modules')
                        }
                    };
                }
                bsOptions.middleware = BalmJS.config.env.isDev
                    ? middlewares_1.default()
                    : false;
                bsOptions = BalmJS.utils.deepMerge(bsOptions, BalmJS.config.server.options);
                if (BalmJS.config.env.isDev) {
                    BalmJS.server = server.init(bsOptions);
                    if (BalmJS.config.useDefaults) {
                        _this._onWatch();
                    }
                    else {
                        BalmJS.watching = true;
                        var watcher = gulp_1.watch(__spreadArrays([
                            BalmJS.config.src.base + "/**/*"
                        ], BalmJS.config.server.extraWatchFiles));
                        try {
                            customHandler && customHandler(watcher, server.reload);
                        }
                        catch (error) {
                            BalmJS.logger.error('balm hook', error.message);
                        }
                    }
                }
            }
            cb();
        };
    };
    Object.defineProperty(ServerTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return ServerTask;
}(BalmJS.BalmTask));
exports.default = ServerTask;
