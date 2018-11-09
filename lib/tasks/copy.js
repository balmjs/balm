class Copy extends BalmTask {
  constructor(input = '', output = '', renameOptions = {}) {
    super('copy');

    this.input = input;
    this.output = output;
    this.renameOptions = renameOptions;
  }

  get task() {
    return () => {
      return src(BalmFile.absPaths(this.input))
        .pipe($.rename(this.renameOptions))
        .pipe(dest(BalmFile.absPaths(this.output)));
    };
  }
}

export default Copy;
