const MANIFEST = 'manifest';

class Html extends BalmJS.Task {
  constructor() {
    super('html');
  }
  getAssetsPath(type) {
    let prefix = (type === MANIFEST) ? '' : config.html.replacement.prefix;
    let begin = (type === MANIFEST) ? '' : config.html.replacement.begin;
    let end = (type === MANIFEST) ? '' : config.html.replacement.end;

    let developmentPublicPath = new RegExp(prefix + config.html.regex[type] + end, 'g');
    let productionPublicPath = prefix + begin + path.join(config.assets.subDir, config.paths.target[type]) + end;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  setPublicUrl() {
    return $.replace(/%PUBLIC_URL%/g, config.html.publicUrl);
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    let globs = [
      `${config.source.html}/*.html`,
      `${config.source.base}/${MANIFEST}.json`
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
            .pipe($.if(`${MANIFEST}.json`, this.getAssetsPath(MANIFEST), this.getAssetsPath('img')))
            .pipe(this.setPublicUrl());
        }

        return stream.pipe(gulp.dest(config.target.html));
      }
      : BalmJS.noop;
  }
}

export default Html;
