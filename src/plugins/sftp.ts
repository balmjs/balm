// Reference `gulp-sftp`
import path from 'path';
import fs from 'fs';
import { Client } from 'ssh2';
import through from 'through2';
import async from 'async';
import parents from 'parents';
import PluginError from 'plugin-error';

const PLUGIN_NAME = 'sftp';

const normalizePath = (_path: string): string => _path.replace(/\\/g, '/');

function _resolveHomePath(key: any): object {
  if (key.location) {
    const HOME: string = process.env.HOME || process.env.USERPROFILE || '';

    for (let i = 0, len = key.location.length; i < len; i++) {
      if (key.location[i].substr(0, 2) === '~/') {
        key.location[i] = path.resolve(
          HOME,
          key.location[i].replace(/^~\//, '')
        );
      }
    }

    for (let i = 0, keyPath; (keyPath = key.location[i++]); ) {
      if (fs.existsSync(keyPath)) {
        key.contents = fs.readFileSync(keyPath);
        break;
      }
    }
  } else if (!key.contents) {
    throw new PluginError(
      PLUGIN_NAME,
      'Cannot find RSA key, searched: ' + key.location.join(', ')
    );
  }

  return key;
}

/*
 * Lots of ways to present key info
 */
function _getKey(options: any): object {
  let key = options.key || options.keyLocation || null;

  if (key && BalmJS.utils.isString(key)) {
    key = {
      location: key
    };
  }

  // Check for other options that imply a key or if there is no password
  if (
    !key &&
    (options.passphrase || options.keyContents || !options.password)
  ) {
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

function gulpSftp(options: any): any {
  options = Object.assign({}, options); // Credit sindresorhus

  if (options.host === undefined) {
    throw new PluginError(PLUGIN_NAME, '`host` required');
  }

  let fileCount = 0;
  const remotePath = options.remotePath || '/';
  const remotePlatform = options.remotePlatform || options.platform || 'unix';

  options.authKey = options.authKey || options.auth;
  const authFilePath = options.authFile || '.ftppass';
  const authFile = path.join('./', authFilePath);
  if (options.authKey && fs.existsSync(authFile)) {
    let auth = JSON.parse(fs.readFileSync(authFile, 'utf8'))[options.authKey];
    if (!auth) {
      throw new PluginError(PLUGIN_NAME, 'Could not find authkey in .ftppass');
    }

    if (BalmJS.utils.isString(auth) && auth.indexOf(':') !== -1) {
      const authparts = auth.split(':');
      auth = { user: authparts[0], pass: authparts[1] };
    }

    const authKeys = Object.keys(auth);
    for (let i = 0, len = authKeys.length; i < len; i++) {
      const attr = authKeys[i];
      if (auth[attr]) {
        options[attr] = auth[attr];
      }
    }
  }

  // Option aliases
  const password = options.password || null;
  const username = options.username || 'anonymous';

  /*
   * Key info
   */
  const key: any = _getKey(options);

  /*
   * End Key normalization, key should now be of form:
   * {location:Array,passphrase:String,contents:String}
   * or null
   */

  const mkDirCache: any = {};

  let finished = false;
  let sftpCache: any = null; // Sftp connection cache
  let connCache: any = null; // Ssh connection cache

  function _pool(uploader: any): void {
    // Method to get cache or create connection
    if (sftpCache) {
      return uploader(sftpCache);
    }

    if (password) {
      BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with password');
    } else if (key) {
      BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with private key');
    }

    const conn = new Client();
    connCache = conn;

    conn.on('ready', function() {
      conn.sftp(function(err: any, sftp: any) {
        if (err) {
          throw err;
        }

        sftp.on('end', function(this: any) {
          BalmJS.logger.info(PLUGIN_NAME, 'SFTP session closed');
          sftpCache = null;
          if (!finished) {
            this.emit(
              'error',
              new PluginError(PLUGIN_NAME, 'SFTP abrupt closure')
            );
          }
        });

        sftpCache = sftp;
        uploader(sftpCache);
      });
    });

    conn.on('error', function(this: any, err: any) {
      this.emit('error', new PluginError(PLUGIN_NAME, err));
    });

    conn.on('end', function() {
      BalmJS.logger.info(PLUGIN_NAME, 'Connection :: end');
    });

    conn.on('close', function(this: any, hadError: any) {
      if (!finished) {
        BalmJS.logger.error(PLUGIN_NAME, 'SFTP abrupt closure');
        this.emit('error', new PluginError(PLUGIN_NAME, 'SFTP abrupt closure'));
      }

      BalmJS.logger.info(
        PLUGIN_NAME,
        'Connection :: close' + (hadError ? ' with error' : '')
      );

      if (options.callback) {
        options.callback();
      }
    });

    /*
     * Connection options, may be a key
     */
    const connectionOptions: any = {
      host: options.host,
      port: options.port || 22,
      username
    };

    if (password) {
      connectionOptions.password = password;
    } else if (options.agent) {
      connectionOptions.agent = options.agent;
      connectionOptions.agentForward = options.agentForward || false;
    } else if (key) {
      connectionOptions.privateKey = key.contents;
      connectionOptions.passphrase = key.passphrase;
    }

    if (options.timeout) {
      connectionOptions.readyTimeout = options.timeout;
    }

    conn.connect(connectionOptions);
  }

  const transform = function(
    this: any,
    file: any,
    encoding: string,
    cb: Function
  ): any {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    // Have to create a new connection for each file otherwise they conflict, pulled from sindresorhus
    const finalRemotePath = normalizePath(path.join(remotePath, file.relative));

    // Connection pulled from pool
    _pool.call(this, function(sftp: any) {
      /*
       * Create Directories
       */

      // Get dir name from file path
      const dirname = path.dirname(finalRemotePath);
      // Get parents of the target dir

      let fileDirs = parents(dirname)
        .map((d: string) => d.replace(/^\/~/, '~'))
        .map(normalizePath);

      if (dirname.search(/^\//) === 0) {
        fileDirs = fileDirs.map((dir: string) =>
          dir.search(/^\//) === 0 ? dir : `/${dir}`
        );
      }

      // Get filter out dirs that are closer to root than the base remote path
      // also filter out any dirs made during this gulp session
      fileDirs = fileDirs.filter(
        (d: string) => d.length >= remotePath.length && !mkDirCache[d]
      );

      // While there are dirs to create, create them
      // https://github.com/caolan/async#whilst - not the most commonly used async control flow
      async.whilst(
        // https://github.com/caolan/async/issues/1668
        (cb: Function) => cb(null, fileDirs && fileDirs.length),
        function(callback: Function) {
          let d = fileDirs.pop();
          mkDirCache[d] = true;
          // Mdrake - TODO: use a default file permission instead of defaulting to 755
          if (
            remotePlatform &&
            remotePlatform.toLowerCase().indexOf('win') !== -1
          ) {
            d = d.replace('/', '\\');
          }

          sftp.exists(d, function(exist: boolean) {
            // eslint-disable-next-line no-negated-condition
            if (!exist) {
              sftp.mkdir(d, { mode: '0755' }, function(err: any) {
                // REMOTE PATH
                if (err) {
                  // Assuming that the directory exists here, silencing this error
                  BalmJS.logger.warn(
                    PLUGIN_NAME,
                    `Error or directory exists: ${err} ${d}`
                  );
                } else {
                  BalmJS.logger.info(PLUGIN_NAME, `Created: ${d}`);
                }

                callback();
              });
            } else {
              callback();
            }
          });
        },
        function() {
          const stream = sftp.createWriteStream(finalRemotePath, {
            flags: 'w',
            encoding: null,
            mode: '0666',
            autoClose: true
          });

          // Start upload
          if (file.isStream()) {
            file.contents.pipe(stream);
          } else if (file.isBuffer()) {
            stream.end(file.contents);
          }

          stream.on('close', function(this: any, err: any) {
            if (err) {
              this.emit('error', new PluginError(PLUGIN_NAME, err));
            } else {
              BalmJS.logger.info(
                PLUGIN_NAME,
                `Uploaded: ${file.relative} => ${finalRemotePath}`
              );

              fileCount++;
            }

            return cb(err);
          });
        }
      );
    });

    this.push(file);
  };

  function _flush(cb: Function): void {
    if (fileCount > 0) {
      const unit = fileCount === 1 ? 'file' : 'files';
      BalmJS.logger.info(
        PLUGIN_NAME,
        `${fileCount} ${unit} uploaded successfully`
      );
    } else {
      BalmJS.logger.warn(PLUGIN_NAME, 'No files uploaded');
    }

    finished = true;

    if (sftpCache) {
      sftpCache.end();
    }

    if (connCache) {
      connCache.end();
    }

    cb();
  }

  return through.obj(transform, _flush);
}

export default gulpSftp;
