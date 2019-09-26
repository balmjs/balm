class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');

    this.defaultInput = `${BalmJS.config.src.base}/**/*`;
  }

  recipe(handler: Function): void {
    if (BalmJS.config.env.isDev) {
      BalmJS.watching = true;

      gulp
        .watch([
          `${BalmJS.config.src.base}/**/*`,
          ...BalmJS.config.server.watchFiles
        ])
        .on('change', function(path: string) {
          BalmJS.logger.debug('watch task', `File '${path}' was changed`);

          try {
            handler(path);
          } catch (error) {
            BalmJS.logger.error('balm hook', error.message);
          }
        });
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export default WatchTask;
