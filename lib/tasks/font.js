/**
 * 2. Icon Font
 */
class Font extends Task {
  constructor() {
    super('fonts');
  }

  get fn() {
    return () => {
      return gulp
        .src(
          require('main-bower-files')(
            '**/*.{eot,svg,ttf,woff,woff2}',
            {
              paths: config.workspace
            },
            err => {
              logger.warn('[Font]', err, config.debug); // Continue
            }
          ).concat(`${config.source.font}/**/*`)
        )
        .pipe(
          $.if(
            config.production,
            gulp.dest(config.target.font),
            gulp.dest(config.tmp.font)
          )
        );
    };
  }
}

export default Font;
