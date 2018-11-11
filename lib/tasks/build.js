class Build extends BalmTask {
  constructor() {
    super('build');

    this.input = `${config.target.base}/**/*`;
  }

  get deps() {
    let tasks = ['lint', 'html', 'images', 'fonts'];

    if (!config.scripts.eslint) {
      tasks.shift();
    }

    if (config.production) {
      tasks.push('media');
    }

    if (config.static) {
      tasks.push('extras');
    }

    return tasks;
  }

  get fn() {
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
