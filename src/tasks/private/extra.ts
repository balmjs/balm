import { MANIFEST } from '../../config/constants';

class ExtraTask extends BalmJS.BalmTask {
  constructor() {
    super('extra');

    const includeGlobs: string[] = [];
    if (BalmJS.config.extras.includes.length) {
      for (const filename of BalmJS.config.extras.includes) {
        includeGlobs.push(`${BalmJS.config.src.base}/${filename}`);
      }
    }

    const excludeGlobs: string[] = [];
    if (BalmJS.config.extras.excludes.length) {
      for (const filename of BalmJS.config.extras.excludes) {
        excludeGlobs.push(`!${BalmJS.config.src.base}/${filename}`);
      }
    }

    const defaultGlobs: string[] = [
      `${BalmJS.config.src.base}/*.*`, // All files but ignore all folders in the app root directory
      `!${BalmJS.config.src.base}/*.html`,
      `!${BalmJS.config.src.base}/${MANIFEST}`,
      ...includeGlobs,
      ...excludeGlobs
    ];

    this.defaultInput = defaultGlobs;
    this.defaultOutput = BalmJS.config.dest.base;
  }

  fn = (): any => {
    this.init();

    return this.src.pipe(gulp.dest(BalmJS.file.absPath(this.output)));
  };
}

export default ExtraTask;
