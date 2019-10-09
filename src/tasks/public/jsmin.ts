import { HookOptions } from '../../config/types';

class JsminTask extends BalmJS.BalmTask {
  constructor() {
    super('jsmin');
  }

  recipe(
    input: string | string[],
    output: string,
    options: HookOptions = {}
  ): any {
    return (): any => {
      this.init(input, output, options);

      const renameOptions = options.renameOptions || { suffix: '.min' };

      return this.src
        .pipe(BalmJS.plugins.jsmin(this.customOptions))
        .pipe(BalmJS.plugins.rename(renameOptions))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default JsminTask;
