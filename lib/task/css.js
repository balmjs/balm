class Css extends BalmJS.Task {
  constructor() {
    super('css');

    this.input = path.join(config.roots.source, config.paths.source.css, '**', '!(_*).css');
  }
  get deps() {
    return this.getSpriteTasks();
  }
  get fn() {
    return (input = this.input, output = config.tmp.css) => {
      let processors = [
        require('precss')(),
        require('autoprefixer')({
          browsers: config.styles.autoprefixer
        })
        // require('css-mqpacker')()
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
