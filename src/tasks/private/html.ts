import { MANIFEST } from '../../config/constants';

class HtmlTask extends BalmJS.BalmTask {
  constructor() {
    super('html');

    this.defaultInput = [
      `${BalmJS.config.src.base}/*.html`,
      `${BalmJS.config.src.base}/${MANIFEST}`
    ];
    this.defaultOutput = BalmJS.config.dest.base;
  }

  private _getAssetsPath(type: any): any {
    const from = BalmJS.config.paths.source[type].split('/').pop();
    const to = BalmJS.file.assetsPath(BalmJS.config.paths.target[type]);

    const developmentPublicPath = new RegExp(
      `${BalmJS.config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    const productionPublicPath = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  private _getManifestPath(): any {
    const from = BalmJS.config.paths.source.img.split('/').pop();
    const to = BalmJS.file.assetsPath(BalmJS.config.paths.target.img);

    const developmentPublicPath = new RegExp(`/?${from}`, 'g');
    const productionPublicPath = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(developmentPublicPath, productionPublicPath);
  }

  fn(): void {
    this.init();

    let stream: any = gulp.src(BalmJS.file.absPaths(this.input), {
      allowEmpty: true
    });

    if (BalmJS.config.env.isProd) {
      stream = stream
        .pipe(
          $.useref({
            base: BalmJS.config.workspace,
            searchPath: [
              BalmJS.config.roots.tmp,
              BalmJS.config.roots.source,
              '.'
            ]
          })
        )
        .pipe($.if(/\.html$/, $.htmlmin(BalmJS.config.html.options)))
        .pipe(this._getAssetsPath('css'))
        .pipe(this._getAssetsPath('js'))
        .pipe(this._getAssetsPath('img'))
        .pipe(this._getAssetsPath('media'))
        .pipe($.if(MANIFEST, this._getManifestPath()))
        .pipe(
          $.if(
            MANIFEST && BalmJS.config.assets.cache,
            BalmJS.file.setPublicPath()
          )
        );
    } else {
      stream = stream
        .pipe(this._getAssetsPath('css'))
        .pipe(this._getAssetsPath('js'));
    }

    stream
      .pipe(BalmJS.file.setPublicPath())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default HtmlTask;
