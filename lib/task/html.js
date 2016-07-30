class Html extends Task {
  constructor() {
    super('html');
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return !config.static ? noop : () => {
      let stream = gulp.src(config.source.html + '/*.html')
        .pipe($.useref({
          searchPath: [config.roots.tmp, config.roots.source, '.'],
          base: config.workspace
        }));

      if (config.production) {
        stream = stream.pipe($.if('*.html', $.htmlmin({
          collapseWhitespace: true
        })));
      }

      return stream.pipe(gulp.dest(config.target.html));
    };
  }
}

export default Html;
