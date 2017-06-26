class Html extends BalmJS.Task {
  constructor() {
    super('html');
  }
  getAssetsPath(type) {
    let prefix = config.html.replacement.prefix;
    let begin = config.html.replacement.begin;
    let end = config.html.replacement.end;
    let from = config.html.regex[type];
    let to = path.join(config.assets.subDir, config.paths.target[type]);

    let developmentPublicPath = new RegExp(`${prefix}/?${from}${end}`, 'g');
    let productionPublicPath = `${prefix}${begin}${to}${end}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    let globs = [
      `${config.source.html}/*.html`,
      `${config.source.base}/manifest.json`
    ];

    return config.static
      ? () => {
        let stream = gulp.src(globs)
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
            let refPath = `${config.assets.subDir}/`;
            // Fix useref
            stream = stream.pipe($.replace(new RegExp(refPath, 'g'), ''));
          }

          // For assets
          stream = stream
            .pipe(this.getAssetsPath('css'))
            .pipe(this.getAssetsPath('js'))
            .pipe(this.getAssetsPath('img'));
        }

        return stream.pipe($.if('*.html', gulp.dest(config.target.html), gulp.dest(config.target.base)));
      }
      : BalmJS.noop;
  }
}

export default Html;
