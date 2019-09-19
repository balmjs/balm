class PublishTask extends BalmJS.BalmTask {
  constructor() {
    super('publish');

    this.defaultInput = [
      `${BalmJS.config.dest.static}/**/*`, // Assets
      `!${BalmJS.config.dest.base}/*.*` // HTML
    ];
    this.defaultOutput = BalmJS.config.assets.static;
  }

  recipe(
    input: string | string[],
    output: string,
    renameOptions: object = {}
  ): void {
    if (BalmJS.config.env.isProd) {
      this.init(
        path.join(BalmJS.config.dest.base, input),
        path.join(BalmJS.config.assets.root, output)
      );

      gulp
        .src(this.input, {
          allowEmpty: true
        })
        .pipe($.rename(renameOptions))
        .pipe(gulp.dest(this.output));
    }
  }

  fn(cb: Function): void {
    cb();
  }
}

export = PublishTask;
