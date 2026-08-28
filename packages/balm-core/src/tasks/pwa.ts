import path from 'node:path';
import { generateSW, injectManifest } from 'workbox-build';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
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
    const mode = this.options.mode || config.pwa.mode || 'generateSW';
    const globDirectory = config.dest.base;
    const swDest = path.join(globDirectory, config.pwa.swDestFilename);
    const swSrc = path.join(config.src.base, config.pwa.swSrcFilename);

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
    } catch (err: any) {
      logger.warn('pwa', `Service worker generation failed: ${err.message || err}`);
    }
  }
}
