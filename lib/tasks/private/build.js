class BuildTask extends BalmTask {
  constructor() {
    super('build');

    this.input = `${config.target.base}/**/*`;
  }

  get deps() {
    let tasks = ['html', 'images', 'media', 'fonts', 'extras'];

    if (!config.static) {
      tasks.shift();
      tasks.pop();
    }

    if (config.scripts.eslint) {
      tasks.unshift('lint');
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

export default BuildTask;
