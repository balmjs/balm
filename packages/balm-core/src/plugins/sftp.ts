// Reference `gulp-sftp@0.1.5`
import { TransformCallback } from 'node:stream';
import fs from 'node:fs';
import { LooseObject, BalmError } from '@balm-core/index';

interface SshConfig {
  host: string;
  port: number;
  username: string;
  password?: string;
  agent?: string;
  agentForward?: boolean;
  privateKey?: string | Buffer;
  passphrase?: string;
  readyTimeout?: number;
}

const PLUGIN_NAME = 'sftp';

const normalizePath = (_path: string): string => _path.replace(/\\/g, '/');

function resolveHomePath(key: any): object {
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
    const rsaKey: string = key.location.join(', ');
    throw new PluginError(
      PLUGIN_NAME,
      `Cannot find RSA key, searched: ${rsaKey}`
    );
  }

  return key;
}

/**
 * Lots of ways to present key info
 */
function getKey(options: any): object {
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
    key = resolveHomePath(key);
  }

  return key;
}

function gulpSftp(options: LooseObject): any {
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
  const password = options.password;
  const username = options.username || 'anonymous';

  /*
   * Key info
   */
  const key: any = getKey(options);

  /*
   * End Key normalization, key should now be of form:
   * {location:Array,passphrase:String,contents:String}
   * or null
   */

  const mkDirCache: any = {};

  let finished = false;
  let sftpCache: any = null; // SFTP connection cache
  let connCache: any = null; // SSH connection cache

  function _pool(this: any, uploader: any): any {
    const ssh2 = requireModule('ssh2');

    // Method to get cache or create connection
    if (sftpCache) {
      return uploader(sftpCache);
    }

    if (password) {
      BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with password');
    } else if (key) {
      BalmJS.logger.debug(PLUGIN_NAME, 'Authenticating with private key');
    }

    /*
     * Connection options, may be a key
     */
    const connectionOptions: SshConfig = {
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

    const conn = new ssh2.Client();
    connCache = conn;

    conn.on('ready', () => {
      BalmJS.logger.debug(PLUGIN_NAME, 'Connection :: ready');

      conn.sftp((err: any, sftp: any) => {
        if (err) {
          throw err;
        }

        sftp.on('end', function (this: any) {
          BalmJS.logger.debug(PLUGIN_NAME, 'SFTP session closed');
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

    conn.on('error', (err: BalmError) => {
      this.emit('error', new PluginError(PLUGIN_NAME, err));
    });

    conn.on('end', () => {
      BalmJS.logger.debug(PLUGIN_NAME, 'Connection :: end');
    });

    conn.on('close', () => {
      if (!finished) {
        this.emit('error', new PluginError(PLUGIN_NAME, 'SFTP abrupt closure'));
      }

      if (options.callback) {
        options.callback();
      }
    });

    conn.connect(connectionOptions);
  }

  function transform(
    this: any,
    file: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (file.isNull()) {
      return callback();
    }

    // Have to create a new connection for each file otherwise they conflict, pulled from sindresorhus
    const finalRemotePath = normalizePath(path.join(remotePath, file.relative));

    // Connection pulled from pool
    _pool.call(this, (sftp: any) => {
      /*
       * Create Directories
       */

      // Get dir name from file path
      const dirname = path.dirname(finalRemotePath);
      // Get parents of the target dir

      let fileDirs: string[] = requireModule('parents')(dirname)
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
      requireModule('async').whilst(
        // https://github.com/caolan/async/issues/1668
        (cb: Function) => cb(null, fileDirs && fileDirs.length),
        (cb: Function) => {
          let d = fileDirs.pop() as string;
          mkDirCache[d] = true;
          // Mdrake - TODO: use a default file permission instead of defaulting to 755
          if (
            remotePlatform &&
            remotePlatform.toLowerCase().indexOf('win') !== -1
          ) {
            d = d.replace('/', '\\');
          }

          sftp.exists(d, (exist: boolean) => {
            if (exist) {
              cb();
            } else {
              sftp.mkdir(d, { mode: '0755' }, (err: string) => {
                // REMOTE PATH
                if (err) {
                  // Assuming that the directory exists here, silencing this error
                  BalmJS.logger.warn(
                    PLUGIN_NAME,
                    `Error or directory exists: ${err} ${d}`
                  );
                } else {
                  BalmJS.logger.debug(PLUGIN_NAME, `Created: ${d}`);
                }

                cb();
              });
            }
          });
        },
        () => {
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

          stream.on('close', function (this: any, error: BalmError) {
            if (error) {
              this.emit('error', new PluginError(PLUGIN_NAME, error));
            } else {
              const fileRelativePath = file.relative as string;
              BalmJS.logger.info(
                PLUGIN_NAME,
                `Uploaded: ${fileRelativePath} => ${finalRemotePath}`
              );

              fileCount++;
            }

            return callback(error);
          });
        }
      );
    });
  }

  function flush(callback: TransformCallback): void {
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

    callback();
  }

  return through2.obj(transform, flush);
}

export default gulpSftp;
