import esbuild from '../../bundler/esbuild';
import webpackConfig from '../../bundler/webpack';
import compiling from '../../utilities/compiling';
import { BalmEntryObject, BalmError } from '@balm-core/index';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');

    if (BalmJS.config.scripts.esbuild) {
      this.defaultOutput = BalmJS.config.dest.js;
    }
  }

  recipe(
    input?: string | string[] | BalmEntryObject,
    output?: string,
    customOptions: any = {}
  ): Function {
    const balmScript = (callback: Function): void => {
      this.init(input || BalmJS.config.scripts.entry, output);

      if (BalmJS.config.scripts.esbuild) {
        esbuild(
          this.input || BalmJS.file.defaultEntry,
          this.output,
          customOptions,
          callback
        );
      } else {
        compiling.start();

        const isHook = !!input;

        BalmJS.webpackCompiler = webpack(
          webpackConfig(this.input, this.output, customOptions, isHook),
          (error: BalmError, stats: any): void => {
            compiling.stop();

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
      }
    };

    return balmScript;
  }

  get fn(): Function {
    return this.recipe();
  }
}

export default ScriptTask;
