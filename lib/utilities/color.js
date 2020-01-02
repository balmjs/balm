"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var COLOR = {
    PREFIX: 'bg',
    SUFFIX: 'Bright'
};
function _style(colorStyle) {
    if (colorStyle === void 0) { colorStyle = {
        color: 'white'
    }; }
    var color = colorStyle.color.toLowerCase();
    var fn = colorStyle.background
        ? COLOR.PREFIX + color.replace(/^[a-z]/, function (str) { return str.toUpperCase(); })
        : color;
    if (colorStyle.bright) {
        fn += COLOR.SUFFIX;
    }
    var colors = ansi_colors_1.default;
    var render = colorStyle.modifier
        ? colors[colorStyle.modifier][fn]
        : colors[fn];
    var symbols = ansi_colors_1.default.symbols;
    var icon = colorStyle.symbol && symbols[colorStyle.symbol]
        ? symbols[colorStyle.symbol] + ' '
        : '';
    return {
        icon: icon,
        render: render
    };
}
function color(label, colorStyle) {
    var result = _style(colorStyle);
    return result.render("" + result.icon + label);
}
exports.default = color;
