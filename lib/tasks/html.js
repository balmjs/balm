import {assetsPath} from '../helpers/index';

class Html extends Task {
  constructor() {
    super('html');
  }
  getAssetsPath(type) {
    let from = config.paths.source[type];
    let to = assetsPath(config.paths.target[type]);

    let developmentPublicPath = new RegExp(`${config.assets.publicUrlPlaceholder}/${from}`, 'g');
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  getManifestPath() {
    let from = config.paths.source.img;
    let to = assetsPath(config.paths.target.img);

    let developmentPublicPath = new RegExp(`/?${from}`, 'g');
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }
  getPublicPath() {
    let publicUrl = (config.production || config.assets.publicUrl === '/')
      ? config.assets.publicUrl
      : '';
    return $.replace(`${config.assets.publicUrlPlaceholder}/`, publicUrl);
  }
  get deps() {
    return ['styles', 'scripts'];
  }
  get fn() {
    return config.static
      ? () => {
        let stream;

        if (config.production) {
          let globs = [
            `${config.source.base}/*.html`,
            `${config.source.base}/manifest.json`
          ];

          stream = gulp.src(globs)
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
            .pipe(this.getAssetsPath('media'))
            .pipe(this.getAssetsPath('img'))
            .pipe($.if('manifest.json', this.getManifestPath()))
            .pipe(this.getPublicPath())
            .pipe(gulp.dest(config.target.base));
        } else {
          stream = gulp.src(`${config.source.base}/*.html`)
            .pipe(this.getAssetsPath('css'))
            .pipe(this.getAssetsPath('js'))
            .pipe(this.getPublicPath())
            .pipe(gulp.dest(config.tmp.base));
        }

        return stream;
      }
      : BalmJS.noop;
  }
}

export default Html;
