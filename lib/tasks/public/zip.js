class Zip extends BalmTask {
  constructor(input = '', output = '', filename = 'archive.zip') {
    super('zip');

    this.input =
      input || path.join(config.roots.target, config.paths.target.base, '**/*');
    this.output = output || '.';
    this.filename = filename;
  }

  get fn() {
    return () => {
      return src(BalmFile.absPaths(this.input))
        .pipe($.zip(this.filename))
        .pipe(dest(BalmFile.absPaths(this.output)));
    };
  }
}

export default Zip;
