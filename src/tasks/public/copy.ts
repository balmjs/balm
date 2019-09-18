class CopyTask extends BalmJS.BalmTask {
  constructor() {
    super('copy');
  }

  recipe(
    input: string | string[],
    output: string,
    renameOptions: object = {}
  ): void {
    this.init(input, output);

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe($.rename(renameOptions))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }

  fn(cb: Function): void {
    cb();
  }
}

export = CopyTask;
