class Zip extends BalmTask {
  constructor(input = '', output = '') {
    super('zip');

    this.input =
      input || path.join(config.roots.target, config.paths.target.base, '**/*');
    this.output = output || '.';
  }

  get task() {
    return () => {
      return src(BalmFile.absPaths(this.input))
        .pipe($.zip(config.zip))
        .pipe(dest(BalmFile.absPaths(this.output)));
    };
  }
}

export default Zip;
