import { RenameOptions } from '../../config/types';

class CopyTask extends BalmJS.BalmTask {
  constructor() {
    super('copy');
  }

  recipe(
    input: string | string[],
    output: string,
    renameOptions?: string | Function | RenameOptions,
    gulpSrcOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, renameOptions, gulpSrcOptions);

      return this.src
        .pipe(BalmJS.plugins.rename(this.customOptions))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default CopyTask;
