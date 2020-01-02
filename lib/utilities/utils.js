"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeof_1 = __importDefault(require("./typeof"));
function isString(str) {
    return typeof_1.default(str) === 'string';
}
function isObject(obj) {
    return typeof_1.default(obj) === 'object';
}
function isArray(arr) {
    return Array.isArray(arr);
}
function isFunction(fn) {
    return typeof_1.default(fn) === 'function';
}
// Deep merge two objects
function deepMerge(target, source) {
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(function (key) {
            var _a, _b;
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, (_a = {}, _a[key] = {}, _a));
                }
                deepMerge(target[key], source[key]);
            }
            else {
                Object.assign(target, (_b = {}, _b[key] = source[key], _b));
            }
        });
    }
    return target;
}
exports.default = {
    getType: typeof_1.default,
    isString: isString,
    isObject: isObject,
    isArray: isArray,
    isFunction: isFunction,
    deepMerge: deepMerge
};
