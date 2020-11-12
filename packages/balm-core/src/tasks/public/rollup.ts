import buildLibrary from '../../bundler/rollup';
import { InputOptions, OutputOptions } from '@balm-core/index';

class RollupTask extends BalmJS.BalmTask {
  constructor() {
    super('rollup');

    if (BalmJS.config.scripts.bundler === BalmJS.Bundler.esbuild) {
      this.defaultOutput = BalmJS.config.dest.js;
    }
  }

  recipe(
    input: InputOptions = {},
    output: OutputOptions | OutputOptions[] = {}
  ): Function {
    const balmScript = (callback: Function): void => {
      buildLibrary(input, output, callback);
    };

    return balmScript;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default RollupTask;
