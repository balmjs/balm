class Html extends BalmJS.Task {
  constructor() {
    super('html');
  }
  getAssetsPath(type) {
    let developmentPublicPath = new RegExp(config.html.replacement.prefix + config.html.regex[type] + config.html.replacement.end, 'g');

    let productionPublicPath = config.html.replacement.prefix + config.html.replacement.begin + path.join(config.assets.subDir, config.paths.target[type]) + config.html.replacement.end;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return config.static
      ? () => {
        let stream = gulp.src(config.source.html + '/*.html')
          .pipe($.useref({
            searchPath: [
              config.roots.tmp, config.roots.source, '.'
            ],
            base: config.workspace
          }));

        if (config.production) {
          stream = stream
            .pipe($.if('*.css', $.cssnano(config.styles.options)))
            .pipe($.if('*.html', $.htmlmin(config.html.options)));

          if (config.assets.subDir.trim()) {
            let refPath = config.assets.subDir + '/';
            // fix useref
            stream = stream.pipe($.replace(new RegExp(refPath, 'g'), ''));
          }

          // for assets
          stream = stream
            .pipe(this.getAssetsPath('css'))
            .pipe(this.getAssetsPath('js'))
            .pipe(this.getAssetsPath('img'));
        }

        return stream.pipe(gulp.dest(config.target.html));
      }
      : BalmJS.noop;
  }
}

export default Html;
