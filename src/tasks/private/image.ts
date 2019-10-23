class ImageTask extends BalmJS.BalmTask {
  constructor() {
    super('image');

    const excludeGlobs: string[] = [];
    for (const imageFolder of BalmJS.config.styles.sprites) {
      excludeGlobs.push(path.join(`!${BalmJS.config.src.img}`, imageFolder));
      excludeGlobs.push(
        path.join(`!${BalmJS.config.src.img}`, imageFolder, '*.png')
      );
    }

    this.defaultInput = [
      BalmJS.file.matchAllFiles(BalmJS.config.src.img),
      ...excludeGlobs
    ];
    this.defaultOutput = BalmJS.config.dest.img;
  }

  fn = (): any => {
    this.init();

    return (
      gulp
        .src(BalmJS.file.absPaths(this.input), {
          since: gulp.lastRun(BalmJS.toNamespace('image') as string)
        })
        // .pipe(
        //   BalmJS.plugins.plumber((error: any): void => {
        //     BalmJS.logger.error(`${this.name} task`, error.message);
        //   })
        // )
        .pipe($.imagemin())
        .pipe(gulp.dest(BalmJS.file.absPath(this.output)))
    );
  };
}

export default ImageTask;
