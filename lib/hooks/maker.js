"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var BLACKLIST_IN_PROD = ['serve'];
function ban(name) {
    var BLACKLIST_IN_DEV = __spreadArrays([
        'publish'
    ], (BalmJS.config.useDefaults ? BLACKLIST_IN_PROD : []));
    var banInProd = BalmJS.config.env.isProd && BLACKLIST_IN_PROD.includes(name);
    var banInDev = BalmJS.config.env.isDev && BLACKLIST_IN_DEV.includes(name);
    var isBan = banInProd || banInDev;
    var api;
    switch (name) {
        case 'postcss':
            api = 'css';
            break;
        case 'script':
            api = 'js';
            break;
        default:
            api = name;
    }
    if (isBan) {
        var message = BalmJS.config.useDefaults &&
            BalmJS.config.env.isDev &&
            BLACKLIST_IN_PROD.includes(name)
            ? "'mix." + api + "()' can only be used for 'balm.config.useDefaults = false;'"
            : "There is no 'mix." + api + "()' hook in " + (banInProd ? 'production' : 'development') + " mode";
        BalmJS.logger.warn('balm hook', message);
    }
    return isBan;
}
var Maker = /** @class */ (function () {
    function Maker() {
    }
    // Register custom task
    Maker.generate = function (name, args) {
        if (args === void 0) { args = []; }
        if (ban(name)) {
            return;
        }
        var customTask = BalmJS.tasks.find(function (task) { return task.name === name; });
        var taskName = __spreadArrays(['sprite'], BLACKLIST_IN_PROD).includes(customTask.name)
            ? customTask.name
            : customTask.name + ":" + BalmJS.recipeIndex;
        var balmTask = function (cb) {
            cb();
        }; // NOTE: `balmTask` function name for `gulp.parallel`
        switch (customTask.name) {
            // private
            case 'sprite':
                customTask.recipe.apply(customTask, args);
                if (customTask.deps.length) {
                    balmTask = gulp.series(BalmJS.toNamespace(customTask.deps));
                }
                else {
                    BalmJS.logger.warn('balm hook', 'mix.sprite() is missing `input` parameters');
                }
                break;
            case 'modernizr':
                balmTask = customTask.fn;
                break;
            // public
            default:
                balmTask = customTask.recipe.apply(customTask, args);
        }
        if (BalmJS.watching) {
            gulp.parallel(balmTask)();
        }
        else {
            gulp.task(BalmJS.toNamespace(taskName), balmTask);
            BalmJS.recipes.push(taskName);
            BalmJS.recipeIndex++;
        }
    };
    return Maker;
}());
exports.default = Maker;
