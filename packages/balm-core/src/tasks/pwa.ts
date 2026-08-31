import path from 'node:path';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { generateSW, injectManifest } from 'workbox-build';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { file as fsUtil } from '../utilities/file.js';
import { logger } from '../utilities/logger.js';

export interface PwaTaskOptions {
  mode?: 'generateSW' | 'injectManifest';
  options?: Record<string, any>;
}

export class PwaTask extends BaseTask {
  private options: PwaTaskOptions;

  constructor(options: PwaTaskOptions = {}) {
    super({ name: 'pwa', description: 'Generate Progressive Web App Service Worker' });
    this.options = options;
  }

  async run(config: BalmConfig): Promise<void> {
    const globDirectory = config.dest.base;
    const swDest = path.join(globDirectory, config.pwa.swDestFilename);
    const swSrc = path.join(config.src.base, config.pwa.swSrcFilename);

    // 1. Copy workbox-sw.js and workbox-sw.js.map to dest
    const require = createRequire(import.meta.url);
    const candidatePaths: string[] = [
      path.join(config.workspace, 'node_modules/workbox-sw/build/workbox-sw.js'),
      path.join(config.workspace, 'node_modules/workbox-sw/controllers/WorkboxSW.mjs')
    ];
    try {
      const resolved = require.resolve('workbox-sw/build/workbox-sw.js');
      candidatePaths.unshift(resolved);
    } catch {}
    try {
      const resolvedPkg = require.resolve('workbox-sw');
      candidatePaths.push(path.join(path.dirname(resolvedPkg), 'build/workbox-sw.js'));
    } catch {}

    for (const p of candidatePaths) {
      if (existsSync(p)) {
        const destFile = path.join(globDirectory, 'workbox-sw.js');
        await fs.copyFile(p, destFile);
        const mapFile = `${p}.map`;
        if (existsSync(mapFile)) {
          await fs.copyFile(mapFile, path.join(globDirectory, 'workbox-sw.js.map'));
        }
        break;
      }
    }

    // 2. Generate or inject manifest
    const mode = this.options.mode || config.pwa.mode || 'generateSW';
    const mergedOptions: any = {
      globDirectory,
      swDest,
      ...config.pwa.options,
      ...this.options.options
    };

    if (mode === 'injectManifest') {
      mergedOptions.swSrc = mergedOptions.swSrc || swSrc;
    }

    try {
      if (mode === 'generateSW') {
        const { count, size } = await generateSW(mergedOptions);
        logger.info('pwa', `Generated '${swDest}', precaching ${count} files (${size} bytes)`);
      } else {
        const { count, size } = await injectManifest(mergedOptions);
        logger.info('pwa', `Injected manifest into '${swDest}', precaching ${count} files (${size} bytes)`);
      }

      // 3. Replace version placeholder in swDest
      if (existsSync(swDest) && config.pwa.version) {
        let swContent = await fs.readFile(swDest, 'utf-8');
        swContent = swContent
          .replaceAll('{{ version }}', config.pwa.version)
          .replaceAll('{{version}}', config.pwa.version);
        await fs.writeFile(swDest, swContent, 'utf-8');
      }

      // 4. Ensure both service-worker.js and sw.js exist in dest for compatibility
      const swJsDest = path.join(globDirectory, 'sw.js');
      const serviceWorkerJsDest = path.join(globDirectory, 'service-worker.js');
      if (existsSync(serviceWorkerJsDest) && !existsSync(swJsDest)) {
        await fs.copyFile(serviceWorkerJsDest, swJsDest);
      } else if (existsSync(swJsDest) && !existsSync(serviceWorkerJsDest)) {
        await fs.copyFile(swJsDest, serviceWorkerJsDest);
      }
    } catch (err: any) {
      logger.warn('pwa', `Service worker generation failed: ${err.message || err}`);
    }
  }
}
