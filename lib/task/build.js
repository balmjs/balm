class Build {
  get name() {
    return 'build';
  }
  get deps() {
    return config.static ? ['lint', 'html', 'images', 'fonts', 'extras'] : ['version'];
  }
  get fn() {
    return () => {
      return gulp.src(config.target.base + '/**/*')
        .pipe($.size({
          title: 'build',
          gzip: true
        }));
    };
  }
}

export default Build;
