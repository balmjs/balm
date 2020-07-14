import { build } from 'esbuild';
import webpackConfig from '../../bundler';
import { BalmEntryObject, BalmError } from '@balm-types/index';

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
  ): any {
    return (callback: Function): void => {
      const hasEsbuildOptions = BalmJS.utils.isObject(
        BalmJS.config.scripts.esbuild
      );

      if (BalmJS.config.scripts.esbuild || hasEsbuildOptions) {
        this.init(input || BalmJS.config.scripts.entryPoints, output);

        const commonEsbuildOptions = {
          outdir: this.output,
          minify: BalmJS.config.env.isProd,
          bundle: true
        };

        const esbuildOptions = hasEsbuildOptions
          ? Object.assign(BalmJS.config.scripts.esbuild, commonEsbuildOptions)
          : Object.assign(commonEsbuildOptions, {
              entryPoints: this.input
            });

        BalmJS.logger.debug('esbuild options', esbuildOptions);

        build(esbuildOptions).catch((error: BalmError) => {
          BalmJS.logger.error(`${this.name} task`, error.message);
        });
        // Done processing
        callback();
      } else {
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
      }
    };
  }

  get fn(): any {
    return this.recipe();
  }
}

export default ScriptTask;
