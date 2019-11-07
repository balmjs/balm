import { RenameOptions } from '../../config/types';

class JsminTask extends BalmJS.BalmTask {
  constructor() {
    super('jsmin');
  }

  get options(): object {
    return Object.assign({}, BalmJS.config.scripts.options, this.customOptions);
  }

  recipe(
    input: string | string[],
    output: string,
    terserOptions?: object,
    renameOptions: string | Function | RenameOptions = { suffix: '.min' }
  ): any {
    return (): any => {
      this.init(input, output, terserOptions);

      return this.src
        .pipe(BalmJS.plugins.jsmin(this.options))
        .pipe(BalmJS.plugins.rename(renameOptions))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default JsminTask;
