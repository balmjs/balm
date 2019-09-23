import { MANIFEST } from '../../config/constants';

class ExtraTask extends BalmJS.BalmTask {
  constructor() {
    super('extra');

    const includeGlobs = [];
    if (BalmJS.config.extras.includes.length) {
      for (const filename of BalmJS.config.extras.includes) {
        includeGlobs.push(`${BalmJS.config.src.base}/${filename}`);
      }
    }

    const excludeGlobs = [];
    if (BalmJS.config.extras.excludes.length) {
      for (const filename of BalmJS.config.extras.excludes) {
        excludeGlobs.push(`!${BalmJS.config.src.base}/${filename}`);
      }
    }

    const defaultGlobs = [
      `${BalmJS.config.src.base}/*.*`, // All files but ignore all folders in the app root directory
      `!${BalmJS.config.src.base}/*.html`,
      `!${BalmJS.config.src.base}/${MANIFEST}`,
      ...includeGlobs,
      ...excludeGlobs
    ];

    this.defaultInput = defaultGlobs;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn(): void {
    this.init();

    gulp
      .src(BalmJS.file.absPaths(this.input), { dot: true })
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export = ExtraTask;
