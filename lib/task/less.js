class Less {
  get name() {
    return 'less';
  }
  get deps() {
    return ['sprites'];
  }
  get fn() {
    return (input = '', output = config.tmp.css) => {
      input = (typeof input !== 'function') ? input : config.source.css + '/**/*.less'; // TODO: input type is function???

      return gulp.src(input)
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
          browsers: config.styles.autoprefixer
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(output));
    };
  }
}

export default Less;
