class Build extends BalmTask {
  constructor() {
    super('build');

    this.input = `${config.target.base}/**/*`;
  }

  get deps() {
    let tasks = ['lint', 'html', 'images', 'media', 'fonts'];

    if (!config.scripts.eslint) {
      tasks.shift();
    }

    if (config.static) {
      tasks.push('extras');
    }

    return parallel.apply(this, tasks);
  }

  get task() {
    return () => {
      return src(this.input).pipe(
        $.size({
          title: this.name,
          gzip: true
        })
      );
    };
  }
}

export default Build;
