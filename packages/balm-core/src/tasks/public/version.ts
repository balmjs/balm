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
  ): Function {
    const balmVersion = (): any => {
      this.init(input, output, {
        version: assetsOptions
      });

      return this.src
        .pipe($.revAll.revision(this.options))
        .pipe(gulp.dest(this.output))
        .pipe($.revAll.versionFile())
        .pipe(gulp.dest(this.output));
    };

    return balmVersion;
  }

  fn(callback: Function): void {
    callback();
  }
}

export default VersionTask;
