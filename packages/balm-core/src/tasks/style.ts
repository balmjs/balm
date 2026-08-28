import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformSass } from '../pipeline/transforms/sass.js';
import { transformLess } from '../pipeline/transforms/less.js';
import { transformPostcss } from '../pipeline/transforms/postcss.js';

export class StyleTask extends BaseTask {
  constructor() {
    super({ name: 'style', description: 'Compile stylesheets' });
  }

  async run(config: BalmConfig): Promise<void> {
    const ext = config.styles.extname;
    const srcPattern = path.join(config.src.css, `**/*.${ext}`);
    const isProd = config.env.isProd;

    const pipeline = Pipeline.from([srcPattern, `!${path.join(config.src.css, '**/_*.scss')}`, `!${path.join(config.src.css, '**/_*.less')}`], {
      cwd: config.workspace,
      base: config.src.css
    });

    if (ext === 'scss' || ext === 'sass') {
      pipeline.pipe(
        transformSass({
          includePaths: [config.src.css, ...config.styles.atImportPaths],
          ...config.styles.sassOptions
        })
      );
    } else if (ext === 'less') {
      pipeline.pipe(
        transformLess({
          paths: [config.src.css, ...config.styles.atImportPaths],
          ...config.styles.lessOptions
        })
      );
    }

    pipeline.pipe(
      transformPostcss({
        plugins: config.styles.postcssPlugins,
        minify: isProd || config.styles.minify,
        ...config.styles.postcssLoaderOptions
      })
    );

    await pipeline.dest(config.dest.css);
  }
}
