import { MinifyOptions, RenameOptions, HookOptions } from '@balm-core/index';

class JsminTask extends BalmJS.BalmTask {
  constructor() {
    super('jsmin');
  }

  get options(): MinifyOptions {
    const defaultOptions = Object.assign(
      {},
      BalmJS.config.scripts.minifyOptions
    );

    return BalmJS.utils.deepMerge(defaultOptions, this.customOptions);
  }

  recipe(
    input: string | string[],
    output: string,
    options: HookOptions = {}
  ): Function {
    const balmJsmin = (): any => {
      this.init(input, output, options);

      const renameOptions:
        | string
        | Function
        | RenameOptions = options.rename || { suffix: '.min' };

      return this.src
        .pipe(BalmJS.plugins.jsmin(this.options))
        .pipe(BalmJS.plugins.rename(renameOptions))
        .pipe(gulp.dest(this.output));
    };

    return balmJsmin;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default JsminTask;
