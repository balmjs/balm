class ZipTask extends BalmJS.BalmTask {
  constructor() {
    super('zip');

    this.defaultInput = BalmJS.file.matchAllFiles(BalmJS.config.dest.base);
    this.defaultOutput = '.';
  }

  recipe(
    input?: string | string[],
    output?: string,
    filename = 'archive.zip'
  ): any {
    return (): any => {
      this.init(input, output);

      return this.src
        .pipe($.zip(filename))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(callback: Function): void {
    callback();
  }
}

export default ZipTask;
