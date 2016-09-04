/**
 * 2. Icon Font
 */
class Font extends BalmJS.Task {
  constructor() {
    super('fonts');

    this.dist = config.production ?
      config.target.font :
      config.tmp.font;
  }
  get fn() {
    return () => {
      return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', {
        paths: config.workspace
      }, err => {
        BalmJS.log('Font', err); // continue
      }).concat(config.source.font + '/**/*')).pipe(gulp.dest(this.dist));
    };
  }
}

export default Font;
