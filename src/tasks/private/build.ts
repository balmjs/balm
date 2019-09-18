class BuildTask extends BalmJS.BalmTask {
  constructor() {
    super('build');

    this.defaultInput = `${BalmJS.config.dest.base}/**/*`;
  }

  fn(): void {
    this.init();

    gulp.src(BalmJS.file.absPaths(this.input)).pipe(
      $.size({
        title: this.name,
        gzip: true
      })
    );
  }
}

export = BuildTask;
