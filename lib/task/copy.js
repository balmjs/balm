class Copy extends Task {
  constructor() {
    super('copy');

    this.publicCssPath = '"/' + path.join(config.publish.publicPath, config.paths.target.css) + '/';
    this.publicJsPath = '"/' + path.join(config.publish.publicPath, config.paths.target.js) + '/';
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (input && output) {
        return gulp.src(input)
          .pipe($.if('*.html', $.replace(/"css\//g, this.publicCssPath)))
          .pipe($.if('*.html', $.replace(/"js\//g, this.publicJsPath)))
          .pipe($.rename(renameObj))
          .pipe(gulp.dest(output));
      }
    };
  }
}

export default Copy;
