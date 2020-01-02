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
var HtmlTask = /** @class */ (function (_super) {
    __extends(HtmlTask, _super);
    function HtmlTask() {
        var _this = _super.call(this, 'html') || this;
        _this.defaultInput = [
            path.join(BalmJS.config.src.base, '*.html'),
            path.join(BalmJS.config.src.base, BalmJS.config.pwa.manifest)
        ];
        _this.defaultOutput = BalmJS.config.dest.base;
        return _this;
    }
    HtmlTask.prototype._updateAssetsPath = function (type) {
        var isManifest = type === 'manifest';
        var assetsType = isManifest ? 'img' : type;
        var from = BalmJS.config.paths.source[assetsType]
            .split('/')
            .pop();
        var to = BalmJS.file.assetsPath(BalmJS.config.paths.target[assetsType]);
        var assetsPathSrc = new RegExp(isManifest
            ? "/?" + from
            : BalmJS.config.assets.publicUrlPlaceholder + "/" + from, 'g');
        var assetsPathDest = BalmJS.config.assets.publicUrlPlaceholder + "/" + to;
        BalmJS.logger.debug(this.name + " task - assets path", {
            regex: assetsPathSrc,
            replacement: assetsPathDest
        }, {
            pre: true
        });
        return $.replace(assetsPathSrc, assetsPathDest);
    };
    HtmlTask.prototype.recipe = function (input, output) {
        var _this = this;
        return function () {
            _this.init(input, output);
            var stream = _this.src;
            if (BalmJS.config.env.isProd) {
                stream = stream
                    .pipe($.useref({
                    base: BalmJS.config.workspace,
                    searchPath: [
                        BalmJS.config.roots.tmp,
                        BalmJS.config.roots.source,
                        '.'
                    ]
                }))
                    .pipe($.if(/\.html$/, BalmJS.plugins.htmlmin(BalmJS.config.html.options)))
                    .pipe(_this._updateAssetsPath('css'))
                    .pipe(_this._updateAssetsPath('js'))
                    .pipe(_this._updateAssetsPath('img'))
                    .pipe(_this._updateAssetsPath('media'))
                    .pipe($.if(BalmJS.config.pwa.manifest, _this._updateAssetsPath('manifest')));
                stream = BalmJS.config.assets.cache
                    ? stream.pipe($.if(BalmJS.config.pwa.manifest, BalmJS.file.setPublicPath()))
                    : stream.pipe(BalmJS.file.setPublicPath());
            }
            else {
                stream = stream
                    .pipe(_this._updateAssetsPath('css'))
                    .pipe(_this._updateAssetsPath('js'))
                    .pipe($.if(!BalmJS.config.inFrontend, _this._updateAssetsPath('img')))
                    .pipe($.if(!BalmJS.config.inFrontend, _this._updateAssetsPath('media')))
                    .pipe(BalmJS.file.setPublicPath());
            }
            return stream.pipe(gulp.dest(BalmJS.file.absPath(_this.output)));
        };
    };
    Object.defineProperty(HtmlTask.prototype, "fn", {
        get: function () {
            return this.recipe();
        },
        enumerable: true,
        configurable: true
    });
    return HtmlTask;
}(BalmJS.BalmTask));
exports.default = HtmlTask;
