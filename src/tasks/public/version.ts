class VersionTask extends BalmJS.BalmTask {
  constructor() {
    super('version');
  }

  recipe(
    input?: string | string[],
    output?: string,
    customOptions?: object
  ): void {
    this.init(input, output, customOptions);

    this.src
      .pipe($.revAll.revision(this.customOptions))
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)))
      .pipe($.revAll.versionFile())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }

  fn(cb: Function): void {
    cb();
  }
}

export default VersionTask;
