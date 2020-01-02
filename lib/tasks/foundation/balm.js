"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BalmTask = /** @class */ (function () {
    function BalmTask(name) {
        this._output = '';
        this._customOptions = {};
        this._defaultOutput = '';
        this._gulpSrcOptions = {}; // NOTE: gulp.src options
        this._name = name;
        this._taskName =
            name === 'default' ? name : BalmJS.toNamespace(name);
    }
    Object.defineProperty(BalmTask.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "taskName", {
        get: function () {
            return this._taskName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "input", {
        get: function () {
            return this._input;
        },
        set: function (input) {
            this._input = input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "defaultInput", {
        get: function () {
            return this._defaultInput;
        },
        set: function (input) {
            this._defaultInput = input;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "output", {
        get: function () {
            return this._output;
        },
        set: function (output) {
            this._output = output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "defaultOutput", {
        get: function () {
            return this._defaultOutput;
        },
        set: function (output) {
            this._defaultOutput = output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "customOptions", {
        get: function () {
            return this._customOptions;
        },
        set: function (options) {
            this._customOptions = options;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "gulpSrcOptions", {
        get: function () {
            return this._gulpSrcOptions;
        },
        set: function (output) {
            this._gulpSrcOptions = output;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "styleName", {
        get: function () {
            var name;
            switch (BalmJS.config.styles.extname) {
                case 'sass':
                case 'scss':
                    name = 'sass';
                    break;
                case 'less':
                    name = 'less';
                    break;
                default:
                    name = 'postcss';
            }
            return name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BalmTask.prototype, "src", {
        get: function () {
            var _this = this;
            return gulp
                .src(BalmJS.file.absPaths(this.input), Object.assign({ allowEmpty: true }, this.gulpSrcOptions))
                .pipe(BalmJS.plugins.plumber(function (error) {
                BalmJS.logger.error(_this.name + " task", error.message);
            }));
        },
        enumerable: true,
        configurable: true
    });
    BalmTask.prototype.init = function (input, output, options) {
        if (options === void 0) { options = {}; }
        var key = this.name;
        switch (key) {
            case 'copy':
                key = 'rename';
                break;
            case 'jsmin':
                key = 'terser';
                break;
            default:
        }
        this.input = input || this.defaultInput;
        this.output = output || this.defaultOutput;
        this.customOptions = options[key] || {};
        var obj = {
            input: this.input,
            output: this.output
        };
        if (options[key]) {
            obj.customOptions = this.customOptions;
        }
        BalmJS.logger.debug(this.name + " task", obj, {
            pre: true
        });
        if (options.src) {
            this.gulpSrcOptions = options.src;
        }
    };
    return BalmTask;
}());
exports.default = BalmTask;
