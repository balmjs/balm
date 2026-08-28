import mergeStream from '../../utilities/merge-stream.js';
import { RenameOptions, TemplateOption } from '@balm-core/index.js';

class PublishTask extends BalmJS.BalmTask {
  constructor() {
    super('publish');

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.dest.static), // Assets
      node.path.join(`!${BalmJS.config.dest.base}`, '*.*') // HTML
    ];
    this.defaultOutput = BalmJS.config.assets.static; // Remote dir
  }

  #release = (
    input: string,
    output: string,
    renameOptions: string | Function | RenameOptions = {}
  ): any => {
    let srcPath: string | string[];
    let destPath: string;

    if (input && output) {
      srcPath = BalmJS.file.absPaths(
        node.path.join(BalmJS.config.dest.base, input)
      );
      destPath = BalmJS.file.absPath(
        node.path.join(BalmJS.config.assets.root, output)
      );
    } else {
      this.init();
      srcPath = this.input;
      destPath = this.output;
    }

    return gulp
      .src(srcPath, { allowEmpty: true })
      .pipe(
        $.if(
          !BalmJS.utils.isArray(srcPath),
          BalmJS.plugins.rename(renameOptions)
        )
      )
      .pipe(gulp.dest(destPath));
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
