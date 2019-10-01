class VersionTask extends BalmJS.BalmTask {
  constructor() {
    super('version');
  }

  recipe(
    input?: string | string[],
    output?: string,
    customOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, customOptions);

      return this.src
        .pipe($.revAll.revision(this.customOptions))
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)))
        .pipe($.revAll.versionFile())
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)));
    };
  }

  fn(cb: Function): void {
    cb();
  }
}

export default VersionTask;
