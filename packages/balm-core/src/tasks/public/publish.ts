import mergeStream from '../../utilities/merge-stream.js';
import { RenameOptions, TemplateOption } from '@balm-core/index';

class PublishTask extends BalmJS.BalmTask {
  constructor() {
    super('publish');

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.dest.static), // Assets
      path.join(`!${BalmJS.config.dest.base}`, '*.*') // HTML
    ];
    this.defaultOutput = BalmJS.config.assets.static; // Remote dir
  }

  #release = (
    input: string,
    output: string,
    renameOptions: string | Function | RenameOptions = {}
  ): any => {
    if (input && output) {
      this.init(
        path.join(BalmJS.config.dest.base, input),
        path.join(BalmJS.config.assets.root, output) // Remote dir
      );
    } else {
      this.init();
    }

    return this.src
      .pipe(
        $.if(
          !BalmJS.utils.isArray(this.input),
          BalmJS.plugins.rename(renameOptions)
        )
      )
      .pipe(gulp.dest(this.output)); // Absolute path
  };

  recipe(
    input: string | TemplateOption[],
    output: string,
    renameOptions: string | Function | RenameOptions
  ): Function {
    const balmPublish = (callback: Function): any => {
      if (BalmJS.config.env.isProd) {
        if (BalmJS.utils.isArray(input)) {
          const tasks = (input as TemplateOption[]).map((template) =>
            this.#release(
              template.input,
              template.output,
              template.renameOptions
            )
          );
          return mergeStream(...tasks);
        } else {
          return this.#release(input as string, output, renameOptions);
        }
      } else {
        BalmJS.logger.warn(
          `${this.name} task`,
          '`mix.publish()` is only supported for production'
        );

        callback();
      }
    };

    return balmPublish;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default PublishTask;
