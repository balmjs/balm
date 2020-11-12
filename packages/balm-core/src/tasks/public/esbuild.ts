import esbuild from '../../bundler/esbuild';
import { BuildOptions, TransformOptions } from '@balm-core/index';

class EsbuildTask extends BalmJS.BalmTask {
  constructor() {
    super('esbuild');

    this.defaultOutput = BalmJS.config.dest.js;
  }

  recipe(
    input?: string | string[],
    output?: string,
    customOptions: BuildOptions | TransformOptions = {}
  ): Function {
    const balmScript = (callback: Function): void => {
      this.init(input || BalmJS.config.scripts.entry, output);

      esbuild(
        this.input || BalmJS.file.defaultEntry,
        this.output,
        customOptions,
        callback
      );
    };

    return balmScript;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default EsbuildTask;
