import path from 'node:path';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { VirtualFile } from '../pipeline/file.js';
import { AssetRevisioner } from '../pipeline/transforms/cache.js';
import { file as fsUtil } from '../utilities/file.js';
import { logger } from '../utilities/logger.js';

export class CacheTask extends BaseTask {
  constructor() {
    super({ name: 'cache', description: 'Revision assets and generate manifest' });
  }

  async run(config: BalmConfig): Promise<void> {
    const destDir = config.dest.base;
    const filesToRev = await fg(['**/*'], {
      cwd: destDir,
      absolute: true,
      onlyFiles: true
    });

    if (!filesToRev.length) {
      logger.warn('cache', 'No files found to cache');
      return;
    }

    const virtualFiles = await Promise.all(
      filesToRev.map(async (filePath) => {
        const buffer = await fs.readFile(filePath);
        return new VirtualFile({
          cwd: config.workspace,
          base: destDir,
          path: filePath,
          contents: buffer
        });
      })
    );

    const revisioner = new AssetRevisioner(config.assets.options);
    const resultFiles = revisioner.process(virtualFiles);

    // Remove old files that have been renamed
    for (const vFile of resultFiles) {
      if (vFile.revPathOriginal && vFile.revPathOriginal !== vFile.path) {
        await fsUtil.remove(vFile.revPathOriginal);
      }
    }

    // Write new / updated files
    for (const vFile of resultFiles) {
      await fsUtil.writeFile(vFile.path, vFile.contents);
    }

    logger.success('cache', 'Asset revisioning and rev-manifest.json completed');
  }
}
