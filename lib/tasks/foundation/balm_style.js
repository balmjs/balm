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
var balm_1 = __importDefault(require("./balm"));
var cssnano_1 = __importDefault(require("cssnano"));
var BalmStyleTask = /** @class */ (function (_super) {
    __extends(BalmStyleTask, _super);
    function BalmStyleTask(name) {
        var _this = _super.call(this, name) || this;
        var extname;
        switch (name) {
            case 'sass':
                extname = '{scss,sass}';
                break;
            case 'less':
                extname = 'less';
                break;
            default:
                extname = 'css';
        }
        _this.defaultInput = path.join(BalmJS.config.roots.source, BalmJS.config.paths.source.css, '**', "!(_*)." + extname);
        _this.defaultOutput = BalmJS.config.dest.css;
        return _this;
    }
    BalmStyleTask.prototype.handleStyle = function (style, output, options) {
        var taskName = this.name + " task";
        var shouldUseSourceMap = !(BalmJS.config.env.isProd || BalmJS.config.styles.minified);
        var stream = gulp
            .src(BalmJS.file.absPaths(this.input), Object.assign({
            sourcemaps: shouldUseSourceMap,
            allowEmpty: true
        }, this.gulpSrcOptions))
            .pipe(BalmJS.plugins.plumber(function (error) {
            // https://github.com/floatdrop/gulp-plumber/issues/30
            BalmJS.logger.error(taskName, error.message);
            // Must emit end event for any dependent streams to pick up on this. Destroying the stream
            // ensures nothing else in that stream gets done, for example, if we're dealing with five
            // files, after an error in one of them, any other won't carry on. Doing destroy without
            // ending it first will not notify depending streams, tasks like `watch` will hang up.
            this.emit('end');
            this.destroy();
        }));
        switch (style) {
            case 'sass':
                stream = stream.pipe($.sass.sync(options));
                break;
            case 'less':
                stream = stream.pipe($.less(options));
                break;
            default:
        }
        return stream
            .pipe($.postcss(BalmJS.plugins.postcss()))
            .pipe($.if(BalmJS.config.env.isProd || BalmJS.config.styles.minified, $.postcss([cssnano_1.default(BalmJS.config.styles.options)])))
            .pipe(gulp.dest(BalmJS.file.absPath(output), {
            sourcemaps: shouldUseSourceMap
        }))
            .pipe(server.reload({ stream: true }));
    };
    return BalmStyleTask;
}(balm_1.default));
exports.default = BalmStyleTask;
