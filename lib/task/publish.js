class Publish extends Task {
  constructor() {
    super('publish');
  }
  get fn() {
    return (input = '', output = '', renameObj = {}) => {
      if (config.production) {
        let dist = output ? path.join(config.publish.root, output) : this.output;

        return gulp.src(input || this.input)
          .pipe($.if('*.html', $.replace(config.publish.regex.css, this.publicCssPath)))
          .pipe($.if('*.html', $.replace(config.publish.regex.js, this.publicJsPath)))
          .pipe($.rename(renameObj))
          .pipe(gulp.dest(dist));
      }
    };
  }
}

export default Publish;
