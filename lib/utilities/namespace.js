"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NAMESPACE = 'balm';
function toNamespace(taskName) {
    var result = 'unknown';
    if (BalmJS.utils.isString(taskName)) {
        result = NAMESPACE + ":" + taskName;
    }
    else if (BalmJS.utils.isArray(taskName)) {
        result = taskName.map(function (name) { return NAMESPACE + ":" + name; });
    }
    else {
        BalmJS.logger.error('task namespace', "The task '" + taskName + "' must be a string or array");
    }
    return result;
}
exports.default = toNamespace;
