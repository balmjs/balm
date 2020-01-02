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
var merge_stream_1 = __importDefault(require("merge-stream"));
var SpriteTask = /** @class */ (function (_super) {
    __extends(SpriteTask, _super);
    function SpriteTask() {
        var _this = _super.call(this, 'sprite') || this;
        _this.tasks = [];
        _this.defaultInput = BalmJS.config.styles.sprites;
        _this.defaultOutput = BalmJS.config.dest.img;
        if (_this.defaultInput.length) {
            _this.init();
            _this.collect();
        }
        return _this;
    }
    SpriteTask.prototype._getParams = function (spriteItem, spriteOptions) {
        var stylesConfig = Object.assign(spriteOptions, BalmJS.config.styles);
        var spriteName = spriteItem.folderName + "-" + this.name + "s";
        var imageTarget = stylesConfig.imageTarget || BalmJS.config.paths.target.img;
        var defaultParams = Object.assign({
            padding: 1
        }, {
            imgName: spriteName + ".png",
            cssName: "_" + spriteItem.folderName + "." + stylesConfig.extname,
            imgPath: "" + stylesConfig.imageBasePath + imageTarget + "/" + spriteName + ".png",
            cssVarMap: function (sprite) {
                sprite.name = spriteItem.folderName + "-" + sprite.name; // E.g. "awesome-icon-name"
            },
            cssSpritesheetName: spriteItem.folderName + "-spritesheet",
            cssOpts: {
                cssSelector: function (sprite) { return "." + sprite.name; } // Classname in css file: '.icon-awesome'
            }
        });
        if (stylesConfig.spriteRetina) {
            defaultParams = Object.assign(defaultParams, {
                retinaSrcFilter: "" + spriteItem.retinaSrc,
                retinaImgName: spriteName + "@2x.png",
                retinaImgPath: "" + stylesConfig.imageBasePath + imageTarget + "/" + spriteName + "@2x.png",
                cssVarMap: function (sprite) {
                    sprite.name = spriteItem.folderName + "-" + sprite.name; // E.g. "awesome-icon-name"
                },
                cssRetinaSpritesheetName: spriteItem.folderName + "-spritesheet-2x",
                cssRetinaGroupsName: spriteItem.folderName + "-retina-groups" // E.g. "awesome-retina-groups"
            });
        }
        return Object.assign(defaultParams, stylesConfig.spriteParams);
    };
    SpriteTask.prototype.collect = function (spriteOptions) {
        var _this = this;
        if (spriteOptions === void 0) { spriteOptions = {}; }
        var spriteList = [];
        for (var _i = 0, _a = this.input; _i < _a.length; _i++) {
            var spriteName = _a[_i];
            spriteList.push({
                src: BalmJS.config.src.img + "/" + spriteName + "/*.png",
                retinaSrc: BalmJS.config.src.img + "/" + spriteName + "/*@2x.png",
                folderName: spriteName
            });
        }
        var _loop_1 = function (key, len) {
            var spriteItem = spriteList[key];
            var spriteTaskName = this_1.name + ":" + spriteItem.folderName; // E.g. 'sprite:awesome'
            var spriteConfig = {
                input: spriteItem.src,
                params: this_1._getParams(spriteItem, spriteOptions),
                imgOutput: this_1.output,
                cssOutput: BalmJS.config.src.css + "/" + this_1.name + "s" // E.g. 'path/to/css/sprites'
            };
            gulp.task(BalmJS.toNamespace(spriteTaskName), function () {
                var spriteData = gulp
                    .src(spriteConfig.input)
                    .pipe(BalmJS.plugins.plumber(function (error) {
                    BalmJS.logger.error(_this.name + " task", error.message);
                }))
                    .pipe($.spritesmith(spriteConfig.params));
                var imgStream = spriteData.img.pipe(gulp.dest(BalmJS.file.absPath(spriteConfig.imgOutput)));
                var cssStream = spriteData.css.pipe(gulp.dest(BalmJS.file.absPath(spriteConfig.cssOutput)));
                return merge_stream_1.default(imgStream, cssStream);
            });
            this_1.tasks.push(spriteTaskName);
        };
        var this_1 = this;
        for (var key = 0, len = spriteList.length; key < len; key++) {
            _loop_1(key, len);
        }
    };
    SpriteTask.prototype.recipe = function (input, output, spriteOptions) {
        if (spriteOptions === void 0) { spriteOptions = {}; }
        if (input.length) {
            if (output && !spriteOptions.imageTarget) {
                spriteOptions.imageTarget = output.split('/').pop();
            }
            this.init(input, output);
            this.collect(spriteOptions);
        }
    };
    Object.defineProperty(SpriteTask.prototype, "deps", {
        get: function () {
            return this.tasks;
        },
        enumerable: true,
        configurable: true
    });
    return SpriteTask;
}(BalmJS.BalmTask));
exports.default = SpriteTask;
