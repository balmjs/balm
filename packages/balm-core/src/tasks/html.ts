import path from 'node:path';
import { BaseTask } from '../runner/task.js';
import { BalmConfig } from '../types/index.js';
import { Pipeline } from '../pipeline/pipeline.js';
import { transformHtmlmin } from '../pipeline/transforms/htmlmin.js';
import { transformReplace } from '../pipeline/transforms/replace.js';
import { PUBLIC_URL } from '../config/constants.js';

export class HtmlTask extends BaseTask {
  constructor() {
    super({ name: 'html', description: 'Process HTML templates' });
  }

  async run(config: BalmConfig): Promise<void> {
    const templateDir = config.scripts.injectHtml
      ? config.src.base
      : config.src.html;

    const pattern = path.join(templateDir, '*.html');
    const pipeline = Pipeline.from(pattern, {
      cwd: config.workspace,
      base: templateDir
    });

    // Replace %PUBLIC_URL% placeholder
    const publicUrlReplacement = config.assets.virtualDir ? `/${config.assets.virtualDir}` : '';
    pipeline.pipe(transformReplace(new RegExp(PUBLIC_URL, 'g'), publicUrlReplacement));

    if (config.env.isProd) {
      pipeline.pipe(transformHtmlmin(config.html.options));
    }

    await pipeline.dest(config.dest.html);
  }
}
