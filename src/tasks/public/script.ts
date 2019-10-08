import webpackConfig from '../../bundler';
import { ObjectEntry } from '../../config/types';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  recipe(
    input?: string | string[] | ObjectEntry,
    output?: string,
    customOptions: any = {}
  ): any {
    return (cb: Function): void => {
      const isHook = !!input;
      this.init(input || BalmJS.config.scripts.entry, output);

      BalmJS.webpackCompiler = webpack(
        webpackConfig(this.input, this.output, customOptions, isHook),
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
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default ScriptTask;
