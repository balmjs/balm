class Css extends Task {
  constructor() {
    super('css');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = [config.source.css + '/**/*.css', '!' + config.source.css + '/**/_*.css'], output = config.tmp.css) => {
      let processors = [
        require('precss')(),
        require('autoprefixer')({
          browsers: config.styles.autoprefixer
        })
      ];

      return gulp.src(input)
        .pipe($.plumber())
        .pipe($.postcss(processors, {
          parser: require('postcss-scss')
        }))
        .pipe(gulp.dest(output))
        .pipe(reload({
          stream: true
        }));
    };
  }
}

export default Css;
