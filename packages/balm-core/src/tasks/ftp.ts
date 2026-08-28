import path from 'node:path';
import fs from 'node:fs';
import { Client } from 'ssh2';
import fg from 'fast-glob';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { logger } from '../utilities/logger.js';

export interface FtpTaskOptions {
  localFiles?: string | string[];
  options?: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    remotePath?: string;
    [key: string]: any;
  };
}

export class FtpTask extends BaseTask {
  private ftpOptions: FtpTaskOptions;

  constructor(ftpOptions: FtpTaskOptions = {}) {
    super({ name: 'ftp', description: 'Upload files via SFTP' });
    this.ftpOptions = ftpOptions;
  }

  async run(config: BalmConfig): Promise<void> {
    const options = {
      port: 22,
      remotePath: '/',
      ...config.ftp.options,
      ...this.ftpOptions.options
    };

    if (!options.host) {
      logger.error('ftp', '`host` required for SFTP');
      return;
    }

    const localFiles = this.ftpOptions.localFiles || config.dest.base;
    const files = await fg(localFiles, { cwd: config.workspace, absolute: true, onlyFiles: true });

    if (!files.length) {
      logger.warn('ftp', 'No files to upload');
      return;
    }

    return new Promise((resolve, reject) => {
      const conn = new Client();

      conn.on('ready', () => {
        conn.sftp((err, sftp) => {
          if (err) {
            conn.end();
            return reject(err);
          }

          let pending = files.length;
          for (const file of files) {
            const rel = path.relative(config.workspace, file);
            const remoteFile = path.posix.join(options.remotePath, rel);

            sftp.fastPut(file, remoteFile, (putErr) => {
              if (putErr) {
                logger.error('ftp', `Failed uploading ${file}: ${putErr.message}`);
              } else {
                logger.info('ftp', `Uploaded ${file} -> ${remoteFile}`);
              }
              pending--;
              if (pending === 0) {
                conn.end();
                resolve();
              }
            });
          }
        });
      });

      conn.on('error', (connErr) => {
        logger.error('ftp', connErr.message);
        reject(connErr);
      });

      conn.connect(options as any);
    });
  }
}
