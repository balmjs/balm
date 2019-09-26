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

  private _updateAssetsPath(type: any): any {
    const isManifest: boolean = type === 'manifest';
    const assetsType: string = isManifest ? 'img' : type;
    const from: string = BalmJS.config.paths.source[assetsType]
      .split('/')
      .pop();
    const to: string = BalmJS.file.assetsPath(
      BalmJS.config.paths.target[assetsType]
    );

    const assetsPathSrc = new RegExp(
      isManifest
        ? `/?${from}`
        : `${BalmJS.config.assets.publicUrlPlaceholder}/${from}`,
      'g'
    );
    const assetsPathDest = `${BalmJS.config.assets.publicUrlPlaceholder}/${to}`;

    BalmJS.logger.debug(
      `${this.name} task - assets path`,
      {
        regex: assetsPathSrc,
        replacement: assetsPathDest
      },
      {
        pre: true
      }
    );

    return $.replace(assetsPathSrc, assetsPathDest);
  }

  private _setPublicPath(): any {
    const publicPathSrc = `${BalmJS.config.assets.publicUrlPlaceholder}/`;
    const publicPathDest = BalmJS.file.getPublicPath();

    BalmJS.logger.debug(
      `${this.name} task - public path`,
      {
        regex: publicPathSrc,
        replacement: publicPathDest
      },
      {
        pre: true
      }
    );

    return $.replace(publicPathSrc, publicPathDest);
  }

  fn = (): any => {
    this.init();

    let stream: any = this.src;

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
        .pipe(this._updateAssetsPath('css'))
        .pipe(this._updateAssetsPath('js'))
        .pipe(this._updateAssetsPath('img'))
        .pipe(this._updateAssetsPath('media'))
        .pipe($.if(MANIFEST, this._updateAssetsPath('manifest')));
    } else {
      stream = stream
        .pipe(this._updateAssetsPath('css'))
        .pipe(this._updateAssetsPath('js'));
    }

    return stream
      .pipe(this._setPublicPath())
      .pipe(gulp.dest(BalmJS.file.absPaths(this.output)));
  };
}

export default HtmlTask;
