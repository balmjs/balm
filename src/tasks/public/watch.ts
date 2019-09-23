class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');

    this.defaultInput = `${BalmJS.config.src.base}/**/*`;
  }

  recipe(handler: Function): void {
    if (BalmJS.config.env.isDev) {
      gulp
        .watch([
          `${BalmJS.config.src.base}/**/*`,
          ...BalmJS.config.server.watchFiles
        ])
        .on('change', function(path: string) {
          BalmJS.logger.info('watch task', `File '${path}' was changed`);
          console.log(handler.toString());
          handler(path);

          // BalmJS.input = 'aaa';
          // BalmJS.output = 'bbb';

          // gulp.parallel('balm:sass')();
        });
    }
  }
}

export = WatchTask;
