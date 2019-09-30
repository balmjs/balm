import webpackConfig from '../../bundler';
import { ObjectEntry } from '../../config/types';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  recipe(
    cb: Function,
    input?: string | string[] | ObjectEntry,
    output?: string,
    customOptions?: any
  ): void {
    const isHook = !!input;
    this.init(input || BalmJS.config.scripts.entry, output, customOptions);

    BalmJS.webpackCompiler = webpack(
      webpackConfig(this.input, this.output, this.customOptions, isHook),
      (err: any, stats: any): void => {
        // Handle errors here
        if (err) {
          BalmJS.logger.error(`${this.name} task`, err.stack || err);
          if (err.details) {
            BalmJS.logger.error(`${this.name} task`, err.details);
          }
          return;
        }

        if (BalmJS.config.logs.level <= BalmJS.LogLevel.Info) {
          console.log(stats.toString(BalmJS.config.scripts.stats));
        }

        // Done processing
        cb();
      }
    );
  }

  fn(cb: Function): void {
    this.recipe(cb);
  }
}

export default ScriptTask;
