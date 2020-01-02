"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var package_json_1 = __importDefault(require("../package.json"));
require("./config");
require("./utilities");
require("./plugins");
var tasks_1 = __importDefault(require("./tasks"));
var bootstrap_1 = require("./bootstrap");
var Balm = /** @class */ (function () {
    function Balm() {
        console.log("BalmJS version: " + package_json_1.default.version);
        this._config = BalmJS.config;
    }
    Object.defineProperty(Balm.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = bootstrap_1.setConfig(value);
            BalmJS.config = this._config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balm.prototype, "beforeTask", {
        set: function (name) {
            BalmJS.beforeTask = bootstrap_1.setTask(name);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Balm.prototype, "afterTask", {
        set: function (name) {
            BalmJS.afterTask = bootstrap_1.setTask(name);
        },
        enumerable: true,
        configurable: true
    });
    Balm.prototype.go = function (recipe) {
        if (recipe === void 0) { recipe = BalmJS.noop; }
        if (BalmJS.utils.isFunction(recipe)) {
            tasks_1.default(recipe);
        }
        else {
            BalmJS.logger.error('initialization', 'BalmJS API: `balm.go(function(mix) {});`');
        }
    };
    Balm.prototype.reset = function () {
        BalmJS.tasks = [];
        BalmJS.recipes = [];
        BalmJS.recipeIndex = 0;
        BalmJS.beforeTask = undefined;
        BalmJS.afterTask = undefined;
        BalmJS.config.useDefaults = true;
    };
    return Balm;
}());
exports.default = Balm;
