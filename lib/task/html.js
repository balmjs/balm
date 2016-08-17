class Html extends Task {
  constructor() {
    super('html');
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return config.static ? () => {
      let stream = gulp.src(config.source.html + '/*.html')
        .pipe($.useref({
          searchPath: [
            config.roots.tmp,
            config.roots.source,
            path.join(config.workspace, '.')
          ],
          base: config.workspace
        }));

      if (config.production) {
        stream = stream
          .pipe($.if('*.html', $.htmlmin({
            collapseWhitespace: true
          })))
          // for assets
          .pipe($.replace(config.html.regex.css, this.publicCssPath))
          .pipe($.replace(config.html.regex.js, this.publicJsPath))
          .pipe($.replace(config.html.regex.img, this.publicImgPath));
      }

      return stream.pipe(gulp.dest(config.target.html));
    } : noop;
  }
}

export default Html;
