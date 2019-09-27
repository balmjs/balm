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

    this.src
      .pipe(BalmJS.plugins.rename(this.customOptions))
      .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  }

  fn(cb: Function): void {
    cb();
  }
}

export default CopyTask;
