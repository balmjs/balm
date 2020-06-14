import webpackConfig from '../../bundler';
import { BalmEntryObject, BalmError } from '@balm/index';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  recipe(
    input?: string | string[] | BalmEntryObject,
    output?: string,
    customOptions: any = {}
  ): any {
    return (callback: Function): void => {
      const isHook = !!input;
      this.init(input || BalmJS.config.scripts.entry, output);

      BalmJS.webpackCompiler = webpack(
        webpackConfig(this.input, this.output, customOptions, isHook),
        (error: BalmError, stats: any): void => {
          // Handle errors here
          // if (error) {
          //   BalmJS.logger.error(`${this.name} task`, error.stack || err);
          //   if (error.details) {
          //     BalmJS.logger.error(`${this.name} task`, error.details);
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
          callback();
        }
      );
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default ScriptTask;
