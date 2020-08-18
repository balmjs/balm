import { HookOptions } from '@balm-core/index';

class CopyTask extends BalmJS.BalmTask {
  constructor() {
    super('copy');
  }

  recipe(
    input: string | string[],
    output: string,
    options: HookOptions = {}
  ): Function {
    const balmCopy = (): any => {
      this.init(input, output, options);

      return this.src
        .pipe(BalmJS.plugins.rename(this.customOptions))
        .pipe(gulp.dest(this.output));
    };

    return balmCopy;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default CopyTask;
