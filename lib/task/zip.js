class Zip {
  get name() {
    return 'zip';
  }
  get deps() {
    return [];
  }
  get fn() {
    return (input = config.target.base + '/**/*', output = '.') => {
      return gulp.src(input)
        .pipe($.zip(config.zip + '.zip'))
        .pipe(gulp.dest(output));
    };
  }
}

export default Zip;
