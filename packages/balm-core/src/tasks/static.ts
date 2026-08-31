import path from 'node:path';
import { existsSync } from 'node:fs';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { PUBLIC_URL } from '../config/constants.js';

export class StaticTask extends BaseTask {
  constructor() {
    super({ name: 'static', description: 'Copy static assets, images, fonts, and manifest' });
  }

  async run(config: BalmConfig): Promise<void> {
    const srcBase = config.src.base;
    const destBase = config.dest.base;

    // 1. Copy root static files (favicon.ico, robots.txt, icons, etc.)
    const staticPatterns = [
      path.join(srcBase, '*.{ico,png,svg,json,txt,xml,webmanifest}'),
      `!${path.join(srcBase, '*.html')}`
    ];

    const pipeline = Pipeline.from(staticPatterns, {
      cwd: config.workspace,
      base: srcBase
    });

    const publicUrlReplacement = config.assets.virtualDir ? `/${config.assets.virtualDir}` : '';
    pipeline.pipe(async (file) => {
      if (file.basename === 'manifest.json' || file.extname === '.json') {
        let content = file.toString();
        content = content.replaceAll(PUBLIC_URL, publicUrlReplacement);
        file.contents = Buffer.from(content);
      }
      return file;
    });

    await pipeline.dest(destBase);

    // 2. Copy images folder if exists in src
    if (config.src.img && existsSync(config.src.img)) {
      const imgPipeline = Pipeline.from(path.join(config.src.img, '**/*'), {
        cwd: config.workspace,
        base: config.src.img
      });
      await imgPipeline.dest(config.dest.img);

      // If source and target img dirs differ (e.g. images vs img), also copy to source dir for compatibility
      if (config.paths.source.img && config.paths.target.img && config.paths.source.img !== config.paths.target.img) {
        const compatPipeline = Pipeline.from(path.join(config.src.img, '**/*'), {
          cwd: config.workspace,
          base: config.src.img
        });
        await compatPipeline.dest(path.join(destBase, config.paths.source.img));
      }
    }

    // 3. Copy fonts folder if exists in src
    if (config.src.font && existsSync(config.src.font)) {
      const fontPipeline = Pipeline.from(path.join(config.src.font, '**/*'), {
        cwd: config.workspace,
        base: config.src.font
      });
      await fontPipeline.dest(config.dest.font);

      // Ensure both 'font' and 'fonts' directories exist in dest for compatibility
      const targetFontsDir = path.join(destBase, 'fonts');
      if (config.dest.font !== targetFontsDir) {
        const fontsPipeline = Pipeline.from(path.join(config.src.font, '**/*'), {
          cwd: config.workspace,
          base: config.src.font
        });
        await fontsPipeline.dest(targetFontsDir);
      }
      const targetFontDir = path.join(destBase, 'font');
      if (config.dest.font !== targetFontDir) {
        const fontCompatPipeline = Pipeline.from(path.join(config.src.font, '**/*'), {
          cwd: config.workspace,
          base: config.src.font
        });
        await fontCompatPipeline.dest(targetFontDir);
      }
    }

    // 4. Copy media folder if exists in src
    if (config.src.media && existsSync(config.src.media)) {
      const mediaPipeline = Pipeline.from(path.join(config.src.media, '**/*'), {
        cwd: config.workspace,
        base: config.src.media
      });
      await mediaPipeline.dest(config.dest.media);
    }

    // 5. Copy public folder if exists in workspace
    const publicDir = path.join(config.workspace, 'public');
    if (existsSync(publicDir)) {
      const pubPipeline = Pipeline.from(path.join(publicDir, '**/*'), {
        cwd: config.workspace,
        base: publicDir
      });
      await pubPipeline.dest(destBase);
    }
  }
}
