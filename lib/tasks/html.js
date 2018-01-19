import { MANIFEST } from '../config/constants';

class Html extends Task {
  constructor() {
    super('html');
  }

  getAssetsPath(type) {
    let from = config.paths.source[type];
    let to = File.assetsPath(config.paths.target[type]);

    let developmentPublicPath = new RegExp(
      `${config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  getManifestPath() {
    let from = config.paths.source.img;
    let to = File.assetsPath(config.paths.target.img);

    let developmentPublicPath = new RegExp(`/?${from}`, 'g');
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  get deps() {
    return config.production ? ['styles', 'scripts'] : [];
  }

  get fn() {
    return config.static
      ? () => {
          let stream;

          if (config.production) {
            let globs = [
              `${config.source.base}/*.html`,
              `${config.source.base}/${MANIFEST}`
            ];

            stream = gulp
              .src(globs)
              .pipe(
                $.useref({
                  searchPath: [config.roots.tmp, config.roots.source, '.'],
                  base: config.workspace
                })
              )
              .pipe($.if(/\.css$/, $.postcss([cssnano(config.styles.options)])))
              .pipe($.if(/\.html$/, $.htmlmin(config.html.options)))
              .pipe(this.getAssetsPath('css'))
              .pipe(this.getAssetsPath('js'))
              .pipe(this.getAssetsPath('img'))
              .pipe(this.getAssetsPath('media'))
              .pipe($.if(MANIFEST, this.getManifestPath()));

            if (config.cache) {
              stream = stream.pipe($.if(MANIFEST, File.setPublicPath()));
            } else {
              stream = stream.pipe(File.setPublicPath());
            }

            stream = stream.pipe(gulp.dest(config.target.base));
          } else {
            stream = gulp
              .src(`${config.source.base}/*.html`)
              .pipe(this.getAssetsPath('css'))
              .pipe(this.getAssetsPath('js'))
              .pipe(File.setPublicPath())
              .pipe(gulp.dest(config.tmp.base));
          }

          return stream;
        }
      : BalmJS.noop;
  }
}

export default Html;
