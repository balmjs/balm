import { MANIFEST } from '../config/constants';

class Html extends BalmTask {
  constructor() {
    super('html');
  }

  getAssetsPath(type) {
    let from = config.paths.source[type];
    let to = BalmFile.assetsPath(config.paths.target[type]);

    let developmentPublicPath = new RegExp(
      `${config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    let productionPublicPath = `${config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  getManifestPath() {
    let from = config.paths.source.img;
    let to = BalmFile.assetsPath(config.paths.target.img);

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
          let input = config.production
            ? [
                `${config.source.base}/*.html`,
                `${config.source.base}/${MANIFEST}`
              ]
            : `${config.source.base}/*.html`;
          let output = config.production ? config.target.base : config.tmp.base;

          if (config.production) {
            stream = src(input)
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
              stream = stream.pipe($.if(MANIFEST, BalmFile.setPublicPath()));
            } else {
              stream = stream.pipe(BalmFile.setPublicPath());
            }

            stream = stream.pipe(dest(output));
          } else {
            stream = src(input)
              .pipe(this.getAssetsPath('css'))
              .pipe(this.getAssetsPath('js'))
              .pipe(BalmFile.setPublicPath())
              .pipe(dest(output));
          }

          return stream;
        }
      : BalmJS.noop;
  }
}

export default Html;
