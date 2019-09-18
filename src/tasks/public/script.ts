import webpackConfig from '../../bundler';

class ScriptTask extends BalmJS.BalmTask {
  constructor() {
    super('script');
  }

  recipe(
    cb: Function,
    input?: string | string[] | { [entryChunkName: string]: string | string[] },
    output?: string,
    options?: any
  ): void {
    const isHook = !!input;
    this.init(input || BalmJS.config.scripts.entry, output);

    webpack(webpackConfig(this.input, this.output, options, isHook), function(
      err: any,
      stats: any
    ): void {
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
    });
  }

  fn = (cb: Function): void => {
    this.recipe(cb);
  };
}

export = ScriptTask;
