import { webpack, webpackConfig } from '../../bundler/webpack/index.js';
import compiling from '../../utilities/compiling.js';
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

      compiling.start();
      BalmJS.webpackCompiler = webpack(
        webpackConfig(this.input, this.output, customOptions, isHook),
        (error: BalmError, stats: any): void => {
          compiling.stop();

          try {
            const scriptLogLevel: number = stats.hasErrors()
              ? BalmJS.LogLevel.Error
              : stats.hasWarnings()
              ? BalmJS.LogLevel.Warn
              : BalmJS.LogLevel.Info;

            if (BalmJS.config.logs.level <= scriptLogLevel) {
              console.log(stats.toString(BalmJS.config.scripts.stats));
            }
          } catch (e) {
            // Handle errors here
            BalmJS.logger.error(`${this.name} task`, error.stack || error);

            if (error.details) {
              BalmJS.logger.error(`${this.name} task`, error.details);
            }

            return;
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
