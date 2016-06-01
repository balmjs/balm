class Build {
  get name() {
    return 'build';
  }
  get deps() {
    return ['lint', 'html', 'images', 'fonts', 'extras'];
  }
  get fn() {
    return () => {
      return gulp.src(config.dist.base + '/**/*').pipe($.size({
        title: 'build',
        gzip: true
      }));
    };
  }
}

export default Build;
