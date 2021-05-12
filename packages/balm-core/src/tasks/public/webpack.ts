import { webpack, webpackConfig } from '../../bundler/webpack/index.js';
import { BalmEntry, Configuration, BalmError } from '@balm-core/index';

class WebpackTask extends BalmJS.BalmTask {
  constructor() {
    super('webpack');
  }

  recipe(
    input?: BalmEntry,
    output?: string,
    customOptions: Configuration = {},
    fn?: Function
  ): Function {
    const balmBundler = (callback: Function): void => {
      this.init(input || BalmJS.config.scripts.entry, output);

      const isHook = !!input;

      BalmJS.webpackCompiler = webpack(
        webpackConfig(this.input, this.output, customOptions, isHook),
        (error: BalmError, stats: any): void => {
          // Handle errors here
          if (BalmJS.config.logs.level === BalmJS.LogLevel.Debug) {
            if (error) {
              BalmJS.logger.error(`${this.name} task`, error.stack || error);
              if (error.details) {
                BalmJS.logger.error(`${this.name} task`, error.details);
              }
              return;
            }
          }

          const scriptLogLevel: number = stats.hasErrors()
            ? BalmJS.LogLevel.Error
            : stats.hasWarnings()
            ? BalmJS.LogLevel.Warn
            : BalmJS.LogLevel.Info;

          if (BalmJS.config.logs.level <= scriptLogLevel) {
            console.log(stats.toString(BalmJS.config.scripts.stats));
          }

          fn && fn();

          // Done processing
          callback();
        }
      );
    };

    return balmBundler;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default WebpackTask;
