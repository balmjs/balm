class ZipTask extends BalmJS.BalmTask {
  constructor() {
    super('zip');

    this.defaultInput = path.join(BalmJS.config.dest.base, '**/*');
    this.defaultOutput = '.';
  }

  recipe(
    input?: string | string[],
    output?: string,
    filename = 'archive.zip'
  ): void {
    this.init(input, output);

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe($.zip(filename))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }

  fn(cb: Function): void {
    cb();
  }
}

export default ZipTask;
