class PublishTask extends BalmTask {
  constructor(input = '', output = '', renameOptions = {}) {
    super('publish'); // Just for production

    this.input = input
      ? path.join(config.target.base, input)
      : [`${config.target.static}/**/*`, `!${config.target.base}/*.*`];
    this.output = output
      ? path.join(config.assets.root, output)
      : config.assets.static;
    this.renameOptions = renameOptions;
  }

  get fn() {
    return () => {
      return src(this.input, {
        allowEmpty: true
      })
        .pipe($.rename(this.renameOptions))
        .pipe(dest(this.output));
    };
  }
}

export default PublishTask;
