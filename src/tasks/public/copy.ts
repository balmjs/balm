class CopyTask extends BalmJS.BalmTask {
  constructor() {
    super('copy');
  }

  recipe(
    input: string | string[],
    output: string,
    renameOptions?: object
  ): void {
    this.init(input, output, renameOptions);

    gulp
      .src(BalmJS.file.absPaths(this.input))
      .pipe(BalmJS.plugins.rename(this.customOptions))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }

  fn(cb: Function): void {
    cb();
  }
}

export = CopyTask;
