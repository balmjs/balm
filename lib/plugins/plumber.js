"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Reference `gulp-plumber@1.2.1`
var events_1 = __importDefault(require("events"));
var PLUGIN_NAME = 'plumber';
var EE = events_1.default.EventEmitter;
function removeDefaultHandler(stream, event) {
    var found = false;
    stream.listeners(event).forEach(function (item) {
        if (item.name === "on" + event) {
            found = item;
            this.removeListener(event, item);
        }
    }, stream);
    return found;
}
function wrapPanicOnErrorHandler(stream) {
    var oldHandler = removeDefaultHandler(stream, 'error');
    if (oldHandler) {
        stream.on('error', function onerror2(error) {
            if (EE.listenerCount(stream, 'error') === 1) {
                this.removeListener('error', onerror2);
                oldHandler.call(stream, error);
            }
        });
    }
}
function defaultErrorHandler(error) {
    // onerror2 and this handler
    if (EE.listenerCount(this, 'error') < 3) {
        BalmJS.logger.error(PLUGIN_NAME + " - found unhandled error", error.toString());
    }
}
function gulpPlumber(opts) {
    if (opts === void 0) { opts = {}; }
    if (BalmJS.utils.isFunction(opts)) {
        opts = { errorHandler: opts };
    }
    var through = through2.obj();
    through._plumber = true;
    if (opts.errorHandler !== false) {
        through.errorHandler = BalmJS.utils.isFunction(opts.errorHandler)
            ? opts.errorHandler
            : defaultErrorHandler;
    }
    function patchPipe(stream) {
        if (stream.pipe2) {
            wrapPanicOnErrorHandler(stream);
            stream._pipe = stream._pipe || stream.pipe;
            stream.pipe = stream.pipe2;
            stream._plumbed = true;
        }
    }
    through.pipe2 = function pipe2(dest) {
        if (!dest) {
            throw new PluginError(PLUGIN_NAME, "Can't pipe to undefined");
        }
        // this._pipe.apply(this, arguments);
        this._pipe(dest);
        if (dest._unplumbed) {
            return dest;
        }
        removeDefaultHandler(this, 'error');
        if (dest._plumber) {
            return dest;
        }
        dest.pipe2 = pipe2;
        // Patching pipe method
        if (opts.inherit !== false) {
            patchPipe(dest);
        }
        // Placing custom on error handler
        if (this.errorHandler) {
            dest.errorHandler = this.errorHandler;
            dest.on('error', this.errorHandler.bind(dest));
        }
        dest._plumbed = true;
        return dest;
    };
    patchPipe(through);
    return through;
}
function stop() {
    var through = through2.obj();
    through._unplumbed = true;
    return through;
}
exports.stop = stop;
exports.default = gulpPlumber;
