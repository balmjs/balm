"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Reference `gulp-rename@1.4.0`
var stream_1 = __importDefault(require("stream"));
function _parsePath(_path) {
    var extname = path.extname(_path);
    return {
        dirname: path.dirname(_path),
        basename: path.basename(_path, extname),
        extname: extname
    };
}
function gulpRename(obj) {
    var _stream = new stream_1.default.Transform({ objectMode: true });
    _stream._transform = function (originalFile, encoding, callback) {
        var file = originalFile.clone({ contents: false });
        var parsedPath = _parsePath(file.relative);
        var _path;
        var finished = true;
        var type = BalmJS.utils.getType(obj);
        switch (type) {
            case 'string':
                if (obj !== '') {
                    _path = obj;
                }
                break;
            case 'function':
                obj(parsedPath, file);
                _path = path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
                break;
            case 'object': {
                var dirname = obj.dirname || parsedPath.dirname;
                var prefix = obj.prefix || '';
                var basename = obj.basename || parsedPath.basename;
                var suffix = obj.suffix || '';
                var extname = obj.extname || parsedPath.extname;
                _path = path.join(dirname, prefix + basename + suffix + extname);
                break;
            }
            default:
                finished = false;
        }
        if (finished) {
            file.path = path.join(file.base, _path);
            // Rename sourcemap if present
            if (file.sourceMap) {
                file.sourceMap.file = file.relative;
            }
        }
        else {
            file = undefined;
            BalmJS.logger.error('rename', 'Unsupported renaming parameter type supplied');
        }
        callback(null, file);
    };
    return _stream;
}
exports.default = gulpRename;
