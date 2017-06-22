class Extra extends BalmJS.Task {
  constructor() {
    super('extras');
  }
  get fn() {
    return () => {
      let defaultGlobs = [
        `${config.source.base}/*.*`, // For all files (exclude folder)
        `!${config.source.html}/*.html`,
        `!${config.source.base}/.git*`,
        `${config.source.base}/manifest.json` // For PWA
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

      let globs = defaultGlobs.concat(excludeGlobs, includeGlobs);

      return gulp.src(globs, {dot: true})
        .pipe(gulp.dest(config.target.base));
    };
  }
}

export default Extra;
