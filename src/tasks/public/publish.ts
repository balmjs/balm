import { TemplateOption } from '../../config/types';

class PublishTask extends BalmJS.BalmTask {
  constructor() {
    super('publish');

    this.defaultInput = [
      `${BalmJS.config.dest.static}/**/*`, // Assets
      `!${BalmJS.config.dest.base}/*.*` // HTML
    ];
    this.defaultOutput = BalmJS.config.assets.static;
  }

  _release(input: string, output: string, options: object): void {
    this.init(
      path.join(BalmJS.config.dest.base, input),
      path.join(BalmJS.config.assets.root, output)
    );

    gulp
      .src(this.input, { allowEmpty: true })
      .pipe(BalmJS.plugins.rename(options))
      .pipe(gulp.dest(this.output));
  }

  recipe(
    input: string | TemplateOption[],
    output: string,
    renameOptions: object = {}
  ): void {
    if (BalmJS.config.env.isProd) {
      if (BalmJS.utils.isArray(input)) {
        (input as TemplateOption[]).forEach((template: TemplateOption) => {
          this._release(template.input, template.output, template.options);
        });
      } else {
        this._release(input as string, output, renameOptions);
      }
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export = PublishTask;
