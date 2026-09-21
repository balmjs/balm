import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
import fg from 'fast-glob';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { file as fsUtil } from '../utilities/file.js';
import { logger } from '../utilities/logger.js';

export interface ZipTaskOptions {
  input?: string | string[];
  output?: string;
  filename?: string;
}

export class ZipTask extends BaseTask {
  private options: ZipTaskOptions;

  constructor(options: ZipTaskOptions = {}) {
    super({ name: 'zip', description: 'Compress files into archive' });
    this.options = options;
  }

  async run(config: BalmConfig): Promise<void> {
    const input = this.options.input || config.dest.base;
    const outputDir = this.options.output
      ? (path.isAbsolute(this.options.output) ? this.options.output : path.join(config.workspace, this.options.output))
      : config.workspace;
    const filename = this.options.filename || 'archive.zip';
    const zipPath = path.join(outputDir, filename);

    await fsUtil.ensureDir(outputDir);

    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      outputStream.on('close', () => {
        logger.success('zip', `Created ${zipPath} (${archive.pointer()} total bytes)`);
        resolve();
      });

      archive.on('error', (err) => {
        logger.error('zip', err.message);
        reject(err);
      });

      archive.pipe(outputStream);

      const inputs = Array.isArray(input) ? input : [input];
      for (const item of inputs) {
        const isGlob = /[*?{}]/.test(item);
        if (isGlob) {
          const base = item.split('*')[0].replace(/\/+$/, '') || '.';
          const matched = fg.sync(item, { cwd: config.workspace, onlyFiles: true, dot: true });
          for (const relPath of matched) {
            const fullFilePath = path.join(config.workspace, relPath);
            const zipName = path.relative(base, relPath);
            archive.file(fullFilePath, { name: zipName });
          }
        } else {
          const fullPath = path.isAbsolute(item) ? item : path.join(config.workspace, item);
          if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              archive.directory(fullPath, false);
            } else {
              archive.file(fullPath, { name: path.basename(fullPath) });
            }
          }
        }
      }

      archive.finalize();
    });
  }
}
