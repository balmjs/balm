// From gulp-sftp
import path from 'path';
import fs from 'fs';
import { Client } from 'ssh2';
import through from 'through2';
import async from 'async';
import parents from 'parents';
import PluginError from 'plugin-error';
import { isString, isArray } from '../utilities';

const PLUGIN_NAME = '[SFTP]';

const normalizePath = _path => {
  return _path.replace(/\\/g, '/');
};

const resolveHomePath = key => {
  if (key.location) {
    const HOME = process.env.HOME || process.env.USERPROFILE;

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
};

/*
 * Lots of ways to present key info
 */
const getKey = options => {
  let key = options.key || options.keyLocation || null;

  if (key && isString(key)) {
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
    if (!isArray(key.location)) {
      key.location = [key.location];
    }

    // Resolve all home paths
    key = resolveHomePath(key);
  }

  return key;
};

const gulpSftp = options => {
  options = Object.assign({}, options); // Credit sindresorhus

  if (options.host === undefined) {
    throw new PluginError(PLUGIN_NAME, '`host` required');
  }

  let fileCount = 0;
  let remotePath = options.remotePath || '/';
  let remotePlatform = options.remotePlatform || options.platform || 'unix';

  options.authKey = options.authKey || options.auth;
  let authFilePath = options.authFile || '.ftppass';
  let authFile = path.join('./', authFilePath);
  if (options.authKey && fs.existsSync(authFile)) {
    let auth = JSON.parse(fs.readFileSync(authFile, 'utf8'))[options.authKey];
    if (!auth) {
      throw new PluginError(PLUGIN_NAME, 'Could not find authkey in .ftppass');
    }

    if (isString(auth) && auth.indexOf(':') !== -1) {
      let authparts = auth.split(':');
      auth = { user: authparts[0], pass: authparts[1] };
    }

    let authKeys = Object.keys(auth);
    for (let i = 0, len = authKeys.length; i < len; i++) {
      let attr = authKeys[i];
      if (auth[attr]) {
        options[attr] = auth[attr];
      }
    }
  }

  // Option aliases
  let password = options.password;
  let username = options.username || 'anonymous';

  /*
   * Key info
   */
  let key = getKey(options);

  /*
   * End Key normalization, key should now be of form:
   * {location:Array,passphrase:String,contents:String}
   * or null
   */

  let logging = options.logging || false;

  let mkDirCache = {};

  let finished = false;
  let sftpCache = null; // Sftp connection cache
  let connCache = null; // Ssh connection cache

  const pool = function(uploader) {
    // Method to get cache or create connection
    if (sftpCache) {
      return uploader(sftpCache);
    }

    if (password) {
      logger.info(PLUGIN_NAME, 'Authenticating with password', logging);
    } else if (key) {
      logger.info(PLUGIN_NAME, 'Authenticating with private key', logging);
    }

    const conn = new Client();
    connCache = conn;

    conn.on('ready', () => {
      conn.sftp((err, sftp) => {
        if (err) {
          throw err;
        }

        sftp.on('end', () => {
          logger.info(PLUGIN_NAME, 'SFTP session closed', logging);
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

    conn.on('error', err => {
      this.emit('error', new PluginError(PLUGIN_NAME, err));
    });

    conn.on('end', () => {
      logger.info(PLUGIN_NAME, 'Connection :: end', logging);
    });

    conn.on('close', hadError => {
      if (!finished) {
        logger.error(PLUGIN_NAME, 'SFTP abrupt closure');
        this.emit('error', new PluginError(PLUGIN_NAME, 'SFTP abrupt closure'));
      }

      logger.info(
        PLUGIN_NAME,
        'Connection :: close' + (hadError ? ' with error' : ''),
        logging
      );

      if (options.callback) {
        options.callback();
      }
    });

    /*
     * Connection options, may be a key
     */
    let connectionOptions = {
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
  };

  const transform = function(file, encoding, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    // Have to create a new connection for each file otherwise they conflict, pulled from sindresorhus
    let finalRemotePath = normalizePath(path.join(remotePath, file.relative));

    // Connection pulled from pool
    pool.call(this, sftp => {
      /*
       * Create Directories
       */

      // Get dir name from file path
      let dirname = path.dirname(finalRemotePath);
      // Get parents of the target dir

      let fileDirs = parents(dirname)
        .map(d => {
          return d.replace(/^\/~/, '~');
        })
        .map(normalizePath);

      if (dirname.search(/^\//) === 0) {
        fileDirs = fileDirs.map(dir => {
          return dir.search(/^\//) === 0 ? dir : `/${dir}`;
        });
      }

      // Get filter out dirs that are closer to root than the base remote path
      // also filter out any dirs made during this gulp session
      fileDirs = fileDirs.filter(d => {
        return d.length >= remotePath.length && !mkDirCache[d];
      });

      // While there are dirs to create, create them
      // https://github.com/caolan/async#whilst - not the most commonly used async control flow
      async.whilst(
        () => {
          return fileDirs && fileDirs.length;
        },
        next => {
          let d = fileDirs.pop();
          mkDirCache[d] = true;
          // Mdrake - TODO: use a default file permission instead of defaulting to 755
          if (
            remotePlatform &&
            remotePlatform.toLowerCase().indexOf('win') !== -1
          ) {
            d = d.replace('/', '\\');
          }

          sftp.mkdir(d, { mode: '0755' }, err => {
            // REMOTE PATH
            if (err) {
              // Assuming that the directory exists here, silencing this error
              logger.warn(
                PLUGIN_NAME,
                `Error or directory exists: ${err} ${d}`,
                logging
              );
            } else {
              logger.success(PLUGIN_NAME, `Created: ${d}`, logging);
            }

            next();
          });
        },
        () => {
          let stream = sftp.createWriteStream(finalRemotePath, {
            // REMOTE PATH
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

          stream.on('close', err => {
            if (err) {
              this.emit('error', new PluginError(PLUGIN_NAME, err));
            } else {
              logger.success(
                PLUGIN_NAME,
                `Uploaded: ${file.relative} => ${finalRemotePath}`,
                logging
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

  const flush = cb => {
    if (fileCount > 0) {
      let unit = fileCount === 1 ? 'file' : 'files';
      logger.success(
        PLUGIN_NAME,
        `${fileCount} ${unit} uploaded successfully`,
        true
      );
    } else {
      logger.warn(PLUGIN_NAME, 'No files uploaded');
    }

    finished = true;

    if (sftpCache) {
      sftpCache.end();
    }

    if (connCache) {
      connCache.end();
    }

    cb();
  };

  return through.obj(transform, flush);
};

export default gulpSftp;
