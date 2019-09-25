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

    const publicPathSrc = new RegExp(
      `${BalmJS.config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    const publicPathDest = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(publicPathSrc, publicPathDest);
  }

  private _getManifestPath(): any {
    const from = BalmJS.config.paths.source.img.split('/').pop();
    const to = BalmJS.file.assetsPath(BalmJS.config.paths.target.img);

    const publicPathSrc = new RegExp(`/?${from}`, 'g');
    const publicPathDest = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    return $.replace(publicPathSrc, publicPathDest);
  }

  private _setPublicPath(): any {
    return $.replace(
      `${BalmJS.config.assets.publicUrlPlaceholder}/`,
      BalmJS.file.getPublicPath()
    );
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
          $.if(MANIFEST && BalmJS.config.assets.cache, this._setPublicPath())
        );
    } else {
      stream = stream
        .pipe(this._getAssetsPath('css'))
        .pipe(this._getAssetsPath('js'));
    }

    stream
      .pipe(this._setPublicPath())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  }
}

export default HtmlTask;
