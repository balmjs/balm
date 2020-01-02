"use strict";
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
require("./foundation");
var require_dir_1 = __importDefault(require("require-dir"));
var default_1 = __importDefault(require("./default"));
var hooks_1 = __importDefault(require("../hooks"));
var PRIVATE_TASKS = require_dir_1.default('./private');
var PUBLIC_TASKS = require_dir_1.default('./public');
function registerTasks(recipe) {
    var AwesomeTasks = BalmJS.utils.deepMerge(PRIVATE_TASKS, PUBLIC_TASKS);
    // 1. Register balm tasks
    var depsTasks = [];
    var nonDepsTasks = [];
    Object.values(AwesomeTasks).forEach(function (AwesomeTask) {
        var awesomeTask = new AwesomeTask.default();
        awesomeTask.deps
            ? depsTasks.push(awesomeTask)
            : nonDepsTasks.push(awesomeTask);
    });
    nonDepsTasks.forEach(function (task) {
        var taskName = task.taskName;
        var taskFunction = task.fn;
        gulp.task(taskName, taskFunction);
        BalmJS.tasks.push(task);
    });
    depsTasks.forEach(function (task) {
        var taskName = task.taskName;
        var taskFunction = task.deps.length
            ? gulp.series(BalmJS.toNamespace(task.deps))
            : function (cb) {
                cb();
            };
        gulp.task(taskName, taskFunction);
        BalmJS.tasks.push(task);
    });
    // 2. Register balm hooks
    try {
        recipe(new hooks_1.default());
    }
    catch (error) {
        BalmJS.logger.error('balm hook', error.message);
    }
    // 3. Register balm default task
    var defaultTask = new default_1.default();
    gulp.task(defaultTask.taskName, gulp.series.apply(gulp, __spreadArrays(defaultTask.startTask, (BalmJS.config.env.inSSR
        ? [BalmJS.toNamespace('script')]
        : defaultTask.mainTasks), defaultTask.subTasks, defaultTask.endTask)));
}
exports.default = registerTasks;
