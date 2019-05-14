import { MANIFEST } from '../../config/constants';

class ExtraTask extends BalmTask {
  constructor() {
    super('extras');

    let excludeGlobs = [];
    if (config.extras.excludes.length) {
      for (let filename of config.extras.excludes) {
        excludeGlobs.push(`!${config.source.base}/${filename}`);
      }
    }

    let includeGlobs = [];
    if (config.extras.includes.length) {
      for (let filename of config.extras.includes) {
        includeGlobs.push(`${config.source.base}/${filename}`);
      }
    }

    let defaultGlobs = [
      `${config.source.base}/*.*`, // All files in the app root directory
      `!${config.source.base}/*.html`,
      `!${config.source.base}/${MANIFEST}`,
      ...excludeGlobs,
      ...includeGlobs
    ];

    this.input = defaultGlobs;
    this.output = config.target.base;
  }

  get fn() {
    return () => {
      return src(this.input, {
        allowEmpty: true,
        dot: true
      }).pipe(dest(this.output));
    };
  }
}

export default ExtraTask;
