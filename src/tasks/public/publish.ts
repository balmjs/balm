import { RenameOptions, TemplateOption } from '../../config/types';

class PublishTask extends BalmJS.BalmTask {
  constructor() {
    super('publish');

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.dest.static), // Assets
      path.join(`!${BalmJS.config.dest.base}`, '*.*') // HTML
    ];
    this.defaultOutput = BalmJS.config.assets.static; // Remote dir
  }

  private _release(
    input: string,
    output: string,
    renameOptions: string | Function | RenameOptions = {}
  ): void {
    if (input && output) {
      this.init(
        path.join(BalmJS.config.dest.base, input),
        path.join(BalmJS.config.assets.root, output) // Remote dir
      );
    } else {
      this.init();
    }

    this.src
      .pipe(
        $.if(
          !BalmJS.utils.isArray(this.input),
          BalmJS.plugins.rename(renameOptions)
        )
      )
      .pipe(gulp.dest(this.output)); // Absolute path
  }

  recipe(
    input: string | TemplateOption[],
    output: string,
    renameOptions: string | Function | RenameOptions
  ): any {
    return (cb: Function): void => {
      if (BalmJS.config.env.isProd) {
        if (BalmJS.utils.isArray(input)) {
          (input as TemplateOption[]).forEach((template: TemplateOption) => {
            this._release(
              template.input,
              template.output,
              template.renameOptions
            );
          });
        } else {
          this._release(input as string, output, renameOptions);
        }
      } else {
        BalmJS.logger.warn(
          `${this.name} task`,
          '`mix.publish()` is only supported for production'
        );
      }

      cb();
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default PublishTask;
