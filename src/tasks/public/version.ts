class VersionTask extends BalmJS.BalmTask {
  constructor() {
    super('version');

    this.defaultOutput = BalmJS.config.dest.base;
  }

  get options(): object {
    return Object.assign({}, BalmJS.config.assets.options, this.customOptions);
  }

  recipe(
    input?: string | string[],
    output?: string,
    assetsOptions?: object
  ): any {
    return (): any => {
      this.init(input, output, assetsOptions);

      return this.src
        .pipe($.revAll.revision(this.options))
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
