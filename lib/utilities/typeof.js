"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reTypeOf = /(?:^\[object\s(.*?)\]$)/;
function getType(obj) {
    return Object.prototype.toString
        .call(obj)
        .replace(reTypeOf, '$1')
        .toLowerCase();
}
exports.default = getType;
