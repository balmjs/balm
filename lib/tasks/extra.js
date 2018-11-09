class Extra extends BalmTask {
  constructor() {
    super('extras');

    let defaultGlobs = [
      `${config.source.base}/*.*`, // For all files (exclude folder)
      `!${config.source.base}/*.html`,
      `!${config.source.base}/.git*`
    ];

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

    this.input = defaultGlobs.concat(excludeGlobs, includeGlobs);
    this.output = config.target.base;
  }

  get task() {
    return () => {
      return src(this.input, { dot: true }).pipe(dest(this.output));
    };
  }
}

export default Extra;
