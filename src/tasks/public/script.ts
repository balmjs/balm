import webpackConfig from '../../bundler';
import { BalmEntryObject } from '../../config/types';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  recipe(
    input?: string | string[] | BalmEntryObject,
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
          // if (err) {
          //   BalmJS.logger.error(`${this.name} task`, err.stack || err);
          //   if (err.details) {
          //     BalmJS.logger.error(`${this.name} task`, err.details);
          //   }
          //   return;
          // }

          const scriptLogLevel: number = stats.hasErrors()
            ? BalmJS.LogLevel.Error
            : stats.hasWarnings()
            ? BalmJS.LogLevel.Warn
            : BalmJS.LogLevel.Info;

          if (BalmJS.config.logs.level <= scriptLogLevel) {
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
