"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Reference `gulp-htmlmin@5.0.1`
var html_minifier_1 = __importDefault(require("html-minifier"));
var PLUGIN_NAME = 'htmlmin';
function gulpHtmlmin(options) {
    options = BalmJS.utils.deepMerge({}, options);
    function _transform(file, encoding, callback) {
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        function minify(buf, enc, cb) {
            try {
                var contents = Buffer.from(html_minifier_1.default.minify(buf.toString(), options));
                if (cb === callback) {
                    file.contents = contents;
                    cb(null, file);
                }
                else {
                    cb(null, contents);
                    callback(null, file);
                }
            }
            catch (err) {
                var opts = Object.assign(options, { fileName: file.path });
                var error = new PluginError(PLUGIN_NAME, err, opts);
                cb === callback ? cb(error) : callback(error);
            }
        }
        if (file.isStream()) {
            file.contents = file.contents.pipe(through2(minify));
        }
        else {
            minify(file.contents, null, callback);
        }
    }
    return through2.obj(_transform);
}
exports.default = gulpHtmlmin;
