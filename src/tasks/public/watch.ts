class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');

    this.defaultInput = `${BalmJS.config.src.base}/**/*`;
  }

  recipe(handler: Function): void {
    if (BalmJS.config.env.isDev) {
      gulp
        .watch([`${BalmJS.config.src.base}/**/*`, ...this.server.watchFiles])
        .on('change', function(path: string) {
          BalmJS.logger.info('watch task', `File '${path}' was changed`);
          console.log(handler);
          handler(path);
        });
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export = WatchTask;
