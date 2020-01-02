"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var terser_1 = __importDefault(require("terser"));
var PLUGIN_NAME = 'jsmin';
function gulpJsmin(options) {
    options = BalmJS.utils.deepMerge({}, options);
    function _transform(file, encoding, callback) {
        if (file.isStream()) {
            return this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported'));
        }
        if (file.isNull()) {
            callback(null, file);
            return;
        }
        function minify(file, opts, cb) {
            var extname = path.extname(file.path);
            if (extname === '.js') {
                var code = {};
                var content = file.contents.toString();
                code[path.basename(file.path)] = content;
                try {
                    var result = terser_1.default.minify(code, opts);
                    if (result.error) {
                        throw result.error;
                    }
                    content = result.code;
                    file.contents = Buffer.from(content);
                    cb(null, file);
                }
                catch (err) {
                    var error = new PluginError(PLUGIN_NAME, err);
                    cb(error);
                }
            }
            else {
                BalmJS.logger.error(PLUGIN_NAME, 'Invalid JS file');
            }
            return file;
        }
        minify(file, options, callback);
    }
    return through2.obj(_transform);
}
exports.default = gulpJsmin;
