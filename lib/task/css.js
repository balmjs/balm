class Css {
  get name() {
    return 'css';
  }
  get deps() {
    let tasks = [];

    if (config.sprites.image.length) {
      tasks.push('sprites');
    }
    if (config.sprites.svg.length) {
      tasks.push('svg');
    }

    return tasks;
  }
  get fn() {
    return (input = config.source.css + '/**/*.css', output = config.tmp.css) => {
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
        .pipe(gulp.dest(output));
    };
  }
}

export default Css;
