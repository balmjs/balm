class Html extends BalmJS.Task {
  constructor() {
    super('html');
  }
  getAssetsPath(type) {
    let from = config.html.regex[type];
    let to = path.join(config.assets.subDir, config.paths.target[type]);

    let developmentPublicPath = new RegExp(`${config.assets.publicUrlPlaceholder}/${from}`, 'g');
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return config.static
      ? () => {
        if (config.production) {
          let globs = [
            `${config.source.base}/*.html`,
            `${config.source.base}/manifest.json`
          ];

          let stream = gulp.src(globs)
            .pipe($.useref({
              searchPath: [
                config.roots.tmp, config.roots.source, '.'
              ],
              base: config.workspace
            }))
            .pipe($.if('*.css', $.cssnano(config.styles.options)))
            .pipe($.if('*.html', $.htmlmin(config.html.options)))
            .pipe(this.getAssetsPath('css'))
            .pipe(this.getAssetsPath('js'))
            .pipe(this.getAssetsPath('img'));

          if (!config.cache) {
            stream = stream.pipe(this.getPublicPath());
          }

          return stream.pipe(gulp.dest(config.target.base));
        } else {
          gulp.src(`${config.source.base}/*.html`)
            .pipe(this.getPublicPath())
            .pipe(gulp.dest(config.tmp.base));
        }
      }
      : BalmJS.noop;
  }
}

export default Html;
