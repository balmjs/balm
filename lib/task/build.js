class Build {
  get name() {
    return 'build';
  }
  get deps() {
    return [
      'lint',
      config.static ? 'html' : 'version',
      'images',
      'fonts',
      'extras'
    ];
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
