class WatchTask extends BalmJS.BalmTask {
  constructor() {
    super('watch');
  }

  recipe(handler: Function): void {
    if (BalmJS.config.env.isDev && BalmJS.watcher) {
      BalmJS.watching = true;

      try {
        handler(BalmJS.watcher, server.reload);
      } catch (error) {
        BalmJS.logger.error('balm hook', error.message);
      }
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export default WatchTask;
