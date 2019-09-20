class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');
  }

  recipe(handler: Function): void {
    if (BalmJS.config.env.isDev) {
      gulp
        .watch(`${BalmJS.config.src.base}/**/*`)
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
