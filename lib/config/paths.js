"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var source = {
    base: '',
    css: 'styles',
    js: 'scripts',
    img: 'images',
    font: 'fonts',
    media: 'media' // Media directory: `src/media`
};
var tmp = {
    base: '',
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'fonts',
    media: 'media' // `.tmp/media`
};
var target = {
    base: '',
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'font',
    media: 'media' // `dist/media`
};
exports.default = {
    source: source,
    tmp: tmp,
    target: target
};
