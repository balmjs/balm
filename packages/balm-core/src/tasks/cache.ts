import path from 'node:path';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import { BaseTask } from '../runner/task.js';
import { BalmConfig, BundlerType } from '../types/index.js';
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
    const assetGlobs = [
      `${config.paths.target.css}/**/*`,
      `${config.paths.target.js}/**/*`,
      `${config.paths.target.img}/**/*`,
      `${config.paths.target.font}/**/*`,
      `${config.paths.target.media}/**/*`,
      '*.html'
    ];
    const filesToRev = await fg(assetGlobs, {
      cwd: destDir,
      absolute: true,
      onlyFiles: true
    });

    if (!filesToRev.length) {
      logger.warn('cache', 'No files found to cache');
      return;
    }

    const originalContents = new Map<VirtualFile, Buffer>();
    const virtualFiles = await Promise.all(
      filesToRev.map(async (filePath) => {
        const buffer = await fs.readFile(filePath);
        const vFile = new VirtualFile({
          cwd: config.workspace,
          base: destDir,
          path: filePath,
          contents: buffer
        });
        originalContents.set(vFile, buffer);
        return vFile;
      })
    );

    const isWebpack =
      !config.scripts.bundler || config.scripts.bundler === BundlerType.webpack;
    const webpackOwnedGlobs = isWebpack
      ? [`${config.paths.target.js}/**/*`, `${config.paths.target.css}/async/**/*`]
      : [];

    const cacheOptions = {
      ...config.assets.options,
      dontRenameFile: [
        '.html',
        'favicon.ico',
        'manifest.json',
        '*.webmanifest',
        'robots.txt',
        '*.ico',
        '*.map',
        'icons/*',
        '**/icons/**',
        'sw.js',
        'service-worker.js',
        'workbox-sw.js',
        ...webpackOwnedGlobs,
        ...(config.assets.excludes || []),
        ...(config.assets.options?.dontRenameFile || [])
      ],
      dontUpdateReference: [
        ...webpackOwnedGlobs,
        ...(config.assets.options?.dontUpdateReference || [])
      ]
    };
    const revisioner = new AssetRevisioner(cacheOptions);
    const resultFiles = revisioner.process(virtualFiles);

    // Remove old files that have been renamed
    for (const vFile of resultFiles) {
      if (vFile.revPathOriginal && vFile.revPathOriginal !== vFile.path) {
        await fsUtil.remove(vFile.revPathOriginal);
      }
    }

    // Write manifest and renamed/updated files only
    for (const vFile of resultFiles) {
      const origBuf = originalContents.get(vFile);
      const isRenamed = Boolean(vFile.revPathOriginal && vFile.revPathOriginal !== vFile.path);
      const isUpdated = !origBuf || !origBuf.equals(vFile.contents);
      if (isRenamed || isUpdated) {
        await fsUtil.writeFile(vFile.path, vFile.contents);
      }
    }

    logger.success('cache', 'Asset revisioning and rev-manifest.json completed');
  }
}
