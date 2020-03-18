import { ReplaceOptions } from '../../config/types';

class ReplaceTask extends BalmJS.BalmTask {
  constructor() {
    super('replace');
  }

  recipe(
    input: string | string[],
    output: string,
    options: ReplaceOptions
  ): any {
    return (): any => {
      this.init(input, output);

      return this.src
        .pipe($.replace(options.substr, options.replacement))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default ReplaceTask;
