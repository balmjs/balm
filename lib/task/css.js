class Css extends Task {
  constructor() {
    super('css');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = this.output) => {
      let processors = [
        require('precss')(),
        require('autoprefixer')({
          browsers: config.styles.autoprefixer
        })
      ];

      return gulp.src(this.getAbsPaths(input))
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.postcss(processors, {
          parser: require('postcss-scss')
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(output))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Css;
