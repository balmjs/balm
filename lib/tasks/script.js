class Script extends BalmTask {
  constructor() {
    super('scripts');

    this.input = `${config.tmp.js}/**/*`;
  }

  get deps() {
    return parallel('webpack');
  }

  get task() {
    return config.production
      ? BalmJS.noop
      : () => {
          return src(this.input).pipe(browserSync.stream());
        };
  }
}

export default Script;
