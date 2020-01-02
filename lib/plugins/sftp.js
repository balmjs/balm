"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Reference `gulp-sftp@0.1.5`
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var ssh2_1 = require("ssh2");
var async_1 = __importDefault(require("async"));
var parents_1 = __importDefault(require("parents"));
var PLUGIN_NAME = 'sftp';
var normalizePath = function (_path) { return _path.replace(/\\/g, '/'); };
function _resolveHomePath(key) {
    if (key.location) {
        var HOME = process.env.HOME || process.env.USERPROFILE || '';
        for (var i = 0, len = key.location.length; i < len; i++) {
            if (key.location[i].substr(0, 2) === '~/') {
                key.location[i] = path_1.default.resolve(HOME, key.location[i].replace(/^~\//, ''));
            }
        }
        for (var i = 0, keyPath = void 0; (keyPath = key.location[i++]);) {
            if (fs_1.default.existsSync(keyPath)) {
                key.contents = fs_1.default.readFileSync(keyPath);
                break;
            }
        }
    }
    else if (!key.contents) {
        throw new PluginError(PLUGIN_NAME, 'Cannot find RSA key, searched: ' + key.location.join(', '));
    }
    return key;
}
/*
 * Lots of ways to present key info
 */
function _getKey(options) {
    var key = options.key || options.keyLocation || null;
    if (key && BalmJS.utils.isString(key)) {
        key = {
            location: key
        };
    }
    // Check for other options that imply a key or if there is no password
    if (!key &&
        (options.passphrase || options.keyContents || !options.password)) {
        key = {};
    }
    if (key) {
        // Aliases
        key.contents = key.contents || options.keyContents;
        key.passphrase = key.passphrase || options.passphrase;
        // Defaults
        key.location = key.location || [
            '~/.ssh/id_rsa',
            '/.ssh/id_rsa',
            '~/.ssh/id_dsa',
            '/.ssh/id_dsa'
        ];
        // Type normalization
        if (!BalmJS.utils.isArray(key.location)) {
            key.location = [key.location];
        }
        // Resolve all home paths
        key = _resolveHomePath(key);
    }
    return key;
}
function gulpSftp(options) {
    options = Object.assign({}, options); // Credit sindresorhus
    if (options.host === undefined) {
        throw new PluginError(PLUGIN_NAME, '`host` required');
    }
    var fileCount = 0;
    var remotePath = options.remotePath || '/';
    var remotePlatform = options.remotePlatform || options.platform || 'unix';
    options.authKey = options.authKey || options.auth;
    var authFilePath = options.authFile || '.ftppass';
    var authFile = path_1.default.join('./', authFilePath);
    if (options.authKey && fs_1.default.existsSync(authFile)) {
        var auth = JSON.parse(fs_1.default.readFileSync(authFile, 'utf8'))[options.authKey];
        if (!auth) {
            throw new PluginError(PLUGIN_NAME, 'Could not find authkey in .ftppass');
        }
        if (BalmJS.utils.isString(auth) && auth.indexOf(':') !== -1) {
            var authparts = auth.split(':');
            auth = { user: authparts[0], pass: authparts[1] };
        }
        var authKeys = Object.keys(auth);
        for (var i = 0, len = authKeys.length; i < len; i++) {
            var attr = authKeys[i];
            if (auth[attr]) {
                options[attr] = auth[attr];
            }
        }
    }
    // Option aliases
    var password = options.password;
    var username = options.username || 'anonymous';
    /*
     * Key info
     */
    var key = _getKey(options);
    /*
     * End Key normalization, key should now be of form:
     * {location:Array,passphrase:String,contents:String}
     * or null
     */
    var mkDirCache = {};
    var finished = false;
    var sftpCache = null; // SFTP connection cache
    var connCache = null; // SSH connection cache
    function _pool(uploader) {
        var _this = this;
        // Method to get cache or create connection
        if (sftpCache) {
            return uploader(sftpCache);
        }
        if (password) {
            BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with password');
        }
        else if (key) {
            BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with private key');
        }
        /*
         * Connection options, may be a key
         */
        var connectionOptions = {
            host: options.host,
            port: options.port || 22,
            username: username
        };
        if (password) {
            connectionOptions.password = password;
        }
        else if (options.agent) {
            connectionOptions.agent = options.agent;
            connectionOptions.agentForward = options.agentForward || false;
        }
        else if (key) {
            connectionOptions.privateKey = key.contents;
            connectionOptions.passphrase = key.passphrase;
        }
        if (options.timeout) {
            connectionOptions.readyTimeout = options.timeout;
        }
        var conn = new ssh2_1.Client();
        connCache = conn;
        conn.on('ready', function () {
            BalmJS.logger.debug(PLUGIN_NAME, 'Connection :: ready');
            conn.sftp(function (err, sftp) {
                if (err) {
                    throw err;
                }
                sftp.on('end', function () {
                    BalmJS.logger.debug(PLUGIN_NAME, 'SFTP session closed');
                    sftpCache = null;
                    if (!finished) {
                        this.emit('error', new PluginError(PLUGIN_NAME, 'SFTP abrupt closure'));
                    }
                });
                sftpCache = sftp;
                uploader(sftpCache);
            });
        });
        conn.on('error', function (err) {
            _this.emit('error', new PluginError(PLUGIN_NAME, err));
        });
        conn.on('end', function () {
            BalmJS.logger.debug(PLUGIN_NAME, 'Connection :: end');
        });
        conn.on('close', function () {
            if (!finished) {
                _this.emit('error', new PluginError(PLUGIN_NAME, 'SFTP abrupt closure'));
            }
            if (options.callback) {
                options.callback();
            }
        });
        conn.connect(connectionOptions);
    }
    function _transform(file, encoding, transformCallback) {
        if (file.isNull()) {
            return transformCallback();
        }
        // Have to create a new connection for each file otherwise they conflict, pulled from sindresorhus
        var finalRemotePath = normalizePath(path_1.default.join(remotePath, file.relative));
        // Connection pulled from pool
        _pool.call(this, function (sftp) {
            /*
             * Create Directories
             */
            // Get dir name from file path
            var dirname = path_1.default.dirname(finalRemotePath);
            // Get parents of the target dir
            var fileDirs = parents_1.default(dirname)
                .map(function (d) { return d.replace(/^\/~/, '~'); })
                .map(normalizePath);
            if (dirname.search(/^\//) === 0) {
                fileDirs = fileDirs.map(function (dir) {
                    return dir.search(/^\//) === 0 ? dir : "/" + dir;
                });
            }
            // Get filter out dirs that are closer to root than the base remote path
            // also filter out any dirs made during this gulp session
            fileDirs = fileDirs.filter(function (d) { return d.length >= remotePath.length && !mkDirCache[d]; });
            // While there are dirs to create, create them
            // https://github.com/caolan/async#whilst - not the most commonly used async control flow
            async_1.default.whilst(
            // https://github.com/caolan/async/issues/1668
            function (cb) { return cb(null, fileDirs && fileDirs.length); }, function (callback) {
                var d = fileDirs.pop();
                mkDirCache[d] = true;
                // Mdrake - TODO: use a default file permission instead of defaulting to 755
                if (remotePlatform &&
                    remotePlatform.toLowerCase().indexOf('win') !== -1) {
                    d = d.replace('/', '\\');
                }
                sftp.exists(d, function (exist) {
                    if (exist) {
                        callback();
                    }
                    else {
                        sftp.mkdir(d, { mode: '0755' }, function (err) {
                            // REMOTE PATH
                            if (err) {
                                // Assuming that the directory exists here, silencing this error
                                BalmJS.logger.warn(PLUGIN_NAME, "Error or directory exists: " + err + " " + d);
                            }
                            else {
                                BalmJS.logger.debug(PLUGIN_NAME, "Created: " + d);
                            }
                            callback();
                        });
                    }
                });
            }, function () {
                var stream = sftp.createWriteStream(finalRemotePath, {
                    flags: 'w',
                    encoding: null,
                    mode: '0666',
                    autoClose: true
                });
                // Start upload
                if (file.isStream()) {
                    file.contents.pipe(stream);
                }
                else if (file.isBuffer()) {
                    stream.end(file.contents);
                }
                stream.on('close', function (err) {
                    if (err) {
                        this.emit('error', new PluginError(PLUGIN_NAME, err));
                    }
                    else {
                        BalmJS.logger.info(PLUGIN_NAME, "Uploaded: " + file.relative + " => " + finalRemotePath);
                        fileCount++;
                    }
                    return transformCallback(err);
                });
            });
        });
    }
    function _flush(flushCallback) {
        if (fileCount > 0) {
            var unit = fileCount === 1 ? 'file' : 'files';
            BalmJS.logger.info(PLUGIN_NAME, fileCount + " " + unit + " uploaded successfully");
        }
        else {
            BalmJS.logger.warn(PLUGIN_NAME, 'No files uploaded');
        }
        finished = true;
        if (sftpCache) {
            sftpCache.end();
        }
        if (connCache) {
            connCache.end();
        }
        flushCallback();
    }
    return through2.obj(_transform, _flush);
}
exports.default = gulpSftp;
