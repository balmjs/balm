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
            '.'
          ],
          base: config.workspace
        }));

      if (config.production) {
        stream = stream
          .pipe($.if('*.css', $.cssnano(config.styles.options)))
          .pipe($.if('*.html', $.htmlmin({
            collapseWhitespace: true
          })))
          // for assets
          .pipe($.replace(new RegExp(config.html.regex.css, 'g'), this.publicCssPath))
          .pipe($.replace(new RegExp(config.html.regex.js, 'g'), this.publicJsPath))
          .pipe($.replace(new RegExp(config.html.regex.img, 'g'), this.publicImgPath));

        if (config.assets.subDir.trim()) {
          let refPath = config.assets.subDir + '/';
          // fix useref
          stream = stream.pipe($.replace(new RegExp(refPath + refPath, 'g'), refPath));
        }
      }

      return stream.pipe(gulp.dest(config.target.html));
    } : noop;
  }
}

export default Html;
