import buildLibrary from '../../bundler/rollup';
import { InputOptions, OutputOptions } from '@balm-core/index';

class RollupTask extends BalmJS.BalmTask {
  constructor() {
    super('rollup');
  }

  recipe(
    input: InputOptions,
    output: OutputOptions | OutputOptions[]
  ): Function {
    const balmBundler = (callback: Function): void => {
      buildLibrary(input, output, callback);
    };

    return balmBundler;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default RollupTask;
