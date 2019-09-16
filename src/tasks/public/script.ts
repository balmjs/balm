import webpackConfig from '../../bundler';

class ScriptTask extends BalmJS.BalmStyleTask {
  constructor() {
    super('script');

    this.defaultOutput = BalmJS.config.dest.js;
  }

  recipe(cb: Function, input?: string | string[], output?: string): void {
    this.init(input, output);

    webpack(
      webpackConfig(this.input, this.output),
      (err: any, stats: any): void => {
        // Handle errors here
        if (err) {
          BalmJS.logger.error('<script task>', err.stack || err);
          if (err.details) {
            BalmJS.logger.error('<script task>', err.details);
          }
          return;
        }

        console.log(stats.toString(BalmJS.config.scripts.stats));

        // Done processing
        cb();
      }
    );
  }

  fn = (cb: Function): void => {
    this.recipe(cb);
  };
}

export = ScriptTask;
